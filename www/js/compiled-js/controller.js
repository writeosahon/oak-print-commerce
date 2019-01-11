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
            }).appendTo('#delete-cart-item-yes');

            // create the "No" button on the the Delete Cart Item action sheet
            new ej.buttons.Button({
                cssClass: 'e-flat e-small',
                iconPosition: "Left"
            }).appendTo('#delete-cart-item-no');


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
                        // a cell was clicked, so load the product-details page
                        //  $('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
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
                                        <img src="${productsArray[index].images[0].src}" style="width: 100%; height: auto; max-height: 90vh">
                                        </div>
                                    </div>
                                </div>`;
                            // append the content
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            newProductsCarousel.append($(columnContent));
                        }
                        $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                        resolve(); // resolve the parent promise
                    }).catch(function(err){

                        $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
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
                        $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
                        resolve(); // resolve the parent promise
                    }).catch(function(err){

                        $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
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
                    let accordion = new ej.navigations.Accordion({
                        expandMode: 'Single'
                    });
                    accordion.appendTo('#account-personal-accordion');
                    accordion.expandItem(true, 0);
                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            $('#app-main-page ons-toolbar div.title-bar').html("Account"); // update the title of the page
            // update cart count
            $('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);

            window.SoftInputMode.set('adjustPan');
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
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){
            // go to the "Home" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(2);
        },
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

                // initialise the login form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator =
                    $('#login-page #signup-form').parsley();

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

                // listen for log in form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidated);


                // listen for scroll event on the page to adjust the tooltips when page scrolls
                $('#login-page .login-page-form-container',).on("scroll", function(){

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

                                case 2:

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

            // reset all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.reset();
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.reset();
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

            // destroy all form validator objects
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.destroy();
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.destroy();

        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){

            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
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

                    // hide the tooltips on the login form
                    $('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){
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
         * method is triggered when the login form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async loginFormValidated(){

        },

        /**
         * method is triggered when the sign up form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async signupFormValidated(){

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
        currentQueryParam: {},

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
            for(let index = 0; index < 4; index++){ // REMOVE THIS LATER JUST FOR TEST TODO
                productsArray.push(...productsArray);
            }
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
            // reset the customisation page load count
            utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.customisationPageLoadCount = 0;
            // reset the cartsQueue
            utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.cartsQueue = [];

            // remove listener for listening to messages from the parent site
            window.removeEventListener("message", utopiasoftware[utopiasoftware_app_namespace].controller.
                customiseProductPageViewModel.receiveMessageListener, false);
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

            // disable pull-to-refresh widget till loading is done
            $('#customise-product-page #customise-product-page-pull-hook').attr("disabled", true);
            // hide all previously displayed ej2 toast
            $('.page-toast').get(0).ej2_instances[0].hide('All');

            try{
                // reload the current product customisation url into the iframe
                await utopiasoftware[utopiasoftware_app_namespace].controller.
               customiseProductPageViewModel.loadProductCustomisation();
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
         * @returns {Promise<void>}
         */
        async loadProductCustomisation(customisationUrl = utopiasoftware[utopiasoftware_app_namespace].
            controller.customiseProductPageViewModel.currentCustomisationUrl){

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

            // load the specified url into the customisation iframe
            $('#customise-product-page #customise-product-page-iframe').attr("src", customisationUrl);

            // update the current customisation url
            utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.
                currentCustomisationUrl = customisationUrl;

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
            // get the previous cart object and the new/updated cart object
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

                    let localCart = []; // holds the local cart collection
                    let utopiasoftwareCartObject = {cartData: {}}; // holds the object whose properties make up the cart item

                    // get the cached user cart
                    try{
                        localCart = (await utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).cart;
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

                // create all the "Remove" buttons required for the View Cart page
                $("#view-cart-page .view-cart-remove-button").each(function(index, element){
                    // destroy the "Remove" button
                    element.ej2_instances[0].destroy();
                });

                // create all the "Quantity" input required for the View Cart page
                $("#view-cart-page .view-cart-quantity-input").each(function(index, element){
                    // destroy the "Quantity" input
                    element.ej2_instances[0].destroy();
                });

                // display the contents of the cart using a for-loop
                for(let index = 0; index < localCart.length; index++){
                    displayContent +=
                        `<div class="col-xs-12" style="border-bottom: 1px lightgray solid">
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
                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;"></button>
                            </div>
                            <div class="col-xs-4">
                                <button type="button" class="view-cart-remove-button"
                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" 
                                        onclick="document.getElementById('delete-cart-item-action-sheet').show();"></button>
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
                                        onclick="document.getElementById('delete-cart-item-action-sheet').show();"></button>
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
                                        onclick="document.getElementById('delete-cart-item-action-sheet').show();"></button>
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
         * method is a utility function used to view/load and display the user's cart
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
        }
    }
};