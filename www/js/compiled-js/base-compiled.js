"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

  accessor: "ZGV2ZWxvcGVyQHNob3BvYWtleGNsdXNpdmUuY29tOk9ha0RldmVsb3BlckAx",

  /**
   * object is responsible for handling database operations for the app
   */
  databaseOperations: {

    /**
     * method loads the data from the specified app database
     *
     * @param docId {String}
     * @param database {Object}
     *
     * @returns {Promise<void>}
     */
    loadData: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(docId, database) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return database.get(docId);

              case 3:
                return _context.abrupt("return", _context.sent);

              case 4:
                _context.prev = 4;
                return _context.finish(4);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0,, 4, 6]]);
      }));

      function loadData(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return loadData;
    }(),


    /**
     * method is used to save the data into the specified database
     *
     * @param saveData
     * @param database
     *
     * @returns {Promise<void>}
     */
    saveData: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_saveData, database) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.prev = 1;
                _context2.next = 4;
                return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData(_saveData._id, database);

              case 4:
                _saveData._rev = _context2.sent._rev;
                _context2.next = 9;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](1);

              case 9:
                _context2.next = 11;
                return database.put(_saveData);

              case 11:
                return _context2.abrupt("return", _context2.sent);

              case 12:
                _context2.prev = 12;
                return _context2.finish(12);

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0,, 12, 14], [1, 7]]);
      }));

      function saveData(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return saveData;
    }()
  }
});

//# sourceMappingURL=base-compiled.js.map