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

    },

    /**
     * this is the view-model/controller for the Home page
     */
    homePageViewModel: {


        /**
         * event is triggered when page is initialised
         */
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady() {
                // check to see if onsen is ready and if all app loading has been completed
                if (!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false) {
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                $('#home-page #home-latest-design-block .row').slick({
                    //adaptiveHeight: true,
                    arrows: false,
                    autoplay: true,
                    dots: false,
                    infinite: true,
                    //slide: ".col-xs-5",
                    slidesToScroll: 1,
                    slidesToShow: 1,
                    variableWidth: true
                });
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

        },


        /**
         * method is triggered whenever the puzzle menu is opened
         */
        async puzzleMenuOpened(){
            // flag that the puzzle menu has been opened
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:opened");
            // call all the listeners registered for this lifecycle stage
            return new Promise(function(resolve, reject){

                setTimeout(function(){
                    // return the values gotten from the registered listeners as the resolved value of the Promise
                    resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("puzzle-menu:opened", []));
                }, 0);
            });
        },

        /**
         * method is triggered whenever the puzzle menu is closed
         */
        async puzzleMenuClosed(){
            // flag that the puzzle menu has been closed
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:closed");
            // call all the listeners registered for this lifecycle stage
            return new Promise(function(resolve, reject){

                setTimeout(function(){
                    // return the values gotten from the registered listeners as the resolved value of the Promise
                    resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("puzzle-menu:closed", []));
                }, 0);
            });
        },

        /**
         * method is used to listen for when the Exit Button on the menu is clicked
         * @returns {Promise<void>}
         */
        async exitButtonClicked(){

            // check if sound effects are allowed
            if(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true){
                // start playing background tune in a loop
                await new Promise(function(resolve, reject){
                    window.plugins.NativeAudio.play('button-sound', resolve, resolve);
                });
            }

            // flag that Exit Button on the puzzle menu has been clicked
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:exit-clicked");

            // call all the listeners registered for this lifecycle stage
            await new Promise(function(resolve, reject){

                setTimeout(function(){
                    // return the values gotten from the registered listeners as the resolved value of the Promise
                    resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("puzzle-menu:exit-clicked", []));
                }, 0);
            });

            let exitIndex = -1; // holds the exit index gotten from the user's confirmation of exit


            // flag that the app will soon exit if the listeners do not prevent it
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:will-exit");

            // call all the listeners registered for this lifecycle stage
            let willExitEvent = await new Promise(function(resolve, reject){
                setTimeout(function(){
                    // lifecycle event object.
                    // listeners can cancel the event that logically follows by setting its cancel property to true
                    let eventObject = {};
                    // define properties for the event object
                    eventObject = Object.defineProperties(eventObject, {
                        "canCancel": {
                            value: true,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        },
                        "isCanceled": {
                            get: function(){
                                return typeof this.cancel === "boolean" ? this.cancel : new Boolean(this.cancel).valueOf();
                            }.bind(eventObject),
                            set: function(cancellation){},
                            enumerable: true,
                            configurable: false
                        },
                        "cancel": {
                            value: false,
                            enumerable: true,
                            configurable: false,
                            writable: true
                        },
                        "warningMessage": {
                            enumerable: true,
                            configurable: false,
                            writable: true
                        }
                    });

                    // emit the lifecycle stage event to the listeners
                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("app:will-exit", [eventObject]);
                    // resolve this promise with the event object
                    resolve(eventObject);
                }, 0); // end of setTimeout
            });

            // check if any listener whens to forestall an exit
            if(willExitEvent.isCanceled === true){ // listener wants it canceled
                exitIndex = await ons.notification.confirm('',
                    {title: '<ons-icon icon="md-alert-triangle" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Warning</span>',
                        messageHTML: `${willExitEvent.warningMessage}<br><br>Do you want to close the app?`,
                        buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'});
            }
            else{ // no listener wants to cancel, so find out directly from user if they want to exit
                exitIndex = await ons.notification.confirm('Do you want to close the app?', {title: 'Exit App',
                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'}); // Ask for confirmation
            }

            // check if the user decided to exit the app
            if (exitIndex === 1) { // user want to exit
                // flag that the app has exited
                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:exited");
                // notify all listeners that app has exited
                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                emit("app:exited", []);
                navigator.app.exitApp(); // close/exit the app
            }
            else{ // user does not want to exit
                // flag that the app NOT EXITED
                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:no-exit");
                // notify all listeners that app NOT EXITED
                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                emit("app:no-exit", []);
            }
        },

        /**
         * method is used to listen for when the Puzzle Levels Button on the menu is clicked
         * @returns {Promise<void>}
         */
        async puzzleLevelsButtonClicked(){
            // check if sound effects are allowed
            if(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true){
                // start playing background tune in a loop
                await new Promise(function(resolve, reject){
                    window.plugins.NativeAudio.play('button-sound', resolve, resolve);
                });
            }

            // flag that Puzzle Levels Button on the puzzle menu has been clicked
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
            goto("puzzle-menu:puzzle-levels-clicked");

            // call all the listeners registered for this lifecycle stage
            await new Promise(function(resolve, reject){

                setTimeout(function(){
                    // return the values gotten from the registered listeners as the resolved value of the Promise
                    resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("puzzle-menu:puzzle-levels-clicked", []));
                }, 0);
            });

            let willLoadIndex = -1; // holds the load index gotten from the user's confirmation of loading


            // flag that the app will soon load the puzzle-levels page if the listeners do not prevent it
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:will-load-page");

            // call all the listeners registered for this lifecycle stage
            let willLoadPageEvent = await new Promise(function(resolve, reject){
                setTimeout(function(){
                    // lifecycle event object.
                    // listeners can cancel the event that logically follows by setting its cancel property to true
                    let eventObject = {};
                    // define properties for the event object
                    eventObject = Object.defineProperties(eventObject, {
                        "pageIdToLoad": {
                            value: "puzzle-levels-page",
                            enumerable: true,
                            configurable: false,
                            writable: false
                        },
                        "canCancel": {
                            value: true,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        },
                        "isCanceled": {
                            get: function(){
                                return typeof this.cancel === "boolean" ? this.cancel : new Boolean(this.cancel).valueOf();
                            }.bind(eventObject),
                            set: function(cancellation){},
                            enumerable: true,
                            configurable: false
                        },
                        "cancel": {
                            value: false,
                            enumerable: true,
                            configurable: false,
                            writable: true
                        },
                        "warningMessage": {
                            enumerable: true,
                            configurable: false,
                            writable: true
                        }
                    });

                    // emit the lifecycle stage event to the listeners
                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("app:will-load-page", [eventObject]);
                    // resolve this promise with the event object
                    resolve(eventObject);
                }, 0); // end of setTimeout
            });

            // check if any listener wishes to forestall a page load
            if(willLoadPageEvent.isCanceled === true){ // listener wants it canceled
                willLoadIndex = await ons.notification.confirm('',
                    {title: '<ons-icon icon="md-alert-triangle" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Warning</span>',
                        messageHTML: `${willLoadPageEvent.warningMessage}<br><br>Do you want to leave?`,
                        buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'});

                // check if user decided to load the page
                if(willLoadIndex === 0){ // user decided NOT to load the page
                    // flag that the app DID NOT load the page
                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:no-load-page");
                    // notify all listeners that app DID NOT load the page
                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("app:no-load-page", []);

                    return; // exit the method immediately
                }

            }

            // IF CODE GETS HERE, THEN PAGE CAN BE LOADED
            let totalPagesInStack = $('#app-main-navigator').get(0).pages.length ; // get total number of page presently in the stack
            if(totalPagesInStack > 1){ // if there is more than 1 page
                // hide the Puzzle-Menu page
                await utopiasoftware[utopiasoftware_app_namespace].controller.puzzleMenuPageViewModel.tooglePuzzleMenu();
                // go back all the way to the Puzzle-Levels page i.e. the app's main page
                await $('#app-main-navigator').get(0).popPage({times: $('#app-main-navigator').get(0).pages.length - 1});
            }
            else{ // if there is only 1 page
                // hide the Puzzle-Menu page
                await utopiasoftware[utopiasoftware_app_namespace].controller.puzzleMenuPageViewModel.tooglePuzzleMenu();
            }

            // flag that the page has loaded
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:loaded-page");
            // notify all listeners that the page has loaded
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
            emit("app:loaded-page", []);

        },

        /**
         * method is used to listen for when the Background Music switch is clicked
         * @returns {Promise<void>}
         */
        async backgroundMusicSwitchClicked(){

            // check if sound effects are allowed
            if(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true){
                // start playing background tune in a loop
                await new Promise(function(resolve, reject){
                    window.plugins.NativeAudio.play('button-switch-sound', resolve, resolve);
                });
            }

            // get the current state/status of the background music switch
            var switchOn =  $('#puzzle-menu-page #puzzle-menu-background-music-switch').get(0).checked;
            // update the transient and persistent game settings data with the current state of the switch
            utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.backgroundMusicOn = switchOn;

            utopiasoftware[utopiasoftware_app_namespace].gameSettingsOperations.
            saveGameSettingsData(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings);

            // flag that Background Music Switch on the puzzle menu has been clicked
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
            goto("puzzle-menu:background-music-clicked");

            // call all the listeners registered for this lifecycle stage
            return new Promise(function(resolve, reject){

                setTimeout(function(){
                    // return the values gotten from the registered listeners as the resolved value of the Promise
                    resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("puzzle-menu:background-music-clicked", [{switchOn}]));
                }, 0);
            });

        },

        /**
         * method is used to listen for when the Sound Effects switch is clicked
         * @returns {Promise<void>}
         */
        async soundEffectsSwitchClicked(){

            // check if sound effects are allowed
            if(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true){
                // start playing background tune in a loop
                await new Promise(function(resolve, reject){
                    window.plugins.NativeAudio.play('button-switch-sound', resolve, resolve);
                });
                // wait for 1 sec for switch sound to play before proceeding
                await new Promise(function(resolve, reject){window.setTimeout(resolve, 1000)});
            }

            // get the current state/status of the Sound Effects switch
            var switchOn =  $('#puzzle-menu-page #puzzle-menu-sound-effects-switch').get(0).checked;
            // update the transient and persistent game settings data with the current state of the switch
            utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn = switchOn;

            utopiasoftware[utopiasoftware_app_namespace].gameSettingsOperations.
            saveGameSettingsData(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings);

            // flag that Sound Effects Switch on the puzzle menu has been clicked
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
            goto("puzzle-menu:sound-effects-clicked");

            // call all the listeners registered for this lifecycle stage
            return await new Promise(function(resolve, reject){

                setTimeout(function(){
                    // return the values gotten from the registered listeners as the resolved value of the Promise
                    resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("puzzle-menu:sound-effects-clicked", [{switchOn}]));
                }, 0);
            });

        },

        /**
         * method is used to listen for when the Puzzle Hints switch is clicked
         * @returns {Promise<void>}
         */
        async puzzleHintsSwitchClicked(){

            // check if sound effects are allowed
            if(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true){
                // start playing background tune in a loop
                await new Promise(function(resolve, reject){
                    window.plugins.NativeAudio.play('button-switch-sound', resolve, resolve);
                });
            }

            // get the current state/status of the Puzzle Hints switch
            var switchOn =  $('#puzzle-menu-page #puzzle-menu-puzzle-hints-switch').get(0).checked;
            // update the transient and persistent game settings data with the current state of the switch
            utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.puzzleHintsOn = switchOn;

            utopiasoftware[utopiasoftware_app_namespace].gameSettingsOperations.
            saveGameSettingsData(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings);

            // flag that Puzzle Hints Switch on the puzzle menu has been clicked
            utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
            goto("puzzle-menu:puzzle-hints-clicked");

            // call all the listeners registered for this lifecycle stage
            return new Promise(function(resolve, reject){

                setTimeout(function(){
                    // return the values gotten from the registered listeners as the resolved value of the Promise
                    resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.
                    emit("puzzle-menu:puzzle-hints-clicked", [{switchOn}]));
                }, 0);
            });

        },

        /**
         * method is used to safely toggle the Puzzle Menu open or close
         */
        async tooglePuzzleMenu(){
            // check if sound effects are allowed
            if(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true){
                // start play sound
                await new Promise(function(resolve, reject){
                    window.plugins.NativeAudio.play('button-sound', resolve, resolve);
                });
            }

            // toggle the side-menu i.e. the puzzle menu
            return await $('#side-menu').get(0).toggle();
        }
    }
};