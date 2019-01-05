
// register a listener for receiving messages from the mobile app
window.addEventListener("message", utopiasoftware_receiveMessage, false);

// wait for the entire document to be loaded
jQuery(document).ready(function(){

    // check if the site is being accessed from an iframe
    if(window !== window.parent){ // page is being accessed from an iframe
        // add the utopiasoftware-mobile class to the HTML tag
        jQuery('html').addClass("utopiasoftware-mobile");
    }

    // check if the utopiasoftware-mobile class is set
    if(jQuery('html').hasClass('utopiasoftware-mobile') === true){ // class has been set
        // post message to app that site is loaded
        window.parent.postMessage("page ready", "*");
        return
    }
});

/**
 * method is used to handle the receipt of messages from the mobile app
 *
 * @param receiveEvent {Event} this is the event object of the "Message" event
 *
 * @returns {Promise<void>}
 */
async function dutopiasoftware_receiveMessage(receiveEvent){

}