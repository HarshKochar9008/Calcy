#![cfg(test)]

use super::*;
use soroban_sdk::{
    Address, Env, String,
    testutils::Address as _,
};

#[test]
fn test_init_dummy_data() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EduChainScholarships);
    
    // Initialize with dummy data
    env.as_contract(&contract_id, || {
        EduChainScholarships::init_dummy_data(&env).unwrap();
        
        // Check if dummy data is initialized
        assert!(EduChainScholarships::is_dummy_data_initialized(&env));
        
        // Get the pool and verify it has 10,000 XLM goal
        let pool = EduChainScholarships::get_pool(&env).unwrap();
        assert_eq!(pool.total_goal, 100_000_000_000); // 10,000 XLM in stroops
        assert_eq!(pool.max_scholarship_amount, 1_000_000_000); // 100 XLM
        assert_eq!(pool.min_scholarship_amount, 100_000_000); // 10 XLM
        assert_eq!(pool.current_balance, 0);
        assert_eq!(pool.is_active, true);
        
        // Try to initialize again - should fail
        let result = EduChainScholarships::init_dummy_data(&env);
        assert!(result.is_err());
    });
}

#[test]
fn test_init_pool() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EduChainScholarships);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let total_goal = 100_000_000; // 10 XLM in stroops
    let max_scholarship = 20_000_000; // 2 XLM in stroops
    let min_scholarship = 10_000_000; // 1 XLM in stroops
    let app_deadline = env.ledger().timestamp() + 30 * 24 * 60 * 60; // 30 days from now
    let dist_deadline = app_deadline + 24 * 60 * 60; // 1 day after app deadline

    let pool_id = env.as_contract(&contract_id, || {
        EduChainScholarships::init_pool(
            &env,
            creator.clone(),
            token.clone(),
            total_goal,
            max_scholarship,
            min_scholarship,
            app_deadline,
            dist_deadline,
        ).unwrap()
    });

    assert_eq!(pool_id, 1);

    let pool = env.as_contract(&contract_id, || {
        EduChainScholarships::get_pool(&env).unwrap()
    });
    assert_eq!(pool.creator, creator);
    assert_eq!(pool.token, token);
    assert_eq!(pool.total_goal, total_goal);
    assert_eq!(pool.current_balance, 0);
    assert_eq!(pool.is_active, true);
    assert_eq!(pool.max_scholarship_amount, max_scholarship);
    assert_eq!(pool.min_scholarship_amount, min_scholarship);
    assert_eq!(pool.application_deadline, app_deadline);
    assert_eq!(pool.distribution_deadline, dist_deadline);
}

#[test]
fn test_apply_for_scholarship() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EduChainScholarships);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let total_goal = 100_000_000;
    let max_scholarship = 20_000_000;
    let min_scholarship = 10_000_000;
    let app_deadline = env.ledger().timestamp() + 30 * 24 * 60 * 60;
    let dist_deadline = app_deadline + 24 * 60 * 60;

    env.as_contract(&contract_id, || {
        EduChainScholarships::init_pool(
            &env,
            creator,
            token,
            total_goal,
            max_scholarship,
            min_scholarship,
            app_deadline,
            dist_deadline,
        ).unwrap();
    });

    let student = Address::generate(&env);
    let name = String::from_str(&env, "John Doe");
    let academic_level = String::from_str(&env, "Undergraduate");
    let field_of_study = String::from_str(&env, "Computer Science");
    let gpa = 350; // 3.5 GPA * 100
    let financial_need_score = 75;
    let essay_hash = String::from_str(&env, "QmHash123456789");

    env.as_contract(&contract_id, || {
        EduChainScholarships::apply_for_scholarship(
            &env,
            student.clone(),
            name.clone(),
            academic_level.clone(),
            field_of_study.clone(),
            gpa,
            financial_need_score,
            essay_hash.clone(),
        ).unwrap();
    });

    let application = env.as_contract(&contract_id, || {
        EduChainScholarships::get_application(&env, student.clone()).unwrap()
    });
    assert_eq!(application.student_address, student);
    assert_eq!(application.name, name);
    assert_eq!(application.academic_level, academic_level);
    assert_eq!(application.field_of_study, field_of_study);
    assert_eq!(application.gpa, gpa);
    assert_eq!(application.financial_need_score, financial_need_score);
    assert_eq!(application.essay_hash, essay_hash);
    assert_eq!(application.is_approved, false);
    assert_eq!(application.scholarship_amount, 0);
}

