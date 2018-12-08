"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by UTOPIA SOFTWARE on 18/11/2018.
 */

/**
 * file provides the "base" framework/utilities required to launch the app.
 * E.g. - File creates the base namespace which the app is built on.
 * - Loads all the ES module libraries required etc
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 **/

// constant that defines the app namespace
var utopiasoftware_app_namespace = 'print_service_ecommerce';

/**
 * create the namespace and base methods and properties for the app
 * @type {{}}
 */
var utopiasoftware = _defineProperty({}, utopiasoftware_app_namespace, {

  /**
   * holds the randomisation engine used by Random.Js
   */
  randomisationEngine: Random.engines.browserCrypto,

  accessor: "ZGV2ZWxvcGVyQHNob3BvYWtleGNsdXNpdmUuY29tOk9ha0RldmVsb3BlckAx"
});

//# sourceMappingURL=base-compiled.js.map