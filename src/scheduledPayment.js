var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

var sourceKeys = StellarSdk.Keypair.fromSecret(
  "SA2INPQH3H3NA4JIK4FV5DJGGSKWIF6OMZQVGMX44OCSLSOG7H75M7BF" // Gönderici hesabın secret key'i
);
var destinationId = "GCBB6P6WZEIOJL2ZR4WQEN7OAM47W7LTS5HSOPCSZLBAG3SOQOAMHEST"; // Hedef hesabın public key'i
var amount = "10"; // Gönderilecek miktar

// setInterval ile düzenli ödemeyi başlatıyoruz
var intervalId = setInterval(function () {
  console.log("Ödeme yapılıyor...");

  server
    .loadAccount(sourceKeys.publicKey())
    .then(function (sourceAccount) {
      let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationId,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .addMemo(StellarSdk.Memo.text("Düzenli Ödeme")) // Memo ekliyoruz
        .setTimeout(180)
        .build();

      transaction.sign(sourceKeys);
      return server.submitTransaction(transaction);
    })
    .then(function (result) {
      console.log("Başarılı! Sonuç:", result);
    })
    .catch(function (error) {
      console.error("Bir hata oluştu:", error);
    });
}, 10000); // 10 saniyede bir ödeme yapılıyor

// 1 dakika (60 saniye) sonra ödemeleri durdurmak için setTimeout kullanıyoruz
setTimeout(function () {
  clearInterval(intervalId); // Zamanlayıcıyı durdur
  console.log("Ödemeler durduruldu.");
}, 60000); // 1 dakika sonra duracak
