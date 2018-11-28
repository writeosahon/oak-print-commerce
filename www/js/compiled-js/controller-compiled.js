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
                            return _context.finish(16);

                        case 21:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[5, 13, 16, 21]]);
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
                                            $('£app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
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
                                            $('£app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
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
                                            $('£app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
                                        });
                                    } catch (err) {} finally {
                                        $('#loader-modal').get(0).hide(); // show loader
                                    }

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
        pageDestroy: function pageDestroy() {}
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
        pageShow: function pageShow() {},

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
     * this is the view-model/controller for the Products page
     */
    productsPageViewModel: {

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

                                    try {} catch (err) {}

                                case 5:
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
        pageShow: function pageShow() {},

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
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
        pageDestroy: function pageDestroy() {}
    }
};

//# sourceMappingURL=controller-compiled.js.map