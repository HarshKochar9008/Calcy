#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, Vec, Map, 
    symbol, vec, map, IntoVal, Val, Symbol as SymbolTrait
};
use soroban_token_sdk::TokenClient;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ScholarshipPool {
    pub creator: Address,           // Pool creator/organization
    pub token: Address,             // XLM token address
    pub total_goal: i128,           // Total funding goal
    pub current_balance: i128,      // Current raised amount
    pub is_active: bool,            // Whether pool is accepting donations
    pub max_scholarship_amount: i128, // Maximum amount per scholarship
    pub min_scholarship_amount: i128, // Minimum amount per scholarship
    pub application_deadline: u64,  // Application deadline timestamp
    pub distribution_deadline: u64, // When scholarships will be distributed
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct StudentApplication {
    pub student_address: Address,
    pub name: String,
    pub academic_level: String,     // e.g., "Undergraduate", "Graduate"
    pub field_of_study: String,     // e.g., "Computer Science", "Medicine"
    pub gpa: i128,                  // GPA * 100 (e.g., 350 for 3.5)
    pub financial_need_score: i128, // 1-100 scale
    pub essay_hash: String,         // IPFS hash of essay
    pub is_approved: bool,
    pub scholarship_amount: i128,
    pub application_timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Donor {
    pub address: Address,
    pub total_contributed: i128,
    pub contribution_count: u32,
}

#[contract]
pub struct EduChainScholarships;

const POOL_KEY: Symbol = symbol!("POOL");
const APPLICATIONS_KEY: Symbol = symbol!("APPLICATIONS");
const DONORS_KEY: Symbol = symbol!("DONORS");
const POOL_COUNTER_KEY: Symbol = symbol!("POOL_COUNTER");

#[contractimpl]
impl EduChainScholarships {
    /// Initialize a new scholarship pool
    pub fn init_pool(
        env: &Env, 
        creator: Address, 
        token: Address, 
        total_goal: i128,
        max_scholarship_amount: i128,
        min_scholarship_amount: i128,
        application_deadline: u64,
        distribution_deadline: u64
    ) -> Result<u32, Error> {
        if total_goal <= 0 || max_scholarship_amount <= 0 || min_scholarship_amount <= 0 {
            return Err(Error::InvalidAmount);
        }
        
        if max_scholarship_amount < min_scholarship_amount {
            return Err(Error::InvalidScholarshipRange);
        }
        
        if application_deadline <= env.ledger().timestamp() {
            return Err(Error::InvalidDeadline);
        }
        
        if distribution_deadline <= application_deadline {
            return Err(Error::InvalidDeadline);
        }

        let pool_id = Self::get_next_pool_id(env);
        
        let pool = ScholarshipPool {
            creator,
            token,
            total_goal,
            current_balance: 0,
            is_active: true,
            max_scholarship_amount,
            min_scholarship_amount,
            application_deadline,
            distribution_deadline,
        };
        
        env.storage().instance().set(&POOL_KEY, &pool);
        env.storage().instance().set(&APPLICATIONS_KEY, &map![env]);
        env.storage().instance().set(&DONORS_KEY, &map![env]);
        
        Ok(pool_id)
    }

    /// Donate to scholarship pool
    pub fn donate(env: &Env, from: Address, amount: i128) -> Result<(), Error> {
        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let pool = Self::get_pool(env);
        
        if !pool.is_active {
            return Err(Error::PoolNotActive);
        }

        // Transfer tokens from donor to contract
        let token_client = TokenClient::new(env, &pool.token);
        token_client.transfer(&from, &env.current_contract_address(), &amount);

        // Update pool balance
        let mut updated_pool = pool;
        updated_pool.current_balance += amount;
        env.storage().instance().set(&POOL_KEY, &updated_pool);

        // Update donor mapping
        let mut donors: Map<Address, Donor> = env.storage().instance().get(&DONORS_KEY).unwrap_or(map![env]);
        let donor = donors.get(from.clone()).unwrap_or(Donor {
            address: from.clone(),
            total_contributed: 0,
            contribution_count: 0,
        });
        
        let updated_donor = Donor {
            address: from.clone(),
            total_contributed: donor.total_contributed + amount,
            contribution_count: donor.contribution_count + 1,
        };
        
        donors.set(from, updated_donor);
        env.storage().instance().set(&DONORS_KEY, &donors);

        Ok(())
    }

    /// Apply for scholarship
    pub fn apply_for_scholarship(
        env: &Env,
        student: Address,
        name: String,
        academic_level: String,
        field_of_study: String,
        gpa: i128,
        financial_need_score: i128,
        essay_hash: String
    ) -> Result<(), Error> {
        let pool = Self::get_pool(env);
        
        if env.ledger().timestamp() > pool.application_deadline {
            return Err(Error::ApplicationDeadlinePassed);
        }
        
        if gpa < 0 || gpa > 400 || financial_need_score < 1 || financial_need_score > 100 {
            return Err(Error::InvalidApplicationData);
        }

        let applications: Map<Address, StudentApplication> = env.storage().instance().get(&APPLICATIONS_KEY).unwrap_or(map![env]);
        
        // Check if student already applied
        if applications.get(student.clone()).is_some() {
            return Err(Error::AlreadyApplied);
        }

        let application = StudentApplication {
            student_address: student.clone(),
            name,
            academic_level,
            field_of_study,
            gpa,
            financial_need_score,
            essay_hash,
            is_approved: false,
            scholarship_amount: 0,
            application_timestamp: env.ledger().timestamp(),
        };

        let mut updated_applications = applications;
        updated_applications.set(student, application);
        env.storage().instance().set(&APPLICATIONS_KEY, &updated_applications);

        Ok(())
    }

    /// Approve scholarship applications (only pool creator)
    pub fn approve_scholarships(env: &Env, creator: Address) -> Result<(), Error> {
        let pool = Self::get_pool(env);
        
        if pool.creator != creator {
            return Err(Error::Unauthorized);
        }
        
        if env.ledger().timestamp() < pool.application_deadline {
            return Err(Error::ApplicationsStillOpen);
        }

        let applications: Map<Address, StudentApplication> = env.storage().instance().get(&APPLICATIONS_KEY).unwrap_or(map![env]);
        let mut approved_applications = vec![env];
        
        // Collect all applications
        for (student_addr, application) in applications.iter() {
            approved_applications.push_back(application);
        }
        
        // Sort by merit score (GPA + financial need)
        // This is a simplified scoring system
        approved_applications.sort_by(|a, b| {
            let score_a = a.gpa + a.financial_need_score;
            let score_b = b.gpa + b.financial_need_score;
            score_b.cmp(&score_a) // Higher score first
        });

        // Calculate scholarship amounts
        let total_applications = approved_applications.len();
        if total_applications == 0 {
            return Ok(());
        }

        let available_funds = pool.current_balance;
        let scholarship_amount = if available_funds >= pool.max_scholarship_amount * total_applications as i128 {
            pool.max_scholarship_amount
        } else if available_funds >= pool.min_scholarship_amount * total_applications as i128 {
            available_funds / total_applications as i128
        } else {
            pool.min_scholarship_amount
        };

        // Update applications with approved status and amounts
        let mut updated_applications = map![env];
        for application in approved_applications.iter() {
            let mut updated_app = application;
            updated_app.is_approved = true;
            updated_app.scholarship_amount = scholarship_amount;
            updated_applications.set(updated_app.student_address.clone(), updated_app);
        }
        
        env.storage().instance().set(&APPLICATIONS_KEY, &updated_applications);

        Ok(())
    }

    /// Distribute scholarships to approved students
    pub fn distribute_scholarships(env: &Env, creator: Address) -> Result<(), Error> {
        let pool = Self::get_pool(env);
        
        if pool.creator != creator {
            return Err(Error::Unauthorized);
        }
        
        if env.ledger().timestamp() < pool.distribution_deadline {
            return Err(Error::DistributionNotReady);
        }

        let applications: Map<Address, StudentApplication> = env.storage().instance().get(&APPLICATIONS_KEY).unwrap_or(map![env]);
        let token_client = TokenClient::new(env, &pool.token);
        
        let mut total_distributed = 0;
        
        for (student_addr, application) in applications.iter() {
            if application.is_approved && application.scholarship_amount > 0 {
                // Transfer scholarship amount to student
                token_client.transfer(&env.current_contract_address(), &student_addr, &application.scholarship_amount);
                total_distributed += application.scholarship_amount;
            }
        }
        
        // Update pool balance
        let mut updated_pool = pool;
        updated_pool.current_balance -= total_distributed;
        updated_pool.is_active = false; // Close pool after distribution
        env.storage().instance().set(&POOL_KEY, &updated_pool);

        Ok(())
    }

    /// Get current pool state
    pub fn get_pool(env: &Env) -> ScholarshipPool {
        env.storage().instance().get(&POOL_KEY).unwrap()
    }

    /// Get student application
    pub fn get_application(env: &Env, student: Address) -> Option<StudentApplication> {
        let applications: Map<Address, StudentApplication> = env.storage().instance().get(&APPLICATIONS_KEY).unwrap_or(map![env]);
        applications.get(student)
    }

    /// Get all applications
    pub fn get_all_applications(env: &Env) -> Vec<StudentApplication> {
        let applications: Map<Address, StudentApplication> = env.storage().instance().get(&APPLICATIONS_KEY).unwrap_or(map![env]);
        let mut app_vec = vec![env];
        for (_, application) in applications.iter() {
            app_vec.push_back(application);
        }
        app_vec
    }

    /// Get donor information
    pub fn get_donor(env: &Env, donor: Address) -> Option<Donor> {
        let donors: Map<Address, Donor> = env.storage().instance().get(&DONORS_KEY).unwrap_or(map![env]);
        donors.get(donor)
    }

    /// Get pool statistics
    pub fn get_pool_stats(env: &Env) -> (u32, u32, u32) {
        let applications: Map<Address, StudentApplication> = env.storage().instance().get(&APPLICATIONS_KEY).unwrap_or(map![env]);
        let donors: Map<Address, Donor> = env.storage().instance().get(&DONORS_KEY).unwrap_or(map![env]);
        
        let total_applications = applications.len();
        let approved_applications = applications.iter().filter(|(_, app)| app.is_approved).count();
        let total_donors = donors.len();
        
        (total_applications, approved_applications, total_donors)
    }

    /// Get next pool ID
    fn get_next_pool_id(env: &Env) -> u32 {
        let current_id: u32 = env.storage().instance().get(&POOL_COUNTER_KEY).unwrap_or(0);
        let next_id = current_id + 1;
        env.storage().instance().set(&POOL_COUNTER_KEY, &next_id);
        next_id
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Error {
    InvalidAmount,
    InvalidScholarshipRange,
    InvalidDeadline,
    PoolNotActive,
    ApplicationDeadlinePassed,
    InvalidApplicationData,
    AlreadyApplied,
    Unauthorized,
    ApplicationsStillOpen,
    DistributionNotReady,
}

impl soroban_sdk::IntoVal<Env, Val> for Error {
    fn into_val(self, _env: &Env) -> Val {
        match self {
            Error::InvalidAmount => symbol_short!("InvalidAmount").into_val(_env),
            Error::InvalidScholarshipRange => symbol_short!("InvalidScholarshipRange").into_val(_env),
            Error::InvalidDeadline => symbol_short!("InvalidDeadline").into_val(_env),
            Error::PoolNotActive => symbol_short!("PoolNotActive").into_val(_env),
            Error::ApplicationDeadlinePassed => symbol_short!("ApplicationDeadlinePassed").into_val(_env),
            Error::InvalidApplicationData => symbol_short!("InvalidApplicationData").into_val(_env),
            Error::AlreadyApplied => symbol_short!("AlreadyApplied").into_val(_env),
            Error::Unauthorized => symbol_short!("Unauthorized").into_val(_env),
            Error::ApplicationsStillOpen => symbol_short!("ApplicationsStillOpen").into_val(_env),
            Error::DistributionNotReady => symbol_short!("DistributionNotReady").into_val(_env),
        }
    }
}

#[cfg(test)]
mod test;
