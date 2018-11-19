'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    startup: function startup() {

        // initialise the app libraries and plugins
        ons.ready(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // set the default handler for the app
                            ons.setDefaultDeviceBackButtonListener(function () {
                                // does nothing for now!!
                            });

                            // displaying prepping message
                            $('#loader-modal-message').html("Loading App...");
                            $('#loader-modal').get(0).show(); // show loader

                            if (true) {
                                // there is a previous logged in user
                                // load the app main page
                                $('ons-splitter').get(0).content.load("app-main-template");
                            } else {
                                // there is no previously logged in user
                                // load the login page
                                $('ons-splitter').get(0).content.load("login-template");
                            }

                            // START ALL CORDOVA PLUGINS CONFIGURATIONS
                            try {
                                // lock the orientation of the device to 'PORTRAIT'
                                screen.orientation.lock('portrait');
                            } catch (err) {}

                            _context.prev = 5;
                            // START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                            // create the pouchdb app database
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase = new PouchDB('PrintServiceEcommerce.db', {
                                adapter: 'cordova-sqlite',
                                location: 'default',
                                androidDatabaseImplementation: 2
                            });

                            // create the encrypted pouchdb app database
                            utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase = new PouchDB('PrintServiceEcommerceEncrypted.db', {
                                adapter: 'cordova-sqlite',
                                location: 'default',
                                androidDatabaseImplementation: 2
                            });

                            // generate a password for encrypting the app database (if it does NOT already exist)
                            if (!window.localStorage.getItem("utopiasoftware-oak-print-service-rid") || window.localStorage.getItem("utopiasoftware-oak-print-service-rid") === "") {
                                window.localStorage.setItem("utopiasoftware-oak-print-service-rid", Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine));
                            }
                            // enable the db encryption using the generated password
                            _context.next = 11;
                            return new Promise(function (resolve, reject) {
                                utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase.crypto(window.localStorage.getItem("utopiasoftware-oak-print-service-rid"), {
                                    ignore: ['_attachments', '_deleted'],
                                    cb: function cb(err, key) {
                                        if (err) {
                                            // there is an error
                                            reject(err); // reject Promise
                                        } else {
                                            // no error
                                            resolve(key); // resolve Promise
                                        }
                                    } });
                            });

                        case 11:
                            _context.next = 16;
                            break;

                        case 13:
                            _context.prev = 13;
                            _context.t0 = _context['catch'](5);

                            console.log("APP LOADING ERROR", _context.t0);

                        case 16:
                            _context.prev = 16;

                            // set status bar color
                            StatusBar.backgroundColorByHexString("#363E7C");
                            navigator.splashscreen.hide(); // hide the splashscreen
                            utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fully loaded and ready
                            $('#loader-modal').get(0).hide(); // show loader
                            return _context.finish(16);

                        case 22:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[5, 13, 16, 22]]);
        }))); // end of ons.ready()
    }
};

//# sourceMappingURL=controller-compiled.js.map