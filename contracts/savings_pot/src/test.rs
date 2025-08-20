#![cfg(test)]

use super::*;
use soroban_sdk::{
    symbol_short, vec, Address, Env, IntoVal, Symbol, Vec, map,
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
};

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SavingsPot);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 100;

    SavingsPot::init(&env, &contract_id, &creator, &token, &goal);

    let pot = SavingsPot::get_pot(&env, &contract_id);
    assert_eq!(pot.creator, creator);
    assert_eq!(pot.token, token);
    assert_eq!(pot.goal, goal);
    assert_eq!(pot.total_balance, 0);
    assert_eq!(pot.is_unlocked, false);
}

#[test]
fn test_deposit() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SavingsPot);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 100;
    let user = Address::generate(&env);
    let amount = 50;

    SavingsPot::init(&env, &contract_id, &creator, &token, &goal);

    // Mock token transfer (in real scenario, this would be handled by TokenClient)
    SavingsPot::deposit(&env, &contract_id, &user, &amount);

    let pot = SavingsPot::get_pot(&env, &contract_id);
    assert_eq!(pot.total_balance, amount);
    assert_eq!(pot.is_unlocked, false);

    let contribution = SavingsPot::get_contrib(&env, &contract_id, &user);
    assert_eq!(contribution, amount);
}

#[test]
fn test_goal_reached() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SavingsPot);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 100;
    let user = Address::generate(&env);
    let amount = 100;

    SavingsPot::init(&env, &contract_id, &creator, &token, &goal);

    SavingsPot::deposit(&env, &contract_id, &user, &amount);

    let pot = SavingsPot::get_pot(&env, &contract_id);
    assert_eq!(pot.total_balance, goal);
    assert_eq!(pot.is_unlocked, true);
}

#[test]
fn test_withdraw_when_unlocked() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SavingsPot);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 100;
    let user = Address::generate(&env);
    let deposit_amount = 100;
    let withdraw_amount = 50;

    SavingsPot::init(&env, &contract_id, &creator, &token, &goal);

    // Deposit to unlock the pot
    SavingsPot::deposit(&env, &contract_id, &user, &deposit_amount);

    // Withdraw should succeed
    SavingsPot::withdraw(&env, &contract_id, &user, &withdraw_amount);

    let pot = SavingsPot::get_pot(&env, &contract_id);
    assert_eq!(pot.total_balance, goal - withdraw_amount);
}

#[test]
#[should_panic(expected = "PotNotUnlocked")]
fn test_withdraw_when_locked() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SavingsPot);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 100;
    let user = Address::generate(&env);
    let amount = 50;

    SavingsPot::init(&env, &contract_id, &creator, &token, &goal);

    // Deposit but don't reach goal
    SavingsPot::deposit(&env, &contract_id, &user, &amount);

    // Withdraw should fail
    SavingsPot::withdraw(&env, &contract_id, &user, &amount);
}

#[test]
fn test_get_contributors_count() {
    let env = Env::default();
    let contract_id = env.register_contract(None, SavingsPot);
    let creator = Address::generate(&env);
    let token = Address::generate(&env);
    let goal = 100;
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    SavingsPot::init(&env, &contract_id, &creator, &token, &goal);

    SavingsPot::deposit(&env, &contract_id, &user1, &50);
    SavingsPot::deposit(&env, &contract_id, &user2, &50);

    let count = SavingsPot::get_contributors_count(&env, &contract_id);
    assert_eq!(count, 2);
}

