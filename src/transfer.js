var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);
var sourceKeys = StellarSdk.Keypair.fromSecret(
  "SA2INPQH3H3NA4JIK4FV5DJGGSKWIF6OMZQVGMX44OCSLSOG7H75M7BF"
); // Buraya kendi secret key'ini yaz
var destinationId = "GCBB6P6WZEIOJL2ZR4WQEN7OAM47W7LTS5HSOPCSZLBAG3SOQOAMHEST"; // Buraya hedef public key'i yaz

// İlk olarak hedef hesabın mevcut olup olmadığını kontrol ediyoruz
server
  .loadAccount(destinationId)
  .catch(function (error) {
    if (error instanceof StellarSdk.NotFoundError) {
      throw new Error("The destination account does not exist!");
    } else return error;
  })
  .then(function () {
    return server.loadAccount(sourceKeys.publicKey());
  })
  .then(function (sourceAccount) {
    // İşlem oluşturuluyor
    var transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationId,
          asset: StellarSdk.Asset.native(),
          amount: "10", // Gönderilecek XLM miktarı
        })
      )
      .addMemo(StellarSdk.Memo.text("Test Transaction")) // Memo ekliyoruz
      .setTimeout(180)
      .build();
    
    // İşlemi imzalıyoruz
    transaction.sign(sourceKeys);

    // İşlemi Stellar ağına gönderiyoruz
    return server.submitTransaction(transaction);
  })
  .then(function (result) {
    console.log("Success! Results:", result);
  })
  .catch(function (error) {
    console.error("Something went wrong!", error);
  });
