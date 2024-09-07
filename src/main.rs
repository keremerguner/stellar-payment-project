#![no_std]
#![no_main]
use soroban_sdk::{contract, contractimpl, vec, symbol_short, Env, Symbol, Vec};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{symbol_short, Env};

    #[test]
    fn test_hello() {
        let env = Env::default();
        let contract_id = env.register_contract(None, HelloContract);
        let client = HelloContractClient::new(&env, &contract_id);

        let words = client.hello(&symbol_short!("Dev"));

        assert_eq!(words, vec![&env, symbol_short!("Hello"), symbol_short!("Dev")]);
    }
}
