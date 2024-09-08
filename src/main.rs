#![no_std]
#![no_main]
use soroban_sdk::{contract, contractimpl, vec, symbol_short, BytesN, Env, Symbol, Vec};

#[contract]
pub struct PaymentContract;

#[contractimpl]
impl PaymentContract {
    // Hello fonksiyonu
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }

    // Transfer bilgilerini hesaplayıp döndüren fonksiyon
    pub fn transfer_info(_env: Env, to: BytesN<32>, amount: i128) -> (BytesN<32>, i128) {
        // Sadece alıcı ve miktarı geri döndürüyoruz, dış dünyada bu bilgilere göre transfer yapılacak
        (to, amount)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{symbol_short, Env, BytesN};

    #[test]
    fn test_hello() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PaymentContract);
        let client = PaymentContractClient::new(&env, &contract_id);

        let words = client.hello(&symbol_short!("Dev"));

        assert_eq!(words, vec![&env, symbol_short!("Hello"), symbol_short!("Dev")]);
    }

    #[test]
    fn test_transfer_info() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PaymentContract);
        let client = PaymentContractClient::new(&env, &contract_id);

        // Sahte alıcı adresi
        let to = BytesN::from_array(&env, &[0; 32]);
        let amount: i128 = 1000; // Gönderilecek miktar

        // Transfer bilgilerini geri döndürüyoruz
        let info = client.transfer_info(&to, &amount);

        assert_eq!(info, (to, amount));
    }
}
