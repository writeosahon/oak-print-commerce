'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

                            // disable the default back button handler for the 'search-page-search-input-popover'
                            $('#search-page-search-input-popover').get(0).onDeviceBackButton.disable();

                            // displaying prepping message
                            $('#loader-modal-message').html("Loading App...");
                            $('#loader-modal').get(0).show(); // show loader

                            // create the ej2 bottom toast component for the app
                            new ej.notifications.Toast({
                                content: '',
                                cssClass: 'default-ej2-toast',
                                target: document.body,
                                position: { X: "Center", Y: "Bottom" },
                                width: "100%",
                                timeOut: 0,
                                extendedTimeout: 0,
                                showCloseButton: true
                            }).appendTo($('.page-toast').get(0));

                            // create the ej2 "timed" bottom toast component for the app
                            new ej.notifications.Toast({
                                content: '',
                                cssClass: 'default-ej2-toast',
                                target: document.body,
                                position: { X: "Center", Y: "Bottom" },
                                width: "100%",
                                timeOut: 4000, // default 4 sec
                                extendedTimeout: 0,
                                showCloseButton: true
                            }).appendTo($('.timed-page-toast').get(0));

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

                            _context.prev = 8;
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
                            _context.prev = 12;
                            _context.next = 15;
                            return new Promise(function (resolve, reject) {
                                NativeStorage.getItem("utopiasoftware-oak-print-service-secure-key", resolve, reject);
                            });

                        case 15:
                            secureKey = _context.sent;
                            _context.next = 23;
                            break;

                        case 18:
                            _context.prev = 18;
                            _context.t0 = _context['catch'](12);
                            _context.next = 22;
                            return new Promise(function (resolve, reject) {
                                NativeStorage.setItem("utopiasoftware-oak-print-service-secure-key", { password: Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine) }, resolve, reject);
                            });

                        case 22:
                            secureKey = _context.sent;

                        case 23:
                            _context.next = 25;
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

                        case 25:
                            _context.next = 30;
                            break;

                        case 27:
                            _context.prev = 27;
                            _context.t1 = _context['catch'](8);

                            console.log("APP LOADING ERROR", _context.t1);

                        case 30:
                            _context.prev = 30;

                            // set status bar color
                            StatusBar.backgroundColorByHexString("#363E7C");
                            navigator.splashscreen.hide(); // hide the splashscreen
                            utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fully loaded and ready
                            return _context.finish(30);

                        case 35:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[8, 27, 30, 35], [12, 18]]);
        }))); // end of ons.ready()
    },

    /**
     * this is the view-model/controller for the Home page
     */
    homePageViewModel: {

        /**
         * object is used as the carousel Flickity object for "New Products"
         */
        newProductsCarousel: null,

        /**
         * object is used as the carousel Flickity object for "Featured Products"
         */
        featuredProductsCarousel: null,

        /**
         * object is used as the carousel Flickity object for "Sales Products"
         */
        salesProductsCarousel: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                    var newProductsCarousel, featuredProductsCarousel, salesProductsCarousel, toast;
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

                                    // add method to handle the loading action of the pull-to-refresh widget
                                    $('#home-page-pull-hook', $thisPage).get(0).onAction = utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.pagePullHookAction;

                                    // register listener for the pull-to-refresh widget
                                    $('#home-page-pull-hook', $thisPage).on("changestate", function (event) {

                                        // check the state of the pull-to-refresh widget
                                        switch (event.originalEvent.state) {
                                            case 'initial':
                                                // update the displayed content
                                                $('#home-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                                                break;

                                            case 'preaction':
                                                // update the displayed content
                                                $('#home-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                                                break;

                                            case 'action':
                                                // update the displayed content
                                                $('#home-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                                                break;
                                        }
                                    });

                                    _context2.prev = 6;

                                    // create the "New Products" carousel
                                    newProductsCarousel = new Flickity($('#home-page #home-latest-design-block .row').get(0), {
                                        // options
                                        wrapAround: true,
                                        groupCells: 1,
                                        // adaptiveHeight: true,
                                        imagesLoaded: true,
                                        cellSelector: '.col-xs-12',
                                        autoPlay: 5000,
                                        pauseAutoPlayOnHover: false,
                                        dragThreshold: 10,
                                        initialIndex: 0,
                                        cellAlign: 'left',
                                        contain: false,
                                        prevNextButtons: false,
                                        pageDots: false
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
                                        //  $('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
                                    });
                                    // assign the "New Product" carousel to the appropriate object
                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel = newProductsCarousel;

                                    // create the "Featured Products" carousel
                                    featuredProductsCarousel = new Flickity($('#home-page #home-featured-design-block .row').get(0), {
                                        // options
                                        wrapAround: true,
                                        groupCells: 1,
                                        cellSelector: '.col-xs-7',
                                        autoPlay: 4000,
                                        pauseAutoPlayOnHover: false,
                                        dragThreshold: 10,
                                        initialIndex: 0,
                                        cellAlign: 'center',
                                        contain: false,
                                        prevNextButtons: false,
                                        pageDots: false
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
                                    // assign the "Featured Products" carousel to the appropriate object
                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel = featuredProductsCarousel;

                                    salesProductsCarousel = new Flickity($('#home-page #home-sales-design-block .row').get(0), {
                                        // options
                                        wrapAround: true,
                                        groupCells: 1,
                                        cellSelector: '.col-xs-7',
                                        autoPlay: 4500,
                                        pauseAutoPlayOnHover: false,
                                        dragThreshold: 10,
                                        initialIndex: 0,
                                        cellAlign: 'center',
                                        contain: false,
                                        prevNextButtons: false,
                                        pageDots: false
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
                                    // assign the "Sales Products" carousel to the appropriate object
                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel = salesProductsCarousel;

                                    $('#loader-modal').get(0).hide(); // show loader

                                    // display page preloader
                                    $('#home-page .page-preloader').css("display", "block");

                                    // start loading the page content
                                    _context2.next = 23;
                                    return utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.loadProducts();

                                case 23:

                                    // hide the preloader
                                    $('#home-page .page-preloader').css("display", "none");
                                    _context2.next = 34;
                                    break;

                                case 26:
                                    _context2.prev = 26;
                                    _context2.t0 = _context2['catch'](6);

                                    // hide all previously displayed ej2 toast
                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                    // display toast to show that an error
                                    toast = $('.page-toast').get(0).ej2_instances[0];

                                    toast.cssClass = 'error-ej2-toast';
                                    toast.content = 'Sorry, an error occurred.' + (navigator.connection.type === Connection.NONE ? " Connect to the Internet." : "") + ' Pull down to refresh and try again';
                                    toast.dataBind();
                                    toast.show();

                                case 34:
                                    _context2.prev = 34;
                                    return _context2.finish(34);

                                case 36:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this, [[6, 26, 34, 36]]);
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
            $('#app-main-page ons-toolbar div.title-bar').html("OAK");
            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOnlineListener, false);
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

                                // remove listener for when the device does not have Internet connection
                                document.removeEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOfflineListener, false);
                                // remove listener for when the device has Internet connection
                                document.removeEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOnlineListener, false);

                            case 2:
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
        pageDestroy: function pageDestroy() {
            // destroy the carousels
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.newProductsCarousel.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.newProductsCarousel = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.featuredProductsCarousel.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.featuredProductsCarousel = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.salesProductsCarousel.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.salesProductsCarousel = null;
        },

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
        },


        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener: function deviceOfflineListener() {
            // display toast to show that there is no internet connection
            var toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see live products";
            toast.dataBind();
            toast.show(); // show ej2 toast
        },


        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener: function deviceOnlineListener() {
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },


        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        pagePullHookAction: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var doneCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var toast;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                // disable pull-to-refresh widget till loading is done
                                $('#home-page #home-page-pull-hook').attr("disabled", true);
                                // hide all previously displayed ej2 toast
                                $('.page-toast').get(0).ej2_instances[0].hide('All');

                                _context4.prev = 2;
                                _context4.next = 5;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.loadProducts();

                            case 5:
                                // hide the preloader
                                $('#home-page .page-preloader').css("display", "none");
                                _context4.next = 16;
                                break;

                            case 8:
                                _context4.prev = 8;
                                _context4.t0 = _context4['catch'](2);
                                // an error occurred
                                // display toast to show that error
                                toast = $('.page-toast').get(0).ej2_instances[0];

                                toast.hide('All');
                                toast.cssClass = 'error-ej2-toast';
                                toast.content = "Sorry, an error occurred. Refresh to try again";
                                toast.dataBind();
                                toast.show();

                            case 16:
                                _context4.prev = 16;

                                // enable pull-to-refresh widget till loading is done
                                $('#home-page #home-page-pull-hook').removeAttr("disabled");
                                // signal that loading is done
                                doneCallBack();
                                return _context4.finish(16);

                            case 20:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[2, 8, 16, 20]]);
            }));

            function pagePullHookAction() {
                return _ref4.apply(this, arguments);
            }

            return pagePullHookAction;
        }(),


        /**
         * method is used to load all products to the page
         *
         * @returns {Promise<void>}
         */
        loadProducts: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var productTypesPromisesArray, toast;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                productTypesPromisesArray = []; // holds the array for all the promises of the product types to be loaded

                                // check if there is internet connection or not

                                if (navigator.connection.type !== Connection.NONE) {
                                    // there is internet connection
                                    // load banner products
                                    productTypesPromisesArray.push(new Promise(function (resolve, reject) {
                                        Promise.resolve($.ajax({
                                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                                            type: "get",
                                            //contentType: "application/x-www-form-urlencoded",
                                            beforeSend: function beforeSend(jqxhr) {
                                                jqxhr.setRequestHeader("Authorization", "Basic " + utopiasoftware[utopiasoftware_app_namespace].accessor);
                                            },
                                            dataType: "json",
                                            timeout: 240000, // wait for 4 minutes before timeout of request
                                            processData: true,
                                            data: { "order": "desc", "orderby": "date", "status": "private",
                                                "type": "external", "page": 1, "per_page": 5 }
                                        })).then(function (productsArray) {
                                            // save the retrieved data to app database as cache
                                            utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: "banner-products", docType: "BANNER_PRODUCTS", products: productsArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                            $('#home-page #home-latest-design-block').css("opacity", "1"); // hide the "Products" segment
                                            // remove the previously slides from the carousel
                                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.remove($('#home-page #home-latest-design-block .row .col-xs-12').get());
                                            // attach the products to the page
                                            for (var index = 0; index < productsArray.length; index++) {
                                                var columnContent = '<div class="col-xs-12" style="padding-left: 0; padding-right: 0;">\n                                    <div class="e-card" style="min-height: 40vh; max-height: 90vh">\n                                        <div class="e-card-image" style="">\n                                        <img src="' + productsArray[index].images[0].src + '" style="width: 100%; height: auto; max-height: 90vh">\n                                        </div>\n                                    </div>\n                                </div>';
                                                // append the content
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.append($(columnContent));
                                            }
                                            $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                                            resolve(); // resolve the parent promise
                                        }).catch(function (err) {
                                            console.log("LOAD PRODUCT", err);
                                            $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                                            reject(); // reject the parent promise
                                        });
                                    }));

                                    // load featured products
                                    productTypesPromisesArray.push(new Promise(function (resolve, reject) {
                                        Promise.resolve($.ajax({
                                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                                            type: "get",
                                            //contentType: "application/x-www-form-urlencoded",
                                            beforeSend: function beforeSend(jqxhr) {
                                                jqxhr.setRequestHeader("Authorization", "Basic " + utopiasoftware[utopiasoftware_app_namespace].accessor);
                                            },
                                            dataType: "json",
                                            timeout: 240000, // wait for 4 minutes before timeout of request
                                            processData: true,
                                            data: { "order": "desc", "orderby": "date", "status": "publish",
                                                "type": "variable", "stock_status": "instock", "page": 1, "per_page": 5, "featured": true }
                                        })).then(function (productsArray) {
                                            if (productsArray.length > 0) {
                                                // save the retrieved data to app database as cache
                                                utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: "popular-products", docType: "POPULAR_PRODUCTS", products: productsArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                                                // show the "Products" segment
                                                $('#home-page #home-featured-design-block').css({ "opacity": "1", "display": "block" });
                                                // remove the previously slides from the carousel
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.remove($('#home-page #home-featured-design-block .row .col-xs-7').get());
                                            } else {
                                                // hide the "Products" segment
                                                $('#home-page #home-featured-design-block').css({ "opacity": "0", "display": "none" });
                                            }

                                            // attach the products to the page
                                            for (var index = 0; index < productsArray.length; index++) {
                                                var columnContent = '<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
                                                // append the content
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.append($(columnContent));
                                            }
                                            resolve(); // resolve the parent promise
                                        }).catch(function (err) {
                                            console.log("LOAD PRODUCT", err);
                                            reject(); // reject the parent promise
                                        });
                                    }));

                                    // load sales products
                                    productTypesPromisesArray.push(new Promise(function (resolve, reject) {
                                        Promise.resolve($.ajax({
                                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                                            type: "get",
                                            //contentType: "application/x-www-form-urlencoded",
                                            beforeSend: function beforeSend(jqxhr) {
                                                jqxhr.setRequestHeader("Authorization", "Basic " + utopiasoftware[utopiasoftware_app_namespace].accessor);
                                            },
                                            dataType: "json",
                                            timeout: 240000, // wait for 4 minutes before timeout of request
                                            processData: true,
                                            data: { "order": "desc", "orderby": "date", "status": "publish",
                                                "type": "variable", "stock_status": "instock", "page": 1, "per_page": 5, "on_sale": true }
                                        })).then(function (productsArray) {
                                            if (productsArray.length > 0) {
                                                // save the retrieved data to app database as cache
                                                utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: "sales-products", docType: "SALES_PRODUCTS", products: productsArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                                                // show the "Products" segment
                                                $('#home-page #home-sales-design-block').css({ "opacity": "1", "display": "block" });
                                                // remove the previously slides from the carousel
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.remove($('#home-page #home-sales-design-block .row .col-xs-7').get());
                                            } else {
                                                // hide the "Products" segment
                                                $('#home-page #home-sales-design-block').css({ "opacity": "0", "display": "none" });
                                            }

                                            // attach the products to the page
                                            for (var index = 0; index < productsArray.length; index++) {
                                                if (!productsArray[index].regular_price || productsArray[index].regular_price == "") {
                                                    // regular price was NOT set, so set it
                                                    productsArray[index].regular_price = "0.00";
                                                }
                                                var columnContent = '<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        <span class="e-badge e-badge-danger" style="float: right; clear: both; \n                                                    background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 0.6em;">\n                                                    ' + Math.ceil(Math.abs(kendo.parseFloat(productsArray[index].price) - kendo.parseFloat(productsArray[index].regular_price)) / kendo.parseFloat(productsArray[index].regular_price === "0.00" ? productsArray[index].price : productsArray[index].regular_price) * 100) + '% OFF\n                                                    </span>\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].regular_price), "n2") + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
                                                // append the content
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.append($(columnContent));
                                            }
                                            resolve(); // resolve the parent promise
                                        }).catch(function (err) {
                                            console.log("LOAD PRODUCT", err);
                                            reject(); // reject the parent promise
                                        });
                                    }));
                                } // end of loading products with Internet Connection
                                else {
                                        // there is no internet connection
                                        // display toast to show that there is no internet connection
                                        toast = $('.page-toast').get(0).ej2_instances[0];

                                        toast.hide('All');
                                        toast.cssClass = 'default-ej2-toast';
                                        toast.content = "No Internet connection. Pull down to refresh and see live products";
                                        toast.dataBind();
                                        toast.show();
                                        // load banner products from cached data
                                        productTypesPromisesArray.push(new Promise(function (resolve, reject) {
                                            Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("banner-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function (cachedProductsData) {
                                                return cachedProductsData.products;
                                            }).then(function (productsArray) {
                                                $('#home-page #home-latest-design-block').css("opacity", "1"); // hide the "Products" segment
                                                // remove the previously slides from the carousel
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.remove($('#home-page #home-latest-design-block .row .col-xs-12').get());
                                                // attach the products to the page
                                                for (var index = 0; index < productsArray.length; index++) {
                                                    var columnContent = '<div class="col-xs-12" style="padding-left: 0; padding-right: 0;">\n                                    <div class="e-card" style="min-height: 40vh; max-height: 90vh">\n                                        <div class="e-card-image" style="">\n                                        <img src="css/app-images/blank-img.png" style="width: 100%; height: auto; max-height: 90vh">\n                                        </div>\n                                    </div>\n                                </div>';
                                                    // append the content
                                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.append($(columnContent));
                                                }
                                                $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                                                resolve(); // resolve the parent promise
                                            }).catch(function (err) {
                                                console.log("LOAD PRODUCT", err);
                                                $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                                                reject(); // reject the parent promise
                                            });
                                        }));

                                        // load featured products from cached data
                                        productTypesPromisesArray.push(new Promise(function (resolve, reject) {
                                            Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("popular-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function (cachedProductsData) {
                                                return cachedProductsData.products;
                                            }).then(function (productsArray) {
                                                if (productsArray.length > 0) {
                                                    // show the "Products" segment
                                                    $('#home-page #home-featured-design-block').css({ "opacity": "1", "display": "block" });
                                                    // remove the previously slides from the carousel
                                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.remove($('#home-page #home-featured-design-block .row .col-xs-7').get());
                                                } else {
                                                    // hide the "Products" segment
                                                    $('#home-page #home-featured-design-block').css({ "opacity": "0", "display": "none" });
                                                }

                                                // attach the products to the page
                                                for (var index = 0; index < productsArray.length; index++) {
                                                    var columnContent = '<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
                                                    // append the content
                                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.append($(columnContent));
                                                }
                                                resolve(); // resolve the parent promise
                                            }).catch(function (err) {
                                                console.log("LOAD PRODUCT", err);
                                                reject(); // reject the parent promise
                                            });
                                        }));

                                        // load sales products from cached data
                                        productTypesPromisesArray.push(new Promise(function (resolve, reject) {
                                            Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("sales-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function (cachedProductsData) {
                                                return cachedProductsData.products;
                                            }).then(function (productsArray) {
                                                if (productsArray.length > 0) {
                                                    // show the "Products" segment
                                                    $('#home-page #home-sales-design-block').css({ "opacity": "1", "display": "block" });
                                                    // remove the previously slides from the carousel
                                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.remove($('#home-page #home-sales-design-block .row .col-xs-7').get());
                                                } else {
                                                    // hide the "Products" segment
                                                    $('#home-page #home-sales-design-block').css({ "opacity": "0", "display": "none" });
                                                }

                                                // attach the products to the page
                                                for (var index = 0; index < productsArray.length; index++) {
                                                    if (!productsArray[index].regular_price || productsArray[index].regular_price == "") {
                                                        // regular price was NOT set, so set it
                                                        productsArray[index].regular_price = "0.00";
                                                    }
                                                    var columnContent = '<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        <span class="e-badge e-badge-danger" style="float: right; clear: both; \n                                                    background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 0.6em;">\n                                                    ' + Math.ceil(Math.abs(kendo.parseFloat(productsArray[index].price) - kendo.parseFloat(productsArray[index].regular_price)) / kendo.parseFloat(productsArray[index].regular_price === "0.00" ? productsArray[index].price : productsArray[index].regular_price) * 100) + '% OFF\n                                                    </span>\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].regular_price), "n2") + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
                                                    // append the content
                                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.append($(columnContent));
                                                }
                                                resolve(); // resolve the parent promise
                                            }).catch(function (err) {
                                                console.log("LOAD PRODUCT", err);
                                                reject(); // reject the parent promise
                                            });
                                        }));
                                    }

                                return _context5.abrupt('return', Promise.all(productTypesPromisesArray));

                            case 3:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function loadProducts() {
                return _ref5.apply(this, arguments);
            }

            return loadProducts;
        }(),


        /**
         * method is triggered when the user wishes to view more featured products
         * @returns {Promise<void>}
         */
        showMoreFeaturedProducts: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                // load the products page in a separate event queue
                                window.setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                                    var productArray, toast;
                                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                        while (1) {
                                            switch (_context6.prev = _context6.next) {
                                                case 0:
                                                    _context6.prev = 0;
                                                    _context6.next = 3;
                                                    return $('#app-main-tabbar').get(0).setActiveTab(4, { animation: 'none' });

                                                case 3:
                                                    _context6.next = 5;
                                                    return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts({ "order": "desc", "orderby": "date", "status": "publish",
                                                        "type": "variable", "stock_status": "instock", "page": 1, "per_page": 20, "featured": true });

                                                case 5:
                                                    productArray = _context6.sent;
                                                    _context6.next = 8;
                                                    return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);

                                                case 8:
                                                    _context6.next = 19;
                                                    break;

                                                case 10:
                                                    _context6.prev = 10;
                                                    _context6.t0 = _context6['catch'](0);

                                                    console.log("PRODUCTS PAGE", _context6.t0);
                                                    // hide all previously displayed ej2 toast
                                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                                    // display toast to show that an error
                                                    toast = $('.page-toast').get(0).ej2_instances[0];

                                                    toast.cssClass = 'error-ej2-toast';
                                                    toast.content = 'Sorry, an error occurred.' + (navigator.connection.type === Connection.NONE ? " Connect to the Internet." : "") + ' Pull down to refresh and try again';
                                                    toast.dataBind();
                                                    toast.show();

                                                case 19:
                                                    _context6.prev = 19;

                                                    // hide the preloader for the products page
                                                    $('#products-page .page-preloader').css("display", "none");
                                                    return _context6.finish(19);

                                                case 22:
                                                case 'end':
                                                    return _context6.stop();
                                            }
                                        }
                                    }, _callee6, this, [[0, 10, 19, 22]]);
                                })), 0);

                            case 1:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function showMoreFeaturedProducts() {
                return _ref6.apply(this, arguments);
            }

            return showMoreFeaturedProducts;
        }(),


        /**
         * method is triggered when the user wishes to view more featured products
         * @returns {Promise<void>}
         */
        showMoreSalesProducts: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                // load the products page in a separate event queue
                                window.setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                                    var productArray, toast;
                                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                                        while (1) {
                                            switch (_context8.prev = _context8.next) {
                                                case 0:
                                                    _context8.prev = 0;
                                                    _context8.next = 3;
                                                    return $('#app-main-tabbar').get(0).setActiveTab(4, { animation: 'none' });

                                                case 3:
                                                    _context8.next = 5;
                                                    return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts({ "order": "desc", "orderby": "date", "status": "publish",
                                                        "type": "variable", "stock_status": "instock", "page": 1, "per_page": 20, "on_sale": true });

                                                case 5:
                                                    productArray = _context8.sent;
                                                    _context8.next = 8;
                                                    return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);

                                                case 8:
                                                    _context8.next = 19;
                                                    break;

                                                case 10:
                                                    _context8.prev = 10;
                                                    _context8.t0 = _context8['catch'](0);

                                                    console.log("PRODUCTS PAGE", _context8.t0);
                                                    // hide all previously displayed ej2 toast
                                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                                    // display toast to show that an error
                                                    toast = $('.page-toast').get(0).ej2_instances[0];

                                                    toast.cssClass = 'error-ej2-toast';
                                                    toast.content = 'Sorry, an error occurred.' + (navigator.connection.type === Connection.NONE ? " Connect to the Internet." : "") + ' Pull down to refresh and try again';
                                                    toast.dataBind();
                                                    toast.show();

                                                case 19:
                                                    _context8.prev = 19;

                                                    // hide the preloader for the products page
                                                    $('#products-page .page-preloader').css("display", "none");
                                                    return _context8.finish(19);

                                                case 22:
                                                case 'end':
                                                    return _context8.stop();
                                            }
                                        }
                                    }, _callee8, this, [[0, 10, 19, 22]]);
                                })), 0);

                            case 1:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function showMoreSalesProducts() {
                return _ref8.apply(this, arguments);
            }

            return showMoreSalesProducts;
        }()
    },

    /**
     * this is the view-model/controller for the Categories page
     */
    categoriesPageViewModel: {

        /**
         * property holds the current "page" of the categories being accessed
         */
        currentPage: 0,

        /**
         * property holds the size i.e. number of items that can be contained in currentPage being accessed
         */
        pageSize: 100,

        /**
         * property holds the height of the "content view" for the page
         */
        viewContentHeight: 0,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                    var categoryArray, toast;
                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                        while (1) {
                            switch (_context11.prev = _context11.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context11.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context11.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    event.target.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.backButtonClicked;

                                    // add method to handle the loading action of the pull-to-refresh widget
                                    $('#categories-page-pull-hook', $thisPage).get(0).onAction = utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pagePullHookAction;

                                    // register listener for the pull-to-refresh widget
                                    $('#categories-page-pull-hook', $thisPage).on("changestate", function (event) {

                                        // check the state of the pull-to-refresh widget
                                        switch (event.originalEvent.state) {
                                            case 'initial':
                                                // update the displayed content
                                                $('#categories-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                                                break;

                                            case 'preaction':
                                                // update the displayed content
                                                $('#categories-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                                                break;

                                            case 'action':
                                                // update the displayed content
                                                $('#categories-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                                                break;
                                        }
                                    });

                                    // get the height of the view content container
                                    utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight = Math.floor($('#categories-page .page__content').height());
                                    console.log("CONTENT HEIGHT", utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight);

                                    // listen for the scroll event on the page
                                    $('#categories-page .page__content').on("scroll", function () {
                                        // handle the logic in a different event queue slot
                                        window.setTimeout(function () {
                                            // get the scrollTop position of the view content
                                            var scrollTop = Math.floor($('#categories-page .page__content').scrollTop());
                                            console.log("SCROLL TOP", scrollTop);
                                            // get the percentage of scroll that has taken place from the top position
                                            var percentageScroll = scrollTop / utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight * 100;
                                            if (percentageScroll >= 50) {
                                                // if the scroll position is >= halfway
                                                $('#categories-page #categories-page-scroll-top-fab').css({ "transform": "scale(1)",
                                                    "display": "inline-block" });
                                            } else {
                                                // if the scroll position is < halfway
                                                $('#categories-page #categories-page-scroll-top-fab').css({ "transform": "scale(0)" });
                                            }
                                        }, 0);
                                    });

                                    // listen for when a category card is clicked
                                    $thisPage.on("click", ".e-card", function (clickEvent) {
                                        // load the products page in a separate event queue
                                        window.setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                                            var productArray, toast;
                                            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                                                while (1) {
                                                    switch (_context10.prev = _context10.next) {
                                                        case 0:
                                                            _context10.prev = 0;
                                                            _context10.next = 3;
                                                            return $('#app-main-tabbar').get(0).setActiveTab(4, { animation: 'none' });

                                                        case 3:
                                                            _context10.next = 5;
                                                            return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts({ "order": "desc", "orderby": "date", "status": "publish",
                                                                "type": "variable", "stock_status": "instock", "page": 1, "per_page": 20,
                                                                "category": $(clickEvent.currentTarget).attr("data-category-id") });

                                                        case 5:
                                                            productArray = _context10.sent;
                                                            _context10.next = 8;
                                                            return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);

                                                        case 8:
                                                            _context10.next = 19;
                                                            break;

                                                        case 10:
                                                            _context10.prev = 10;
                                                            _context10.t0 = _context10['catch'](0);

                                                            console.log("PRODUCTS PAGE", _context10.t0);
                                                            // hide all previously displayed ej2 toast
                                                            $('.page-toast').get(0).ej2_instances[0].hide('All');
                                                            // display toast to show that an error
                                                            toast = $('.page-toast').get(0).ej2_instances[0];

                                                            toast.cssClass = 'error-ej2-toast';
                                                            toast.content = 'Sorry, an error occurred.' + (navigator.connection.type === Connection.NONE ? " Connect to the Internet." : "") + ' Pull down to refresh and try again';
                                                            toast.dataBind();
                                                            toast.show();

                                                        case 19:
                                                            _context10.prev = 19;

                                                            // hide the preloader for the products page
                                                            $('#products-page .page-preloader').css("display", "none");
                                                            return _context10.finish(19);

                                                        case 22:
                                                        case 'end':
                                                            return _context10.stop();
                                                    }
                                                }
                                            }, _callee10, this, [[0, 10, 19, 22]]);
                                        })), 0);
                                    });

                                    _context11.prev = 10;
                                    _context11.next = 13;
                                    return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.loadCategories();

                                case 13:
                                    categoryArray = _context11.sent;
                                    _context11.next = 16;
                                    return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.displayPageContent(categoryArray[0]);

                                case 16:
                                    _context11.next = 27;
                                    break;

                                case 18:
                                    _context11.prev = 18;
                                    _context11.t0 = _context11['catch'](10);

                                    console.log("CATEGORIES PAGE", _context11.t0);
                                    // hide all previously displayed ej2 toast
                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                    // display toast to show that an error
                                    toast = $('.page-toast').get(0).ej2_instances[0];

                                    toast.cssClass = 'error-ej2-toast';
                                    toast.content = 'Sorry, an error occurred.' + (navigator.connection.type === Connection.NONE ? " Connect to the Internet." : "") + ' Pull down to refresh and try again';
                                    toast.dataBind();
                                    toast.show();

                                case 27:
                                    _context11.prev = 27;

                                    // hide the preloader
                                    $('#categories-page .page-preloader').css("display", "none");
                                    return _context11.finish(27);

                                case 30:
                                case 'end':
                                    return _context11.stop();
                            }
                        }
                    }, _callee11, this, [[10, 18, 27, 30]]);
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
            $('#app-main-page ons-toolbar div.title-bar').html("Products"); // update the title of the page
            // hide the page scroll fab
            $('#categories-page #categories-page-scroll-top-fab').css({ "display": "none" });

            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOnlineListener, false);
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:

                                // remove listener for when the device does not have Internet connection
                                document.removeEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOfflineListener, false);
                                // remove listener for when the device has Internet connection
                                document.removeEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOnlineListener, false);

                            case 2:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function pageHide() {
                return _ref12.apply(this, arguments);
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
            // go to the "Home" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(0);
        },


        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener: function deviceOfflineListener() {
            // display toast to show that there is no internet connection
            var toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see updated products";
            toast.dataBind();
            toast.show(); // show ej2 toast
        },


        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener: function deviceOnlineListener() {
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },


        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        pagePullHookAction: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                var doneCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var categoryArray, toast;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                // disable pull-to-refresh widget till loading is done
                                $('#categories-page #categories-page-pull-hook').attr("disabled", true);
                                // hide all previously displayed ej2 toast
                                $('.page-toast').get(0).ej2_instances[0].hide('All');

                                _context13.prev = 2;
                                _context13.next = 5;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.loadCategories(1, utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pageSize);

                            case 5:
                                categoryArray = _context13.sent;
                                _context13.next = 8;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.displayPageContent(categoryArray[0]);

                            case 8:
                                _context13.next = 17;
                                break;

                            case 10:
                                _context13.prev = 10;
                                _context13.t0 = _context13['catch'](2);
                                // an error occurred
                                // display toast to show that error
                                toast = $('.page-toast').get(0).ej2_instances[0];

                                toast.cssClass = 'error-ej2-toast';
                                toast.content = "Sorry, an error occurred. Refresh to try again";
                                toast.dataBind();
                                toast.show();

                            case 17:
                                _context13.prev = 17;

                                // enable pull-to-refresh widget till loading is done
                                $('#categories-page #categories-page-pull-hook').removeAttr("disabled");
                                // signal that loading is done
                                doneCallBack();
                                return _context13.finish(17);

                            case 21:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this, [[2, 10, 17, 21]]);
            }));

            function pagePullHookAction() {
                return _ref13.apply(this, arguments);
            }

            return pagePullHookAction;
        }(),


        /**
         * method is used to load products categories to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @returns {Promise<void>}
         */
        loadCategories: function () {
            var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                var pageToAccess = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.currentPage + 1;
                var pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pageSize;
                var categoryPromisesArray, toast;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                categoryPromisesArray = []; // holds the array for the promises used to load the product categories

                                // check if there is internet connection or not

                                if (navigator.connection.type !== Connection.NONE) {
                                    // there is internet connection
                                    // load the requested categories list from the server
                                    categoryPromisesArray.push(new Promise(function (resolve, reject) {
                                        Promise.resolve($.ajax({
                                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products/categories",
                                            type: "get",
                                            //contentType: "application/x-www-form-urlencoded",
                                            beforeSend: function beforeSend(jqxhr) {
                                                jqxhr.setRequestHeader("Authorization", "Basic " + utopiasoftware[utopiasoftware_app_namespace].accessor);
                                            },
                                            dataType: "json",
                                            timeout: 240000, // wait for 4 minutes before timeout of request
                                            processData: true,
                                            data: { "order": "asc", "orderby": "name", "hide_empty": true,
                                                "page": pageToAccess, "per_page": pageSize }
                                        })).then(function (categoriesArray) {
                                            // check if there is any data to cache in the app database
                                            if (categoriesArray.length > 0) {
                                                // there is data to cache
                                                // remove the 'uncategorized' category
                                                categoriesArray = categoriesArray.filter(function (element) {
                                                    return element.slug !== 'uncategorized';
                                                });
                                                // generate an id for the data being cached
                                                var cachedDataId = ("" + pageToAccess).padStart(7, "0") + "categories";
                                                // save the retrieved data to app database as cached data
                                                utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: cachedDataId, docType: "PRODUCT_CATEGORIES", categories: categoriesArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                                // update the current page being viewed
                                                utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.currentPage = pageToAccess;
                                            }
                                            resolve(categoriesArray); // resolve the parent promise with the data gotten from the server
                                        }).catch(function (err) {
                                            // an error occurred
                                            console.log("LOAD CATEGORY", err);
                                            reject(err); // reject the parent promise with the error
                                        });
                                    }));
                                } // end of loading product categories with Internet Connection
                                else {
                                        // there is no internet connection
                                        // display toast to show that there is no internet connection
                                        toast = $('.page-toast').get(0).ej2_instances[0];

                                        toast.hide('All');
                                        toast.cssClass = 'default-ej2-toast';
                                        toast.content = "No Internet connection. Pull down to refresh and see updated products";
                                        toast.dataBind();
                                        toast.show();
                                        // load the requested product categories from cached data
                                        categoryPromisesArray.push(new Promise(function (resolve, reject) {
                                            // generate the id for the cached data being retrieved
                                            var cachedDataId = ("" + pageToAccess).padStart(7, "0") + "categories";
                                            Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData(cachedDataId, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function (cachedCategoriesData) {
                                                resolve(cachedCategoriesData.categories); // resolve the parent promise with the cached categories data
                                            }).catch(function (err) {
                                                // an error occurred
                                                console.log("LOAD CATEGORY", err);
                                                reject(err); // reject the parent promise with the error
                                            });
                                        }));
                                    }

                                return _context14.abrupt('return', Promise.all(categoryPromisesArray));

                            case 3:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function loadCategories() {
                return _ref14.apply(this, arguments);
            }

            return loadCategories;
        }(),


        /**
         * method is used to display the retrieved products categories on the app screen
         *
         * @param categoriesArray
         *
         * @param appendContent {Boolean} if the value is true,
         * add each content to the end of other items on the screen.
         * Else, prepend the content to the top of other items
         *
         * @param overwriteContent {Boolean} should the old content be replaced or added to
         *
         * @returns {Promise<void>}
         */
        displayPageContent: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(categoriesArray) {
                var appendContent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                var overwriteContent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                var displayCompletedPromise;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                /*for(let index = 0; index < 4; index++){ // REMOVE THIS LATER JUST FOR TEST TODO
                                    categoriesArray.push(...categoriesArray);
                                }*/
                                displayCompletedPromise = new Promise(function (resolve, reject) {

                                    var categoriesContent = ""; // holds the contents for the categories

                                    // check if the categoriesArray is empty or not
                                    if (categoriesArray.length <= 0) {
                                        // there are no new content to display
                                        resolve(categoriesArray.length); // resolve promise with the length of the categories array
                                    } else {
                                        // there are some categories to display

                                        // loop through the array content and display it
                                        for (var index = 0; index < categoriesArray.length; index++) {
                                            categoriesContent += '<div class="col-xs-4" ';
                                            if ((index + 1) % 3 !== 0) {
                                                // this is NOT the last column in the row
                                                categoriesContent += 'style="border-right: 1px lightgray solid; border-bottom: 1px lightgray solid">';
                                            } else {
                                                // this is the last column in the row
                                                categoriesContent += 'style="border-bottom: 1px lightgray solid">';
                                            }
                                            categoriesContent += '\n                        <ons-ripple background="rgba(63, 81, 181, 0.3)"></ons-ripple>\n                        <div class="e-card" data-category-id="' + categoriesArray[index].id + '">\n                            <div class="e-card-image" style="min-height: 100px; \n                            background-image: url(\'' + categoriesArray[index].image.src + '\');">\n                            </div>\n                            <div class="e-card-header">\n                                <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">\n                                    <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">\n                                        ' + categoriesArray[index].name + '\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                      </div>';
                                        }

                                        // check if the contents are to be overwritten
                                        if (overwriteContent === true) {
                                            // content wants to be overwritten
                                            $('#categories-page #categories-contents-container').html(categoriesContent);
                                        } else {
                                            // content is NOT to be overwritten
                                            if (appendContent === true) {
                                                // append content
                                                $('#categories-page #categories-contents-container').append(categoriesContent);
                                            } else {
                                                // prepend content
                                                $('#categories-page #categories-contents-container').prepend(categoriesContent);
                                            }
                                        }

                                        resolve(categoriesArray.length); // resolve the promise with length of the categoriesArray
                                    }
                                });
                                return _context15.abrupt('return', displayCompletedPromise);

                            case 2:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function displayPageContent(_x7) {
                return _ref15.apply(this, arguments);
            }

            return displayPageContent;
        }(),


        /**
         * method scrolls the page to the top
         * @returns {Promise<void>}
         */
        scrollPageToTop: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                window.setTimeout(function () {
                                    $('#categories-page .page__content').animate({ scrollTop: 0 }, 400);
                                }, 0);

                            case 1:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function scrollPageToTop() {
                return _ref16.apply(this, arguments);
            }

            return scrollPageToTop;
        }()
    },

    /**
     * this is the view-model/controller for the Search page
     */
    searchPageViewModel: {

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                    var searchAutoComplete;
                    return regeneratorRuntime.wrap(function _callee18$(_context18) {
                        while (1) {
                            switch (_context18.prev = _context18.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context18.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context18.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    event.target.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.backButtonClicked;

                                    try {

                                        //instantiate the autocomplete widget for the search input
                                        searchAutoComplete = new ej.dropdowns.AutoComplete({
                                            floatLabelType: "Never",
                                            placeholder: "Search Products",
                                            allowCustom: true,
                                            filterType: "Contains",
                                            minLength: 1000, // minimum number of characters that will automatically trigger autocomplete search
                                            suggestionCount: 20, // specified how many items will be in the popup
                                            dataSource: [],
                                            noRecordsTemplate: 'Tap \'Search\' key to begin search',
                                            focus: function focus() {
                                                // track when the component has focus
                                                // inform user on how to initiate search
                                                $('#search-page-search-input-popover #search-input-popover-list').html('\n                            <ons-list-item modifier="nodivider" lock-on-drag="true">\n                                <div class="center">\n                                    <div style="text-align: center; width: 100%;">\n                                        Tap \'Search\' key to begin search\n                                    </div>\n                                </div>\n                            </ons-list-item>');
                                                // display the popover
                                                $('#search-page-search-input-popover').get(0).show(document.getElementById('search-page-input'));
                                                console.log("AUTOCOMPLETE FOCUS");
                                            },
                                            blur: function blur() {
                                                // track when the component has lost focus
                                                this._allowRemoteSearch = false; // set that remote search is NOT allowed
                                                // hide the popover
                                                $('#search-page-search-input-popover').get(0).hide();
                                                console.log("AUTOCOMPLETE BLUR");
                                            },
                                            change: function change() {
                                                // track when the component's value has changed

                                                var searchValue = ""; // holds the term to be searched for

                                                // check if the search component can perform a remote search
                                                if (this._allowRemoteSearch !== true) {
                                                    // remote search is NOT allowed
                                                    this._allowRemoteSearch = false; // set that remote search is NOT allowed
                                                    return; // exit function
                                                }

                                                // check that there is actually a search term entered in the search component
                                                if (!this.value || this.value.trim() === "") {
                                                    // no search term
                                                    this._allowRemoteSearch = false; // set that remote search is NOT allowed
                                                    return; // exit function
                                                }

                                                // update the search term value
                                                searchValue = this.value.trim();

                                                // inform user that search is ongoing
                                                $('#search-page-search-input-popover #search-input-popover-list').html('\n                            <ons-list-item modifier="nodivider" lock-on-drag="true">\n                                <div class="left">\n                                    <ons-progress-circular indeterminate modifier="pull-hook" \n                                    style="transform: scale(0.6)"></ons-progress-circular>\n                                </div>\n                                <div class="center">\n                                    <div style="text-align: center;">\n                                        Searching for products\n                                    </div>\n                                </div>\n                            </ons-list-item>');
                                                // display the popover
                                                $('#search-page-search-input-popover').get(0).show(document.getElementById('search-page-input'));

                                                // run the actual search in a different event queue
                                                window.setTimeout(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                                                    var searchResultsArray, toast;
                                                    return regeneratorRuntime.wrap(function _callee17$(_context17) {
                                                        while (1) {
                                                            switch (_context17.prev = _context17.next) {
                                                                case 0:
                                                                    searchResultsArray = [];
                                                                    _context17.prev = 1;
                                                                    _context17.next = 4;
                                                                    return utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.loadProducts({ "order": "desc", "orderby": "date", "status": "publish",
                                                                        "type": "variable", "stock_status": "instock", "page": 1, "per_page": 3,
                                                                        "search": searchValue });

                                                                case 4:
                                                                    searchResultsArray = _context17.sent;
                                                                    _context17.next = 7;
                                                                    return utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayPageContent(searchResultsArray[0]);

                                                                case 7:
                                                                    _context17.next = 21;
                                                                    break;

                                                                case 9:
                                                                    _context17.prev = 9;
                                                                    _context17.t0 = _context17['catch'](1);

                                                                    console.log("PRODUCT SEARCH", _context17.t0);
                                                                    // remove the focus from the search autocomplete component
                                                                    $('#search-page #search-page-input').get(0).ej2_instances[0].focusOut();
                                                                    // hide all previously displayed ej2 toast
                                                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                                                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                                                                    // display toast to show that an error
                                                                    toast = $('.timed-page-toast').get(0).ej2_instances[0];

                                                                    toast.cssClass = 'error-ej2-toast';
                                                                    toast.timeOut = 3000;
                                                                    toast.content = 'Sorry, a search error occurred.' + (navigator.connection.type === Connection.NONE ? " Connect to the Internet." : "");
                                                                    toast.dataBind();
                                                                    toast.show();

                                                                case 21:
                                                                case 'end':
                                                                    return _context17.stop();
                                                            }
                                                        }
                                                    }, _callee17, this, [[1, 9]]);
                                                })), 0);
                                                console.log("AUTOCOMPLETE CHANGED");
                                            }
                                        }).appendTo('#search-page-input');
                                    } catch (err) {}

                                case 5:
                                case 'end':
                                    return _context18.stop();
                            }
                        }
                    }, _callee18, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref17.apply(this, arguments);
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
            $('#app-main-page ons-toolbar div.title-bar').html("Search"); // update the title of the page

            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOnlineListener, false);
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
                return regeneratorRuntime.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                // remove listener for when the device does not have Internet connection
                                document.removeEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOfflineListener, false);
                                // remove listener for when the device has Internet connection
                                document.removeEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOnlineListener, false);

                            case 2:
                            case 'end':
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function pageHide() {
                return _ref19.apply(this, arguments);
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
            // hide the search-input popover
            $('#search-page-search-input-popover').get(0).hide();
            // go to the "Categories" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(1);
        },


        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener: function deviceOfflineListener() {
            // display toast to show that there is no internet connection
            var toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see search results";
            toast.dataBind();
            toast.show(); // show ej2 toast
        },


        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener: function deviceOnlineListener() {
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },


        /**
         * method is triggered when the enter button is clicked on the device keyboard
         *
         * @param keyEvent
         * @returns {Promise<void>}
         */
        enterButtonClicked: function () {
            var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(keyEvent) {
                var searchAutoComplete;
                return regeneratorRuntime.wrap(function _callee20$(_context20) {
                    while (1) {
                        switch (_context20.prev = _context20.next) {
                            case 0:
                                // check which key was pressed
                                if (keyEvent.which === kendo.keys.ENTER) // if the enter key was pressed
                                    {
                                        // prevent the default action from occurring
                                        keyEvent.preventDefault();
                                        keyEvent.stopImmediatePropagation();
                                        keyEvent.stopPropagation();
                                        // hide the device keyboard
                                        Keyboard.hide();

                                        // get the search autocomplete component
                                        searchAutoComplete = $('#search-page #search-page-input').get(0).ej2_instances[0];
                                        // update the value of the retrieved component

                                        searchAutoComplete.value = $('#search-page #search-page-input').val();
                                        searchAutoComplete._allowRemoteSearch = true; // flag the remote search can occur
                                        searchAutoComplete.dataBind(); // bind new value to the component
                                        searchAutoComplete.change(); // trigger the change method
                                    }

                            case 1:
                            case 'end':
                                return _context20.stop();
                        }
                    }
                }, _callee20, this);
            }));

            function enterButtonClicked(_x8) {
                return _ref20.apply(this, arguments);
            }

            return enterButtonClicked;
        }(),


        /**
         * method is used to load products to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @param queryParam {Object} holds the objects that contains the query
         * params for the type of products to retrieve
         *
         * @returns {Promise<void>}
         */
        loadProducts: function () {
            var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(queryParam) {
                var pageToAccess = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : queryParam.page || 1;
                var pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : queryParam.per_page || 3;
                var productPromisesArray;
                return regeneratorRuntime.wrap(function _callee21$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:
                                queryParam.page = pageToAccess;
                                queryParam.per_page = pageSize;

                                productPromisesArray = []; // holds the array for the promises used to load the products

                                // check if there is internet connection or not

                                if (navigator.connection.type !== Connection.NONE) {
                                    // there is internet connection
                                    // load the requested products list from the server
                                    productPromisesArray.push(new Promise(function (resolve, reject) {
                                        Promise.resolve($.ajax({
                                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                                            type: "get",
                                            //contentType: "application/x-www-form-urlencoded",
                                            beforeSend: function beforeSend(jqxhr) {
                                                jqxhr.setRequestHeader("Authorization", "Basic " + utopiasoftware[utopiasoftware_app_namespace].accessor);
                                            },
                                            dataType: "json",
                                            timeout: 240000, // wait for 4 minutes before timeout of request
                                            processData: true,
                                            data: queryParam
                                        })).then(function (productsArray) {

                                            resolve(productsArray); // resolve the parent promise with the data gotten from the server
                                        }).catch(function (err) {
                                            // an error occurred
                                            console.log("LOAD SEARCH PRODUCTS", err);
                                            reject(err); // reject the parent promise with the error
                                        });
                                    }));
                                } // end of loading products with Internet Connection
                                else {
                                        // there is no internet connection
                                        productPromisesArray.push(Promise.reject("no internet connection"));
                                    }

                                return _context21.abrupt('return', Promise.all(productPromisesArray));

                            case 5:
                            case 'end':
                                return _context21.stop();
                        }
                    }
                }, _callee21, this);
            }));

            function loadProducts(_x11) {
                return _ref21.apply(this, arguments);
            }

            return loadProducts;
        }(),


        /**
         * method is used to display the retrieved products on the search popover
         *
         * @param productsArray
         *
         * @returns {Promise<void>}
         */
        displayPageContent: function () {
            var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(productsArray) {
                var displayCompletedPromise;
                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                    while (1) {
                        switch (_context22.prev = _context22.next) {
                            case 0:
                                displayCompletedPromise = new Promise(function (resolve, reject) {

                                    var productsContent = ""; // holds the contents for the products

                                    // check if the productsArray is empty or not
                                    if (productsArray.length <= 0) {
                                        // there are no new content to display
                                        // inform the user that no result for the search was founc'
                                        $('#search-page-search-input-popover #search-input-popover-list').html('<ons-list-item modifier="nodivider" lock-on-drag="true">\n                                <div class="center">\n                                    <div style="text-align: center; width: 100%;">\n                                        No Results Found\n                                    </div>\n                                </div>\n                            </ons-list-item>');
                                        resolve(productsArray.length); // resolve promise with the length of the products array
                                    } else {
                                        // there are some products to display

                                        // loop through the array content and display it
                                        for (var index = 0; index < productsArray.length; index++) {

                                            productsContent += '<ons-list-item modifier="nodivider" tappable lock-on-drag="true">\n                                <div class="left">\n                                    <div class="search-result-image" style="background-image: url(\'' + productsArray[index].images[0].src + '\'); \n                                                            width: 2em; height: 2em"></div>\n                                </div>\n                                <div class="center">\n                                    <div style="text-align: center;">\n                                        ' + productsArray[index].name + '\n                                    </div>\n                                </div>\n                            </ons-list-item>';
                                        }

                                        // append the "Load More" search item
                                        productsContent += '<ons-list-item modifier="nodivider" lock-on-drag="true">\n                                <div class="center">\n                                    <div style="text-align: center; width: 100%; font-weight: bold;">\n                                        Load More...\n                                    </div>\n                                </div>\n                            </ons-list-item>';
                                        // attach the new search results to the search popover
                                        $('#search-page-search-input-popover #search-input-popover-list').html(productsContent);

                                        resolve(productsArray.length); // resolve the promise with length of the productsArray
                                    }
                                });
                                return _context22.abrupt('return', displayCompletedPromise);

                            case 2:
                            case 'end':
                                return _context22.stop();
                        }
                    }
                }, _callee22, this);
            }));

            function displayPageContent(_x12) {
                return _ref22.apply(this, arguments);
            }

            return displayPageContent;
        }()
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
                var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
                    var accordion;
                    return regeneratorRuntime.wrap(function _callee23$(_context23) {
                        while (1) {
                            switch (_context23.prev = _context23.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context23.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context23.abrupt('return');

                                case 3:

                                    // listen for when the device back button is tapped
                                    event.target.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.backButtonClicked;

                                    try {
                                        accordion = new ej.navigations.Accordion({
                                            expandMode: 'Single'
                                        });

                                        accordion.appendTo('#account-personal-accordion');
                                        accordion.expandItem(true, 0);
                                    } catch (err) {}

                                case 5:
                                case 'end':
                                    return _context23.stop();
                            }
                        }
                    }, _callee23, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref23.apply(this, arguments);
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
            $('#app-main-page ons-toolbar div.title-bar').html("Account"); // update the title of the page
            window.SoftInputMode.set('adjustPan');
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
                return regeneratorRuntime.wrap(function _callee24$(_context24) {
                    while (1) {
                        switch (_context24.prev = _context24.next) {
                            case 0:
                            case 'end':
                                return _context24.stop();
                        }
                    }
                }, _callee24, this);
            }));

            function pageHide() {
                return _ref24.apply(this, arguments);
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
            // go to the "Home" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(2);
        }
    },

    /**
     * this is the view-model/controller for the Login page
     */
    loginPageViewModel: {

        /**
         * used to hold the parsley form validation object for the login page
         */
        loginFormValidator: null,

        /**
         * used to hold the parsley form validation object for the signup page
         */
        signupFormValidator: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25() {
                    return regeneratorRuntime.wrap(function _callee25$(_context25) {
                        while (1) {
                            switch (_context25.prev = _context25.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context25.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context25.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked;

                                    // listen for when the login-carousel has changed/slide used to change screen from login to signup etc
                                    $thisPage.on("postchange", "#login-carousel", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.changeScreenCarouselPostChange);

                                    // listen for when the login-carousel has changed/slide used to hide the tooltips for the previous displayed screen
                                    $thisPage.on("postchange", "#login-carousel", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.hideTooltipsCarouselPostChange);

                                    // initialise the login form validation
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator = $('#login-page #login-form').parsley();

                                    // initialise the login form validation
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator = $('#login-page #signup-form').parsley();

                                    // listen for log in form field validation failure event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('field:error', function (fieldInstance) {
                                        // get the element that triggered the field validation error and use it to display tooltip
                                        // display tooltip
                                        var tooltip = $('#login-page #login-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                                        tooltip.content = fieldInstance.getErrorsMessages()[0];
                                        tooltip.dataBind();
                                        tooltip.open(fieldInstance.$element.get(0));
                                    });

                                    // listen for log in form field validation success event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('field:success', function (fieldInstance) {
                                        // hide tooltip from element
                                        var tooltip = $('#login-page #login-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                                        tooltip.close();
                                    });

                                    // listen for log in form validation success
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('form:success', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidated);

                                    // listen for signup form field validation failure event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('field:error', function (fieldInstance) {
                                        // get the element that triggered the field validation error and use it to display tooltip
                                        // display tooltip
                                        var tooltip = $('#login-page #signup-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                                        tooltip.content = fieldInstance.getErrorsMessages()[0];
                                        tooltip.dataBind();
                                        tooltip.open(fieldInstance.$element.get(0));
                                    });

                                    // listen for sign up form field validation success event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('field:success', function (fieldInstance) {
                                        // hide tooltip from element
                                        var tooltip = $('#login-page #signup-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                                        tooltip.close();
                                    });

                                    // listen for log in form validation success
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('form:success', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidated);

                                    // listen for scroll event on the page to adjust the tooltips when page scrolls
                                    $('#login-page .login-page-form-container').on("scroll", function () {

                                        // place function execution in the event queue to be executed ASAP
                                        window.setTimeout(function () {
                                            console.log("CAROUSEL SCROLL");
                                            switch ($('#login-page #login-carousel').get(0).getActiveIndex()) {// get the active carousel item
                                                case 0:
                                                    // first carousel item is active, so adjust the input elements on the login form
                                                    $("#login-page #login-form ons-input").each(function (index, element) {
                                                        document.getElementById('login-form').ej2_instances[index].refresh(element);
                                                    });
                                                    break;

                                                case 1:
                                                    // second carousel item is active, so adjust the input elements on the login form
                                                    $("#login-page #signup-form ons-input").each(function (index, element) {
                                                        document.getElementById('signup-form').ej2_instances[index].refresh(element);
                                                    });
                                                    break;

                                                case 2:

                                                    break;
                                            }
                                        }, 0);
                                    });

                                    try {
                                        // create the tooltip objects for the signin form
                                        $('#login-form ons-input', $thisPage).each(function (index, element) {
                                            element._utopiasoftware_validator_index = index;
                                            // create the tool tips for every element being validated, but attach it to the html form object
                                            new ej.popups.Tooltip({
                                                cssClass: 'utopiasoftware-ej2-validation-tooltip',
                                                position: 'TopCenter',
                                                opensOn: 'Custom'
                                            }).appendTo($('#login-page #login-form').get(0));
                                        });

                                        // create the tooltip objects for the signup form
                                        $('#signup-form ons-input', $thisPage).each(function (index, element) {
                                            element._utopiasoftware_validator_index = index;
                                            // create the tool tips for every element being validated, but attach it to the html form object
                                            new ej.popups.Tooltip({
                                                cssClass: 'utopiasoftware-ej2-validation-tooltip',
                                                position: 'TopCenter',
                                                opensOn: 'Custom'
                                            }).appendTo($('#login-page #signup-form').get(0));
                                        });

                                        // create the button for showing password visibility on the signup page
                                        new ej.buttons.Button({
                                            isToggle: true,
                                            cssClass: 'e-flat e-small e-round',
                                            iconCss: "zmdi zmdi-eye",
                                            iconPosition: "Left"
                                        }).appendTo($('#signup-password-view-button', $thisPage).get(0));
                                    } catch (err) {}

                                case 16:
                                case 'end':
                                    return _context25.stop();
                            }
                        }
                    }, _callee25, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref25.apply(this, arguments);
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
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26() {
                return regeneratorRuntime.wrap(function _callee26$(_context26) {
                    while (1) {
                        switch (_context26.prev = _context26.next) {
                            case 0:

                                // remove listener for when the device keyboard is shown
                                window.removeEventListener('keyboardDidShow', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);

                                // hide the tooltips on the login form
                                $('#login-page #login-form').get(0).ej2_instances.forEach(function (tooltipArrayElem) {
                                    // hide the tooltip
                                    tooltipArrayElem.close();
                                });

                                // hide the tooltips on the signup form
                                $('#login-page #signup-form').get(0).ej2_instances.forEach(function (tooltipArrayElem) {
                                    // hide the tooltip
                                    tooltipArrayElem.close();
                                });

                                // reset all form validator objects
                                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.reset();
                                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.reset();

                            case 5:
                            case 'end':
                                return _context26.stop();
                        }
                    }
                }, _callee26, this);
            }));

            function pageHide() {
                return _ref26.apply(this, arguments);
            }

            return pageHide;
        }(),

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {

            // destroy the tooltips on the login form
            $('#login-page #login-form').get(0).ej2_instances.forEach(function (tooltipArrayElem) {
                // destroy the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the tooltips on the signup form
            $('#login-page #signup-form').get(0).ej2_instances.forEach(function (tooltipArrayElem) {
                // hide the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.destroy();
        },

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
         * method is used to track changes on the carousel slides for
         * displaying the various screens i.e. login or signup etc
         *
         * @param event
         */
        changeScreenCarouselPostChange: function changeScreenCarouselPostChange(event) {

            // use the switch case to determine what carousel is being shown
            switch (event.originalEvent.activeIndex) {// get the index of the active carousel item
                case 0:
                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(2) input").prop("checked", true);
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(1) input").prop("checked", false);
                    $("#login-page ons-carousel-item.third .login-segment button input").prop("checked", false);
                    // scroll to the top of the active carousel item
                    $('#login-page ons-carousel-item.first .login-page-form-container').scrollTop(0);

                    break;

                case 1:
                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(1) input").prop("checked", true);
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(2) input").prop("checked", false);
                    $("#login-page ons-carousel-item.third .login-segment button input").prop("checked", false);
                    // scroll to the top of the active carousel item
                    $('#login-page ons-carousel-item.second .login-page-form-container').scrollTop(0);
                    break;

                case 2:
                    // reset the the segment button contained in the other carousel items to their initial state
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(1) input").prop("checked", true);
                    $("#login-page ons-carousel-item.first .login-segment button:nth-of-type(2) input").prop("checked", false);
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(2) input").prop("checked", true);
                    $("#login-page ons-carousel-item.second .login-segment button:nth-of-type(1) input").prop("checked", false);
                    $('#login-page ons-carousel-item.third .login-page-form-container').scrollTop(0);
                    break;
            }
        },


        /**
         * method is used to track changes on the carousel slides for
         * hiding the tooltips on the previously displayed slide
         *
         * @param event
         */
        hideTooltipsCarouselPostChange: function hideTooltipsCarouselPostChange(event) {

            // use the switch case to determine what carousel item was PREVIOUSLY shown
            switch (event.originalEvent.lastActiveIndex) {// get the index of the LAST active carousel item
                case 0:

                    // hide the tooltips on the login form
                    $('#login-page #login-form').get(0).ej2_instances.forEach(function (tooltipArrayElem) {
                        // hide the tooltip
                        tooltipArrayElem.close();
                    });
                    break;

                case 1:

                    // hide the tooltips on the login form
                    $('#login-page #signup-form').get(0).ej2_instances.forEach(function (tooltipArrayElem) {
                        // hide the tooltip
                        tooltipArrayElem.close();
                    });
                    break;

                case 2:

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
            // get the height of the keyboard and add 6000px to it
            var adjustedKeyboardHeight = Math.ceil(event.keyboardHeight) + 6000;

            switch ($('#login-page #login-carousel').get(0).getActiveIndex()) {// get the active carousel item
                case 0:
                    // add padding to the bottom, to allow elements to scroll into view
                    $("#login-page ons-carousel-item.first .login-page-form-container").css({ "padding-bottom": adjustedKeyboardHeight + "px" });
                    // scroll to the currently focused input element
                    $("#login-page ons-carousel-item.first .login-page-form-container").scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top - 30));
                    break;

                case 1:
                    // add padding to the bottom, to allow elements to scroll into view
                    $("#login-page ons-carousel-item.second .login-page-form-container").css({ "padding-bottom": adjustedKeyboardHeight + "px" });
                    // scroll to the currently focused input element
                    $("#login-page ons-carousel-item.second .login-page-form-container").scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top - 30));
                    break;

                case 2:

                    break;
            }
        },


        /**
         * method is triggered when the "Sign In" button is clicked
         *
         * @returns {Promise<void>}
         */
        signinButtonClicked: function () {
            var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27() {
                return regeneratorRuntime.wrap(function _callee27$(_context27) {
                    while (1) {
                        switch (_context27.prev = _context27.next) {
                            case 0:

                                // run the validation method for the sign-in form
                                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.whenValidate();

                            case 1:
                            case 'end':
                                return _context27.stop();
                        }
                    }
                }, _callee27, this);
            }));

            function signinButtonClicked() {
                return _ref27.apply(this, arguments);
            }

            return signinButtonClicked;
        }(),


        /**
         * method is triggered when the "Sign Up" button is clicked
         *
         * @returns {Promise<void>}
         */
        signupButtonClicked: function () {
            var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28() {
                return regeneratorRuntime.wrap(function _callee28$(_context28) {
                    while (1) {
                        switch (_context28.prev = _context28.next) {
                            case 0:

                                // run the validation method for the sign-in form
                                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.whenValidate();

                            case 1:
                            case 'end':
                                return _context28.stop();
                        }
                    }
                }, _callee28, this);
            }));

            function signupButtonClicked() {
                return _ref28.apply(this, arguments);
            }

            return signupButtonClicked;
        }(),


        /**
         * method is triggered when the login form is successfully validated
         *
         * @returns {Promise<void>}
         */
        loginFormValidated: function () {
            var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
                return regeneratorRuntime.wrap(function _callee29$(_context29) {
                    while (1) {
                        switch (_context29.prev = _context29.next) {
                            case 0:
                            case 'end':
                                return _context29.stop();
                        }
                    }
                }, _callee29, this);
            }));

            function loginFormValidated() {
                return _ref29.apply(this, arguments);
            }

            return loginFormValidated;
        }(),


        /**
         * method is triggered when the sign up form is successfully validated
         *
         * @returns {Promise<void>}
         */
        signupFormValidated: function () {
            var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
                return regeneratorRuntime.wrap(function _callee30$(_context30) {
                    while (1) {
                        switch (_context30.prev = _context30.next) {
                            case 0:
                            case 'end':
                                return _context30.stop();
                        }
                    }
                }, _callee30, this);
            }));

            function signupFormValidated() {
                return _ref30.apply(this, arguments);
            }

            return signupFormValidated;
        }()
    },

    /**
     * this is the view-model/controller for the Products page
     */
    productsPageViewModel: {

        /**
         * property holds the current "page" of the categories being accessed
         */
        currentPage: 0,

        /**
         * property holds the size i.e. number of items that can be contained in currentPage being accessed
         */
        pageSize: 20,

        /**
         * property holds the height of the "content view" for the page
         */
        viewContentHeight: 0,

        /**
         * property holds the index position of the last active
         * navigation tab before user landed on this page
         */
        lastActiveNavTab: 0,

        /**
         * property holds the current query parameter used to display the products on screen
         */
        currentQueryParam: {},

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31() {
                    return regeneratorRuntime.wrap(function _callee31$(_context31) {
                        while (1) {
                            switch (_context31.prev = _context31.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context31.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context31.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    event.target.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.backButtonClicked;

                                    // add method to handle page-infinite-scroll
                                    event.target.onInfiniteScroll = utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageInfiniteScroll;

                                    // add method to handle the loading action of the pull-to-refresh widget
                                    $('#products-page-pull-hook', $thisPage).get(0).onAction = utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pagePullHookAction;

                                    // register listener for the pull-to-refresh widget
                                    $('#products-page-pull-hook', $thisPage).on("changestate", function (event) {

                                        // check the state of the pull-to-refresh widget
                                        switch (event.originalEvent.state) {
                                            case 'initial':
                                                // update the displayed content
                                                $('#products-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                                                break;

                                            case 'preaction':
                                                // update the displayed content
                                                $('#products-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                                                break;

                                            case 'action':
                                                // update the displayed content
                                                $('#products-page-pull-hook-fab', event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                                                break;
                                        }
                                    });

                                    // get the height of the view content container
                                    utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.viewContentHeight = Math.floor($('#products-page .page__content').height());
                                    console.log("CONTENT HEIGHT", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.viewContentHeight);

                                    // listen for the scroll event on the page
                                    $('#products-page .page__content').on("scroll", function () {
                                        // handle the logic in a different event queue slot
                                        window.setTimeout(function () {
                                            // get the scrollTop position of the view content
                                            var scrollTop = Math.floor($('#products-page .page__content').scrollTop());
                                            console.log("SCROLL TOP", scrollTop);
                                            // get the percentage of scroll that has taken place from the top position
                                            var percentageScroll = scrollTop / utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.viewContentHeight * 100;
                                            if (percentageScroll >= 50) {
                                                // if the scroll position is >= halfway
                                                $('#products-page #products-page-scroll-top-fab').css({ "transform": "scale(1)",
                                                    "display": "inline-block" });
                                            } else {
                                                // if the scroll position is < halfway
                                                $('#products-page #products-page-scroll-top-fab').css({ "transform": "scale(0)" });
                                            }
                                        }, 0);
                                    });

                                    // listen for when the navigation tab has changed and update the lastActiveNavTab
                                    $('#app-main-tabbar').on("prechange", function (event) {
                                        if (event.originalEvent.index === 4) {
                                            // if the tab index is this page, don't update the lastActiveNavTab
                                            return; // exit the method
                                        }

                                        utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.lastActiveNavTab = event.originalEvent.index;
                                        console.log("TAB CHANGED", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.lastActiveNavTab);
                                    });

                                    // listen for when a product card is clicked
                                    $thisPage.on("click", ".e-card > *:not(.e-card-actions)", function () {
                                        // load the product-details page
                                        //$('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
                                    });

                                    try {} catch (err) {}

                                case 13:
                                case 'end':
                                    return _context31.stop();
                            }
                        }
                    }, _callee31, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref31.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow(event) {
            // flag that page infinite scroll should NOT be allowed
            event.target._allowInfinitePageScroll = false;
            $('#app-main-page ons-toolbar div.title-bar').html("Products"); // change the title of the screen
            // show the preloader
            $('#products-page .page-preloader').css("display", "block");
            // empty the content of the page
            $('#products-page #products-contents-container').html('');
            // hide the page scroll fab
            $('#products-page #products-page-scroll-top-fab').css({ "display": "none" });

            console.log("PAGE SHOW");

            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOnlineListener, false);
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32(event) {
                return regeneratorRuntime.wrap(function _callee32$(_context32) {
                    while (1) {
                        switch (_context32.prev = _context32.next) {
                            case 0:
                                // flag that page infinite scroll should NOT be allowed
                                event.target._allowInfinitePageScroll = false;

                                console.log("PAGE HIDE");

                                // remove listener for when the device does not have Internet connection
                                document.removeEventListener("offline", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOfflineListener, false);
                                // remove listener for when the device has Internet connection
                                document.removeEventListener("online", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOnlineListener, false);

                                // remove all the infinite load indicator from the bottom of the page (if any exist)
                                $('#products-page .page__content .infinite-load-container').remove();

                            case 5:
                            case 'end':
                                return _context32.stop();
                        }
                    }
                }, _callee32, this);
            }));

            function pageHide(_x13) {
                return _ref32.apply(this, arguments);
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
            // go to the last active page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.lastActiveNavTab);
        },


        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener: function deviceOfflineListener() {
            // display toast to show that there is no internet connection
            var toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see updated products";
            toast.dataBind();
            toast.show(); // show ej2 toast
        },


        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener: function deviceOnlineListener() {
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },


        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        pagePullHookAction: function () {
            var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33() {
                var doneCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var productArray, toast;
                return regeneratorRuntime.wrap(function _callee33$(_context33) {
                    while (1) {
                        switch (_context33.prev = _context33.next) {
                            case 0:
                                // disable pull-to-refresh widget till loading is done
                                $('#products-page #products-page-pull-hook').attr("disabled", true);
                                // hide all previously displayed ej2 toast
                                $('.page-toast').get(0).ej2_instances[0].hide('All');

                                _context33.prev = 2;
                                _context33.next = 5;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts(utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentQueryParam, 1);

                            case 5:
                                productArray = _context33.sent;
                                _context33.next = 8;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);

                            case 8:
                                _context33.next = 18;
                                break;

                            case 10:
                                _context33.prev = 10;
                                _context33.t0 = _context33['catch'](2);
                                // an error occurred
                                console.log("PROJECT REFRESH ERROR", _context33.t0);
                                // display toast to show that error
                                toast = $('.page-toast').get(0).ej2_instances[0];

                                toast.cssClass = 'error-ej2-toast';
                                toast.content = "Sorry, an error occurred. Refresh to try again";
                                toast.dataBind();
                                toast.show();

                            case 18:
                                _context33.prev = 18;

                                // enable pull-to-refresh widget till loading is done
                                $('#products-page #products-page-pull-hook').removeAttr("disabled");
                                // signal that loading is done
                                doneCallBack();
                                return _context33.finish(18);

                            case 22:
                            case 'end':
                                return _context33.stop();
                        }
                    }
                }, _callee33, this, [[2, 10, 18, 22]]);
            }));

            function pagePullHookAction() {
                return _ref33.apply(this, arguments);
            }

            return pagePullHookAction;
        }(),


        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        pageInfiniteScroll: function () {
            var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34() {
                var doneCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var productArray, toast;
                return regeneratorRuntime.wrap(function _callee34$(_context34) {
                    while (1) {
                        switch (_context34.prev = _context34.next) {
                            case 0:
                                if (!($('#products-page').get(0)._allowInfinitePageScroll === false)) {
                                    _context34.next = 3;
                                    break;
                                }

                                // page infinite scroll is NOT allowed
                                doneCallBack();
                                return _context34.abrupt('return');

                            case 3:
                                console.log("PRODUCT PULL-HOOK CALLED");
                                // append an infinite load indicator to the bottom of the page
                                $('#products-page .page__content').append('<div class="infinite-load-container" style="text-align: center">\n                        <ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>\n                    </div>');
                                // hide all previously displayed ej2 toast
                                $('.page-toast').get(0).ej2_instances[0].hide('All');

                                productArray = []; // holds the array of products retrieved for display

                                _context34.prev = 7;
                                _context34.next = 10;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts(utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentQueryParam, utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage + 1);

                            case 10:
                                productArray = _context34.sent;
                                _context34.next = 13;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0], true, false);

                            case 13:
                                _context34.next = 22;
                                break;

                            case 15:
                                _context34.prev = 15;
                                _context34.t0 = _context34['catch'](7);
                                // an error occurred
                                // display toast to show that error
                                toast = $('.page-toast').get(0).ej2_instances[0];

                                toast.cssClass = 'error-ej2-toast';
                                toast.content = "Sorry, an error occurred. Refresh to try again";
                                toast.dataBind();
                                toast.show();

                            case 22:
                                _context34.prev = 22;

                                // check if any new products were retrieved
                                if (productArray && productArray[0].length > 0) {
                                    // products were retrieve
                                    // remove the infinite load indicator from the bottom of the page
                                    $('#products-page .page__content .infinite-load-container').remove();
                                } else {
                                    // no products were retrieved

                                    $('#products-page .page__content .infinite-load-container').css({ "visibility": "hidden" });
                                }
                                // signal that loading is done
                                doneCallBack();
                                return _context34.finish(22);

                            case 26:
                            case 'end':
                                return _context34.stop();
                        }
                    }
                }, _callee34, this, [[7, 15, 22, 26]]);
            }));

            function pageInfiniteScroll() {
                return _ref34.apply(this, arguments);
            }

            return pageInfiniteScroll;
        }(),


        /**
         * method is used to load products to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @param queryParam {Object} holds the objects that contains the query
         * params for the type of products to retrieve
         *
         * @returns {Promise<void>}
         */
        loadProducts: function () {
            var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35(queryParam) {
                var pageToAccess = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : queryParam.page || utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage + 1;
                var pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : queryParam.per_page || utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageSize;
                var productPromisesArray, toast;
                return regeneratorRuntime.wrap(function _callee35$(_context35) {
                    while (1) {
                        switch (_context35.prev = _context35.next) {
                            case 0:
                                queryParam.page = pageToAccess;
                                queryParam.per_page = pageSize;

                                productPromisesArray = []; // holds the array for the promises used to load the products

                                // check if there is internet connection or not

                                if (navigator.connection.type !== Connection.NONE) {
                                    // there is internet connection
                                    // load the requested products list from the server
                                    productPromisesArray.push(new Promise(function (resolve, reject) {
                                        Promise.resolve($.ajax({
                                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                                            type: "get",
                                            //contentType: "application/x-www-form-urlencoded",
                                            beforeSend: function beforeSend(jqxhr) {
                                                jqxhr.setRequestHeader("Authorization", "Basic " + utopiasoftware[utopiasoftware_app_namespace].accessor);
                                            },
                                            dataType: "json",
                                            timeout: 240000, // wait for 4 minutes before timeout of request
                                            processData: true,
                                            data: queryParam
                                        })).then(function (productsArray) {
                                            // check if there is any data to cache in the app database
                                            if (productsArray.length > 0) {
                                                // there is data to cache
                                                // generate an id for the data being cached
                                                var cachedDataId = ("" + pageToAccess).padStart(7, "0") + "products";
                                                // save the retrieved data to app database as cached data
                                                utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: cachedDataId, docType: "PRODUCTS", products: productsArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                                // update the current page being viewed
                                                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage = queryParam.page;
                                                // update the current query parameter for the page
                                                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentQueryParam = queryParam;
                                            }
                                            resolve(productsArray); // resolve the parent promise with the data gotten from the server
                                        }).catch(function (err) {
                                            // an error occurred
                                            console.log("LOAD PRODUCTS", err);
                                            reject(err); // reject the parent promise with the error
                                        });
                                    }));
                                } // end of loading products with Internet Connection
                                else {
                                        // there is no internet connection
                                        // display toast to show that there is no internet connection
                                        toast = $('.page-toast').get(0).ej2_instances[0];

                                        toast.hide('All');
                                        toast.cssClass = 'default-ej2-toast';
                                        toast.content = "No Internet connection. Pull down to refresh and see updated products";
                                        toast.dataBind();
                                        toast.show();
                                        // load the requested products from cached data
                                        productPromisesArray.push(new Promise(function (resolve, reject) {
                                            // generate the id for the cached data being retrieved
                                            var cachedDataId = ("" + pageToAccess).padStart(7, "0") + "products";
                                            Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData(cachedDataId, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function (cachedProductsData) {
                                                resolve(cachedProductsData.products); // resolve the parent promise with the cached products data
                                            }).catch(function (err) {
                                                // an error occurred
                                                console.log("LOAD PRODUCTS", err);
                                                reject(err); // reject the parent promise with the error
                                            });
                                        }));
                                    }

                                return _context35.abrupt('return', Promise.all(productPromisesArray));

                            case 5:
                            case 'end':
                                return _context35.stop();
                        }
                    }
                }, _callee35, this);
            }));

            function loadProducts(_x18) {
                return _ref35.apply(this, arguments);
            }

            return loadProducts;
        }(),


        /**
         * method is used to display the retrieved products on the app screen
         *
         * @param productsArray
         *
         * @param appendContent {Boolean} if the value is true,
         * add each content to the end of other items on the screen.
         * Else, prepend the content to the top of other items
         *
         * @param overwriteContent {Boolean} should the old content be replaced or added to
         *
         * @returns {Promise<void>}
         */
        displayPageContent: function () {
            var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36(productsArray) {
                var appendContent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                var overwriteContent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
                var index, displayCompletedPromise;
                return regeneratorRuntime.wrap(function _callee36$(_context36) {
                    while (1) {
                        switch (_context36.prev = _context36.next) {
                            case 0:
                                for (index = 0; index < 4; index++) {
                                    // REMOVE THIS LATER JUST FOR TEST TODO
                                    productsArray.push.apply(productsArray, _toConsumableArray(productsArray));
                                }
                                displayCompletedPromise = new Promise(function (resolve, reject) {

                                    var productsContent = ""; // holds the contents for the products

                                    // check if the productsArray is empty or not
                                    if (productsArray.length <= 0) {
                                        // there are no new content to display
                                        resolve(productsArray.length); // resolve promise with the length of the products array
                                    } else {
                                        // there are some products to display

                                        // loop through the array content and display it
                                        for (var _index = 0; _index < productsArray.length; _index++) {
                                            if (!productsArray[_index].regular_price || productsArray[_index].regular_price == "") {
                                                // regular price was NOT set, so set it
                                                productsArray[_index].regular_price = "0.00";
                                            }

                                            productsContent += '<div class="col-xs-4" ';
                                            if ((_index + 1) % 3 !== 0) {
                                                // this is NOT the last column in the row
                                                productsContent += 'style="border-right: 1px lightgray solid; border-bottom: 1px lightgray solid">';
                                            } else {
                                                // this is the last column in the row
                                                productsContent += 'style="border-bottom: 1px lightgray solid">';
                                            }
                                            productsContent += '\n                        <ons-ripple background="rgba(63, 81, 181, 0.3)"></ons-ripple>\n                        <div class="e-card">\n                            <div class="e-card-image" style="min-height: 100px; \n                            background-image: url(\'' + productsArray[_index].images[0].src + '\');">\n                            ' + (productsArray[_index].on_sale === true ? '\n                            <span class="e-badge e-badge-danger" style="float: right; clear: both; \n                                                    background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 0.6em;">\n                                                    ' + Math.ceil(Math.abs(kendo.parseFloat(productsArray[_index].price) - kendo.parseFloat(productsArray[_index].regular_price)) / kendo.parseFloat(productsArray[_index].regular_price === "0.00" ? productsArray[_index].price : productsArray[_index].regular_price) * 100) + '% OFF\n                             </span>' : "") + '\n                            </div>\n                            <div class="e-card-header">\n                                <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">\n                                    <div class="e-card-sub-title" style="color: #000000; font-size: 14px; text-align: center; text-transform: capitalize">\n                                        ' + productsArray[_index].name + '\n                                    </div>\n                        <div style="color: gold; font-size: 0.6em !important; white-space: nowrap !important; \n                        text-overflow: ellipsis; overflow: hidden;">\n                        ' + (Math.floor(kendo.parseFloat(productsArray[_index].average_rating)) > 0 ? '<ons-icon icon="md-star" fixed-width></ons-icon>'.repeat(Math.floor(kendo.parseFloat(productsArray[_index].average_rating))) : '<ons-icon icon="md-star-outline" style="color: lightgray" fixed-width></ons-icon>'.repeat(5)) + '\n                            <span style="display: inline-block; color: gray;">\n                            ' + (Math.floor(kendo.parseFloat(productsArray[_index].average_rating)) > 0 ? '(' + productsArray[_index].rating_count + ')' : "") + '\n                           </span>\n                        </div>\n                        <div class="e-card-sub-title" style="text-align: left;">&#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[_index].price), "n2") + '</div>\n                        <div class="e-card-sub-title" style="text-align: left; text-decoration: line-through; \n                        ' + (productsArray[_index].on_sale === true ? "visibility: visible" : "visibility: hidden") + '">&#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[_index].regular_price), "n2") + '</div>\n                        </div>\n                        </div>\n                        </div>\n                        </div>';
                                        }

                                        // check if the contents are to be overwritten
                                        if (overwriteContent === true) {
                                            // content wants to be overwritten
                                            $('#products-page #products-contents-container').html(productsContent);
                                        } else {
                                            // content is NOT to be overwritten
                                            if (appendContent === true) {
                                                // append content
                                                $('#products-page #products-contents-container').append(productsContent);
                                            } else {
                                                // prepend content
                                                $('#products-page #products-contents-container').prepend(productsContent);
                                            }
                                        }

                                        // allow infinite page scroll to be triggered
                                        $('#products-page').get(0)._allowInfinitePageScroll = true;
                                        resolve(productsArray.length); // resolve the promise with length of the productsArray
                                    }
                                });
                                return _context36.abrupt('return', displayCompletedPromise);

                            case 3:
                            case 'end':
                                return _context36.stop();
                        }
                    }
                }, _callee36, this);
            }));

            function displayPageContent(_x21) {
                return _ref36.apply(this, arguments);
            }

            return displayPageContent;
        }(),


        /**
         * method scrolls the page to the top
         * @returns {Promise<void>}
         */
        scrollPageToTop: function () {
            var _ref37 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37() {
                return regeneratorRuntime.wrap(function _callee37$(_context37) {
                    while (1) {
                        switch (_context37.prev = _context37.next) {
                            case 0:
                                window.setTimeout(function () {
                                    $('#products-page .page__content').animate({ scrollTop: 0 }, 400);
                                }, 0);

                            case 1:
                            case 'end':
                                return _context37.stop();
                        }
                    }
                }, _callee37, this);
            }));

            function scrollPageToTop() {
                return _ref37.apply(this, arguments);
            }

            return scrollPageToTop;
        }()
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
                var _ref38 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee38() {
                    var addToCartButton, customiseProductButton, wishListButton, compareButton, reviewButton, shareButton;
                    return regeneratorRuntime.wrap(function _callee38$(_context38) {
                        while (1) {
                            switch (_context38.prev = _context38.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context38.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context38.abrupt('return');

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
                                    return _context38.stop();
                            }
                        }
                    }, _callee38, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref38.apply(this, arguments);
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
            var _ref39 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee39() {
                return regeneratorRuntime.wrap(function _callee39$(_context39) {
                    while (1) {
                        switch (_context39.prev = _context39.next) {
                            case 0:
                            case 'end':
                                return _context39.stop();
                        }
                    }
                }, _callee39, this);
            }));

            function pageHide() {
                return _ref39.apply(this, arguments);
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