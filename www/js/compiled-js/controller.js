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
                position: {X: "Center",  Y: "Bottom"},
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
                position: {X: "Center",  Y: "Bottom"},
                width: "100%",
                timeOut: 4000, // default 4 sec
                extendedTimeout: 0,
                showCloseButton: true
            }).appendTo($('.timed-page-toast').get(0));

            // create the "Yes" button on the the Delete Cart Item action sheet
            new ej.buttons.Button({
                cssClass: 'e-flat e-small',
                iconPosition: "Left"
            }).appendTo('#view-cart-page-delete-cart-item-yes');

            // create the "No" button on the the Delete Cart Item action sheet
            new ej.buttons.Button({
                cssClass: 'e-flat e-small',
                iconPosition: "Left"
            }).appendTo('#view-cart-page-delete-cart-item-no');


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
                let secureKey = null;
                try {
                    // get secure key, if it exists
                    secureKey = await new Promise(function(resolve, reject){
                        NativeStorage.getItem("utopiasoftware-oak-print-service-secure-key",resolve, reject);
                    });
                }
                catch(err){ // secure key does not exist
                    // create the secure key
                    secureKey = await new Promise(function(resolve, reject){
                        NativeStorage.setItem("utopiasoftware-oak-print-service-secure-key",
                            {password: Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine)},
                            resolve, reject);
                    });
                }
                // enable the db encryption using the generated password
                await new Promise(function(resolve, reject){
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase.
                    crypto(secureKey.password, {
                        ignore: ['_attachments', '_deleted', 'docType'],
                        cb: function(err, key){
                            if(err){ // there is an error
                                reject(err); // reject Promise
                            }
                            else{ // no error
                                resolve(key); // resolve Promise
                            }
                        }});
                });

                // load/set the initial number of items in the user's cart
                try{
                    utopiasoftware[utopiasoftware_app_namespace].model.cartCount =
                        (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",
                        utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart.length;
                }
                catch(err){}

                //register the listener for app database changes
                utopiasoftware[utopiasoftware_app_namespace].controller.appDatabaseChangesListenerViewModel.
                    changesEventEmitter = utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.
                                                changes({
                    live: true,
                    include_docs: true,
                    since: 'now',
                    doc_ids: ['user-cart']
                }).on("change", utopiasoftware[utopiasoftware_app_namespace].controller.
                    appDatabaseChangesListenerViewModel.userCartChanged);

            }
            catch(err){
                console.log("APP LOADING ERROR", err);
            }
            finally{

                // load the initial content of the app
                if(true){ // there is a previous logged in user
                    // load the app main page
                    $('ons-splitter').get(0).content.load("app-main-template");
                }
                else{ // there is no previously logged in user
                    // load the login page
                    $('ons-splitter').get(0).content.load("login-template");
                }

                // set status bar color
                StatusBar.backgroundColorByHexString("#363E7C");
                navigator.splashscreen.hide(); // hide the splashscreen
                utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fully loaded and ready
            }

        }); // end of ons.ready()

    },

    /**
     * this view-model is used to house the listeners and data/properties which listen for
     * changes in the app database
     */
    appDatabaseChangesListenerViewModel : {

        /**
         * property holds the Event Emitter object for the changes taking
         * place in the database. This object can be used to cancel event listening at
         * any time
         */
        changesEventEmitter: null,

        /**
         * methosd is used to listen for changes to the
         * user-cart document i.e. when the local cached user cart is updated/modified
         *
         * @param changesInfo {Object} holds the object containing the changes made to the user cart
         *
         * @returns {Promise<void>}
         */
        async userCartChanged(changesInfo){
            if(changesInfo.deleted === true){ // the user local cart was deleted
                // reset the cartCount app model property to zero
                utopiasoftware[utopiasoftware_app_namespace].model.cartCount = 0;
            }
            else{ // the user local cart was modified/updated
                // update the cartCount app model property to indicate the number of items in cart (using the updated cart length)
                utopiasoftware[utopiasoftware_app_namespace].model.cartCount =
                    changesInfo.doc.cart.length;
            }

            // update the cart count being displayed on all current pages
            $('.cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);
        }
    },

    /**
     * this is the view-model/controller for the Home page
     */
    homePageViewModel: {

        /**
         * object is used as the carousel Flickity object for "New Products"/ Banner Ads
         */
        newProductsCarousel: null,

        /**
         * object is used as the carousel Flickity object for "Featured / Popular Products"
         */
        featuredProductsCarousel: null,

        /**
         * object is used as the carousel Flickity object for "Sales Products"
         */
        salesProductsCarousel: null,


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

                // listen for the back button event
                event.target.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.backButtonClicked;

                // add method to handle the loading action of the pull-to-refresh widget
                $('#home-page-pull-hook', $thisPage).get(0).onAction =
                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.pagePullHookAction;

                // register listener for the pull-to-refresh widget
                $('#home-page-pull-hook', $thisPage).on("changestate", function(event){

                    // check the state of the pull-to-refresh widget
                    switch (event.originalEvent.state){
                        case 'initial':
                            // update the displayed content
                            $('#home-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'preaction':
                            // update the displayed content
                            $('#home-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'action':
                            // update the displayed content
                            $('#home-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                            break;
                    }
                });

                try{
                    // create the "New Products" carousel
                    let newProductsCarousel = new Flickity($('#home-page #home-latest-design-block .row').get(0), {
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
                    newProductsCarousel.on("scroll", function(){
                        // check if the carousel object has a timer attached
                        if(newProductsCarousel._utopiasoftware_scrollTimer){ // there is a timer
                            // clear the timer
                            window.clearTimeout(newProductsCarousel._utopiasoftware_scrollTimer);
                            newProductsCarousel._utopiasoftware_scrollTimer = null;
                        }

                        // automatically start the the carousel autoplay
                        newProductsCarousel._utopiasoftware_scrollTimer = window.setTimeout(function(){
                            newProductsCarousel.playPlayer(); // start carousel autoplay
                        }, 0);
                    });
                    newProductsCarousel.on("staticClick", function(event, pointer, cellElement, cellIndex){
                        // check if it was a cell that was clicked
                        if(! cellElement){ // it was not a slider cell that was clicked
                            // clear the timer
                            return;
                        }

                    });
                    // assign the "New Product" carousel to the appropriate object
                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel =
                        newProductsCarousel;

                    // create the "Featured Products" carousel
                    let featuredProductsCarousel = new Flickity($('#home-page #home-featured-design-block .row').get(0), {
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
                    featuredProductsCarousel.on("scroll", function(){
                        // check if the carousel object has a timer attached
                        if(featuredProductsCarousel._utopiasoftware_scrollTimer){ // there is a timer
                            // clear the timer
                            window.clearTimeout(featuredProductsCarousel._utopiasoftware_scrollTimer);
                            featuredProductsCarousel._utopiasoftware_scrollTimer = null;
                        }

                        // automatically start the the carousel autoplay
                        featuredProductsCarousel._utopiasoftware_scrollTimer = window.setTimeout(function(){
                            featuredProductsCarousel.playPlayer(); // start carousel autoplay
                        }, 0);
                    });
                    featuredProductsCarousel.on("staticClick", function(event, pointer, cellElement, cellIndex){
                        // check if it was a cell that was clicked
                        if(! cellElement){ // it was not a slider cell that was clicked
                            // do nothing
                            return;
                        }

                        // call the method to load the product details page based on the product item clicked
                        utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                        productItemClicked(window.parseInt($(cellElement).attr('data-product')),
                            $(cellElement).attr('data-segment'));
                    });
                    // assign the "Featured Products" carousel to the appropriate object
                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel =
                        featuredProductsCarousel;

                    let salesProductsCarousel = new Flickity($('#home-page #home-sales-design-block .row').get(0), {
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
                    salesProductsCarousel.on("scroll", function(){
                        // check if the carousel object has a timer attached
                        if(salesProductsCarousel._utopiasoftware_scrollTimer){ // there is a timer
                            // clear the timer
                            window.clearTimeout(salesProductsCarousel._utopiasoftware_scrollTimer);
                            salesProductsCarousel._utopiasoftware_scrollTimer = null;
                        }

                        // automatically start the the carousel autoplay
                        salesProductsCarousel._utopiasoftware_scrollTimer = window.setTimeout(function(){
                            salesProductsCarousel.playPlayer(); // start carousel autoplay
                        }, 0);
                    });
                    salesProductsCarousel.on("staticClick", function(event, pointer, cellElement, cellIndex){
                        // check if it was a cell that was clicked
                        if(! cellElement){ // it was not a slider cell that was clicked
                            // do nothing
                            return;
                        }
                        // call the method to load the product details page based on the product item clicked
                        utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                        productItemClicked(window.parseInt($(cellElement).attr('data-product')),
                            $(cellElement).attr('data-segment'));
                    });
                    // assign the "Sales Products" carousel to the appropriate object
                    utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel =
                        salesProductsCarousel;

                    $('#loader-modal').get(0).hide(); // show loader

                    // display page preloader
                    $('#home-page .page-preloader').css("display", "block");

                    // start loading the page content
                    await utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.loadProducts();

                    // hide the preloader
                    $('#home-page .page-preloader').css("display", "none");
                }
                catch(err){
                    console.log("HOME PAGE ERROR", err);
                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.content = `Sorry, an error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""} Pull down to refresh and try again`;
                    toast.dataBind();
                    toast.show();
                }
                finally {
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // update page title
            $('#app-main-page ons-toolbar div.title-bar').html("OAK");
            // update cart count
            $('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOnlineListener, false);


            if(utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel){
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.reloadCells();
            }
            if(utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel){
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.reloadCells();
            }
            if(utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel){
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.reloadCells();
            }
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // remove listener for when the device does not have Internet connection
            document.removeEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOfflineListener, false);
            // remove listener for when the device has Internet connection
            document.removeEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOnlineListener, false);
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // destroy the carousels
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.
            newProductsCarousel.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.
                newProductsCarousel = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.
                featuredProductsCarousel.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.
                featuredProductsCarousel = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.
                salesProductsCarousel.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.
                salesProductsCarousel = null;
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){

            ons.notification.confirm('Do you want to close the app?',
                {title: '<img src="css/app-images/oak-design-logo.png" style="height: 1.5em; width: auto; margin-right: 0.5em">Exit App',
                buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog utopiasoftware-oak-alert-dialog'}) // Ask for confirmation
                .then(function(index) {
                    if (index === 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                });
        },

        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener(){
            // display toast to show that there is no internet connection
            let toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see live products";
            toast.dataBind();
            toast.show();// show ej2 toast
        },

        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener(){
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // disable pull-to-refresh widget till loading is done
            $('#home-page #home-page-pull-hook').attr("disabled", true);
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            try{
                await utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.loadProducts();
                // hide the preloader
                $('#home-page .page-preloader').css("display", "none");
            }
            catch(err){ // an error occurred
                // display toast to show that error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.hide('All');
                toast.cssClass = 'error-ej2-toast';
                toast.content = "Sorry, an error occurred. Refresh to try again";
                toast.dataBind();
                toast.show();
            }
            finally{
                // enable pull-to-refresh widget till loading is done
                $('#home-page #home-page-pull-hook').removeAttr("disabled");
                // signal that loading is done
                doneCallBack();
            }
        },

        /**
         * method is used to load all products to the page
         *
         * @returns {Promise<void>}
         */
        async loadProducts(){
            var productTypesPromisesArray = []; // holds the array for all the promises of the product types to be loaded

            // check if there is internet connection or not
            if(navigator.connection.type !== Connection.NONE){ // there is internet connection
                // load banner products
                productTypesPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {"order": "desc", "orderby": "date", "status": "private",
                            "type": "external", "page": 1, "per_page": 5}
                        }
                    )).then(function(productsArray){
                        // save the retrieved data to app database as cache
                        utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                            {_id: "banner-products", docType: "BANNER_PRODUCTS", products: productsArray},
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                        if(productsArray.length > 0){
                            // show the "Products" segment
                            $('#home-page #home-latest-design-block').css({"opacity": "1", "display": "block"}); // show the "Products" segment
                            // remove the previously slides from the carousel
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            newProductsCarousel.
                            remove($('#home-page #home-latest-design-block .row .col-xs-12').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-latest-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-12" style="padding-left: 0; padding-right: 0;">
                                    <div class="e-card" style="min-height: 40vh; max-height: 90vh">
                                        <div class="e-card-image" style="">
                                        <img src="${productsArray[index].images[0].src}" style="width: 100%; height: auto; max-height: 90vh">
                                        </div>
                                    </div>
                                </div>`;
                            // append the content
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            newProductsCarousel.append($(columnContent));
                        }

                        resolve(); // resolve the parent promise
                    }).catch(function(err){
                        reject(); // reject the parent promise
                    });
                }));

                // load featured products
                productTypesPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {"order": "desc", "orderby": "date", "status": "publish",
                                "type": "variable", "stock_status": "instock", "page": 1, "per_page": 5, "featured": true}
                        }
                    )).then(function(productsArray){

                        // save the retrieved data to app database as cache
                        utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                            {_id: "popular-products", docType: "POPULAR_PRODUCTS", products: productsArray},
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                        if(productsArray.length > 0){
                            // show the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "1", "display": "block"});
                            // remove the previously slides from the carousel
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            featuredProductsCarousel.
                            remove($('#home-page #home-featured-design-block .row .col-xs-7').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" 
                                 data-product="${index}" data-segment="featured">
                                    <div class="e-card" style="min-height: 34vh;">
                                        <div class="e-card-image" style="height: 60%; 
                                        background-image: url('${productsArray[index].images[0].src}');">
                                        </div>
                                        <div class="e-card-header">
                                            <div class="e-card-header-caption">
                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">
                                                    ${productsArray[index].name}
                                                </div>
                                                <div class="e-card-sub-title" style="text-align: center;">
                                                &#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].price), "n2")}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            // append the content
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            featuredProductsCarousel.append($(columnContent));
                        }
                        resolve(); // resolve the parent promise
                    }).catch(function(err){

                        reject(); // reject the parent promise
                    });
                }));

                // load sales products
                productTypesPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {"order": "desc", "orderby": "date", "status": "publish",
                                "type": "variable", "stock_status": "instock", "page": 1, "per_page": 5, "on_sale": true}
                        }
                    )).then(function(productsArray){

                        // save the retrieved data to app database as cache
                        utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                            {_id: "sales-products", docType: "SALES_PRODUCTS", products: productsArray},
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                        if(productsArray.length > 0){
                            // show the "Products" segment
                            $('#home-page #home-sales-design-block').css({"opacity": "1", "display": "block"});
                            // remove the previously slides from the carousel
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            salesProductsCarousel.
                            remove($('#home-page #home-sales-design-block .row .col-xs-7').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-sales-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            if(!productsArray[index].regular_price || productsArray[index].regular_price == ""){ // regular price was NOT set, so set it
                                productsArray[index].regular_price = "0.00";
                            }
                            let columnContent =
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" 
                                    data-product="${index}" data-segment="sales">
                                    <div class="e-card" style="min-height: 34vh;">
                                        <div class="e-card-image" style="height: 60%; 
                                        background-image: url('${productsArray[index].images[0].src}');">
                                        <span class="e-badge e-badge-danger" style="float: right; clear: both; 
                                                    background-color: transparent; color: #d64113;
                                                    border: 1px #d64113 solid; font-size: 0.6em;">
                                                    ${Math.ceil((Math.abs(kendo.parseFloat(productsArray[index].price) -
                                    kendo.parseFloat(productsArray[index].regular_price)) /
                                    kendo.parseFloat(productsArray[index].regular_price === "0.00" ? 
                                         productsArray[index].price : productsArray[index].regular_price)) 
                                    * 100)}% OFF
                                                    </span>
                                        </div>
                                        <div class="e-card-header">
                                            <div class="e-card-header-caption">
                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">
                                                    ${productsArray[index].name}
                                                </div>
                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">
                                                &#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].regular_price), "n2")}
                                                </div>
                                                <div class="e-card-sub-title" style="text-align: center;">
                                                &#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].price), "n2")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            // append the content
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            salesProductsCarousel.append($(columnContent));
                        }
                        resolve(); // resolve the parent promise
                    }).catch(function(err){

                        reject(); // reject the parent promise
                    });
                }));
            } // end of loading products with Internet Connection
            else{ // there is no internet connection
                // display toast to show that there is no internet connection
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.hide('All');
                toast.cssClass = 'default-ej2-toast';
                toast.content = "No Internet connection. Pull down to refresh and see live products";
                toast.dataBind();
                toast.show();
                // load banner products from cached data
                productTypesPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("banner-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).
                    then(function(cachedProductsData){
                        return cachedProductsData.products;
                    }).
                    then(function(productsArray){
                        $('#home-page #home-latest-design-block').css("opacity", "1"); // hide the "Products" segment
                        // remove the previously slides from the carousel
                        utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                        newProductsCarousel.
                        remove($('#home-page #home-latest-design-block .row .col-xs-12').get());
                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-12" style="padding-left: 0; padding-right: 0;">
                                    <div class="e-card" style="min-height: 40vh; max-height: 90vh">
                                        <div class="e-card-image" style="">
                                        <img src="css/app-images/blank-img.png" style="width: 100%; height: auto; max-height: 90vh">
                                        </div>
                                    </div>
                                </div>`;
                            // append the content
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            newProductsCarousel.append($(columnContent));
                        }
                        // $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                        $('#home-page #home-latest-design-block').css({"opacity": "0", "display": "none"}); // hide the segment
                        resolve(); // resolve the parent promise
                    }).catch(function(err){

                        // $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                        $('#home-page #home-latest-design-block').css({"opacity": "0", "display": "none"}); // hide the segment
                        reject(); // reject the parent promise
                    });
                }));

                // load featured products from cached data
                productTypesPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("popular-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).
                    then(function(cachedProductsData){
                        return cachedProductsData.products;
                    }).then(function(productsArray){
                        if(productsArray.length > 0){
                            // show the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "1", "display": "block"});
                            // remove the previously slides from the carousel
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            featuredProductsCarousel.
                            remove($('#home-page #home-featured-design-block .row .col-xs-7').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" 
                                    data-product="${index}" data-segment="featured">
                                    <div class="e-card" style="min-height: 34vh;">
                                        <div class="e-card-image" style="height: 60%; 
                                        background-image: url('${productsArray[index].images[0].src}');">
                                        </div>
                                        <div class="e-card-header">
                                            <div class="e-card-header-caption">
                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">
                                                    ${productsArray[index].name}
                                                </div>
                                                <div class="e-card-sub-title" style="text-align: center;">
                                                &#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].price), "n2")}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            // append the content
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            featuredProductsCarousel.append($(columnContent));
                        }
                        resolve(); // resolve the parent promise
                    }).catch(function(err){

                        reject(); // reject the parent promise
                    });
                }));

                // load sales products from cached data
                productTypesPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("sales-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).
                    then(function(cachedProductsData){
                        return cachedProductsData.products;
                    }).then(function(productsArray){
                        if(productsArray.length > 0){
                            // show the "Products" segment
                            $('#home-page #home-sales-design-block').css({"opacity": "1", "display": "block"});
                            // remove the previously slides from the carousel
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            salesProductsCarousel.
                            remove($('#home-page #home-sales-design-block .row .col-xs-7').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-sales-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            if(!productsArray[index].regular_price || productsArray[index].regular_price == ""){ // regular price was NOT set, so set it
                                productsArray[index].regular_price = "0.00";
                            }
                            let columnContent =
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" 
                                  data-product="${index}" data-segment="sales">
                                    <div class="e-card" style="min-height: 34vh;">
                                        <div class="e-card-image" style="height: 60%; 
                                        background-image: url('${productsArray[index].images[0].src}');">
                                        <span class="e-badge e-badge-danger" style="float: right; clear: both; 
                                                    background-color: transparent; color: #d64113;
                                                    border: 1px #d64113 solid; font-size: 0.6em;">
                                                    ${Math.ceil((Math.abs(kendo.parseFloat(productsArray[index].price) -
                                    kendo.parseFloat(productsArray[index].regular_price)) /
                                    kendo.parseFloat(productsArray[index].regular_price === "0.00" ?
                                        productsArray[index].price : productsArray[index].regular_price))
                                    * 100)}% OFF
                                                    </span>
                                        </div>
                                        <div class="e-card-header">
                                            <div class="e-card-header-caption">
                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">
                                                    ${productsArray[index].name}
                                                </div>
                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">
                                                &#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].regular_price), "n2")}
                                                </div>
                                                <div class="e-card-sub-title" style="text-align: center;">
                                                &#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].price), "n2")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                            // append the content
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            salesProductsCarousel.append($(columnContent));
                        }
                        resolve(); // resolve the parent promise
                    }).catch(function(err){

                        reject(); // reject the parent promise
                    });
                }));
            }

            return Promise.all(productTypesPromisesArray); // return a promise which resolves when all promises in the array resolve
        },

        /**
         * method is triggered when the user wishes to view more featured products
         * @returns {Promise<void>}
         */
        async showMoreFeaturedProducts(){
            // load the products page in a separate event queue
            window.setTimeout(async function(){
                try{
                    // navigate to the products page
                    await $('#app-main-tabbar').get(0).setActiveTab(4, {animation: 'none'});
                    // request for products from the category that was clicked
                    let productArray = await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.
                    loadProducts({"order": "desc", "orderby": "date", "status": "publish",
                        "type": "variable", "stock_status": "instock", "page": 1, "per_page": 20, "featured": true});
                    await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);
                }
                catch(err){

                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.content = `Sorry, an error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""} Pull down to refresh and try again`;
                    toast.dataBind();
                    toast.show();
                }
                finally{
                    // hide the preloader for the products page
                    $('#products-page .page-preloader').css("display", "none");
                }
            }, 0);
        },

        /**
         * method is triggered when the user wishes to view more featured products
         * @returns {Promise<void>}
         */
        async showMoreSalesProducts(){
            // load the products page in a separate event queue
            window.setTimeout(async function(){
                try{
                    // navigate to the products page
                    await $('#app-main-tabbar').get(0).setActiveTab(4, {animation: 'none'});
                    // request for products from the category that was clicked
                    let productArray = await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.
                    loadProducts({"order": "desc", "orderby": "date", "status": "publish",
                        "type": "variable", "stock_status": "instock", "page": 1, "per_page": 20, "on_sale": true});
                    await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);
                }
                catch(err){

                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.content = `Sorry, an error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""} Pull down to refresh and try again`;
                    toast.dataBind();
                    toast.show();
                }
                finally{
                    // hide the preloader for the products page
                    $('#products-page .page-preloader').css("display", "none");
                }
            }, 0);
        },

        /**
         * method is triggered when the user clicks any product item from the Feature/Popular OR
         * Sales segments
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the 'appropriate' cached array of product items
         *
         * @param segmentType {String} specifies which segment the clicked product item belongs to.
         * Possible options are: 'featured', 'sales'
         *
         * @returns {Promise<void>}
         */
        async productItemClicked(productIndex, segmentType){
            // handle the function task in a different event queue
            window.setTimeout(async function(){
                var productItemsArray = []; // holds the array of 'appropriate' product items

                try{
                    // find out what segment type the clicked product belongs to
                    switch (segmentType) {
                        case "featured": // Featured/popular product
                            // get the 'appropriate' product items collection
                            productItemsArray = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                            loadData("popular-products",
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).products;
                            break;

                        case "sales": // Sales product
                            // get the 'appropriate' product items collection
                            productItemsArray = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                            loadData("sales-products",
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).products;
                            break;
                    }

                    // display the products details page using the selected product
                    $('#app-main-navigator').get(0).pushPage("product-details-page.html",
                        {animation: "lift", data: {product : productItemsArray[productIndex]}});
                }
                catch(err){

                }
            }, 0);
        }

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

                // listen for the back button event
                event.target.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.backButtonClicked;

                // add method to handle the loading action of the pull-to-refresh widget
                $('#categories-page-pull-hook', $thisPage).get(0).onAction =
                    utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pagePullHookAction;

                // register listener for the pull-to-refresh widget
                $('#categories-page-pull-hook', $thisPage).on("changestate", function(event){

                    // check the state of the pull-to-refresh widget
                    switch (event.originalEvent.state){
                        case 'initial':
                            // update the displayed content
                            $('#categories-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'preaction':
                            // update the displayed content
                            $('#categories-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'action':
                            // update the displayed content
                            $('#categories-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                            break;
                    }
                });

                // get the height of the view content container
                utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight =
                    Math.floor($('#categories-page .page__content').height());

                // listen for the scroll event on the page
                $('#categories-page .page__content').on("scroll", function(){
                    // handle the logic in a different event queue slot
                    window.setTimeout(function(){
                        // get the scrollTop position of the view content
                        var scrollTop = Math.floor($('#categories-page .page__content').scrollTop());

                        // get the percentage of scroll that has taken place from the top position
                        var percentageScroll = (scrollTop /  utopiasoftware[utopiasoftware_app_namespace].controller.
                                                categoriesPageViewModel.viewContentHeight) * 100;
                        if(percentageScroll >= 50){ // if the scroll position is >= halfway
                            $('#categories-page #categories-page-scroll-top-fab').css(
                                {"transform": "scale(1)",
                                "display": "inline-block"});
                        }
                        else{ // if the scroll position is < halfway
                            $('#categories-page #categories-page-scroll-top-fab').css({"transform": "scale(0)"});
                        }
                    }, 0);
                });

                // listen for when a category card is clicked
                $thisPage.on("click", ".e-card", function(clickEvent){
                    // load the products page in a separate event queue
                    window.setTimeout(async function(){
                        try{
                            // navigate to the products page
                            await $('#app-main-tabbar').get(0).setActiveTab(4, {animation: 'none'});
                            // request for products from the category that was clicked
                            let productArray = await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.
                            loadProducts({"order": "desc", "orderby": "date", "status": "publish",
                                "type": "variable", "stock_status": "instock", "page": 1, "per_page": 20,
                                "category": $(clickEvent.currentTarget).attr("data-category-id")});
                            await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);
                        }
                        catch(err){

                            // hide all previously displayed ej2 toast
                            $('.page-toast').get(0).ej2_instances[0].hide('All');
                            // display toast to show that an error
                            let toast = $('.page-toast').get(0).ej2_instances[0];
                            toast.cssClass = 'error-ej2-toast';
                            toast.content = `Sorry, an error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""} Pull down to refresh and try again`;
                            toast.dataBind();
                            toast.show();
                        }
                        finally{
                            // hide the preloader for the products page
                            $('#products-page .page-preloader').css("display", "none");
                        }
                    }, 0);
                });

                try{
                    // start loading the page content
                    let categoryArray = await utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.loadCategories();
                    await utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.displayPageContent(categoryArray[0]);
                }
                catch(err){

                    console.log("CATEGORY PAGE ERROR", err);
                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.content = `Sorry, an error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""} Pull down to refresh and try again`;
                    toast.dataBind();
                    toast.show();
                }
                finally {
                    // hide the preloader
                    $('#categories-page .page-preloader').css("display", "none");
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            $('#app-main-page ons-toolbar div.title-bar').html("Products"); // update the title of the page
            // update cart count
            $('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);
            // hide the page scroll fab
            $('#categories-page #categories-page-scroll-top-fab').css({"display": "none"});

            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOnlineListener, false);
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // remove listener for when the device does not have Internet connection
            document.removeEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOfflineListener, false);
            // remove listener for when the device has Internet connection
            document.removeEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOnlineListener, false);
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // go to the "Home" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(0);
        },

        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener(){
            // display toast to show that there is no internet connection
            let toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see updated products";
            toast.dataBind();
            toast.show();// show ej2 toast
        },

        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener(){
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // disable pull-to-refresh widget till loading is done
            $('#categories-page #categories-page-pull-hook').attr("disabled", true);
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            try{
                // start loading the page content
                let categoryArray = await utopiasoftware[utopiasoftware_app_namespace].controller.
                categoriesPageViewModel.loadCategories(1, utopiasoftware[utopiasoftware_app_namespace].
                    controller.categoriesPageViewModel.pageSize);
                await utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.displayPageContent(categoryArray[0]);
            }
            catch(err){ // an error occurred
                // display toast to show that error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.content = "Sorry, an error occurred. Refresh to try again";
                toast.dataBind();
                toast.show();
            }
            finally{
                // enable pull-to-refresh widget till loading is done
                $('#categories-page #categories-page-pull-hook').removeAttr("disabled");
                // signal that loading is done
                doneCallBack();
            }
        },

        /**
         * method is used to load products categories to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @returns {Promise<void>}
         */
        async loadCategories(pageToAccess = utopiasoftware[utopiasoftware_app_namespace].
                                            controller.categoriesPageViewModel.currentPage + 1,
                             pageSize = utopiasoftware[utopiasoftware_app_namespace].
                                        controller.categoriesPageViewModel.pageSize){
            var categoryPromisesArray = []; // holds the array for the promises used to load the product categories

            // check if there is internet connection or not
            if(navigator.connection.type !== Connection.NONE){ // there is internet connection
                // load the requested categories list from the server
                categoryPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products/categories",
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {"order": "asc", "orderby": "name", "hide_empty": true,
                                "page": pageToAccess, "per_page": pageSize}
                        }
                    )).then(function(categoriesArray){
                        // check if there is any data to cache in the app database
                        if(categoriesArray.length > 0){ // there is data to cache
                            // remove the 'uncategorized' category
                            categoriesArray = categoriesArray.filter(function(element){
                                return element.slug !== 'uncategorized';
                            });
                            // generate an id for the data being cached
                            let cachedDataId = ("" + pageToAccess).padStart(7, "0") + "categories";
                            // save the retrieved data to app database as cached data
                            utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                                {_id: cachedDataId, docType: "PRODUCT_CATEGORIES", categories: categoriesArray},
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                            // update the current page being viewed
                            utopiasoftware[utopiasoftware_app_namespace].
                                controller.categoriesPageViewModel.currentPage = pageToAccess;
                        }
                        resolve(categoriesArray); // resolve the parent promise with the data gotten from the server

                    }).catch(function(err){ // an error occurred

                        reject(err); // reject the parent promise with the error
                    });
                }));

            } // end of loading product categories with Internet Connection
            else{ // there is no internet connection
                // display toast to show that there is no internet connection
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.hide('All');
                toast.cssClass = 'default-ej2-toast';
                toast.content = "No Internet connection. Pull down to refresh and see updated products";
                toast.dataBind();
                toast.show();
                // load the requested product categories from cached data
                categoryPromisesArray.push(new Promise(function(resolve, reject){
                    // generate the id for the cached data being retrieved
                    let cachedDataId = ("" + pageToAccess).padStart(7, "0") + "categories";
                    Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData(cachedDataId, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).
                    then(function(cachedCategoriesData){
                        resolve(cachedCategoriesData.categories); // resolve the parent promise with the cached categories data
                    }).
                    catch(function(err){ // an error occurred

                        reject(err); // reject the parent promise with the error
                    });
                }));
            }

            return Promise.all(categoryPromisesArray); // return a promise which resolves when all promises in the array resolve
        },

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
        async displayPageContent(categoriesArray, appendContent = true, overwriteContent = true){

            var displayCompletedPromise = new Promise(function(resolve, reject){

                let categoriesContent = ""; // holds the contents for the categories

                // check if the categoriesArray is empty or not
                if(categoriesArray.length <= 0){ // there are no new content to display
                    resolve(categoriesArray.length); // resolve promise with the length of the categories array
                }
                else{ // there are some categories to display

                    // loop through the array content and display it
                    for(let index = 0; index < categoriesArray.length; index++){
                        categoriesContent += `<div class="col-xs-4" `;
                        if((index + 1) % 3 !== 0){ // this is NOT the last column in the row
                            categoriesContent += `style="border-right: 1px lightgray solid; border-bottom: 1px lightgray solid">`;
                        }
                        else{ // this is the last column in the row
                            categoriesContent += `style="border-bottom: 1px lightgray solid">`;
                        }
                        categoriesContent += `
                        <ons-ripple background="rgba(63, 81, 181, 0.3)"></ons-ripple>
                        <div class="e-card" data-category-id="${categoriesArray[index].id}">
                            <div class="e-card-image" style="min-height: 100px; 
                            background-image: url('${categoriesArray[index].image.src}');">
                            </div>
                            <div class="e-card-header">
                                <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">
                                    <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">
                                        ${categoriesArray[index].name}
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>`;

                    }

                    // check if the contents are to be overwritten
                    if(overwriteContent === true){ // content wants to be overwritten
                        $('#categories-page #categories-contents-container').html(categoriesContent);
                    }
                    else{ // content is NOT to be overwritten
                        if(appendContent === true){ // append content
                            $('#categories-page #categories-contents-container').append(categoriesContent);
                        }
                        else{ // prepend content
                            $('#categories-page #categories-contents-container').prepend(categoriesContent);
                        }
                    }

                    resolve(categoriesArray.length); // resolve the promise with length of the categoriesArray
                }

            });

            return displayCompletedPromise; // return the promise object ot indicate if the display has been completed or not

        },

        /**
         * method scrolls the page to the top
         * @returns {Promise<void>}
         */
        async scrollPageToTop(){
            window.setTimeout(function(){
                $('#categories-page .page__content').animate({ scrollTop: 0 }, 400);
            }, 0);
        }

    },

    /**
     * this is the view-model/controller for the Search page
     */
    searchPageViewModel: {

        /**
         * holds the array of products for the search result that was just run by the user
         */
        currentSearchResultsArray: null,

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

                // listen for the back button event
                event.target.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.backButtonClicked;

                try{

                    //instantiate the autocomplete widget for the search input
                    let searchAutoComplete = new ej.dropdowns.AutoComplete({
                        floatLabelType: "Never",
                        placeholder: "Search Products",
                        allowCustom: true,
                        filterType: "Contains",
                        minLength: 1000, // minimum number of characters that will automatically trigger autocomplete search
                        suggestionCount: 20, // specified how many items will be in the popup
                        dataSource: [],
                        noRecordsTemplate: `Tap 'Search' key to begin search`,
                        blur: function(){ // track when the component has lost focus
                            this._allowRemoteSearch = false; // set that remote search is NOT allowed
                            // hide the popover
                            $('#search-page-search-input-popover').get(0).hide();

                        },
                        change: function(){ // track when the component's value has changed

                            let searchValue = ""; // holds the term to be searched for

                            // check if the search component can perform a remote search
                            if(this._allowRemoteSearch !== true){  // remote search is NOT allowed
                                this._allowRemoteSearch = false; // set that remote search is NOT allowed
                                return; // exit function
                            }

                            // check that there is actually a search term entered in the search component
                            if(!this.value || this.value.trim() === ""){ // no search term
                                this._allowRemoteSearch = false; // set that remote search is NOT allowed
                                return; // exit function
                            }

                            // update the search term value
                            searchValue = this.value.trim();

                            // inform user that search is ongoing
                            $('#search-page-search-input-popover #search-input-popover-list').
                            html(`
                            <ons-list-item modifier="nodivider" lock-on-drag="true">
                                <div class="left">
                                    <ons-progress-circular indeterminate modifier="pull-hook" 
                                    style="transform: scale(0.6)"></ons-progress-circular>
                                </div>
                                <div class="center">
                                    <div style="text-align: center;">
                                        Searching for products
                                    </div>
                                </div>
                            </ons-list-item>`);
                            // display the popover
                            $('#search-page-search-input-popover').get(0).
                            show(document.getElementById('search-page-input'));

                            // run the actual search in a different event queue
                            window.setTimeout(async function() {
                                var searchResultsArray = [];
                                try{
                                    searchResultsArray = await utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                                    loadProducts({"order": "desc", "orderby": "date", "status": "publish",
                                        "type": "variable", "stock_status": "instock", "page": 1, "per_page": 3,
                                        "search": searchValue});
                                    await utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                                    displayPageContent(searchResultsArray[0]);
                                }
                                catch(err){

                                    // remove the focus from the search autocomplete component
                                    $('#search-page #search-page-input').get(0).ej2_instances[0].focusOut();
                                    // hide all previously displayed ej2 toast
                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                                    // display toast to show that an error
                                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                                    toast.cssClass = 'error-ej2-toast';
                                    toast.timeOut = 3000;
                                    toast.content = `Sorry, a search error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""}`;
                                    toast.dataBind();
                                    toast.show();
                                }
                            }, 0);

                        }
                    }).appendTo('#search-page-input');

                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            $('#app-main-page ons-toolbar div.title-bar').html("Search"); // update the title of the page
            // update cart count
            $('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOnlineListener, false);

            // load the recent searches list
            utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayRecentSearches();
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){
            // remove listener for when the device does not have Internet connection
            document.removeEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOfflineListener, false);
            // remove listener for when the device has Internet connection
            document.removeEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOnlineListener, false);
            // destroy the current search result array
            utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.currentSearchResultsArray = null;
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // destroy the search input autocomplete component
            $('#search-page #search-page-input').get(0).ej2_instances[0].destroy();

        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // hide the search-input popover
            $('#search-page-search-input-popover').get(0).hide();
            // go to the "Categories" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(1);
        },

        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener(){
            // display toast to show that there is no internet connection
            let toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see search results";
            toast.dataBind();
            toast.show();// show ej2 toast
        },

        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener(){
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },

        /**
         * method is used to display the "Recent Searches" list on the Search page.
         * Recent Searches are gotten from the cached collection
         */
        async displayRecentSearches(){
            try{
                // load the recent search from the device database cache
                let recentSearchData = await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("recent-searches", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                let displayContent = "<ons-list-title>Recent Searches</ons-list-title>"; // holds the content of the list to be created
                // create the Recent Searches list
                for(let index = 0; index < recentSearchData.products.length; index++){
                    displayContent += `
                    <ons-list-item modifier="longdivider" tappable lock-on-drag="true">
                        <div class="center">
                            <div style="width: 100%;" 
                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                              recentSearchesItemClicked(${index})">
                                <span class="list-item__subtitle">${recentSearchData.products[index].name}</span>
                            </div>
                        </div>
                        <div class="right" prevent-tap 
                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                                    removeRecentSearchItem(${index}, this);">
                            <ons-icon icon="md-close-circle" style="color: lavender; font-size: 18px;"></ons-icon>
                        </div>
                    </ons-list-item>`;
                }
                // attach the displayContent to the list
                $('#search-page #search-list').html(displayContent);
            }
            catch(err){

            }
        },

        /**
         * method is used to save a search item i.e. a product to the cached "Recent Searches"
         *
         * @param product {Object} the product to include to the "Recent Searches" cache
         * @returns {Promise<void>}
         */
        async saveRecentSearchItem(product){
            var recentSearchesResultArray = []; // holds the recent searches array

            try{
                // get the recent searches collection
                recentSearchesResultArray = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("recent-searches", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).products;
            }
            catch(err){}

            try{
                // add the received 'product' parameter to the top of the recent searches array
                recentSearchesResultArray.unshift(product);
                // ensure the array is NOT greater than 5 items in length
                recentSearchesResultArray = recentSearchesResultArray.slice(0, 5);
                // save the updated recent searches array  to the cached data collection of "Recent Searches"
                await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                    {_id: "recent-searches", docType: "RECENT_SEARCHES", products: recentSearchesResultArray},
                    utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                // display the updated recent searches to the user
                await utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayRecentSearches();
            }
            catch(err){

            }
        },

        /**
         * method is used to remove a search item i.e. a product from the cached "Recent Searches"
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the array of cached recent searches
         *
         * @param clickedElement {Element} the element that was clicked in order to trigger the product removal
         *
         * @returns {Promise<void>}
         */
        async removeRecentSearchItem(productIndex, clickedElement){

            // execute the method is a different event queue
            window.setTimeout(async function(){
                var recentSearchesResultArray = []; // holds the recent searches array

                try{
                    // get the recent searches collection
                    recentSearchesResultArray = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("recent-searches", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).products;
                }
                catch(err){}

                try{
                    // remove the received 'product' parameter index from the recent searches array
                    recentSearchesResultArray.splice(productIndex, 1);
                    // save the updated recent searches array  to the cached data collection of "Recent Searches"
                    await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                        {_id: "recent-searches", docType: "RECENT_SEARCHES", products: recentSearchesResultArray},
                        utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                    // hide the list-item belonging to the clicked element from the displayed list
                    let $listItem = $(clickedElement).closest('ons-list-item');
                    await kendo.fx($listItem).expand("vertical").duration(300).reverse();
                    // display the updated recent searches to the user
                    await utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayRecentSearches();
                }
                catch(err){

                }
            }, 0)
        },

        /**
         * method is triggered when the user clicks an item from the Recent Searches List
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the array returned of recent searches
         *
         * @returns {Promise<void>}
         */
        async recentSearchesItemClicked(productIndex){
            // handle the function task in a different event queue
            window.setTimeout(async function(){
                try{
                    // get the recent searches collection
                    let recentSearchesResultArray = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("recent-searches", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).products;

                    // display the products details page using the selected product
                    $('#app-main-navigator').get(0).pushPage("product-details-page.html",
                        {animation: "lift", data: {product : recentSearchesResultArray[productIndex]}});
                }
                catch(err){

                }
            }, 0);
        },

        /**
         * method is triggered when the enter button is clicked on the device keyboard
         *
         * @param keyEvent
         * @returns {Promise<void>}
         */
        async enterButtonClicked(keyEvent){
            // check which key was pressed
            if(keyEvent.which === kendo.keys.ENTER) // if the enter key was pressed
            {
                // prevent the default action from occurring
                keyEvent.preventDefault();
                keyEvent.stopImmediatePropagation();
                keyEvent.stopPropagation();
                // hide the device keyboard
                Keyboard.hide();

                // get the search autocomplete component
                let searchAutoComplete = $('#search-page #search-page-input').get(0).ej2_instances[0];
                // update the value of the retrieved component
                searchAutoComplete.value = $('#search-page #search-page-input').val();
                searchAutoComplete._allowRemoteSearch = true; // flag the remote search can occur
                searchAutoComplete.dataBind(); // bind new value to the component
                searchAutoComplete.change(); // trigger the change method
            }
        },

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
        async loadProducts(queryParam, pageToAccess = queryParam.page || 1,
                           pageSize = queryParam.per_page || 3){
            queryParam.page = pageToAccess;
            queryParam.per_page = pageSize;

            var productPromisesArray = []; // holds the array for the promises used to load the products

            // check if there is internet connection or not
            if(navigator.connection.type !== Connection.NONE){ // there is internet connection
                // load the requested products list from the server
                productPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: queryParam
                        }
                    )).then(function(productsArray){
                        // check if the productsArray contains products
                        if(productsArray.length > 0){ // there are products
                            // update the current search results array with the productsArray
                            utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                                currentSearchResultsArray = productsArray;
                        }

                        resolve(productsArray); // resolve the parent promise with the data gotten from the server

                    }).catch(function(err){ // an error occurred

                        reject(err); // reject the parent promise with the error
                    });
                }));

            } // end of loading products with Internet Connection
            else{ // there is no internet connection
                productPromisesArray.push(Promise.reject("no internet connection"));
            }

            return Promise.all(productPromisesArray); // return a promise which resolves when all promises in the array resolve
        },

        /**
         * method is used to display the retrieved products on the search popover
         *
         * @param productsArray
         *
         * @returns {Promise<void>}
         */
        async displayPageContent(productsArray){

            var displayCompletedPromise = new Promise(function(resolve, reject){

                let productsContent = ""; // holds the contents for the products

                // check if the productsArray is empty or not
                if(productsArray.length <= 0){ // there are no new content to display
                    // inform the user that no result for the search was founc'
                    $('#search-page-search-input-popover #search-input-popover-list').
                    html(`<ons-list-item modifier="nodivider" lock-on-drag="true">
                                <div class="center">
                                    <div style="text-align: center; width: 100%;">
                                        No Results Found
                                    </div>
                                </div>
                            </ons-list-item>`);
                    resolve(productsArray.length); // resolve promise with the length of the products array
                }
                else{ // there are some products to display

                    // loop through the array content and display it
                    for(let index = 0; index < productsArray.length; index++){

                        productsContent +=
                            `<ons-list-item modifier="nodivider" tappable lock-on-drag="true" 
                              onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                              searchAutocompletePopOverItemClicked(${index})">
                                <div class="left">
                                    <div class="search-result-image" style="background-image: url('${productsArray[index].images[0].src}'); 
                                                            width: 2em; height: 2em"></div>
                                </div>
                                <div class="center">
                                    <div style="text-align: center;">
                                        ${productsArray[index].name}
                                    </div>
                                </div>
                            </ons-list-item>`;
                    }

                    // append the "Load More" search item
                    productsContent +=
                        `<ons-list-item modifier="nodivider" tappable lock-on-drag="true" 
                          onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.findMoreClicked();">
                                <div class="center">
                                    <div style="text-align: center; width: 100%; font-weight: bold;">
                                        Find More...
                                    </div>
                                </div>
                            </ons-list-item>`;
                    // attach the new search results to the search popover
                    $('#search-page-search-input-popover #search-input-popover-list').html(productsContent);

                    resolve(productsArray.length); // resolve the promise with length of the productsArray
                }

            });

            return displayCompletedPromise; // return the promise object ot indicate if the display has been completed or not

        },

        /**
         * method is triggered when the user clicks an item from the search autocomplete popover
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the array returned by the product search
         *
         * @returns {Promise<void>}
         */
        async searchAutocompletePopOverItemClicked(productIndex){
            // get the product the user clicked on from the search autocomplete popover
            var selectedProduct = utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                currentSearchResultsArray[productIndex];
            window.setTimeout(async function(){
                try{
                    // display the products details page using the selected product
                    await $('#app-main-navigator').get(0).pushPage("product-details-page.html",
                        {animation: "lift", data: {product : selectedProduct}});

                    // save the selected product in recent products app cache
                    await utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.
                    saveRecentSearchItem(selectedProduct);

                    // update the value of the search autocomplete input to that which the user clicked on from the popover
                    $('#search-page #search-page-input').val(selectedProduct.name);

                }
                catch(err){

                }
            }, 0);
        },

        /**
         * method is triggered when the "Find More" option is
         * tapped within the search input popover
         *
         * @returns {Promise<void>}
         */
        async findMoreClicked(){
            // load the products page in a separate event queue
            window.setTimeout(async function(){
                try{
                    // navigate to the products page
                    await $('#app-main-tabbar').get(0).setActiveTab(4, {animation: 'none'});
                    // request for products using the user's search term
                    let productArray = await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.
                    loadProducts({"order": "desc", "orderby": "date", "status": "publish",
                        "type": "variable", "stock_status": "instock", "page": 1, "per_page": 20, "search":
                            $('#search-page #search-page-input').get(0).ej2_instances[0].value.trim()});
                    await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);
                }
                catch(err){

                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.content = `Sorry, an error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""} Pull down to refresh and try again`;
                    toast.dataBind();
                    toast.show();
                }
                finally{
                    // hide the preloader for the products page
                    $('#products-page .page-preloader').css("display", "none");
                }
            }, 0);
        }
    },

    /**
     * this is the view-model/controller for the Account page
     */
    accountPageViewModel: {


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

                // listen for when the device back button is tapped
                event.target.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.
                    accountPageViewModel.backButtonClicked;

                try{
                    // create the accorodion ej2 component used on the "Account" page
                    let accordion = new ej.navigations.Accordion({
                        expandMode: 'Single'
                    });
                    accordion.appendTo('#account-accordion');
                    // expand the first item of the accordion
                    accordion.expandItem(true, 0);
                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: async function(){
            $('#app-main-page ons-toolbar div.title-bar').html("Account"); // update the title of the page
            // update cart count
            $('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            window.SoftInputMode.set('adjustPan');

            // handle the user sign-in check inside a promise
            return new Promise(function(resolve, reject){
                window.setTimeout(async function(){
                    try{
                        // check if user has been signed in
                        let hasUserDetails = await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                        loadData("user-details", utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                        // since user is signed in, hide some list items and show some list items on the page.

                        // all items that are interested in have their display altered MUST have the
                        // class 'utopiasoftware-can-hide-list-item'.
                        // items that want to be displayed when a user is signed in and hidden when a user is signed out, MUST ALSO
                        // have the class 'utopiasoftware-user-sign-in-show' in addition to 'utopiasoftware-can-hide-list-item'.

                        // alter the list item display because a user is signed in
                        $('#account-page .utopiasoftware-can-hide-list-item.utopiasoftware-user-sign-in-show').css("display", "flex");
                        $('#account-page .utopiasoftware-can-hide-list-item:not(.utopiasoftware-user-sign-in-show)')
                            .css("display", "none");

                        resolve(); // resolve the promise
                    }
                    catch(err){
                        // alter the list item display because NO user is signed in
                        $('#account-page .utopiasoftware-can-hide-list-item.utopiasoftware-user-sign-in-show').css("display", "none");
                        $('#account-page .utopiasoftware-can-hide-list-item:not(.utopiasoftware-user-sign-in-show)')
                            .css("display", "flex");

                        // resolve the promise
                        resolve(); // resolve the promise
                    }
                }, 0);
            });
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

            // destroy the "Account" accordion
            $('#account-page #account-accordion').get(0).ej2_instances[0].destroy();
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // go to the "Home" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(2);
        },

        /**
         * method is triggered when the user clicks on the "Sign Out" list item
         *
         * @returns {Promise<void>}
         */
        async signOutListItemClicked(){

            // inform the user that the sign out process is on
            $('#loader-modal-message').html("Signing user out...");
            await $('#loader-modal').get(0).show(); // show loader

            try{
                // delete all user related data
                await Promise.all([utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                removeData("user-details", utopiasoftware[utopiasoftware_app_namespace].model.
                    encryptedAppDatabase),
                    utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    removeData("user-cart", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)]);
            }
            catch(err){
                console.log("USER SIGN OUT", err);
            }

            // check if user can sign out from the remote app serve via an iframe
            if($('#user-signout-iframe-container #user-signout-iframe').get(0).contentWindow &&
                $('#user-signout-iframe-container #user-signout-iframe').get(0).contentWindow.utopiasoftware_removeUsage){
                // call the method to remotely sign out
                $('#user-signout-iframe-container #user-signout-iframe').get(0).contentWindow.utopiasoftware_removeUsage();
            }

            // refresh the display of the app Account page
            await utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.pageShow();

            // alter the list item displayed on the Account page because NO user is signed in
            $('#account-page .utopiasoftware-can-hide-list-item.utopiasoftware-user-sign-in-show').css("display", "none");
            $('#account-page .utopiasoftware-can-hide-list-item:not(.utopiasoftware-user-sign-in-show)')
                .css("display", "flex");

            // hide loader modal
            await $('#loader-modal').get(0).hide();

            // inform user that they have been signed out
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
            $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
            // display toast message
            let toast = $('.timed-page-toast').get(0).ej2_instances[0];
            toast.cssClass = 'success-ej2-toast';
            toast.timeOut = 3000;
            toast.content = `User signed out`;
            toast.dataBind();
            toast.show();
        },

        /**
         * method is triggered when the user clicks on the "Profile" list item
         *
         * @returns {Promise<void>}
         */
        async profileListItemClicked(){

            // handle the user sign-in check inside a promise
            return new Promise(function(resolve, reject){
                window.setTimeout(async function(){
                    try{
                        // check if user has been signed in
                        let hasUserDetails = await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                        loadData("user-details", utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                        // user has been signed in, so display the user profile page
                        await $('#app-main-navigator').get(0).pushPage('profile-page.html');

                        resolve(); // resolve the promise
                    }
                    catch(err){
                        // inform user they need to sign in before viewing the profile page
                        // hide all previously displayed ej2 toast
                        $('.page-toast').get(0).ej2_instances[0].hide('All');
                        $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                        // display toast message
                        let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                        toast.cssClass = 'default-ej2-toast';
                        toast.timeOut = 3000;
                        toast.content = `Sign in to view your profile`;
                        toast.dataBind();
                        toast.show();

                        // resolve the promise
                        resolve(); // resolve the promise
                    }
                }, 0);
            });
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
         * used to hold the parsley form validator object for the forgot password page
         */
        forgotPasswordFormValidator: null,

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked;

                // listen for when the login-carousel has changed/slide used to change screen from login to signup etc
                $thisPage.on("postchange", "#login-carousel",
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.changeScreenCarouselPostChange);

                // listen for when the login-carousel has changed/slide used to hide the tooltips for the previous displayed screen
                $thisPage.on("postchange", "#login-carousel",
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.hideTooltipsCarouselPostChange);

                // initialise the login form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator =
                    $('#login-page #login-form').parsley();

                // initialise the signup form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator =
                    $('#login-page #signup-form').parsley();

                // initialise the forgot password form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator =
                    $('#login-page #forgot-password-form').parsley();

                // listen for log in form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    let tooltip = $('#login-page #login-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.content = fieldInstance.getErrorsMessages()[0];
                    tooltip.dataBind();
                    tooltip.open(fieldInstance.$element.get(0));
                });

                // listen for log in form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('field:success', function(fieldInstance) {
                    // hide tooltip from element
                    let tooltip = $('#login-page #login-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.close();
                });

                // listen for log in form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidated);

                // listen for signup form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    let tooltip = $('#login-page #signup-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.content = fieldInstance.getErrorsMessages()[0];
                    tooltip.dataBind();
                    tooltip.open(fieldInstance.$element.get(0));
                });

                // listen for sign up form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('field:success', function(fieldInstance) {
                    // hide tooltip from element
                    let tooltip = $('#login-page #signup-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.close();
                });

                // listen for signup form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidated);

                // listen for forgot password form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    let tooltip = $('#login-page #forgot-password-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.content = fieldInstance.getErrorsMessages()[0];
                    tooltip.dataBind();
                    tooltip.open(fieldInstance.$element.get(0));
                });

                // listen for forgot password form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.on('field:success', function(fieldInstance) {
                    // hide tooltip from element
                    let tooltip = $('#login-page #forgot-password-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.close();
                });

                // listen for forgot password form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidated);


                // listen for scroll event on the page to adjust the tooltips when page scrolls
                $('#login-page .login-page-form-container').on("scroll", function(){

                    // place function execution in the event queue to be executed ASAP
                    window.setTimeout(function(){

                            switch ($('#login-page #login-carousel').get(0).getActiveIndex()) { // get the active carousel item
                                case 0: // first carousel item is active, so adjust the input elements on the login form
                                    $("#login-page #login-form ons-input").each(function(index, element){
                                        document.getElementById('login-form').ej2_instances[index].refresh(element);
                                    });
                                    break;

                                case 1: // second carousel item is active, so adjust the input elements on the login form
                                    $("#login-page #signup-form ons-input").each(function(index, element){
                                        document.getElementById('signup-form').ej2_instances[index].refresh(element);
                                    });
                                    break;

                                case 2: // third carousel item is active, so adjust the input elements on the login form
                                    $("#login-page #forgot-password-form ons-input").each(function(index, element){
                                        document.getElementById('forgot-password-form').ej2_instances[index].refresh(element);
                                    });

                                    break;
                            }
                        }, 0);
                });

                try{
                    // create the tooltip objects for the signin form
                    $('#login-form ons-input', $thisPage).each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the html form object
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopCenter',
                            opensOn: 'Custom'
                        }).appendTo($('#login-page #login-form').get(0));
                    });

                    // create the tooltip objects for the signup form
                    $('#signup-form ons-input', $thisPage).each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the html form object
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopCenter',
                            opensOn: 'Custom'
                        }).appendTo($('#login-page #signup-form').get(0));
                    });

                    // create the tooltip objects for the forgot password form
                    $('#forgot-password-form ons-input', $thisPage).each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the html form object
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopCenter',
                            opensOn: 'Custom'
                        }).appendTo($('#login-page #forgot-password-form').get(0));
                    });

                    // create the button for showing password visibility on the signup page
                    new ej.buttons.Button({
                        isToggle: true,
                        cssClass: 'e-flat e-small e-round',
                        iconCss: "zmdi zmdi-eye",
                        iconPosition: "Left"
                    }).appendTo($('#signup-password-view-button', $thisPage).get(0));

                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            window.SoftInputMode.set('adjustPan');

            // listen for when the device keyboard is shown
            window.addEventListener('keyboardDidShow',
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // remove listener for when the device keyboard is shown
            window.removeEventListener('keyboardDidShow',
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);

            // hide the tooltips on the login form
            $('#login-page #login-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });

            // hide the tooltips on the signup form
            $('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });

            // hide the tooltips on the forgot password form
            $('#login-page #forgot-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });

            // reset all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.reset();
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.reset();
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.reset();
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            // destroy the tooltips on the login form
            $('#login-page #login-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // destroy the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the tooltips on the signup form
            $('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the tooltips on the forgot password form
            $('#login-page #forgot-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the password visibility button
            $('#login-page #signup-password-view-button').get(0).ej2_instances[0].destroy();

            // destroy all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.destroy();

        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        async backButtonClicked(){

            // get back to the previous page on the app-main navigator stack
            return $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the Sign In / Sign Up segment buttons are clicked
         *
         * @param itemIndex {Integer} zero-based index representing the carousel item to
         * display ewhen the button is clicked
         */
        segmentButtonClicked(itemIndex){
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
        passwordVisibilityButtonClicked(buttonElement, inputId){

            // check the state of the button is it 'active' or not
            if(! $(buttonElement).hasClass('e-active')){ // button is not active
                // change the type for the input field
                $(document.getElementById(inputId)).attr("type", "text");
                // change the icon on the button to indicate the change in visibility
                let ej2Button = buttonElement.ej2_instances[0];
                ej2Button.iconCss = 'zmdi zmdi-eye-off';
                ej2Button.dataBind();
            }
            else{ // button is active
                // change the type for the input field
                $(document.getElementById(inputId)).attr("type", "password");
                // change the icon on the button to indicate the change in visibility
                let ej2Button = buttonElement.ej2_instances[0];
                ej2Button.iconCss = 'zmdi zmdi-eye';
                ej2Button.dataBind();
            }
        },

        /**
         * method is used to track changes on the carousel slides for
         * displaying the various screens i.e. login or signup etc
         *
         * @param event
         */
        changeScreenCarouselPostChange(event){

            // use the switch case to determine what carousel is being shown
            switch(event.originalEvent.activeIndex){ // get the index of the active carousel item
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
        hideTooltipsCarouselPostChange(event){

            // use the switch case to determine what carousel item was PREVIOUSLY shown
            switch(event.originalEvent.lastActiveIndex){ // get the index of the LAST active carousel item
                case 0:

                    // hide the tooltips on the login form
                    $('#login-page #login-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                        // hide the tooltip
                        tooltipArrayElem.close();
                    });
                    break;

                case 1:

                    // hide the tooltips on the signup form
                    $('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                        // hide the tooltip
                        tooltipArrayElem.close();
                    });
                    break;

                case 2:

                    // hide the tooltips on the forgot password form
                    $('#login-page #forgot-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem) {
                        // hide the tooltip
                        tooltipArrayElem.close();
                    });
                    break;
            }
        },

        /**
         * method is triggered when the keyboard is shown.
         * It is used to adjust the display height
         *
         * @param event
         */
        keyboardShownAdjustView(event){
            // get the height of the keyboard and add 6000px to it
            let adjustedKeyboardHeight = Math.ceil(event.keyboardHeight) + 6000;

            switch ($('#login-page #login-carousel').get(0).getActiveIndex()) { // get the active carousel item
                case 0:
                    // add padding to the bottom, to allow elements to scroll into view
                    $("#login-page ons-carousel-item.first .login-page-form-container").
                    css({"padding-bottom": adjustedKeyboardHeight + "px"});
                    // scroll to the currently focused input element
                    $("#login-page ons-carousel-item.first .login-page-form-container").
                    scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top - 30));
                    break;

                case 1:
                    // add padding to the bottom, to allow elements to scroll into view
                    $("#login-page ons-carousel-item.second .login-page-form-container").
                    css({"padding-bottom": adjustedKeyboardHeight + "px"});
                    // scroll to the currently focused input element
                    $("#login-page ons-carousel-item.second .login-page-form-container").
                    scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top - 30));
                    break;

                case 2:
                    // add padding to the bottom, to allow elements to scroll into view
                    $("#login-page ons-carousel-item.third .login-page-form-container").
                    css({"padding-bottom": adjustedKeyboardHeight + "px"});
                    // scroll to the currently focused input element
                    $("#login-page ons-carousel-item.third .login-page-form-container").
                    scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top - 30));
                    break;
            }
        },

        /**
         * method is triggered when the "Sign In" button is clicked
         *
         * @returns {Promise<void>}
         */
        async signinButtonClicked() {

            // run the validation method for the sign-in form
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.whenValidate();
        },

        /**
         * method is triggered when the "Sign Up" button is clicked
         *
         * @returns {Promise<void>}
         */
        async signupButtonClicked() {

            // run the validation method for the sign-in form
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.whenValidate();
        },

        /**
         * method is triggered when the "Forgot Password" button is clicked
         *
         * @returns {Promise<void>}
         */
        async forgotPasswordButtonClicked() {

            // open inapp browser for user to reset password
            cordova.InAppBrowser.open(window.encodeURI('https://shopoakexclusive.com/my-account/lost-password/'), '_blank',
                'location=yes,clearcache=yes,clearsessioncache=yes,closebuttoncolor=#ffffff,hardwareback=no,hidenavigationbuttons=yes,hideurlbar=yes,zoom=no,toolbarcolor=#3f51b5');
        },

        /**
         * method is triggered when the "Reset Password" button is clicked
         *
         * @returns {Promise<void>}
         */
        async resetPasswordButtonClicked() {

            // run the validation method for the sign-in form
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.whenValidate();
        },

        /**
         * method is triggered when the login form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async loginFormValidated(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to sign in`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // display modal to user that signin is being completed
            $('#loader-modal-message').html("Completing Signin...");
            await $('#loader-modal').get(0).show(); // show loader

            var promisesArray = []; // holds the array for the promises used to complete user signin
            var userEmail = $('#login-page #login-form #login-email').val().trim(); // holds user email from the login form
            var userPassword = $('#login-page #login-form #login-password').val().trim(); // holds the user password


            // make the request to authenticate user login credentials
            promisesArray.push(Promise.resolve($.ajax(
                {
                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json",
                    type: "get",
                    // contentType: "application/json",
                    beforeSend: function(jqxhr) {
                        jqxhr.setRequestHeader("Authorization", "Basic " +
                            Base64.encode(`${userEmail}:${userPassword}`));
                    },
                    dataType: "json",
                    timeout: 240000, // wait for 4 minutes before timeout of request
                    processData: false
                }
            )));

            // make the request to retrieve a user with the specified login email
            promisesArray.push(Promise.resolve($.ajax(
                {
                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/customers",
                    type: "get",
                    //contentType: "application/json",
                    beforeSend: function(jqxhr) {
                        jqxhr.setRequestHeader("Authorization", "Basic " +
                            utopiasoftware[utopiasoftware_app_namespace].accessor);
                    },
                    dataType: "json",
                    timeout: 240000, // wait for 4 minutes before timeout of request
                    processData: true,
                    data: {email: userEmail}
                }
            )));

            // get the promise created from the promisesArray
            let promisesArrayPromise = Promise.all(promisesArray);

            // listen for when the promisesArrayPromise resolves
            promisesArrayPromise.then(async function(resultsArray){
                // add the user's password to the user details retrieved from the server
                resultsArray[1][0].password = userPassword;

                // save the created user details data to ENCRYPTED app database as cached data
                await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                    {_id: "user-details", docType: "USER_DETAILS", userDetails: resultsArray[1][0]},
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                // hide loader
                await $('#loader-modal').get(0).hide(); // hide loader

                // leave the signup page and go back to the previous page in the app main navigator. Call the backbuttonClicked() method
                await utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked();

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'success-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `User signin completed`;
                toast.dataBind();
                toast.show();

            }).catch(async function(err){ // an error occurred
                console.log("SIGN IN ERROR", err);

                err = JSON.parse(err.responseText);

                // hide loader
                await $('#loader-modal').get(0).hide(); // hide loader

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Invalid user email or password. User signin failed `;
                toast.dataBind();
                toast.show();

            });

            return promisesArrayPromise; // return the resolved promisesArray

        },

        /**
         * method is triggered when the sign up form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async signupFormValidated(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to sign up`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // display modal to user that signup is being completed
            $('#loader-modal-message').html("Completing Signup...");
            await $('#loader-modal').get(0).show(); // show loader

            var promisesArray = []; // holds the array for the promises used to complete user signup

            // make the request to create the new user account
            promisesArray.push(new Promise(function(resolve, reject){
                Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/customers",
                        type: "post",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify({email: $('#login-page #signup-form #signup-email').val().trim(),
                        username: $('#login-page #signup-form #signup-email').val().trim(),
                        password: $('#login-page #signup-form #signup-password').val().trim()})
                    }
                )).then(async function(userDetails){
                    // add the user's password to the user details retrieved from the server
                    userDetails.password = $('#login-page #signup-form #signup-password').val().trim();

                    // save the created user details data to ENCRYPTED app database as cached data
                    await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                        {_id: "user-details", docType: "USER_DETAILS", userDetails},
                        utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                    // hide loader
                    await $('#loader-modal').get(0).hide(); // hide loader

                    // leave the signup page and go back to the previous page in the app main navigator. Call the backbuttonClicked() method
                    await utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked();

                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast message
                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'success-ej2-toast';
                    toast.timeOut = 3000;
                    toast.content = `User signup completed`;
                    toast.dataBind();
                    toast.show();

                    resolve(userDetails); // resolve the parent promise with the data gotten from the server

                }).catch(async function(err){ // an error occurred
                    console.log("SIGN UP ERROR", err);

                    err = JSON.parse(err.responseText);

                    // hide loader
                    await $('#loader-modal').get(0).hide(); // hide loader

                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast message
                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.timeOut = 3000;
                    toast.content = `Error. ${err.message || "User signup failed"}`;
                    toast.dataBind();
                    toast.show();

                    reject(err); // reject the parent promise with the error
                });
            }));

            return Promise.all(promisesArray); // return the resolved promisesArray

        },

        /**
         * method is triggered when the forgot password form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async forgotPasswordFormValidated(){

        }
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
        currentQueryParam: {
            status: "publish"
        },

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

                // listen for the back button event
                event.target.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.backButtonClicked;

                // add method to handle page-infinite-scroll
                event.target.onInfiniteScroll =
                    utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageInfiniteScroll;

                // add method to handle the loading action of the pull-to-refresh widget
                $('#products-page-pull-hook', $thisPage).get(0).onAction =
                    utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pagePullHookAction;

                // register listener for the pull-to-refresh widget
                $('#products-page-pull-hook', $thisPage).on("changestate", function(event){

                    // check the state of the pull-to-refresh widget
                    switch (event.originalEvent.state){
                        case 'initial':
                            // update the displayed content
                            $('#products-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'preaction':
                            // update the displayed content
                            $('#products-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'action':
                            // update the displayed content
                            $('#products-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                            break;
                    }
                });

                // get the height of the view content container
                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.viewContentHeight =
                    Math.floor($('#products-page .page__content').height());


                // listen for the scroll event on the page
                $('#products-page .page__content').on("scroll", function(){
                    // handle the logic in a different event queue slot
                    window.setTimeout(function(){
                        // get the scrollTop position of the view content
                        var scrollTop = Math.floor($('#products-page .page__content').scrollTop());

                        // get the percentage of scroll that has taken place from the top position
                        var percentageScroll = (scrollTop /  utopiasoftware[utopiasoftware_app_namespace].controller.
                            productsPageViewModel.viewContentHeight) * 100;
                        if(percentageScroll >= 50){ // if the scroll position is >= halfway
                            $('#products-page #products-page-scroll-top-fab').css(
                                {"transform": "scale(1)",
                                    "display": "inline-block"});
                        }
                        else{ // if the scroll position is < halfway
                            $('#products-page #products-page-scroll-top-fab').css({"transform": "scale(0)"});
                        }
                    }, 0);
                });

                // listen for when the navigation tab has changed and update the lastActiveNavTab
                $('#app-main-tabbar').on("prechange", function(event){
                    if(event.originalEvent.index === 4){ // if the tab index is this page, don't update the lastActiveNavTab
                        return; // exit the method
                    }

                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        productsPageViewModel.lastActiveNavTab = event.originalEvent.index;

                });

                // LISTEN FOR WHEN A PRODUCT CARD IS CLICKED
                $thisPage.on("click", ".e-card", function(event){
                    // call the method to load the product details page based on the product item clicked
                    utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.
                    productItemClicked(window.parseInt($(event.currentTarget).attr('data-product')),
                        window.parseInt($(event.currentTarget).attr('data-page')));
                });

                try{

                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(event){
            $('#app-main-page ons-toolbar div.title-bar').html("Products"); // change the title of the screen
            // update cart count
            $('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);
            // check if the page content should be reset
            if($('#app-main-navigator').get(0)._resetPageDisplay !== false){ // page content can be refreshed
                // flag that page infinite scroll should NOT be allowed
                event.target._allowInfinitePageScroll = false;
                // show the preloader
                $('#products-page .page-preloader').css("display", "block");
                // empty the content of the page
                $('#products-page #products-contents-container').html('');
                // hide the page scroll fab
                $('#products-page #products-page-scroll-top-fab').css({"display": "none"});
            }


            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOnlineListener, false);
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(event){
            // flag that page infinite scroll should NOT be allowed
            event.target._allowInfinitePageScroll = false;
            delete $('#app-main-navigator').get(0)._resetPageDisplay;


            // remove listener for when the device does not have Internet connection
            document.removeEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOfflineListener, false);
            // remove listener for when the device has Internet connection
            document.removeEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOnlineListener, false);

            // remove all the infinite load indicator from the bottom of the page (if any exist)
            $('#products-page .page__content .infinite-load-container').remove();
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // go to the last active page (tab)
            $('#app-main-tabbar').get(0).
            setActiveTab(utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.lastActiveNavTab);
        },

        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener(){
            // display toast to show that there is no internet connection
            let toast = $('.page-toast').get(0).ej2_instances[0];
            toast.hide('All'); // hide all previously displayed ej2 toast
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to see updated products";
            toast.dataBind();
            toast.show();// show ej2 toast
        },

        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener(){
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // disable pull-to-refresh widget till loading is done
            $('#products-page #products-page-pull-hook').attr("disabled", true);
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            try{
                // start loading the page content
                let productArray = await utopiasoftware[utopiasoftware_app_namespace].controller.
                productsPageViewModel.loadProducts(utopiasoftware[utopiasoftware_app_namespace].
                    controller.productsPageViewModel.currentQueryParam, 1);
                await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);
            }
            catch(err){ // an error occurred

                // display toast to show that error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.content = "Sorry, an error occurred. Refresh to try again";
                toast.dataBind();
                toast.show();
            }
            finally{
                // hide the page preloader
                $('#products-page .page-preloader').css("display", "none");
                // enable pull-to-refresh widget till loading is done
                $('#products-page #products-page-pull-hook').removeAttr("disabled");
                // signal that loading is done
                doneCallBack();
            }
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pageInfiniteScroll(doneCallBack = function(){}){
            // check of page infinite scroll is allowed or not
            if($('#products-page').get(0)._allowInfinitePageScroll === false){ // page infinite scroll is NOT allowed
                doneCallBack();
                return;
            }

            // append an infinite load indicator to the bottom of the page
            $('#products-page .page__content').
            append(`<div class="infinite-load-container" style="text-align: center">
                        <ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>
                    </div>`);
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            let productArray = []; // holds the array of products retrieved for display

            try{
                // start loading the NEXT page content
                productArray = await utopiasoftware[utopiasoftware_app_namespace].controller.
                productsPageViewModel.loadProducts(utopiasoftware[utopiasoftware_app_namespace].
                    controller.productsPageViewModel.currentQueryParam,
                    utopiasoftware[utopiasoftware_app_namespace].
                        controller.productsPageViewModel.currentPage + 1);
                // append the new content to the previous contents
                await utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.
                displayPageContent(productArray[0], true, false);

            }
            catch(err){ // an error occurred
                // display toast to show that error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.content = "Sorry, an error occurred. Refresh to try again";
                toast.dataBind();
                toast.show();
            }
            finally{
                // check if any new products were retrieved
                if(productArray && productArray[0].length > 0){ // products were retrieve
                    // remove the infinite load indicator from the bottom of the page
                    $('#products-page .page__content .infinite-load-container').remove();
                }
                else{ // no products were retrieved

                    $('#products-page .page__content .infinite-load-container').css({"visibility": "hidden"});
                }
                // signal that loading is done
                doneCallBack();
            }
        },

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
        async loadProducts(queryParam, pageToAccess = queryParam.page || utopiasoftware[utopiasoftware_app_namespace].
                                 controller.productsPageViewModel.currentPage + 1,
                             pageSize = queryParam.per_page || utopiasoftware[utopiasoftware_app_namespace].
                                 controller.productsPageViewModel.pageSize){
            queryParam.page = pageToAccess;
            queryParam.per_page = pageSize;

            var productPromisesArray = []; // holds the array for the promises used to load the products

            // check if there is internet connection or not
            if(navigator.connection.type !== Connection.NONE){ // there is internet connection
                // load the requested products list from the server
                productPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json/wc/v3/products",
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: queryParam
                        }
                    )).then(function(productsArray){
                        // check if there is any data to cache in the app database
                        if(productsArray.length > 0){ // there is data to cache
                            // generate an id for the data being cached
                            let cachedDataId = ("" + pageToAccess).padStart(7, "0") + "products";
                            // save the retrieved data to app database as cached data
                            utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                                {_id: cachedDataId, docType: "PRODUCTS", products: productsArray},
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                            // update the current page being viewed
                            utopiasoftware[utopiasoftware_app_namespace].
                                controller.productsPageViewModel.currentPage = queryParam.page;
                            // update the current query parameter for the page
                            utopiasoftware[utopiasoftware_app_namespace].
                                controller.productsPageViewModel.currentQueryParam = queryParam;
                        }
                        resolve(productsArray); // resolve the parent promise with the data gotten from the server

                    }).catch(function(err){ // an error occurred

                        reject(err); // reject the parent promise with the error
                    });
                }));

            } // end of loading products with Internet Connection
            else{ // there is no internet connection
                // display toast to show that there is no internet connection
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.hide('All');
                toast.cssClass = 'default-ej2-toast';
                toast.content = "No Internet connection. Pull down to refresh and see updated products";
                toast.dataBind();
                toast.show();
                // load the requested products from cached data
                productPromisesArray.push(new Promise(function(resolve, reject){
                    // generate the id for the cached data being retrieved
                    let cachedDataId = ("" + pageToAccess).padStart(7, "0") + "products";
                    Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData(cachedDataId, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).
                    then(function(cachedProductsData){
                        // update the current page being viewed
                        utopiasoftware[utopiasoftware_app_namespace].
                            controller.productsPageViewModel.currentPage = queryParam.page;
                        resolve(cachedProductsData.products); // resolve the parent promise with the cached products data
                    }).
                    catch(function(err){ // an error occurred

                        reject(err); // reject the parent promise with the error
                    });
                }));
            }

            return Promise.all(productPromisesArray); // return a promise which resolves when all promises in the array resolve
        },

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
        async displayPageContent(productsArray, appendContent = true, overwriteContent = true){

            var displayCompletedPromise = new Promise(function(resolve, reject){

                let productsContent = ""; // holds the contents for the products

                // check if the productsArray is empty or not
                if(productsArray.length <= 0){ // there are no new content to display
                    resolve(productsArray.length); // resolve promise with the length of the products array
                }
                else{ // there are some products to display

                    // loop through the array content and display it
                    for(let index = 0; index < productsArray.length; index++){
                        if(!productsArray[index].regular_price || productsArray[index].regular_price == ""){ // regular price was NOT set, so set it
                            productsArray[index].regular_price = "0.00";
                        }

                        productsContent += `<div class="col-xs-4" `;
                        if((index + 1) % 3 !== 0){ // this is NOT the last column in the row
                            productsContent += `style="border-right: 1px lightgray solid; border-bottom: 1px lightgray solid">`;
                        }
                        else{ // this is the last column in the row
                            productsContent += `style="border-bottom: 1px lightgray solid">`;
                        }
                        productsContent += `
                        <ons-ripple background="rgba(63, 81, 181, 0.3)"></ons-ripple>
                        <div class="e-card" 
                        data-product="${index}" 
                        data-page="${utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage}">
                            <div class="e-card-image" style="min-height: 100px; 
                            background-image: url('${productsArray[index].images[0].src}');">
                            ${productsArray[index].on_sale === true ? `
                            <span class="e-badge e-badge-danger" style="float: right; clear: both; 
                                                    background-color: transparent; color: #d64113;
                                                    border: 1px #d64113 solid; font-size: 0.6em;">
                                                    ${Math.ceil((Math.abs(kendo.parseFloat(productsArray[index].price) -
                            kendo.parseFloat(productsArray[index].regular_price)) /
                            kendo.parseFloat(productsArray[index].regular_price === "0.00" ?
                                productsArray[index].price : productsArray[index].regular_price))
                            * 100)}% OFF
                             </span>` : ""}
                            </div>
                            <div class="e-card-header">
                                <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">
                                    <div class="e-card-sub-title" style="color: #000000; font-size: 14px; text-align: center; text-transform: capitalize">
                                        ${productsArray[index].name}
                                    </div>
                        <div style="color: gold; font-size: 0.6em !important; white-space: nowrap !important; 
                        text-overflow: ellipsis; overflow: hidden;">
                        ${Math.floor(kendo.parseFloat(productsArray[index].average_rating)) > 0 ? 
                            `<ons-icon icon="md-star" fixed-width></ons-icon>`.
                        repeat(Math.floor(kendo.parseFloat(productsArray[index].average_rating))):
                            `<ons-icon icon="md-star-outline" style="color: lightgray" fixed-width></ons-icon>`.repeat(5)}
                            <span style="display: inline-block; color: gray;">
                            ${Math.floor(kendo.parseFloat(productsArray[index].average_rating)) > 0 ? 
                        `(${productsArray[index].rating_count})` : ""}
                           </span>
                        </div>
                        <div class="e-card-sub-title" style="text-align: left;">&#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].price), "n2")}</div>
                        <div class="e-card-sub-title" style="text-align: left; text-decoration: line-through; 
                        ${productsArray[index].on_sale === true ? "visibility: visible": "visibility: hidden"}">&#x20a6;${kendo.toString(kendo.parseFloat(productsArray[index].regular_price), "n2")}</div>
                        </div>
                        </div>
                        </div>
                        </div>`;

                    }

                    // check if the contents are to be overwritten
                    if(overwriteContent === true){ // content wants to be overwritten
                        $('#products-page #products-contents-container').html(productsContent);
                    }
                    else{ // content is NOT to be overwritten
                        if(appendContent === true){ // append content
                            $('#products-page #products-contents-container').append(productsContent);
                        }
                        else{ // prepend content
                            $('#products-page #products-contents-container').prepend(productsContent);
                        }
                    }

                    // allow infinite page scroll to be triggered
                    $('#products-page').get(0)._allowInfinitePageScroll = true;
                    resolve(productsArray.length); // resolve the promise with length of the productsArray
                }

            });

            return displayCompletedPromise; // return the promise object ot indicate if the display has been completed or not

        },

        /**
         * method scrolls the page to the top
         * @returns {Promise<void>}
         */
        async scrollPageToTop(){
            window.setTimeout(function(){
                $('#products-page .page__content').animate({ scrollTop: 0 }, 400);
            }, 0);
        },

        /**
         * method is triggered when the user clicks any product item from the products collection
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the 'appropriate' cached array of product items
         *
         * @param productPage {Integer} specifies which query page/collection from the cached products
         * the clicked product item belongs to.
         *
         * @returns {Promise<void>}
         */
        async productItemClicked(productIndex, productPage){
            // handle the function task in a different event queue
            window.setTimeout(async function(){

                try{
                    // get the product items collection
                    let productItemsArray = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData(("" + productPage).padStart(7, "0") + "products",
                        utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).products;

                    // display the products details page using the selected product
                    $('#app-main-navigator').get(0).pushPage("product-details-page.html",
                        {animation: "lift", data: {product : productItemsArray[productIndex]}});
                }
                catch(err){

                }
            }, 0);
        }
    },

    /**
     * this is the view-model/controller for the Product Details page
     */
    productDetailsPageViewModel: {

        /**
         * holds the object which contains the current product and its details
         */
        currentProductDetails: null,

        /**
         * holds the index position (within the productVaritionsArray) of the
         * current product variation selected by the user
         */
        currentProductVariationIndex: -1,

        /**
         * holds the product variations array
         */
        productVariationsArray: [],

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.backButtonClicked;

                // add method to handle the loading action of the pull-to-refresh widget
                $('#product-details-page-pull-hook', $thisPage).get(0).onAction =
                    utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.pagePullHookAction;

                // register listener for the pull-to-refresh widget
                $('#product-details-page-pull-hook', $thisPage).on("changestate", function(event){

                    // check the state of the pull-to-refresh widget
                    switch (event.originalEvent.state){
                        case 'initial':
                            // update the displayed content
                            $('#product-details-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'preaction':
                            // update the displayed content
                            $('#product-details-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'action':
                            // update the displayed content
                            $('#product-details-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                            break;
                    }
                });

                try{
                    // create the "Pick Quantity" button
                    new ej.inputs.NumericTextBox({
                        cssClass: 'product-details-quantity-class',
                        currency: null,
                        decimals: 0,
                        floatLabelType: 'Auto',
                        format: 'n',
                        showSpinButton: false,
                        min: 1,
                        max: 10,
                        placeholder: 'Pick Quantity',
                        step: 1,
                        strictMode: true,
                        // sets value to the NumericTextBox
                        value: 1
                    }).appendTo('#product-details-quantity');

                    // create the "Add To Cart" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#product-details-add-to-cart');

                    // create the "Customise" button
                    new ej.buttons.Button({
                        //iconCss: "zmdi zmdi-brush utopiasoftware-icon-zoom-one-point-two",
                        //iconPosition: "Left"
                    }).appendTo('#product-details-customise-product');

                    // create the "Review" button
                    new ej.buttons.Button({
                        cssClass: 'e-flat e-small',
                        iconCss: "zmdi zmdi-star-outline",
                        iconPosition: "Left"
                    }).appendTo('#product-details-review');

                    // create the "Share" button
                    new ej.buttons.Button({
                        cssClass: 'e-flat e-small',
                        iconCss: "zmdi zmdi-share",
                        iconPosition: "Left"
                    }).appendTo('#product-details-share');

                    // load product variations asynchronously without waiting for the response
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        productDetailsPageViewModel.loadProductVariations();
                    // load product details
                    let productDetailsArray = await utopiasoftware[utopiasoftware_app_namespace].controller.
                    productDetailsPageViewModel.loadProduct();
                    // display the loaded product details
                    await utopiasoftware[utopiasoftware_app_namespace].controller.
                        productDetailsPageViewModel.displayProductDetails(productDetailsArray[0]);
                    // enable the "Add To Cart" button
                    $('#product-details-page #product-details-add-to-cart').removeAttr("disabled");

                }
                catch(err){

                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.content = `Sorry, an error occurred.${navigator.connection.type === Connection.NONE ? " Connect to the Internet." : ""} Pull down to refresh and try again`;
                    toast.dataBind();
                    toast.show();
                }
                finally {
                    // hide the preloader
                    $('#product-details-page .page-preloader').css("display", "none");
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // update cart count
            $('#product-details-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            window.SoftInputMode.set('adjustResize');
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
            // destroy properties
            utopiasoftware[utopiasoftware_app_namespace].controller.
                productDetailsPageViewModel.currentProductDetails = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.
                productDetailsPageViewModel.currentProductVariationIndex = -1;
            // reset the product variations array
            utopiasoftware[utopiasoftware_app_namespace].controller.
                productDetailsPageViewModel.productVariationsArray = [];

            // destroy the ej2 components on the page
            $('#product-details-quantity').get(0).ej2_instances[0].destroy();
            $('#product-details-review').get(0).ej2_instances[0].destroy();
            $('#product-details-share').get(0).ej2_instances[0].destroy();
            $('#product-details-add-to-cart').get(0).ej2_instances[0].destroy();
            $('#product-details-customise-product').get(0).ej2_instances[0].destroy();

            // destroy any product variation dropdown list
            $('#product-details-page .product-details-variation-option').each(function(index, element){
                element.ej2_instances[0].destroy(); // destroy the dropdown list component
            });
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){

            // get the pages stack from the app main navigator
            var pagesStackArray = $('#app-main-navigator').get(0).pages;

            // check that there is more than 1 page in the stack
            if(pagesStackArray.length > 1){ // there is more than 1 page in the page stack
                // get the previous Page in stack before this one
                let previousPage = $(pagesStackArray[pagesStackArray.length - 2]).get(0);

                // check which page has is being displayed AFTER a page was popped
                switch(previousPage.id){
                    case "app-main-page": // the page that is being displayed is the "App-Main" page
                        // check which page on the app-main tab is visible
                        if($('#app-main-tabbar').get(0).getActiveTabIndex() === 4){ // the "Products" page is visible
                            // get back to the previous page on the app-main navigator stack
                            // and set the 'resetPageDisplay' to false
                            $('#app-main-navigator').get(0)._resetPageDisplay = false;
                            // allow infinite page scroll to be triggered on the "Products" page
                            $('#products-page').get(0)._allowInfinitePageScroll = true;
                            $('#app-main-navigator').get(0).popPage();
                        }
                        else{
                            // get back to the previous page on the app-main navigator stack
                            $('#app-main-navigator').get(0).popPage();
                        }
                        break;
                    default:
                        // get back to the previous page on the app-main navigator stack
                        $('#app-main-navigator').get(0).popPage();
                        break
                }
            }
            else{ // there is only 1 page in the stack

            }
        },

        /**
         * method is triggered when the "Share" button is clicked
         * @returns {Promise<void>}
         */
        async shareButtonClicked(){
            var shareOptions = {}; // holds the options for sharing
            shareOptions.message = "check out this #ShopOakExclusive product";
            shareOptions.chooserTitle = "share product with...";

            // handle the task in a separate event block
            window.setTimeout(function(){
                if(utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                    currentProductVariationIndex !== -1){ // a product variation was selected
                    // get the index of the currently selected variation
                    let productVariationIndex = utopiasoftware[utopiasoftware_app_namespace].controller.
                        productDetailsPageViewModel.currentProductVariationIndex;
                    // get the currently selected product variation using the selected index
                    let productVariation = utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                        productVariationsArray[productVariationIndex];
                    // update the url for the product
                    shareOptions.url = productVariation.permalink;
                    // update the file/image of the product to be share
                    shareOptions.files = [productVariation.image && productVariation.image !== ""? productVariation.image.src :
                        utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                            currentProductDetails.images[0].src];
                }
                else{ // no product variation was selected, so use the default product details
                    shareOptions.url = utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                        currentProductDetails.permalink;
                    // update the file/image of the product to be share
                    shareOptions.files = [utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                        currentProductDetails.images[0].src];
                }

                // also copy the text to clipboard
                cordova.plugins.clipboard.copy(`${shareOptions.message} | ${shareOptions.url}`,
                    function(){
                        // inform the user that message has been copied to clipboard
                        window.plugins.toast.showWithOptions({
                            message: "shared message copied to clipboard",
                            duration: 3000,
                            position: "center",
                            styling: {
                                cornerRadius: 0,
                                opacity: 1,
                                backgroundColor: '#3F51B5',
                                textColor: '#FFFFFF',
                                textSize: 14
                            }
                        });
                    }, function(){});
                // open the device share dialog
                window.plugins.socialsharing.shareWithOptions(shareOptions, function(){}, function(){});
            }, 0);
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // disable pull-to-refresh widget till loading is done
            $('#product-details-page #product-details-page-pull-hook').attr("disabled", true);

            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            // disable the "Add To Cart" button
            $('#product-details-page #product-details-add-to-cart').attr("disabled", true);
            // remove the spinner from the 'Add To Cart'
            $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
            $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].dataBind();
            $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].stop();

            try{
                // load product variations asynchronously without waiting for the response
                utopiasoftware[utopiasoftware_app_namespace].controller.
                productDetailsPageViewModel.loadProductVariations();
                // load product details
                let productDetailsArray = await utopiasoftware[utopiasoftware_app_namespace].controller.
                productDetailsPageViewModel.loadProduct();
                // display the loaded product details
                await utopiasoftware[utopiasoftware_app_namespace].controller.
                productDetailsPageViewModel.displayProductDetails(productDetailsArray[0]);
            }
            catch(err){ // an error occurred

                // display toast to show that error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.content = "Sorry, an error occurred. Refresh to try again";
                toast.dataBind();
                toast.show();
            }
            finally{
                // enable pull-to-refresh widget till loading is done
                $('#product-details-page #product-details-page-pull-hook').removeAttr("disabled");
                // enable the "Add To Cart" button
                $('#product-details-page #product-details-add-to-cart').removeAttr("disabled");
                // signal that loading is done
                doneCallBack();
            }
        },

        /**
         * method is used to load a particular product detail.
         *
         * The product to be loaded can be directly passed to the page for loading OR
         * the id of the product can be provided to the page, so that the product is
         * retrieved from the remote server
         *
         * @returns {Promise<void>}
         */
        async loadProduct(){
            var productPromisesArray = []; // holds the array for the promises used to load the product

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'default-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to see updated product details`;
                toast.dataBind();
                toast.show();
            }
            // check if all the product details were provided to the page
            if($('#app-main-navigator').get(0).topPage.data.product){ // all product details were provided
                let aProduct = $('#app-main-navigator').get(0).topPage.data.product; // get the product details

                if(!aProduct.regular_price || aProduct.regular_price == ""){ // regular price was NOT set, so set it
                    aProduct.regular_price = "0.00";
                }

                // set the current product to that which was provided to the page
                utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                    currentProductDetails = aProduct;

                productPromisesArray.push(Promise.resolve(aProduct)); // resolve the promise with the product details
            }
            else{ // at least the product id was provided
                // load the requested products list from the server
                productPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/products/${jQuery('#app-main-navigator').get(0).topPage.data.productId}`,
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true
                        }
                    )).then(function(product){
                        if(!product.regular_price || product.regular_price == ""){ // regular price was NOT set, so set it
                            product.regular_price = "0.00";
                        }
                        // set the current product to that which was retrieved from the server
                        utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                            currentProductDetails = product;
                        resolve(product); // resolve the parent promise with the data gotten from the server

                    }).catch(function(err){ // an error occurred

                        reject(err); // reject the parent promise with the error
                    });
                }));

            }

            return Promise.all(productPromisesArray); // return a Promise which resolves when all promises resolve
        },

        /**
         * method is used to load a particular product variations.
         *
         * The product variations to be loaded is gotten from the product directly passed to the page OR
         * the prduct id passed to the page
         *
         * @returns {Promise<void>}
         */
        async loadProductVariations(){
            var productPromisesArray = []; // holds the array for the promises used to load the product
            var productId = null; // holds the product id

            // check if all the product details were provided to the page
            if($('#app-main-navigator').get(0).topPage.data.product){ // all product details were provided
                // save the product id
                productId = $('#app-main-navigator').get(0).topPage.data.product.id;

            }
            else{ // at least the product id was provided
                // save the product id
                productId = jQuery('#app-main-navigator').get(0).topPage.data.productId;
            }

            // load the requested products variations from the server
            productPromisesArray.push(new Promise(function(resolve, reject){
                Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/products/${productId}/variations`,
                        type: "get",
                        //contentType: "application/x-www-form-urlencoded",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: true,
                        data: {page: 1, per_page: 99, status: 'publish'}
                    }
                )).then(function(productVariations){
                    // map the retrieved variations and save the unique value for the variation.
                    // The unique value is used to uniquely identify the variation
                    productVariations = productVariations.map(function(currentElement, index){
                        // join all options from the variation attributes to create a unique value
                        currentElement._variationValue = currentElement.attributes.map(function(attribute){
                            return attribute.option;
                        }).join("");

                        return currentElement;
                    });

                    // save the retrieved production variations
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        productDetailsPageViewModel.productVariationsArray = productVariations;

                    resolve(productVariations); // resolve the parent promise with the data gotten from the server

                }).catch(function(err){ // an error occurred

                    reject(err); // reject the parent promise with the error
                });
            }));

            return Promise.all(productPromisesArray); // return a Promise which resolves when all promises resolve
        },

        /**
         * method is used to display the product details on the page
         *
         * @param productDetails {Object} the product object to be displayed
         *
         * @returns {Promise<void>}
         */
        async displayProductDetails(productDetails){
            // update the product details image
            $('#product-details-page .e-card-image').css("background-image", `url("${productDetails.images[0].src}")`);

            // check if the product is on-sale
            if(productDetails.on_sale === true){ // product is on-sale
                $('#product-details-page .e-card-image').
                html(`
                <span class="e-badge e-badge-danger" style="float: right; clear: both; 
                                                    background-color: transparent; color: #d64113;
                                                    border: 1px #d64113 solid; font-size: 0.6em;">
                                                    ${Math.ceil((Math.abs(kendo.parseFloat(productDetails.price) -
                    kendo.parseFloat(productDetails.regular_price)) /
                    kendo.parseFloat(productDetails.regular_price === "0.00" ?
                        productDetails.price : productDetails.regular_price))
                    * 100)}% OFF
                 </span>`);
            }

            // update the product title/name
            $('#product-details-page .e-card-title').html(`${productDetails.name}`);
            // update product price
            $('#product-details-page .product-details-price').
            html(`&#x20a6;${kendo.toString(kendo.parseFloat(productDetails.price), "n2")}`);

            // check if product is on-sale
            if(productDetails.on_sale === true){ // product is on-sale
                // update the regular price
                $('#product-details-page .product-details-regular-price').
                html(`&#x20a6;${kendo.toString(kendo.parseFloat(productDetails.regular_price), "n2")}`);
                // make the regular price visible
                $('#product-details-page .product-details-regular-price').css("visibility", "visible");
                // add 'sales' class to the quantity component
                $('#product-details-quantity').get(0).ej2_instances[0].cssClass = "product-details-quantity-class sales";
                $('#product-details-quantity').get(0).ej2_instances[0].dataBind();
            }
            else{ // product is NOT on-sale
                // make the regular price invisible
                $('#product-details-page .product-details-regular-price').css("visibility", "collapse");
                // remove 'sales' class from the quantity component
                $('#product-details-quantity').get(0).ej2_instances[0].cssClass = "product-details-quantity-class";
                $('#product-details-quantity').get(0).ej2_instances[0].dataBind();
            }

            // reset the product details quantity numeric input field
            $('#product-details-quantity').get(0).ej2_instances[0].value = 1;
            $('#product-details-quantity').get(0).ej2_instances[0].dataBind();

            // update the product details description
            $('#product-details-page .product-details-description').html(`${productDetails.short_description}`);

            // destroy any previous product variation dropdown list that may previously exist before creating the new ones
            $('#product-details-page .product-details-variation-option').each(function(index, element){
                element.ej2_instances[0].destroy(); // destroy the dropdown list component
            });

            // add/update product details variation
            // expand the variations content
            $('#product-details-page .product-details-variations').removeClass('expandable-content');
            let variationContent = ''; // holds the product details variation content
            for(let index = 0; index < productDetails.attributes.length; index++){
                // create the product details variations
                variationContent += `<div class="col-xs-4" style="padding-right: 5px; padding-left: 5px;">
                    <select name="${productDetails.attributes[index].name}" class="product-details-variation-option">
                        ${productDetails.attributes[index].options.map(function(arrayElem){
                            return `<option value="${arrayElem}">${arrayElem}</option>`;
                }).join("")}
                    </select>
                </div>`;
            }
            // insert the created Select inputs to the page
            $('#product-details-page .product-details-variations').html(variationContent);

            // create the dropdown list from each of the select input
            $('#product-details-page .product-details-variation-option').each(function(index, element){
                // check if this product details has default attributes set
                if(productDetails.default_attributes.length > 0){ // there are default attributes
                    // set those default attributes for the variations
                    $(`option[value="${productDetails.default_attributes[index].option}"]`, element).attr("selected", true);
                }
                // create the dropdown list from the select input
                new ej.dropdowns.DropDownList(
                    {
                        cssClass: "product-details-variation-class",
                        placeholder: productDetails.attributes[index].name,
                        floatLabelType: 'Always',
                        change: async function () { // listen for when dropdown list value changes
                            // return a Promise which resolves when the change is completed
                            return new Promise(function(resolve2, reject2){

                                // handle the change in a separate event block
                                window.setTimeout(async function(){
                                    let concatenatedVarationValue = ""; // holds the concatenated variation values
                                    // get the value from all the variation select-input/dropdown and concatenate them
                                    $('#product-details-page .product-details-variation-option').each(function(index2, element2){
                                        concatenatedVarationValue += element2.ej2_instances[0].value;
                                    });

                                    // since the concatenated variation value, is also what is used to uniquely identify each varition,
                                    // check if there is any variation with the same unique value has the concatenated variation value.
                                    // Also, assign the index position of the 'found' variation (if anty) to the current variation index property
                                    let variationIndexPosition =
                                        utopiasoftware[utopiasoftware_app_namespace].controller.
                                        productDetailsPageViewModel.productVariationsArray.findIndex(function(element3){
                                            return concatenatedVarationValue === element3._variationValue;
                                        });
                                    utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                                        currentProductVariationIndex = variationIndexPosition;

                                    // check if there is a product variation that matches the user's selection
                                    if(utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                                        currentProductVariationIndex !== -1){ // there is a product variation
                                        // get the product variation
                                        let productVariation = utopiasoftware[utopiasoftware_app_namespace].controller.
                                            productDetailsPageViewModel.productVariationsArray[variationIndexPosition];
                                        // update the product details display image and price to that of the selected variation (if any)
                                        if(productVariation.image && productVariation.image !== ""){
                                            // update the product details image
                                            $('#product-details-page .e-card-image').css("background-image",
                                                `url("${productVariation.image.src}")`);
                                        }
                                        if(productVariation.price && productVariation.price !== ""){
                                            // update product price
                                            $('#product-details-page .product-details-price').
                                            html(`&#x20a6;${kendo.toString(kendo.parseFloat(productVariation.price), "n2")}`);
                                        }
                                    }

                                    // resolve the parent Promise object to signified that change is completed
                                    resolve2();

                                }, 0);
                            });
                        }
                    }).appendTo(element);
            });

            // collapse the variations content
            $('#product-details-page .product-details-variations').addClass('expandable-content');

            // update the rating for the product details
            $('#product-details-page .product-details-rating').
            html(`
            ${Math.floor(kendo.parseFloat(productDetails.average_rating)) > 0 ?
                '<ons-icon icon="md-star" fixed-width></ons-icon>'.
                repeat(Math.floor(kendo.parseFloat(productDetails.average_rating))) :
                '<ons-icon icon="md-star-outline" style="color: lightgray" fixed-width></ons-icon>'.repeat(5)}
                <span style="display: inline-block; color: gray;">
                ${Math.floor(kendo.parseFloat(productDetails.average_rating)) > 0 ? 
                `(${productDetails.rating_count})` : ""}
                </span>
            `);

            // update the extra/more details for the product
            $('#product-details-page .product-details-more-description').html(`
            ${productDetails.description}`);

            // update the dimensions for the product details
            $('#product-details-page .product-details-dimensions').html(`
            <span class="list-item__subtitle" style="display: block">length - ${!productDetails.dimensions.length ||
            productDetails.dimensions.length == "" ? "(Not Available)" : `${productDetails.dimensions.length}`}</span>
            <span class="list-item__subtitle" style="display: block">width - ${!productDetails.dimensions.width ||
            productDetails.dimensions.width == "" ? "(Not Available)" : `${productDetails.dimensions.width}`}</span>
            <span class="list-item__subtitle" style="display: block">height - ${!productDetails.dimensions.height ||
            productDetails.dimensions.height == "" ? "(Not Available)" : `${productDetails.dimensions.height}`}</span>`);

            // update the weight for the product
            $('#product-details-page .product-details-weight').html(`${!productDetails.weight ||
            productDetails.weight == "" ? "(Not Available)" : `${productDetails.weight}`}`);
        },

        /**
         * method is triggered when the customise button is clicked
         *
         * @returns {Promise<void>}
         */
        async customiseButtonClicked(){
            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3500;
                toast.content = `Please connect to the Internet to customise product`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // perform the method task in a separate event block
            window.setTimeout(async function(){
                var productUrl = ""; // holds the url for the product being customised

                // check if the user has selected a product variation or if the default product is being customised
                if(utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                    currentProductVariationIndex !== -1){ // a product variation was selected
                    // get the index position of the selected variation
                    let variationIndex = utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                        currentProductVariationIndex;
                    // get the production variation object
                    let productVariation = utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.
                        productVariationsArray[variationIndex];
                    productUrl = productVariation.permalink; // set the product url
                }
                else{ // no product variation was selected, so use the default product details
                    productUrl = utopiasoftware[utopiasoftware_app_namespace].controller.
                        productDetailsPageViewModel.currentProductDetails.permalink; // set the product url
                }

                // load the "Customise Product" page to the app-main-navigator
                await $('#app-main-navigator').get(0).pushPage("customise-product-page.html");
                // load the product customisation url
                await utopiasoftware[utopiasoftware_app_namespace].controller.
                    customiseProductPageViewModel.loadProductCustomisation(productUrl);

            }, 0);

        },

        /**
         * method is triggered when the "Add To Cart" button is clicked
         *
         * @returns {Promise<void>}
         */
        async addToCartButtonClicked(){

            // disable the "Add To Cart" button
            $('#product-details-page #product-details-add-to-cart').attr("disabled", true);
            // add the spinner from the 'Add To Cart'
            $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].cssClass = '';
            $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].dataBind();
            $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].start();

            // perform the task of including the product into the local cart in a separate event block
            window.setTimeout(async function(){
                let localCart = []; // holds the local cart collection
                let utopiasoftwareCartObject = {cartData: {}}; // holds the object whose properties make up the cart item

                // get the cached user cart
                try{
                    localCart = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",
                        utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart;
                }
                catch(err){}

                // check if a product variation was selected
                if(utopiasoftware[utopiasoftware_app_namespace].controller.
                    productDetailsPageViewModel.currentProductVariationIndex !== -1){ // a product variation was selected
                    // get the selected product variation index position and the accompanying variation object
                    let variationIndex = utopiasoftware[utopiasoftware_app_namespace].controller.
                        productDetailsPageViewModel.currentProductVariationIndex;
                    let productVariation = utopiasoftware[utopiasoftware_app_namespace].controller.
                        productDetailsPageViewModel.productVariationsArray[variationIndex];

                    utopiasoftwareCartObject.cartData.variation_id = productVariation.id;

                    // get the search parameters object from the product variation url
                    let searchParams = new URLSearchParams(productVariation.permalink.split("?")[1]);
                    // get the variation attributes from searchParams object and assign them in cartData object
                    utopiasoftwareCartObject.cartData.variation = {};
                    for(let [key, value] of searchParams){
                        utopiasoftwareCartObject.cartData.variation[key] = value;
                    }

                    // store the product variation object as additional data just for the mobile app
                    utopiasoftwareCartObject.productVariation = productVariation;
                }
                // set the other properties of the cart data
                utopiasoftwareCartObject.cartData.product_id = utopiasoftware[utopiasoftware_app_namespace].controller.
                    productDetailsPageViewModel.currentProductDetails.id;
                utopiasoftwareCartObject.cartData.quantity = $('#product-details-quantity').get(0).ej2_instances[0].value;

                // store the product object as additional data just for the mobile app
                utopiasoftwareCartObject.product = utopiasoftware[utopiasoftware_app_namespace].controller.
                    productDetailsPageViewModel.currentProductDetails;
                // store a unique local-cart uid to identify the product
                utopiasoftwareCartObject.uid = Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine);

                try{
                    // add the created 'utopiasoftwareCartObject' to the user cart collection
                    localCart.push(utopiasoftwareCartObject);
                    // save the updated cached user cart
                    await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                        {_id: "user-cart", docType: "USER_CART", cart: localCart},
                        utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                    // inform the user that the product has been added to cart
                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'success-ej2-toast';
                    toast.timeOut = 2000;
                    toast.content = `Product has been added to your cart`;
                    toast.dataBind();
                    toast.show();

                    console.log("USER CART OBJECT", utopiasoftwareCartObject);
                }
                catch(err){
                    console.log("PRODUCT DETAILS ERROR", err);
                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.timeOut = 3500;
                    toast.content = `Error adding product to your cart. Try again`;
                    toast.dataBind();
                    toast.show();
                }
                finally{
                    // enable the "Add To Cart" button
                    $('#product-details-page #product-details-add-to-cart').removeAttr("disabled");
                    // hide the spinner from the 'Add To Cart'
                    $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
                    $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].dataBind();
                    $('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].stop();
                }

            }, 0);
        }

    },

    /**
     * this is the view-model/controller for the Customise Product page
     */
    customiseProductPageViewModel: {

        /**
         * holds the current customisation url that has been loaded
         */
        currentCustomisationUrl : "",

        /**
         * holds the remote/server cart item key for the current customised product
         */
        currentCustomisationCartKey: null,

        /**
         * holds the number of times the customisation page has been loaded from the parent server
         */
        customisationPageLoadCount: 0,

        /**
         * holds the fixed-length queue containing the previous cart object and the new/update cart object.
         * The queue can only contain a max of 2 items. older items are pushed out first.
         * The initial cart object is also gotten the first time this app page is loaded or refreshed
         */
        cartsQueue: [],

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        customiseProductPageViewModel.backButtonClicked;

                // add method to handle the loading action of the pull-to-refresh widget
                $('#customise-product-page-pull-hook', $thisPage).get(0).onAction =
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        customiseProductPageViewModel.pagePullHookAction;

                // register listener for listening to messages from the parent site
                window.addEventListener("message", utopiasoftware[utopiasoftware_app_namespace].controller.
                    customiseProductPageViewModel.receiveMessageListener, false);

                // register listener for the pull-to-refresh widget
                $('#customise-product-page-pull-hook', $thisPage).on("changestate", function(event){

                    // check the state of the pull-to-refresh widget
                    switch (event.originalEvent.state){
                        case 'initial':
                            // update the displayed content
                            $('#customise-product-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'preaction':
                            // update the displayed content
                            $('#customise-product-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'action':
                            // update the displayed content
                            $('#customise-product-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                            break;
                    }
                });

                try{

                    // create the "Cancel" button
                    new ej.buttons.Button({
                        //iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
                        //iconPosition: "Left"
                    }).appendTo('#customise-product-cancel');

                    // create the "Add To Cart" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#customise-product-add-to-cart');


                }
                catch(err){
                    console.log("CUSTOMISATION ERROR", err);
                }
                finally {

                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            window.SoftInputMode.set('adjustResize');

            // update cart count
            $('#customise-product-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            // listen for when the device does not have Internet connection
            document.addEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOnlineListener, false);
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // remove listener for when the device does not have Internet connection
            document.removeEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOfflineListener, false);
            // remove listener for when the device has Internet connection
            document.removeEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOnlineListener, false);
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // reset the current customisation url
            utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.currentCustomisationUrl = "";
            // reset the current customisation remote cart item key
            utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.currentCustomisationCartKey = null;
            // reset the customisation page load count
            utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.customisationPageLoadCount = 0;
            // reset the cartsQueue
            utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.cartsQueue = [];

            // remove listener for listening to messages from the parent site
            window.removeEventListener("message", utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.receiveMessageListener, false);

            $('#customise-product-cancel').get(0).ej2_instances[0].destroy();
            $('#customise-product-add-to-cart').get(0).ej2_instances[0].destroy();
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered whenever the user's device is offline
         */
        deviceOfflineListener(){
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
            $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
            // display toast to show that there is no internet connection
            let toast = $('.page-toast').get(0).ej2_instances[0];
            toast.cssClass = 'default-ej2-toast';
            toast.content = "No Internet connection. Connect to the Internet to customise product";
            toast.dataBind();
            toast.show();// show ej2 toast
        },

        /**
         * method is triggered whenever the user's device is online
         */
        deviceOnlineListener(){
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');
        },


        /**
         * method is used to handle the receipt of messages from the parent website
         *
         * @param receiveEvent {Event} this is the event object of the "Message" event
         *
         * @returns {Promise<void>}
         */
        async receiveMessageListener(receiveEvent){
            // check where the message originated from
            if(receiveEvent.origin !== "https://shopoakexclusive.com"){ // message is not from the parent website
                return; // exit
            }

            // check the data that was sent
            if(receiveEvent.data === "page ready"){ // parent site is ready to work together
                // update the customisation page load count by 1
                utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                    customisationPageLoadCount += 1;
                // remove the page preloader
                $('#customise-product-page .page-preloader').css("display", "none");
                return;
            }
            else{ // the page sent cart data
                // access the cart data
                let cartData = JSON.parse(receiveEvent.data);
                if(Array.isArray(cartData)){ // the cart data is an array, therefore it's empty
                    // push an empty object into the cart queue property
                    utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue.
                    push({});
                }
                else{ // cart data is not an array
                    // push the cart data into the cart queue
                    utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue.
                    push(cartData);
                }

                // check if the cartQueue property is greater than its maximum allowed length of 2
                if(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                    cartsQueue.length > 2){ // cartQueue property is greater than 2 elements
                    // remove the oldest element from the queue
                    utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                        cartsQueue.shift();
                }

                // save the customised product to local cart cache (do this in a separate event queue)
                window.setTimeout(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                saveCustomisedProductToCart, 0);

                // enable the "Add To Cart" button
                $('#customise-product-page #customise-product-add-to-cart').removeAttr("disabled");
                // hide the spinner on the 'Add To Cart'
                $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
                $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].dataBind();
                $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].stop();
            }
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // show the page preloader
            $('#customise-product-page .page-preloader').css("display", "block");
            // disable the "Add To Cart" button
            $('#customise-product-page #customise-product-add-to-cart').attr("disabled", true);
            // remove the spinner from the 'Add To Cart'
            $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
            $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].dataBind();
            $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].stop();

            // hide page loader
            $('#customise-product-page #customise-product-page-iframe-container .modal').css("display", "none");

            // disable pull-to-refresh widget till loading is done
            $('#customise-product-page #customise-product-page-pull-hook').attr("disabled", true);
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            try{
                // reload the current product customisation url  & current remote cart item key into the iframe
                await utopiasoftware[utopiasoftware_app_namespace].controller.
               customiseProductPageViewModel.
                loadProductCustomisation(utopiasoftware[utopiasoftware_app_namespace].controller.
                    customiseProductPageViewModel.currentCustomisationUrl,
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        customiseProductPageViewModel.currentCustomisationCartKey);
            }
            catch(err){ // an error occurred

                // display toast to show that error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.content = "Sorry, an error occurred. Refresh to try again";
                toast.dataBind();
                toast.show();
            }
            finally{
                window.setTimeout(function(){ // wait for 2 sec before declaring loading done
                    // enable pull-to-refresh widget till loading is done
                    $('#customise-product-page #customise-product-page-pull-hook').removeAttr("disabled");
                    // signal that loading is done
                    doneCallBack();
                }, 2000);
            }
        },

        /**
         * method is used to load a particular product/product variation customisation.
         *
         * @param customisationUrl {String} holds the url for the product to be customised
         *
         * @param remoteCartItemKey {String} holds the remote cart item key for the
         * product being customised
         *
         * @returns {Promise<void>}
         */
        async loadProductCustomisation(customisationUrl = utopiasoftware[utopiasoftware_app_namespace].
            controller.customiseProductPageViewModel.currentCustomisationUrl, remoteCartItemKey){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'default-ej2-toast';
                toast.timeOut = 3500;
                toast.content = `Please connect to the Internet to customise product and Pull Down to refresh`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // check if the 'remoteCartItemKey' has been provided
            if(remoteCartItemKey){ // the remote cart item key was provided
                if(customisationUrl.indexOf("?") < 0){ // there are NO previous query parameters
                    // attach the cart item key to the available customisation url & load it
                    // load the specified url into the customisation iframe
                    $('#customise-product-page #customise-product-page-iframe').attr("src",
                        customisationUrl + `?cart_item_key=${window.encodeURIComponent(remoteCartItemKey)}`);
                }
                else{ // there are previous query parameters
                    // attach the cart item key to the previous query parameters and load the customisation url
                    // load the specified url into the customisation iframe
                    $('#customise-product-page #customise-product-page-iframe').attr("src",
                        customisationUrl + `&cart_item_key=${window.encodeURIComponent(remoteCartItemKey)}`);
                }
            }
            else{ // NO remote cart item key was provided
                // load the specified url (as is) into the customisation iframe
                $('#customise-product-page #customise-product-page-iframe').attr("src", customisationUrl);
            }

            // update the current customisation url
            utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                currentCustomisationUrl = customisationUrl;

            // update the current remote/server cart item key for the product being customised
            utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                currentCustomisationCartKey = remoteCartItemKey;

            // reset the page load count and cartsQueue properties
            utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                customisationPageLoadCount = 0;
            utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue = [];

            return true;
        },

        /**
         * method is used to compare the cartQueue property and saves the latest customised product to
         * local cart cache in the app database
         *
         * @returns {Promise<void>}
         */
        async saveCustomisedProductToCart(){
            // get the previous remote cart object and the new/updated remote cart object
            let previousCartObject = utopiasoftware[utopiasoftware_app_namespace].
                controller.customiseProductPageViewModel.cartsQueue[0];
            let updatedCartObject = utopiasoftware[utopiasoftware_app_namespace].
                controller.customiseProductPageViewModel.cartsQueue[1];

            // get the latest customised product by comparing the properties of the updateCartObject with the previousCartObject
            for(let property in updatedCartObject){
                // check if this property in the updateCartObject exist in th epreviousCartObject
                if(! previousCartObject[property]){ // property does not exist in the previousCartObject, so this property belongs to the latest customised product
                    // get the latest customised product
                    let customisedProduct = updatedCartObject[property];

                    console.log("CUSTOMISED PRODUCT", customisedProduct);

                    let localCart = []; // holds the local cart collection
                    let utopiasoftwareCartObject = {cartData: {}}; // holds the object whose properties make up the cart item

                    // get the cached user cart
                    try{
                        localCart = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart;

                        // check if this is a save of an "edited" previously customised product
                        if(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                            currentCustomisationCartKey){ // since a current customisation cart key exist, this is an update

                            // get the utopiasoftwareCartObject for the old customised product being updated.
                            // This old object will be replaced by the newly customised product, so delete it from app local cache/database
                            let customisedIndex = localCart.findIndex(function(cartObject){
                                return cartObject.anon_cart_key === utopiasoftware[utopiasoftware_app_namespace].
                                    controller.customiseProductPageViewModel.currentCustomisationCartKey;
                            });
                            localCart.splice(customisedIndex, 1); // delete the old customised product
                        }
                    }
                    catch(err){}

                    // set the other properties of the cart data
                    utopiasoftwareCartObject.cartData.product_id = customisedProduct.product_id;
                    utopiasoftwareCartObject.cartData.quantity = customisedProduct.quantity;
                    utopiasoftwareCartObject.cartData.variation_id = customisedProduct.variation_id;
                    utopiasoftwareCartObject.cartData.variation = customisedProduct.variation;
                    utopiasoftwareCartObject.cartData.cart_item_data = {fpd_data: customisedProduct.fpd_data}; // holds the fancy product designer data

                    // store the cart key used to identify the customised product as additional data just for the mobile app
                    utopiasoftwareCartObject.anon_cart_key = customisedProduct.key;
                    // store the name of the customised product as additional data just for the mobile app
                    utopiasoftwareCartObject.product_name = customisedProduct.product_name;
                    // store the cutomisationUrl of this product as additional data just for the mobile app
                    utopiasoftwareCartObject.customisationUrl = utopiasoftware[utopiasoftware_app_namespace].controller.
                        customiseProductPageViewModel.currentCustomisationUrl;
                    // store a unique local-cart uid to identify the product just for the mobile app
                    utopiasoftwareCartObject.uid = Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine);

                    try{
                        // add the created 'utopiasoftwareCartObject' to the user cart collection
                        localCart.push(utopiasoftwareCartObject);
                        // save the updated cached user cart
                        await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                            {_id: "user-cart", docType: "USER_CART", cart: localCart},
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                        // inform the user that the product has been added to cart
                        // hide all previously displayed ej2 toast
                        $('.page-toast').get(0).ej2_instances[0].hide('All');
                        $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                        // display toast to show that an error
                        let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                        toast.cssClass = 'success-ej2-toast';
                        toast.timeOut = 2000;
                        toast.content = `Customised product has been added to your cart`;
                        toast.dataBind();
                        toast.show();
                    }
                    catch(err){
                        console.log("CUSTOMISE PRODUCT ERROR", err);

                        // hide all previously displayed ej2 toast
                        $('.page-toast').get(0).ej2_instances[0].hide('All');
                        $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                        // display toast to show that an error
                        let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                        toast.cssClass = 'error-ej2-toast';
                        toast.timeOut = 3500;
                        toast.content = `Error adding customised product to your cart. Try again`;
                        toast.dataBind();
                        toast.show();

                    }
                    finally{
                        // check if this is a save of an "edited" previously customised product
                        if(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                            currentCustomisationCartKey){ // since a current customisation cart key exist, this is an update
                            // update the 'currentCustomisationCartKey' property with the key of the newly customised product
                            utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                                currentCustomisationCartKey = customisedProduct.key;
                        }

                        // hide page loader after saving the customised product to user cart
                        $('#customise-product-page #customise-product-page-iframe-container .modal').css("display", "none");
                    }

                    break; // break the for-loop since the latest customised product has been found
                }
            }
        },

        /**
         * method is triggered when the user clicks the "Add To Cart" button
         *
         * @returns {Promise<void>}
         */
        async addToCartButtonClicked(){

            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'default-ej2-toast';
                toast.timeOut = 3500;
                toast.content = `Please connect to the Internet to add customised product to cart`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // show the spinner on the 'Add To Cart' button to indicate process is ongoing
            $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].cssClass = '';
            $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].dataBind();
            $('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].start();

            // display page loader while completing the "add to cart" request
            $('#customise-product-page #customise-product-page-iframe-container .modal').css("display", "table");

            // call the method to submit the product customisation form located in the iframe window
            $('#customise-product-page #customise-product-page-iframe').get(0).contentWindow.utopiasoftware_addUsage();
        }
    },

    /**
     * this is the view-model/controller for the View Cart page
     */
    viewCartPageViewModel: {

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.backButtonClicked;

                // add method to handle the loading action of the pull-to-refresh widget
                $('#view-cart-page-pull-hook', $thisPage).get(0).onAction =
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.pagePullHookAction;

                // register listener for the pull-to-refresh widget
                $('#view-cart-page-pull-hook', $thisPage).on("changestate", function(event){

                    // check the state of the pull-to-refresh widget
                    switch (event.originalEvent.state){
                        case 'initial':
                            // update the displayed content
                            $('#view-cart-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'preaction':
                            // update the displayed content
                            $('#view-cart-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');
                            break;

                        case 'action':
                            // update the displayed content
                            $('#view-cart-page-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');
                            break;
                    }
                });

                try{
                    // create the "Checkout" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#view-cart-checkout');

                }
                catch(err){

                    console.log("VIEW-CART PAGE", err);
                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.content = `Sorry, an error occurred. Pull down to refresh`;
                    toast.dataBind();
                    toast.show();
                }

            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // update cart count
            $('#view-cart-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            window.SoftInputMode.set('adjustResize');
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
            // destroy View Cart button
            $('#view-cart-checkout').get(0).ej2_instances[0].destroy();
            // destroy all the "Edit" buttons on the View Cart page
            $("#view-cart-page .view-cart-edit-button").each(function(index, element){
                // destroy the "Edit" button
                element.ej2_instances[0].destroy();
            });

            // destroy all the "Remove" buttons required for the View Cart page
            $("#view-cart-page .view-cart-remove-button").each(function(index, element){
                // destroy the "Remove" button
                element.ej2_instances[0].destroy();
            });

            // destroy all the "Quantity" input required for the View Cart page
            $("#view-cart-page .view-cart-quantity-input").each(function(index, element){
                // destroy the "Quantity" input
                element.ej2_instances[0].destroy();
            });
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){

            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // disable pull-to-refresh widget till loading is done
            $('#view-cart-page #view-cart-page-pull-hook').attr("disabled", true);

            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            // disable the "Checkout" button
            $('#view-cart-page #view-cart-checkout').attr("disabled", true);
            // remove the spinner from the 'Add To Cart'
            $('#view-cart-page #view-cart-checkout').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
            $('#view-cart-page #view-cart-checkout').get(0).ej2_instances[0].dataBind();
            $('#view-cart-page #view-cart-checkout').get(0).ej2_instances[0].stop();

            try{
                // display the loaded product details
                await utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.displayUserCart();
            }
            catch(err){ // an error occurred

                // display toast to show that error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.content = "Sorry, an error occurred. Refresh to try again";
                toast.dataBind();
                toast.show();
            }
            finally{
                // enable pull-to-refresh widget till loading is done
                $('#view-cart-page #view-cart-page-pull-hook').removeAttr("disabled");
                // enable the "Checkout" button
                $('#view-cart-page #view-cart-checkout').removeAttr("disabled");
                // hide the preloader
                $('#view-cart-page .page-preloader').css("display", "none");
                // signal that loading is done
                doneCallBack();
            }
        },

        /**
         * method is used to display the user cart on the View Cart page.
         * @param localCart {Array}
         *
         * @returns Promise
         */
        async displayUserCart(localCart){
            var displayContent = ""; // holds the cart content to be displayed
            try{

                try{
                    // get the localCart from the parameter passed OR from the the cached loCart from app database
                    localCart = localCart || (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("user-cart",
                        utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart;
                }
                catch(err){
                    // if error occurred during local cart retrieval
                    localCart = []; // set localCart to empty array
                }

                if(localCart.length === 0){ // localCart is empty
                    // display message to inform user that cart is empty
                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast to show that an error
                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'default-ej2-toast';
                    toast.timeOut = 3000;
                    toast.content = `Your cart is empty. Go order some products!`;
                    toast.dataBind();
                    toast.show();

                    return; // exit method
                }

                // destroy all the "Edit" buttons on the View Cart page
                $("#view-cart-page .view-cart-edit-button").each(function(index, element){
                    // destroy the "Edit" button
                    element.ej2_instances[0].destroy();
                });

                // destroy all the "Remove" buttons required for the View Cart page
                $("#view-cart-page .view-cart-remove-button").each(function(index, element){
                    // destroy the "Remove" button
                    element.ej2_instances[0].destroy();
                });

                // destroy all the "Quantity" input required for the View Cart page
                $("#view-cart-page .view-cart-quantity-input").each(function(index, element){
                    // destroy the "Quantity" input
                    element.ej2_instances[0].destroy();
                });

                // display the contents of the cart using a for-loop
                for(let index = 0; index < localCart.length; index++){
                    displayContent +=
                        `<div class="col-xs-12" style="border-bottom: 1px lightgray solid" 
                            data-utopiasoftware-product-uid="${localCart[index].uid}">
                        <div class="e-card e-card-horizontal">`;

                    if(localCart[index].anon_cart_key){ // this item is a customised product
                        displayContent +=
                            `<div class="e-card-image" style="-webkit-flex-basis: auto; flex-basis: auto; width: 30%;
                            min-height: 100%; 
                            background-image: url('${localCart[index].cartData.cart_item_data.fpd_data.fpd_product_thumbnail}');">
                            </div>
                            <div class="e-card-stacked" style="-webkit-flex-basis: auto; flex-basis: auto; width: 70%">
                            <div class="e-card-header" style="padding: 0">
                            <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">
                            <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">
                                ${localCart[index].product_name}
                            </div>
                            <div class="e-card-sub-title" style="font-size: 11px; text-align: center; text-transform: capitalize">
                                &#x20a6;${kendo.toString(localCart[index].cartData.quantity * kendo.parseFloat(localCart[index].cartData.cart_item_data.fpd_data.fpd_product_price), "n2")}
                            </div>
                            </div>
                            </div>
                            <div class="e-card-content row" style="padding: 0;">
                            <div class="col-xs-3">
                                <button type="button" class="view-cart-edit-button"
                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" 
                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                        viewCartPageViewModel.
                                        editCartItemButtonClicked('${localCart[index].customisationUrl}', 
                                        '${localCart[index].anon_cart_key}')"></button>
                            </div>
                            <div class="col-xs-4">
                                <button type="button" class="view-cart-remove-button"
                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" 
                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                        viewCartPageViewModel.deleteCartItemButtonClicked('${localCart[index].uid}')"></button>
                            </div>
                            <div class="col-xs-5">
                                <input class="view-cart-quantity-input" type="number" style="padding-top: 2px;" 
                                value="${localCart[index].cartData.quantity}" 
                                data-utopiasoftware-product-uid="${localCart[index].uid}">
                            </div>
                            </div>
                            </div>`;
                    }
                    else if(localCart[index].productVariation){ // this product was NOT saved with customisation, but has variations
                        displayContent +=
                            `<div class="e-card-image" style="-webkit-flex-basis: auto; flex-basis: auto; width: 30%;
                            min-height: 100%; 
                            background-image: 
                            url('${localCart[index].productVariation.image && localCart[index].productVariation.image !== "" ?
                                localCart[index].productVariation.image.src : localCart[index].product.images[0].src}');">
                            </div>
                            <div class="e-card-stacked" style="-webkit-flex-basis: auto; flex-basis: auto; width: 70%">
                            <div class="e-card-header" style="padding: 0">
                            <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">
                            <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">
                                ${localCart[index].product.name}
                            </div>
                            <div class="e-card-sub-title" style="font-size: 11px; text-align: center; text-transform: capitalize">
                                &#x20a6;${kendo.toString(localCart[index].cartData.quantity * kendo.parseFloat((localCart[index].productVariation.price && localCart[index].productVariation.price !== "" ?
                                localCart[index].productVariation.price : localCart[index].product.price)), "n2")}
                            </div>
                            </div>
                            </div>
                            <div class="e-card-content row" style="padding: 0;">
                            <div class="col-xs-3">
                            </div>
                            <div class="col-xs-4">
                                <button type="button" class="view-cart-remove-button"
                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" 
                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                        viewCartPageViewModel.deleteCartItemButtonClicked('${localCart[index].uid}')"></button>
                            </div>
                            <div class="col-xs-5">
                                <input class="view-cart-quantity-input" type="number" style="padding-top: 2px;" 
                                value="${localCart[index].cartData.quantity}" 
                                data-utopiasoftware-product-uid="${localCart[index].uid}">
                            </div>
                            </div>
                            </div>`;
                    }
                    else if(! localCart[index].productVariation) { // this product was NOT ssaved with customisation, and has NO variations
                        displayContent +=
                            `<div class="e-card-image" style="-webkit-flex-basis: auto; flex-basis: auto; width: 30%;
                            min-height: 100%; 
                            background-image: url('${localCart[index].product.images[0].src}');">
                            </div>
                            <div class="e-card-stacked" style="-webkit-flex-basis: auto; flex-basis: auto; width: 70%">
                            <div class="e-card-header" style="padding: 0">
                            <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">
                            <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">
                                ${localCart[index].product.name}
                            </div>
                            <div class="e-card-sub-title" style="font-size: 11px; text-align: center; text-transform: capitalize">
                                &#x20a6;${kendo.toString(localCart[index].cartData.quantity * kendo.parseFloat(localCart[index].product.price), "n2")}
                            </div>
                            </div>
                            </div>
                            <div class="e-card-content row" style="padding: 0;">
                            <div class="col-xs-3">                          
                            </div>
                            <div class="col-xs-4">
                                <button type="button" class="view-cart-remove-button"
                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" 
                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                        viewCartPageViewModel.deleteCartItemButtonClicked('${localCart[index].uid}')"></button>
                            </div>
                            <div class="col-xs-5">
                                <input class="view-cart-quantity-input" type="number" style="padding-top: 2px;" 
                                value="${localCart[index].cartData.quantity}" 
                                data-utopiasoftware-product-uid="${localCart[index].uid}">
                            </div>
                            </div>
                            </div>`;
                    }

                    displayContent +=
                        `</div>
                         </div>`;
                }

                // attach the displayContent to the page
                $('#view-cart-page #view-cart-contents-container').html(displayContent);

                // create all the "Edit" buttons required for the View Cart page
                $("#view-cart-page .view-cart-edit-button").each(function(index, element){
                    // create the "Edit" button
                    new ej.buttons.Button({
                        cssClass: 'e-flat e-round',
                        iconCss: "zmdi zmdi-edit utopiasoftware-icon-zoom-one-point-two",
                        iconPosition: "Left"
                    }).appendTo(element);
                });

                // create all the "Remove" buttons required for the View Cart page
                $("#view-cart-page .view-cart-remove-button").each(function(index, element){
                    // create the "Remove" button
                    new ej.buttons.Button({
                        cssClass: 'e-flat e-round',
                        iconCss: "zmdi zmdi-delete utopiasoftware-icon-zoom-one-point-two",
                        //iconPosition: "Left"
                    }).appendTo(element);
                });

                // create all the "Quantity" input required for the View Cart page
                $("#view-cart-page .view-cart-quantity-input").each(function(index, element){
                    new ej.inputs.NumericTextBox({
                        value: element.value,
                        cssClass: 'view-cart-quantity-input-class',
                        currency: null,
                        decimals: 0,
                        floatLabelType: 'Auto',
                        format: 'n',
                        showSpinButton: true,
                        min: 1,
                        max: 10,
                        placeholder: ' ',
                        step: 1,
                        strictMode: true,
                        width: '60%',
                        // sets value to the NumericTextBox
                        value: 1,
                        change: function(){ // track changes in the quantity numeric input for every product
                            let currentQuantityValue = this.value; // holds the current quantity value from the numeric input
                            let product_uid = $(element).attr('data-utopiasoftware-product-uid');
                            // dissplay page preloader
                            $('#view-cart-page .page-preloader').css("display", "block");

                            // handle task in a separate event block
                            window.setTimeout(async function(){
                                try {

                                    // find the product to be updated within the app localCart
                                    let selectedProduct = localCart.find(function(productElement){
                                        return productElement.uid === product_uid;
                                    });
                                    // update the quantity for the selected product
                                    selectedProduct.cartData.quantity = currentQuantityValue;
                                    // save the updated localCart object to the app cache/persistent storage
                                    await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                                        {_id: "user-cart", docType: "USER_CART", cart: localCart},
                                        utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                                    // display the updated user cart
                                    await utopiasoftware[utopiasoftware_app_namespace].controller.
                                    viewCartPageViewModel.displayUserCart(localCart);

                                    // inform the user that the product has been added to cart
                                    // hide all previously displayed ej2 toast
                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                                    // display toast to show that an error
                                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                                    toast.cssClass = 'success-ej2-toast';
                                    toast.timeOut = 2000;
                                    toast.content = `Product quantity updated`;
                                    toast.dataBind();
                                    toast.show();
                                }
                                catch(err){
                                    console.log("UPDATE PRODUCT QUANTITY", err);
                                    // hide all previously displayed ej2 toast
                                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                                    // display toast to show that an error occurred
                                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                                    toast.cssClass = 'error-ej2-toast';
                                    toast.timeOut = 3500;
                                    toast.content = `Product quantity not updated. Try again`;
                                    toast.dataBind();
                                    toast.show();
                                }
                                finally{
                                    // hide page preloader
                                    $('#view-cart-page .page-preloader').css("display", "none");
                                }

                            }, 0);
                        }
                    }).appendTo(element);
                });


                // update the total price of items displayed
                $('#view-cart-page #view-cart-total-price').html(`&#x20a6;${kendo.toString(
                    utopiasoftware[utopiasoftware_app_namespace].
                    controller.viewCartPageViewModel.calculateCartTotalPrice(localCart), "n2")}`);
            }
            finally{

            }
        },

        /**
         * method is a utility/helper function used to view/load and display the user's cart
         *
         * @returns {Promise<void>}
         */
        async viewCartPage(){

            try{
                // load the View Cart page
                await $('#app-main-navigator').get(0).bringPageTop("view-cart-page.html");
                // display the user cart
                await utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.displayUserCart();
                // enable the checkout button
                $('#view-cart-page #view-cart-checkout').removeAttr("disabled");
            }
            catch(err){
                console.log("VIEW-CART PAGE", err);
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.content = `Sorry, an error occurred. Pull down to refresh`;
                toast.dataBind();
                toast.show();
            }
            finally {
                // hide the preloader
                $('#view-cart-page .page-preloader').css("display", "none");
            }

        },


        /**
         * method is a utility function used to calculate the approximate total process of all items in
         * a user's local cart
         *
         * @param localCart {Array} containing an array of items in the user's local cart
         *
         * @returns {number} the total price for all the items contained in cart
         */
        calculateCartTotalPrice(localCart = []){

            if(localCart.length === 0){ // this is an empty cart, so just return 0
                return 0.00;
            }

            // run an array reduce function which gets the sub-total price of each item in the cart by multiplying their
            // quantity by the unit price. Then adding all sub-totals to get the total price

            return localCart.reduce(function(accumulator, currentElement, currentIndex, thisArray){

                console.log("ACCUMULATOR", accumulator);
                console.log("CURRENT INDEX", currentIndex);
                // check the types of products in the cart
                if(currentElement.anon_cart_key){ // this item is a customised product
                    // multiply the product unit price with the specified quantity and add the to the current cumulative total
                    return accumulator + (currentElement.cartData.quantity *
                        kendo.parseFloat(currentElement.cartData.cart_item_data.fpd_data.fpd_product_price));
                }
                else if(currentElement.productVariation){ // this product was NOT saved with customisation, but has variations
                    // multiply the product unit price with the specified quantity and add the to the current cumulative total
                    return accumulator + (currentElement.cartData.quantity *
                    kendo.parseFloat((currentElement.productVariation.price && currentElement.productVariation.price !== "" ?
                        currentElement.productVariation.price : currentElement.product.price)));
                }
                else if(! currentElement.productVariation) { // this product was NOT saved with customisation, and has NO variations
                    // multiply the product unit price with the specified quantity and add the to the current cumulative total
                    return accumulator + (currentElement.cartData.quantity * kendo.parseFloat(currentElement.product.price));
                }

            }, 0);
        },


        /**
         * method is triggered when the Delete/Remove" cart item button (attached to each product on the
         * View Cart page) is clicked.
         *
         * @param productUId {String} the unique uid created for each product in
         * the user's local cart. This identifies the product to be deleted from cart
         *
         * @returns {Promise<void>}
         */
        async deleteCartItemButtonClicked (productUId = ""){

            // attach functions to handle the "Reject/No" and "Accept/Yes" buttons click event.
            // These buttons are located in the 'Delete Cart Item Action Sheet'.
            // Click event handlers must always be defined for these buttons when using this action sheet

            // function for "Reject/No" button
            $('#view-cart-page-delete-cart-item-action-sheet #view-cart-page-delete-cart-item-no').get(0).onclick =
                async function(){
                    // hide the action sheet
                    await document.getElementById('view-cart-page-delete-cart-item-action-sheet').hide();
                };

            // function for "Accept/Yes" button
            $('#view-cart-page-delete-cart-item-action-sheet #view-cart-page-delete-cart-item-yes').get(0).onclick =
                async function(){
                    let localCart = []; // holds the local cart array
                    try{

                        // display page preloader
                        $('#view-cart-page .page-preloader').css("display", "block");
                        // hide the action sheet
                        await document.getElementById('view-cart-page-delete-cart-item-action-sheet').hide();

                        try{
                            // get the localCart from the cached localCart of the app database
                            localCart = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                            loadData("user-cart",
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart;
                        }
                        catch(err){}

                        // get the product to be deleted from the cart
                        let productIndex = localCart.findIndex(function(productElement, index){
                            // check if this is the product being search for by comparing the product uid
                            return productUId === productElement.uid;
                        });

                        // check if a product was found
                        if(productIndex !== -1){ // product was found
                            // delete the product from localCart
                            localCart.splice(productIndex, 1);
                        }

                        // save the updated cart
                        await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                            {_id: "user-cart", docType: "USER_CART", cart: localCart},
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                        // hide from display, the cart item belonging to the deleted product
                        let $cartDisplayedItem = $(`#view-cart-page .col-xs-12[data-utopiasoftware-product-uid="${productUId}"]`);
                        await kendo.fx($cartDisplayedItem).expand("vertical").duration(250).reverse();
                        // update the total price of items displayed
                        $('#view-cart-page #view-cart-total-price').html(`&#x20a6;${kendo.toString(
                            utopiasoftware[utopiasoftware_app_namespace].
                            controller.viewCartPageViewModel.calculateCartTotalPrice(localCart), "n2")}`);

                        // inform the user that the product has been removed from cart
                        // hide all previously displayed ej2 toast
                        $('.page-toast').get(0).ej2_instances[0].hide('All');
                        $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                        // display toast to show that an error
                        let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                        toast.cssClass = 'default-ej2-toast';
                        toast.timeOut = 2000;
                        toast.content = `Product has been deleted from your cart`;
                        toast.dataBind();
                        toast.show();
                    }
                    catch(err){
                        console.log("DELETE CART ERROR", err);
                        // hide all previously displayed ej2 toast
                        $('.page-toast').get(0).ej2_instances[0].hide('All');
                        $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                        // display toast to show that an error
                        let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                        toast.cssClass = 'error-ej2-toast';
                        toast.timeOut = 3500;
                        toast.content = `Error deleting product from your cart. Try again`;
                        toast.dataBind();
                        toast.show();
                    }
                    finally {
                        // hide page preloader
                        $('#view-cart-page .page-preloader').css("display", "none");
                    }
                };

            // display the delete confirmation dialog
            await document.getElementById('view-cart-page-delete-cart-item-action-sheet').show();
        },

        /**
         * method is triggered when the "Edit" cart item button (attached to each product on the
         * View Cart page) is clicked.
         *
         * @param productUrl {String} holds the remote/server url for the product desired to be edited
         *
         * @param cartItemKey {String} holds the remote/server cart key for this product/cart-item
         *
         * @returns {Promise<void>}
         */
        async editCartItemButtonClicked(productUrl, cartItemKey){

            // load the "Customise Product" page to the app-main-navigator
            await $('#app-main-navigator').get(0).bringPageTop("customise-product-page.html");
            // load the product customisation url
            await utopiasoftware[utopiasoftware_app_namespace].controller.
            customiseProductPageViewModel.loadProductCustomisation(productUrl, cartItemKey);
        },

        /**
         * method is triggerd when the "Check Out" button is clicked
         *
         * @returns {Promise<void>}
         */
        async checkoutButtonClicked(){

            let userDetails = null; // holds the user details

            // check if a user has signed in
            try{
                // load the use details from the encrypted app database
                userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;
            }
            catch(err){
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3500;
                toast.content = `Please sign in to checkout your cart`;
                toast.dataBind();
                toast.show();

                // send the user to the sign in page
                $('#app-main-navigator').get(0).pushPage('login-page.html');

                return; // exit method
            }

            // check if the user has any item in cart
            try{
                let localCart = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-cart",
                    utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart;
                if(localCart.length === 0){ // no item in user cart
                    throw "error"; // throw error
                }
            }
            catch(err){
                // display message to inform user that cart is empty
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'default-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Your cart is empty. Go order some products!`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // check if a billing address has been provided
            if(userDetails.billing.address_1 == ""){ // no billing address has been provided
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3500;
                toast.content = `Please update your billing address to checkout your cart`;
                toast.dataBind();
                toast.show();

                $('#app-main-navigator').get(0).pushPage('billing-info-page.html');

                return; // exit method
            }

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to checkout your cart`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // show the app loader modal
            $('#loader-modal-message').html("Preparing Checkout...");
            $('#loader-modal').get(0).show(); // show loader

            // create the user's order object
            var orderData = {
                status: "pending", currency: "NGN", customer_id: userDetails.id, billing: userDetails.billing,
                shipping: userDetails.shipping, line_items: []
            };

            try {
                // get the current user's local cart
                let userCart = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",
                    utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart;

                // loop through the user cart item to create the order items
                for(let index = 0; index < userCart.length; index++){
                    orderData.line_items[index] = userCart[index].cartData;

                    // add the product name to the order line item
                    if(userCart[index].product){ // this product was added to cart without customisation
                        orderData.line_items[index].name = userCart[index].product.name; // add the product name
                        // calculate the subtotal & total for this line item
                        orderData.line_items[index].subtotal =
                            "" + kendo.parseFloat(userCart[index].product.price) * orderData.line_items[index].quantity;
                        orderData.line_items[index].total =
                            "" + kendo.parseFloat(userCart[index].product.price) * orderData.line_items[index].quantity;
                    }
                    else{ // this product was added to cart via customisation
                        orderData.line_items[index].name = userCart[index].product_name; // add the product name
                    }

                    orderData.line_items[index].meta_data = []; // create the meta-data array for each order line item

                    // check if the product being ordered has a variation
                    if(userCart[index].cartData.variation_id){ // this product has a variation
                        if(!userCart[index].cartData.cart_item_data){ // if the product has no customisation data
                            // calculate the subtotal & total for this line item
                            orderData.line_items[index].subtotal =
                            "" + kendo.parseFloat(userCart[index].productVariation.price) * orderData.line_items[index].quantity;
                            orderData.line_items[index].total =
                                "" + kendo.parseFloat(userCart[index].productVariation.price) * orderData.line_items[index].quantity;
                        }

                        // add the variation attributes to the line item meta data
                        for(let key in userCart[index].cartData.variation){

                            orderData.line_items[index].meta_data.push({
                                // add the variation attributes for this product to the line items meta-data array.
                                // the meta-data object key value is gotten by splitting the variation key
                                key: key.split("_")[1],
                                value: userCart[index].cartData.variation[key]
                            });
                        }
                    }

                    // check if the product has any customisation data to attach
                    if(userCart[index].cartData.cart_item_data){
                        console.log("ORDER ITEM", userCart[index].cartData);
                        // calculate the subtotal & total for this line item
                        orderData.line_items[index].subtotal =
                            "" + kendo.parseFloat(userCart[index].cartData.cart_item_data.fpd_data.fpd_product_price)
                            * orderData.line_items[index].quantity;
                        orderData.line_items[index].total =
                            "" + kendo.parseFloat(userCart[index].cartData.cart_item_data.fpd_data.fpd_product_price)
                            * orderData.line_items[index].quantity;

                        orderData.line_items[index].meta_data.push({
                            // add the customisation data for this product to the line items meta-data array.
                            key: "_fpd_data",
                            value: userCart[index].cartData.cart_item_data.fpd_data.fpd_product
                        }, {
                            // add the customisation data for this product to the line items meta-data array.
                            key: "_fpd_print_order",
                            value: userCart[index].cartData.cart_item_data.fpd_data.fpd_print_order
                        });

                        // delete the 'cart_item_data' property from the line item because it is not needed for submisssion
                        delete orderData.line_items[index].cart_item_data;
                    }
                }

                console.log("ORDER DATA", orderData);

                // create the order on the remote server
                orderData = await Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/orders`,
                        type: "post",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify(orderData)
                    }
                ));

                // display the products details page using the selected product
                await $('#app-main-navigator').get(0).pushPage("checkout-page.html", {data: {orderData}});
            }
            catch(err){
                err = JSON.parse(err.responseText);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Checkout failed. ${err.message || ""}`;
                toast.dataBind();
                toast.show();
            }
            finally{
                // hide the app loader
                $('#loader-modal').get(0).hide(); // hide loader
            }

        }
    },

    /**
     * this is the view-model/controller for the Profile page
     */
    profilePageViewModel: {

        /**
         * used to hold the parsley form validation object for the profile form
         */
        profileFormValidator: null,

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        profilePageViewModel.backButtonClicked;

                // initialise the profile form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator =
                    $('#profile-page #profile-form').parsley();

                // listen for profile form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    let tooltip = $('#profile-page #profile-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.content = fieldInstance.getErrorsMessages()[0];
                    tooltip.dataBind();
                    tooltip.open(fieldInstance.$element.get(0));
                });

                // listen for profile form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.on('field:success', function(fieldInstance) {
                    // hide tooltip from element
                    let tooltip = $('#profile-page #profile-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.close();
                });

                // listen for profile form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidated);

                // listen for scroll event on the page to adjust the tooltips when page scrolls
                $('#profile-page .content').on("scroll", utopiasoftware[utopiasoftware_app_namespace].
                    controller.profilePageViewModel.scrollAndResizeEventListener);


                try{

                    // create the tooltip objects for the profile form
                    $('#profile-form ons-input', $thisPage).each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the html form object
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopLeft',
                            opensOn: 'Custom'
                        }).appendTo($('#profile-page #profile-form').get(0));
                    });

                    // create the "Cancel" button
                    new ej.buttons.Button({
                        //iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
                        //iconPosition: "Left"
                    }).appendTo('#profile-cancel');

                    // create the "Update" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#profile-update');

                    // display the user's profile on the profile form
                    await utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.displayProfileContent();
                }
                catch(err){
                    console.log("PROFILE ERROR", err);
                }
                finally {

                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            window.SoftInputMode.set('adjustResize');

            // update cart count
            $('#profile-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            //add listener for when the window is resized by virtue of the device keyboard being shown
            window.addEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                profilePageViewModel.scrollAndResizeEventListener, false);

        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // hide the tooltips on the profile form
            $('#profile-page #profile-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });

            // reset all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.reset();

            //remove listener for when the window is resized by virtue of the device keyboard being shown
            window.removeEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                profilePageViewModel.scrollAndResizeEventListener, false);
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            // destroy the tooltips on the profile form
            $('#profile-page #profile-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // destroy the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the "Cancel" and "Update" buttons
            $('#profile-page #profile-cancel').get(0).ej2_instances[0].destroy();
            $('#profile-page #profile-update').get(0).ej2_instances[0].destroy();

            // destroy all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.destroy();
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */
        async scrollAndResizeEventListener(){
            // place function execution in the event queue to be executed ASAP
            window.setTimeout(function(){
                // adjust the tooltips elements on the profile form
                $("#profile-page #profile-form ons-input").each(function(index, element){
                    document.getElementById('profile-form').ej2_instances[index].refresh(element);
                });

            }, 0);

        },


        /**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */
        async updateButtonClicked(){

            // run the validation method for the profile form
            utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.whenValidate();
        },

        /**
         * method is triggered when the profile form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async profileFormValidated(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to update your profile`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // disable the "Update" button
            $('#profile-page #profile-update').attr("disabled", true);
            // show the spinner on the 'Update' button to indicate process is ongoing
            $('#profile-page #profile-update').get(0).ej2_instances[0].cssClass = '';
            $('#profile-page #profile-update').get(0).ej2_instances[0].dataBind();
            $('#profile-page #profile-update').get(0).ej2_instances[0].start();

            // display page loader while completing the "update profile" request
            $('#profile-page .modal').css("display", "table");

            var promisesArray = []; // holds the array for the promises used to complete the process

            var promisesArrayPromise = null; // holds the promise gotten from the promisesArray

            try{
                // load the use details from the encrypted app database
                let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                console.log("USER DETAILS BEFORE PROFILE UPDATE", userDetails);

                // temporary hold the user id and password
                let userId = userDetails.id;
                let userPassword = userDetails.password;

                // use the input from the profile form to update the user details
                userDetails.first_name = $('#profile-page #profile-form #profile-first-name').val().trim();
                userDetails.last_name = $('#profile-page #profile-form #profile-last-name').val().trim();

                // check if user details has the billing property
                if(!userDetails.billing){ // no billing property, so create it
                    // create the billing property
                    userDetails.billing = {};
                }

                // set the billing email to the email of the user
                userDetails.billing.email = $('#profile-page #profile-form #profile-email').val().trim();
                // set the billing first name and last name to that of the user
                userDetails.billing.first_name = userDetails.first_name;
                userDetails.billing.last_name = userDetails.last_name;

                // update the user phone number
                userDetails.billing.phone = $('#profile-page #profile-form #profile-phone-number').val().trim();
                if(userDetails.billing.phone.startsWith("0")){ // phone number starts with zero
                    // replace the starting zero with '+234'
                    userDetails.billing.phone = userDetails.billing.phone.replace(/0/i, "+234");
                }

                // delete the properties not needed for the update from the userDetails object
                delete userDetails.id;
                delete userDetails.password;

                // now send the user profile update request to the remote server
                promisesArray.push(Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/customers/${userId}`,
                        type: "put",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify(userDetails)
                    }
                )));

                // get the promise created from the promisesArray
                promisesArrayPromise = Promise.all(promisesArray);

                // get the result from the promisesArray
                let resultsArray = await promisesArrayPromise;

                // add the user's password to the user details retrieved from the server
                resultsArray[0].password = userPassword;

                // save the created user details data to ENCRYPTED app database as cached data
                await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                    {_id: "user-details", docType: "USER_DETAILS", userDetails: resultsArray[0]},
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'success-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `User profile updated`;
                toast.dataBind();
                toast.show();

            }
            catch (err) {
                err = JSON.parse(err.responseText);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `User profile update failed. ${err.message || ""}`;
                toast.dataBind();
                toast.show();
            }
            finally {
                // enable the "Update" button
                $('#profile-page #profile-update').removeAttr("disabled");
                // hide the spinner on the 'Update' button to indicate process is ongoing
                $('#profile-page #profile-update').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
                $('#profile-page #profile-update').get(0).ej2_instances[0].dataBind();
                $('#profile-page #profile-update').get(0).ej2_instances[0].stop();

                // hide page loader
                $('#profile-page .modal').css("display", "none");
            }

            return promisesArrayPromise; // return the resolved promisesArray

        },

        /**
         * method is used to load the current user profile data into the profile form
         * @returns {Promise<void>}
         */
        async displayProfileContent(){

            try{
                // load the user profile details from the app database
                let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                console.log("USER DETAILS", userDetails);

                // display the user profile data in the profile form
                $('#profile-page #profile-form #profile-email').val(userDetails.email);
                $('#profile-page #profile-form #profile-first-name').val(userDetails.first_name || "");
                $('#profile-page #profile-form #profile-last-name').val(userDetails.last_name || "");
                $('#profile-page #profile-form #profile-phone-number').
                val(userDetails.billing && userDetails.billing.phone ? userDetails.billing.phone : "");
            }
            finally {
                // hide page preloader
                $('#profile-page .page-preloader').css("display", "none");
                // hide page modal loader
                $('#profile-page .modal').css("display", "none");
                // enable the "Update" button
                $('#profile-page #profile-update').removeAttr("disabled");
            }
        }

    },

    /**
     * this is the view-model/controller for the Change Password page
     */
    changePasswordPageViewModel: {

        /**
         * used to hold the parsley form validation object for the change password form
         */
        changePasswordFormValidator: null,

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        changePasswordPageViewModel.backButtonClicked;

                // initialise the changePassword form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator =
                    $('#change-password-page #change-password-form').parsley();

                // listen for changePassword form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.
                changePasswordFormValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    let tooltip = $('#change-password-page #change-password-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.content = fieldInstance.getErrorsMessages()[0];
                    tooltip.dataBind();
                    tooltip.open(fieldInstance.$element.get(0));
                });

                // listen for changePassword form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel
                    .changePasswordFormValidator.on('field:success', function(fieldInstance) {
                    // hide tooltip from element
                    let tooltip = $('#change-password-page #change-password-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.close();
                });

                // listen for profile form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.
                changePasswordFormValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        changePasswordPageViewModel.changePasswordFormValidated);

                // listen for scroll event on the page to adjust the tooltips when page scrolls
                $('#change-password-page .content').on("scroll", utopiasoftware[utopiasoftware_app_namespace].
                    controller.changePasswordPageViewModel.scrollAndResizeEventListener);


                try{

                    // create the tooltip objects for the changePassword form
                    $('#change-password-form ons-input', $thisPage).each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the html form object
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopLeft',
                            opensOn: 'Custom'
                        }).appendTo($('#change-password-page #change-password-form').get(0));
                    });

                    // create the button for switching password visibility on the signup page
                    new ej.buttons.Button({
                        isToggle: true,
                        cssClass: 'e-flat e-small e-round',
                        iconCss: "zmdi zmdi-eye",
                        iconPosition: "Left"
                    }).appendTo($('#change-password-view-button', $thisPage).get(0));

                    // create the "Cancel" button
                    new ej.buttons.Button({
                        //iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
                        //iconPosition: "Left"
                    }).appendTo('#change-password-cancel');

                    // create the "Update" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#change-password-update');

                }
                catch(err){
                    console.log("CHANGE PASSWORD ERROR", err);
                }
                finally {
                    // hide the page preloader
                    $('#change-password-page .page-preloader').css("display", "none");
                    // hide page loader
                    $('#change-password-page .modal').css("display", "none");
                    // enable the update button
                    $('#change-password-page #change-password-update').removeAttr("disabled");
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            window.SoftInputMode.set('adjustResize');

            // update cart count
            $('#change-password-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            //add listener for when the window is resized by virtue of the device keyboard being shown
            window.addEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                changePasswordPageViewModel.scrollAndResizeEventListener, false);

        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // hide the tooltips on the changePassword form
            $('#change-password-page #change-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });

            // reset all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.
            changePasswordFormValidator.reset();

            //remove listener for when the window is resized by virtue of the device keyboard being shown
            window.removeEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                changePasswordPageViewModel.scrollAndResizeEventListener, false);
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            // destroy the tooltips on the changePassword form
            $('#change-password-page #change-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // destroy the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the "Cancel" and "Update" buttons
            $('#change-password-page #change-password-cancel').get(0).ej2_instances[0].destroy();
            $('#change-password-page #change-password-update').get(0).ej2_instances[0].destroy();

            // destroy the password visibility button
            $('#change-password-page #change-password-view-button').get(0).ej2_instances[0].destroy();

            // destroy all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.
            changePasswordFormValidator.destroy();
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the Password Visibility button is clicked
         *
         * @param buttonElement {HTMLElement} button element being clicked
         *
         * @param inputId {String} the id for the input whose content visibility is being changed
         */
        passwordVisibilityButtonClicked(buttonElement, inputId){

            // check the state of the button is it 'active' or not
            if(! $(buttonElement).hasClass('e-active')){ // button is not active
                // change the type for the input field
                $(document.getElementById(inputId)).attr("type", "text");
                // change the icon on the button to indicate the change in visibility
                let ej2Button = buttonElement.ej2_instances[0];
                ej2Button.iconCss = 'zmdi zmdi-eye-off';
                ej2Button.dataBind();
            }
            else{ // button is active
                // change the type for the input field
                $(document.getElementById(inputId)).attr("type", "password");
                // change the icon on the button to indicate the change in visibility
                let ej2Button = buttonElement.ej2_instances[0];
                ej2Button.iconCss = 'zmdi zmdi-eye';
                ej2Button.dataBind();
            }
        },

        /**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */
        async scrollAndResizeEventListener(){
            // place function execution in the event queue to be executed ASAP
            window.setTimeout(function(){
                // adjust the tooltips elements on the changePassword form
                $("#change-password-page #change-password-form ons-input").each(function(index, element){
                    document.getElementById('change-password-form').ej2_instances[index].refresh(element);
                });

            }, 0);

        },


        /**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */
        async updateButtonClicked(){

            // run the validation method for the profile form
            utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.
            changePasswordFormValidator.whenValidate();
        },

        /**
         * method is triggered when the changePassword form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async changePasswordFormValidated(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to change password`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // disable the "Update" button
            $('#change-password-page #change-password-update').attr("disabled", true);
            // show the spinner on the 'Update' button to indicate process is ongoing
            $('#change-password-page #change-password-update').get(0).ej2_instances[0].cssClass = '';
            $('#change-password-page #change-password-update').get(0).ej2_instances[0].dataBind();
            $('#change-password-page #change-password-update').get(0).ej2_instances[0].start();

            // display page loader while completing the "update profile" request
            $('#change-password-page .modal').css("display", "table");

            var promisesArray = []; // holds the array for the promises used to complete the process

            var promisesArrayPromise = null; // holds the promise gotten from the promisesArray

            try{
                // load the use details from the encrypted app database
                let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                console.log("USER DETAILS BEFORE PASSWORD CHANGE", userDetails);

                // check if the current password input matches that in the current user password
                try{
                    await Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/wp-json",
                            type: "get",
                            // contentType: "application/json",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    Base64.encode(`${userDetails.email}:${jQuery('#change-password-current-password').val().trim()}`));
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: false
                        }
                    ));
                }
                catch(err){ // if an error occurs, it meanns the inputed current password DOES NOT MATCH the current user password
                    // throw an error object because user current password does not match
                    throw {responseText: JSON.stringify({message: "current password is incorrect."})};
                }

                // temporary hold the user id
                let userId = userDetails.id;
                // delete the billing and shipping info from the userData object being updated because it's not needed.
                // if the password change is successful, the response will include
                // the billing and shipping retrieved from the server.
                delete userDetails.billing;
                delete userDetails.shipping;

                // use the new password input to change/update the user password
                userDetails.password = $('#change-password-page #change-password-form #change-password-new-password').val().trim();

                // now send the user profile/password change request to the remote server
                promisesArray.push(Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/customers/${userId}`,
                        type: "put",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify(userDetails)
                    }
                )));

                // get the promise created from the promisesArray
                promisesArrayPromise = Promise.all(promisesArray);

                // get the result from the promisesArray
                let resultsArray = await promisesArrayPromise;

                // add the user's new password to the user details retrieved from the server
                resultsArray[0].password =
                    $('#change-password-page #change-password-form #change-password-new-password').val().trim();

                console.log("PASSWORD CHANGED", resultsArray[0]);

                // save the created user details data to ENCRYPTED app database as cached data
                await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                    {_id: "user-details", docType: "USER_DETAILS", userDetails: resultsArray[0]},
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'success-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `User password changed`;
                toast.dataBind();
                toast.show();

            }
            catch (err) {
                err = JSON.parse(err.responseText);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `User password change failed. ${err.message || ""}`;
                toast.dataBind();
                toast.show();
            }
            finally {
                // enable the "Update" button
                $('#change-password-page #change-password-update').removeAttr("disabled");
                // hide the spinner on the 'Update' button to indicate process is ongoing
                $('#change-password-page #change-password-update').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
                $('#change-password-page #change-password-update').get(0).ej2_instances[0].dataBind();
                $('#change-password-page #change-password-update').get(0).ej2_instances[0].stop();

                // hide page loader
                $('#change-password-page .modal').css("display", "none");
            }

            return promisesArrayPromise; // return the resolved promisesArray
        }

    },

    /**
     * this is the view-model/controller for the Billing Info page
     */
    billingInfoPageViewModel: {

        /**
         * used to hold the parsley form validation object for the billing address form
         */
        billingInfoFormValidator: null,

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        billingInfoPageViewModel.backButtonClicked;

                // initialise the billing info form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator =
                    $('#billing-info-page #billing-info-form').parsley();

                // initialise the custom validation for the billing info 'country' field
                $('#billing-info-page #billing-info-form #billing-info-country').parsley({
                    value: function(parsley) {
                        // return the value from the dropdownlist
                        return $('#billing-info-country').get(0).ej2_instances[0].value;
                    }
                });

                // initialise the custom validation for the billing info 'state' field
                $('#billing-info-page #billing-info-form #billing-info-state').parsley({
                    value: function(parsley) { // function returns a 'custom' value
                        // get the State dropdownlist component
                        let stateDropDownList = $('#billing-info-state').get(0).ej2_instances[0];
                        // check if the dropdownlist is enabled or not
                        if(stateDropDownList.enabled !== true){ // dropdownlist is disabled
                            return " "; // return an empty string
                        }
                        else{ // dropdownlist is enabled
                            return stateDropDownList.value; // return the value from the dropdownlist
                        }
                    }
                });

                // listen for billing form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.
                on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    let tooltip = $('#billing-info-page #billing-info-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.content = fieldInstance.getErrorsMessages()[0];
                    tooltip.dataBind();
                    tooltip.open(fieldInstance.$element.get(0));
                });

                // listen for billing info form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.
                on('field:success', function(fieldInstance) {
                    // hide tooltip from element
                    let tooltip = $('#billing-info-page #billing-info-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.close();
                });

                // listen for billing info form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.
                on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidated);

                // listen for scroll event on the page to adjust the tooltips when page scrolls
                $('#billing-info-page .content').on("scroll", utopiasoftware[utopiasoftware_app_namespace].
                    controller.billingInfoPageViewModel.scrollAndResizeEventListener);


                try{
                    // create the "Cancel" button
                    new ej.buttons.Button({
                        //iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
                        //iconPosition: "Left"
                    }).appendTo('#billing-info-cancel');

                    // create the "Update" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#billing-info-update');

                    let countryDataArray = []; // holds the array containing country objects

                    // load the country data from the local list with the app
                    countryDataArray = await Promise.resolve($.ajax(
                        {
                            url: 'country-list.json',
                            type: "get",
                            //contentType: "application/json",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    ));

                    // create the tooltip objects for the billing info form
                    $('#billing-info-form textarea, #billing-info-form ons-input, #billing-info-form #billing-info-country, #billing-info-form #billing-info-state', $thisPage).
                    each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the html form object
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopLeft',
                            opensOn: 'Custom'
                        }).appendTo($('#billing-info-page #billing-info-form').get(0));
                    });

                    // create the Country dropdown list from the select input
                    new ej.dropdowns.DropDownList(
                        {
                            cssClass: "billing-info-dropdownlist",
                            dataSource: countryDataArray,
                            fields: { value: 'code', text: 'name'},
                            placeholder: "Country",
                            floatLabelType: 'Auto',
                            value: 'NG',
                            itemTemplate: '<span>${name}</span>',
                            valueTemplate: '<span>${name}</span>'
                        }).appendTo('#billing-info-country');

                    // create the Country dropdown list from the select input
                    new ej.dropdowns.DropDownList(
                        {
                            cssClass: "billing-info-dropdownlist",
                            dataSource: countryDataArray.find(function(countryElement){
                                return countryElement.code === "NG";
                            }).states,
                            fields: { value: 'code', text: 'name'},
                            placeholder: "State",
                            floatLabelType: 'Auto',
                            itemTemplate: '<span>${name}</span>',
                            valueTemplate: '<span>${name}</span>',
                            select: async function () { // listen for when dropdown list value is changed by selection

                                // handle method task in a different event block
                                window.setTimeout(function(){
                                    $('#billing-info-page #billing-info-form').get(0).
                                        ej2_instances[$('#billing-info-state').get(0)._utopiasoftware_validator_index].close();
                                    // call the method used to trigger the form validation
                                    /*utopiasoftware[utopiasoftware_app_namespace].controller.
                                    billingInfoPageViewModel.updateButtonClicked()*/
                                }, 0);
                            }
                        }).appendTo('#billing-info-state');

                    // display the billing info on the billing info form
                    await utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.displayContent();
                }
                catch(err){
                    console.log("BILLING ADDRESS ERROR", err);
                }
                finally {

                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            window.SoftInputMode.set('adjustResize');

            // update cart count
            $('#billing-info-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            //add listener for when the window is resized by virtue of the device keyboard being shown
            window.addEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                billingInfoPageViewModel.scrollAndResizeEventListener, false);

        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // hide the tooltips on the profile form
            $('#billing-info-page #billing-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });

            // reset all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.reset();

            //remove listener for when the window is resized by virtue of the device keyboard being shown
            window.removeEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                billingInfoPageViewModel.scrollAndResizeEventListener, false);
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            // destroy the tooltips on the profile form
            $('#billing-info-page #billing-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // destroy the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the Country & State DropDownLists
            $('#billing-info-page #billing-info-country').get(0).ej2_instances[0].destroy();
            $('#billing-info-page #billing-info-state').get(0).ej2_instances[0].destroy();

            // destroy the "Cancel" and "Update" buttons
            $('#billing-info-page #billing-info-cancel').get(0).ej2_instances[0].destroy();
            $('#billing-info-page #billing-info-update').get(0).ej2_instances[0].destroy();

            // destroy all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.destroy();
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */
        async scrollAndResizeEventListener(){
            // place function execution in the event queue to be executed ASAP
            window.setTimeout(function(){
                // adjust the tooltips elements on the profile form
                $('#billing-info-form textarea, #billing-info-form ons-input, #billing-info-form #billing-info-country, #billing-info-form #billing-info-state').
                each(function(index, element){
                    document.getElementById('billing-info-form').ej2_instances[index].refresh(element);
                });

            }, 0);

        },


        /**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */
        async updateButtonClicked(){

            // run the validation method for the billing-info form
            utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.
            billingInfoFormValidator.whenValidate();
        },

        /**
         * method is triggered when the billing-info form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async billingInfoFormValidated(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to update your billing address`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // disable the "Update" button
            $('#billing-info-page #billing-info-update').attr("disabled", true);
            // show the spinner on the 'Update' button to indicate process is ongoing
            $('#billing-info-page #billing-info-update').get(0).ej2_instances[0].cssClass = '';
            $('#billing-info-page #billing-info-update').get(0).ej2_instances[0].dataBind();
            $('#billing-info-page #billing-info-update').get(0).ej2_instances[0].start();

            // display page loader while completing the "update profile" request
            $('#billing-info-page .modal').css("display", "table");

            var promisesArray = []; // holds the array for the promises used to complete the process

            var promisesArrayPromise = null; // holds the promise gotten from the promisesArray

            try{
                // load the use details from the encrypted app database
                let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                console.log("USER DETAILS BEFORE BILLING INFO UPDATE", userDetails);

                // temporary hold the user id and password
                let userId = userDetails.id;
                let userPassword = userDetails.password;

                // check if user details has the billing property
                if(!userDetails.billing){ // no billing property, so create it
                    // create the billing property
                    userDetails.billing = {};
                }

                // set the billing email to the email of the user
                userDetails.billing.email = userDetails.email;

                // use the input from the profile form to update the user details
                userDetails.billing.company = $('#billing-info-page #billing-info-company').val().trim();
                userDetails.billing.address_1 = $('#billing-info-page #billing-info-address-1').val().trim();
                userDetails.billing.address_2 = $('#billing-info-page #billing-info-address-2').val().trim();
                userDetails.billing.postcode = $('#billing-info-page #billing-info-postcode').val().trim();
                userDetails.billing.city = $('#billing-info-page #billing-info-city').val().trim();
                userDetails.billing.country = $('#billing-info-page #billing-info-country').get(0).ej2_instances[0].value;
                userDetails.billing.state = $('#billing-info-page #billing-info-state').get(0).ej2_instances[0].value ?
                    $('#billing-info-page #billing-info-state').get(0).ej2_instances[0].value : "";

                // delete the properties not needed for the update from the userDetails object
                delete userDetails.id;
                delete userDetails.password;

                // now send the user profile update request to the remote server
                promisesArray.push(Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/customers/${userId}`,
                        type: "put",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify(userDetails)
                    }
                )));

                // get the promise created from the promisesArray
                promisesArrayPromise = Promise.all(promisesArray);

                // get the result from the promisesArray
                let resultsArray = await promisesArrayPromise;

                // add the user's password to the user details retrieved from the server
                resultsArray[0].password = userPassword;

                // save the created user details data to ENCRYPTED app database as cached data
                await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                    {_id: "user-details", docType: "USER_DETAILS", userDetails: resultsArray[0]},
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'success-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `User billing address updated`;
                toast.dataBind();
                toast.show();

            }
            catch (err) {
                err = JSON.parse(err.responseText);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `User billing address update failed. ${err.message || ""}`;
                toast.dataBind();
                toast.show();
            }
            finally {
                // enable the "Update" button
                $('#billing-info-page #billing-info-update').removeAttr("disabled");
                // hide the spinner on the 'Update' button to indicate process is ongoing
                $('#billing-info-page #billing-info-update').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
                $('#billing-info-page #billing-info-update').get(0).ej2_instances[0].dataBind();
                $('#billing-info-page #billing-info-update').get(0).ej2_instances[0].stop();

                // hide page loader
                $('#billing-info-page .modal').css("display", "none");
            }

            return promisesArrayPromise; // return the resolved promisesArray

        },

        /**
         * method is used to load the current billing info data into the billing info form
         * @returns {Promise<void>}
         */
        async displayContent(){

            try{
                // load the user profile details from the app database
                let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                console.log("USER DETAILS", userDetails);

                // display the user billing info data in the billing info form
                $('#billing-info-page #billing-info-form #billing-info-company').
                val(userDetails.billing && userDetails.billing.company ? userDetails.billing.company : "");
                $('#billing-info-page #billing-info-form #billing-info-address-1').
                val(userDetails.billing && userDetails.billing.address_1 ? userDetails.billing.address_1 : "");
                $('#billing-info-page #billing-info-form #billing-info-address-2').
                val(userDetails.billing && userDetails.billing.address_2 ? userDetails.billing.address_2 : "");
                $('#billing-info-page #billing-info-form #billing-info-postcode').
                val(userDetails.billing && userDetails.billing.postcode ? userDetails.billing.postcode : "");
                $('#billing-info-page #billing-info-form #billing-info-city').
                val(userDetails.billing && userDetails.billing.city ? userDetails.billing.city : "");

                // get the country dropdownlist
                var countryDropDownList = $('#billing-info-page #billing-info-form #billing-info-country').get(0).ej2_instances[0];
                // temporarily remove the select event listener for the country dropdownlist
                countryDropDownList.removeEventListener("select");
                // update the select dropdownlist for country
                countryDropDownList.value = (userDetails.billing && userDetails.billing.country && userDetails.billing.country !== "")
                    ? userDetails.billing.country : 'NG';
                countryDropDownList.dataBind();

                // update the select dropdownlist for state
                let statesDropDownList = $('#billing-info-page #billing-info-form #billing-info-state').get(0).ej2_instances[0];
                statesDropDownList.dataSource = countryDropDownList.dataSource.find(function(countryElement){
                    return countryElement.code === countryDropDownList.value;
                }).states;
                statesDropDownList.dataBind();
                statesDropDownList.value = (userDetails.billing && userDetails.billing.state && userDetails.billing.state !== "")
                    ? userDetails.billing.state : null;
                statesDropDownList.dataBind();
                // check if the state dropdownlist has a value
                if(statesDropDownList.value){ // check if the state dropdownlist has a value
                    statesDropDownList.enabled = true; // enable the state dropdownlist
                    statesDropDownList.dataBind();
                }
                else if(countryDropDownList.value === 'NG'){ // if the country selected is nigeria
                    statesDropDownList.enabled = true; // enable the state dropdownlist
                    statesDropDownList.dataBind();
                }
                else { // the state dropdown has no value and the country selected is not nigeria
                    statesDropDownList.enabled = false; // disable the state dropdownlist
                    statesDropDownList.dataBind();
                }
                console.log("STATE VALUE", statesDropDownList.value);

            }
            finally {
                // hide page preloader
                $('#billing-info-page .page-preloader').css("display", "none");
                // hide page modal loader
                $('#billing-info-page .modal').css("display", "none");
                // enable the "Update" button
                $('#billing-info-page #billing-info-update').removeAttr("disabled");

                // reinstate the country dropdownlist "select" listener in a separate event block
                window.setTimeout(async function(){
                    // reinstate the country dropdownlist "select" listener
                    countryDropDownList.addEventListener("select", async function () { // listen for when dropdown list value is changed by selection
                        let countryDropDownList = this; // holds this dropdown list

                        // execute the task in a separate event block
                        window.setTimeout(async function(){
                            // get the country object and its states that represents the country value selected
                            let countryStatesArray = countryDropDownList.getDataByValue(countryDropDownList.value).states;
                            // get the state dropdownlist
                            let stateDropDownList = $('#billing-info-page #billing-info-form #billing-info-state').
                            get(0).ej2_instances[0];
                            // reset the selected value for the State
                            stateDropDownList.value = null;
                            // reset the dataSource for the State
                            stateDropDownList.dataSource = countryStatesArray;

                            if(countryStatesArray.length > 0 ){ // there are states in the selected country
                                // enable the State dropdownlist for user selection
                                stateDropDownList.enabled = true;
                            }
                            else{ // there are NO states in the selected country
                                // disable the State dropdownlist for user selection
                                stateDropDownList.enabled = false;
                            }

                            // bind/update all changes made to the State dropdownlist
                            stateDropDownList.dataBind();

                        }, 0);
                    });
                }, 0);
            }
        }

    },

    /**
     * this is the view-model/controller for the Shipping Info page
     */
    shippingInfoPageViewModel: {

        /**
         * used to hold the parsley form validation object for the shipping info form
         */
        shippingInfoFormValidator: null,

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        shippingInfoPageViewModel.backButtonClicked;

                // initialise the shipping info form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator =
                    $('#shipping-info-page #shipping-info-form').parsley();

                // initialise the custom validation for the shipping info 'country' field
                $('#shipping-info-page #shipping-info-form #shipping-info-country').parsley({
                    value: function(parsley) {
                        // return the value from the dropdownlist
                        return $('#shipping-info-country').get(0).ej2_instances[0].value;
                    }
                });

                // initialise the custom validation for the shipping info 'state' field
                $('#shipping-info-page #shipping-info-form #shipping-info-state').parsley({
                    value: function(parsley) { // function returns a 'custom' value
                        // get the State dropdownlist component
                        let stateDropDownList = $('#shipping-info-state').get(0).ej2_instances[0];
                        // check if the dropdownlist is enabled or not
                        if(stateDropDownList.enabled !== true){ // dropdownlist is disabled
                            return " "; // return an empty string
                        }
                        else{ // dropdownlist is enabled
                            return stateDropDownList.value; // return the value from the dropdownlist
                        }
                    }
                });

                // listen for shipping form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.
                on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    let tooltip = $('#shipping-info-page #shipping-info-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.content = fieldInstance.getErrorsMessages()[0];
                    tooltip.dataBind();
                    tooltip.open(fieldInstance.$element.get(0));
                });

                // listen for shipping info form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.
                on('field:success', function(fieldInstance) {
                    // hide tooltip from element
                    let tooltip = $('#shipping-info-page #shipping-info-form').get(0).
                        ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];
                    tooltip.close();
                });

                // listen for shipping info form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.
                on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidated);

                // listen for scroll event on the page to adjust the tooltips when page scrolls
                $('#shipping-info-page .content').on("scroll", utopiasoftware[utopiasoftware_app_namespace].
                    controller.shippingInfoPageViewModel.scrollAndResizeEventListener);


                try{
                    // create the "Cancel" button
                    new ej.buttons.Button({
                        //iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
                        //iconPosition: "Left"
                    }).appendTo('#shipping-info-cancel');

                    // create the "Update" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#shipping-info-update');

                    let countryDataArray = []; // holds the array containing country objects

                    // load the country data from the local list with the app
                    countryDataArray = await Promise.resolve($.ajax(
                        {
                            url: 'country-list.json',
                            type: "get",
                            //contentType: "application/json",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    ));

                    // create the tooltip objects for the shipping info form
                    $('#shipping-info-form textarea, #shipping-info-form ons-input, #shipping-info-form #shipping-info-country, #shipping-info-form #shipping-info-state', $thisPage).
                    each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the html form object
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopLeft',
                            opensOn: 'Custom'
                        }).appendTo($('#shipping-info-page #shipping-info-form').get(0));
                    });

                    // create the Country dropdown list from the select input
                    new ej.dropdowns.DropDownList(
                        {
                            cssClass: "shipping-info-dropdownlist",
                            dataSource: countryDataArray,
                            fields: { value: 'code', text: 'name'},
                            placeholder: "Country",
                            floatLabelType: 'Auto',
                            value: 'NG',
                            itemTemplate: '<span>${name}</span>',
                            valueTemplate: '<span>${name}</span>'
                        }).appendTo('#shipping-info-country');

                    // create the Country dropdown list from the select input
                    new ej.dropdowns.DropDownList(
                        {
                            cssClass: "shipping-info-dropdownlist",
                            dataSource: countryDataArray.find(function(countryElement){
                                return countryElement.code === "NG";
                            }).states,
                            fields: { value: 'code', text: 'name'},
                            placeholder: "State",
                            floatLabelType: 'Auto',
                            itemTemplate: '<span>${name}</span>',
                            valueTemplate: '<span>${name}</span>',
                            select: async function () { // listen for when dropdown list value is changed by selection

                                // handle method task in a different event block
                                window.setTimeout(function(){
                                    // since the dropdownlist value has changed, remove any tooltip that is being displayed on this component
                                    $('#shipping-info-page #shipping-info-form').get(0).
                                        ej2_instances[$('#shipping-info-state').get(0)._utopiasoftware_validator_index].close();
                                }, 0);
                            }
                        }).appendTo('#shipping-info-state');

                    // display the shipping info on the shipping info form
                    await utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.displayContent();
                }
                catch(err){
                    console.log("SHIPPING INFO ERROR", err);
                }
                finally {

                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            window.SoftInputMode.set('adjustResize');

            // update cart count
            $('#shipping-info-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            //add listener for when the window is resized by virtue of the device keyboard being shown
            window.addEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                shippingInfoPageViewModel.scrollAndResizeEventListener, false);
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            // hide the tooltips on the profile form
            $('#shipping-info-page #shipping-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });

            // reset all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.reset();

            //remove listener for when the window is resized by virtue of the device keyboard being shown
            window.removeEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                shippingInfoPageViewModel.scrollAndResizeEventListener, false);
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            // destroy the tooltips on the shipping form
            $('#shipping-info-page #shipping-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // destroy the tooltip
                tooltipArrayElem.destroy();
            });

            // destroy the Country & State DropDownLists
            $('#shipping-info-page #shipping-info-country').get(0).ej2_instances[0].destroy();
            $('#shipping-info-page #shipping-info-state').get(0).ej2_instances[0].destroy();

            // destroy the "Cancel" and "Update" buttons
            $('#shipping-info-page #shipping-info-cancel').get(0).ej2_instances[0].destroy();
            $('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].destroy();

            // destroy all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.destroy();
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */
        async scrollAndResizeEventListener(){
            // place function execution in the event queue to be executed ASAP
            window.setTimeout(function(){
                // adjust the tooltips elements on the shipping form
                $('#shipping-info-form textarea, #shipping-info-form ons-input, #shipping-info-form #shipping-info-country, #shipping-info-form #shipping-info-state').
                each(function(index, element){
                    document.getElementById('shipping-info-form').ej2_instances[index].refresh(element);
                });

            }, 0);

        },


        /**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */
        async updateButtonClicked(){

            // run the validation method for the shipping-info form
            utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.
            shippingInfoFormValidator.whenValidate();
        },

        /**
         * method is triggered when the shipping-info form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async shippingInfoFormValidated(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to update shipping information`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            // disable the "Update" button
            $('#shipping-info-page #shipping-info-update').attr("disabled", true);
            // show the spinner on the 'Update' button to indicate process is ongoing
            $('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].cssClass = '';
            $('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].dataBind();
            $('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].start();

            // display page loader while completing the "update profile" request
            $('#shipping-info-page .modal').css("display", "table");

            var promisesArray = []; // holds the array for the promises used to complete the process

            var promisesArrayPromise = null; // holds the promise gotten from the promisesArray

            try{
                // load the use details from the encrypted app database
                let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                console.log("USER DETAILS BEFORE SHIPPING INFO UPDATE", userDetails);

                // temporary hold the user id and password
                let userId = userDetails.id;
                let userPassword = userDetails.password;

                // check if user details has the shipping property
                if(!userDetails.shipping){ // no shipping property, so create it
                    // create the shipping property
                    userDetails.shipping = {};
                }

                // use the input from the shipping form to update the user details
                userDetails.shipping.first_name = $('#shipping-info-page #shipping-info-first-name').val().trim();
                userDetails.shipping.last_name = $('#shipping-info-page #shipping-info-last-name').val().trim();
                userDetails.shipping.company = $('#shipping-info-page #shipping-info-company').val().trim();
                userDetails.shipping.address_1 = $('#shipping-info-page #shipping-info-address-1').val().trim();
                userDetails.shipping.address_2 = $('#shipping-info-page #shipping-info-address-2').val().trim();
                userDetails.shipping.postcode = $('#shipping-info-page #shipping-info-postcode').val().trim();
                userDetails.shipping.city = $('#shipping-info-page #shipping-info-city').val().trim();
                userDetails.shipping.country = $('#shipping-info-page #shipping-info-country').get(0).ej2_instances[0].value;
                userDetails.shipping.state = $('#shipping-info-page #shipping-info-state').get(0).ej2_instances[0].value ?
                    $('#shipping-info-page #shipping-info-state').get(0).ej2_instances[0].value : "";

                // delete the properties not needed for the update from the userDetails object
                delete userDetails.id;
                delete userDetails.password;

                // now send the user profile update request to the remote server
                promisesArray.push(Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/customers/${userId}`,
                        type: "put",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify(userDetails)
                    }
                )));

                // get the promise created from the promisesArray
                promisesArrayPromise = Promise.all(promisesArray);

                // get the result from the promisesArray
                let resultsArray = await promisesArrayPromise;

                // add the user's password to the user details retrieved from the server
                resultsArray[0].password = userPassword;

                // save the created user details data to ENCRYPTED app database as cached data
                await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                    {_id: "user-details", docType: "USER_DETAILS", userDetails: resultsArray[0]},
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'success-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Shipping information updated`;
                toast.dataBind();
                toast.show();

            }
            catch (err) {
                err = JSON.parse(err.responseText);

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Shipping information update failed. ${err.message || ""}`;
                toast.dataBind();
                toast.show();
            }
            finally {
                // enable the "Update" button
                $('#shipping-info-page #shipping-info-update').removeAttr("disabled");
                // hide the spinner on the 'Update' button to indicate process is ongoing
                $('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].cssClass = 'e-hide-spinner';
                $('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].dataBind();
                $('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].stop();

                // hide page loader
                $('#shipping-info-page .modal').css("display", "none");
            }

            return promisesArrayPromise; // return the resolved promisesArray

        },

        /**
         * method is used to load the current shipping info data into the shipping info form
         * @returns {Promise<void>}
         */
        async displayContent(){

            try{
                // load the user profile details from the app database
                let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                console.log("USER DETAILS", userDetails);

                // display the user shipping info data in the shipping info form
                $('#shipping-info-page #shipping-info-form #shipping-info-first-name').
                val(userDetails.shipping && userDetails.shipping.first_name ? userDetails.shipping.first_name : "");
                $('#shipping-info-page #shipping-info-form #shipping-info-last-name').
                val(userDetails.shipping && userDetails.shipping.last_name ? userDetails.shipping.last_name : "");
                $('#shipping-info-page #shipping-info-form #shipping-info-company').
                val(userDetails.shipping && userDetails.shipping.company ? userDetails.shipping.company : "");
                $('#shipping-info-page #shipping-info-form #shipping-info-address-1').
                val(userDetails.shipping && userDetails.shipping.address_1 ? userDetails.shipping.address_1 : "");
                $('#shipping-info-page #shipping-info-form #shipping-info-address-2').
                val(userDetails.shipping && userDetails.shipping.address_2 ? userDetails.shipping.address_2 : "");
                $('#shipping-info-page #shipping-info-form #shipping-info-postcode').
                val(userDetails.shipping && userDetails.shipping.postcode ? userDetails.shipping.postcode : "");
                $('#shipping-info-page #shipping-info-form #shipping-info-city').
                val(userDetails.shipping && userDetails.shipping.city ? userDetails.shipping.city : "");

                // get the country dropdownlist
                var countryDropDownList = $('#shipping-info-page #shipping-info-form #shipping-info-country').get(0).ej2_instances[0];
                // temporarily remove the select event listener for the country dropdownlist
                countryDropDownList.removeEventListener("select");
                // update the select dropdownlist for country
                countryDropDownList.value = (userDetails.shipping && userDetails.shipping.country && userDetails.shipping.country !== "")
                    ? userDetails.shipping.country : 'NG';
                countryDropDownList.dataBind();

                // update the select dropdownlist for state
                let statesDropDownList = $('#shipping-info-page #shipping-info-form #shipping-info-state').get(0).ej2_instances[0];
                statesDropDownList.dataSource = countryDropDownList.dataSource.find(function(countryElement){
                    return countryElement.code === countryDropDownList.value;
                }).states;
                statesDropDownList.dataBind();
                statesDropDownList.value = (userDetails.shipping && userDetails.shipping.state && userDetails.shipping.state !== "")
                    ? userDetails.shipping.state : null;
                statesDropDownList.dataBind();
                // check if the state dropdownlist has a value
                if(statesDropDownList.value){ // check if the state dropdownlist has a value
                    statesDropDownList.enabled = true; // enable the state dropdownlist
                    statesDropDownList.dataBind();
                }
                else if(countryDropDownList.value === 'NG'){ // if the country selected is nigeria
                    statesDropDownList.enabled = true; // enable the state dropdownlist
                    statesDropDownList.dataBind();
                }
                else { // the state dropdown has no value and the country selected is not nigeria
                    statesDropDownList.enabled = false; // disable the state dropdownlist
                    statesDropDownList.dataBind();
                }
                console.log("STATE VALUE", statesDropDownList.value);

            }
            finally {
                // hide page preloader
                $('#shipping-info-page .page-preloader').css("display", "none");
                // hide page modal loader
                $('#shipping-info-page .modal').css("display", "none");
                // enable the "Update" button
                $('#shipping-info-page #shipping-info-update').removeAttr("disabled");

                // reinstate the country dropdownlist "select" listener in a separate event block
                window.setTimeout(async function(){
                    // reinstate the country dropdownlist "select" listener
                    countryDropDownList.addEventListener("select", async function () { // listen for when dropdown list value is changed by selection
                        let countryDropDownList = this; // holds this dropdown list

                        // execute the task in a separate event block
                        window.setTimeout(async function(){
                            // get the country object and its states that represents the country value selected
                            let countryStatesArray = countryDropDownList.getDataByValue(countryDropDownList.value).states;
                            // get the state dropdownlist
                            let stateDropDownList = $('#shipping-info-page #shipping-info-form #shipping-info-state').
                            get(0).ej2_instances[0];
                            // reset the selected value for the State
                            stateDropDownList.value = null;
                            // reset the dataSource for the State
                            stateDropDownList.dataSource = countryStatesArray;

                            if(countryStatesArray.length > 0 ){ // there are states in the selected country
                                // enable the State dropdownlist for user selection
                                stateDropDownList.enabled = true;
                            }
                            else{ // there are NO states in the selected country
                                // disable the State dropdownlist for user selection
                                stateDropDownList.enabled = false;
                            }

                            // bind/update all changes made to the State dropdownlist
                            stateDropDownList.dataBind();

                        }, 0);
                    });
                }, 0);
            }
        }

    },

    /**
     * this is the view-model/controller for the Checkout page
     */
    checkoutPageViewModel: {


        /**
         * holds the user's Order object which will be sent to the server
         */
        chekoutOrder : null,

        /**
         * holds the array/list of countries where the user's shipping address can be located
         */
        countryArray: [],

        /**
         * holds the array/list of shipping zones where an order can be delivered
         */
        shoppingZonesArray: [],

        /**
         * flag whether to update the billing details for the
         * checkout order data using the billing details of the current user
         */
        updateOrderBillingDetails: false,

        /**
         * flag whether to update the shipping details for the
         * checkout order data using the shipping details of the current user
         */
        updateOrderShippingDetails: false,

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

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        checkoutPageViewModel.backButtonClicked;

                // listen for scroll event on the page to adjust the tooltips when page scrolls
                $('#checkout-page .content').on("scroll", utopiasoftware[utopiasoftware_app_namespace].
                    controller.checkoutPageViewModel.scrollAndResizeEventListener);

                // set the order object to be used by this page
                utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder =
                $('#app-main-navigator').get(0).topPage.data.orderData;

                try{

                    // create the accorodion ej2 component used on the "Checkout" page
                    new ej.navigations.Accordion({
                        expandMode: 'Single',
                        expanded: utopiasoftware[utopiasoftware_app_namespace].
                            controller.checkoutPageViewModel.scrollAndResizeEventListener
                    }).appendTo('#checkout-accordion');

                    // create the Shipping method dropdown list from the select input
                    new ej.dropdowns.DropDownList(
                        {
                            cssClass: "shipping-method-dropdownlist",
                            dataSource: [],
                            fields: { value: 'method_id', text: 'title'},
                            placeholder: "Shipping Method",
                            floatLabelType: 'Auto',
                            enabled: false,
                            itemTemplate: '<span>${title}</span>',
                            valueTemplate: '<span>${title}</span>'
                        }).appendTo('#checkout-shipping-method-type');

                    // create the payment method dropdown list from the select input
                    new ej.dropdowns.DropDownList(
                        {
                            cssClass: "payment-method-dropdownlist",
                            dataSource: [],
                            fields: { value: 'id', text: 'title'},
                            placeholder: "Payment Method",
                            floatLabelType: 'Auto',
                            enabled: false,
                            itemTemplate: '<span>${title}</span>',
                            valueTemplate: '<span>${title}</span>'
                        }).appendTo('#checkout-payment-method-type');

                    // create the payment voucher multiselect dropdown list from the select input
                    new ej.dropdowns.MultiSelect(
                        {
                            cssClass: "payment-voucher-dropdownlist",
                            dataSource: [],
                            //fields: { value: 'id', text: 'method_title'},
                            placeholder: "Payment Coupons",
                            floatLabelType: 'Auto',
                            mode: "Box",
                            showClearButton: false,
                            showDropDownIcon: false,
                            enabled: false
                        }).appendTo('#checkout-payment-vouchers');

                    // create the "Make Payment" button
                    new ej.splitbuttons.ProgressButton({
                        cssClass: 'e-hide-spinner',
                        duration: 10 * 60 * 60 * 1000 // set spinner/progress duration for 10 hr
                    }).appendTo('#checkout-make-payment');

                    // create the tooltips for the checkout page
                    $('.utopiasoftware-checkout-failure', $thisPage).
                    each(function(index, element){
                        element._utopiasoftware_validator_index = index;
                        // create the tool tips for every element being validated, but attach it to the page element
                        new ej.popups.Tooltip({
                            cssClass: 'utopiasoftware-ej2-validation-tooltip',
                            position: 'TopCenter',
                            opensOn: 'Custom'
                        }).appendTo($thisPage.get(0));
                    });

                    //load the remote list of payment methods, list of shipping zones & local list of
                    // countries for the app; create a remote user cart containing the current checkout order for the user
                    let promisesArray = []; // holds all created promises

                    promisesArray.push(Promise.resolve($.ajax( // load the list of payment gateways
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/payment_gateways`,
                            type: "get",
                            //contentType: "application/json",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    )));
                    promisesArray.push(Promise.resolve($.ajax( // load the list of shipping zones
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v3/shipping/zones`,
                            type: "get",
                            //contentType: "application/json",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    )));
                    promisesArray.push(Promise.resolve($.ajax( // load the list of available countries
                        {
                            url: 'country-list.json',
                            type: "get",
                            //contentType: "application/json",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    utopiasoftware[utopiasoftware_app_namespace].accessor);
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    )));
                    // create the user remote cart
                    promisesArray.push(utopiasoftware[utopiasoftware_app_namespace].controller.
                    checkoutPageViewModel.createRemoteCartFromOrder());

                    // wait for all promises to resolve
                    promisesArray = await Promise.all(promisesArray);

                    // filter only pay method that are enabled
                    promisesArray[0] = promisesArray[0].filter(function(paymentElem){
                        return paymentElem.enabled === true;
                    });

                    // assign the payment method array as the dataSource for the payment method dropdownlist
                    $('#checkout-payment-method-type').get(0).ej2_instances[0].dataSource = promisesArray[0];
                    $('#checkout-payment-method-type').get(0).ej2_instances[0].dataBind();

                    //store the list of shipping zones as a view-model property
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        checkoutPageViewModel.shoppingZonesArray = promisesArray[1];

                    //store the list of countries as a view-model property
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        checkoutPageViewModel.countryArray = promisesArray[2];

                }
                catch(err){
                    // get back to the previous page on the app-main navigator stack
                    await $('#app-main-navigator').get(0).popPage();

                    console.log("CHECKOUT ERROR", err);
                    // hide all previously displayed ej2 toast
                    $('.page-toast').get(0).ej2_instances[0].hide('All');
                    $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                    // display toast message
                    let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                    toast.cssClass = 'error-ej2-toast';
                    toast.timeOut = 3000;
                    toast.content = `Error preparing checkout. Please retry`;
                    toast.dataBind();
                    toast.show();
                }
                finally {
                    // hide page preloader
                    $('#checkout-page .page-preloader').css("display", "none");
                    // hide page modal loader
                    $('#checkout-page .modal').css("display", "none");
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: async function(){
            // check if the payment method element exists on page
            if($('#checkout-page #checkout-payment-method-type').length == 0){ // if length is zero, element does not exist
                return; // exit the method
            }

            // get payment method dropdownlist component
            var paymentMethodDropDown = $('#checkout-payment-method-type').get(0).ej2_instances[0];

            console.log("CHECKOUT DATASOURCE", paymentMethodDropDown.dataSource);


            // check if the datasource for the payment method has been set
            if(paymentMethodDropDown.dataSource.length == 0){ // datasource for the payment method dropdownlist has not been set
                // re-execute this method again after some time
                window.setTimeout(utopiasoftware[utopiasoftware_app_namespace].controller.
                    checkoutPageViewModel.pageShow, 500);

                return;
            }

            window.SoftInputMode.set('adjustResize'); // adjust device input mode

            //add listener for when the window is resized by virtue of the device keyboard being shown
            window.addEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                checkoutPageViewModel.scrollAndResizeEventListener, false);

            // show page preloader
            $('#checkout-page .page-preloader').css("display", "block");
            // show page modal loader
            $('#checkout-page .modal').css("display", "table");


            try{
                // display the content of the checkout page
                await utopiasoftware[utopiasoftware_app_namespace].controller.
                    checkoutPageViewModel.displayContent();
            }
            catch(err){
                console.log("CHECKOUT SHOW ERROR", err);
                // hide page preloader
                $('#checkout-page .page-preloader').css("display", "none");
                // hide page modal loader
                $('#checkout-page .modal').css("display", "none");

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Checkout error. Please retry or Pull Down to refresh`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }


            try{
                await utopiasoftware[utopiasoftware_app_namespace].controller.
                checkoutPageViewModel.validateOrderCheckout();
            }
            catch(err){
                /*console.log("CHECKOUT SHOW ERROR", err);
                // hide page preloader
                $('#checkout-page .page-preloader').css("display", "none");
                // hide page modal loader
                $('#checkout-page .modal').css("display", "none");

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast message
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Checkout error. Please retry or Pull Down to refresh`;
                toast.dataBind();
                toast.show();*/

            }
            finally {
                // hide page preloader
                $('#checkout-page .page-preloader').css("display", "none");
                // hide page modal loader
                $('#checkout-page .modal').css("display", "none");
            }

            console.log("END OF CHECKOUT SHOW");
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){

            //add listener for when the window is resized by virtue of the device keyboard being shown
            window.removeEventListener("resize", utopiasoftware[utopiasoftware_app_namespace].controller.
                checkoutPageViewModel.scrollAndResizeEventListener, false);


            // close the tooltips on the page
            $('#checkout-page').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // hide the tooltip
                tooltipArrayElem.close();
            });
            console.log("END OF CHECKOUT HIDE");
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            // destroy the shipping method dropdownlist
            $('#checkout-page #checkout-shipping-method-type').get(0).ej2_instances[0].destroy();

            // destroy the payment method dropdownlist
            $('#checkout-page #checkout-payment-method-type').get(0).ej2_instances[0].destroy();

            // destroy the payment voucher multiselect dropdownlist
            $('#checkout-page #checkout-payment-vouchers').get(0).ej2_instances[0].destroy();

            // destroy the "Make Payment"
            $('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].destroy();

            // destroy the page accordion
            $('#checkout-page #checkout-accordion').get(0).ej2_instances[0].destroy();

            // destroy the tooltips on the page
            $('#checkout-page').get(0).ej2_instances.forEach(function(tooltipArrayElem){
                // destroy the tooltip
                tooltipArrayElem.destroy();
            });

            // reset the view-model properties
            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.countryArray = [];
            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.shoppingZonesArray = [];
            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                updateOrderBillingDetails = false;
            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                updateOrderShippingDetails = false;
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */
        async scrollAndResizeEventListener(){
            // place function execution in the event queue to be executed ASAP
            window.setTimeout(function(){
                // adjust the tooltips elements on the checkout page
                $('#checkout-page .utopiasoftware-checkout-failure').
                each(function(index, element){
                    document.getElementById('checkout-page').ej2_instances[index].refresh(element);
                });

            }, 0);

        },

        /**
         * method is triggered when the "Edit" button for the billing details is clicked
         *
         * @returns {Promise<void>}
         */
        async editBillingDetailsButtonClicked(){
            // set the update billing details flag to true
            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                updateOrderBillingDetails = true;
            // display the billing details page
            $('#app-main-navigator').get(0).pushPage('billing-info-page.html');
        },

        /**
         * method is triggered when the "Edit" button for the shipping details is clicked
         *
         * @returns {Promise<void>}
         */
        async editShippingDetailsButtonClicked(){
            // set the update shipping details flag to true
            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                updateOrderShippingDetails = true;
            // display the shipping details page
            $('#app-main-navigator').get(0).pushPage('shipping-info-page.html');
        },

        /**
         * method is triggered when the "Edit" button for the shipping method is clicked
         *
         * @returns {Promise<void>}
         */
        async editShippingMethodButtonClicked(){

            // handle the task in a separate event block
            window.setTimeout(function(){
                // enable the shipping method dropdownlist
                let shippingMethodDropdownList = $('#checkout-page #checkout-shipping-method-type').get(0).ej2_instances[0];
                shippingMethodDropdownList.enabled = true;
                shippingMethodDropdownList.dataBind();
            }, 0);
        },

        /**
         * method is triggered when the "Edit" button for the payment method is clicked
         *
         * @returns {Promise<void>}
         */
        async editPaymentMethodButtonClicked(){

            // handle the task in a separate event block
            window.setTimeout(function(){
                // enable the payment method dropdownlist
                let paymentMethodDropdownList = $('#checkout-page #checkout-payment-method-type').get(0).ej2_instances[0];
                paymentMethodDropdownList.enabled = true;
                paymentMethodDropdownList.dataBind();
            }, 0);
        },

        /**
         * method is triggerd when  the "Apply" coupon button is clicked
         *
         * @returns {Promise<void>}
         */
        async applyCouponButtonClicked(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to apply coupon`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            try{
                // show the page loader modal
                $('#checkout-page .modal').css("display", "table");

                // check if the coupon is valid or not
                let couponsArray = await Promise.resolve($.ajax( // load the list of shipping zones
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                            `/wp-json/wc/v3/coupons`,
                        type: "get",
                        //contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: true,
                        data: {code: $('#checkout-page #checkout-payment-voucher-code').val().trim()}
                    }
                ));

                // check if any coupons were found
                if(couponsArray.length == 0){ // no coupons were found
                    throw "error - no coupon found";
                }

                // get a local/deep-clone copy of the page's checkout order object
                let localOrderObject = JSON.parse(JSON.
                stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));
                // update the coupons for the local order object to be sent to the server
                localOrderObject.coupon_lines = localOrderObject.coupon_lines.map(function(couponElem){
                    return {code: couponElem.code};
                });
                localOrderObject.coupon_lines.push({code: couponsArray[0].code}); // add the new coupon

                // update the checkout order data on the remote server
                localOrderObject = await Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                            `/wp-json/wc/v3/orders/${localOrderObject.id}`,
                        type: "put",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify(localOrderObject)
                    }
                ));

                // update the page checkout order with the updated order from the server
                utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                    chekoutOrder = localOrderObject;

                // clear the coupon code entered into the coupon/voucher input
                $('#checkout-page #checkout-payment-voucher-code').val("");

                // redisplay the page (redisplaying the page also hides the page loader when the process is complete)
                await utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();
            }
            catch(err){

                // hide the page loader modal
                $('#checkout-page .modal').css("display", "none");

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Coupon not applied. Invalid coupon code`;
                toast.dataBind();
                toast.show();
            }
        },

        /**
         * method is triggerd when  the "Add" note button is clicked
         *
         * @returns {Promise<void>}
         */
        async addNoteButtonClicked(){

            // check if there is Internet connection
            if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Connect to the Internet to add shipping notes to the order`;
                toast.dataBind();
                toast.show();

                return; // exit method
            }

            try{

                // show page loader
                $('#checkout-page .modal').css("display", "table");

                // get a local/deep-clone copy of the page's checkout order object
                let localOrderObject = JSON.parse(JSON.
                stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));
                // update the customer note for the local order object to be sent to the server
                localOrderObject.customer_note = $('#checkout-page #checkout-payment-order-note-text').val().trim();
                // update the coupons for the local order object to be sent to the server
                localOrderObject.coupon_lines = localOrderObject.coupon_lines.map(function(couponElem){
                    return {code: couponElem.code};
                });

                // update the checkout order data on the remote server
                localOrderObject = await Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                            `/wp-json/wc/v3/orders/${localOrderObject.id}`,
                        type: "put",
                        contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: false,
                        data: JSON.stringify(localOrderObject)
                    }
                ));

                // update the page checkout order with the updated order from the server
                utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                    chekoutOrder = localOrderObject;

                // clear the coupon code entered into the coupon/voucher input
                $('#checkout-page #checkout-payment-order-note-text').val("");

                // redisplay the page (redisplaying the page also hides the page loader when the process is complete)
                await utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();
            }
            catch(err){

                // hide the page loader modal
                $('#checkout-page .modal').css("display", "none");

                // hide all previously displayed ej2 toast
                $('.page-toast').get(0).ej2_instances[0].hide('All');
                $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                // display toast to show that an error
                let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'error-ej2-toast';
                toast.timeOut = 3000;
                toast.content = `Shipping note could not added. Please retry`;
                toast.dataBind();
                toast.show();
            }
        },

        /**
         * method is triggered when the user clicks the "Make Payment" button
         *
         * @returns {Promise<void>}
         */
        async makePaymentButtonClicked(){

            // view cart
            await Promise.resolve($.ajax(
                {
                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v2/cart`,
                    type: "get",
                    contentType: "application/json",
                    beforeSend: function(jqxhr) {
                        jqxhr.setRequestHeader("Authorization", "Basic " +
                            Base64.encode(`writeosahon@yahoo.co.uk:password`));
                    },
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    timeout: 240000, // wait for 4 minutes before timeout of request
                    processData: false
                }
            ));

            // add item to cart
            await Promise.resolve($.ajax(
                {
                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v2/cart/add`,
                    type: "post",
                    contentType: "application/json",
                    beforeSend: function(jqxhr) {
                        jqxhr.setRequestHeader("Authorization", "Basic " +
                            Base64.encode(`writeosahon@yahoo.co.uk:password`));
                    },
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    timeout: 240000, // wait for 4 minutes before timeout of request
                    processData: false,
                    data: JSON.stringify({product_id: 559, quantity: 3})
                }
            ));

            let cartData = await Promise.resolve($.ajax(
                {
                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v2/cart`,
                    type: "get",
                    contentType: "application/json",
                    beforeSend: function(jqxhr) {
                        jqxhr.setRequestHeader("Authorization", "Basic " +
                            Base64.encode(`writeosahon@yahoo.co.uk:password`));
                    },
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    dataType: "json",
                    timeout: 240000, // wait for 4 minutes before timeout of request
                    processData: false
                }
            )); //todo

            console.log("VIEW CART", cartData);
        },

        /**
         * method is used to load the current checkout/order data into the page
         * @returns {Promise<void>}
         */
        async displayContent(){

            try{
                // load the user profile details from the app database
                var userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                loadData("user-details",
                    utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                // check if the checkout order billing data should be updated with the current user's billing
                if(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                    updateOrderBillingDetails === true){ // billing data should be updated
                    utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.billing =
                        userDetails.billing;
                    // reset the flag
                    utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                        updateOrderBillingDetails = false;
                }

                // check if the checkout order shipping data should be updated with the current user's shipping
                if(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                    updateOrderShippingDetails === true){ // shipping data should be updated
                    utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.shipping =
                        userDetails.shipping;
                    // reset the flag
                    utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                        updateOrderShippingDetails = false;
                }

                // get the order object set on this page
                let orderData = utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder;

                console.log("CHECK OUT USER DETAILS", userDetails);

                // display the checkout data
                $('#checkout-page #checkout-personal-details-email').html(userDetails.email);
                $('#checkout-page #checkout-personal-details-first-name').html(userDetails.first_name);
                $('#checkout-page #checkout-personal-details-last-name').html(userDetails.last_name);

                $('#checkout-page #checkout-billing-information-address').html(orderData.billing.address_1);
                $('#checkout-page #checkout-billing-information-city').html(orderData.billing.city);

                $('#checkout-page #checkout-shipping-information-first-name').html(orderData.shipping.first_name);
                $('#checkout-page #checkout-shipping-information-last-name').html(orderData.shipping.last_name);
                $('#checkout-page #checkout-shipping-information-address').html(orderData.shipping.address_1);
                $('#checkout-page #checkout-shipping-information-city').html(orderData.shipping.city);

                // get the shipping zone the of the user by checking the user's shipping country
                let shippingCountryCode =  orderData.shipping.country == "" ? 'NG': orderData.shipping.country;
                let shippingZoneId = 0; // set the shipping zone id to the default i.e. 'Rest of the world'
                // find the country with the specified country code
                let shippingCountry = utopiasoftware[utopiasoftware_app_namespace].controller.
                    checkoutPageViewModel.countryArray.find(function(countryElem){
                        return countryElem.code === shippingCountryCode;
                });
                // check if a shipping country was discovered
                if(shippingCountry){ // a shipping country was discovered
                    // get the shipping zone id which the shipping country belongs to
                    let shippingZone = utopiasoftware[utopiasoftware_app_namespace].controller.
                        checkoutPageViewModel.shoppingZonesArray.find(function(shippingZoneElem){
                            return shippingZoneElem.name === shippingCountry.name;
                    });
                    if(shippingZone){ // a shipping zone was found
                        //get the id of the discovered shipping zone
                        shippingZoneId = shippingZone.id;
                    }
                }

                // get the shipping methods attached to the discovered shipping zone
                let shippingMethodsArray = await Promise.resolve($.ajax( // load the list of shipping zones
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                            `/wp-json/wc/v3/shipping/zones/${shippingZoneId}/methods`,
                        type: "get",
                        //contentType: "application/json",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("Authorization", "Basic " +
                                utopiasoftware[utopiasoftware_app_namespace].accessor);
                        },
                        dataType: "json",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: true,
                        data: {}
                    }
                ));
                // filter the shipping methods for only the methods that are enabled
                shippingMethodsArray = shippingMethodsArray.filter(function(shippingMethodElem){
                    return shippingMethodElem.enabled === true;
                });
                // remove the "select" event listener for the shipping method dropdownlist
                let shippingMethodDropDown = $('#checkout-shipping-method-type').get(0).ej2_instances[0];
                shippingMethodDropDown.removeEventListener("select");

                // set the shippingMethodArray as the datasource for the shipping method dropdownlist
                shippingMethodDropDown.dataSource = shippingMethodsArray;
                // set the pre-selected shipping method (i.e. the shippingMethod dropdownlist value)
                // check if there are any shipping lines info available
                if(orderData.shipping_lines.length > 0){ // if length is > 0, there are shipping lines info available
                    // set the shipping method dropdownlist value
                    shippingMethodDropDown.value = orderData.shipping_lines[0].method_id;
                }
                shippingMethodDropDown.dataBind();

                // add the "select" event listener for the shipping method dropdownlist
                shippingMethodDropDown.addEventListener("select", function(){
                    // handle the task in a separate event block
                    window.setTimeout(async function(){

                        // check if there is Internet connection
                        if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                            // hide all previously displayed ej2 toast
                            $('.page-toast').get(0).ej2_instances[0].hide('All');
                            $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                            // display toast to show that an error
                            let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                            toast.cssClass = 'error-ej2-toast';
                            toast.timeOut = 3000;
                            toast.content = `Connect to the Internet to change shipping method`;
                            toast.dataBind();
                            toast.show();

                            return; // exit method
                        }

                        // display the page loader modal
                        $('#checkout-page .modal').css("display", "table");

                        // get a local/deep-clone copy of the page's checkout order object
                        let localOrderObject = JSON.parse(JSON.
                        stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));
                        // update the shipping method for the local order object to be sent to the server
                        localOrderObject.shipping_lines[0] =
                            {method_id: shippingMethodDropDown.value, method_title: shippingMethodDropDown.text};
                        // update the coupons for the local order object to be sent to the server
                        localOrderObject.coupon_lines = localOrderObject.coupon_lines.map(function(couponElem){
                            return {code: couponElem.code};
                        });

                        // perform some remote /asynchronous tasks needed to update the order method
                        try{

                            // change the user shipping method on the remote cart using a helper script
                            await Promise.resolve($.ajax(
                                {
                                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/test.php`,
                                    type: "get",
                                    contentType: "application/json",
                                    beforeSend: function(jqxhr) {
                                        jqxhr.setRequestHeader("Authorization", "Basic " +
                                            Base64.encode(`${userDetails.email}:${userDetails.password}`));
                                    },
                                    crossDomain: true,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    dataType: "text",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: false,
                                    // send the shipping method data represented by selected shipping method value
                                    data: JSON.stringify(shippingMethodDropDown.getDataByValue(shippingMethodDropDown.value))
                                }
                            ));

                            // calculate all the totals for the remote user cart
                            await Promise.resolve($.ajax(
                                {
                                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                                        `/wp-json/wc/v2/cart/calculate`,
                                    type: "post",
                                    contentType: "application/json",
                                    beforeSend: function(jqxhr) {
                                        jqxhr.setRequestHeader("Authorization", "Basic " +
                                            Base64.encode(`${userDetails.email}:${userDetails.password}`));
                                    },
                                    crossDomain: true,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    dataType: "text",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: true,
                                    data: {}
                                }
                            ));

                            // get all the totals for the remote user cart
                            let remoteCartTotals = await Promise.resolve($.ajax(
                                {
                                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                                        `/wp-json/wc/v2/cart/totals`,
                                    type: "get",
                                    contentType: "application/json",
                                    beforeSend: function(jqxhr) {
                                        jqxhr.setRequestHeader("Authorization", "Basic " +
                                            Base64.encode(`${userDetails.email}:${userDetails.password}`));
                                    },
                                    crossDomain: true,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    dataType: "json",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: true,
                                    data: {}
                                }
                            ));

                            // update the shipping method for the local order object to be sent to the server
                            localOrderObject.shipping_lines[0].total = "" + remoteCartTotals.shipping_total;

                            // update the checkout order data on the remote server
                            localOrderObject = await Promise.resolve($.ajax(
                                {
                                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                                        `/wp-json/wc/v3/orders/${localOrderObject.id}`,
                                    type: "put",
                                    contentType: "application/json",
                                    beforeSend: function(jqxhr) {
                                        jqxhr.setRequestHeader("Authorization", "Basic " +
                                            utopiasoftware[utopiasoftware_app_namespace].accessor);
                                    },
                                    dataType: "json",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: false,
                                    data: JSON.stringify(localOrderObject)
                                }
                            ));

                            // update the page checkout order with the updated order from the server
                            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                                chekoutOrder = localOrderObject;

                            // disable the shipping method dropdownlist
                            shippingMethodDropDown.enabled = false;
                            shippingMethodDropDown.dataBind();

                            // redisplay the page (redisplaying the page also hides the page loader when the process is complete)
                            await utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();
                        }
                        catch(err){
                            console.log("CHECKOUT SHIPPING METHOD UPDATE ERROR", err);

                            err = JSON.parse(err.responseText.trim());

                            // hide all previously displayed ej2 toast
                            $('.page-toast').get(0).ej2_instances[0].hide('All');
                            $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                            // display toast message
                            let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                            toast.cssClass = 'error-ej2-toast';
                            toast.timeOut = 3000;
                            toast.content = `Shipping method not updated, retry. ${err.message || ""}`;
                            toast.dataBind();
                            toast.show();

                            // hide the page loader modal
                            $('#checkout-page .modal').css("display", "none");
                        }

                    }, 0);
                });

                // remove the "select" event listener for the shipping method dropdownlist
                let paymentMethodDropDown = $('#checkout-payment-method-type').get(0).ej2_instances[0];
                paymentMethodDropDown.removeEventListener("select");

                // set the pre-selected payment method for the order data
                paymentMethodDropDown.value = orderData.payment_method;
                paymentMethodDropDown.dataBind();

                // add the "select" event listener for the payment method dropdownlist
                paymentMethodDropDown.addEventListener("select", function(){
                    // handle the task in a separate event block
                    window.setTimeout(async function(){

                        // check if there is Internet connection
                        if(navigator.connection.type === Connection.NONE){ // there is no Internet connection
                            // hide all previously displayed ej2 toast
                            $('.page-toast').get(0).ej2_instances[0].hide('All');
                            $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                            // display toast to show that an error
                            let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                            toast.cssClass = 'error-ej2-toast';
                            toast.timeOut = 3000;
                            toast.content = `Connect to the Internet to change payment method`;
                            toast.dataBind();
                            toast.show();

                            return; // exit method
                        }

                        // display the page loader modal
                        $('#checkout-page .modal').css("display", "table");

                        // get a local/deep-clone copy of the page's checkout order object
                        let localOrderObject = JSON.parse(JSON.
                        stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));
                        // update the payment method for the local order object to be sent to the server
                        localOrderObject.payment_method = paymentMethodDropDown.value;
                        localOrderObject.payment_method_title = paymentMethodDropDown.text;
                        // update the coupons for the local order object to be sent to the server
                        localOrderObject.coupon_lines = localOrderObject.coupon_lines.map(function(couponElem){
                            return {code: couponElem.code};
                        });

                        // update the checkout order data on the remote server
                        try{
                            localOrderObject = await Promise.resolve($.ajax(
                                {
                                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl +
                                        `/wp-json/wc/v3/orders/${localOrderObject.id}`,
                                    type: "put",
                                    contentType: "application/json",
                                    beforeSend: function(jqxhr) {
                                        jqxhr.setRequestHeader("Authorization", "Basic " +
                                            utopiasoftware[utopiasoftware_app_namespace].accessor);
                                    },
                                    dataType: "json",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: false,
                                    data: JSON.stringify(localOrderObject)
                                }
                            ));

                            // update the page checkout order with the updated order from the server
                            utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.
                                chekoutOrder = localOrderObject;

                            // disable the payment method dropdownlist
                            paymentMethodDropDown.enabled = false;
                            paymentMethodDropDown.dataBind();

                            // redisplay the page (redisplaying the page also hides the page loader when the process is complete)
                            await utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();
                        }
                        catch(err){
                            console.log("CHECKOUT PAYMENT METHOD UPDATE ERROR", err);

                            err = JSON.parse(err.responseText);

                            // hide all previously displayed ej2 toast
                            $('.page-toast').get(0).ej2_instances[0].hide('All');
                            $('.timed-page-toast').get(0).ej2_instances[0].hide('All');
                            // display toast message
                            let toast = $('.timed-page-toast').get(0).ej2_instances[0];
                            toast.cssClass = 'error-ej2-toast';
                            toast.timeOut = 3000;
                            toast.content = `Payment method not updated, retry. ${err.message || ""}`;
                            toast.dataBind();
                            toast.show();

                            // hide the page loader modal
                            $('#checkout-page .modal').css("display", "none");
                        }

                    }, 0);
                });

                // set the order coupons
                let couponsMultiSelectDropDown = $('#checkout-payment-vouchers').get(0).ej2_instances[0];
                let couponsArray = orderData.coupon_lines.map(function(couponElem){
                    return couponElem.code;
                });
                // set the datasource and the values for the coupons mulitselect dropdown
                couponsMultiSelectDropDown.dataSource = couponsArray;
                couponsMultiSelectDropDown.value = couponsArray;
                couponsMultiSelectDropDown.dataBind();

                // set the order notes i.e. shipping instructions
                $('#checkout-page #checkout-payment-order-note-text').val(orderData.customer_note);

                // display the order items
                let orderItemsDisplayContent = ''; // holds the content to be displayed for the order items segment
                for(let index = 0; index < orderData.line_items.length; index++){
                    orderItemsDisplayContent +=
                        `<div class="col-xs-6" style="text-align: right; padding-right: 5px;
                        padding-top: 10px; padding-bottom: 10px">${orderData.line_items[index].name}</div>
                        <div class="col-xs-2" style="text-align: left;
                        padding-top: 10px; padding-bottom: 10px">&times;${orderData.line_items[index].quantity}</div>
                        <div class="col-xs-4" style="text-align: left; padding-left: 5px;
                        padding-top: 10px; padding-bottom: 10px">
                        &#x20a6;${kendo.toString(kendo.parseFloat(orderData.line_items[index].subtotal), "n2")}</div>`;
                }
                $('#checkout-page #checkout-order-items-container').html(orderItemsDisplayContent);

                // display checkout totals
                $('#checkout-page #checkout-page-items-cost').html(
                `&#x20a6;${kendo.toString((kendo.parseFloat(orderData.total) - kendo.parseFloat(orderData.shipping_total) +
                    kendo.parseFloat(orderData.discount_total)), "n2")}`);
                $('#checkout-page #checkout-page-shipping-cost').html(
                    `&#x20a6;${kendo.toString(kendo.parseFloat(orderData.shipping_total), "n2")}`
                );
                $('#checkout-page #checkout-page-discount-cost').html(
                    `&#x20a6;${kendo.toString(kendo.parseFloat(orderData.discount_total), "n2")}`
                );
                $('#checkout-page #checkout-page-total-cost').html(
                    `&#x20a6;${kendo.toString(kendo.parseFloat(orderData.total), "n2")}`
                );
                if(kendo.parseFloat(orderData.discount_total) > 0){ // if the discount total value is > zero
                    // display the discount total to user
                    $('#checkout-page .checkout-page-discount').css("display", "block");
                }
                else{ // the discount total is zero
                    // hide the discount total from user
                    $('#checkout-page .checkout-page-discount').css("display", "none");
                }
            }
            finally {

            }
        },

        /**
         * method is a utility used to validate the order object/data i.e. the 'chekoutOrder' property of
         * the view-model
         *
         * @returns {Promise<void>} the Promise resolves when the order data is successfully validated; it
         * rejects when the validation fails.
         */
        async validateOrderCheckout(){

            var validationSuccessful = true; // flag indicates if checkout validation was successful or not

            return new Promise(async function(resolve, reject){

                // get the checkout Order object
                var orderData = utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder;

                // validate the personal details segment
                try{
                    // load the user profile details from the app database
                    let userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("user-details",
                        utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;
                    if(!userDetails.first_name || userDetails.first_name == ""){
                        throw "validation error";
                    }
                    // user validation was successful
                    $('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-success').
                    css("display", "inline-block");
                    $('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').
                    css("display", "none");
                    // hide error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').
                        get(0)._utopiasoftware_validator_index;
                    $('#checkout-page').get(0).ej2_instances[tooltipIndex].close();
                }
                catch(err){
                    // user details could not be loaded, so user validation failed
                    $('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-success').
                        css("display", "none");
                    $('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').
                    css("display", "inline-block");
                    // display error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    let tooltip = $('#checkout-page').get(0).ej2_instances[tooltipIndex];
                    tooltip.content = "incomplete personal details";
                    tooltip.dataBind();
                    tooltip.open( $('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure')
                        .get(0));
                    // flag validation as failed
                    validationSuccessful = false;
                }

                // validate the billing details segment
                if(!orderData.billing.address_1 || orderData.billing.address_1 == ""){ // the billing address has NOT been provided
                    // signal that billing details validation failed
                    $('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-success').
                    css("display", "none");
                    $('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').
                    css("display", "inline-block");
                    // display error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    let tooltip = $('#checkout-page').get(0).ej2_instances[tooltipIndex];
                    tooltip.content = "incomplete billing details";
                    tooltip.dataBind();
                    tooltip.open( $('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure')
                        .get(0));
                    // flag validation as failed
                    validationSuccessful = false;
                }
                else{ // the billing address and other billing info have been provided
                    $('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-success').
                    css("display", "inline-block");
                    $('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').
                    css("display", "none");
                    // hide error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    $('#checkout-page').get(0).ej2_instances[tooltipIndex].close();
                }

                // validate the shipping details segment
                if(!orderData.shipping.address_1 || orderData.shipping.address_1 == ""){ // the shipping address has NOT been provided
                    // signal that shipping details validation failed
                    $('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-success').
                    css("display", "none");
                    $('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').
                    css("display", "inline-block");
                    // display error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    let tooltip = $('#checkout-page').get(0).ej2_instances[tooltipIndex];
                    tooltip.content = "incomplete shipping details";
                    tooltip.dataBind();
                    tooltip.open( $('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure')
                        .get(0));
                    // flag validation as failed
                    validationSuccessful = false;
                }
                else{ // the billing address and other billing info have been provided
                    $('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-success').
                    css("display", "inline-block");
                    $('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').
                    css("display", "none");
                    // hide error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    $('#checkout-page').get(0).ej2_instances[tooltipIndex].close();
                }

                // validate the shipping method segment
                if(! $('#checkout-page #checkout-shipping-method-type').get(0).ej2_instances[0].value){ // no shipping method
                    // signal that shipping method validation failed
                    $('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-success').
                    css("display", "none");
                    $('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').
                    css("display", "inline-block");
                    // display error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    let tooltip = $('#checkout-page').get(0).ej2_instances[tooltipIndex];
                    tooltip.content = "shipping method required";
                    tooltip.dataBind();
                    tooltip.open( $('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure')
                        .get(0));
                    // flag validation as failed
                    validationSuccessful = false;
                }
                else{ // shipping method has been set
                    $('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-success').
                    css("display", "inline-block");
                    $('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').
                    css("display", "none");
                    // hide error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    $('#checkout-page').get(0).ej2_instances[tooltipIndex].close();
                }

                // validate the payment method segment
                if(! $('#checkout-page #checkout-payment-method-type').get(0).ej2_instances[0].value){ // no shipping method
                    // signal that payment method validation failed
                    $('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-success').
                    css("display", "none");
                    $('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').
                    css("display", "inline-block");
                    // display error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    let tooltip = $('#checkout-page').get(0).ej2_instances[tooltipIndex];
                    tooltip.content = "payment method required";
                    tooltip.dataBind();
                    tooltip.open( $('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure')
                        .get(0));
                    // flag validation as failed
                    validationSuccessful = false;
                }
                else{ // payment method has been set
                    $('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-success').
                    css("display", "inline-block");
                    $('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').
                    css("display", "none");
                    // hide error tooltip for this segment
                    let tooltipIndex = $('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').
                    get(0)._utopiasoftware_validator_index;
                    $('#checkout-page').get(0).ej2_instances[tooltipIndex].close();
                }

                // check if the checkout order validation failed or succeeded
                if(validationSuccessful === true){ // validation was successful
                    resolve(); // resolve validation promise
                    return;
                }
                else{ // validation failed
                    reject(); // reject validation promise
                    return;
                }
            });
        },

        /**
         * method is a utility which is used to create a remote cart object on
         * the server using the order data provided.
         * Creating a remote cart can help with things like shipping calculations etc
         *
         * @param orderData
         * @returns {Promise<void>}
         */
        async createRemoteCartFromOrder(orderData = utopiasoftware[utopiasoftware_app_namespace].controller.
                                            checkoutPageViewModel.chekoutOrder){
            // create a local copy odf the order object
            orderData = JSON.parse(JSON.stringify(orderData));

            return new Promise(async function(resolve, reject){
                try{

                    // load the user profile details from the app database
                    var userDetails = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("user-details",
                        utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase)).userDetails;

                    // clear the current user cart
                    await Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v2/cart/clear`,
                            type: "post",
                            contentType: "application/json",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("Authorization", "Basic " +
                                    Base64.encode(`${userDetails.email}:${userDetails.password}`));
                            },
                            crossDomain: true,
                            xhrFields: {
                                withCredentials: true
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    ));

                    // create a loop to add all the line items in the order data to the remote cache
                    let addToCartPromises = []; // holds all the promises used to add all items to the remote cart
                    for(let index = 0; index < orderData.line_items.length; index++){
                        console.log("1");
                        let cartItemData = {};
                        // use the line item meta data to create part of cartItemData
                        orderData.line_items[index].meta_data.forEach(function(metaDataElem){
                            console.log("2");
                            if(metaDataElem.key === "_fpd_data"){ // check the "key" property of the metaData object
                                console.log("3");
                                if(!cartItemData.cart_item_data){ // if this property is not created
                                    cartItemData.cart_item_data = {}; // create the property
                                }
                                console.log("4");
                                if(!cartItemData.cart_item_data.fpd_data){ // if this property is not created
                                    cartItemData.cart_item_data.fpd_data = {}; // create the property
                                }

                                console.log("5");
                                // add custom data to the cart item
                                cartItemData.cart_item_data.fpd_data.fpd_product = metaDataElem.value;
                                cartItemData.cart_item_data.fpd_data.fpd_product_price =
                                    ("" + orderData.line_items[index].price);
                            }

                            if(metaDataElem.key === "_fpd_print_order"){
                                if(!cartItemData.cart_item_data){ // if this property is not created
                                    cartItemData.cart_item_data = {}; // create the property
                                }
                                if(!cartItemData.cart_item_data.fpd_data){ // if this property is not created
                                    cartItemData.cart_item_data.fpd_data = {}; // create the property
                                }
                                console.log("6");
                                // add custom data to the cart item
                                cartItemData.cart_item_data.fpd_data.fpd_print_order = metaDataElem.value;
                            }
                        });

                        // add the other data for the cartItem
                        cartItemData.product_id = orderData.line_items[index].product_id;
                        cartItemData.variation_id = orderData.line_items[index].variation_id;
                        cartItemData.quantity = orderData.line_items[index].quantity;
                        console.log("7");

                        // add the created cartItemData to remote user cart
                        addToCartPromises.push(Promise.resolve($.ajax(
                            {
                                url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + `/wp-json/wc/v2/cart/add`,
                                type: "post",
                                contentType: "application/json",
                                beforeSend: function(jqxhr) {
                                    jqxhr.setRequestHeader("Authorization", "Basic " +
                                        Base64.encode(`${userDetails.email}:${userDetails.password}`));
                                },
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true
                                },
                                dataType: "json",
                                timeout: 240000, // wait for 4 minutes before timeout of request
                                processData: false,
                                data: JSON.stringify(cartItemData)
                            }
                        )));
                        console.log("8");
                    } // end of for loop

                    // await for all items to be added to cart
                    await Promise.all(addToCartPromises);
                    resolve(); // resolve the parent promise
                }
                finally{

                }

            });
        }

    }

};