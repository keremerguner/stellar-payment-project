var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");

var sourceKeys = StellarSdk.Keypair.fromSecret(
  "SA2INPQH3H3NA4JIK4FV5DJGGSKWIF6OMZQVGMX44OCSLSOG7H75M7BF" // Gönderici hesabın secret key'i
);

// Alıcılara ait public key'ler ve gönderilecek miktar
var recipients = [
  { destination: "GCBB6P6WZEIOJL2ZR4WQEN7OAM47W7LTS5HSOPCSZLBAG3SOQOAMHEST", amount: "10" },
  { destination: "GAPQWWZU32FLM75KYM6QR2WNLYCTDDYRTRWZQQ3MTRBAA7BVGUFRARVT", amount: "5" }
];

// Transaction başlatmak için gönderici hesabının bilgilerini alıyoruz
server
  .loadAccount(sourceKeys.publicKey())
  .then(function (sourceAccount) {
    let transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    });

    // Her alıcıya ödeme yapmak için birer ödeme operasyonu ekliyoruz
    recipients.forEach(function (recipient) {
      transaction = transaction.addOperation(
        StellarSdk.Operation.payment({
          destination: recipient.destination,
          asset: StellarSdk.Asset.native(), // XLM göndermek için native asset kullanılır
          amount: recipient.amount,
        })
      );
    });

    // Memo ekliyoruz (isteğe bağlı)
    transaction = transaction.addMemo(StellarSdk.Memo.text("Multi Transfer"));
    
    // İşlemi tamamla
    transaction = transaction.setTimeout(180).build();

    // Gönderici hesabı ile imzala
    transaction.sign(sourceKeys);

    // İşlemi Stellar ağına gönder
    return server.submitTransaction(transaction);
  })
  .then(function (result) {
    console.log("Başarılı! Sonuç:", result);
  })
  .catch(function (error) {
    console.error("Bir hata oluştu:", error);
  });
