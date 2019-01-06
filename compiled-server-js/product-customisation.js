
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
function utopiasoftware_setUsage(usageKey){

    // return a Promise object which resolves when the process of setting usage is done
    return new Promise(function(resolve, reject){
        Promise.resolve($.ajax(
            {
                url: "https://shopoakexclusive.com/wp-json/wc/v2/cart/add",
                type: "post",
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
                processData: false,
                data: {}
            }
        )).
        then(function(serverData){
            resolve(serverData);

            window.setTimeout(function(){
                window.location.reload(true);
            }, 0);
        }).
        catch(function(err){
            resolve(err);

            /*window.setTimeout(function(){
                window.location.reload(true);
            }, 0);*/
        });
    });
}