/**
 * Created by UTOPIA SOFTWARE on 18/11/2018.
 */

// define the model namespace
utopiasoftware[utopiasoftware_app_namespace].model = {

    /**
     * property acts as a flag that indicates that all hybrid plugins and DOM content
     * have been successfully loaded. It relies on the ons.ready() method
     *
     * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
     */
    isAppReady: false,

    /**
     * holds the pouchDB database used by the app
     */
    appDatabase: null,

    /**
     * holds the encrypted pouchDB database used by the app
     */
    encryptedAppDatabase: null,

    /**
     * holds the base url which the app will use to connect to the app server and make requests
     */
    appBaseUrl: "https://shopoakexclusive.com",


};

// call the method to startup the app
utopiasoftware[utopiasoftware_app_namespace].controller.startup();

// listen for the initialisation of the HOME page
$(document).on("init", "#home-page", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.pageInit);

// listen for when the HOME page is shown
$(document).on("show", "#home-page", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.pageShow);

// listen for when the HOME page is hidden
$(document).on("hide", "#home-page", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.pageHide);

// listen for when the HOME page is destroyed
$(document).on("destroy", "#home-page", utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.pageDestroy);

// listen for the initialisation of the ACCOUNT page
$(document).on("init", "#account-page", utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.pageInit);

// listen for when the ACCOUNT page is shown
$(document).on("show", "#account-page", utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.pageShow);

// listen for when the ACCOUNT page is hidden
$(document).on("hide", "#account-page", utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.pageHide);

// listen for when the ACCOUNT page is destroyed
$(document).on("destroy", "#account-page", utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.pageDestroy);

// listen for the initialisation of the LOGIN page
$(document).on("init", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageInit);

// listen for when the LOGIN page is shown
$(document).on("show", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageShow);

// listen for when the LOGIN page is hidden
$(document).on("hide", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageHide);

// listen for when the LOGIN page is destroyed
$(document).on("destroy", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageDestroy);

// listen for the initialisation of the PRODUCTS page
$(document).on("init", "#products-page", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageInit);

// listen for when the PRODUCTS page is shown
$(document).on("show", "#products-page", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageShow);

// listen for when the PRODUCTS page is hidden
$(document).on("hide", "#products-page", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageHide);

// listen for when the PRODUCTS page is destroyed
$(document).on("destroy", "#products-page", utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageDestroy);

// listen for the initialisation of the PRODUCT DETAILS page
$(document).on("init", "#product-details-page", utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.pageInit);

// listen for when the PRODUCT DETAILS page is shown
$(document).on("show", "#product-details-page", utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.pageShow);

// listen for when the PRODUCT DETAILS page is hidden
$(document).on("hide", "#product-details-page", utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.pageHide);

// listen for when the PRODUCT DETAILS page is destroyed
$(document).on("destroy", "#product-details-page", utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.pageDestroy);