var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

var accountId = "GCBB6P6WZEIOJL2ZR4WQEN7OAM47W7LTS5HSOPCSZLBAG3SOQOAMHEST"; // Bakiye sorgulanacak hesabın public key'i

server
  .loadAccount(accountId)
  .then(function (account) {
    console.log("Bakiye bilgileri:");
    account.balances.forEach(function (balance) {
      console.log("Varlık Tipi:", balance.asset_type, ", Miktar:", balance.balance);
    });
  })
  .catch(function (error) {
    console.error("Bakiye sorgularken hata oluştu:", error);
  });
