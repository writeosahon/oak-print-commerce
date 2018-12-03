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
            var secureKey;
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
                            secureKey = null;
                            _context.prev = 9;
                            _context.next = 12;
                            return new Promise(function (resolve, reject) {
                                NativeStorage.getItem("utopiasoftware-oak-print-service-secure-key", resolve, reject);
                            });

                        case 12:
                            secureKey = _context.sent;
                            _context.next = 20;
                            break;

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](9);
                            _context.next = 19;
                            return new Promise(function (resolve, reject) {
                                NativeStorage.setItem("utopiasoftware-oak-print-service-secure-key", { password: Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine) }, resolve, reject);
                            });

                        case 19:
                            secureKey = _context.sent;

                        case 20:
                            _context.next = 22;
                            return new Promise(function (resolve, reject) {
                                utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase.crypto(secureKey.password, {
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

                        case 22:
                            _context.next = 27;
                            break;

                        case 24:
                            _context.prev = 24;
                            _context.t1 = _context['catch'](5);

                            console.log("APP LOADING ERROR", _context.t1);

                        case 27:
                            _context.prev = 27;

                            // set status bar color
                            StatusBar.backgroundColorByHexString("#363E7C");
                            navigator.splashscreen.hide(); // hide the splashscreen
                            utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fully loaded and ready
                            return _context.finish(27);

                        case 32:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[5, 24, 27, 32], [9, 15]]);
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
                    var newProductsCarousel, featuredProductsCarousel, salesProductsCarousel;
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

                                    // listen for the back button event
                                    event.target.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.backButtonClicked;

                                    try {
                                        newProductsCarousel = new Flickity($('#home-page #home-latest-design-block .row').get(0), {
                                            // options
                                            wrapAround: true,
                                            groupCells: 1,
                                            autoPlay: 3000,
                                            pauseAutoPlayOnHover: false,
                                            dragThreshold: 10,
                                            initialIndex: 0,
                                            cellAlign: 'left',
                                            contain: false,
                                            prevNextButtons: false,
                                            pageDots: true
                                        });

                                        newProductsCarousel.on("scroll", function () {
                                            // check if the carousel object has a timer attached
                                            if (newProductsCarousel._utopiasoftware_scrollTimer) {
                                                // there is a timer
                                                // clear the timer
                                                window.clearTimeout(newProductsCarousel._utopiasoftware_scrollTimer);
                                                newProductsCarousel._utopiasoftware_scrollTimer = null;
                                            }

                                            // automatically start the the carousel autoplay
                                            newProductsCarousel._utopiasoftware_scrollTimer = window.setTimeout(function () {
                                                newProductsCarousel.playPlayer(); // start carousel autoplay
                                            }, 0);
                                        });
                                        newProductsCarousel.on("staticClick", function (event, pointer, cellElement, cellIndex) {
                                            // check if it was a cell that was clicked
                                            if (!cellElement) {
                                                // it was not a slider cell that was clicked
                                                // clear the timer
                                                return;
                                            }
                                            // a cell was clicked, so load the product-details page
                                            $('#app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
                                        });

                                        featuredProductsCarousel = new Flickity($('#home-page #home-featured-design-block .row').get(0), {
                                            // options
                                            wrapAround: true,
                                            groupCells: 1,
                                            autoPlay: 4000,
                                            pauseAutoPlayOnHover: false,
                                            dragThreshold: 10,
                                            initialIndex: 0,
                                            cellAlign: 'left',
                                            contain: false,
                                            prevNextButtons: false,
                                            pageDots: true
                                        });

                                        featuredProductsCarousel.on("scroll", function () {
                                            // check if the carousel object has a timer attached
                                            if (featuredProductsCarousel._utopiasoftware_scrollTimer) {
                                                // there is a timer
                                                // clear the timer
                                                window.clearTimeout(featuredProductsCarousel._utopiasoftware_scrollTimer);
                                                featuredProductsCarousel._utopiasoftware_scrollTimer = null;
                                            }

                                            // automatically start the the carousel autoplay
                                            featuredProductsCarousel._utopiasoftware_scrollTimer = window.setTimeout(function () {
                                                featuredProductsCarousel.playPlayer(); // start carousel autoplay
                                            }, 0);
                                        });
                                        featuredProductsCarousel.on("staticClick", function (event, pointer, cellElement, cellIndex) {
                                            // check if it was a cell that was clicked
                                            if (!cellElement) {
                                                // it was not a slider cell that was clicked
                                                // clear the timer
                                                return;
                                            }
                                            // a cell was clicked, so load the product-details page
                                            $('#app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
                                        });

                                        salesProductsCarousel = new Flickity($('#home-page #home-sales-design-block .row').get(0), {
                                            // options
                                            wrapAround: true,
                                            groupCells: 1,
                                            autoPlay: 5000,
                                            pauseAutoPlayOnHover: false,
                                            dragThreshold: 10,
                                            initialIndex: 0,
                                            cellAlign: 'left',
                                            contain: false,
                                            prevNextButtons: false,
                                            pageDots: true
                                        });

                                        salesProductsCarousel.on("scroll", function () {
                                            // check if the carousel object has a timer attached
                                            if (salesProductsCarousel._utopiasoftware_scrollTimer) {
                                                // there is a timer
                                                // clear the timer
                                                window.clearTimeout(salesProductsCarousel._utopiasoftware_scrollTimer);
                                                salesProductsCarousel._utopiasoftware_scrollTimer = null;
                                            }

                                            // automatically start the the carousel autoplay
                                            salesProductsCarousel._utopiasoftware_scrollTimer = window.setTimeout(function () {
                                                salesProductsCarousel.playPlayer(); // start carousel autoplay
                                            }, 0);
                                        });
                                        salesProductsCarousel.on("staticClick", function (event, pointer, cellElement, cellIndex) {
                                            // check if it was a cell that was clicked
                                            if (!cellElement) {
                                                // it was not a slider cell that was clicked
                                                // clear the timer
                                                return;
                                            }
                                            // a cell was clicked, so load the product-details page
                                            $('#app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
                                        });
                                    } catch (err) {} finally {
                                        $('#loader-modal').get(0).hide(); // show loader
                                    }

                                case 5:
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
        pageShow: function pageShow() {
            window.SoftInputMode.set('adjustPan');
        },

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
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked: function backButtonClicked() {

            ons.notification.confirm('Do you want to close the app?', { title: '<img src="css/app-images/oak-design-logo.png" style="height: 1.5em; width: auto; margin-right: 0.5em">Exit App',
                buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog utopiasoftware-oak-alert-dialog' }) // Ask for confirmation
            .then(function (index) {
                if (index === 1) {
                    // OK button
                    navigator.app.exitApp(); // Close the app
                }
            });
        }
    },

    /**
     * this is the view-model/controller for the Account page
     */
    accountPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                    var accordion;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context4.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context4.abrupt('return');

                                case 3:

                                    try {
                                        accordion = new ej.navigations.Accordion({
                                            expandMode: 'Single'
                                        });

                                        accordion.appendTo('#account-personal-accordion');
                                        accordion.expandItem(true, 0);
                                    } catch (err) {}

                                case 4:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref4.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            window.SoftInputMode.set('adjustPan');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function pageHide() {
                return _ref5.apply(this, arguments);
            }

            return pageHide;
        }(),

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {}
    },

    /**
     * this is the view-model/controller for the Login page
     */
    loginPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context6.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context6.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked;

                                    // listen for when the login-carousel has changed/slide
                                    $thisPage.on("postchange", "#login-carousel", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.carouselPostChange);

                                    try {
                                        new ej.buttons.Button({ // create the button for showing password visibility on the signup page
                                            isToggle: true,
                                            cssClass: 'e-flat e-small e-round',
                                            iconCss: "zmdi zmdi-eye",
                                            iconPosition: "Left"
                                        }).appendTo($('#signup-password-view-button', $thisPage).get(0));
                                    } catch (err) {}

                                case 6:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref6.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            window.SoftInputMode.set('adjustPan');

            // listen for when the device keyboard is shown
            window.addEventListener('keyboardDidShow', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);
            // listen for when the device keyboard is hidden
            window.addEventListener('keyboardDidHide', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardHiddenAdjustView);
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:

                                // remove listener for when the device keyboard is shown
                                window.removeEventListener('keyboardDidShow', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);
                                // remove listener for when the device keyboard is hidden
                                window.removeEventListener('keyboardDidHide', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardHiddenAdjustView);

                            case 2:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function pageHide() {
                return _ref7.apply(this, arguments);
            }

            return pageHide;
        }(),

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {},

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked: function backButtonClicked() {

            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },


        /**
         * method is triggered when the Sign In / Sign Up segment buttons are clicked
         *
         * @param itemIndex {Integer} zero-based index representing the carousel item to
         * display ewhen the button is clicked
         */
        segmentButtonClicked: function segmentButtonClicked(itemIndex) {
            // move to the slide item specify by the provided parameter
            $('#login-page #login-carousel').get(0).setActiveIndex(itemIndex);
        },


        /**
         * method is triggered when the Password Visibility button is clicked
         *
         * @param buttonElement {HTMLElement} button element being clicked
         *
         * @param inputId {String} the id for the input whose content visibility is being changed
         */
        passwordVisibilityButtonClicked: function passwordVisibilityButtonClicked(buttonElement, inputId) {

            // check the state of the button is it 'active' or not
            if (!$(buttonElement).hasClass('e-active')) {
                // button is not active
                // change the type for the input field
                $(document.getElementById(inputId)).attr("type", "text");
                // change the icon on the button to indicate the change in visibility
                var ej2Button = buttonElement.ej2_instances[0];
                ej2Button.iconCss = 'zmdi zmdi-eye-off';
                ej2Button.dataBind();
            } else {
                // button is active
                // change the type for the input field
                $(document.getElementById(inputId)).attr("type", "password");
                // change the icon on the button to indicate the change in visibility
                var _ej2Button = buttonElement.ej2_instances[0];
                _ej2Button.iconCss = 'zmdi zmdi-eye';
                _ej2Button.dataBind();
            }
        },


        /**
         * method is used to track changes on the carousel slides
         * @param event
         */
        carouselPostChange: function carouselPostChange(event) {

            // use the switch case to determine what carousel is being shown
            switch (event.originalEvent.activeIndex) {// get the index of the active carousel item
                case 0:

                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.second .login-segment").get(0).setActiveButton(1);
                    $("#login-page ons-carousel-item.third .login-segment").get(0).setActiveButton(-1);
                    // scroll to the top of the active carousel item
                    $('#login-page ons-carousel-item.first').scrollTop(0);
                    break;

                case 1:
                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.first .login-segment").get(0).setActiveButton(0);
                    $("#login-page ons-carousel-item.third .login-segment").get(0).setActiveButton(-1);
                    // scroll to the top of the active carousel item
                    $('#login-page ons-carousel-item.second').scrollTop(0);
                    break;

                case 2:
                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.first .login-segment").get(0).setActiveButton(0);
                    $("#login-page ons-carousel-item.second .login-segment").get(0).setActiveButton(1);
                    // scroll to the top of the active carousel item
                    $('#login-page ons-carousel-item.third').scrollTop(0);
                    break;
            }
        },


        /**
         * method is triggered when the keyboard is shown.
         * It is used to adjust the display height
         *
         * @param event
         */
        keyboardShownAdjustView: function keyboardShownAdjustView(event) {
            // get the height of the keyboard and add 100px to it
            var adjustedKeyboardHeight = Math.ceil(event.keyboardHeight) + 6000;

            switch ($('#login-page #login-carousel').get(0).getActiveIndex()) {// get the active carousel item
                case 0:
                    $("#login-page ons-carousel-item.first").css({ "padding-bottom": adjustedKeyboardHeight + "px" });
                    // scroll to the currently focused input element
                    $("#login-page ons-carousel-item.first").scrollTop(Math.floor($(document.activeElement).position().top));
                    console.log("POSITION", $(document.activeElement).position());
                    break;
            }
        }
    },

    /**
     * this is the view-model/controller for the Products page
     */
    productsPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                        while (1) {
                            switch (_context8.prev = _context8.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context8.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context8.abrupt('return');

                                case 3:

                                    // listen for when the "product-layout" segment is clicked
                                    $('#products-page #products-layout-segment').on("postchange", function (postChangeEvent) {

                                        // check which tab was clicked and act accordingly
                                        switch (postChangeEvent.originalEvent.index) {
                                            case 0:
                                                // user selected to display items in 2-column
                                                $('#products-page .col-xs-12').removeClass('col-xs-12').addClass('col-xs-6');
                                                break;

                                            case 1:
                                                // user selected to display items in 1-column
                                                $('#products-page .col-xs-6').removeClass('col-xs-6').addClass('col-xs-12');
                                                break;
                                        }

                                        // scroll to the top of the page
                                        $('#products-page .page__content').scrollTop(0);
                                    });

                                    // listen for when a product card is clicked
                                    $thisPage.on("click", ".e-card > *:not(.e-card-actions)", function () {
                                        // load the product-details page
                                        $('#app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
                                    });

                                    try {} catch (err) {}

                                case 6:
                                case 'end':
                                    return _context8.stop();
                            }
                        }
                    }, _callee8, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref8.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {

            window.SoftInputMode.set('adjustPan');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function pageHide() {
                return _ref9.apply(this, arguments);
            }

            return pageHide;
        }(),

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {}
    },

    /**
     * this is the view-model/controller for the Product Details page
     */
    productDetailsPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                    var addToCartButton, customiseProductButton, wishListButton, compareButton, reviewButton, shareButton;
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context10.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context10.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.backButtonClicked;

                                    try {
                                        addToCartButton = new ej.buttons.Button({
                                            iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
                                            iconPosition: "Left"
                                        });

                                        addToCartButton.appendTo('#product-details-add-to-cart');

                                        customiseProductButton = new ej.buttons.Button({
                                            iconCss: "zmdi zmdi-brush utopiasoftware-icon-zoom-one-point-two",
                                            iconPosition: "Left"
                                        });

                                        customiseProductButton.appendTo('#product-details-customise-product');

                                        wishListButton = new ej.buttons.Button({
                                            cssClass: 'e-outline e-small',
                                            iconCss: "zmdi zmdi-favorite-outline",
                                            iconPosition: "Left"
                                        });

                                        wishListButton.appendTo('#product-details-wish-list');

                                        compareButton = new ej.buttons.Button({
                                            cssClass: 'e-outline e-small',
                                            iconCss: "zmdi zmdi-utopiasoftware-icon-scale-balance",
                                            iconPosition: "Left"
                                        });

                                        compareButton.appendTo('#product-details-compare');

                                        reviewButton = new ej.buttons.Button({
                                            cssClass: 'e-outline e-small',
                                            iconCss: "zmdi zmdi-star-outline",
                                            iconPosition: "Left"
                                        });

                                        reviewButton.appendTo('#product-details-review');

                                        shareButton = new ej.buttons.Button({
                                            cssClass: 'e-outline e-small',
                                            iconCss: "zmdi zmdi-share",
                                            iconPosition: "Left"
                                        });

                                        shareButton.appendTo('#product-details-share');
                                    } catch (err) {}

                                case 5:
                                case 'end':
                                    return _context10.stop();
                            }
                        }
                    }, _callee10, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref10.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            window.SoftInputMode.set('adjustPan');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function pageHide() {
                return _ref11.apply(this, arguments);
            }

            return pageHide;
        }(),

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {},

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked: function backButtonClicked() {

            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        }
    }
};

//# sourceMappingURL=controller-compiled.js.map