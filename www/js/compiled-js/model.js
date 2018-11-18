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
    appDatabase: null


};

// call the method to startup the app
utopiasoftware[utopiasoftware_app_namespace].controller.startup();
