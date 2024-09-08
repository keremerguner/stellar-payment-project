var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

var accountId = "GD53B3TLY42POFFN2QWKHFCL2II3UFV6E6NH6DQYIVKN2LJVQ6FEWTEA"; // Geçmişini görmek istediğiniz hesap

server
  .transactions()
  .forAccount(accountId)
  .call()
  .then(function (page) {
    console.log("İşlem geçmişi:");

    page.records.forEach(function (record) {
      console.log("Hash:", record.hash);
      console.log("Başarılı mı:", record.successful);
      console.log("İşlem Zamanı:", record.created_at);
      console.log("İşlem Memo:", record.memo);
      console.log("---------------------------------");
    });
  })
  .catch(function (error) {
    console.error("İşlem geçmişi sorgularken hata oluştu:", error);
  });
