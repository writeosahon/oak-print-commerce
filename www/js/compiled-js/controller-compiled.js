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

                            // create the ej2 toast component for the app
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

                            _context.prev = 6;
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
                            _context.prev = 10;
                            _context.next = 13;
                            return new Promise(function (resolve, reject) {
                                NativeStorage.getItem("utopiasoftware-oak-print-service-secure-key", resolve, reject);
                            });

                        case 13:
                            secureKey = _context.sent;
                            _context.next = 21;
                            break;

                        case 16:
                            _context.prev = 16;
                            _context.t0 = _context['catch'](10);
                            _context.next = 20;
                            return new Promise(function (resolve, reject) {
                                NativeStorage.setItem("utopiasoftware-oak-print-service-secure-key", { password: Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine) }, resolve, reject);
                            });

                        case 20:
                            secureKey = _context.sent;

                        case 21:
                            _context.next = 23;
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

                        case 23:
                            _context.next = 28;
                            break;

                        case 25:
                            _context.prev = 25;
                            _context.t1 = _context['catch'](6);

                            console.log("APP LOADING ERROR", _context.t1);

                        case 28:
                            _context.prev = 28;

                            // set status bar color
                            StatusBar.backgroundColorByHexString("#363E7C");
                            navigator.splashscreen.hide(); // hide the splashscreen
                            utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fully loaded and ready
                            return _context.finish(28);

                        case 33:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[6, 25, 28, 33], [10, 16]]);
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
                                        cellSelector: '.col-xs-5',
                                        autoPlay: 3000,
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
                                        $('#app-main-navigator').get(0).pushPage("product-details-page.html", { animation: "lift" });
                                    });
                                    // assign the "New Product" carousel to the appropriate object
                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel = newProductsCarousel;

                                    // create the "Featured Products" carousel
                                    featuredProductsCarousel = new Flickity($('#home-page #home-featured-design-block .row').get(0), {
                                        // options
                                        wrapAround: true,
                                        groupCells: 1,
                                        cellSelector: '.col-xs-5',
                                        autoPlay: 4000,
                                        pauseAutoPlayOnHover: false,
                                        dragThreshold: 10,
                                        initialIndex: 0,
                                        cellAlign: 'left',
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
                                        cellSelector: '.col-xs-5',
                                        autoPlay: 5000,
                                        pauseAutoPlayOnHover: false,
                                        dragThreshold: 10,
                                        initialIndex: 0,
                                        cellAlign: 'left',
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
                                    _context2.next = 29;
                                    break;

                                case 26:
                                    _context2.prev = 26;
                                    _context2.t0 = _context2['catch'](6);

                                    console.log("HOME PAGE ERROR", _context2.t0);

                                case 29:
                                    _context2.prev = 29;
                                    return _context2.finish(29);

                                case 31:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this, [[6, 26, 29, 31]]);
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
                                _context4.next = 14;
                                break;

                            case 7:
                                _context4.prev = 7;
                                _context4.t0 = _context4['catch'](2);
                                // an error occurred
                                // display toast to show that an error
                                toast = $('.page-toast').get(0).ej2_instances[0];

                                toast.cssClass = 'error-ej2-toast';
                                toast.content = "Sorry, an error occurred. Refresh to try again";
                                toast.dataBind();
                                toast.show();

                            case 14:
                                _context4.prev = 14;

                                // enable pull-to-refresh widget till loading is done
                                $('#home-page #home-page-pull-hook').removeAttr("disabled");
                                // signal that loading is done
                                doneCallBack();
                                return _context4.finish(14);

                            case 18:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[2, 7, 14, 18]]);
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
                                    // load latest products
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
                                                "stock_status": "instock", "page": 1, "per_page": 5 }
                                        })).then(function (productsArray) {
                                            // save the retrieved data to app database as cache
                                            utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: "latest-products", docType: "LATEST_PRODUCTS", products: productsArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                            $('#home-page #home-latest-design-block').css("opacity", "1"); // hide the "Products" segment
                                            // remove the previously slides from the carousel
                                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.remove($('#home-page #home-latest-design-block .row .col-xs-5').get());
                                            // attach the products to the page
                                            for (var index = 0; index < productsArray.length; index++) {
                                                var columnContent = '<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
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
                                                "stock_status": "instock", "page": 1, "per_page": 5, "featured": true }
                                        })).then(function (productsArray) {
                                            if (productsArray.length > 0) {
                                                // save the retrieved data to app database as cache
                                                utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: "featured-products", docType: "FEATURED_PRODUCTS", products: productsArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                                                // show the "Products" segment
                                                $('#home-page #home-featured-design-block').css({ "opacity": "1", "display": "block" });
                                                // remove the previously slides from the carousel
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.remove($('#home-page #home-featured-design-block .row .col-xs-5').get());
                                            } else {
                                                // hide the "Products" segment
                                                $('#home-page #home-featured-design-block').css({ "opacity": "0", "display": "none" });
                                            }

                                            // attach the products to the page
                                            for (var index = 0; index < productsArray.length; index++) {
                                                var columnContent = '<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
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
                                                "stock_status": "instock", "page": 1, "per_page": 5, "on_sale": true }
                                        })).then(function (productsArray) {
                                            if (productsArray.length > 0) {
                                                // save the retrieved data to app database as cache
                                                utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({ _id: "sales-products", docType: "SALES_PRODUCTS", products: productsArray }, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                                                // show the "Products" segment
                                                $('#home-page #home-sales-design-block').css({ "opacity": "1", "display": "block" });
                                                // remove the previously slides from the carousel
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.remove($('#home-page #home-sales-design-block .row .col-xs-5').get());
                                            } else {
                                                // hide the "Products" segment
                                                $('#home-page #home-sales-design-block').css({ "opacity": "0", "display": "none" });
                                            }

                                            // attach the products to the page
                                            for (var index = 0; index < productsArray.length; index++) {
                                                var columnContent = '<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].regular_price), "n2") + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                    <span class="e-badge e-badge-danger" style="background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 1em;">\n                                                    ' + Math.ceil(Math.abs(kendo.parseFloat(productsArray[index].price) - kendo.parseFloat(productsArray[index].regular_price)) / kendo.parseFloat(productsArray[index].regular_price) * 100) + '% OFF\n                                                    </span>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
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

                                        toast.cssClass = 'default-ej2-toast';
                                        toast.content = "No Internet connection. Pull down to refresh and see live products";
                                        toast.dataBind();
                                        toast.show();
                                        // load latest products from cached data
                                        productTypesPromisesArray.push(new Promise(function (resolve, reject) {
                                            Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("latest-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function (cachedProductsData) {
                                                return cachedProductsData.products;
                                            }).then(function (productsArray) {
                                                $('#home-page #home-latest-design-block').css("opacity", "1"); // hide the "Products" segment
                                                // remove the previously slides from the carousel
                                                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.remove($('#home-page #home-latest-design-block .row .col-xs-5').get());
                                                // attach the products to the page
                                                for (var index = 0; index < productsArray.length; index++) {
                                                    var columnContent = '<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
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
                                            Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("featured-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function (cachedProductsData) {
                                                return cachedProductsData.products;
                                            }).then(function (productsArray) {
                                                if (productsArray.length > 0) {
                                                    // show the "Products" segment
                                                    $('#home-page #home-featured-design-block').css({ "opacity": "1", "display": "block" });
                                                    // remove the previously slides from the carousel
                                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.remove($('#home-page #home-featured-design-block .row .col-xs-5').get());
                                                } else {
                                                    // hide the "Products" segment
                                                    $('#home-page #home-featured-design-block').css({ "opacity": "0", "display": "none" });
                                                }

                                                // attach the products to the page
                                                for (var index = 0; index < productsArray.length; index++) {
                                                    var columnContent = '<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
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
                                                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.remove($('#home-page #home-sales-design-block .row .col-xs-5').get());
                                                } else {
                                                    // hide the "Products" segment
                                                    $('#home-page #home-sales-design-block').css({ "opacity": "0", "display": "none" });
                                                }

                                                // attach the products to the page
                                                for (var index = 0; index < productsArray.length; index++) {
                                                    var columnContent = '<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\'' + productsArray[index].images[0].src + '\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    ' + productsArray[index].name + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].regular_price), "n2") + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;' + kendo.toString(kendo.parseFloat(productsArray[index].price), "n2") + '\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                    <span class="e-badge e-badge-danger" style="background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 1em;">\n                                                    ' + Math.ceil(Math.abs(kendo.parseFloat(productsArray[index].price) - kendo.parseFloat(productsArray[index].regular_price)) / kendo.parseFloat(productsArray[index].regular_price) * 100) + '% OFF\n                                                    </span>\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';
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
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                    var accordion;
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

                                    try {
                                        accordion = new ej.navigations.Accordion({
                                            expandMode: 'Single'
                                        });

                                        accordion.appendTo('#account-personal-accordion');
                                        accordion.expandItem(true, 0);
                                    } catch (err) {}

                                case 4:
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

            // listen for when the device keyboard is shown
            window.addEventListener('keyboardDidShow', utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);
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
            var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:

                                // run the validation method for the sign-in form
                                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.whenValidate();

                            case 1:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));

            function signinButtonClicked() {
                return _ref10.apply(this, arguments);
            }

            return signinButtonClicked;
        }(),


        /**
         * method is triggered when the "Sign Up" button is clicked
         *
         * @returns {Promise<void>}
         */
        signupButtonClicked: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:

                                // run the validation method for the sign-in form
                                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.whenValidate();

                            case 1:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function signupButtonClicked() {
                return _ref11.apply(this, arguments);
            }

            return signupButtonClicked;
        }(),


        /**
         * method is triggered when the login form is successfully validated
         *
         * @returns {Promise<void>}
         */
        loginFormValidated: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function loginFormValidated() {
                return _ref12.apply(this, arguments);
            }

            return loginFormValidated;
        }(),


        /**
         * method is triggered when the sign up form is successfully validated
         *
         * @returns {Promise<void>}
         */
        signupFormValidated: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this);
            }));

            function signupFormValidated() {
                return _ref13.apply(this, arguments);
            }

            return signupFormValidated;
        }()
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
                var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                    return regeneratorRuntime.wrap(function _callee14$(_context14) {
                        while (1) {
                            switch (_context14.prev = _context14.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context14.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context14.abrupt('return');

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
                                    return _context14.stop();
                            }
                        }
                    }, _callee14, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref14.apply(this, arguments);
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
            var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function pageHide() {
                return _ref15.apply(this, arguments);
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
                var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
                    var addToCartButton, customiseProductButton, wishListButton, compareButton, reviewButton, shareButton;
                    return regeneratorRuntime.wrap(function _callee16$(_context16) {
                        while (1) {
                            switch (_context16.prev = _context16.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context16.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context16.abrupt('return');

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
                                    return _context16.stop();
                            }
                        }
                    }, _callee16, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref16.apply(this, arguments);
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
            var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function pageHide() {
                return _ref17.apply(this, arguments);
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