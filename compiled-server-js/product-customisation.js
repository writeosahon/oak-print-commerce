
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

        // check the user cart in a different event block
        window.setTimeout(utopiasoftware_getUsage, 0);
        return
    }
});

/**
 * method is used to handle the receipt of messages from the mobile app
 *
 * @param receiveEvent {Event} this is the event object of the "Message" event
 *
 */
function utopiasoftware_receiveMessage(receiveEvent){
}


/**
 * method is used to set the currently logged in user
 *
 * @param usageKey {String} authorisation key for the current user
 *
 * @returns {Promise<any>}
 */
function utopiasoftware_getUsage(){

    // return a Promise object which resolves when the process of setting usage is done
    return new Promise(function(resolve, reject){
        Promise.resolve($.ajax(
            {
                url: "https://shopoakexclusive.com/wp-json/wc/v2/cart",
                type: "get",
                contentType: "application/json",
                beforeSend: function(jqxhr) {
                    jqxhr.setRequestHeader("Authorization", "Basic " + usageKey);
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                timeout: 240000, // wait for 4 minutes before timeout of request
                processData: false
            }
        )).
        then(function(serverData){
            // post message to app that site is loaded
            window.parent.postMessage(JSON.stringify(serverData), "*");

        }).
        catch(function(err){
            console.log("SERVER ERROR", err);
        });
    });
}