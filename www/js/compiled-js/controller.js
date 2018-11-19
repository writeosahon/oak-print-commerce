/**
 * Created by UTOPIA SOFTWARE on 18/11/2018.
 */

/**
* file defines all View-Models, Controllers and Event Listeners used by the app
*
* The 'utopiasoftware_app_namespace' namespace variable has being defined in the base js file.
* The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
* also used interchangeably
*/

// define the controller namespace
utopiasoftware[utopiasoftware_app_namespace].controller = {

    /**
     * method contains the startup/bootstrap code needed to initiate app logic execution
     */
    startup: function(){

        // initialise the app libraries and plugins
        ons.ready(async function () {
            // set the default handler for the app
            ons.setDefaultDeviceBackButtonListener(function(){
                // does nothing for now!!
            });

            // displaying prepping message
            $('#loader-modal-message').html("Loading App...");
            $('#loader-modal').get(0).show(); // show loader

            if(true){ // there is a previous logged in user
                // load the app main page
                $('ons-splitter').get(0).content.load("app-main-template");

            }
            else{ // there is no previously logged in user
                // load the login page
                $('ons-splitter').get(0).content.load("login-template");
            }

            // START ALL CORDOVA PLUGINS CONFIGURATIONS
            try{
                // lock the orientation of the device to 'PORTRAIT'
                screen.orientation.lock('portrait');
            }
            catch(err){}


            try { // START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                // create the pouchdb app database
                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase = new PouchDB('PrintServiceEcommerce.db', {
                    adapter: 'cordova-sqlite',
                    location: 'default',
                    androidDatabaseImplementation: 2
                });

                // create the encrypted pouchdb app database
                utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase =
                    new PouchDB('PrintServiceEcommerceEncrypted.db', {
                    adapter: 'cordova-sqlite',
                    location: 'default',
                    androidDatabaseImplementation: 2
                });

                // generate a password for encrypting the app database (if it does NOT already exist)
                if(!window.localStorage.getItem("utopiasoftware-oak-print-service-rid") ||
                    window.localStorage.getItem("utopiasoftware-oak-print-service-rid") === "") {
                    window.localStorage.setItem("utopiasoftware-oak-print-service-rid",
                        Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine));
                }
                // enable the db encryption using the generated password
                await new Promise(function(resolve, reject){
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase.
                    crypto(window.localStorage.getItem("utopiasoftware-oak-print-service-rid"), {
                        ignore: ['_attachments', '_deleted'],
                        cb: function(err, key){
                            if(err){ // there is an error
                                reject(err); // reject Promise
                            }
                            else{ // no error
                                resolve(key); // resolve Promise
                            }
                        }});
                });

            }
            catch(err){
                console.log("APP LOADING ERROR", err);
            }
            finally{
                // set status bar color
                StatusBar.backgroundColorByHexString("#363E7C");
                navigator.splashscreen.hide(); // hide the splashscreen
                utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fully loaded and ready
                $('#loader-modal').get(0).hide(); // show loader
            }

        }); // end of ons.ready()

    }
};