
/**
 * this script is used to dynamically add the "Continue Shopping" button to the
 * website individual Product page. The button is displayed after a product
 * has been successfully added to the user's cart
 **/

// wait for the entire document to be loaded
jQuery(document).ready(function(){

    // add the "Continue Shopping" button
    jQuery('.woocommerce-message').
    append(`<a href="/shop/" tabindex="2" class="button wc-forward">Continue shopping</a>`);
});