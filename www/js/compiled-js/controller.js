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

                    // create the ej2 toast component
                    new ej.notifications.Toast({
                        content: '',
                        cssClass: 'default-ej2-toast',
                        target: document.body,
                        position: {X: "Center",  Y: "Bottom"},
                        width: "100%",
                        timeOut: 0,
                        extendedTimeout: 0,
                        showCloseButton: true
                    }).appendTo($('#home-page .page-toast').get(0));


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
                }
                finally {
                }
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
            // destroy the ej2 toast component
            $('#home-page .page-toast').get(0).ej2_instances[0].destroy();
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
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // disable pull-to-refresh widget till loading is done
            $('#home-page #home-page-pull-hook').attr("disabled", true);
            // hide all previously displayed ej2 toast
            $('#home-page .page-toast').get(0).ej2_instances[0].hide('All');

            try{
                await utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.loadProducts();
            }
            catch(err){ // an error occurred
                // display toast to show that an error
                let toast = $('#home-page .page-toast').get(0).ej2_instances[0];
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
                // load latest products
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
                            "stock_status": "instock", "page": 1, "per_page": 5}
                        }
                    )).then(function(productsArray){
                        // save the retrieved data to app database as cache
                        utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                            {_id: "latest-products", docType: "LATEST_PRODUCTS", products: productsArray},
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                        $('#home-page #home-latest-design-block').css("opacity", "1"); // hide the "Products" segment
                        // remove the previously slides from the carousel
                        utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            newProductsCarousel.
                        remove($('#home-page #home-latest-design-block .row .col-xs-5').get());
                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">
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
                                "stock_status": "instock", "page": 1, "per_page": 5, "featured": true}
                        }
                    )).then(function(productsArray){
                        if(productsArray.length > 0){
                            // save the retrieved data to app database as cache
                            utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData(
                                {_id: "featured-products", docType: "FEATURED_PRODUCTS", products: productsArray},
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                            // show the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "1", "display": "block"});
                            // remove the previously slides from the carousel
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            featuredProductsCarousel.
                            remove($('#home-page #home-featured-design-block .row .col-xs-5').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">
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
                                "stock_status": "instock", "page": 1, "per_page": 5, "on_sale": true}
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
                            remove($('#home-page #home-sales-design-block .row .col-xs-5').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-sales-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">
                                    <div class="e-card" style="min-height: 34vh;">
                                        <div class="e-card-image" style="height: 60%; 
                                        background-image: url('${productsArray[index].images[0].src}');">
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
                                                <div class="e-card-sub-title" style="text-align: center;">
                                                    <span class="e-badge e-badge-danger" style="background-color: transparent; color: #d64113;
                                                    border: 1px #d64113 solid; font-size: 1em;">
                                                    ${Math.ceil((Math.abs(kendo.parseFloat(productsArray[index].price) - 
                                                    kendo.parseFloat(productsArray[index].regular_price)) / 
                                                    kendo.parseFloat(productsArray[index].regular_price)) * 100)}% OFF
                                                    </span>
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
                let toast = $('#home-page .page-toast').get(0).ej2_instances[0];
                toast.cssClass = 'default-ej2-toast';
                toast.content = "No Internet connection. Pull down to refresh and see live products";
                toast.dataBind();
                toast.show();
                // load latest products from cached data
                productTypesPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.
                    loadData("latest-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).
                    then(function(cachedProductsData){
                        return cachedProductsData.products;
                    }).
                    then(function(productsArray){
                        $('#home-page #home-latest-design-block').css("opacity", "1"); // hide the "Products" segment
                        // remove the previously slides from the carousel
                        utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                        newProductsCarousel.
                        remove($('#home-page #home-latest-design-block .row .col-xs-5').get());
                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">
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
                    loadData("featured-products", utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).
                    then(function(cachedProductsData){
                        return cachedProductsData.products;
                    }).then(function(productsArray){
                        if(productsArray.length > 0){
                            // show the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "1", "display": "block"});
                            // remove the previously slides from the carousel
                            utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.
                            featuredProductsCarousel.
                            remove($('#home-page #home-featured-design-block .row .col-xs-5').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-featured-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">
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
                            remove($('#home-page #home-sales-design-block .row .col-xs-5').get());
                        }
                        else{
                            // hide the "Products" segment
                            $('#home-page #home-sales-design-block').css({"opacity": "0", "display": "none"});
                        }

                        // attach the products to the page
                        for(let index = 0; index < productsArray.length; index++){
                            let columnContent =
                                `<div class="col-xs-5" style="padding-left: 0.5em; padding-right: 0.5em;">
                                    <div class="e-card" style="min-height: 34vh;">
                                        <div class="e-card-image" style="height: 60%; 
                                        background-image: url('${productsArray[index].images[0].src}');">
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
                                                <div class="e-card-sub-title" style="text-align: center;">
                                                    <span class="e-badge e-badge-danger" style="background-color: transparent; color: #d64113;
                                                    border: 1px #d64113 solid; font-size: 1em;">
                                                    ${Math.ceil((Math.abs(kendo.parseFloat(productsArray[index].price) -
                                    kendo.parseFloat(productsArray[index].regular_price)) /
                                    kendo.parseFloat(productsArray[index].regular_price)) * 100)}% OFF
                                                    </span>
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

                // listen for when the "product-layout" segment is clicked
                $('#products-page #products-layout-segment').on("postchange", function(postChangeEvent){
                    
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
                $thisPage.on("click", ".e-card > *:not(.e-card-actions)", function(){
                    // load the product-details page
                    $('#app-main-navigator').get(0).pushPage("product-details-page.html", {animation: "lift"});
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