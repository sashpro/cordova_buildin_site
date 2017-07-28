var wallet_send_request_from;

function makeBuySellTransaction(from_wallet, to_wallet_currency, currency_amount){
   data = {
       from: from_wallet,
       to: to_wallet_currency,
       amount: currency_amount,
       csrfmiddlewaretoken: getCookie('csrftoken')
   }
   $.ajax({
       url: "/exchange/transaction/inside/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
           console.log(data);
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
}


function saveWallet(wallet_name, new_wallet_currency, is_default){
   data = {
       name: wallet_name,
       currency: new_wallet_currency,
       default: is_default,
       csrfmiddlewaretoken: getCookie('csrftoken')
   }
   $.ajax({
       url: "/wallet/create/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
           console.log(data);
//           addWalletToLists(data);
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
}

function sendTransaction(receiver_email, sender_wallet, currency_amount){
   data = {
       reciepent_email: receiver_email,
       user_wallet: sender_wallet,
       amount: currency_amount,
       csrfmiddlewaretoken: getCookie('csrftoken')
   }
   $.ajax({
       url: "/wallet/send/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
           console.log(data);
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
}

function requestTransaction(sender_email, requester_wallet, currency_amount){
   data = {
       email: sender_email,
       user_wallet: requester_wallet,
       amount: currency_amount,
       csrfmiddlewaretoken: getCookie('csrftoken')
   }
   $.ajax({
       url: "/wallet/request/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
           console.log(data);
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
}

function setPrimaryWallet(wallet_id, currency_id){
   data = {
       currency: currency_id,
       id: wallet_id,
       csrfmiddlewaretoken: getCookie('csrftoken')
   }
   $.ajax({
       url: "/wallet/default/set/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
            console.log(data);
            loadAllWalletsData(showWallets);
//            loadAccounts();
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
}

function refundBitcoin(transactionId, publicKey, walletId){
    data = {
        transaction_id: transactionId,
        public_key: publicKey,
        wallet: walletId,
        csrfmiddlewaretoken: getCookie('csrftoken')
    }
   $.ajax({
       url: "/exchange/request/btc/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
            console.log(data);
            loadAllWalletsData(showWallets);
//            loadAccounts();
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
}

function withdrawBitcoin(btcAmount, publicKey, walletId){
    data = {
        amount: btcAmount,
        public_key: publicKey,
        wallet: walletId,
        csrfmiddlewaretoken: getCookie('csrftoken')
    };
   $.ajax({
       url: "/exchange/withdraw/btc/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
           if (data.error_id)
           {
               // modal_window.find('#error_message').text(data.message);
               alert(data.message);
           }
            console.log(data);
            loadAllWalletsData(showWallets);
//            loadAccounts();
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
}

function withdrawFRGC(form, wallet_id){

    // event.preventDefault();
    var data ={}
    $(form).serializeArray().map(function(x){data[x['name']] = x['value'];});
    if ((data.frgc_address == '') || (data.amount<=0))
        return false;
    data.wallet_id = wallet_id;
    data.csrfmiddlewaretoken = getCookie('csrftoken');
    data.payment_system = PaymentSystem.FARGOCOIN;
    console.log(data);
    var modal_window = $("#withdraw_frgc_modal");

   $.ajax({
       url: "/wallet/withdraw/",
       type: "POST",
       dataType: "json",
       data: data,
       success: function(data) {
           if (data.error_id)
           {
               // modal_window.find('#error_message').text(data.message);
               alert(data.message);
           }
            // console.log(data);
            loadAllWalletsData(showWallets);
            modal_window.modal('hide');
//            loadAccounts();
       },
       error: function(xhr, status, error) {
           console.log(error, status, xhr);
       }
   });
    return false;
}