#[test]
fn test_pool_stats() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EduChainScholarships);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let total_goal = 100_000_000;
    let max_scholarship = 20_000_000;
    let min_scholarship = 10_000_000;
    let app_deadline = env.ledger().timestamp() + 30 * 24 * 60 * 60;
    let dist_deadline = app_deadline + 24 * 60 * 60;

    env.as_contract(&contract_id, || {
        EduChainScholarships::init_pool(
            &env,
            creator,
            token,
            total_goal,
            max_scholarship,
            min_scholarship,
            app_deadline,
            dist_deadline,
        ).unwrap();
    });

    // Add applications (without donations to avoid token transfer issues)
    let student = Address::generate(&env);
    env.as_contract(&contract_id, || {
        EduChainScholarships::apply_for_scholarship(
            &env,
            student,
            String::from_str(&env, "Charlie"),
            String::from_str(&env, "PhD"),
            String::from_str(&env, "Physics"),
            390,
            85,
            String::from_str(&env, "Hash3"),
        ).unwrap();
    });

    let (total_apps, approved_apps, total_donors) = env.as_contract(&contract_id, || {
        EduChainScholarships::get_pool_stats(&env)
    });
    assert_eq!(total_apps, 1);
    assert_eq!(approved_apps, 0); // Not approved yet
    assert_eq!(total_donors, 0); // No donations in this test
}

#[test]
fn test_invalid_amounts() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EduChainScholarships);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let app_deadline = env.ledger().timestamp() + 30 * 24 * 60 * 60;
    let dist_deadline = app_deadline + 24 * 60 * 60;

    // Test invalid total goal
    let result = env.as_contract(&contract_id, || {
        EduChainScholarships::init_pool(
            &env,
            creator.clone(),
            token.clone(),
            0, // Invalid: zero goal
            20_000_000,
            10_000_000,
            app_deadline,
            dist_deadline,
        )
    });
    assert!(result.is_err());

    // Test invalid scholarship range
    let result = env.as_contract(&contract_id, || {
        EduChainScholarships::init_pool(
            &env,
            creator,
            token,
            100_000_000,
            5_000_000, // Invalid: max < min
            10_000_000,
            app_deadline,
            dist_deadline,
        )
    });
    assert!(result.is_err());
}

#[test]
fn test_invalid_deadlines() {
    let env = Env::default();
    let contract_id = env.register_contract(None, EduChainScholarships);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let current_time = env.ledger().timestamp();

    // Test past application deadline - use a safe past time
    let result = env.as_contract(&contract_id, || {
        EduChainScholarships::init_pool(
            &env,
            creator.clone(),
            token.clone(),
            100_000_000,
            20_000_000,
            10_000_000,
            current_time.saturating_sub(1), // Safe subtraction
            current_time + 30 * 24 * 60 * 60,
        )
    });
    assert!(result.is_err());

    // Test distribution deadline before application deadline
    let result = env.as_contract(&contract_id, || {
        EduChainScholarships::init_pool(
            &env,
            creator,
            token,
            100_000_000,
            20_000_000,
            10_000_000,
            current_time + 30 * 24 * 60 * 60,
            current_time + 20 * 24 * 60 * 60, // Invalid: before app deadline
        )
    });
    assert!(result.is_err());
}

