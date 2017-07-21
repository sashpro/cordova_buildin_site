var currencyCourses = [];
var wallets = [];
var currency_from;
var currency_to;
var result_to = 0;
var wallet_from;
var wallet_to;
var currencies_list = [];
var new_wallet_currency;
var PaymentSystem = {
    STRIPE: 'STRIPE',
    PAYPAL: 'PAYPAL',
    BANKCARD: 'BANKCARD',
    FARGOCOIN:'FRGC'
};

// localStorage.setItem("PaymentSystem",PaymentSystem);

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function openTab(tabName, tabcontent, tablinks) {
    // Declare all variables
    var i, tabcontent, tablinks;
    var name = tabcontent;

    // Get all elements with class="tabcontent" and hide them
    // t_page = document.getElementById("title_page");
    tabcontent = document.getElementsByClassName(tabcontent);

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName(tablinks);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
}

function getRefundDataBTC(item){
    transactionId = $("#btc-refund-transaction-id").val();
    publicKey = $("#btc-refund-public-key").val();
    $modalWindow = $("#refund_btc_modal");
    walletId = $modalWindow.data("wallet_id");
    refundBitcoin(transactionId, publicKey, walletId);
}

function getWithdrawDataBTC(item){
    withdrawAmount = $("#btc-withdraw-amount").val();
    publicKey = $("#btc-withdraw-public-key").val();
    $modalWindow = $("#withdraw_btc_modal");
    walletId = $modalWindow.data("wallet_id");
    withdrawBitcoin(withdrawAmount, publicKey, walletId);
}

