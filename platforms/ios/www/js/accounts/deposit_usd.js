    // var stripe = Stripe('pk_test_Oi9Fqsc8knEoEPMoI88txA57');
    // var elements = stripe.elements();
    //
    // var card = elements.create('card', {
    //     hidePostalCode: true,
    //
    //   style: {
    //     base: {
    //       iconColor: '#666EE8',
    //       color: '#31325F',
    //       lineHeight: '40px',
    //       fontWeight: 300,
    //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //       fontSize: '15px',
    //
    //       '::placeholder': {
    //         color: '#CFD7E0',
    //       },
    //     },
    //   }
    // });
    // card.mount('#card-element');
    //
    //
    //
    // function setOutcome(result) {
    //
    //   var modal_window = $("#refund_usd_modal");
    //   var successElement = modal_window.find('.success');
    //   var errorElement = modal_window.find('.error');
    //   successElement.removeClass('visible');
    //   errorElement.removeClass('visible');
    //   if (result.token) {
    //     successElement.addClass('visible');
    //
    //     $.post("{% url 'exchange:refill_using_stripe' %}",
    //         {
    //             amount: modal_window.find("input[name=usd_amount]").val(),
    //             wallet_id: modal_window.data("wallet_id"),
    //             token:result.token.id,
    //             csrfmiddlewaretoken: '{{ csrf_token }}',
    //         }, function (result) {
    //                  modal_window.modal('hide');
    //                  loadAccounts();
    //                 if (result.data.amount){
    //                 }
    //             }
    //         )
    //   } else if (result.error) {
    //     errorElement.text = result.error.message;
    //     errorElement.addClass('visible');
    //   }
    // }
    //
    // card.on('change', function(event) {
    //   setOutcome(event);
    // });
    //
    //
    // $(document).ready(function(){
    //     var stripe_refund_form = $("form#stripe_refund_form");
    //         stripe_refund_form.on("submit", function(e) {
    //         e.preventDefault();
    //         var form = stripe_refund_form;//document.querySelector('form #stripe_refund_form');
    //         var extraDetails = {
    //           };
    //         stripe.createToken(card, extraDetails).then(setOutcome);
    //     });
    // });
    //
    //
