"use strict";

/**
 * method is used to handle the receipt of messages from the mobile app
 *
 * @param receiveEvent {Event} this is the event object of the "Message" event
 *
 * @returns {Promise<void>}
 */
var utopiasoftware_receiveMessage = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(receiveEvent) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function utopiasoftware_receiveMessage(_x) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// register a listener for receiving messages from the mobile app
window.addEventListener("message", utopiasoftware_receiveMessage, false);

// wait for the entire document to be loaded
jQuery(document).ready(function () {

    // check if the site is being accessed from an iframe
    if (window !== window.parent) {
        // page is being accessed from an iframe
        // add the utopiasoftware-mobile class to the HTML tag
        jQuery('html').addClass("utopiasoftware-mobile");
    }

    // check if the utopiasoftware-mobile class is set
    if (jQuery('html').hasClass('utopiasoftware-mobile') === true) {
        // class has been set
        // post message to app that site is loaded
        window.parent.postMessage("page ready", "*");
        return;
    }
});

//# sourceMappingURL=product-customisation-compiled.js.map