function loadCurrencies(){
    $.ajax({
            url: "/wallet/get_currency/",
            dataType: "json",
            success: function(data) {
            total_html = "";
                data.forEach(function(elem, index){
                currencies_list.push({
                    pk: elem.pk,
                    name: elem.currency_name
                })
                 selected = "";
                 if (index == 0){
                    $("#select-currency-btn").html("<span class=\"name\">" + elem.currency_name + "</span>");
                    selected = " selected";

                 }
                 li = "<li><a href=\"#\" class=\"coinbase-crypto-account" + selected + "\" data-label=\""
                 + elem.currency_name + "\"data-value=\"" + elem.pk + "\">"
                 + elem.currency_name + "</a></li>";
                 total_html += li;
                });
               console.log(currencies_list);
               setButtonHtml($("#currency-dropdown-button"), currencies_list[0].name + "<span class=\"caret\">");
               new_wallet_currency = currencies_list[0].pk;
               $(".create-currencies-list").html(total_html);
               console.log(total_html);
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
}

function loadPage(name){
    openTab(name, "tabcontent", "tablinks");
    switch (name){
        case 'accounts':
                loadAllWalletsData(showWallets);
                loadCurrencies();
            break;
        case 'title_page':

            break;
        case 'settings':

            break;
    }
}

function loadAccounts(){
    loadPage("accounts");
    // openTab("accounts", "tabcontent", "tablinks");
    // loadAllWalletsData(showWallets);
    // loadCurrencies();
}

function loadMain(){
    loadPage("title_page");
    // openTab("title_page", "tabcontent", "tablinks");
}

function loadWalletsToSendRequest(){
    total_html = "";
    wallets.forEach(function(elem, index){
        if (elem.currency.short_name != "USD"){
            return true;
        }
        var selected = "";
        if (elem.default == true){
            selected = " selected";
            $currentA = $(".selector");
            $currentA.attr("data-currency", elem.currency.short_name);
            $currentA.attr("data-value", elem.pk);
            $($currentA).find(".name").html(elem.name);
            $($currentA).find(".balance").html(elem.amount + " " + elem.currency.short_name);
        }
        var li = "<li><a href=\"#\" class=\"coinbase-crypto-account" + selected + "\"" +
                   "data-label=\"" + elem.name + "\" data-type=\"coinbase-crypto-account\"" +
                   "data-value=\"" + elem.pk + "\" data-currency=\"" + elem.currency.short_name + "\">"
                     + elem.name + "<span class=\"balance\">" + elem.amount + "</span></a></li>";
//        li = "<li id_currency=\"" + elem.currency.pk + "\" id_wallet=\"" + elem.pk + "\" class=\"send-wallet-elem\"><a>"
//        + elem.name + " | " + elem.currency.short_name + "</a></li>";
        total_html += li;
    });

    $(".send-from-wallets").html(total_html);
}

function addWalletToLists(walletResponse){
    console.log(walletResponse);
    if (walletResponse.default == true){
            status = "Primary";
            setButtonHtml($("#send-dropdown-button"), walletResponse.name + " | " + walletResponse.currency.short_name + "<span class=\"caret\">");
            wallet_from = walletResponse.pk;
            wallet_to = walletResponse.pk;
            primary_status = "<td class = \"clickable labels\"><a href=\"\"><span class = \"label label-info\">Primary</span></a></td>"
//            $("#send-dropdown-button").text(li);
        } else {
            setPrimaryOption = "<li><a href=\"#\" class=\"setAsPrimary\">Set as Primary</a></li>";
            status = "";
            primary_status = "";
        }
    input_li = "<li id_currency=\"" + walletResponse.currency.pk + "\" id_wallet=\"" + walletResponse.pk
     + "\" class=\"input_wallet_elem\"><a>" + walletResponse.name + " | " + walletResponse.currency.short_name + "</a></li>";
    output_li = "<li id_currency=\"" + walletResponse.currency.pk + "\" id_wallet=\"" + walletResponse.pk
    + "\" class=\"output_wallet_elem\"><a>" + walletResponse.name + " | " + walletResponse.currency.short_name + "</a></li>";
    status = "";
    if (walletResponse.default == true){
            status = "Active";
        }
    user_list_li = "<tr class=\"account_row\" wallet-id = \"" + walletResponse.pk + "\" currency-id =\"" + walletResponse.currency.pk + "\"><td class=\"clickable type\">"
          + "<i class=\"collapsible wallet individual-account btc\"></i></td>" +
          "<td class=\"clickable name\">" + walletResponse.name +"</td>" +
          "<td class=\"clickable balance\"><span class=\"balance-btc\">"+
          "<span class=\"full\">" + walletResponse.amount + " " + walletResponse.currency.short_name + "</span></span></td>" +
         "<td class=\"clickable activity\">Not used</td>" +
                            "<td class=\"clickable labels\"><span class=\"label label-info\">" +
                            status + "</span></td>" +
         "<td class=\"settings\"><ul>" +
         "<li><a href=\"#\" data-currency=\"" + walletResponse.currency.short_name + "\" data-wallet_id = \"" + walletResponse.pk+"\" class=\"refund-button\" onclick=\"load_refund_modal(this);\">Deposit</a></li>"
         + "<li><a href=\"#\"  class=\"withdraw-button\" data-currency=\"" + walletResponse.currency.short_name + "\" data-wallet_id = \"" + walletResponse.pk+"\" onclick=\"load_withdraw_modal(this);\">Withdraw</a></li>"
         + "<li><a href=\"#\" class=\"rename\">Rename</a></li>" + setPrimaryOption +
                                    // "<li><a href=\"#\" class=\"muted\"" +
                                    //        "data-remote=\"true\" data-method=\"get\">Wallet refill</a>" +
                                    // "</li>" +
             "</ul></td>"  + "</tr>";

    $(".wallets_list").append(user_list_li);
    $(".wallet_from_list").append(input_li);
    $(".wallet_to_list").append(output_li);
}

function showWallets(){
    total_html = "";
    total_input_ul = "";
    total_output_ul = "";
    wallets.forEach(function(elem, index){
    input_li = "<li id_currency=\"" + elem.currency.pk + "\" id_wallet=\"" + elem.pk + "\" class=\"input_wallet_elem\"><a>" + elem.name + " | " + elem.currency.short_name + "</a></li>";
    output_li = "<li id_currency=\"" + elem.currency.pk + "\" id_wallet=\"" + elem.pk + "\" class=\"output_wallet_elem\"><a>" + elem.name + " | " + elem.currency.short_name + "</a></li>";
        setPrimaryOption = "";
        if (elem.default == true){
            status = "Primary";
            setButtonHtml($("#send-dropdown-button"), elem.name + " | " + elem.currency.short_name + "<span class=\"caret\">");
            wallet_from = elem.pk;
            wallet_to = elem.pk;
            primary_status = "<td class = \"clickable labels\"><a href=\"\"><span class = \"label label-info\">Primary</span></a></td>"
//            $("#send-dropdown-button").text(li);
        } else {
            setPrimaryOption = "<li><a href=\"#\" class=\"setAsPrimary\">Set as Primary</a></li>";
            status = "";
            primary_status = "";
        }

         total_html += "<tr class=\"account_row\" wallet-id = \"" + elem.pk + "\" currency-id =\"" + elem.currency.pk + "\"><td class=\"clickable type\">"
          + "<i class=\"collapsible wallet individual-account btc\"></i></td>" +
          "<td class=\"clickable name\">" + elem.name +"</td>" +
          "<td class=\"clickable balance\"><span class=\"balance-btc\">"+
          "<span class=\"full\">" + elem.amount + " " + elem.currency.short_name + "</span></span></td>" +
         "<td class=\"clickable activity\">Not used</td>" +
                            "<td class=\"clickable labels\"><span class=\"label label-info\">" +
                            status + "</span></td>" +
         "<td class=\"settings\"><ul>" +
         "<li><a href=\"#\" data-currency=\"" + elem.currency.short_name + "\" data-wallet_id = \"" + elem.pk+"\" class=\"refund-button\" onclick=\"load_refund_modal(this);\">Deposit</a></li>"
         + "<li><a href=\"#\"  class=\"withdraw-button\" data-currency=\"" + elem.currency.short_name + "\" data-wallet_id = \"" + elem.pk+"\" onclick=\"load_withdraw_modal(this);\">Withdraw</a></li>"
         + "<li><a href=\"#\" class=\"rename\">Rename</a></li>" + setPrimaryOption +
                                    // "<li><a href=\"#\" class=\"muted\"" +
                                    //        "data-remote=\"true\" data-method=\"get\">Wallet refill</a>" +
                                    // "</li>" +
             "</ul></td>"  + "</tr>";


         total_input_ul += input_li;
         total_output_ul += output_li;
    });

    $(".wallets_list").html(total_html);
    $(".wallet_from_list").html(total_input_ul);
    $(".wallet_to_list").html(total_output_ul);
}

function load_refund_modal(item) {
    var refund_currency = $(item).attr('data-currency');
    var modal;
    switch(refund_currency){
        case "USD":
            modal = $('#refund_usd_modal');
            break;
        case "BTC":
            modal = $('#refund_btc_modal');
            break;
    }
//    alert($(item).attr("class"));

    modal.data('wallet_id',$(item).data('wallet_id'));
    modal.modal({
        show: 'true'
    });
}

function load_withdraw_modal(item) {
    var refund_currency = $(item).attr("data-currency");
    var modal;
    switch(refund_currency){
        case "USD":
            modal = $("#withdraw_usd_modal");
            break;
        case "BTC":
            modal = $("#withdraw_btc_modal");
            break;
        case "FRGC":
            modal = $("#withdraw_frgc_modal");
            break;
    }
//    alert($(item).attr("class"));

    modal.data('wallet_id',$(item).data('wallet_id'));
    modal.modal({
        show: 'true'
    });

}

function loadAllWalletsData(handle_function){
        $.ajax({
            url: "/wallet/get_all",
            dataType: "json",
            success: function(data) {
            wallets = data;
            handle_function();
            },
            error: function(xhr, status, error) {
                console.log(error, status, xhr);
            }
        });
}

function loadCourses(){
    $.ajax({
        url: "/exchange/get_courses/",
        dataType: "json",
        success: function(data) {
            console.log(data);
            data.forEach(function(elem){
                course = {
                    from: elem.currency_from.pk,
                    to: elem.currency_to.pk,
                    rate: elem.exchange_rate
                }
                currencyCourses.push(course);
            });

          },
        error: function(xhr, status, error) {
            console.log(error, status, xhr);
        }
    });
}

function calculateReceivedCurrency(input_value, rate){
    return input_value * rate;
}

function loadBuySell(){
    openTab("b_s", "tabcontent", "tablinks");
    loadAllWalletsData(showWallets);
    loadCourses();
    loadCurrencies();
}

function loadSendTab(){
    openTab('send_tab', 'sr_tabcontent', 'tablinks');
    loadAllWalletsData(loadWalletsToSendRequest);
};

function loadRequestTab(){
    openTab('request_tab', 'sr_tabcontent', 'tablinks');
    loadAllWalletsData(loadWalletsToSendRequest);
};

function loadSendRequest(){
    openTab('s_r', 'tabcontent', 'tablinks');
    openTab('send_tab', 'sr_tabcontent', 'tablinks');
    loadAllWalletsData(loadWalletsToSendRequest);
}


$(document).ready(function() {
    loadAccounts();
//    loadSendRequest();
//    openTab("s_r", "sr_tabcontent", "tablinks");
});

function setButtonHtml(button, text){
    button.html(text);
}

function findRate(currencyFrom, currencyTo){
    return 1.5;
}

function updateResultTo(result){
        $("#received_amount").attr("value", result);
}

function setPrimaryWallet(wallet_id){


}

function onInputUpdate(){
    currency_from = $(this).attr("id_currency");
    input_currency_value = $("#currency_spend").val();
    rate = findRate(currency_from, currency_to);
    result_to = calculateReceivedCurrency(input_currency_value, rate);
    updateResultTo(result_to);
}

$(document).on('click', '.input_wallet_elem', function(){
    currency_from = $(this).attr("id_currency");
    input_currency_value = $("#currency_spend").val();
    rate = findRate(currency_from, currency_to);
    result_to = calculateReceivedCurrency(input_currency_value, rate);
    updateResultTo(result_to);
    wallet_from = parseInt($(this).attr("id_wallet"));
    setButtonHtml($(this).parent().parent().find(".wallet_button"), $(this).text() + "<span class=\"caret\">");
   });

$(document).on('click', '.output_wallet_elem', function(){
    input_currency_value = $("#currency_spend").val();
    currency_to = $(this).attr("id_currency");
    rate = findRate(currency_from, currency_to);
    result_to = calculateReceivedCurrency(input_currency_value, rate);
    updateResultTo(result_to);
    wallet_to = parseInt($(this).attr("id_wallet"));
    $(this).parent().parent().find(".wallet_button").html($(this).text() + "<span class=\"caret\">");
   });

$(document).on('click', ".send-wallet-elem", function(){
//    input_currency_value = $("#currency_spend").val();
    wallet_send_request_from = parseInt($(this).attr("id_wallet"));
    $(this).parent().parent().find(".choose-send-wallet-button").html($(this).text() + "<span class=\"caret\">");
});

$(document).on('click', '.create-wallet-currency-elem', function(){
    new_wallet_currency = $(this).attr("id_currency");
//    currency_name = $(this).val();
    setButtonHtml($(this).parent().parent().find(".currency_button"), $(this).text() + "<span class=\"caret\">");
   });

$(document).on("input", "#currency_spend", function(){
    currency_from = $(this).attr("id_currency");
    input_currency_value = $("#currency_spend").val();
    rate = findRate(currency_from, currency_to);
    result_to = calculateReceivedCurrency(input_currency_value, rate);
    updateResultTo(result_to);
});

$(document).on("click", "#approve_button", function(){
    makeBuySellTransaction(wallet_from, wallet_to, result_to);
});

$(document).on("click", "#approve-save-wallet", function(){
    wallet_name = $(".new-wallet-name").val();
    if (wallet_name.length <= 0){
        return;
    }
    is_default = $(".createWallet").is(':checked');
    new_wallet_currency = $("a#select-currency-btn").attr("data-value");
    saveWallet(wallet_name, new_wallet_currency, is_default);
    loadAllWalletsData(showWallets);
    loadCurrencies();
});

$(document).on("click", "#make-transfer-button", function(){
    mail = $("#requested-username").val();
    currency_amount = $("#currency-amount").val();
    wallet_send_request_from = $("a.selector").attr("data-value");
    sendTransaction(mail, wallet_send_request_from, currency_amount);
});

$(document).on("click", ".ask-transfer-button", function(){
    mail = $("#asked-username").val();
    currency_amount = $("#request-currency-amount").val();
    sendTransaction(mail, wallet_send_request_from, currency_amount);
});

$(document).on("click", ".gTHKWe a", function(){
   toDel = $(".gTHKWe").find(".active");
   toDel.removeClass("active");
   toDel.removeClass("jAXUQz");
   $(this).find('.Navbar__link').addClass("active");
   $(this).find('.Navbar__link').addClass("jAXUQz");
});

$(document).on("click", ".setAsPrimary", function(){
   wallet = $(this).parent().parent().parent().parent().attr("wallet-id");
   currency = $(this).parent().parent().parent().parent().attr("currency-id");
   setPrimaryWallet(wallet, currency);
});

$(document).on("click", ".selector", function(){
    $(this).parent().find("ul").css('display', '');
});

$(document).on("click", ".base-select-container li", function(){
//    alert("Pressed");
    $selectedA = $(this).find("a");
    $(".selected").removeClass("selected");
    $selectedA.addClass("selected")
    label = $selectedA.attr("data-label");
    currency = $selectedA.attr("data-currency");
    balance = $selectedA.find("span").text();
//    alert(label + currency + balance);
    $currentA = $(this).parent().parent().find(".selector");
    $currentA.attr("data-currency", currency);
    $currentA.attr("data-value", $selectedA.attr("data-value"));
    $($currentA).find(".name").html(label);
    $($currentA).find(".balance").html(balance + " " + currency);
//    alert($currentA.attr("data-currency"))
    current_style = $(".base-select-container").find("ul").attr("style");
    current_style += "display: none;"
    $(".base-select-container").find("ul").attr("style", current_style);
//    $(".base-select-container").find("ul").css('display', 'none');/\
});


