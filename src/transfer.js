var StellarSdk = require("stellar-sdk");
var server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

var sourceKeys = StellarSdk.Keypair.fromSecret(
  "SA2INPQH3H3NA4JIK4FV5DJGGSKWIF6OMZQVGMX44OCSLSOG7H75M7BF" // Kaynak hesabın secret key'i
);
var destinationId = "GCBB6P6WZEIOJL2ZR4WQEN7OAM47W7LTS5HSOPCSZLBAG3SOQOAMHEST"; // Hedef hesabın public key'i

var transaction;
var memoText = "Test Transfer!"; // Memo mesajı 28 karakterden kısa

// İlk olarak hedef hesabın var olup olmadığını kontrol ediyoruz.
server
  .loadAccount(destinationId)
  .catch(function (error) {
    if (error instanceof StellarSdk.NotFoundError) {
      throw new Error("Hedef hesap bulunamadı!");
    } else return error;
  })
  // Eğer hata yoksa, kaynak hesap bilgilerini yüklüyoruz.
  .then(function () {
    return server.loadAccount(sourceKeys.publicKey());
  })
  .then(function (sourceAccount) {
    // İşlem oluşturuyoruz.
    transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationId,
          asset: StellarSdk.Asset.native(),
          amount: "10", // Gönderilecek miktar
        })
      )
      .addMemo(StellarSdk.Memo.text(memoText)) // Memo ekliyoruz
      .setTimeout(180)
      .build();

    // İşlemi imzalıyoruz.
    transaction.sign(sourceKeys);

    // İşlemi gönderiyoruz.
    return server.submitTransaction(transaction);
  })
  .then(function (result) {
    console.log("Başarılı! Sonuç:", result);
  })
  .catch(function (error) {
    console.error("Bir hata oluştu!", error);
  });
