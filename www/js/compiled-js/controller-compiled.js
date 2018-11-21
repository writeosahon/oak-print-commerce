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
    },

    /**
     * this is the view-model/controller for the Home page
     */
    homePageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context2.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context2.abrupt('return');

                                case 3:

                                    $('#home-page #home-latest-design-block .row').slick({
                                        //adaptiveHeight: true,
                                        arrows: false,
                                        autoplay: true,
                                        dots: false,
                                        infinite: true,
                                        //slide: ".col-xs-5",
                                        slidesToScroll: 1,
                                        slidesToShow: 2
                                        //variableWidth: true
                                    });

                                case 4:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref2.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {},

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function pageHide() {
                return _ref3.apply(this, arguments);
            }

            return pageHide;
        }(),

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {},

        /**
         * method is triggered whenever the puzzle menu is opened
         */
        puzzleMenuOpened: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                // flag that the puzzle menu has been opened
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:opened");
                                // call all the listeners registered for this lifecycle stage
                                return _context4.abrupt('return', new Promise(function (resolve, reject) {

                                    setTimeout(function () {
                                        // return the values gotten from the registered listeners as the resolved value of the Promise
                                        resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("puzzle-menu:opened", []));
                                    }, 0);
                                }));

                            case 2:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function puzzleMenuOpened() {
                return _ref4.apply(this, arguments);
            }

            return puzzleMenuOpened;
        }(),


        /**
         * method is triggered whenever the puzzle menu is closed
         */
        puzzleMenuClosed: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                // flag that the puzzle menu has been closed
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:closed");
                                // call all the listeners registered for this lifecycle stage
                                return _context5.abrupt('return', new Promise(function (resolve, reject) {

                                    setTimeout(function () {
                                        // return the values gotten from the registered listeners as the resolved value of the Promise
                                        resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("puzzle-menu:closed", []));
                                    }, 0);
                                }));

                            case 2:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function puzzleMenuClosed() {
                return _ref5.apply(this, arguments);
            }

            return puzzleMenuClosed;
        }(),


        /**
         * method is used to listen for when the Exit Button on the menu is clicked
         * @returns {Promise<void>}
         */
        exitButtonClicked: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var exitIndex, willExitEvent;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true)) {
                                    _context6.next = 3;
                                    break;
                                }

                                _context6.next = 3;
                                return new Promise(function (resolve, reject) {
                                    window.plugins.NativeAudio.play('button-sound', resolve, resolve);
                                });

                            case 3:

                                // flag that Exit Button on the puzzle menu has been clicked
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:exit-clicked");

                                // call all the listeners registered for this lifecycle stage
                                _context6.next = 6;
                                return new Promise(function (resolve, reject) {

                                    setTimeout(function () {
                                        // return the values gotten from the registered listeners as the resolved value of the Promise
                                        resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("puzzle-menu:exit-clicked", []));
                                    }, 0);
                                });

                            case 6:
                                exitIndex = -1; // holds the exit index gotten from the user's confirmation of exit


                                // flag that the app will soon exit if the listeners do not prevent it

                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:will-exit");

                                // call all the listeners registered for this lifecycle stage
                                _context6.next = 10;
                                return new Promise(function (resolve, reject) {
                                    setTimeout(function () {
                                        // lifecycle event object.
                                        // listeners can cancel the event that logically follows by setting its cancel property to true
                                        var eventObject = {};
                                        // define properties for the event object
                                        eventObject = Object.defineProperties(eventObject, {
                                            "canCancel": {
                                                value: true,
                                                enumerable: true,
                                                configurable: false,
                                                writable: false
                                            },
                                            "isCanceled": {
                                                get: function () {
                                                    return typeof this.cancel === "boolean" ? this.cancel : new Boolean(this.cancel).valueOf();
                                                }.bind(eventObject),
                                                set: function set(cancellation) {},
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
                                        utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("app:will-exit", [eventObject]);
                                        // resolve this promise with the event object
                                        resolve(eventObject);
                                    }, 0); // end of setTimeout
                                });

                            case 10:
                                willExitEvent = _context6.sent;

                                if (!(willExitEvent.isCanceled === true)) {
                                    _context6.next = 17;
                                    break;
                                }

                                _context6.next = 14;
                                return ons.notification.confirm('', { title: '<ons-icon icon="md-alert-triangle" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Warning</span>',
                                    messageHTML: willExitEvent.warningMessage + '<br><br>Do you want to close the app?',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 14:
                                exitIndex = _context6.sent;
                                _context6.next = 20;
                                break;

                            case 17:
                                _context6.next = 19;
                                return ons.notification.confirm('Do you want to close the app?', { title: 'Exit App',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 19:
                                exitIndex = _context6.sent;

                            case 20:

                                // check if the user decided to exit the app
                                if (exitIndex === 1) {
                                    // user want to exit
                                    // flag that the app has exited
                                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:exited");
                                    // notify all listeners that app has exited
                                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("app:exited", []);
                                    navigator.app.exitApp(); // close/exit the app
                                } else {
                                    // user does not want to exit
                                    // flag that the app NOT EXITED
                                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:no-exit");
                                    // notify all listeners that app NOT EXITED
                                    utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("app:no-exit", []);
                                }

                            case 21:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function exitButtonClicked() {
                return _ref6.apply(this, arguments);
            }

            return exitButtonClicked;
        }(),


        /**
         * method is used to listen for when the Puzzle Levels Button on the menu is clicked
         * @returns {Promise<void>}
         */
        puzzleLevelsButtonClicked: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                var willLoadIndex, willLoadPageEvent, totalPagesInStack;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (!(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true)) {
                                    _context7.next = 3;
                                    break;
                                }

                                _context7.next = 3;
                                return new Promise(function (resolve, reject) {
                                    window.plugins.NativeAudio.play('button-sound', resolve, resolve);
                                });

                            case 3:

                                // flag that Puzzle Levels Button on the puzzle menu has been clicked
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:puzzle-levels-clicked");

                                // call all the listeners registered for this lifecycle stage
                                _context7.next = 6;
                                return new Promise(function (resolve, reject) {

                                    setTimeout(function () {
                                        // return the values gotten from the registered listeners as the resolved value of the Promise
                                        resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("puzzle-menu:puzzle-levels-clicked", []));
                                    }, 0);
                                });

                            case 6:
                                willLoadIndex = -1; // holds the load index gotten from the user's confirmation of loading


                                // flag that the app will soon load the puzzle-levels page if the listeners do not prevent it

                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:will-load-page");

                                // call all the listeners registered for this lifecycle stage
                                _context7.next = 10;
                                return new Promise(function (resolve, reject) {
                                    setTimeout(function () {
                                        // lifecycle event object.
                                        // listeners can cancel the event that logically follows by setting its cancel property to true
                                        var eventObject = {};
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
                                                get: function () {
                                                    return typeof this.cancel === "boolean" ? this.cancel : new Boolean(this.cancel).valueOf();
                                                }.bind(eventObject),
                                                set: function set(cancellation) {},
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
                                        utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("app:will-load-page", [eventObject]);
                                        // resolve this promise with the event object
                                        resolve(eventObject);
                                    }, 0); // end of setTimeout
                                });

                            case 10:
                                willLoadPageEvent = _context7.sent;

                                if (!(willLoadPageEvent.isCanceled === true)) {
                                    _context7.next = 19;
                                    break;
                                }

                                _context7.next = 14;
                                return ons.notification.confirm('', { title: '<ons-icon icon="md-alert-triangle" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Warning</span>',
                                    messageHTML: willLoadPageEvent.warningMessage + '<br><br>Do you want to leave?',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 14:
                                willLoadIndex = _context7.sent;

                                if (!(willLoadIndex === 0)) {
                                    _context7.next = 19;
                                    break;
                                }

                                // user decided NOT to load the page
                                // flag that the app DID NOT load the page
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:no-load-page");
                                // notify all listeners that app DID NOT load the page
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("app:no-load-page", []);

                                return _context7.abrupt('return');

                            case 19:

                                // IF CODE GETS HERE, THEN PAGE CAN BE LOADED
                                totalPagesInStack = $('#app-main-navigator').get(0).pages.length; // get total number of page presently in the stack

                                if (!(totalPagesInStack > 1)) {
                                    _context7.next = 27;
                                    break;
                                }

                                _context7.next = 23;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.puzzleMenuPageViewModel.tooglePuzzleMenu();

                            case 23:
                                _context7.next = 25;
                                return $('#app-main-navigator').get(0).popPage({ times: $('#app-main-navigator').get(0).pages.length - 1 });

                            case 25:
                                _context7.next = 29;
                                break;

                            case 27:
                                _context7.next = 29;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.puzzleMenuPageViewModel.tooglePuzzleMenu();

                            case 29:

                                // flag that the page has loaded
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("app:loaded-page");
                                // notify all listeners that the page has loaded
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("app:loaded-page", []);

                            case 31:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function puzzleLevelsButtonClicked() {
                return _ref7.apply(this, arguments);
            }

            return puzzleLevelsButtonClicked;
        }(),


        /**
         * method is used to listen for when the Background Music switch is clicked
         * @returns {Promise<void>}
         */
        backgroundMusicSwitchClicked: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                var switchOn;
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                if (!(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true)) {
                                    _context8.next = 3;
                                    break;
                                }

                                _context8.next = 3;
                                return new Promise(function (resolve, reject) {
                                    window.plugins.NativeAudio.play('button-switch-sound', resolve, resolve);
                                });

                            case 3:

                                // get the current state/status of the background music switch
                                switchOn = $('#puzzle-menu-page #puzzle-menu-background-music-switch').get(0).checked;
                                // update the transient and persistent game settings data with the current state of the switch

                                utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.backgroundMusicOn = switchOn;

                                utopiasoftware[utopiasoftware_app_namespace].gameSettingsOperations.saveGameSettingsData(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings);

                                // flag that Background Music Switch on the puzzle menu has been clicked
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:background-music-clicked");

                                // call all the listeners registered for this lifecycle stage
                                return _context8.abrupt('return', new Promise(function (resolve, reject) {

                                    setTimeout(function () {
                                        // return the values gotten from the registered listeners as the resolved value of the Promise
                                        resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("puzzle-menu:background-music-clicked", [{ switchOn: switchOn }]));
                                    }, 0);
                                }));

                            case 8:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function backgroundMusicSwitchClicked() {
                return _ref8.apply(this, arguments);
            }

            return backgroundMusicSwitchClicked;
        }(),


        /**
         * method is used to listen for when the Sound Effects switch is clicked
         * @returns {Promise<void>}
         */
        soundEffectsSwitchClicked: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var switchOn;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (!(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true)) {
                                    _context9.next = 5;
                                    break;
                                }

                                _context9.next = 3;
                                return new Promise(function (resolve, reject) {
                                    window.plugins.NativeAudio.play('button-switch-sound', resolve, resolve);
                                });

                            case 3:
                                _context9.next = 5;
                                return new Promise(function (resolve, reject) {
                                    window.setTimeout(resolve, 1000);
                                });

                            case 5:

                                // get the current state/status of the Sound Effects switch
                                switchOn = $('#puzzle-menu-page #puzzle-menu-sound-effects-switch').get(0).checked;
                                // update the transient and persistent game settings data with the current state of the switch

                                utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn = switchOn;

                                utopiasoftware[utopiasoftware_app_namespace].gameSettingsOperations.saveGameSettingsData(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings);

                                // flag that Sound Effects Switch on the puzzle menu has been clicked
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:sound-effects-clicked");

                                // call all the listeners registered for this lifecycle stage
                                _context9.next = 11;
                                return new Promise(function (resolve, reject) {

                                    setTimeout(function () {
                                        // return the values gotten from the registered listeners as the resolved value of the Promise
                                        resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("puzzle-menu:sound-effects-clicked", [{ switchOn: switchOn }]));
                                    }, 0);
                                });

                            case 11:
                                return _context9.abrupt('return', _context9.sent);

                            case 12:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function soundEffectsSwitchClicked() {
                return _ref9.apply(this, arguments);
            }

            return soundEffectsSwitchClicked;
        }(),


        /**
         * method is used to listen for when the Puzzle Hints switch is clicked
         * @returns {Promise<void>}
         */
        puzzleHintsSwitchClicked: function () {
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                var switchOn;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                if (!(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true)) {
                                    _context10.next = 3;
                                    break;
                                }

                                _context10.next = 3;
                                return new Promise(function (resolve, reject) {
                                    window.plugins.NativeAudio.play('button-switch-sound', resolve, resolve);
                                });

                            case 3:

                                // get the current state/status of the Puzzle Hints switch
                                switchOn = $('#puzzle-menu-page #puzzle-menu-puzzle-hints-switch').get(0).checked;
                                // update the transient and persistent game settings data with the current state of the switch

                                utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.puzzleHintsOn = switchOn;

                                utopiasoftware[utopiasoftware_app_namespace].gameSettingsOperations.saveGameSettingsData(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings);

                                // flag that Puzzle Hints Switch on the puzzle menu has been clicked
                                utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.goto("puzzle-menu:puzzle-hints-clicked");

                                // call all the listeners registered for this lifecycle stage
                                return _context10.abrupt('return', new Promise(function (resolve, reject) {

                                    setTimeout(function () {
                                        // return the values gotten from the registered listeners as the resolved value of the Promise
                                        resolve(utopiasoftware[utopiasoftware_app_namespace].controller.appLifeCycleObservable.emit("puzzle-menu:puzzle-hints-clicked", [{ switchOn: switchOn }]));
                                    }, 0);
                                }));

                            case 8:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function puzzleHintsSwitchClicked() {
                return _ref10.apply(this, arguments);
            }

            return puzzleHintsSwitchClicked;
        }(),


        /**
         * method is used to safely toggle the Puzzle Menu open or close
         */
        tooglePuzzleMenu: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                if (!(utopiasoftware[utopiasoftware_app_namespace].model.gameSettings.soundEffectsOn === true)) {
                                    _context11.next = 3;
                                    break;
                                }

                                _context11.next = 3;
                                return new Promise(function (resolve, reject) {
                                    window.plugins.NativeAudio.play('button-sound', resolve, resolve);
                                });

                            case 3:
                                _context11.next = 5;
                                return $('#side-menu').get(0).toggle();

                            case 5:
                                return _context11.abrupt('return', _context11.sent);

                            case 6:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function tooglePuzzleMenu() {
                return _ref11.apply(this, arguments);
            }

            return tooglePuzzleMenu;
        }()
    }
};

//# sourceMappingURL=controller-compiled.js.map