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

            // create the ej2 toast component for the app
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

            }
            catch(err){
                console.log("APP LOADING ERROR", err);
            }
            finally{
                // set status bar color
                StatusBar.backgroundColorByHexString("#363E7C");
                navigator.splashscreen.hide(); // hide the splashscreen
                utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fully loaded and ready
            }

        }); // end of ons.ready()

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
                        $('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
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
                            // clear the timer
                            return;
                        }
                        // a cell was clicked, so load the product-details page
                        $('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
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
                            // clear the timer
                            return;
                        }
                        // a cell was clicked, so load the product-details page
                        $('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
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
            $('#app-main-page ons-toolbar div.title-bar').html("OAK");
            window.SoftInputMode.set('adjustPan');

            // listen for when the device does not have Internet connection
            document.addEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOfflineListener, false);
            // listen for when the device has Internet connection
            document.addEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOnlineListener, false);
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
                        console.log("LOAD PRODUCT", err);
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
                        if(productsArray.length > 0){
                            // save the retrieved data to app database as cache
                            utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                                {_id: "popular-products", docType: "POPULAR_PRODUCTS", products: productsArray},
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
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
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">
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
                        console.log("LOAD PRODUCT", err);
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
                        if(productsArray.length > 0){
                            // save the retrieved data to app database as cache
                            utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                                {_id: "sales-products", docType: "SALES_PRODUCTS", products: productsArray},
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
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
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">
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
                        console.log("LOAD PRODUCT", err);
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
                        console.log("LOAD PRODUCT", err);
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
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">
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
                        console.log("LOAD PRODUCT", err);
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
                                `<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;">
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
                        console.log("LOAD PRODUCT", err);
                        reject(); // reject the parent promise
                    });
                }));
            }

            return Promise.all(productTypesPromisesArray); // return a promise which resolves when all promises in the array resolve
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
                console.log("CONTENT HEIGHT", utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight);

                // listen for the scroll event on the page
                $('#categories-page .page__content').on("scroll", function(){
                    // handle the logic in a different event queue slot
                    window.setTimeout(function(){
                        // get the scrollTop position of the view content
                        var scrollTop = Math.floor($('#categories-page .page__content').scrollTop());
                        console.log("SCROLL TOP", scrollTop);
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
                            console.log("PRODUCTS PAGE", err);
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
                    console.log("CATEGORIES PAGE", err);
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
            toast.content = "No Internet connection. Connect to the Internet to see updated categories";
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
                        console.log("LOAD CATEGORY", err);
                        reject(err); // reject the parent promise with the error
                    });
                }));

            } // end of loading product categories with Internet Connection
            else{ // there is no internet connection
                // display toast to show that there is no internet connection
                let toast = $('.page-toast').get(0).ej2_instances[0];
                toast.hide('All');
                toast.cssClass = 'default-ej2-toast';
                toast.content = "No Internet connection. Pull down to refresh and see updated categories";
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
                        console.log("LOAD CATEGORY", err);
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
            /*for(let index = 0; index < 4; index++){ // REMOVE THIS LATER JUST FOR TEST TODO
                categoriesArray.push(...categoriesArray);
            }*/
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
                        <ons-ripple></ons-ripple>
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

                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            $('#app-main-page ons-toolbar div.title-bar').html("Search"); // update the title of the page

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

            // go to the "Categories" page (tab)
            $('#app-main-tabbar').get(0).setActiveTab(1);
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
                        console.log("CAROUSEL SCROLL");
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
        pageSize: 100,

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
                console.log("CONTENT HEIGHT", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.viewContentHeight);

                // listen for the scroll event on the page
                $('#products-page .page__content').on("scroll", function(){
                    // handle the logic in a different event queue slot
                    window.setTimeout(function(){
                        // get the scrollTop position of the view content
                        var scrollTop = Math.floor($('#products-page .page__content').scrollTop());
                        console.log("SCROLL TOP", scrollTop);
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
                    console.log("TAB CHANGED", utopiasoftware[utopiasoftware_app_namespace].controller.
                        productsPageViewModel.lastActiveNavTab);
                });

                // listen for when a product card is clicked
                $thisPage.on("click", ".e-card > *:not(.e-card-actions)", function(){
                    // load the product-details page
                    //$('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
                });

                try{

                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            $('#app-main-page ons-toolbar div.title-bar').html("Products"); // change the title of the screen
            // show the preloader
            $('#products-page .page-preloader').css("display", "block");
            // empty the content of the page
            $('#products-page #products-contents-container').html('');
            // hide the page scroll fab
            $('#products-page #products-page-scroll-top-fab').css({"display": "none"});

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
        pageHide: async function(){
            // remove listener for when the device does not have Internet connection
            document.removeEventListener("offline",
                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOfflineListener, false);
            // remove listener for when the device has Internet connection
            document.removeEventListener("online",
                utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOnlineListener, false);
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
            toast.content = "No Internet connection. Connect to the Internet to see updated categories";
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
                productsPageViewModel.loadProducts(1, utopiasoftware[utopiasoftware_app_namespace].
                    controller.productsPageViewModel.pageSize);
                await utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.displayPageContent(productArray[0]);
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
                $('#products-page #products-page-pull-hook').removeAttr("disabled");
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
                        }
                        resolve(productsArray); // resolve the parent promise with the data gotten from the server

                    }).catch(function(err){ // an error occurred
                        console.log("LOAD PRODUCTS", err);
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
                        console.log("LOAD PRODUCTS", err);
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
                        <ons-ripple></ons-ripple>
                        <div class="e-card">
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
                        text-overflow: ellipsis">
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
        }
    },

    /**
     * this is the view-model/controller for the Product Details page
     */
    productDetailsPageViewModel: {

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

                try{
                    let addToCartButton = new ej.buttons.Button({
                        iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
                        iconPosition: "Left"
                    });
                    addToCartButton.appendTo('#product-details-add-to-cart');

                    let customiseProductButton = new ej.buttons.Button({
                        iconCss: "zmdi zmdi-brush utopiasoftware-icon-zoom-one-point-two",
                        iconPosition: "Left"
                    });
                    customiseProductButton.appendTo('#product-details-customise-product');

                    let wishListButton = new ej.buttons.Button({
                        cssClass: 'e-outline e-small',
                        iconCss: "zmdi zmdi-favorite-outline",
                        iconPosition: "Left"
                    });
                    wishListButton.appendTo('#product-details-wish-list');

                    let compareButton = new ej.buttons.Button({
                        cssClass: 'e-outline e-small',
                        iconCss: "zmdi zmdi-utopiasoftware-icon-scale-balance",
                        iconPosition: "Left"
                    });
                    compareButton.appendTo('#product-details-compare');

                    let reviewButton = new ej.buttons.Button({
                        cssClass: 'e-outline e-small',
                        iconCss: "zmdi zmdi-star-outline",
                        iconPosition: "Left"
                    });
                    reviewButton.appendTo('#product-details-review');

                    let shareButton = new ej.buttons.Button({
                        cssClass: 'e-outline e-small',
                        iconCss: "zmdi zmdi-share",
                        iconPosition: "Left"
                    });
                    shareButton.appendTo('#product-details-share');
                }
                catch(err){}
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
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

            // get back to the previous page on the app-main navigator stack
            $('#app-main-navigator').get(0).popPage();
        }
    }
};