'use strict';var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}function _asyncToGenerator(fn){return function(){var gen=fn.apply(this,arguments);return new Promise(function(resolve,reject){function step(key,arg){try{var info=gen[key](arg);var value=info.value;}catch(error){reject(error);return;}if(info.done){resolve(value);}else{return Promise.resolve(value).then(function(value){step("next",value);},function(err){step("throw",err);});}}return step("next");});};}/**
 * Created by UTOPIA SOFTWARE on 18/11/2018.
 *//**
* file defines all View-Models, Controllers and Event Listeners used by the app
*
* The 'utopiasoftware_app_namespace' namespace variable has being defined in the base js file.
* The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
* also used interchangeably
*/// define the controller namespace
utopiasoftware[utopiasoftware_app_namespace].controller={/**
     * method contains the startup/bootstrap code needed to initiate app logic execution
     */startup:function startup(){// initialise the app libraries and plugins
ons.ready(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee2(){var secureKey;return regeneratorRuntime.wrap(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:// set the default handler for the app
ons.setDefaultDeviceBackButtonListener(function(){// does nothing for now!!
});// disable the default back button handler for the 'search-page-search-input-popover'
$('#search-page-search-input-popover').get(0).onDeviceBackButton.disable();// set the device back button handler for the 'third-party-login-modal' modal AND the close button
$('#third-party-login-modal').get(0).onDeviceBackButton=$('#third-party-login-modal #third-party-login-modal-close-button').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee(){return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return $('#third-party-login-modal').get(0).hide();case 2:// reset the Firebase UI object
utopiasoftware[utopiasoftware_app_namespace].model.firebaseUI.reset();case 3:case'end':return _context.stop();}}},_callee,this);}));// displaying prepping message
$('#loader-modal-message').html("Loading App...");$('#loader-modal').get(0).show();// show loader
// create the ej2 bottom toast component for the app
new ej.notifications.Toast({content:'',cssClass:'default-ej2-toast',target:document.body,position:{X:"Center",Y:"Bottom"},width:"100%",timeOut:0,extendedTimeout:0,showCloseButton:true}).appendTo($('.page-toast').get(0));// create the ej2 "timed" bottom toast component for the app
new ej.notifications.Toast({content:'',cssClass:'default-ej2-toast',target:document.body,position:{X:"Center",Y:"Bottom"},width:"100%",timeOut:4000,// default 4 sec
extendedTimeout:0,showCloseButton:true}).appendTo($('.timed-page-toast').get(0));// create the "Yes" button on the the Delete Cart Item action sheet
new ej.buttons.Button({cssClass:'e-flat e-small',iconPosition:"Left"}).appendTo('#view-cart-page-delete-cart-item-yes');// create the "No" button on the the Delete Cart Item action sheet
new ej.buttons.Button({cssClass:'e-flat e-small',iconPosition:"Left"}).appendTo('#view-cart-page-delete-cart-item-no');// create the "Yes" button on the Cancel Order action sheet
new ej.buttons.Button({cssClass:'e-flat e-small',iconPosition:"Left"}).appendTo('#cancel-order-yes');// create the "No" button on the Cancel Order action sheet
new ej.buttons.Button({cssClass:'e-flat e-small',iconPosition:"Left"}).appendTo('#cancel-order-no');//initialise the firebase app.
utopiasoftware[utopiasoftware_app_namespace].model.firebaseApp=firebase.initializeApp({apiKey:"AIzaSyAx5tpRlU79yPXiNWFhxyNfAbCtuoIddIA",authDomain:"oak-exclusive.firebaseapp.com",databaseURL:"https://oak-exclusive.firebaseio.com",projectId:"oak-exclusive",storageBucket:"oak-exclusive.appspot.com",messagingSenderId:"492676682141"});// initialise the firebase ui app
utopiasoftware[utopiasoftware_app_namespace].model.firebaseUI=new firebaseui.auth.AuthUI(utopiasoftware[utopiasoftware_app_namespace].model.firebaseApp.auth());// START ALL CORDOVA PLUGINS CONFIGURATIONS
try{// lock the orientation of the device to 'PORTRAIT'
screen.orientation.lock('portrait');}catch(err){}_context2.prev=14;// START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX
universalLinks.subscribe(null,function(eventData){console.log("UNIVERSAL LINK",eventData.url);});// create the pouchdb app database
utopiasoftware[utopiasoftware_app_namespace].model.appDatabase=new PouchDB('PrintServiceEcommerce.db',{adapter:'cordova-sqlite',location:'default',androidDatabaseImplementation:2});// create the encrypted pouchdb app database
utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase=new PouchDB('PrintServiceEcommerceEncrypted.db',{adapter:'cordova-sqlite',location:'default',androidDatabaseImplementation:2});// generate a password for encrypting the app database (if it does NOT already exist)
secureKey=null;_context2.prev=19;_context2.next=22;return new Promise(function(resolve,reject){NativeStorage.getItem("utopiasoftware-oak-print-service-secure-key",resolve,reject);});case 22:secureKey=_context2.sent;_context2.next=30;break;case 25:_context2.prev=25;_context2.t0=_context2['catch'](19);_context2.next=29;return new Promise(function(resolve,reject){NativeStorage.setItem("utopiasoftware-oak-print-service-secure-key",{password:Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine)},resolve,reject);});case 29:secureKey=_context2.sent;case 30:_context2.next=32;return new Promise(function(resolve,reject){utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase.crypto(secureKey.password,{ignore:['_attachments','_deleted','docType'],cb:function cb(err,key){if(err){// there is an error
reject(err);// reject Promise
}else{// no error
resolve(key);// resolve Promise
}}});});case 32:_context2.prev=32;_context2.next=35;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 35:utopiasoftware[utopiasoftware_app_namespace].model.cartCount=_context2.sent.cart.length;_context2.next=40;break;case 38:_context2.prev=38;_context2.t1=_context2['catch'](32);case 40://register the listener for app database changes
utopiasoftware[utopiasoftware_app_namespace].controller.appDatabaseChangesListenerViewModel.changesEventEmitter=utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.changes({live:true,include_docs:true,since:'now',doc_ids:['user-cart']}).on("change",utopiasoftware[utopiasoftware_app_namespace].controller.appDatabaseChangesListenerViewModel.userCartChanged);_context2.next=46;break;case 43:_context2.prev=43;_context2.t2=_context2['catch'](14);console.log("APP LOADING ERROR",_context2.t2);case 46:_context2.prev=46;// load the initial content of the app
if(true){// there is a previous logged in user
// load the app main page
$('ons-splitter').get(0).content.load("app-main-template");}else{// there is no previously logged in user
// load the login page
$('ons-splitter').get(0).content.load("login-template");}// set status bar color
StatusBar.backgroundColorByHexString("#363E7C");navigator.splashscreen.hide();// hide the splashscreen
utopiasoftware[utopiasoftware_app_namespace].model.isAppReady=true;// flag that app is fully loaded and ready
return _context2.finish(46);case 52:case'end':return _context2.stop();}}},_callee2,this,[[14,43,46,52],[19,25],[32,38]]);})));// end of ons.ready()
},/**
     * this view-model is used to house the listeners and data/properties which listen for
     * changes in the app database
     */appDatabaseChangesListenerViewModel:{/**
         * property holds the Event Emitter object for the changes taking
         * place in the database. This object can be used to cancel event listening at
         * any time
         */changesEventEmitter:null,/**
         * methosd is used to listen for changes to the
         * user-cart document i.e. when the local cached user cart is updated/modified
         *
         * @param changesInfo {Object} holds the object containing the changes made to the user cart
         *
         * @returns {Promise<void>}
         */userCartChanged:function(){var _ref3=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee3(changesInfo){return regeneratorRuntime.wrap(function _callee3$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:if(changesInfo.deleted===true){// the user local cart was deleted
// reset the cartCount app model property to zero
utopiasoftware[utopiasoftware_app_namespace].model.cartCount=0;}else{// the user local cart was modified/updated
// update the cartCount app model property to indicate the number of items in cart (using the updated cart length)
utopiasoftware[utopiasoftware_app_namespace].model.cartCount=changesInfo.doc.cart.length;}// update the cart count being displayed on all current pages
$('.cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);case 2:case'end':return _context3.stop();}}},_callee3,this);}));function userCartChanged(_x){return _ref3.apply(this,arguments);}return userCartChanged;}()},/**
     * this is the view-model/controller for the Home page
     */homePageViewModel:{/**
         * object is used as the carousel Flickity object for "New Products"/ Banner Ads
         */newProductsCarousel:null,/**
         * object is used as the carousel Flickity object for "Featured / Popular Products"
         */featuredProductsCarousel:null,/**
         * object is used as the carousel Flickity object for "Sales Products"
         */salesProductsCarousel:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref4=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee4(){var newProductsCarousel,featuredProductsCarousel,salesProductsCarousel,toast;return regeneratorRuntime.wrap(function _callee4$(_context4){while(1){switch(_context4.prev=_context4.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context4.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context4.abrupt('return');case 3:// listen for the back button event
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#home-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#home-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#home-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#home-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#home-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});_context4.prev=6;// create the "New Products" carousel
newProductsCarousel=new Flickity($('#home-page #home-latest-design-block .row').get(0),{// options
wrapAround:true,groupCells:1,// adaptiveHeight: true,
imagesLoaded:true,cellSelector:'.col-xs-12',autoPlay:5000,pauseAutoPlayOnHover:false,dragThreshold:10,initialIndex:0,cellAlign:'left',contain:false,prevNextButtons:false,pageDots:false});newProductsCarousel.on("scroll",function(){// check if the carousel object has a timer attached
if(newProductsCarousel._utopiasoftware_scrollTimer){// there is a timer
// clear the timer
window.clearTimeout(newProductsCarousel._utopiasoftware_scrollTimer);newProductsCarousel._utopiasoftware_scrollTimer=null;}// automatically start the the carousel autoplay
newProductsCarousel._utopiasoftware_scrollTimer=window.setTimeout(function(){newProductsCarousel.playPlayer();// start carousel autoplay
},0);});newProductsCarousel.on("staticClick",function(event,pointer,cellElement,cellIndex){// check if it was a cell that was clicked
if(!cellElement){// it was not a slider cell that was clicked
// do nothing
return;}});// assign the "New Product" carousel to the appropriate object
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel=newProductsCarousel;// create the "Featured Products" carousel
featuredProductsCarousel=new Flickity($('#home-page #home-featured-design-block .row').get(0),{// options
wrapAround:true,groupCells:1,cellSelector:'.col-xs-7',autoPlay:4000,pauseAutoPlayOnHover:false,dragThreshold:10,initialIndex:0,cellAlign:'center',contain:false,prevNextButtons:false,pageDots:false});featuredProductsCarousel.on("scroll",function(){// check if the carousel object has a timer attached
if(featuredProductsCarousel._utopiasoftware_scrollTimer){// there is a timer
// clear the timer
window.clearTimeout(featuredProductsCarousel._utopiasoftware_scrollTimer);featuredProductsCarousel._utopiasoftware_scrollTimer=null;}// automatically start the the carousel autoplay
featuredProductsCarousel._utopiasoftware_scrollTimer=window.setTimeout(function(){featuredProductsCarousel.playPlayer();// start carousel autoplay
},0);});featuredProductsCarousel.on("staticClick",function(event,pointer,cellElement,cellIndex){// check if it was a cell that was clicked
if(!cellElement){// it was not a slider cell that was clicked
// do nothing
return;}// call the method to load the product details page based on the product item clicked
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.productItemClicked(window.parseInt($(cellElement).attr('data-product')),$(cellElement).attr('data-segment'));});// assign the "Featured Products" carousel to the appropriate object
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel=featuredProductsCarousel;salesProductsCarousel=new Flickity($('#home-page #home-sales-design-block .row').get(0),{// options
wrapAround:true,groupCells:1,cellSelector:'.col-xs-7',autoPlay:4500,pauseAutoPlayOnHover:false,dragThreshold:10,initialIndex:0,cellAlign:'center',contain:false,prevNextButtons:false,pageDots:false});salesProductsCarousel.on("scroll",function(){// check if the carousel object has a timer attached
if(salesProductsCarousel._utopiasoftware_scrollTimer){// there is a timer
// clear the timer
window.clearTimeout(salesProductsCarousel._utopiasoftware_scrollTimer);salesProductsCarousel._utopiasoftware_scrollTimer=null;}// automatically start the the carousel autoplay
salesProductsCarousel._utopiasoftware_scrollTimer=window.setTimeout(function(){salesProductsCarousel.playPlayer();// start carousel autoplay
},0);});salesProductsCarousel.on("staticClick",function(event,pointer,cellElement,cellIndex){// check if it was a cell that was clicked
if(!cellElement){// it was not a slider cell that was clicked
// do nothing
return;}// call the method to load the product details page based on the product item clicked
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.productItemClicked(window.parseInt($(cellElement).attr('data-product')),$(cellElement).attr('data-segment'));});// assign the "Sales Products" carousel to the appropriate object
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel=salesProductsCarousel;$('#loader-modal').get(0).hide();// show loader
// display page preloader
$('#home-page .page-preloader').css("display","block");// start loading the page content
_context4.next=23;return utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.loadProducts();case 23:// hide the preloader
$('#home-page .page-preloader').css("display","none");_context4.next=35;break;case 26:_context4.prev=26;_context4.t0=_context4['catch'](6);console.log("HOME PAGE ERROR",_context4.t0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 35:_context4.prev=35;return _context4.finish(35);case 37:case'end':return _context4.stop();}}},_callee4,this,[[6,26,35,37]]);}));return function loadPageOnAppReady(){return _ref4.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// update page title
$('#app-main-page ons-toolbar div.title-bar').html("OAK");// update cart count
$('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustPan');// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOnlineListener,false);if(utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel){utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.reloadCells();}if(utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel){utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.reloadCells();}if(utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel){utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.reloadCells();}},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref5=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee5(){return regeneratorRuntime.wrap(function _callee5$(_context5){while(1){switch(_context5.prev=_context5.next){case 0:// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.deviceOnlineListener,false);case 2:case'end':return _context5.stop();}}},_callee5,this);}));function pageHide(){return _ref5.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the carousels
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.destroy();utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel=null;utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.destroy();utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel=null;utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.destroy();utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel=null;},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){ons.notification.confirm('Do you want to close the app?',{title:'<img src="css/app-images/oak-design-logo.png" style="height: 1.5em; width: auto; margin-right: 0.5em">Exit App',buttonLabels:['No','Yes'],modifier:'utopiasoftware-alert-dialog utopiasoftware-oak-alert-dialog'})// Ask for confirmation
.then(function(index){if(index===1){// OK button
navigator.app.exitApp();// Close the app
}});},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');// hide all previously displayed ej2 toast
toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to see live products";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref6=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee6(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var toast;return regeneratorRuntime.wrap(function _callee6$(_context6){while(1){switch(_context6.prev=_context6.next){case 0:// disable pull-to-refresh widget till loading is done
$('#home-page #home-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');_context6.prev=2;_context6.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.loadProducts();case 5:// hide the preloader
$('#home-page .page-preloader').css("display","none");_context6.next=16;break;case 8:_context6.prev=8;_context6.t0=_context6['catch'](2);// an error occurred
// display toast to show that error
toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');toast.cssClass='error-ej2-toast';toast.content="Sorry, an error occurred. Refresh to try again";toast.dataBind();toast.show();case 16:_context6.prev=16;// enable pull-to-refresh widget till loading is done
$('#home-page #home-page-pull-hook').removeAttr("disabled");// signal that loading is done
doneCallBack();return _context6.finish(16);case 20:case'end':return _context6.stop();}}},_callee6,this,[[2,8,16,20]]);}));function pagePullHookAction(){return _ref6.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is used to load all products to the page
         *
         * @returns {Promise<void>}
         */loadProducts:function(){var _ref7=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee7(){var productTypesPromisesArray,toast;return regeneratorRuntime.wrap(function _callee7$(_context7){while(1){switch(_context7.prev=_context7.next){case 0:productTypesPromisesArray=[];// holds the array for all the promises of the product types to be loaded
// check if there is internet connection or not
if(navigator.connection.type!==Connection.NONE){// there is internet connection
// load banner products
productTypesPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/products",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{"order":"desc","orderby":"date","status":"private","type":"external","page":1,"per_page":5}})).then(function(productsArray){// save the retrieved data to app database as cache
utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"banner-products",docType:"BANNER_PRODUCTS",products:productsArray},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);if(productsArray.length>0){// show the "Products" segment
$('#home-page #home-latest-design-block').css({"opacity":"1","display":"block"});// show the "Products" segment
// remove the previously slides from the carousel
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.remove($('#home-page #home-latest-design-block .row .col-xs-12').get());}else{// hide the "Products" segment
$('#home-page #home-latest-design-block').css({"opacity":"0","display":"none"});}// attach the products to the page
for(var index=0;index<productsArray.length;index++){var columnContent='<div class="col-xs-12" style="padding-left: 0; padding-right: 0;">\n                                    <div class="e-card" style="min-height: 40vh; max-height: 90vh">\n                                        <div class="e-card-image" style="">\n                                        <img src="'+productsArray[index].images[0].src+'" style="width: 100%; height: auto; max-height: 90vh">\n                                        </div>\n                                    </div>\n                                </div>';// append the content
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.append($(columnContent));}resolve();// resolve the parent promise
}).catch(function(err){reject();// reject the parent promise
});}));// load featured products
productTypesPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/products",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{"order":"desc","orderby":"date","status":"publish","type":"variable","stock_status":"instock","page":1,"per_page":5,"featured":true}})).then(function(productsArray){// save the retrieved data to app database as cache
utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"popular-products",docType:"POPULAR_PRODUCTS",products:productsArray},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);if(productsArray.length>0){// show the "Products" segment
$('#home-page #home-featured-design-block').css({"opacity":"1","display":"block"});// remove the previously slides from the carousel
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.remove($('#home-page #home-featured-design-block .row .col-xs-7').get());}else{// hide the "Products" segment
$('#home-page #home-featured-design-block').css({"opacity":"0","display":"none"});}// attach the products to the page
for(var index=0;index<productsArray.length;index++){var columnContent='<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" \n                                 data-product="'+index+'" data-segment="featured">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\''+productsArray[index].images[0].src+'\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    '+productsArray[index].name+'\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].price),"n2")+'</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';// append the content
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.append($(columnContent));}resolve();// resolve the parent promise
}).catch(function(err){reject();// reject the parent promise
});}));// load sales products
productTypesPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/products",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{"order":"desc","orderby":"date","status":"publish","type":"variable","stock_status":"instock","page":1,"per_page":5,"on_sale":true}})).then(function(productsArray){// save the retrieved data to app database as cache
utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"sales-products",docType:"SALES_PRODUCTS",products:productsArray},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);if(productsArray.length>0){// show the "Products" segment
$('#home-page #home-sales-design-block').css({"opacity":"1","display":"block"});// remove the previously slides from the carousel
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.remove($('#home-page #home-sales-design-block .row .col-xs-7').get());}else{// hide the "Products" segment
$('#home-page #home-sales-design-block').css({"opacity":"0","display":"none"});}// attach the products to the page
for(var index=0;index<productsArray.length;index++){if(!productsArray[index].regular_price||productsArray[index].regular_price==""){// regular price was NOT set, so set it
productsArray[index].regular_price="0.00";}var columnContent='<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" \n                                    data-product="'+index+'" data-segment="sales">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\''+productsArray[index].images[0].src+'\');">\n                                        <span class="e-badge e-badge-danger" style="float: right; clear: both; \n                                                    background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 0.6em;">\n                                                    '+Math.ceil(Math.abs(kendo.parseFloat(productsArray[index].price)-kendo.parseFloat(productsArray[index].regular_price))/kendo.parseFloat(productsArray[index].regular_price==="0.00"?productsArray[index].price:productsArray[index].regular_price)*100)+'% OFF\n                                                    </span>\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    '+productsArray[index].name+'\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">\n                                                &#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].regular_price),"n2")+'\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].price),"n2")+'\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';// append the content
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.append($(columnContent));}resolve();// resolve the parent promise
}).catch(function(err){reject();// reject the parent promise
});}));}// end of loading products with Internet Connection
else{// there is no internet connection
// display toast to show that there is no internet connection
toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Pull down to refresh and see live products";toast.dataBind();toast.show();// load banner products from cached data
productTypesPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("banner-products",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function(cachedProductsData){return cachedProductsData.products;}).then(function(productsArray){$('#home-page #home-latest-design-block').css("opacity","1");// hide the "Products" segment
// remove the previously slides from the carousel
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.remove($('#home-page #home-latest-design-block .row .col-xs-12').get());// attach the products to the page
for(var index=0;index<productsArray.length;index++){var columnContent='<div class="col-xs-12" style="padding-left: 0; padding-right: 0;">\n                                    <div class="e-card" style="min-height: 40vh; max-height: 90vh">\n                                        <div class="e-card-image" style="">\n                                        <img src="css/app-images/blank-img.png" style="width: 100%; height: auto; max-height: 90vh">\n                                        </div>\n                                    </div>\n                                </div>';// append the content
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.newProductsCarousel.append($(columnContent));}// $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
$('#home-page #home-latest-design-block').css({"opacity":"0","display":"none"});// hide the segment
resolve();// resolve the parent promise
}).catch(function(err){// $('#home-page #home-latest-design-block').css("opacity", "1"); // show the "Products" segment
$('#home-page #home-latest-design-block').css({"opacity":"0","display":"none"});// hide the segment
reject();// reject the parent promise
});}));// load featured products from cached data
productTypesPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("popular-products",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function(cachedProductsData){return cachedProductsData.products;}).then(function(productsArray){if(productsArray.length>0){// show the "Products" segment
$('#home-page #home-featured-design-block').css({"opacity":"1","display":"block"});// remove the previously slides from the carousel
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.remove($('#home-page #home-featured-design-block .row .col-xs-7').get());}else{// hide the "Products" segment
$('#home-page #home-featured-design-block').css({"opacity":"0","display":"none"});}// attach the products to the page
for(var index=0;index<productsArray.length;index++){var columnContent='<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" \n                                    data-product="'+index+'" data-segment="featured">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\''+productsArray[index].images[0].src+'\');">\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    '+productsArray[index].name+'\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].price),"n2")+'</div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';// append the content
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.featuredProductsCarousel.append($(columnContent));}resolve();// resolve the parent promise
}).catch(function(err){reject();// reject the parent promise
});}));// load sales products from cached data
productTypesPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("sales-products",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function(cachedProductsData){return cachedProductsData.products;}).then(function(productsArray){if(productsArray.length>0){// show the "Products" segment
$('#home-page #home-sales-design-block').css({"opacity":"1","display":"block"});// remove the previously slides from the carousel
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.remove($('#home-page #home-sales-design-block .row .col-xs-7').get());}else{// hide the "Products" segment
$('#home-page #home-sales-design-block').css({"opacity":"0","display":"none"});}// attach the products to the page
for(var index=0;index<productsArray.length;index++){if(!productsArray[index].regular_price||productsArray[index].regular_price==""){// regular price was NOT set, so set it
productsArray[index].regular_price="0.00";}var columnContent='<div class="col-xs-7" style="margin-left: 20.5%; margin-right: 20.5%;" \n                                  data-product="'+index+'" data-segment="sales">\n                                    <div class="e-card" style="min-height: 34vh;">\n                                        <div class="e-card-image" style="height: 60%; \n                                        background-image: url(\''+productsArray[index].images[0].src+'\');">\n                                        <span class="e-badge e-badge-danger" style="float: right; clear: both; \n                                                    background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 0.6em;">\n                                                    '+Math.ceil(Math.abs(kendo.parseFloat(productsArray[index].price)-kendo.parseFloat(productsArray[index].regular_price))/kendo.parseFloat(productsArray[index].regular_price==="0.00"?productsArray[index].price:productsArray[index].regular_price)*100)+'% OFF\n                                                    </span>\n                                        </div>\n                                        <div class="e-card-header">\n                                            <div class="e-card-header-caption">\n                                                <div class="e-card-sub-title" style="color: #000000; text-align: center; font-size: 14px; text-transform: capitalize">\n                                                    '+productsArray[index].name+'\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center; text-decoration: line-through">\n                                                &#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].regular_price),"n2")+'\n                                                </div>\n                                                <div class="e-card-sub-title" style="text-align: center;">\n                                                &#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].price),"n2")+'\n                                                </div>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>';// append the content
utopiasoftware[utopiasoftware_app_namespace].controller.homePageViewModel.salesProductsCarousel.append($(columnContent));}resolve();// resolve the parent promise
}).catch(function(err){reject();// reject the parent promise
});}));}return _context7.abrupt('return',Promise.all(productTypesPromisesArray));case 3:case'end':return _context7.stop();}}},_callee7,this);}));function loadProducts(){return _ref7.apply(this,arguments);}return loadProducts;}(),/**
         * method is triggered when the user wishes to view more featured products
         * @returns {Promise<void>}
         */showMoreFeaturedProducts:function(){var _ref8=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee9(){return regeneratorRuntime.wrap(function _callee9$(_context9){while(1){switch(_context9.prev=_context9.next){case 0:// load the products page in a separate event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee8(){var productArray,toast;return regeneratorRuntime.wrap(function _callee8$(_context8){while(1){switch(_context8.prev=_context8.next){case 0:_context8.prev=0;_context8.next=3;return $('#app-main-tabbar').get(0).setActiveTab(4,{animation:'none'});case 3:_context8.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts({"order":"desc","orderby":"date","status":"publish","type":"variable","stock_status":"instock","page":1,"per_page":20,"featured":true});case 5:productArray=_context8.sent;_context8.next=8;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);case 8:_context8.next=18;break;case 10:_context8.prev=10;_context8.t0=_context8['catch'](0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 18:_context8.prev=18;// hide the preloader for the products page
$('#products-page .page-preloader').css("display","none");return _context8.finish(18);case 21:case'end':return _context8.stop();}}},_callee8,this,[[0,10,18,21]]);})),0);case 1:case'end':return _context9.stop();}}},_callee9,this);}));function showMoreFeaturedProducts(){return _ref8.apply(this,arguments);}return showMoreFeaturedProducts;}(),/**
         * method is triggered when the user wishes to view more featured products
         * @returns {Promise<void>}
         */showMoreSalesProducts:function(){var _ref10=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee11(){return regeneratorRuntime.wrap(function _callee11$(_context11){while(1){switch(_context11.prev=_context11.next){case 0:// load the products page in a separate event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee10(){var productArray,toast;return regeneratorRuntime.wrap(function _callee10$(_context10){while(1){switch(_context10.prev=_context10.next){case 0:_context10.prev=0;_context10.next=3;return $('#app-main-tabbar').get(0).setActiveTab(4,{animation:'none'});case 3:_context10.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts({"order":"desc","orderby":"date","status":"publish","type":"variable","stock_status":"instock","page":1,"per_page":20,"on_sale":true});case 5:productArray=_context10.sent;_context10.next=8;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);case 8:_context10.next=18;break;case 10:_context10.prev=10;_context10.t0=_context10['catch'](0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 18:_context10.prev=18;// hide the preloader for the products page
$('#products-page .page-preloader').css("display","none");return _context10.finish(18);case 21:case'end':return _context10.stop();}}},_callee10,this,[[0,10,18,21]]);})),0);case 1:case'end':return _context11.stop();}}},_callee11,this);}));function showMoreSalesProducts(){return _ref10.apply(this,arguments);}return showMoreSalesProducts;}(),/**
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
         */productItemClicked:function(){var _ref12=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee13(productIndex,segmentType){return regeneratorRuntime.wrap(function _callee13$(_context13){while(1){switch(_context13.prev=_context13.next){case 0:// handle the function task in a different event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee12(){var productItemsArray;return regeneratorRuntime.wrap(function _callee12$(_context12){while(1){switch(_context12.prev=_context12.next){case 0:productItemsArray=[];// holds the array of 'appropriate' product items
_context12.prev=1;_context12.t0=segmentType;_context12.next=_context12.t0==="featured"?5:_context12.t0==="sales"?9:13;break;case 5:_context12.next=7;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("popular-products",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 7:productItemsArray=_context12.sent.products;return _context12.abrupt('break',13);case 9:_context12.next=11;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("sales-products",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 11:productItemsArray=_context12.sent.products;return _context12.abrupt('break',13);case 13:// display the products details page using the selected product
$('#app-main-navigator').get(0).pushPage("product-details-page.html",{animation:"lift",data:{product:productItemsArray[productIndex]}});_context12.next=18;break;case 16:_context12.prev=16;_context12.t1=_context12['catch'](1);case 18:case'end':return _context12.stop();}}},_callee12,this,[[1,16]]);})),0);case 1:case'end':return _context13.stop();}}},_callee13,this);}));function productItemClicked(_x3,_x4){return _ref12.apply(this,arguments);}return productItemClicked;}()},/**
     * this is the view-model/controller for the Categories page
     */categoriesPageViewModel:{/**
         * property holds the current "page" of the categories being accessed
         */currentPage:0,/**
         * property holds the size i.e. number of items that can be contained in currentPage being accessed
         */pageSize:100,/**
         * property holds the height of the "content view" for the page
         */viewContentHeight:0,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref14=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee15(){var categoryArray,toast;return regeneratorRuntime.wrap(function _callee15$(_context15){while(1){switch(_context15.prev=_context15.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context15.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context15.abrupt('return');case 3:// listen for the back button event
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#categories-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#categories-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#categories-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#categories-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#categories-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});// get the height of the view content container
utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight=Math.floor($('#categories-page .page__content').height());// listen for the scroll event on the page
$('#categories-page .page__content').on("scroll",function(){// handle the logic in a different event queue slot
window.setTimeout(function(){// get the scrollTop position of the view content
var scrollTop=Math.floor($('#categories-page .page__content').scrollTop());// get the percentage of scroll that has taken place from the top position
var percentageScroll=scrollTop/utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight*100;if(percentageScroll>=50){// if the scroll position is >= halfway
$('#categories-page #categories-page-scroll-top-fab').css({"transform":"scale(1)","display":"inline-block"});}else{// if the scroll position is < halfway
$('#categories-page #categories-page-scroll-top-fab').css({"transform":"scale(0)"});}},0);});// listen for when a category card is clicked
$thisPage.on("click",".e-card",function(clickEvent){// load the products page in a separate event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee14(){var productArray,toast;return regeneratorRuntime.wrap(function _callee14$(_context14){while(1){switch(_context14.prev=_context14.next){case 0:_context14.prev=0;_context14.next=3;return $('#app-main-tabbar').get(0).setActiveTab(4,{animation:'none'});case 3:_context14.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts({"order":"desc","orderby":"date","status":"publish","type":"variable","stock_status":"instock","page":1,"per_page":20,"category":$(clickEvent.currentTarget).attr("data-category-id")});case 5:productArray=_context14.sent;_context14.next=8;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);case 8:_context14.next=18;break;case 10:_context14.prev=10;_context14.t0=_context14['catch'](0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 18:_context14.prev=18;// hide the preloader for the products page
$('#products-page .page-preloader').css("display","none");return _context14.finish(18);case 21:case'end':return _context14.stop();}}},_callee14,this,[[0,10,18,21]]);})),0);});_context15.prev=9;_context15.next=12;return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.loadCategories();case 12:categoryArray=_context15.sent;_context15.next=15;return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.displayPageContent(categoryArray[0]);case 15:_context15.next=26;break;case 17:_context15.prev=17;_context15.t0=_context15['catch'](9);console.log("CATEGORY PAGE ERROR",_context15.t0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 26:_context15.prev=26;// hide the preloader
$('#categories-page .page-preloader').css("display","none");return _context15.finish(26);case 29:case'end':return _context15.stop();}}},_callee15,this,[[9,17,26,29]]);}));return function loadPageOnAppReady(){return _ref14.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){$('#app-main-page ons-toolbar div.title-bar').html("Products");// update the title of the page
// update cart count
$('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);// hide the page scroll fab
$('#categories-page #categories-page-scroll-top-fab').css({"display":"none"});window.SoftInputMode.set('adjustPan');// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOnlineListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref16=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee16(){return regeneratorRuntime.wrap(function _callee16$(_context16){while(1){switch(_context16.prev=_context16.next){case 0:// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.deviceOnlineListener,false);case 2:case'end':return _context16.stop();}}},_callee16,this);}));function pageHide(){return _ref16.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// reset view-model properties
utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.currentPage=0;utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pageSize=100;utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.viewContentHeight=0;},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// go to the "Home" page (tab)
$('#app-main-tabbar').get(0).setActiveTab(0);},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');// hide all previously displayed ej2 toast
toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to see updated products";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref17=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee17(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var categoryArray,toast;return regeneratorRuntime.wrap(function _callee17$(_context17){while(1){switch(_context17.prev=_context17.next){case 0:// disable pull-to-refresh widget till loading is done
$('#categories-page #categories-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');_context17.prev=2;_context17.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.loadCategories(1,utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pageSize);case 5:categoryArray=_context17.sent;_context17.next=8;return utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.displayPageContent(categoryArray[0]);case 8:_context17.next=17;break;case 10:_context17.prev=10;_context17.t0=_context17['catch'](2);// an error occurred
// display toast to show that error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content="Sorry, an error occurred. Refresh to try again";toast.dataBind();toast.show();case 17:_context17.prev=17;// enable pull-to-refresh widget till loading is done
$('#categories-page #categories-page-pull-hook').removeAttr("disabled");// signal that loading is done
doneCallBack();return _context17.finish(17);case 21:case'end':return _context17.stop();}}},_callee17,this,[[2,10,17,21]]);}));function pagePullHookAction(){return _ref17.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is used to load products categories to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @returns {Promise<void>}
         */loadCategories:function(){var _ref18=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee18(){var pageToAccess=arguments.length>0&&arguments[0]!==undefined?arguments[0]:utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.currentPage+1;var pageSize=arguments.length>1&&arguments[1]!==undefined?arguments[1]:utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.pageSize;var categoryPromisesArray,toast;return regeneratorRuntime.wrap(function _callee18$(_context18){while(1){switch(_context18.prev=_context18.next){case 0:categoryPromisesArray=[];// holds the array for the promises used to load the product categories
// check if there is internet connection or not
if(navigator.connection.type!==Connection.NONE){// there is internet connection
// load the requested categories list from the server
categoryPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/products/categories",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{"order":"asc","orderby":"name","hide_empty":true,"page":pageToAccess,"per_page":pageSize}})).then(function(categoriesArray){// check if there is any data to cache in the app database
if(categoriesArray.length>0){// there is data to cache
// remove the 'uncategorized' category
categoriesArray=categoriesArray.filter(function(element){return element.slug!=='uncategorized';});// generate an id for the data being cached
var cachedDataId=(""+pageToAccess).padStart(7,"0")+"categories";// save the retrieved data to app database as cached data
utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:cachedDataId,docType:"PRODUCT_CATEGORIES",categories:categoriesArray},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);// update the current page being viewed
utopiasoftware[utopiasoftware_app_namespace].controller.categoriesPageViewModel.currentPage=pageToAccess;}resolve(categoriesArray);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}// end of loading product categories with Internet Connection
else{// there is no internet connection
// display toast to show that there is no internet connection
toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Pull down to refresh and see updated products";toast.dataBind();toast.show();// load the requested product categories from cached data
categoryPromisesArray.push(new Promise(function(resolve,reject){// generate the id for the cached data being retrieved
var cachedDataId=(""+pageToAccess).padStart(7,"0")+"categories";Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData(cachedDataId,utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function(cachedCategoriesData){resolve(cachedCategoriesData.categories);// resolve the parent promise with the cached categories data
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}return _context18.abrupt('return',Promise.all(categoryPromisesArray));case 3:case'end':return _context18.stop();}}},_callee18,this);}));function loadCategories(){return _ref18.apply(this,arguments);}return loadCategories;}(),/**
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
         */displayPageContent:function(){var _ref19=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee19(categoriesArray){var appendContent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var overwriteContent=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;var displayCompletedPromise;return regeneratorRuntime.wrap(function _callee19$(_context19){while(1){switch(_context19.prev=_context19.next){case 0:displayCompletedPromise=new Promise(function(resolve,reject){var categoriesContent="";// holds the contents for the categories
// check if the categoriesArray is empty or not
if(categoriesArray.length<=0){// there are no new content to display
resolve(categoriesArray.length);// resolve promise with the length of the categories array
}else{// there are some categories to display
// loop through the array content and display it
for(var index=0;index<categoriesArray.length;index++){categoriesContent+='<div class="col-xs-4" ';if((index+1)%3!==0){// this is NOT the last column in the row
categoriesContent+='style="border-right: 1px lightgray solid; border-bottom: 1px lightgray solid">';}else{// this is the last column in the row
categoriesContent+='style="border-bottom: 1px lightgray solid">';}categoriesContent+='\n                        <ons-ripple background="rgba(63, 81, 181, 0.3)"></ons-ripple>\n                        <div class="e-card" data-category-id="'+categoriesArray[index].id+'">\n                            <div class="e-card-image" style="min-height: 100px; \n                            background-image: url(\''+categoriesArray[index].image.src+'\');">\n                            </div>\n                            <div class="e-card-header">\n                                <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">\n                                    <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">\n                                        '+categoriesArray[index].name+'\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                      </div>';}// check if the contents are to be overwritten
if(overwriteContent===true){// content wants to be overwritten
$('#categories-page #categories-contents-container').html(categoriesContent);}else{// content is NOT to be overwritten
if(appendContent===true){// append content
$('#categories-page #categories-contents-container').append(categoriesContent);}else{// prepend content
$('#categories-page #categories-contents-container').prepend(categoriesContent);}}resolve(categoriesArray.length);// resolve the promise with length of the categoriesArray
}});return _context19.abrupt('return',displayCompletedPromise);case 2:case'end':return _context19.stop();}}},_callee19,this);}));function displayPageContent(_x10){return _ref19.apply(this,arguments);}return displayPageContent;}(),/**
         * method scrolls the page to the top
         * @returns {Promise<void>}
         */scrollPageToTop:function(){var _ref20=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee20(){return regeneratorRuntime.wrap(function _callee20$(_context20){while(1){switch(_context20.prev=_context20.next){case 0:window.setTimeout(function(){$('#categories-page .page__content').animate({scrollTop:0},400);},0);case 1:case'end':return _context20.stop();}}},_callee20,this);}));function scrollPageToTop(){return _ref20.apply(this,arguments);}return scrollPageToTop;}()},/**
     * this is the view-model/controller for the Search page
     */searchPageViewModel:{/**
         * holds the array of products for the search result that was just run by the user
         */currentSearchResultsArray:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref21=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee22(){var searchAutoComplete;return regeneratorRuntime.wrap(function _callee22$(_context22){while(1){switch(_context22.prev=_context22.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context22.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context22.abrupt('return');case 3:// listen for the back button event
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.backButtonClicked;try{//instantiate the autocomplete widget for the search input
searchAutoComplete=new ej.dropdowns.AutoComplete({floatLabelType:"Never",placeholder:"Search Products",allowCustom:true,filterType:"Contains",minLength:1000,// minimum number of characters that will automatically trigger autocomplete search
suggestionCount:20,// specified how many items will be in the popup
dataSource:[],noRecordsTemplate:'Tap \'Search\' key to begin search',blur:function blur(){// track when the component has lost focus
this._allowRemoteSearch=false;// set that remote search is NOT allowed
// hide the popover
$('#search-page-search-input-popover').get(0).hide();},change:function change(){// track when the component's value has changed
var searchValue="";// holds the term to be searched for
// check if the search component can perform a remote search
if(this._allowRemoteSearch!==true){// remote search is NOT allowed
this._allowRemoteSearch=false;// set that remote search is NOT allowed
return;// exit function
}// check that there is actually a search term entered in the search component
if(!this.value||this.value.trim()===""){// no search term
this._allowRemoteSearch=false;// set that remote search is NOT allowed
return;// exit function
}// update the search term value
searchValue=this.value.trim();// inform user that search is ongoing
$('#search-page-search-input-popover #search-input-popover-list').html('\n                            <ons-list-item modifier="nodivider" lock-on-drag="true">\n                                <div class="left">\n                                    <ons-progress-circular indeterminate modifier="pull-hook" \n                                    style="transform: scale(0.6)"></ons-progress-circular>\n                                </div>\n                                <div class="center">\n                                    <div style="text-align: center;">\n                                        Searching for products\n                                    </div>\n                                </div>\n                            </ons-list-item>');// display the popover
$('#search-page-search-input-popover').get(0).show(document.getElementById('search-page-input'));// run the actual search in a different event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee21(){var searchResultsArray,toast;return regeneratorRuntime.wrap(function _callee21$(_context21){while(1){switch(_context21.prev=_context21.next){case 0:searchResultsArray=[];_context21.prev=1;_context21.next=4;return utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.loadProducts({"order":"desc","orderby":"date","status":"publish","type":"variable","stock_status":"instock","page":1,"per_page":3,"search":searchValue});case 4:searchResultsArray=_context21.sent;_context21.next=7;return utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayPageContent(searchResultsArray[0]);case 7:_context21.next=20;break;case 9:_context21.prev=9;_context21.t0=_context21['catch'](1);// remove the focus from the search autocomplete component
$('#search-page #search-page-input').get(0).ej2_instances[0].focusOut();// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Sorry, a search error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"");toast.dataBind();toast.show();case 20:case'end':return _context21.stop();}}},_callee21,this,[[1,9]]);})),0);}}).appendTo('#search-page-input');}catch(err){}case 5:case'end':return _context22.stop();}}},_callee22,this);}));return function loadPageOnAppReady(){return _ref21.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){$('#app-main-page ons-toolbar div.title-bar').html("Search");// update the title of the page
// update cart count
$('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustPan');// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOnlineListener,false);// load the recent searches list
utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayRecentSearches();},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref23=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee23(){return regeneratorRuntime.wrap(function _callee23$(_context23){while(1){switch(_context23.prev=_context23.next){case 0:// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.deviceOnlineListener,false);// destroy the current search result array
utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.currentSearchResultsArray=null;case 3:case'end':return _context23.stop();}}},_callee23,this);}));function pageHide(){return _ref23.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the search input autocomplete component
$('#search-page #search-page-input').get(0).ej2_instances[0].destroy();// reset the view-model properties
utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.currentSearchResultsArray=null;},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// hide the search-input popover
$('#search-page-search-input-popover').get(0).hide();// go to the "Categories" page (tab)
$('#app-main-tabbar').get(0).setActiveTab(1);},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');// hide all previously displayed ej2 toast
toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to see search results";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is used to display the "Recent Searches" list on the Search page.
         * Recent Searches are gotten from the cached collection
         */displayRecentSearches:function(){var _ref24=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee24(){var recentSearchData,displayContent,index;return regeneratorRuntime.wrap(function _callee24$(_context24){while(1){switch(_context24.prev=_context24.next){case 0:_context24.prev=0;_context24.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("recent-searches",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 3:recentSearchData=_context24.sent;displayContent="<ons-list-title>Recent Searches</ons-list-title>";// holds the content of the list to be created
// create the Recent Searches list
for(index=0;index<recentSearchData.products.length;index++){displayContent+='\n                    <ons-list-item modifier="longdivider" tappable lock-on-drag="true">\n                        <div class="center">\n                            <div style="width: 100%;" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.\n                              recentSearchesItemClicked('+index+')">\n                                <span class="list-item__subtitle">'+recentSearchData.products[index].name+'</span>\n                            </div>\n                        </div>\n                        <div class="right" prevent-tap \n                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.\n                                    removeRecentSearchItem('+index+', this);">\n                            <ons-icon icon="md-close-circle" style="color: lavender; font-size: 18px;"></ons-icon>\n                        </div>\n                    </ons-list-item>';}// attach the displayContent to the list
$('#search-page #search-list').html(displayContent);_context24.next=11;break;case 9:_context24.prev=9;_context24.t0=_context24['catch'](0);case 11:case'end':return _context24.stop();}}},_callee24,this,[[0,9]]);}));function displayRecentSearches(){return _ref24.apply(this,arguments);}return displayRecentSearches;}(),/**
         * method is used to save a search item i.e. a product to the cached "Recent Searches"
         *
         * @param product {Object} the product to include to the "Recent Searches" cache
         * @returns {Promise<void>}
         */saveRecentSearchItem:function(){var _ref25=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee25(product){var recentSearchesResultArray;return regeneratorRuntime.wrap(function _callee25$(_context25){while(1){switch(_context25.prev=_context25.next){case 0:recentSearchesResultArray=[];// holds the recent searches array
_context25.prev=1;_context25.next=4;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("recent-searches",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 4:recentSearchesResultArray=_context25.sent.products;_context25.next=9;break;case 7:_context25.prev=7;_context25.t0=_context25['catch'](1);case 9:_context25.prev=9;// add the received 'product' parameter to the top of the recent searches array
recentSearchesResultArray.unshift(product);// ensure the array is NOT greater than 5 items in length
recentSearchesResultArray=recentSearchesResultArray.slice(0,5);// save the updated recent searches array  to the cached data collection of "Recent Searches"
_context25.next=14;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"recent-searches",docType:"RECENT_SEARCHES",products:recentSearchesResultArray},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 14:_context25.next=16;return utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayRecentSearches();case 16:_context25.next=20;break;case 18:_context25.prev=18;_context25.t1=_context25['catch'](9);case 20:case'end':return _context25.stop();}}},_callee25,this,[[1,7],[9,18]]);}));function saveRecentSearchItem(_x11){return _ref25.apply(this,arguments);}return saveRecentSearchItem;}(),/**
         * method is used to remove a search item i.e. a product from the cached "Recent Searches"
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the array of cached recent searches
         *
         * @param clickedElement {Element} the element that was clicked in order to trigger the product removal
         *
         * @returns {Promise<void>}
         */removeRecentSearchItem:function(){var _ref26=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee27(productIndex,clickedElement){return regeneratorRuntime.wrap(function _callee27$(_context27){while(1){switch(_context27.prev=_context27.next){case 0:// execute the method is a different event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee26(){var recentSearchesResultArray,$listItem;return regeneratorRuntime.wrap(function _callee26$(_context26){while(1){switch(_context26.prev=_context26.next){case 0:recentSearchesResultArray=[];// holds the recent searches array
_context26.prev=1;_context26.next=4;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("recent-searches",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 4:recentSearchesResultArray=_context26.sent.products;_context26.next=9;break;case 7:_context26.prev=7;_context26.t0=_context26['catch'](1);case 9:_context26.prev=9;// remove the received 'product' parameter index from the recent searches array
recentSearchesResultArray.splice(productIndex,1);// save the updated recent searches array  to the cached data collection of "Recent Searches"
_context26.next=13;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"recent-searches",docType:"RECENT_SEARCHES",products:recentSearchesResultArray},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 13:// hide the list-item belonging to the clicked element from the displayed list
$listItem=$(clickedElement).closest('ons-list-item');_context26.next=16;return kendo.fx($listItem).expand("vertical").duration(300).reverse();case 16:_context26.next=18;return utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.displayRecentSearches();case 18:_context26.next=22;break;case 20:_context26.prev=20;_context26.t1=_context26['catch'](9);case 22:case'end':return _context26.stop();}}},_callee26,this,[[1,7],[9,20]]);})),0);case 1:case'end':return _context27.stop();}}},_callee27,this);}));function removeRecentSearchItem(_x12,_x13){return _ref26.apply(this,arguments);}return removeRecentSearchItem;}(),/**
         * method is triggered when the user clicks an item from the Recent Searches List
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the array returned of recent searches
         *
         * @returns {Promise<void>}
         */recentSearchesItemClicked:function(){var _ref28=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee29(productIndex){return regeneratorRuntime.wrap(function _callee29$(_context29){while(1){switch(_context29.prev=_context29.next){case 0:// handle the function task in a different event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee28(){var recentSearchesResultArray;return regeneratorRuntime.wrap(function _callee28$(_context28){while(1){switch(_context28.prev=_context28.next){case 0:_context28.prev=0;_context28.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("recent-searches",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 3:recentSearchesResultArray=_context28.sent.products;// display the products details page using the selected product
$('#app-main-navigator').get(0).pushPage("product-details-page.html",{animation:"lift",data:{product:recentSearchesResultArray[productIndex]}});_context28.next=9;break;case 7:_context28.prev=7;_context28.t0=_context28['catch'](0);case 9:case'end':return _context28.stop();}}},_callee28,this,[[0,7]]);})),0);case 1:case'end':return _context29.stop();}}},_callee29,this);}));function recentSearchesItemClicked(_x14){return _ref28.apply(this,arguments);}return recentSearchesItemClicked;}(),/**
         * method is triggered when the enter button is clicked on the device keyboard
         *
         * @param keyEvent
         * @returns {Promise<void>}
         */enterButtonClicked:function(){var _ref30=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee30(keyEvent){var searchAutoComplete;return regeneratorRuntime.wrap(function _callee30$(_context30){while(1){switch(_context30.prev=_context30.next){case 0:// check which key was pressed
if(keyEvent.which===kendo.keys.ENTER)// if the enter key was pressed
{// prevent the default action from occurring
keyEvent.preventDefault();keyEvent.stopImmediatePropagation();keyEvent.stopPropagation();// hide the device keyboard
Keyboard.hide();// get the search autocomplete component
searchAutoComplete=$('#search-page #search-page-input').get(0).ej2_instances[0];// update the value of the retrieved component
searchAutoComplete.value=$('#search-page #search-page-input').val();searchAutoComplete._allowRemoteSearch=true;// flag the remote search can occur
searchAutoComplete.dataBind();// bind new value to the component
searchAutoComplete.change();// trigger the change method
}case 1:case'end':return _context30.stop();}}},_callee30,this);}));function enterButtonClicked(_x15){return _ref30.apply(this,arguments);}return enterButtonClicked;}(),/**
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
         */loadProducts:function(){var _ref31=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee31(queryParam){var pageToAccess=arguments.length>1&&arguments[1]!==undefined?arguments[1]:queryParam.page||1;var pageSize=arguments.length>2&&arguments[2]!==undefined?arguments[2]:queryParam.per_page||3;var productPromisesArray;return regeneratorRuntime.wrap(function _callee31$(_context31){while(1){switch(_context31.prev=_context31.next){case 0:queryParam.page=pageToAccess;queryParam.per_page=pageSize;productPromisesArray=[];// holds the array for the promises used to load the products
// check if there is internet connection or not
if(navigator.connection.type!==Connection.NONE){// there is internet connection
// load the requested products list from the server
productPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/products",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:queryParam})).then(function(productsArray){// check if the productsArray contains products
if(productsArray.length>0){// there are products
// update the current search results array with the productsArray
utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.currentSearchResultsArray=productsArray;}resolve(productsArray);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}// end of loading products with Internet Connection
else{// there is no internet connection
productPromisesArray.push(Promise.reject("no internet connection"));}return _context31.abrupt('return',Promise.all(productPromisesArray));case 5:case'end':return _context31.stop();}}},_callee31,this);}));function loadProducts(_x18){return _ref31.apply(this,arguments);}return loadProducts;}(),/**
         * method is used to display the retrieved products on the search popover
         *
         * @param productsArray
         *
         * @returns {Promise<void>}
         */displayPageContent:function(){var _ref32=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee32(productsArray){var displayCompletedPromise;return regeneratorRuntime.wrap(function _callee32$(_context32){while(1){switch(_context32.prev=_context32.next){case 0:displayCompletedPromise=new Promise(function(resolve,reject){var productsContent="";// holds the contents for the products
// check if the productsArray is empty or not
if(productsArray.length<=0){// there are no new content to display
// inform the user that no result for the search was founc'
$('#search-page-search-input-popover #search-input-popover-list').html('<ons-list-item modifier="nodivider" lock-on-drag="true">\n                                <div class="center">\n                                    <div style="text-align: center; width: 100%;">\n                                        No Results Found\n                                    </div>\n                                </div>\n                            </ons-list-item>');resolve(productsArray.length);// resolve promise with the length of the products array
}else{// there are some products to display
// loop through the array content and display it
for(var index=0;index<productsArray.length;index++){productsContent+='<ons-list-item modifier="nodivider" tappable lock-on-drag="true" \n                              onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.\n                              searchAutocompletePopOverItemClicked('+index+')">\n                                <div class="left">\n                                    <div class="search-result-image" style="background-image: url(\''+productsArray[index].images[0].src+'\'); \n                                                            width: 2em; height: 2em"></div>\n                                </div>\n                                <div class="center">\n                                    <div style="text-align: center;">\n                                        '+productsArray[index].name+'\n                                    </div>\n                                </div>\n                            </ons-list-item>';}// append the "Load More" search item
productsContent+='<ons-list-item modifier="nodivider" tappable lock-on-drag="true" \n                          onclick="utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.findMoreClicked();">\n                                <div class="center">\n                                    <div style="text-align: center; width: 100%; font-weight: bold;">\n                                        Find More...\n                                    </div>\n                                </div>\n                            </ons-list-item>';// attach the new search results to the search popover
$('#search-page-search-input-popover #search-input-popover-list').html(productsContent);resolve(productsArray.length);// resolve the promise with length of the productsArray
}});return _context32.abrupt('return',displayCompletedPromise);case 2:case'end':return _context32.stop();}}},_callee32,this);}));function displayPageContent(_x19){return _ref32.apply(this,arguments);}return displayPageContent;}(),/**
         * method is triggered when the user clicks an item from the search autocomplete popover
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the array returned by the product search
         *
         * @returns {Promise<void>}
         */searchAutocompletePopOverItemClicked:function(){var _ref33=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee34(productIndex){var selectedProduct;return regeneratorRuntime.wrap(function _callee34$(_context34){while(1){switch(_context34.prev=_context34.next){case 0:// get the product the user clicked on from the search autocomplete popover
selectedProduct=utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.currentSearchResultsArray[productIndex];window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee33(){return regeneratorRuntime.wrap(function _callee33$(_context33){while(1){switch(_context33.prev=_context33.next){case 0:_context33.prev=0;_context33.next=3;return $('#app-main-navigator').get(0).pushPage("product-details-page.html",{animation:"lift",data:{product:selectedProduct}});case 3:_context33.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.searchPageViewModel.saveRecentSearchItem(selectedProduct);case 5:// update the value of the search autocomplete input to that which the user clicked on from the popover
$('#search-page #search-page-input').val(selectedProduct.name);_context33.next=10;break;case 8:_context33.prev=8;_context33.t0=_context33['catch'](0);case 10:case'end':return _context33.stop();}}},_callee33,this,[[0,8]]);})),0);case 2:case'end':return _context34.stop();}}},_callee34,this);}));function searchAutocompletePopOverItemClicked(_x20){return _ref33.apply(this,arguments);}return searchAutocompletePopOverItemClicked;}(),/**
         * method is triggered when the "Find More" option is
         * tapped within the search input popover
         *
         * @returns {Promise<void>}
         */findMoreClicked:function(){var _ref35=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee36(){return regeneratorRuntime.wrap(function _callee36$(_context36){while(1){switch(_context36.prev=_context36.next){case 0:// load the products page in a separate event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee35(){var productArray,toast;return regeneratorRuntime.wrap(function _callee35$(_context35){while(1){switch(_context35.prev=_context35.next){case 0:_context35.prev=0;_context35.next=3;return $('#app-main-tabbar').get(0).setActiveTab(4,{animation:'none'});case 3:_context35.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts({"order":"desc","orderby":"date","status":"publish","type":"variable","stock_status":"instock","page":1,"per_page":20,"search":$('#search-page #search-page-input').get(0).ej2_instances[0].value.trim()});case 5:productArray=_context35.sent;_context35.next=8;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);case 8:_context35.next=18;break;case 10:_context35.prev=10;_context35.t0=_context35['catch'](0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 18:_context35.prev=18;// hide the preloader for the products page
$('#products-page .page-preloader').css("display","none");return _context35.finish(18);case 21:case'end':return _context35.stop();}}},_callee35,this,[[0,10,18,21]]);})),0);case 1:case'end':return _context36.stop();}}},_callee36,this);}));function findMoreClicked(){return _ref35.apply(this,arguments);}return findMoreClicked;}()},/**
     * this is the view-model/controller for the Account page
     */accountPageViewModel:{/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref37=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee37(){var accordion;return regeneratorRuntime.wrap(function _callee37$(_context37){while(1){switch(_context37.prev=_context37.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context37.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context37.abrupt('return');case 3:// listen for when the device back button is tapped
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.backButtonClicked;try{// create the accorodion ej2 component used on the "Account" page
accordion=new ej.navigations.Accordion({expandMode:'Single'});accordion.appendTo('#account-accordion');// expand the first item of the accordion
accordion.expandItem(true,0);}catch(err){}case 5:case'end':return _context37.stop();}}},_callee37,this);}));return function loadPageOnAppReady(){return _ref37.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function(){var _ref38=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee39(){return regeneratorRuntime.wrap(function _callee39$(_context39){while(1){switch(_context39.prev=_context39.next){case 0:$('#app-main-page ons-toolbar div.title-bar').html("Account");// update the title of the page
// update cart count
$('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustPan');// handle the user sign-in check inside a promise
return _context39.abrupt('return',new Promise(function(resolve,reject){window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee38(){var hasUserDetails;return regeneratorRuntime.wrap(function _callee38$(_context38){while(1){switch(_context38.prev=_context38.next){case 0:_context38.prev=0;_context38.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:hasUserDetails=_context38.sent;// since user is signed in, hide some list items and show some list items on the page.
// all items that are interested in have their display altered MUST have the
// class 'utopiasoftware-can-hide-list-item'.
// items that want to be displayed when a user is signed in and hidden when a user is signed out, MUST ALSO
// have the class 'utopiasoftware-user-sign-in-show' in addition to 'utopiasoftware-can-hide-list-item'.
// alter the list item display because a user is signed in
$('#account-page .utopiasoftware-can-hide-list-item.utopiasoftware-user-sign-in-show').css("display","flex");$('#account-page .utopiasoftware-can-hide-list-item:not(.utopiasoftware-user-sign-in-show)').css("display","none");resolve();// resolve the promise
_context38.next=14;break;case 9:_context38.prev=9;_context38.t0=_context38['catch'](0);// alter the list item display because NO user is signed in
$('#account-page .utopiasoftware-can-hide-list-item.utopiasoftware-user-sign-in-show').css("display","none");$('#account-page .utopiasoftware-can-hide-list-item:not(.utopiasoftware-user-sign-in-show)').css("display","flex");// resolve the promise
resolve();// resolve the promise
case 14:case'end':return _context38.stop();}}},_callee38,this,[[0,9]]);})),0);}));case 4:case'end':return _context39.stop();}}},_callee39,this);}));function pageShow(){return _ref38.apply(this,arguments);}return pageShow;}(),/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref40=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee40(){return regeneratorRuntime.wrap(function _callee40$(_context40){while(1){switch(_context40.prev=_context40.next){case 0:case'end':return _context40.stop();}}},_callee40,this);}));function pageHide(){return _ref40.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the "Account" accordion
$('#account-page #account-accordion').get(0).ej2_instances[0].destroy();},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// go to the "Home" page (tab)
$('#app-main-tabbar').get(0).setActiveTab(2);},/**
         * method is triggered when the user clicks on the "Sign Out" list item
         *
         * @returns {Promise<void>}
         */signOutListItemClicked:function(){var _ref41=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee41(){var toast;return regeneratorRuntime.wrap(function _callee41$(_context41){while(1){switch(_context41.prev=_context41.next){case 0:// inform the user that the sign out process is on
$('#loader-modal-message').html("Signing user out...");_context41.next=3;return $('#loader-modal').get(0).show();case 3:_context41.prev=3;_context41.next=6;return Promise.all([utopiasoftware[utopiasoftware_app_namespace].databaseOperations.removeData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase),utopiasoftware[utopiasoftware_app_namespace].databaseOperations.removeData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)]);case 6:_context41.next=8;return utopiasoftware[utopiasoftware_app_namespace].model.firebaseApp.auth().signOut();case 8:_context41.next=13;break;case 10:_context41.prev=10;_context41.t0=_context41['catch'](3);console.log("USER SIGN OUT",_context41.t0);case 13:// check if user can sign out from the remote app serve via an iframe
if($('#user-signout-iframe-container #user-signout-iframe').get(0).contentWindow&&$('#user-signout-iframe-container #user-signout-iframe').get(0).contentWindow.utopiasoftware_removeUsage){// call the method to remotely sign out
$('#user-signout-iframe-container #user-signout-iframe').get(0).contentWindow.utopiasoftware_removeUsage();}// refresh the display of the app Account page
_context41.next=16;return utopiasoftware[utopiasoftware_app_namespace].controller.accountPageViewModel.pageShow();case 16:// alter the list item displayed on the Account page because NO user is signed in
$('#account-page .utopiasoftware-can-hide-list-item.utopiasoftware-user-sign-in-show').css("display","none");$('#account-page .utopiasoftware-can-hide-list-item:not(.utopiasoftware-user-sign-in-show)').css("display","flex");// hide loader modal
_context41.next=20;return $('#loader-modal').get(0).hide();case 20:// inform user that they have been signed out
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='success-ej2-toast';toast.timeOut=3000;toast.content='User signed out';toast.dataBind();toast.show();case 28:case'end':return _context41.stop();}}},_callee41,this,[[3,10]]);}));function signOutListItemClicked(){return _ref41.apply(this,arguments);}return signOutListItemClicked;}(),/**
         * method is triggered when the user clicks on the "Profile" list item
         *
         * @returns {Promise<void>}
         */profileListItemClicked:function(){var _ref42=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee43(){return regeneratorRuntime.wrap(function _callee43$(_context43){while(1){switch(_context43.prev=_context43.next){case 0:return _context43.abrupt('return',new Promise(function(resolve,reject){window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee42(){var hasUserDetails,toast;return regeneratorRuntime.wrap(function _callee42$(_context42){while(1){switch(_context42.prev=_context42.next){case 0:_context42.prev=0;_context42.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:hasUserDetails=_context42.sent;_context42.next=6;return $('#app-main-navigator').get(0).pushPage('profile-page.html');case 6:resolve();// resolve the promise
_context42.next=20;break;case 9:_context42.prev=9;_context42.t0=_context42['catch'](0);// inform user they need to sign in before viewing the profile page
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Sign in to view your profile';toast.dataBind();toast.show();// resolve the promise
resolve();// resolve the promise
case 20:case'end':return _context42.stop();}}},_callee42,this,[[0,9]]);})),0);}));case 1:case'end':return _context43.stop();}}},_callee43,this);}));function profileListItemClicked(){return _ref42.apply(this,arguments);}return profileListItemClicked;}(),/**
         * method is triggered when the user clicks on the "Track Order" list item
         *
         * @returns {Promise<void>}
         */trackOrderListItemClicked:function(){var _ref44=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee45(){return regeneratorRuntime.wrap(function _callee45$(_context45){while(1){switch(_context45.prev=_context45.next){case 0:return _context45.abrupt('return',new Promise(function(resolve,reject){window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee44(){var hasUserDetails,toast;return regeneratorRuntime.wrap(function _callee44$(_context44){while(1){switch(_context44.prev=_context44.next){case 0:_context44.prev=0;_context44.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:hasUserDetails=_context44.sent;_context44.next=6;return $('#app-main-navigator').get(0).pushPage('track-order-page.html');case 6:resolve();// resolve the promise
_context44.next=20;break;case 9:_context44.prev=9;_context44.t0=_context44['catch'](0);// inform user they need to sign in before viewing the track order page
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Sign in to track an order';toast.dataBind();toast.show();// resolve the promise
resolve();// resolve the promise
case 20:case'end':return _context44.stop();}}},_callee44,this,[[0,9]]);})),0);}));case 1:case'end':return _context45.stop();}}},_callee45,this);}));function trackOrderListItemClicked(){return _ref44.apply(this,arguments);}return trackOrderListItemClicked;}()},/**
     * this is the view-model/controller for the Login page
     */loginPageViewModel:{/**
         * used to hold the parsley form validation object for the login page
         */loginFormValidator:null,/**
         * used to hold the parsley form validation object for the signup page
         */signupFormValidator:null,/**
         * used to hold the parsley form validator object for the forgot password page
         */forgotPasswordFormValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref46=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee46(){return regeneratorRuntime.wrap(function _callee46$(_context46){while(1){switch(_context46.prev=_context46.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context46.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context46.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked;// listen for when the login-carousel has changed/slide used to change screen from login to signup etc
$thisPage.on("postchange","#login-carousel",utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.changeScreenCarouselPostChange);// listen for when the login-carousel has changed/slide used to hide the tooltips for the previous displayed screen
$thisPage.on("postchange","#login-carousel",utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.hideTooltipsCarouselPostChange);// initialise the login form validation
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator=$('#login-page #login-form').parsley();// initialise the signup form validation
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator=$('#login-page #signup-form').parsley();// initialise the forgot password form validation
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator=$('#login-page #forgot-password-form').parsley();// listen for log in form field validation failure event
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
var tooltip=$('#login-page #login-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.content=fieldInstance.getErrorsMessages()[0];tooltip.dataBind();tooltip.open(fieldInstance.$element.get(0));});// listen for log in form field validation success event
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('field:success',function(fieldInstance){// hide tooltip from element
var tooltip=$('#login-page #login-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.close();});// listen for log in form validation success
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.on('form:success',utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidated);// listen for signup form field validation failure event
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
var tooltip=$('#login-page #signup-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.content=fieldInstance.getErrorsMessages()[0];tooltip.dataBind();tooltip.open(fieldInstance.$element.get(0));});// listen for sign up form field validation success event
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('field:success',function(fieldInstance){// hide tooltip from element
var tooltip=$('#login-page #signup-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.close();});// listen for signup form validation success
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.on('form:success',utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidated);// listen for forgot password form field validation failure event
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
var tooltip=$('#login-page #forgot-password-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.content=fieldInstance.getErrorsMessages()[0];tooltip.dataBind();tooltip.open(fieldInstance.$element.get(0));});// listen for forgot password form field validation success event
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.on('field:success',function(fieldInstance){// hide tooltip from element
var tooltip=$('#login-page #forgot-password-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.close();});// listen for forgot password form validation success
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.on('form:success',utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidated);// listen for scroll event on the page to adjust the tooltips when page scrolls
$('#login-page .login-page-form-container').on("scroll",function(){// place function execution in the event queue to be executed ASAP
window.setTimeout(function(){switch($('#login-page #login-carousel').get(0).getActiveIndex()){// get the active carousel item
case 0:// first carousel item is active, so adjust the input elements on the login form
$("#login-page #login-form ons-input").each(function(index,element){document.getElementById('login-form').ej2_instances[index].refresh(element);});break;case 1:// second carousel item is active, so adjust the input elements on the login form
$("#login-page #signup-form ons-input").each(function(index,element){document.getElementById('signup-form').ej2_instances[index].refresh(element);});break;case 2:// third carousel item is active, so adjust the input elements on the login form
$("#login-page #forgot-password-form ons-input").each(function(index,element){document.getElementById('forgot-password-form').ej2_instances[index].refresh(element);});break;}},0);});try{// create the tooltip objects for the signin form
$('#login-form ons-input',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the html form object
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopCenter',opensOn:'Custom'}).appendTo($('#login-page #login-form').get(0));});// create the tooltip objects for the signup form
$('#signup-form ons-input',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the html form object
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopCenter',opensOn:'Custom'}).appendTo($('#login-page #signup-form').get(0));});// create the tooltip objects for the forgot password form
$('#forgot-password-form ons-input',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the html form object
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopCenter',opensOn:'Custom'}).appendTo($('#login-page #forgot-password-form').get(0));});// create the button for showing password visibility on the signup page
new ej.buttons.Button({isToggle:true,cssClass:'e-flat e-small e-round',iconCss:"zmdi zmdi-eye",iconPosition:"Left"}).appendTo($('#signup-password-view-button',$thisPage).get(0));}catch(err){}case 20:case'end':return _context46.stop();}}},_callee46,this);}));return function loadPageOnAppReady(){return _ref46.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){window.SoftInputMode.set('adjustPan');// listen for when the device keyboard is shown
window.addEventListener('keyboardDidShow',utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref47=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee47(){return regeneratorRuntime.wrap(function _callee47$(_context47){while(1){switch(_context47.prev=_context47.next){case 0:// remove listener for when the device keyboard is shown
window.removeEventListener('keyboardDidShow',utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShownAdjustView);// hide the tooltips on the login form
$('#login-page #login-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// hide the tooltips on the signup form
$('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// hide the tooltips on the forgot password form
$('#login-page #forgot-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// reset all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.reset();utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.reset();utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.reset();case 7:case'end':return _context47.stop();}}},_callee47,this);}));function pageHide(){return _ref47.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the tooltips on the login form
$('#login-page #login-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// destroy the tooltip
tooltipArrayElem.destroy();});// destroy the tooltips on the signup form
$('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.destroy();});// destroy the tooltips on the forgot password form
$('#login-page #forgot-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.destroy();});// destroy the password visibility button
$('#login-page #signup-password-view-button').get(0).ej2_instances[0].destroy();// destroy all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.destroy();utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.destroy();utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.destroy();},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function(){var _ref48=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee48(){return regeneratorRuntime.wrap(function _callee48$(_context48){while(1){switch(_context48.prev=_context48.next){case 0:return _context48.abrupt('return',$('#app-main-navigator').get(0).popPage());case 1:case'end':return _context48.stop();}}},_callee48,this);}));function backButtonClicked(){return _ref48.apply(this,arguments);}return backButtonClicked;}(),/**
         * method is triggered when the Sign In / Sign Up segment buttons are clicked
         *
         * @param itemIndex {Integer} zero-based index representing the carousel item to
         * display ewhen the button is clicked
         */segmentButtonClicked:function segmentButtonClicked(itemIndex){// move to the slide item specify by the provided parameter
$('#login-page #login-carousel').get(0).setActiveIndex(itemIndex);},/**
         * method is triggered when the Password Visibility button is clicked
         *
         * @param buttonElement {HTMLElement} button element being clicked
         *
         * @param inputId {String} the id for the input whose content visibility is being changed
         */passwordVisibilityButtonClicked:function passwordVisibilityButtonClicked(buttonElement,inputId){// check the state of the button is it 'active' or not
if(!$(buttonElement).hasClass('e-active')){// button is not active
// change the type for the input field
$(document.getElementById(inputId)).attr("type","text");// change the icon on the button to indicate the change in visibility
var ej2Button=buttonElement.ej2_instances[0];ej2Button.iconCss='zmdi zmdi-eye-off';ej2Button.dataBind();}else{// button is active
// change the type for the input field
$(document.getElementById(inputId)).attr("type","password");// change the icon on the button to indicate the change in visibility
var _ej2Button=buttonElement.ej2_instances[0];_ej2Button.iconCss='zmdi zmdi-eye';_ej2Button.dataBind();}},/**
         * method is used to track changes on the carousel slides for
         * displaying the various screens i.e. login or signup etc
         *
         * @param event
         */changeScreenCarouselPostChange:function changeScreenCarouselPostChange(event){// use the switch case to determine what carousel is being shown
switch(event.originalEvent.activeIndex){// get the index of the active carousel item
case 0:// reset the the segment button contained in the other carousel items to their initial state
$("#login-page ons-carousel-item.second .login-segment button:nth-of-type(2) input").prop("checked",true);$("#login-page ons-carousel-item.second .login-segment button:nth-of-type(1) input").prop("checked",false);$("#login-page ons-carousel-item.third .login-segment button input").prop("checked",false);// scroll to the top of the active carousel item
$('#login-page ons-carousel-item.first .login-page-form-container').scrollTop(0);break;case 1:// reset the the segment button contained in the other carousel items to their initial state
$("#login-page ons-carousel-item.first .login-segment button:nth-of-type(1) input").prop("checked",true);$("#login-page ons-carousel-item.first .login-segment button:nth-of-type(2) input").prop("checked",false);$("#login-page ons-carousel-item.third .login-segment button input").prop("checked",false);// scroll to the top of the active carousel item
$('#login-page ons-carousel-item.second .login-page-form-container').scrollTop(0);break;case 2:// reset the the segment button contained in the other carousel items to their initial state
$("#login-page ons-carousel-item.first .login-segment button:nth-of-type(1) input").prop("checked",true);$("#login-page ons-carousel-item.first .login-segment button:nth-of-type(2) input").prop("checked",false);$("#login-page ons-carousel-item.second .login-segment button:nth-of-type(2) input").prop("checked",true);$("#login-page ons-carousel-item.second .login-segment button:nth-of-type(1) input").prop("checked",false);$('#login-page ons-carousel-item.third .login-page-form-container').scrollTop(0);break;}},/**
         * method is used to track changes on the carousel slides for
         * hiding the tooltips on the previously displayed slide
         *
         * @param event
         */hideTooltipsCarouselPostChange:function hideTooltipsCarouselPostChange(event){// use the switch case to determine what carousel item was PREVIOUSLY shown
switch(event.originalEvent.lastActiveIndex){// get the index of the LAST active carousel item
case 0:// hide the tooltips on the login form
$('#login-page #login-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});break;case 1:// hide the tooltips on the signup form
$('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});break;case 2:// hide the tooltips on the forgot password form
$('#login-page #forgot-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});break;}},/**
         * method is triggered when the keyboard is shown.
         * It is used to adjust the display height
         *
         * @param event
         */keyboardShownAdjustView:function keyboardShownAdjustView(event){// get the height of the keyboard and add 6000px to it
var adjustedKeyboardHeight=Math.ceil(event.keyboardHeight)+6000;switch($('#login-page #login-carousel').get(0).getActiveIndex()){// get the active carousel item
case 0:// add padding to the bottom, to allow elements to scroll into view
$("#login-page ons-carousel-item.first .login-page-form-container").css({"padding-bottom":adjustedKeyboardHeight+"px"});// scroll to the currently focused input element
$("#login-page ons-carousel-item.first .login-page-form-container").scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top-30));break;case 1:// add padding to the bottom, to allow elements to scroll into view
$("#login-page ons-carousel-item.second .login-page-form-container").css({"padding-bottom":adjustedKeyboardHeight+"px"});// scroll to the currently focused input element
$("#login-page ons-carousel-item.second .login-page-form-container").scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top-30));break;case 2:// add padding to the bottom, to allow elements to scroll into view
$("#login-page ons-carousel-item.third .login-page-form-container").css({"padding-bottom":adjustedKeyboardHeight+"px"});// scroll to the currently focused input element
$("#login-page ons-carousel-item.third .login-page-form-container").scrollTop(Math.floor($(document.activeElement).closest("ons-input").position().top-30));break;}},/**
         * method is triggered when the "Sign In" button is clicked
         *
         * @returns {Promise<void>}
         */signinButtonClicked:function(){var _ref49=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee49(){return regeneratorRuntime.wrap(function _callee49$(_context49){while(1){switch(_context49.prev=_context49.next){case 0:// run the validation method for the sign-in form
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.loginFormValidator.whenValidate();case 1:case'end':return _context49.stop();}}},_callee49,this);}));function signinButtonClicked(){return _ref49.apply(this,arguments);}return signinButtonClicked;}(),/**
         * method is triggered when the "Sign Up" button is clicked
         *
         * @returns {Promise<void>}
         */signupButtonClicked:function(){var _ref50=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee50(){return regeneratorRuntime.wrap(function _callee50$(_context50){while(1){switch(_context50.prev=_context50.next){case 0:// run the validation method for the sign-in form
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.signupFormValidator.whenValidate();case 1:case'end':return _context50.stop();}}},_callee50,this);}));function signupButtonClicked(){return _ref50.apply(this,arguments);}return signupButtonClicked;}(),/**
         * method is triggered when the "Forgot Password" button is clicked
         *
         * @returns {Promise<void>}
         */forgotPasswordButtonClicked:function(){var _ref51=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee51(){return regeneratorRuntime.wrap(function _callee51$(_context51){while(1){switch(_context51.prev=_context51.next){case 0:// open inapp browser for user to reset password
cordova.InAppBrowser.open(window.encodeURI('https://shopoakexclusive.com/my-account/lost-password/'),'_blank','location=yes,clearcache=yes,clearsessioncache=yes,closebuttoncolor=#ffffff,hardwareback=no,hidenavigationbuttons=yes,hideurlbar=yes,zoom=no,toolbarcolor=#3f51b5');case 1:case'end':return _context51.stop();}}},_callee51,this);}));function forgotPasswordButtonClicked(){return _ref51.apply(this,arguments);}return forgotPasswordButtonClicked;}(),/**
         * method is triggered when the "Reset Password" button is clicked
         *
         * @returns {Promise<void>}
         */resetPasswordButtonClicked:function(){var _ref52=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee52(){return regeneratorRuntime.wrap(function _callee52$(_context52){while(1){switch(_context52.prev=_context52.next){case 0:// run the validation method for the sign-in form
utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.forgotPasswordFormValidator.whenValidate();case 1:case'end':return _context52.stop();}}},_callee52,this);}));function resetPasswordButtonClicked(){return _ref52.apply(this,arguments);}return resetPasswordButtonClicked;}(),/**
         * method is triggered when the 3rd-party login button is clicked
         *
         * @param loginMode {String} this parameter identifies whether the user mode is
         * 'sign in' or 'sign up'
         *
         * @returns {Promise<void>}
         */thirdPartyLoginButtonClicked:function(){var _ref53=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee56(){var loginMode=arguments.length>0&&arguments[0]!==undefined?arguments[0]:'sign in';var toast;return regeneratorRuntime.wrap(function _callee56$(_context56){while(1){switch(_context56.prev=_context56.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context56.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to '+loginMode;toast.dataBind();toast.show();return _context56.abrupt('return');case 10:// hide the tooltips on the login form
$('#login-page #login-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// hide the tooltips on the signup form
$('#login-page #signup-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});if(loginMode==="sign in"){// the user is signing in
$('#third-party-login-modal #third-party-login-notice').css("display","block");// show notice
}if(loginMode==="sign up"){// the user is signing up
$('#third-party-login-modal #third-party-login-notice').css("display","none");// hide notice
}// open the 'third-party-login-modal'
$('#third-party-login-modal').get(0).show();// show the loader within the modal
$('#third-party-login-modal #third-party-login-loader').css("display","block");// start the firebase ui app
utopiasoftware[utopiasoftware_app_namespace].model.firebaseUI.start('#third-party-login-block',{signInOptions:[// Leave the lines as is for the providers you want to offer your users.
firebase.auth.GoogleAuthProvider.PROVIDER_ID,{provider:firebase.auth.FacebookAuthProvider.PROVIDER_ID,customParameters:{// Forces password re-entry.
auth_type:'reauthenticate'}},firebase.auth.TwitterAuthProvider.PROVIDER_ID],//terms of service url
tosUrl:'https://shopoakexclusive.com/terms-of-service.php',// Privacy policy url
privacyPolicyUrl:"https://shopoakexclusive.com/privacy-policy.php",//callbacks/handlers
callbacks:{uiShown:function uiShown(){// triggered callback when firebase ui is displayed
// hide the loader within the modal
$('#third-party-login-modal #third-party-login-loader').css("display","none");},signInFailure:function(){var _ref54=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee54(){return regeneratorRuntime.wrap(function _callee54$(_context54){while(1){switch(_context54.prev=_context54.next){case 0:return _context54.abrupt('return',new Promise(function(){var _ref55=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee53(resolve,reject){var toast;return regeneratorRuntime.wrap(function _callee53$(_context53){while(1){switch(_context53.prev=_context53.next){case 0:_context53.next=2;return $('#third-party-login-modal').get(0).hide();case 2:// inform the user of the error
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3500;toast.content='Error with user '+loginMode+'. Try again ';toast.dataBind();toast.show();resolve();// resolve the promise
case 11:case'end':return _context53.stop();}}},_callee53,this);}));return function(_x22,_x23){return _ref55.apply(this,arguments);};}()));case 1:case'end':return _context54.stop();}}},_callee54,this);}));function signInFailure(){return _ref54.apply(this,arguments);}return signInFailure;}(),signInSuccessWithAuthResult:function(){var _ref56=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee55(authResult){var resultArray,_toast,_toast2,userDetails,_toast3,_toast4;return regeneratorRuntime.wrap(function _callee55$(_context55){while(1){switch(_context55.prev=_context55.next){case 0:// triggers when forebase is successfully logged in
console.log("I GOT YOU",authResult);// hide the 'third-party-login-modal'
_context55.next=3;return $('#third-party-login-modal').get(0).hide();case 3:if(!(loginMode==="sign in")){_context55.next=46;break;}_context55.prev=4;// display modal to user that signin is being completed
$('#loader-modal-message').html("Completing Signin...");_context55.next=8;return $('#loader-modal').get(0).show();case 8:_context55.next=10;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/customers",type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{email:authResult.user.email}}));case 10:resultArray=_context55.sent;if(!(resultArray.length==0)){_context55.next=13;break;}throw"error";case 13:_context55.next=15;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/customers/'+resultArray[0].id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify({password:authResult.user.uid})}));case 15:resultArray[0]=_context55.sent;resultArray[0].password=authResult.user.uid;// save the created user details data to ENCRYPTED app database as cached data
_context55.next=19;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:resultArray[0]},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 19:_context55.next=21;return $('#loader-modal').get(0).hide();case 21:_context55.next=23;return utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked();case 23:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast=$('.timed-page-toast').get(0).ej2_instances[0];_toast.cssClass='success-ej2-toast';_toast.timeOut=3000;_toast.content='User signin completed';_toast.dataBind();_toast.show();_context55.next=46;break;case 33:_context55.prev=33;_context55.t0=_context55['catch'](4);console.log("SIGN IN ERROR",_context55.t0);// hide loader
_context55.next=38;return $('#loader-modal').get(0).hide();case 38:// hide loader
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast2=$('.timed-page-toast').get(0).ej2_instances[0];_toast2.cssClass='error-ej2-toast';_toast2.timeOut=3500;_toast2.content='User does not have an account. User signin failed ';_toast2.dataBind();_toast2.show();case 46:if(!(loginMode==="sign up")){_context55.next=85;break;}_context55.prev=47;// display modal to user that signin is being completed
$('#loader-modal-message').html("Completing Signup...");_context55.next=51;return $('#loader-modal').get(0).show();case 51:_context55.next=53;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/customers",type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify({email:authResult.user.email,username:authResult.user.email,password:authResult.user.uid})}));case 53:userDetails=_context55.sent;userDetails.password=authResult.user.uid;// save the created user details data to ENCRYPTED app database as cached data
_context55.next=57;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:userDetails},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 57:_context55.next=59;return $('#loader-modal').get(0).hide();case 59:_context55.next=61;return utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked();case 61:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast3=$('.timed-page-toast').get(0).ej2_instances[0];_toast3.cssClass='success-ej2-toast';_toast3.timeOut=3000;_toast3.content='User signup completed';_toast3.dataBind();_toast3.show();_context55.next=85;break;case 71:_context55.prev=71;_context55.t1=_context55['catch'](47);console.log("SIGN UP ERROR",_context55.t1);_context55.t1=JSON.parse(_context55.t1.responseText);// hide loader
_context55.next=77;return $('#loader-modal').get(0).hide();case 77:// hide loader
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast4=$('.timed-page-toast').get(0).ej2_instances[0];_toast4.cssClass='error-ej2-toast';_toast4.timeOut=3000;_toast4.content='Error. '+(_context55.t1.message||"User signup failed");_toast4.dataBind();_toast4.show();case 85:return _context55.abrupt('return',false);case 86:case'end':return _context55.stop();}}},_callee55,this,[[4,33],[47,71]]);}));function signInSuccessWithAuthResult(_x24){return _ref56.apply(this,arguments);}return signInSuccessWithAuthResult;}()}});// disable firebase ui auto-signin
utopiasoftware[utopiasoftware_app_namespace].model.firebaseUI.disableAutoSignIn();case 18:case'end':return _context56.stop();}}},_callee56,this);}));function thirdPartyLoginButtonClicked(){return _ref53.apply(this,arguments);}return thirdPartyLoginButtonClicked;}(),/**
         * method is triggered when the login form is successfully validated
         *
         * @returns {Promise<void>}
         */loginFormValidated:function(){var _ref57=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee59(){var toast,promisesArray,userEmail,userPassword,promisesArrayPromise;return regeneratorRuntime.wrap(function _callee59$(_context59){while(1){switch(_context59.prev=_context59.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context59.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to sign in';toast.dataBind();toast.show();return _context59.abrupt('return');case 10:// display modal to user that signin is being completed
$('#loader-modal-message').html("Completing Signin...");_context59.next=13;return $('#loader-modal').get(0).show();case 13:// show loader
promisesArray=[];// holds the array for the promises used to complete user signin
userEmail=$('#login-page #login-form #login-email').val().trim();// holds user email from the login form
userPassword=$('#login-page #login-form #login-password').val().trim();// holds the user password
// make the request to authenticate user login credentials
promisesArray.push(Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json",type:"get",// contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+Base64.encode(userEmail+':'+userPassword));},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false})));// make the request to retrieve a user with the specified login email
promisesArray.push(Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/customers",type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{email:userEmail}})));// get the promise created from the promisesArray
promisesArrayPromise=Promise.all(promisesArray);// listen for when the promisesArrayPromise resolves
promisesArrayPromise.then(function(){var _ref58=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee57(resultsArray){var toast;return regeneratorRuntime.wrap(function _callee57$(_context57){while(1){switch(_context57.prev=_context57.next){case 0:// add the user's password to the user details retrieved from the server
resultsArray[1][0].password=userPassword;// save the created user details data to ENCRYPTED app database as cached data
_context57.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:resultsArray[1][0]},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:_context57.next=5;return $('#loader-modal').get(0).hide();case 5:_context57.next=7;return utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked();case 7:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='success-ej2-toast';toast.timeOut=3000;toast.content='User signin completed';toast.dataBind();toast.show();case 15:case'end':return _context57.stop();}}},_callee57,this);}));return function(_x25){return _ref58.apply(this,arguments);};}()).catch(function(){var _ref59=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee58(err){var toast;return regeneratorRuntime.wrap(function _callee58$(_context58){while(1){switch(_context58.prev=_context58.next){case 0:// an error occurred
console.log("SIGN IN ERROR",err);err=JSON.parse(err.responseText);// hide loader
_context58.next=4;return $('#loader-modal').get(0).hide();case 4:// hide loader
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Invalid user email or password. User signin failed ';toast.dataBind();toast.show();case 12:case'end':return _context58.stop();}}},_callee58,this);}));return function(_x26){return _ref59.apply(this,arguments);};}());return _context59.abrupt('return',promisesArrayPromise);case 21:case'end':return _context59.stop();}}},_callee59,this);}));function loginFormValidated(){return _ref57.apply(this,arguments);}return loginFormValidated;}(),/**
         * method is triggered when the sign up form is successfully validated
         *
         * @returns {Promise<void>}
         */signupFormValidated:function(){var _ref60=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee62(){var toast,promisesArray;return regeneratorRuntime.wrap(function _callee62$(_context62){while(1){switch(_context62.prev=_context62.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context62.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to sign up';toast.dataBind();toast.show();return _context62.abrupt('return');case 10:// display modal to user that signup is being completed
$('#loader-modal-message').html("Completing Signup...");_context62.next=13;return $('#loader-modal').get(0).show();case 13:// show loader
promisesArray=[];// holds the array for the promises used to complete user signup
// make the request to create the new user account
promisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/customers",type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify({email:$('#login-page #signup-form #signup-email').val().trim(),username:$('#login-page #signup-form #signup-email').val().trim(),password:$('#login-page #signup-form #signup-password').val().trim()})})).then(function(){var _ref61=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee60(userDetails){var toast;return regeneratorRuntime.wrap(function _callee60$(_context60){while(1){switch(_context60.prev=_context60.next){case 0:// add the user's password to the user details retrieved from the server
userDetails.password=$('#login-page #signup-form #signup-password').val().trim();// save the created user details data to ENCRYPTED app database as cached data
_context60.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:userDetails},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:_context60.next=5;return $('#loader-modal').get(0).hide();case 5:_context60.next=7;return utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.backButtonClicked();case 7:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='success-ej2-toast';toast.timeOut=3000;toast.content='User signup completed';toast.dataBind();toast.show();resolve(userDetails);// resolve the parent promise with the data gotten from the server
case 16:case'end':return _context60.stop();}}},_callee60,this);}));return function(_x27){return _ref61.apply(this,arguments);};}()).catch(function(){var _ref62=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee61(err){var toast;return regeneratorRuntime.wrap(function _callee61$(_context61){while(1){switch(_context61.prev=_context61.next){case 0:// an error occurred
console.log("SIGN UP ERROR",err);err=JSON.parse(err.responseText);// hide loader
_context61.next=4;return $('#loader-modal').get(0).hide();case 4:// hide loader
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Error. '+(err.message||"User signup failed");toast.dataBind();toast.show();reject(err);// reject the parent promise with the error
case 13:case'end':return _context61.stop();}}},_callee61,this);}));return function(_x28){return _ref62.apply(this,arguments);};}());}));return _context62.abrupt('return',Promise.all(promisesArray));case 16:case'end':return _context62.stop();}}},_callee62,this);}));function signupFormValidated(){return _ref60.apply(this,arguments);}return signupFormValidated;}(),/**
         * method is triggered when the forgot password form is successfully validated
         *
         * @returns {Promise<void>}
         */forgotPasswordFormValidated:function(){var _ref63=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee63(){return regeneratorRuntime.wrap(function _callee63$(_context63){while(1){switch(_context63.prev=_context63.next){case 0:case'end':return _context63.stop();}}},_callee63,this);}));function forgotPasswordFormValidated(){return _ref63.apply(this,arguments);}return forgotPasswordFormValidated;}()},/**
     * this is the view-model/controller for the Products page
     */productsPageViewModel:{/**
         * property holds the current "page" of the categories being accessed
         */currentPage:0,/**
         * property holds the size i.e. number of items that can be contained in currentPage being accessed
         */pageSize:20,/**
         * property holds the height of the "content view" for the page
         */viewContentHeight:0,/**
         * property holds the index position of the last active
         * navigation tab before user landed on this page
         */lastActiveNavTab:0,/**
         * property holds the current query parameter used to display the products on screen
         */currentQueryParam:{status:"publish"},/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref64=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee64(){return regeneratorRuntime.wrap(function _callee64$(_context64){while(1){switch(_context64.prev=_context64.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context64.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context64.abrupt('return');case 3:// listen for the back button event
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.backButtonClicked;// add method to handle page-infinite-scroll
event.target.onInfiniteScroll=utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageInfiniteScroll;// add method to handle the loading action of the pull-to-refresh widget
$('#products-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#products-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#products-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#products-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#products-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});// get the height of the view content container
utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.viewContentHeight=Math.floor($('#products-page .page__content').height());// listen for the scroll event on the page
$('#products-page .page__content').on("scroll",function(){// handle the logic in a different event queue slot
window.setTimeout(function(){// get the scrollTop position of the view content
var scrollTop=Math.floor($('#products-page .page__content').scrollTop());// get the percentage of scroll that has taken place from the top position
var percentageScroll=scrollTop/utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.viewContentHeight*100;if(percentageScroll>=50){// if the scroll position is >= halfway
$('#products-page #products-page-scroll-top-fab').css({"transform":"scale(1)","display":"inline-block"});}else{// if the scroll position is < halfway
$('#products-page #products-page-scroll-top-fab').css({"transform":"scale(0)"});}},0);});// listen for when the navigation tab has changed and update the lastActiveNavTab
$('#app-main-tabbar').on("prechange",function(event){if(event.originalEvent.index===4){// if the tab index is this page, don't update the lastActiveNavTab
return;// exit the method
}utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.lastActiveNavTab=event.originalEvent.index;});// LISTEN FOR WHEN A PRODUCT CARD IS CLICKED
$thisPage.on("click",".e-card",function(event){// call the method to load the product details page based on the product item clicked
utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.productItemClicked(window.parseInt($(event.currentTarget).attr('data-product')),window.parseInt($(event.currentTarget).attr('data-page')));});try{}catch(err){}case 12:case'end':return _context64.stop();}}},_callee64,this);}));return function loadPageOnAppReady(){return _ref64.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(event){$('#app-main-page ons-toolbar div.title-bar').html("Products");// change the title of the screen
// update cart count
$('#app-main-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);// check if the page content should be reset
if($('#app-main-navigator').get(0)._resetPageDisplay!==false){// page content can be refreshed
// flag that page infinite scroll should NOT be allowed
event.target._allowInfinitePageScroll=false;// show the preloader
$('#products-page .page-preloader').css("display","block");// empty the content of the page
$('#products-page #products-contents-container').html('');// hide the page scroll fab
$('#products-page #products-page-scroll-top-fab').css({"display":"none"});}window.SoftInputMode.set('adjustPan');// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOnlineListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref65=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee65(event){return regeneratorRuntime.wrap(function _callee65$(_context65){while(1){switch(_context65.prev=_context65.next){case 0:// flag that page infinite scroll should NOT be allowed
event.target._allowInfinitePageScroll=false;delete $('#app-main-navigator').get(0)._resetPageDisplay;// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.deviceOnlineListener,false);// remove all the infinite load indicator from the bottom of the page (if any exist)
$('#products-page .page__content .infinite-load-container').remove();case 5:case'end':return _context65.stop();}}},_callee65,this);}));function pageHide(_x29){return _ref65.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// go to the last active page (tab)
$('#app-main-tabbar').get(0).setActiveTab(utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.lastActiveNavTab);},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');// hide all previously displayed ej2 toast
toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to see updated products";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref66=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee66(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var productArray,toast;return regeneratorRuntime.wrap(function _callee66$(_context66){while(1){switch(_context66.prev=_context66.next){case 0:// disable pull-to-refresh widget till loading is done
$('#products-page #products-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');_context66.prev=2;_context66.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts(utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentQueryParam,1);case 5:productArray=_context66.sent;_context66.next=8;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0]);case 8:_context66.next=17;break;case 10:_context66.prev=10;_context66.t0=_context66['catch'](2);// an error occurred
// display toast to show that error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content="Sorry, an error occurred. Refresh to try again";toast.dataBind();toast.show();case 17:_context66.prev=17;// hide the page preloader
$('#products-page .page-preloader').css("display","none");// enable pull-to-refresh widget till loading is done
$('#products-page #products-page-pull-hook').removeAttr("disabled");// signal that loading is done
doneCallBack();return _context66.finish(17);case 22:case'end':return _context66.stop();}}},_callee66,this,[[2,10,17,22]]);}));function pagePullHookAction(){return _ref66.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pageInfiniteScroll:function(){var _ref67=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee67(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var productArray,toast;return regeneratorRuntime.wrap(function _callee67$(_context67){while(1){switch(_context67.prev=_context67.next){case 0:if(!($('#products-page').get(0)._allowInfinitePageScroll===false)){_context67.next=3;break;}// page infinite scroll is NOT allowed
doneCallBack();return _context67.abrupt('return');case 3:// append an infinite load indicator to the bottom of the page
$('#products-page .page__content').append('<div class="infinite-load-container" style="text-align: center">\n                        <ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>\n                    </div>');// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');productArray=[];// holds the array of products retrieved for display
_context67.prev=6;_context67.next=9;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.loadProducts(utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentQueryParam,utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage+1);case 9:productArray=_context67.sent;_context67.next=12;return utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.displayPageContent(productArray[0],true,false);case 12:_context67.next=21;break;case 14:_context67.prev=14;_context67.t0=_context67['catch'](6);// an error occurred
// display toast to show that error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content="Sorry, an error occurred. Refresh to try again";toast.dataBind();toast.show();case 21:_context67.prev=21;// check if any new products were retrieved
if(productArray&&productArray[0].length>0){// products were retrieve
// remove the infinite load indicator from the bottom of the page
$('#products-page .page__content .infinite-load-container').remove();}else{// no products were retrieved
$('#products-page .page__content .infinite-load-container').css({"visibility":"hidden"});}// signal that loading is done
doneCallBack();return _context67.finish(21);case 25:case'end':return _context67.stop();}}},_callee67,this,[[6,14,21,25]]);}));function pageInfiniteScroll(){return _ref67.apply(this,arguments);}return pageInfiniteScroll;}(),/**
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
         */loadProducts:function(){var _ref68=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee68(queryParam){var pageToAccess=arguments.length>1&&arguments[1]!==undefined?arguments[1]:queryParam.page||utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage+1;var pageSize=arguments.length>2&&arguments[2]!==undefined?arguments[2]:queryParam.per_page||utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.pageSize;var productPromisesArray,toast;return regeneratorRuntime.wrap(function _callee68$(_context68){while(1){switch(_context68.prev=_context68.next){case 0:queryParam.page=pageToAccess;queryParam.per_page=pageSize;productPromisesArray=[];// holds the array for the promises used to load the products
// check if there is internet connection or not
if(navigator.connection.type!==Connection.NONE){// there is internet connection
// load the requested products list from the server
productPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/products",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:queryParam})).then(function(productsArray){// check if there is any data to cache in the app database
if(productsArray.length>0){// there is data to cache
// generate an id for the data being cached
var cachedDataId=(""+pageToAccess).padStart(7,"0")+"products";// save the retrieved data to app database as cached data
utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:cachedDataId,docType:"PRODUCTS",products:productsArray},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);// update the current page being viewed
utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage=queryParam.page;// update the current query parameter for the page
utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentQueryParam=queryParam;}resolve(productsArray);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}// end of loading products with Internet Connection
else{// there is no internet connection
// display toast to show that there is no internet connection
toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Pull down to refresh and see updated products";toast.dataBind();toast.show();// load the requested products from cached data
productPromisesArray.push(new Promise(function(resolve,reject){// generate the id for the cached data being retrieved
var cachedDataId=(""+pageToAccess).padStart(7,"0")+"products";Promise.resolve(utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData(cachedDataId,utopiasoftware[utopiasoftware_app_namespace].model.appDatabase)).then(function(cachedProductsData){// update the current page being viewed
utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage=queryParam.page;resolve(cachedProductsData.products);// resolve the parent promise with the cached products data
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}return _context68.abrupt('return',Promise.all(productPromisesArray));case 5:case'end':return _context68.stop();}}},_callee68,this);}));function loadProducts(_x34){return _ref68.apply(this,arguments);}return loadProducts;}(),/**
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
         */displayPageContent:function(){var _ref69=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee69(productsArray){var appendContent=arguments.length>1&&arguments[1]!==undefined?arguments[1]:true;var overwriteContent=arguments.length>2&&arguments[2]!==undefined?arguments[2]:true;var displayCompletedPromise;return regeneratorRuntime.wrap(function _callee69$(_context69){while(1){switch(_context69.prev=_context69.next){case 0:displayCompletedPromise=new Promise(function(resolve,reject){var productsContent="";// holds the contents for the products
// check if the productsArray is empty or not
if(productsArray.length<=0){// there are no new content to display
resolve(productsArray.length);// resolve promise with the length of the products array
}else{// there are some products to display
// loop through the array content and display it
for(var index=0;index<productsArray.length;index++){if(!productsArray[index].regular_price||productsArray[index].regular_price==""){// regular price was NOT set, so set it
productsArray[index].regular_price="0.00";}productsContent+='<div class="col-xs-4" ';if((index+1)%3!==0){// this is NOT the last column in the row
productsContent+='style="border-right: 1px lightgray solid; border-bottom: 1px lightgray solid">';}else{// this is the last column in the row
productsContent+='style="border-bottom: 1px lightgray solid">';}productsContent+='\n                        <ons-ripple background="rgba(63, 81, 181, 0.3)"></ons-ripple>\n                        <div class="e-card" \n                        data-product="'+index+'" \n                        data-page="'+utopiasoftware[utopiasoftware_app_namespace].controller.productsPageViewModel.currentPage+'">\n                            <div class="e-card-image" style="min-height: 100px; \n                            background-image: url(\''+productsArray[index].images[0].src+'\');">\n                            '+(productsArray[index].on_sale===true?'\n                            <span class="e-badge e-badge-danger" style="float: right; clear: both; \n                                                    background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 0.6em;">\n                                                    '+Math.ceil(Math.abs(kendo.parseFloat(productsArray[index].price)-kendo.parseFloat(productsArray[index].regular_price))/kendo.parseFloat(productsArray[index].regular_price==="0.00"?productsArray[index].price:productsArray[index].regular_price)*100)+'% OFF\n                             </span>':"")+'\n                            </div>\n                            <div class="e-card-header">\n                                <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">\n                                    <div class="e-card-sub-title" style="color: #000000; font-size: 14px; text-align: center; text-transform: capitalize">\n                                        '+productsArray[index].name+'\n                                    </div>\n                        <div style="color: gold; font-size: 0.6em !important; white-space: nowrap !important; \n                        text-overflow: ellipsis; overflow: hidden;">\n                        '+(Math.floor(kendo.parseFloat(productsArray[index].average_rating))>0?'<ons-icon icon="md-star" fixed-width></ons-icon>'.repeat(Math.floor(kendo.parseFloat(productsArray[index].average_rating))):'<ons-icon icon="md-star-outline" style="color: lightgray" fixed-width></ons-icon>'.repeat(5))+'\n                            <span style="display: inline-block; color: gray;">\n                            '+(Math.floor(kendo.parseFloat(productsArray[index].average_rating))>0?'('+productsArray[index].rating_count+')':"")+'\n                           </span>\n                        </div>\n                        <div class="e-card-sub-title" style="text-align: left;">&#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].price),"n2")+'</div>\n                        <div class="e-card-sub-title" style="text-align: left; text-decoration: line-through; \n                        '+(productsArray[index].on_sale===true?"visibility: visible":"visibility: hidden")+'">&#x20a6;'+kendo.toString(kendo.parseFloat(productsArray[index].regular_price),"n2")+'</div>\n                        </div>\n                        </div>\n                        </div>\n                        </div>';}// check if the contents are to be overwritten
if(overwriteContent===true){// content wants to be overwritten
$('#products-page #products-contents-container').html(productsContent);}else{// content is NOT to be overwritten
if(appendContent===true){// append content
$('#products-page #products-contents-container').append(productsContent);}else{// prepend content
$('#products-page #products-contents-container').prepend(productsContent);}}// allow infinite page scroll to be triggered
$('#products-page').get(0)._allowInfinitePageScroll=true;resolve(productsArray.length);// resolve the promise with length of the productsArray
}});return _context69.abrupt('return',displayCompletedPromise);case 2:case'end':return _context69.stop();}}},_callee69,this);}));function displayPageContent(_x37){return _ref69.apply(this,arguments);}return displayPageContent;}(),/**
         * method scrolls the page to the top
         * @returns {Promise<void>}
         */scrollPageToTop:function(){var _ref70=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee70(){return regeneratorRuntime.wrap(function _callee70$(_context70){while(1){switch(_context70.prev=_context70.next){case 0:window.setTimeout(function(){$('#products-page .page__content').animate({scrollTop:0},400);},0);case 1:case'end':return _context70.stop();}}},_callee70,this);}));function scrollPageToTop(){return _ref70.apply(this,arguments);}return scrollPageToTop;}(),/**
         * method is triggered when the user clicks any product item from the products collection
         *
         * @param productIndex {Integer} holds the index position for the product that was clicked.
         * The index position is gotten from the 'appropriate' cached array of product items
         *
         * @param productPage {Integer} specifies which query page/collection from the cached products
         * the clicked product item belongs to.
         *
         * @returns {Promise<void>}
         */productItemClicked:function(){var _ref71=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee72(productIndex,productPage){return regeneratorRuntime.wrap(function _callee72$(_context72){while(1){switch(_context72.prev=_context72.next){case 0:// handle the function task in a different event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee71(){var productItemsArray;return regeneratorRuntime.wrap(function _callee71$(_context71){while(1){switch(_context71.prev=_context71.next){case 0:_context71.prev=0;_context71.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData((""+productPage).padStart(7,"0")+"products",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 3:productItemsArray=_context71.sent.products;// display the products details page using the selected product
$('#app-main-navigator').get(0).pushPage("product-details-page.html",{animation:"lift",data:{product:productItemsArray[productIndex]}});_context71.next=9;break;case 7:_context71.prev=7;_context71.t0=_context71['catch'](0);case 9:case'end':return _context71.stop();}}},_callee71,this,[[0,7]]);})),0);case 1:case'end':return _context72.stop();}}},_callee72,this);}));function productItemClicked(_x38,_x39){return _ref71.apply(this,arguments);}return productItemClicked;}()},/**
     * this is the view-model/controller for the Product Details page
     */productDetailsPageViewModel:{/**
         * holds the object which contains the current product and its details
         */currentProductDetails:null,/**
         * holds the index position (within the productVaritionsArray) of the
         * current product variation selected by the user
         */currentProductVariationIndex:-1,/**
         * holds the product variations array
         */productVariationsArray:[],/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref73=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee74(){var productDetailsArray,toast;return regeneratorRuntime.wrap(function _callee74$(_context74){while(1){switch(_context74.prev=_context74.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context74.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context74.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#product-details-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#product-details-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#product-details-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#product-details-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#product-details-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});_context74.prev=6;// create the "Pick Quantity" button
new ej.inputs.NumericTextBox({cssClass:'product-details-quantity-class',currency:null,decimals:0,floatLabelType:'Auto',format:'n',showSpinButton:false,min:1,max:10,placeholder:'Pick Quantity',step:1,strictMode:true,// sets value to the NumericTextBox
value:1}).appendTo('#product-details-quantity');// create the "Add To Cart" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#product-details-add-to-cart');// create the "Customise" button
new ej.buttons.Button({//iconCss: "zmdi zmdi-brush utopiasoftware-icon-zoom-one-point-two",
//iconPosition: "Left"
}).appendTo('#product-details-customise-product');// create the "Review" button
new ej.buttons.Button({cssClass:'e-flat e-small',iconCss:"zmdi zmdi-star-outline",iconPosition:"Left"}).appendTo('#product-details-review');// create the "Share" button
new ej.buttons.Button({cssClass:'e-flat e-small',iconCss:"zmdi zmdi-share",iconPosition:"Left"}).appendTo('#product-details-share');// create the product-rater widget. which is contained in the 'rate-product-modal'
$('#rate-product-modal #rate-product-rater-widget').rateYo({starWidth:"20px",normalFill:"#808080",ratedFill:"#F39C12",numStars:5,precision:0,rating:0,fullStar:true,spacing:"10px",onChange:function(){var _ref74=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee73(ratingValue,ratingWidgetInstance){return regeneratorRuntime.wrap(function _callee73$(_context73){while(1){switch(_context73.prev=_context73.next){case 0:// enable the the comment input and "Rate" button
$('#rate-product-modal #rate-product-comment').removeAttr("disabled");$('#rate-product-modal #rate-product-rate-button').removeAttr("disabled");case 2:case'end':return _context73.stop();}}},_callee73,this);}));function onChange(_x40,_x41){return _ref74.apply(this,arguments);}return onChange;}()});// load product variations asynchronously without waiting for the response
utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.loadProductVariations();// load product details
_context74.next=16;return utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.loadProduct();case 16:productDetailsArray=_context74.sent;_context74.next=19;return utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.displayProductDetails(productDetailsArray[0]);case 19:// enable the "Add To Cart" button
$('#product-details-page #product-details-add-to-cart').removeAttr("disabled");_context74.next=30;break;case 22:_context74.prev=22;_context74.t0=_context74['catch'](6);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 30:_context74.prev=30;// hide the preloader
$('#product-details-page .page-preloader').css("display","none");return _context74.finish(30);case 33:case'end':return _context74.stop();}}},_callee74,this,[[6,22,30,33]]);}));return function loadPageOnAppReady(){return _ref73.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// update cart count
$('#product-details-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustResize');},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref75=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee75(){return regeneratorRuntime.wrap(function _callee75$(_context75){while(1){switch(_context75.prev=_context75.next){case 0:case'end':return _context75.stop();}}},_callee75,this);}));function pageHide(){return _ref75.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy properties
utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails=null;utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex=-1;// reset the product variations array
utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.productVariationsArray=[];// destroy the ej2 components on the page
$('#product-details-quantity').get(0).ej2_instances[0].destroy();$('#product-details-review').get(0).ej2_instances[0].destroy();$('#product-details-share').get(0).ej2_instances[0].destroy();$('#product-details-add-to-cart').get(0).ej2_instances[0].destroy();$('#product-details-customise-product').get(0).ej2_instances[0].destroy();// destroy any product variation dropdown list
$('#product-details-page .product-details-variation-option').each(function(index,element){element.ej2_instances[0].destroy();// destroy the dropdown list component
});// destroy the product rater widget
$("#rate-product-modal #rate-product-rater-widget").rateYo("destroy");// reset the review comment textarea
$('#rate-product-modal #rate-product-comment').val("");$('#rate-product-modal #rate-product-comment').attr("disabled",true);},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get the pages stack from the app main navigator
var pagesStackArray=$('#app-main-navigator').get(0).pages;// check that there is more than 1 page in the stack
if(pagesStackArray.length>1){// there is more than 1 page in the page stack
// get the previous Page in stack before this one
var previousPage=$(pagesStackArray[pagesStackArray.length-2]).get(0);// check which page has is being displayed AFTER a page was popped
switch(previousPage.id){case"app-main-page":// the page that is being displayed is the "App-Main" page
// check which page on the app-main tab is visible
if($('#app-main-tabbar').get(0).getActiveTabIndex()===4){// the "Products" page is visible
// get back to the previous page on the app-main navigator stack
// and set the 'resetPageDisplay' to false
$('#app-main-navigator').get(0)._resetPageDisplay=false;// allow infinite page scroll to be triggered on the "Products" page
$('#products-page').get(0)._allowInfinitePageScroll=true;$('#app-main-navigator').get(0).popPage();}else{// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();}break;default:// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();break;}}else{// there is only 1 page in the stack
}},/**
         * method is triggered when the "Share" button is clicked
         * @returns {Promise<void>}
         */shareButtonClicked:function(){var _ref76=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee76(){var shareOptions;return regeneratorRuntime.wrap(function _callee76$(_context76){while(1){switch(_context76.prev=_context76.next){case 0:shareOptions={};// holds the options for sharing
shareOptions.message="check out this #ShopOakExclusive product";shareOptions.chooserTitle="share product with...";// handle the task in a separate event block
window.setTimeout(function(){if(utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex!==-1){// a product variation was selected
// get the index of the currently selected variation
var productVariationIndex=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex;// get the currently selected product variation using the selected index
var productVariation=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.productVariationsArray[productVariationIndex];// update the url for the product
shareOptions.url=productVariation.permalink;// update the file/image of the product to be share
shareOptions.files=[productVariation.image&&productVariation.image!==""?productVariation.image.src:utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails.images[0].src];}else{// no product variation was selected, so use the default product details
shareOptions.url=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails.permalink;// update the file/image of the product to be share
shareOptions.files=[utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails.images[0].src];}// also copy the text to clipboard
cordova.plugins.clipboard.copy(shareOptions.message+' | '+shareOptions.url,function(){// inform the user that message has been copied to clipboard
window.plugins.toast.showWithOptions({message:"shared message copied to clipboard",duration:3000,position:"center",styling:{cornerRadius:0,opacity:1,backgroundColor:'#3F51B5',textColor:'#FFFFFF',textSize:14}});},function(){});// open the device share dialog
window.plugins.socialsharing.shareWithOptions(shareOptions,function(){},function(){});},0);case 4:case'end':return _context76.stop();}}},_callee76,this);}));function shareButtonClicked(){return _ref76.apply(this,arguments);}return shareButtonClicked;}(),/**
         * method is triggered when the "Rate" button is clicked
         * @returns {Promise<void>}
         */rateButtonClicked:function(){var _ref77=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee79(){var userDetails,toast,_toast5,ordersArray,_toast6;return regeneratorRuntime.wrap(function _callee79$(_context79){while(1){switch(_context79.prev=_context79.next){case 0:userDetails=null;// holds the user details
// display page preloader
$('#product-details-page .page-preloader').css("display","block");// check if a user has signed in
_context79.prev=2;_context79.next=5;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 5:userDetails=_context79.sent.userDetails;_context79.next=20;break;case 8:_context79.prev=8;_context79.t0=_context79['catch'](2);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3500;toast.content='Please sign in to rate this product';toast.dataBind();toast.show();// hide page preloader
$('#product-details-page .page-preloader').css("display","none");return _context79.abrupt('return');case 20:if(!(navigator.connection.type===Connection.NONE)){_context79.next=31;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast5=$('.timed-page-toast').get(0).ej2_instances[0];_toast5.cssClass='error-ej2-toast';_toast5.timeOut=3000;_toast5.content='Connect to the Internet to rate this product';_toast5.dataBind();_toast5.show();// hide page preloader
$('#product-details-page .page-preloader').css("display","none");return _context79.abrupt('return');case 31:_context79.prev=31;// display the page loader modal
$('#product-details-page .modal').css("display","table");// check if the current user has ever purchased this product before
_context79.next=35;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/orders',type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{status:"completed",customer:userDetails.id,product:utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails.id}}));case 35:ordersArray=_context79.sent;if(!(ordersArray.length===0)){_context79.next=38;break;}throw"error";case 38:_context79.next=51;break;case 40:_context79.prev=40;_context79.t1=_context79['catch'](31);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast6=$('.timed-page-toast').get(0).ej2_instances[0];_toast6.cssClass='error-ej2-toast';_toast6.timeOut=3500;_toast6.content='Sorry, you need to have purchased this product before it can be rated';_toast6.dataBind();_toast6.show();return _context79.abrupt('return');case 51:_context79.prev=51;// hide page preloader
$('#product-details-page .page-preloader').css("display","none");// hide page loader
$('#product-details-page .modal').css("display","none");return _context79.finish(51);case 55:// set the handlers for the buttons on the "Rate Product" modal
$('#rate-product-modal #rate-product-cancel-button').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee77(){return regeneratorRuntime.wrap(function _callee77$(_context77){while(1){switch(_context77.prev=_context77.next){case 0:_context77.next=2;return $('#rate-product-modal').get(0).hide();case 2:case'end':return _context77.stop();}}},_callee77,this);}));$('#rate-product-modal #rate-product-rate-button').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee78(){var _toast7,_toast8;return regeneratorRuntime.wrap(function _callee78$(_context78){while(1){switch(_context78.prev=_context78.next){case 0:_context78.prev=0;_context78.next=3;return $('#rate-product-modal').get(0).hide();case 3:// inform user that review is being sent
$('#loader-modal-message').html("Sending User Review...");_context78.next=6;return $('#loader-modal').get(0).show();case 6:_context78.next=8;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/products/reviews',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify({product_id:utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails.id,status:"hold",reviewer:userDetails.first_name,reviewer_email:userDetails.email,review:$('#rate-product-modal #rate-product-comment').val().trim(),rating:$('#rate-product-modal #rate-product-rater-widget').rateYo("rating"),verified:true})}));case 8:// reset the review widget and the review comment textarea
$('#rate-product-modal #rate-product-rater-widget').rateYo("rating",0);$('#rate-product-modal #rate-product-comment').val("");$('#rate-product-modal #rate-product-comment').attr("disabled",true);// hide the loader
_context78.next=13;return $('#loader-modal').get(0).hide();case 13:// hide loader
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show success
_toast7=$('.timed-page-toast').get(0).ej2_instances[0];_toast7.cssClass='success-ej2-toast';_toast7.timeOut=3500;_toast7.content='Thank you. Your product review has been received';_toast7.dataBind();_toast7.show();_context78.next=37;break;case 23:_context78.prev=23;_context78.t0=_context78['catch'](0);_context78.next=27;return $('#loader-modal').get(0).hide();case 27:_context78.next=29;return $('#rate-product-modal').get(0).show();case 29:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show error
_toast8=$('.timed-page-toast').get(0).ej2_instances[0];_toast8.cssClass='error-ej2-toast';_toast8.timeOut=3500;_toast8.content='Error. Your product review could not be sent. Please retry';_toast8.dataBind();_toast8.show();case 37:_context78.prev=37;return _context78.finish(37);case 39:_context78.next=41;return $('#rate-product-modal').get(0).hide();case 41:case'end':return _context78.stop();}}},_callee78,this,[[0,23,37,39]]);}));// display "Rate Product" modal
_context79.next=59;return $('#rate-product-modal').get(0).show();case 59:case'end':return _context79.stop();}}},_callee79,this,[[2,8],[31,40,51,55]]);}));function rateButtonClicked(){return _ref77.apply(this,arguments);}return rateButtonClicked;}(),/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref80=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee80(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var productDetailsArray,toast;return regeneratorRuntime.wrap(function _callee80$(_context80){while(1){switch(_context80.prev=_context80.next){case 0:// disable pull-to-refresh widget till loading is done
$('#product-details-page #product-details-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// disable the "Add To Cart" button
$('#product-details-page #product-details-add-to-cart').attr("disabled",true);// remove the spinner from the 'Add To Cart'
$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].dataBind();$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].stop();_context80.prev=6;// load product variations asynchronously without waiting for the response
utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.loadProductVariations();// load product details
_context80.next=10;return utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.loadProduct();case 10:productDetailsArray=_context80.sent;_context80.next=13;return utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.displayProductDetails(productDetailsArray[0]);case 13:_context80.next=22;break;case 15:_context80.prev=15;_context80.t0=_context80['catch'](6);// an error occurred
// display toast to show that error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content="Sorry, an error occurred. Refresh to try again";toast.dataBind();toast.show();case 22:_context80.prev=22;// enable pull-to-refresh widget till loading is done
$('#product-details-page #product-details-page-pull-hook').removeAttr("disabled");// enable the "Add To Cart" button
$('#product-details-page #product-details-add-to-cart').removeAttr("disabled");// signal that loading is done
doneCallBack();return _context80.finish(22);case 27:case'end':return _context80.stop();}}},_callee80,this,[[6,15,22,27]]);}));function pagePullHookAction(){return _ref80.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is used to load a particular product detail.
         *
         * The product to be loaded can be directly passed to the page for loading OR
         * the id of the product can be provided to the page, so that the product is
         * retrieved from the remote server
         *
         * @returns {Promise<void>}
         */loadProduct:function(){var _ref81=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee81(){var productPromisesArray,toast,aProduct;return regeneratorRuntime.wrap(function _callee81$(_context81){while(1){switch(_context81.prev=_context81.next){case 0:productPromisesArray=[];// holds the array for the promises used to load the product
// check if there is Internet connection
if(navigator.connection.type===Connection.NONE){// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to see updated product details';toast.dataBind();toast.show();}// check if all the product details were provided to the page
if($('#app-main-navigator').get(0).topPage.data.product){// all product details were provided
aProduct=$('#app-main-navigator').get(0).topPage.data.product;// get the product details
if(!aProduct.regular_price||aProduct.regular_price==""){// regular price was NOT set, so set it
aProduct.regular_price="0.00";}// set the current product to that which was provided to the page
utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails=aProduct;productPromisesArray.push(Promise.resolve(aProduct));// resolve the promise with the product details
}else{// at least the product id was provided
// load the requested products list from the server
productPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/products/'+jQuery('#app-main-navigator').get(0).topPage.data.productId),type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true})).then(function(product){if(!product.regular_price||product.regular_price==""){// regular price was NOT set, so set it
product.regular_price="0.00";}// set the current product to that which was retrieved from the server
utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails=product;resolve(product);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}return _context81.abrupt('return',Promise.all(productPromisesArray));case 4:case'end':return _context81.stop();}}},_callee81,this);}));function loadProduct(){return _ref81.apply(this,arguments);}return loadProduct;}(),/**
         * method is used to load a particular product variations.
         *
         * The product variations to be loaded is gotten from the product directly passed to the page OR
         * the prduct id passed to the page
         *
         * @returns {Promise<void>}
         */loadProductVariations:function(){var _ref82=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee82(){var productPromisesArray,productId;return regeneratorRuntime.wrap(function _callee82$(_context82){while(1){switch(_context82.prev=_context82.next){case 0:productPromisesArray=[];// holds the array for the promises used to load the product
productId=null;// holds the product id
// check if all the product details were provided to the page
if($('#app-main-navigator').get(0).topPage.data.product){// all product details were provided
// save the product id
productId=$('#app-main-navigator').get(0).topPage.data.product.id;}else{// at least the product id was provided
// save the product id
productId=jQuery('#app-main-navigator').get(0).topPage.data.productId;}// load the requested products variations from the server
productPromisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/products/'+productId+'/variations'),type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{page:1,per_page:99,status:'publish'}})).then(function(productVariations){// map the retrieved variations and save the unique value for the variation.
// The unique value is used to uniquely identify the variation
productVariations=productVariations.map(function(currentElement,index){// join all options from the variation attributes to create a unique value
currentElement._variationValue=currentElement.attributes.map(function(attribute){return attribute.option;}).join("");return currentElement;});// save the retrieved production variations
utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.productVariationsArray=productVariations;resolve(productVariations);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));return _context82.abrupt('return',Promise.all(productPromisesArray));case 5:case'end':return _context82.stop();}}},_callee82,this);}));function loadProductVariations(){return _ref82.apply(this,arguments);}return loadProductVariations;}(),/**
         * method is used to display the product details on the page
         *
         * @param productDetails {Object} the product object to be displayed
         *
         * @returns {Promise<void>}
         */displayProductDetails:function(){var _ref83=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee85(productDetails){var variationContent,index;return regeneratorRuntime.wrap(function _callee85$(_context85){while(1){switch(_context85.prev=_context85.next){case 0:// update the product details image
$('#product-details-page .e-card-image').css("background-image",'url("'+productDetails.images[0].src+'")');// check if the product is on-sale
if(productDetails.on_sale===true){// product is on-sale
$('#product-details-page .e-card-image').html('\n                <span class="e-badge e-badge-danger" style="float: right; clear: both; \n                                                    background-color: transparent; color: #d64113;\n                                                    border: 1px #d64113 solid; font-size: 0.6em;">\n                                                    '+Math.ceil(Math.abs(kendo.parseFloat(productDetails.price)-kendo.parseFloat(productDetails.regular_price))/kendo.parseFloat(productDetails.regular_price==="0.00"?productDetails.price:productDetails.regular_price)*100)+'% OFF\n                 </span>');}// update the product title/name
$('#product-details-page .e-card-title').html(''+productDetails.name);// update product price
$('#product-details-page .product-details-price').html('&#x20a6;'+kendo.toString(kendo.parseFloat(productDetails.price),"n2"));// check if product is on-sale
if(productDetails.on_sale===true){// product is on-sale
// update the regular price
$('#product-details-page .product-details-regular-price').html('&#x20a6;'+kendo.toString(kendo.parseFloat(productDetails.regular_price),"n2"));// make the regular price visible
$('#product-details-page .product-details-regular-price').css("visibility","visible");// add 'sales' class to the quantity component
$('#product-details-quantity').get(0).ej2_instances[0].cssClass="product-details-quantity-class sales";$('#product-details-quantity').get(0).ej2_instances[0].dataBind();}else{// product is NOT on-sale
// make the regular price invisible
$('#product-details-page .product-details-regular-price').css("visibility","collapse");// remove 'sales' class from the quantity component
$('#product-details-quantity').get(0).ej2_instances[0].cssClass="product-details-quantity-class";$('#product-details-quantity').get(0).ej2_instances[0].dataBind();}// reset the product details quantity numeric input field
$('#product-details-quantity').get(0).ej2_instances[0].value=1;$('#product-details-quantity').get(0).ej2_instances[0].dataBind();// update the product details description
$('#product-details-page .product-details-description').html(''+productDetails.short_description);// destroy any previous product variation dropdown list that may previously exist before creating the new ones
$('#product-details-page .product-details-variation-option').each(function(index,element){element.ej2_instances[0].destroy();// destroy the dropdown list component
});// add/update product details variation
// expand the variations content
$('#product-details-page .product-details-variations').removeClass('expandable-content');variationContent='';// holds the product details variation content
for(index=0;index<productDetails.attributes.length;index++){// create the product details variations
variationContent+='<div class="col-xs-4" style="padding-right: 5px; padding-left: 5px;">\n                    <select name="'+productDetails.attributes[index].name+'" class="product-details-variation-option">\n                        '+productDetails.attributes[index].options.map(function(arrayElem){return'<option value="'+arrayElem+'">'+arrayElem+'</option>';}).join("")+'\n                    </select>\n                </div>';}// insert the created Select inputs to the page
$('#product-details-page .product-details-variations').html(variationContent);// create the dropdown list from each of the select input
$('#product-details-page .product-details-variation-option').each(function(index,element){// check if this product details has default attributes set
if(productDetails.default_attributes.length>0){// there are default attributes
// set those default attributes for the variations
$('option[value="'+productDetails.default_attributes[index].option+'"]',element).attr("selected",true);}// create the dropdown list from the select input
new ej.dropdowns.DropDownList({cssClass:"product-details-variation-class",placeholder:productDetails.attributes[index].name,floatLabelType:'Always',change:function(){var _ref84=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee84(){return regeneratorRuntime.wrap(function _callee84$(_context84){while(1){switch(_context84.prev=_context84.next){case 0:return _context84.abrupt('return',new Promise(function(resolve2,reject2){// handle the change in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee83(){var concatenatedVarationValue,variationIndexPosition,productVariation;return regeneratorRuntime.wrap(function _callee83$(_context83){while(1){switch(_context83.prev=_context83.next){case 0:concatenatedVarationValue="";// holds the concatenated variation values
// get the value from all the variation select-input/dropdown and concatenate them
$('#product-details-page .product-details-variation-option').each(function(index2,element2){concatenatedVarationValue+=element2.ej2_instances[0].value;});// since the concatenated variation value, is also what is used to uniquely identify each varition,
// check if there is any variation with the same unique value has the concatenated variation value.
// Also, assign the index position of the 'found' variation (if anty) to the current variation index property
variationIndexPosition=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.productVariationsArray.findIndex(function(element3){return concatenatedVarationValue===element3._variationValue;});utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex=variationIndexPosition;// check if there is a product variation that matches the user's selection
if(utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex!==-1){// there is a product variation
// get the product variation
productVariation=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.productVariationsArray[variationIndexPosition];// update the product details display image and price to that of the selected variation (if any)
if(productVariation.image&&productVariation.image!==""){// update the product details image
$('#product-details-page .e-card-image').css("background-image",'url("'+productVariation.image.src+'")');}if(productVariation.price&&productVariation.price!==""){// update product price
$('#product-details-page .product-details-price').html('&#x20a6;'+kendo.toString(kendo.parseFloat(productVariation.price),"n2"));}}// resolve the parent Promise object to signified that change is completed
resolve2();case 6:case'end':return _context83.stop();}}},_callee83,this);})),0);}));case 1:case'end':return _context84.stop();}}},_callee84,this);}));function change(){return _ref84.apply(this,arguments);}return change;}()}).appendTo(element);});// collapse the variations content
$('#product-details-page .product-details-variations').addClass('expandable-content');// update the rating for the product details
$('#product-details-page .product-details-rating').html('\n            '+(Math.floor(kendo.parseFloat(productDetails.average_rating))>0?'<ons-icon icon="md-star" fixed-width></ons-icon>'.repeat(Math.floor(kendo.parseFloat(productDetails.average_rating))):'<ons-icon icon="md-star-outline" style="color: lightgray" fixed-width></ons-icon>'.repeat(5))+'\n                <span style="display: inline-block; color: gray;">\n                '+(Math.floor(kendo.parseFloat(productDetails.average_rating))>0?'('+productDetails.rating_count+')':"")+'\n                </span>\n            ');// update the extra/more details for the product
$('#product-details-page .product-details-more-description').html('\n            '+productDetails.description);// update the dimensions for the product details
$('#product-details-page .product-details-dimensions').html('\n            <span class="list-item__subtitle" style="display: block">length - '+(!productDetails.dimensions.length||productDetails.dimensions.length==""?"(Not Available)":''+productDetails.dimensions.length)+'</span>\n            <span class="list-item__subtitle" style="display: block">width - '+(!productDetails.dimensions.width||productDetails.dimensions.width==""?"(Not Available)":''+productDetails.dimensions.width)+'</span>\n            <span class="list-item__subtitle" style="display: block">height - '+(!productDetails.dimensions.height||productDetails.dimensions.height==""?"(Not Available)":''+productDetails.dimensions.height)+'</span>');// update the weight for the product
$('#product-details-page .product-details-weight').html(''+(!productDetails.weight||productDetails.weight==""?"(Not Available)":''+productDetails.weight));case 19:case'end':return _context85.stop();}}},_callee85,this);}));function displayProductDetails(_x43){return _ref83.apply(this,arguments);}return displayProductDetails;}(),/**
         * method is triggered when the customise button is clicked
         *
         * @returns {Promise<void>}
         */customiseButtonClicked:function(){var _ref86=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee87(){var toast;return regeneratorRuntime.wrap(function _callee87$(_context87){while(1){switch(_context87.prev=_context87.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context87.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3500;toast.content='Please connect to the Internet to customise product';toast.dataBind();toast.show();return _context87.abrupt('return');case 10:// perform the method task in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee86(){var productUrl,variationIndex,productVariation;return regeneratorRuntime.wrap(function _callee86$(_context86){while(1){switch(_context86.prev=_context86.next){case 0:productUrl="";// holds the url for the product being customised
// check if the user has selected a product variation or if the default product is being customised
if(utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex!==-1){// a product variation was selected
// get the index position of the selected variation
variationIndex=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex;// get the production variation object
productVariation=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.productVariationsArray[variationIndex];productUrl=productVariation.permalink;// set the product url
}else{// no product variation was selected, so use the default product details
productUrl=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails.permalink;// set the product url
}// load the "Customise Product" page to the app-main-navigator
_context86.next=4;return $('#app-main-navigator').get(0).pushPage("customise-product-page.html");case 4:_context86.next=6;return utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.loadProductCustomisation(productUrl);case 6:case'end':return _context86.stop();}}},_callee86,this);})),0);case 11:case'end':return _context87.stop();}}},_callee87,this);}));function customiseButtonClicked(){return _ref86.apply(this,arguments);}return customiseButtonClicked;}(),/**
         * method is triggered when the "Add To Cart" button is clicked
         *
         * @returns {Promise<void>}
         */addToCartButtonClicked:function(){var _ref88=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee89(){return regeneratorRuntime.wrap(function _callee89$(_context89){while(1){switch(_context89.prev=_context89.next){case 0:// disable the "Add To Cart" button
$('#product-details-page #product-details-add-to-cart').attr("disabled",true);// add the spinner from the 'Add To Cart'
$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].cssClass='';$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].dataBind();$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].start();// perform the task of including the product into the local cart in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee88(){var localCart,utopiasoftwareCartObject,variationIndex,productVariation,searchParams,_iteratorNormalCompletion,_didIteratorError,_iteratorError,_iterator,_step,_ref90,_ref91,key,value,toast,_toast9;return regeneratorRuntime.wrap(function _callee88$(_context88){while(1){switch(_context88.prev=_context88.next){case 0:localCart=[];// holds the local cart collection
utopiasoftwareCartObject={cartData:{}};// holds the object whose properties make up the cart item
// get the cached user cart
_context88.prev=2;_context88.next=5;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 5:localCart=_context88.sent.cart;_context88.next=10;break;case 8:_context88.prev=8;_context88.t0=_context88['catch'](2);case 10:if(!(utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex!==-1)){_context88.next=36;break;}// a product variation was selected
// get the selected product variation index position and the accompanying variation object
variationIndex=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductVariationIndex;productVariation=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.productVariationsArray[variationIndex];utopiasoftwareCartObject.cartData.variation_id=productVariation.id;// get the search parameters object from the product variation url
searchParams=new URLSearchParams(productVariation.permalink.split("?")[1]);// get the variation attributes from searchParams object and assign them in cartData object
utopiasoftwareCartObject.cartData.variation={};_iteratorNormalCompletion=true;_didIteratorError=false;_iteratorError=undefined;_context88.prev=19;for(_iterator=searchParams[Symbol.iterator]();!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){_ref90=_step.value;_ref91=_slicedToArray(_ref90,2);key=_ref91[0];value=_ref91[1];utopiasoftwareCartObject.cartData.variation[key]=value;}// store the product variation object as additional data just for the mobile app
_context88.next=27;break;case 23:_context88.prev=23;_context88.t1=_context88['catch'](19);_didIteratorError=true;_iteratorError=_context88.t1;case 27:_context88.prev=27;_context88.prev=28;if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}case 30:_context88.prev=30;if(!_didIteratorError){_context88.next=33;break;}throw _iteratorError;case 33:return _context88.finish(30);case 34:return _context88.finish(27);case 35:utopiasoftwareCartObject.productVariation=productVariation;case 36:// set the other properties of the cart data
utopiasoftwareCartObject.cartData.product_id=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails.id;utopiasoftwareCartObject.cartData.quantity=$('#product-details-quantity').get(0).ej2_instances[0].value;// store the product object as additional data just for the mobile app
utopiasoftwareCartObject.product=utopiasoftware[utopiasoftware_app_namespace].controller.productDetailsPageViewModel.currentProductDetails;// store a unique local-cart uid to identify the product
utopiasoftwareCartObject.uid=Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine);_context88.prev=40;// add the created 'utopiasoftwareCartObject' to the user cart collection
localCart.push(utopiasoftwareCartObject);// save the updated cached user cart
_context88.next=44;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-cart",docType:"USER_CART",cart:localCart},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 44:// inform the user that the product has been added to cart
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='success-ej2-toast';toast.timeOut=2000;toast.content='Product has been added to your cart';toast.dataBind();toast.show();console.log("USER CART OBJECT",utopiasoftwareCartObject);_context88.next=66;break;case 55:_context88.prev=55;_context88.t2=_context88['catch'](40);console.log("PRODUCT DETAILS ERROR",_context88.t2);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast9=$('.timed-page-toast').get(0).ej2_instances[0];_toast9.cssClass='error-ej2-toast';_toast9.timeOut=3500;_toast9.content='Error adding product to your cart. Try again';_toast9.dataBind();_toast9.show();case 66:_context88.prev=66;// enable the "Add To Cart" button
$('#product-details-page #product-details-add-to-cart').removeAttr("disabled");// hide the spinner from the 'Add To Cart'
$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].dataBind();$('#product-details-page #product-details-add-to-cart').get(0).ej2_instances[0].stop();return _context88.finish(66);case 72:case'end':return _context88.stop();}}},_callee88,this,[[2,8],[19,23,27,35],[28,,30,34],[40,55,66,72]]);})),0);case 5:case'end':return _context89.stop();}}},_callee89,this);}));function addToCartButtonClicked(){return _ref88.apply(this,arguments);}return addToCartButtonClicked;}()},/**
     * this is the view-model/controller for the Customise Product page
     */customiseProductPageViewModel:{/**
         * holds the current customisation url that has been loaded
         */currentCustomisationUrl:"",/**
         * holds the remote/server cart item key for the current customised product
         */currentCustomisationCartKey:null,/**
         * holds the number of times the customisation page has been loaded from the parent server
         */customisationPageLoadCount:0,/**
         * holds the fixed-length queue containing the previous cart object and the new/update cart object.
         * The queue can only contain a max of 2 items. older items are pushed out first.
         * The initial cart object is also gotten the first time this app page is loaded or refreshed
         */cartsQueue:[],/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref92=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee90(){return regeneratorRuntime.wrap(function _callee90$(_context90){while(1){switch(_context90.prev=_context90.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context90.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context90.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#customise-product-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.pagePullHookAction;// register listener for listening to messages from the parent site
window.addEventListener("message",utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.receiveMessageListener,false);// register listener for the pull-to-refresh widget
$('#customise-product-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#customise-product-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#customise-product-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#customise-product-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});try{// create the "Cancel" button
new ej.buttons.Button({//iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
//iconPosition: "Left"
}).appendTo('#customise-product-cancel');// create the "Add To Cart" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#customise-product-add-to-cart');}catch(err){console.log("CUSTOMISATION ERROR",err);}finally{}case 8:case'end':return _context90.stop();}}},_callee90,this);}));return function loadPageOnAppReady(){return _ref92.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){window.SoftInputMode.set('adjustResize');// update cart count
$('#customise-product-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOnlineListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref93=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee91(){return regeneratorRuntime.wrap(function _callee91$(_context91){while(1){switch(_context91.prev=_context91.next){case 0:// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.deviceOnlineListener,false);case 2:case'end':return _context91.stop();}}},_callee91,this);}));function pageHide(){return _ref93.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// reset the current customisation url
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationUrl="";// reset the current customisation remote cart item key
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationCartKey=null;// reset the customisation page load count
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.customisationPageLoadCount=0;// reset the cartsQueue
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue=[];// remove listener for listening to messages from the parent site
window.removeEventListener("message",utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.receiveMessageListener,false);$('#customise-product-cancel').get(0).ej2_instances[0].destroy();$('#customise-product-add-to-cart').get(0).ej2_instances[0].destroy();},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to customise product";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is used to handle the receipt of messages from the parent website
         *
         * @param receiveEvent {Event} this is the event object of the "Message" event
         *
         * @returns {Promise<void>}
         */receiveMessageListener:function(){var _ref94=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee92(receiveEvent){var cartData;return regeneratorRuntime.wrap(function _callee92$(_context92){while(1){switch(_context92.prev=_context92.next){case 0:if(!(receiveEvent.origin!=="https://shopoakexclusive.com")){_context92.next=2;break;}return _context92.abrupt('return');case 2:if(!(receiveEvent.data==="page ready")){_context92.next=8;break;}// parent site is ready to work together
// update the customisation page load count by 1
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.customisationPageLoadCount+=1;// remove the page preloader
$('#customise-product-page .page-preloader').css("display","none");return _context92.abrupt('return');case 8:// the page sent cart data
// access the cart data
cartData=JSON.parse(receiveEvent.data);if(Array.isArray(cartData)){// the cart data is an array, therefore it's empty
// push an empty object into the cart queue property
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue.push({});}else{// cart data is not an array
// push the cart data into the cart queue
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue.push(cartData);}// check if the cartQueue property is greater than its maximum allowed length of 2
if(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue.length>2){// cartQueue property is greater than 2 elements
// remove the oldest element from the queue
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue.shift();}// save the customised product to local cart cache (do this in a separate event queue)
window.setTimeout(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.saveCustomisedProductToCart,0);// enable the "Add To Cart" button
$('#customise-product-page #customise-product-add-to-cart').removeAttr("disabled");// hide the spinner on the 'Add To Cart'
$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].dataBind();$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].stop();case 16:case'end':return _context92.stop();}}},_callee92,this);}));function receiveMessageListener(_x44){return _ref94.apply(this,arguments);}return receiveMessageListener;}(),/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref95=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee93(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var toast;return regeneratorRuntime.wrap(function _callee93$(_context93){while(1){switch(_context93.prev=_context93.next){case 0:// show the page preloader
$('#customise-product-page .page-preloader').css("display","block");// disable the "Add To Cart" button
$('#customise-product-page #customise-product-add-to-cart').attr("disabled",true);// remove the spinner from the 'Add To Cart'
$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].dataBind();$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].stop();// hide page loader
$('#customise-product-page #customise-product-page-iframe-container .modal').css("display","none");// disable pull-to-refresh widget till loading is done
$('#customise-product-page #customise-product-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');_context93.prev=8;_context93.next=11;return utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.loadProductCustomisation(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationUrl,utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationCartKey);case 11:_context93.next=20;break;case 13:_context93.prev=13;_context93.t0=_context93['catch'](8);// an error occurred
// display toast to show that error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content="Sorry, an error occurred. Refresh to try again";toast.dataBind();toast.show();case 20:_context93.prev=20;window.setTimeout(function(){// wait for 2 sec before declaring loading done
// enable pull-to-refresh widget till loading is done
$('#customise-product-page #customise-product-page-pull-hook').removeAttr("disabled");// signal that loading is done
doneCallBack();},2000);return _context93.finish(20);case 23:case'end':return _context93.stop();}}},_callee93,this,[[8,13,20,23]]);}));function pagePullHookAction(){return _ref95.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is used to load a particular product/product variation customisation.
         *
         * @param customisationUrl {String} holds the url for the product to be customised
         *
         * @param remoteCartItemKey {String} holds the remote cart item key for the
         * product being customised
         *
         * @returns {Promise<void>}
         */loadProductCustomisation:function(){var _ref96=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee94(){var customisationUrl=arguments.length>0&&arguments[0]!==undefined?arguments[0]:utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationUrl;var remoteCartItemKey=arguments[1];var toast;return regeneratorRuntime.wrap(function _callee94$(_context94){while(1){switch(_context94.prev=_context94.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context94.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3500;toast.content='Please connect to the Internet to customise product and Pull Down to refresh';toast.dataBind();toast.show();return _context94.abrupt('return');case 10:// display the page preloader
$('#customise-product-page .page-preloader').css("display","block");// check if the 'remoteCartItemKey' has been provided
if(remoteCartItemKey){// the remote cart item key was provided
if(customisationUrl.indexOf("?")<0){// there are NO previous query parameters
// attach the cart item key to the available customisation url & load it
// load the specified url into the customisation iframe
$('#customise-product-page #customise-product-page-iframe').attr("src",customisationUrl+('?cart_item_key='+window.encodeURIComponent(remoteCartItemKey)));}else{// there are previous query parameters
// attach the cart item key to the previous query parameters and load the customisation url
// load the specified url into the customisation iframe
$('#customise-product-page #customise-product-page-iframe').attr("src",customisationUrl+('&cart_item_key='+window.encodeURIComponent(remoteCartItemKey)));}}else{// NO remote cart item key was provided
// load the specified url (as is) into the customisation iframe
$('#customise-product-page #customise-product-page-iframe').attr("src",customisationUrl);}// update the current customisation url
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationUrl=customisationUrl;// update the current remote/server cart item key for the product being customised
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationCartKey=remoteCartItemKey;// reset the page load count and cartsQueue properties
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.customisationPageLoadCount=0;utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue=[];return _context94.abrupt('return',true);case 17:case'end':return _context94.stop();}}},_callee94,this);}));function loadProductCustomisation(){return _ref96.apply(this,arguments);}return loadProductCustomisation;}(),/**
         * method is used to compare the cartQueue property and saves the latest customised product to
         * local cart cache in the app database
         *
         * @returns {Promise<void>}
         */saveCustomisedProductToCart:function(){var _ref97=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee95(){var previousCartObject,updatedCartObject,property,customisedProduct,localCart,utopiasoftwareCartObject,customisedIndex,toast,_toast10;return regeneratorRuntime.wrap(function _callee95$(_context95){while(1){switch(_context95.prev=_context95.next){case 0:// get the previous remote cart object and the new/updated remote cart object
previousCartObject=utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue[0];updatedCartObject=utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.cartsQueue[1];// get the latest customised product by comparing the properties of the updateCartObject with the previousCartObject
_context95.t0=regeneratorRuntime.keys(updatedCartObject);case 3:if((_context95.t1=_context95.t0()).done){_context95.next=60;break;}property=_context95.t1.value;if(previousCartObject[property]){_context95.next=58;break;}// property does not exist in the previousCartObject, so this property belongs to the latest customised product
// get the latest customised product
customisedProduct=updatedCartObject[property];console.log("CUSTOMISED PRODUCT",customisedProduct);localCart=[];// holds the local cart collection
utopiasoftwareCartObject={cartData:{}};// holds the object whose properties make up the cart item
// get the cached user cart
_context95.prev=10;_context95.next=13;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 13:localCart=_context95.sent.cart;// check if this is a save of an "edited" previously customised product
if(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationCartKey){// since a current customisation cart key exist, this is an update
// get the utopiasoftwareCartObject for the old customised product being updated.
// This old object will be replaced by the newly customised product, so delete it from app local cache/database
customisedIndex=localCart.findIndex(function(cartObject){return cartObject.anon_cart_key===utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationCartKey;});localCart.splice(customisedIndex,1);// delete the old customised product
}_context95.next=19;break;case 17:_context95.prev=17;_context95.t2=_context95['catch'](10);case 19:// set the other properties of the cart data
utopiasoftwareCartObject.cartData.product_id=customisedProduct.product_id;utopiasoftwareCartObject.cartData.quantity=customisedProduct.quantity;utopiasoftwareCartObject.cartData.variation_id=customisedProduct.variation_id;utopiasoftwareCartObject.cartData.variation=customisedProduct.variation;utopiasoftwareCartObject.cartData.cart_item_data={fpd_data:customisedProduct.fpd_data};// holds the fancy product designer data
// store the cart key used to identify the customised product as additional data just for the mobile app
utopiasoftwareCartObject.anon_cart_key=customisedProduct.key;// store the name of the customised product as additional data just for the mobile app
utopiasoftwareCartObject.product_name=customisedProduct.product_name;// store the cutomisationUrl of this product as additional data just for the mobile app
utopiasoftwareCartObject.customisationUrl=utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationUrl;// store a unique local-cart uid to identify the product just for the mobile app
utopiasoftwareCartObject.uid=Random.uuid4(utopiasoftware[utopiasoftware_app_namespace].randomisationEngine);_context95.prev=28;// add the created 'utopiasoftwareCartObject' to the user cart collection
localCart.push(utopiasoftwareCartObject);// save the updated cached user cart
_context95.next=32;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-cart",docType:"USER_CART",cart:localCart},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 32:// inform the user that the product has been added to cart
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='success-ej2-toast';toast.timeOut=2000;toast.content='Customised product has been added to your cart';toast.dataBind();toast.show();_context95.next=53;break;case 42:_context95.prev=42;_context95.t3=_context95['catch'](28);console.log("CUSTOMISE PRODUCT ERROR",_context95.t3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast10=$('.timed-page-toast').get(0).ej2_instances[0];_toast10.cssClass='error-ej2-toast';_toast10.timeOut=3500;_toast10.content='Error adding customised product to your cart. Try again';_toast10.dataBind();_toast10.show();case 53:_context95.prev=53;// check if this is a save of an "edited" previously customised product
if(utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationCartKey){// since a current customisation cart key exist, this is an update
// update the 'currentCustomisationCartKey' property with the key of the newly customised product
utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.currentCustomisationCartKey=customisedProduct.key;}// hide page loader after saving the customised product to user cart
$('#customise-product-page #customise-product-page-iframe-container .modal').css("display","none");return _context95.finish(53);case 57:return _context95.abrupt('break',60);case 58:_context95.next=3;break;case 60:case'end':return _context95.stop();}}},_callee95,this,[[10,17],[28,42,53,57]]);}));function saveCustomisedProductToCart(){return _ref97.apply(this,arguments);}return saveCustomisedProductToCart;}(),/**
         * method is triggered when the user clicks the "Add To Cart" button
         *
         * @returns {Promise<void>}
         */addToCartButtonClicked:function(){var _ref98=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee96(){var toast;return regeneratorRuntime.wrap(function _callee96$(_context96){while(1){switch(_context96.prev=_context96.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context96.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3500;toast.content='Please connect to the Internet to add customised product to cart';toast.dataBind();toast.show();return _context96.abrupt('return');case 10:// show the spinner on the 'Add To Cart' button to indicate process is ongoing
$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].cssClass='';$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].dataBind();$('#customise-product-page #customise-product-add-to-cart').get(0).ej2_instances[0].start();// display page loader while completing the "add to cart" request
$('#customise-product-page #customise-product-page-iframe-container .modal').css("display","table");// call the method to submit the product customisation form located in the iframe window
$('#customise-product-page #customise-product-page-iframe').get(0).contentWindow.utopiasoftware_addUsage();case 15:case'end':return _context96.stop();}}},_callee96,this);}));function addToCartButtonClicked(){return _ref98.apply(this,arguments);}return addToCartButtonClicked;}()},/**
     * this is the view-model/controller for the View Cart page
     */viewCartPageViewModel:{/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref99=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee97(){var toast;return regeneratorRuntime.wrap(function _callee97$(_context97){while(1){switch(_context97.prev=_context97.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context97.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context97.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#view-cart-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#view-cart-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#view-cart-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#view-cart-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#view-cart-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});try{// create the "Checkout" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#view-cart-checkout');}catch(err){console.log("VIEW-CART PAGE",err);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred. Pull down to refresh';toast.dataBind();toast.show();}case 7:case'end':return _context97.stop();}}},_callee97,this);}));return function loadPageOnAppReady(){return _ref99.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// update cart count
$('#view-cart-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustResize');},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref100=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee98(){return regeneratorRuntime.wrap(function _callee98$(_context98){while(1){switch(_context98.prev=_context98.next){case 0:case'end':return _context98.stop();}}},_callee98,this);}));function pageHide(){return _ref100.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy View Cart button
$('#view-cart-checkout').get(0).ej2_instances[0].destroy();// destroy all the "Edit" buttons on the View Cart page
$("#view-cart-page .view-cart-edit-button").each(function(index,element){// destroy the "Edit" button
element.ej2_instances[0].destroy();});// destroy all the "Remove" buttons required for the View Cart page
$("#view-cart-page .view-cart-remove-button").each(function(index,element){// destroy the "Remove" button
element.ej2_instances[0].destroy();});// destroy all the "Quantity" input required for the View Cart page
$("#view-cart-page .view-cart-quantity-input").each(function(index,element){// destroy the "Quantity" input
element.ej2_instances[0].destroy();});},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref101=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee99(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var toast;return regeneratorRuntime.wrap(function _callee99$(_context99){while(1){switch(_context99.prev=_context99.next){case 0:// disable pull-to-refresh widget till loading is done
$('#view-cart-page #view-cart-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// disable the "Checkout" button
$('#view-cart-page #view-cart-checkout').attr("disabled",true);// remove the spinner from the 'Add To Cart'
$('#view-cart-page #view-cart-checkout').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#view-cart-page #view-cart-checkout').get(0).ej2_instances[0].dataBind();$('#view-cart-page #view-cart-checkout').get(0).ej2_instances[0].stop();_context99.prev=6;_context99.next=9;return utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.displayUserCart();case 9:_context99.next=18;break;case 11:_context99.prev=11;_context99.t0=_context99['catch'](6);// an error occurred
// display toast to show that error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content="Sorry, an error occurred. Refresh to try again";toast.dataBind();toast.show();case 18:_context99.prev=18;// enable pull-to-refresh widget till loading is done
$('#view-cart-page #view-cart-page-pull-hook').removeAttr("disabled");// enable the "Checkout" button
$('#view-cart-page #view-cart-checkout').removeAttr("disabled");// hide the preloader
$('#view-cart-page .page-preloader').css("display","none");// signal that loading is done
doneCallBack();return _context99.finish(18);case 24:case'end':return _context99.stop();}}},_callee99,this,[[6,11,18,24]]);}));function pagePullHookAction(){return _ref101.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is used to display the user cart on the View Cart page.
         * @param localCart {Array}
         *
         * @returns Promise
         */displayUserCart:function(){var _ref102=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee101(localCart){var displayContent,toast,index;return regeneratorRuntime.wrap(function _callee101$(_context101){while(1){switch(_context101.prev=_context101.next){case 0:displayContent="";// holds the cart content to be displayed
_context101.prev=1;_context101.prev=2;_context101.t0=localCart;if(_context101.t0){_context101.next=8;break;}_context101.next=7;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 7:_context101.t0=_context101.sent.cart;case 8:localCart=_context101.t0;_context101.next=14;break;case 11:_context101.prev=11;_context101.t1=_context101['catch'](2);// if error occurred during local cart retrieval
localCart=[];// set localCart to empty array
case 14:if(!(localCart.length===0)){_context101.next=24;break;}// localCart is empty
// display message to inform user that cart is empty
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Your cart is empty. Go order some products!';toast.dataBind();toast.show();return _context101.abrupt('return');case 24:// destroy all the "Edit" buttons on the View Cart page
$("#view-cart-page .view-cart-edit-button").each(function(index,element){// destroy the "Edit" button
element.ej2_instances[0].destroy();});// destroy all the "Remove" buttons required for the View Cart page
$("#view-cart-page .view-cart-remove-button").each(function(index,element){// destroy the "Remove" button
element.ej2_instances[0].destroy();});// destroy all the "Quantity" input required for the View Cart page
$("#view-cart-page .view-cart-quantity-input").each(function(index,element){// destroy the "Quantity" input
element.ej2_instances[0].destroy();});// display the contents of the cart using a for-loop
for(index=0;index<localCart.length;index++){displayContent+='<div class="col-xs-12" style="border-bottom: 1px lightgray solid" \n                            data-utopiasoftware-product-uid="'+localCart[index].uid+'">\n                        <div class="e-card e-card-horizontal">';if(localCart[index].anon_cart_key){// this item is a customised product
displayContent+='<div class="e-card-image" style="-webkit-flex-basis: auto; flex-basis: auto; width: 30%;\n                            min-height: 100%; \n                            background-image: url(\''+localCart[index].cartData.cart_item_data.fpd_data.fpd_product_thumbnail+'\');">\n                            </div>\n                            <div class="e-card-stacked" style="-webkit-flex-basis: auto; flex-basis: auto; width: 70%">\n                            <div class="e-card-header" style="padding: 0">\n                            <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">\n                            <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">\n                                '+localCart[index].product_name+'\n                            </div>\n                            <div class="e-card-sub-title" style="font-size: 11px; text-align: center; text-transform: capitalize">\n                                &#x20a6;'+kendo.toString(localCart[index].cartData.quantity*kendo.parseFloat(localCart[index].cartData.cart_item_data.fpd_data.fpd_product_price),"n2")+'\n                            </div>\n                            </div>\n                            </div>\n                            <div class="e-card-content row" style="padding: 0;">\n                            <div class="col-xs-3">\n                                <button type="button" class="view-cart-edit-button"\n                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" \n                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                        viewCartPageViewModel.\n                                        editCartItemButtonClicked(\''+localCart[index].customisationUrl+'\', \n                                        \''+localCart[index].anon_cart_key+'\')"></button>\n                            </div>\n                            <div class="col-xs-4">\n                                <button type="button" class="view-cart-remove-button"\n                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" \n                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                        viewCartPageViewModel.deleteCartItemButtonClicked(\''+localCart[index].uid+'\')"></button>\n                            </div>\n                            <div class="col-xs-5">\n                                <input class="view-cart-quantity-input" type="number" style="padding-top: 2px;" \n                                value="'+localCart[index].cartData.quantity+'" \n                                data-utopiasoftware-product-uid="'+localCart[index].uid+'">\n                            </div>\n                            </div>\n                            </div>';}else if(localCart[index].productVariation){// this product was NOT saved with customisation, but has variations
displayContent+='<div class="e-card-image" style="-webkit-flex-basis: auto; flex-basis: auto; width: 30%;\n                            min-height: 100%; \n                            background-image: \n                            url(\''+(localCart[index].productVariation.image&&localCart[index].productVariation.image!==""?localCart[index].productVariation.image.src:localCart[index].product.images[0].src)+'\');">\n                            </div>\n                            <div class="e-card-stacked" style="-webkit-flex-basis: auto; flex-basis: auto; width: 70%">\n                            <div class="e-card-header" style="padding: 0">\n                            <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">\n                            <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">\n                                '+localCart[index].product.name+'\n                            </div>\n                            <div class="e-card-sub-title" style="font-size: 11px; text-align: center; text-transform: capitalize">\n                                &#x20a6;'+kendo.toString(localCart[index].cartData.quantity*kendo.parseFloat(localCart[index].productVariation.price&&localCart[index].productVariation.price!==""?localCart[index].productVariation.price:localCart[index].product.price),"n2")+'\n                            </div>\n                            </div>\n                            </div>\n                            <div class="e-card-content row" style="padding: 0;">\n                            <div class="col-xs-3">\n                            </div>\n                            <div class="col-xs-4">\n                                <button type="button" class="view-cart-remove-button"\n                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" \n                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                        viewCartPageViewModel.deleteCartItemButtonClicked(\''+localCart[index].uid+'\')"></button>\n                            </div>\n                            <div class="col-xs-5">\n                                <input class="view-cart-quantity-input" type="number" style="padding-top: 2px;" \n                                value="'+localCart[index].cartData.quantity+'" \n                                data-utopiasoftware-product-uid="'+localCart[index].uid+'">\n                            </div>\n                            </div>\n                            </div>';}else if(!localCart[index].productVariation){// this product was NOT ssaved with customisation, and has NO variations
displayContent+='<div class="e-card-image" style="-webkit-flex-basis: auto; flex-basis: auto; width: 30%;\n                            min-height: 100%; \n                            background-image: url(\''+localCart[index].product.images[0].src+'\');">\n                            </div>\n                            <div class="e-card-stacked" style="-webkit-flex-basis: auto; flex-basis: auto; width: 70%">\n                            <div class="e-card-header" style="padding: 0">\n                            <div class="e-card-header-caption"  style="padding-left: 3px; padding-right: 5px">\n                            <div class="e-card-sub-title" style="font-size: 14px; text-align: center; text-transform: capitalize">\n                                '+localCart[index].product.name+'\n                            </div>\n                            <div class="e-card-sub-title" style="font-size: 11px; text-align: center; text-transform: capitalize">\n                                &#x20a6;'+kendo.toString(localCart[index].cartData.quantity*kendo.parseFloat(localCart[index].product.price),"n2")+'\n                            </div>\n                            </div>\n                            </div>\n                            <div class="e-card-content row" style="padding: 0;">\n                            <div class="col-xs-3">                          \n                            </div>\n                            <div class="col-xs-4">\n                                <button type="button" class="view-cart-remove-button"\n                                        style="background-color: #ffffff; color: #3f51b5; height: 10px;" \n                                        onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                        viewCartPageViewModel.deleteCartItemButtonClicked(\''+localCart[index].uid+'\')"></button>\n                            </div>\n                            <div class="col-xs-5">\n                                <input class="view-cart-quantity-input" type="number" style="padding-top: 2px;" \n                                value="'+localCart[index].cartData.quantity+'" \n                                data-utopiasoftware-product-uid="'+localCart[index].uid+'">\n                            </div>\n                            </div>\n                            </div>';}displayContent+='</div>\n                         </div>';}// attach the displayContent to the page
$('#view-cart-page #view-cart-contents-container').html(displayContent);// create all the "Edit" buttons required for the View Cart page
$("#view-cart-page .view-cart-edit-button").each(function(index,element){// create the "Edit" button
new ej.buttons.Button({cssClass:'e-flat e-round',iconCss:"zmdi zmdi-edit utopiasoftware-icon-zoom-one-point-two",iconPosition:"Left"}).appendTo(element);});// create all the "Remove" buttons required for the View Cart page
$("#view-cart-page .view-cart-remove-button").each(function(index,element){// create the "Remove" button
new ej.buttons.Button({cssClass:'e-flat e-round',iconCss:"zmdi zmdi-delete utopiasoftware-icon-zoom-one-point-two"//iconPosition: "Left"
}).appendTo(element);});// create all the "Quantity" input required for the View Cart page
$("#view-cart-page .view-cart-quantity-input").each(function(index,element){var _ref104;new ej.inputs.NumericTextBox((_ref104={value:element.value,cssClass:'view-cart-quantity-input-class',currency:null,decimals:0,floatLabelType:'Auto',format:'n',showSpinButton:true,min:1,max:10,placeholder:' ',step:1,strictMode:true,width:'60%'},_defineProperty(_ref104,'value',1),_defineProperty(_ref104,'change',function change(){// track changes in the quantity numeric input for every product
var currentQuantityValue=this.value;// holds the current quantity value from the numeric input
var product_uid=$(element).attr('data-utopiasoftware-product-uid');// dissplay page preloader
$('#view-cart-page .page-preloader').css("display","block");// handle task in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee100(){var selectedProduct,_toast11,_toast12;return regeneratorRuntime.wrap(function _callee100$(_context100){while(1){switch(_context100.prev=_context100.next){case 0:_context100.prev=0;// find the product to be updated within the app localCart
selectedProduct=localCart.find(function(productElement){return productElement.uid===product_uid;});// update the quantity for the selected product
selectedProduct.cartData.quantity=currentQuantityValue;// save the updated localCart object to the app cache/persistent storage
_context100.next=5;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-cart",docType:"USER_CART",cart:localCart},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 5:_context100.next=7;return utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.displayUserCart(localCart);case 7:// inform the user that the product has been added to cart
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast11=$('.timed-page-toast').get(0).ej2_instances[0];_toast11.cssClass='success-ej2-toast';_toast11.timeOut=2000;_toast11.content='Product quantity updated';_toast11.dataBind();_toast11.show();_context100.next=28;break;case 17:_context100.prev=17;_context100.t0=_context100['catch'](0);console.log("UPDATE PRODUCT QUANTITY",_context100.t0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error occurred
_toast12=$('.timed-page-toast').get(0).ej2_instances[0];_toast12.cssClass='error-ej2-toast';_toast12.timeOut=3500;_toast12.content='Product quantity not updated. Try again';_toast12.dataBind();_toast12.show();case 28:_context100.prev=28;// hide page preloader
$('#view-cart-page .page-preloader').css("display","none");return _context100.finish(28);case 31:case'end':return _context100.stop();}}},_callee100,this,[[0,17,28,31]]);})),0);}),_ref104)).appendTo(element);});// update the total price of items displayed
$('#view-cart-page #view-cart-total-price').html('&#x20a6;'+kendo.toString(utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.calculateCartTotalPrice(localCart),"n2"));case 33:_context101.prev=33;return _context101.finish(33);case 35:case'end':return _context101.stop();}}},_callee101,this,[[1,,33,35],[2,11]]);}));function displayUserCart(_x48){return _ref102.apply(this,arguments);}return displayUserCart;}(),/**
         * method is a utility/helper function used to view/load and display the user's cart
         *
         * @returns {Promise<void>}
         */viewCartPage:function(){var _ref105=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee102(){var toast;return regeneratorRuntime.wrap(function _callee102$(_context102){while(1){switch(_context102.prev=_context102.next){case 0:_context102.prev=0;_context102.next=3;return $('#app-main-navigator').get(0).bringPageTop("view-cart-page.html");case 3:_context102.next=5;return utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.displayUserCart();case 5:// enable the checkout button
$('#view-cart-page #view-cart-checkout').removeAttr("disabled");_context102.next=17;break;case 8:_context102.prev=8;_context102.t0=_context102['catch'](0);console.log("VIEW-CART PAGE",_context102.t0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred. Pull down to refresh';toast.dataBind();toast.show();case 17:_context102.prev=17;// hide the preloader
$('#view-cart-page .page-preloader').css("display","none");return _context102.finish(17);case 20:case'end':return _context102.stop();}}},_callee102,this,[[0,8,17,20]]);}));function viewCartPage(){return _ref105.apply(this,arguments);}return viewCartPage;}(),/**
         * method is a utility function used to calculate the approximate total process of all items in
         * a user's local cart
         *
         * @param localCart {Array} containing an array of items in the user's local cart
         *
         * @returns {number} the total price for all the items contained in cart
         */calculateCartTotalPrice:function calculateCartTotalPrice(){var localCart=arguments.length>0&&arguments[0]!==undefined?arguments[0]:[];if(localCart.length===0){// this is an empty cart, so just return 0
return 0.00;}// run an array reduce function which gets the sub-total price of each item in the cart by multiplying their
// quantity by the unit price. Then adding all sub-totals to get the total price
return localCart.reduce(function(accumulator,currentElement,currentIndex,thisArray){console.log("ACCUMULATOR",accumulator);console.log("CURRENT INDEX",currentIndex);// check the types of products in the cart
if(currentElement.anon_cart_key){// this item is a customised product
// multiply the product unit price with the specified quantity and add the to the current cumulative total
return accumulator+currentElement.cartData.quantity*kendo.parseFloat(currentElement.cartData.cart_item_data.fpd_data.fpd_product_price);}else if(currentElement.productVariation){// this product was NOT saved with customisation, but has variations
// multiply the product unit price with the specified quantity and add the to the current cumulative total
return accumulator+currentElement.cartData.quantity*kendo.parseFloat(currentElement.productVariation.price&&currentElement.productVariation.price!==""?currentElement.productVariation.price:currentElement.product.price);}else if(!currentElement.productVariation){// this product was NOT saved with customisation, and has NO variations
// multiply the product unit price with the specified quantity and add the to the current cumulative total
return accumulator+currentElement.cartData.quantity*kendo.parseFloat(currentElement.product.price);}},0);},/**
         * method is triggered when the Delete/Remove" cart item button (attached to each product on the
         * View Cart page) is clicked.
         *
         * @param productUId {String} the unique uid created for each product in
         * the user's local cart. This identifies the product to be deleted from cart
         *
         * @returns {Promise<void>}
         */deleteCartItemButtonClicked:function(){var _ref106=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee105(){var productUId=arguments.length>0&&arguments[0]!==undefined?arguments[0]:"";return regeneratorRuntime.wrap(function _callee105$(_context105){while(1){switch(_context105.prev=_context105.next){case 0:// attach functions to handle the "Reject/No" and "Accept/Yes" buttons click event.
// These buttons are located in the 'Delete Cart Item Action Sheet'.
// Click event handlers must always be defined for these buttons when using this action sheet
// function for "Reject/No" button
$('#view-cart-page-delete-cart-item-action-sheet #view-cart-page-delete-cart-item-no').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee103(){return regeneratorRuntime.wrap(function _callee103$(_context103){while(1){switch(_context103.prev=_context103.next){case 0:_context103.next=2;return document.getElementById('view-cart-page-delete-cart-item-action-sheet').hide();case 2:case'end':return _context103.stop();}}},_callee103,this);}));// function for "Accept/Yes" button
$('#view-cart-page-delete-cart-item-action-sheet #view-cart-page-delete-cart-item-yes').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee104(){var localCart,productIndex,$cartDisplayedItem,toast,_toast13;return regeneratorRuntime.wrap(function _callee104$(_context104){while(1){switch(_context104.prev=_context104.next){case 0:localCart=[];// holds the local cart array
_context104.prev=1;// display page preloader
$('#view-cart-page .page-preloader').css("display","block");// hide the action sheet
_context104.next=5;return document.getElementById('view-cart-page-delete-cart-item-action-sheet').hide();case 5:_context104.prev=5;_context104.next=8;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 8:localCart=_context104.sent.cart;_context104.next=13;break;case 11:_context104.prev=11;_context104.t0=_context104['catch'](5);case 13:// get the product to be deleted from the cart
productIndex=localCart.findIndex(function(productElement,index){// check if this is the product being search for by comparing the product uid
return productUId===productElement.uid;});// check if a product was found
if(productIndex!==-1){// product was found
// delete the product from localCart
localCart.splice(productIndex,1);}// save the updated cart
_context104.next=17;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-cart",docType:"USER_CART",cart:localCart},utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 17:// hide from display, the cart item belonging to the deleted product
$cartDisplayedItem=$('#view-cart-page .col-xs-12[data-utopiasoftware-product-uid="'+productUId+'"]');_context104.next=20;return kendo.fx($cartDisplayedItem).expand("vertical").duration(250).reverse();case 20:// update the total price of items displayed
$('#view-cart-page #view-cart-total-price').html('&#x20a6;'+kendo.toString(utopiasoftware[utopiasoftware_app_namespace].controller.viewCartPageViewModel.calculateCartTotalPrice(localCart),"n2"));// inform the user that the product has been removed from cart
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=2000;toast.content='Product has been deleted from your cart';toast.dataBind();toast.show();_context104.next=42;break;case 31:_context104.prev=31;_context104.t1=_context104['catch'](1);console.log("DELETE CART ERROR",_context104.t1);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast13=$('.timed-page-toast').get(0).ej2_instances[0];_toast13.cssClass='error-ej2-toast';_toast13.timeOut=3500;_toast13.content='Error deleting product from your cart. Try again';_toast13.dataBind();_toast13.show();case 42:_context104.prev=42;// hide page preloader
$('#view-cart-page .page-preloader').css("display","none");return _context104.finish(42);case 45:case'end':return _context104.stop();}}},_callee104,this,[[1,31,42,45],[5,11]]);}));// display the delete confirmation dialog
_context105.next=4;return document.getElementById('view-cart-page-delete-cart-item-action-sheet').show();case 4:case'end':return _context105.stop();}}},_callee105,this);}));function deleteCartItemButtonClicked(){return _ref106.apply(this,arguments);}return deleteCartItemButtonClicked;}(),/**
         * method is triggered when the "Edit" cart item button (attached to each product on the
         * View Cart page) is clicked.
         *
         * @param productUrl {String} holds the remote/server url for the product desired to be edited
         *
         * @param cartItemKey {String} holds the remote/server cart key for this product/cart-item
         *
         * @returns {Promise<void>}
         */editCartItemButtonClicked:function(){var _ref109=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee106(productUrl,cartItemKey){return regeneratorRuntime.wrap(function _callee106$(_context106){while(1){switch(_context106.prev=_context106.next){case 0:_context106.next=2;return $('#app-main-navigator').get(0).bringPageTop("customise-product-page.html");case 2:_context106.next=4;return utopiasoftware[utopiasoftware_app_namespace].controller.customiseProductPageViewModel.loadProductCustomisation(productUrl,cartItemKey);case 4:case'end':return _context106.stop();}}},_callee106,this);}));function editCartItemButtonClicked(_x51,_x52){return _ref109.apply(this,arguments);}return editCartItemButtonClicked;}(),/**
         * method is triggerd when the "Check Out" button is clicked
         *
         * @returns {Promise<void>}
         */checkoutButtonClicked:function(){var _ref110=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee107(){var userDetails,toast,localCart,_toast14,_toast15,_toast16,orderData,userCart,index,key,pagesStackArray,indexOfCheckoutPage,_toast17;return regeneratorRuntime.wrap(function _callee107$(_context107){while(1){switch(_context107.prev=_context107.next){case 0:userDetails=null;// holds the user details
// check if a user has signed in
_context107.prev=1;_context107.next=4;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 4:userDetails=_context107.sent.userDetails;_context107.next=19;break;case 7:_context107.prev=7;_context107.t0=_context107['catch'](1);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3500;toast.content='Please sign in to checkout your cart';toast.dataBind();toast.show();// send the user to the sign in page
$('#app-main-navigator').get(0).pushPage('login-page.html');return _context107.abrupt('return');case 19:_context107.prev=19;_context107.next=22;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 22:localCart=_context107.sent.cart;if(!(localCart.length===0)){_context107.next=25;break;}throw"error";case 25:_context107.next=38;break;case 27:_context107.prev=27;_context107.t1=_context107['catch'](19);// display message to inform user that cart is empty
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast14=$('.timed-page-toast').get(0).ej2_instances[0];_toast14.cssClass='default-ej2-toast';_toast14.timeOut=3000;_toast14.content='Your cart is empty. Go order some products!';_toast14.dataBind();_toast14.show();return _context107.abrupt('return');case 38:if(!(userDetails.billing.address_1=="")){_context107.next=49;break;}// no billing address has been provided
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast15=$('.timed-page-toast').get(0).ej2_instances[0];_toast15.cssClass='error-ej2-toast';_toast15.timeOut=3500;_toast15.content='Please update your billing address to checkout your cart';_toast15.dataBind();_toast15.show();$('#app-main-navigator').get(0).pushPage('billing-info-page.html');return _context107.abrupt('return');case 49:if(!(navigator.connection.type===Connection.NONE)){_context107.next=59;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast16=$('.timed-page-toast').get(0).ej2_instances[0];_toast16.cssClass='error-ej2-toast';_toast16.timeOut=3000;_toast16.content='Connect to the Internet to checkout your cart';_toast16.dataBind();_toast16.show();return _context107.abrupt('return');case 59:// show the app loader modal
$('#loader-modal-message').html("Preparing Checkout...");$('#loader-modal').get(0).show();// show loader
// create the user's order object
orderData={status:"pending",currency:"NGN",customer_id:userDetails.id,billing:userDetails.billing,shipping:userDetails.shipping,line_items:[]};_context107.prev=62;_context107.next=65;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 65:userCart=_context107.sent.cart;// loop through the user cart item to create the order items
for(index=0;index<userCart.length;index++){orderData.line_items[index]=userCart[index].cartData;// add the product name to the order line item
if(userCart[index].product){// this product was added to cart without customisation
orderData.line_items[index].name=userCart[index].product.name;// add the product name
// calculate the subtotal & total for this line item
orderData.line_items[index].subtotal=""+kendo.parseFloat(userCart[index].product.price)*orderData.line_items[index].quantity;orderData.line_items[index].total=""+kendo.parseFloat(userCart[index].product.price)*orderData.line_items[index].quantity;}else{// this product was added to cart via customisation
orderData.line_items[index].name=userCart[index].product_name;// add the product name
}orderData.line_items[index].meta_data=[];// create the meta-data array for each order line item
// check if the product being ordered has a variation
if(userCart[index].cartData.variation_id){// this product has a variation
if(!userCart[index].cartData.cart_item_data){// if the product has no customisation data
// calculate the subtotal & total for this line item
orderData.line_items[index].subtotal=""+kendo.parseFloat(userCart[index].productVariation.price)*orderData.line_items[index].quantity;orderData.line_items[index].total=""+kendo.parseFloat(userCart[index].productVariation.price)*orderData.line_items[index].quantity;}// add the variation attributes to the line item meta data
for(key in userCart[index].cartData.variation){orderData.line_items[index].meta_data.push({// add the variation attributes for this product to the line items meta-data array.
// the meta-data object key value is gotten by splitting the variation key
key:key.split("_")[1],value:userCart[index].cartData.variation[key]});}}// check if the product has any customisation data to attach
if(userCart[index].cartData.cart_item_data){console.log("ORDER ITEM",userCart[index].cartData);// calculate the subtotal & total for this line item
orderData.line_items[index].subtotal=""+kendo.parseFloat(userCart[index].cartData.cart_item_data.fpd_data.fpd_product_price)*orderData.line_items[index].quantity;orderData.line_items[index].total=""+kendo.parseFloat(userCart[index].cartData.cart_item_data.fpd_data.fpd_product_price)*orderData.line_items[index].quantity;orderData.line_items[index].meta_data.push({// add the customisation data for this product to the line items meta-data array.
key:"_fpd_data",value:userCart[index].cartData.cart_item_data.fpd_data.fpd_product},{// add the customisation data for this product to the line items meta-data array.
key:"_fpd_print_order",value:userCart[index].cartData.cart_item_data.fpd_data.fpd_print_order});// delete the 'cart_item_data' property from the line item because it is not needed for submisssion
delete orderData.line_items[index].cart_item_data;}}console.log("ORDER DATA",orderData);// create the order on the remote server
_context107.next=70;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/orders',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(orderData)}));case 70:orderData=_context107.sent;// check if the checkout page has previously been displayed in the app-main navigator
pagesStackArray=$('#app-main-navigator').get(0).pages;// holds the array of pages in the app-main navigator
indexOfCheckoutPage=pagesStackArray.findIndex(function(page,pageIndex){// test ikf the page is the checkout page
return $(pagesStackArray[pageIndex]).get(0).id==="checkout-page";});// check if the checkout page was found in the app-main navigator stack
if(!(indexOfCheckoutPage>-1)){_context107.next=76;break;}_context107.next=76;return $('#app-main-navigator').get(0).removePage(indexOfCheckoutPage);case 76:_context107.next=78;return $('#app-main-navigator').get(0).pushPage("checkout-page.html",{data:{orderData:orderData}});case 78:_context107.next=91;break;case 80:_context107.prev=80;_context107.t2=_context107['catch'](62);_context107.t2=JSON.parse(_context107.t2.responseText);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast17=$('.timed-page-toast').get(0).ej2_instances[0];_toast17.cssClass='error-ej2-toast';_toast17.timeOut=3000;_toast17.content='Checkout failed. '+(_context107.t2.message||"");_toast17.dataBind();_toast17.show();case 91:_context107.prev=91;// hide the app loader
$('#loader-modal').get(0).hide();// hide loader
return _context107.finish(91);case 94:case'end':return _context107.stop();}}},_callee107,this,[[1,7],[19,27],[62,80,91,94]]);}));function checkoutButtonClicked(){return _ref110.apply(this,arguments);}return checkoutButtonClicked;}()},/**
     * this is the view-model/controller for the Profile page
     */profilePageViewModel:{/**
         * used to hold the parsley form validation object for the profile form
         */profileFormValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref111=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee108(){return regeneratorRuntime.wrap(function _callee108$(_context108){while(1){switch(_context108.prev=_context108.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context108.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context108.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.backButtonClicked;// initialise the profile form validation
utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator=$('#profile-page #profile-form').parsley();// listen for profile form field validation failure event
utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
var tooltip=$('#profile-page #profile-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.content=fieldInstance.getErrorsMessages()[0];tooltip.dataBind();tooltip.open(fieldInstance.$element.get(0));});// listen for profile form field validation success event
utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.on('field:success',function(fieldInstance){// hide tooltip from element
var tooltip=$('#profile-page #profile-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.close();});// listen for profile form validation success
utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.on('form:success',utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidated);// listen for scroll event on the page to adjust the tooltips when page scrolls
$('#profile-page .content').on("scroll",utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.scrollAndResizeEventListener);_context108.prev=9;// create the tooltip objects for the profile form
$('#profile-form ons-input',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the html form object
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopLeft',opensOn:'Custom'}).appendTo($('#profile-page #profile-form').get(0));});// create the "Cancel" button
new ej.buttons.Button({//iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
//iconPosition: "Left"
}).appendTo('#profile-cancel');// create the "Update" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#profile-update');// display the user's profile on the profile form
_context108.next=15;return utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.displayProfileContent();case 15:_context108.next=20;break;case 17:_context108.prev=17;_context108.t0=_context108['catch'](9);console.log("PROFILE ERROR",_context108.t0);case 20:_context108.prev=20;return _context108.finish(20);case 22:case'end':return _context108.stop();}}},_callee108,this,[[9,17,20,22]]);}));return function loadPageOnAppReady(){return _ref111.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){window.SoftInputMode.set('adjustResize');// update cart count
$('#profile-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);//add listener for when the window is resized by virtue of the device keyboard being shown
window.addEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.scrollAndResizeEventListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref112=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee109(){return regeneratorRuntime.wrap(function _callee109$(_context109){while(1){switch(_context109.prev=_context109.next){case 0:// hide the tooltips on the profile form
$('#profile-page #profile-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// reset all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.reset();//remove listener for when the window is resized by virtue of the device keyboard being shown
window.removeEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.scrollAndResizeEventListener,false);case 3:case'end':return _context109.stop();}}},_callee109,this);}));function pageHide(){return _ref112.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the tooltips on the profile form
$('#profile-page #profile-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// destroy the tooltip
tooltipArrayElem.destroy();});// destroy the "Cancel" and "Update" buttons
$('#profile-page #profile-cancel').get(0).ej2_instances[0].destroy();$('#profile-page #profile-update').get(0).ej2_instances[0].destroy();// destroy all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.destroy();},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */scrollAndResizeEventListener:function(){var _ref113=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee110(){return regeneratorRuntime.wrap(function _callee110$(_context110){while(1){switch(_context110.prev=_context110.next){case 0:// place function execution in the event queue to be executed ASAP
window.setTimeout(function(){// adjust the tooltips elements on the profile form
$("#profile-page #profile-form ons-input").each(function(index,element){document.getElementById('profile-form').ej2_instances[index].refresh(element);});},0);case 1:case'end':return _context110.stop();}}},_callee110,this);}));function scrollAndResizeEventListener(){return _ref113.apply(this,arguments);}return scrollAndResizeEventListener;}(),/**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */updateButtonClicked:function(){var _ref114=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee111(){return regeneratorRuntime.wrap(function _callee111$(_context111){while(1){switch(_context111.prev=_context111.next){case 0:// run the validation method for the profile form
utopiasoftware[utopiasoftware_app_namespace].controller.profilePageViewModel.profileFormValidator.whenValidate();case 1:case'end':return _context111.stop();}}},_callee111,this);}));function updateButtonClicked(){return _ref114.apply(this,arguments);}return updateButtonClicked;}(),/**
         * method is triggered when the profile form is successfully validated
         *
         * @returns {Promise<void>}
         */profileFormValidated:function(){var _ref115=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee112(){var toast,promisesArray,promisesArrayPromise,userDetails,userId,userPassword,resultsArray,_toast18,_toast19;return regeneratorRuntime.wrap(function _callee112$(_context112){while(1){switch(_context112.prev=_context112.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context112.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to update your profile';toast.dataBind();toast.show();return _context112.abrupt('return');case 10:// disable the "Update" button
$('#profile-page #profile-update').attr("disabled",true);// show the spinner on the 'Update' button to indicate process is ongoing
$('#profile-page #profile-update').get(0).ej2_instances[0].cssClass='';$('#profile-page #profile-update').get(0).ej2_instances[0].dataBind();$('#profile-page #profile-update').get(0).ej2_instances[0].start();// display page loader while completing the "update profile" request
$('#profile-page .modal').css("display","table");promisesArray=[];// holds the array for the promises used to complete the process
promisesArrayPromise=null;// holds the promise gotten from the promisesArray
_context112.prev=17;_context112.next=20;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 20:userDetails=_context112.sent.userDetails;console.log("USER DETAILS BEFORE PROFILE UPDATE",userDetails);// temporary hold the user id and password
userId=userDetails.id;userPassword=userDetails.password;// use the input from the profile form to update the user details
userDetails.first_name=$('#profile-page #profile-form #profile-first-name').val().trim();userDetails.last_name=$('#profile-page #profile-form #profile-last-name').val().trim();// check if user details has the billing property
if(!userDetails.billing){// no billing property, so create it
// create the billing property
userDetails.billing={};}// set the billing email to the email of the user
userDetails.billing.email=$('#profile-page #profile-form #profile-email').val().trim();// set the billing first name and last name to that of the user
userDetails.billing.first_name=userDetails.first_name;userDetails.billing.last_name=userDetails.last_name;// update the user phone number
userDetails.billing.phone=$('#profile-page #profile-form #profile-phone-number').val().trim();if(userDetails.billing.phone.startsWith("0")){// phone number starts with zero
// replace the starting zero with '+234'
userDetails.billing.phone=userDetails.billing.phone.replace(/0/i,"+234");}// delete the properties not needed for the update from the userDetails object
delete userDetails.id;delete userDetails.password;// now send the user profile update request to the remote server
promisesArray.push(Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/customers/'+userId),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(userDetails)})));// get the promise created from the promisesArray
promisesArrayPromise=Promise.all(promisesArray);// get the result from the promisesArray
_context112.next=38;return promisesArrayPromise;case 38:resultsArray=_context112.sent;// add the user's password to the user details retrieved from the server
resultsArray[0].password=userPassword;// save the created user details data to ENCRYPTED app database as cached data
_context112.next=42;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:resultsArray[0]},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 42:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast18=$('.timed-page-toast').get(0).ej2_instances[0];_toast18.cssClass='success-ej2-toast';_toast18.timeOut=3000;_toast18.content='User profile updated';_toast18.dataBind();_toast18.show();_context112.next=63;break;case 52:_context112.prev=52;_context112.t0=_context112['catch'](17);_context112.t0=JSON.parse(_context112.t0.responseText);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast19=$('.timed-page-toast').get(0).ej2_instances[0];_toast19.cssClass='error-ej2-toast';_toast19.timeOut=3000;_toast19.content='User profile update failed. '+(_context112.t0.message||"");_toast19.dataBind();_toast19.show();case 63:_context112.prev=63;// enable the "Update" button
$('#profile-page #profile-update').removeAttr("disabled");// hide the spinner on the 'Update' button to indicate process is ongoing
$('#profile-page #profile-update').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#profile-page #profile-update').get(0).ej2_instances[0].dataBind();$('#profile-page #profile-update').get(0).ej2_instances[0].stop();// hide page loader
$('#profile-page .modal').css("display","none");return _context112.finish(63);case 70:return _context112.abrupt('return',promisesArrayPromise);case 71:case'end':return _context112.stop();}}},_callee112,this,[[17,52,63,70]]);}));function profileFormValidated(){return _ref115.apply(this,arguments);}return profileFormValidated;}(),/**
         * method is used to load the current user profile data into the profile form
         * @returns {Promise<void>}
         */displayProfileContent:function(){var _ref116=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee113(){var userDetails;return regeneratorRuntime.wrap(function _callee113$(_context113){while(1){switch(_context113.prev=_context113.next){case 0:_context113.prev=0;_context113.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:userDetails=_context113.sent.userDetails;console.log("USER DETAILS",userDetails);// display the user profile data in the profile form
$('#profile-page #profile-form #profile-email').val(userDetails.email);$('#profile-page #profile-form #profile-first-name').val(userDetails.first_name||"");$('#profile-page #profile-form #profile-last-name').val(userDetails.last_name||"");$('#profile-page #profile-form #profile-phone-number').val(userDetails.billing&&userDetails.billing.phone?userDetails.billing.phone:"");case 9:_context113.prev=9;// hide page preloader
$('#profile-page .page-preloader').css("display","none");// hide page modal loader
$('#profile-page .modal').css("display","none");// enable the "Update" button
$('#profile-page #profile-update').removeAttr("disabled");return _context113.finish(9);case 14:case'end':return _context113.stop();}}},_callee113,this,[[0,,9,14]]);}));function displayProfileContent(){return _ref116.apply(this,arguments);}return displayProfileContent;}()},/**
     * this is the view-model/controller for the Change Password page
     */changePasswordPageViewModel:{/**
         * used to hold the parsley form validation object for the change password form
         */changePasswordFormValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref117=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee114(){return regeneratorRuntime.wrap(function _callee114$(_context114){while(1){switch(_context114.prev=_context114.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context114.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context114.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.backButtonClicked;// initialise the changePassword form validation
utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator=$('#change-password-page #change-password-form').parsley();// listen for changePassword form field validation failure event
utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
var tooltip=$('#change-password-page #change-password-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.content=fieldInstance.getErrorsMessages()[0];tooltip.dataBind();tooltip.open(fieldInstance.$element.get(0));});// listen for changePassword form field validation success event
utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator.on('field:success',function(fieldInstance){// hide tooltip from element
var tooltip=$('#change-password-page #change-password-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.close();});// listen for profile form validation success
utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator.on('form:success',utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidated);// listen for scroll event on the page to adjust the tooltips when page scrolls
$('#change-password-page .content').on("scroll",utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.scrollAndResizeEventListener);try{// create the tooltip objects for the changePassword form
$('#change-password-form ons-input',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the html form object
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopLeft',opensOn:'Custom'}).appendTo($('#change-password-page #change-password-form').get(0));});// create the button for switching password visibility on the signup page
new ej.buttons.Button({isToggle:true,cssClass:'e-flat e-small e-round',iconCss:"zmdi zmdi-eye",iconPosition:"Left"}).appendTo($('#change-password-view-button',$thisPage).get(0));// create the "Cancel" button
new ej.buttons.Button({//iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
//iconPosition: "Left"
}).appendTo('#change-password-cancel');// create the "Update" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#change-password-update');}catch(err){console.log("CHANGE PASSWORD ERROR",err);}finally{// hide the page preloader
$('#change-password-page .page-preloader').css("display","none");// hide page loader
$('#change-password-page .modal').css("display","none");// enable the update button
$('#change-password-page #change-password-update').removeAttr("disabled");}case 10:case'end':return _context114.stop();}}},_callee114,this);}));return function loadPageOnAppReady(){return _ref117.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){window.SoftInputMode.set('adjustResize');// update cart count
$('#change-password-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);//add listener for when the window is resized by virtue of the device keyboard being shown
window.addEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.scrollAndResizeEventListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref118=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee115(){return regeneratorRuntime.wrap(function _callee115$(_context115){while(1){switch(_context115.prev=_context115.next){case 0:// hide the tooltips on the changePassword form
$('#change-password-page #change-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// reset all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator.reset();//remove listener for when the window is resized by virtue of the device keyboard being shown
window.removeEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.scrollAndResizeEventListener,false);case 3:case'end':return _context115.stop();}}},_callee115,this);}));function pageHide(){return _ref118.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the tooltips on the changePassword form
$('#change-password-page #change-password-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// destroy the tooltip
tooltipArrayElem.destroy();});// destroy the "Cancel" and "Update" buttons
$('#change-password-page #change-password-cancel').get(0).ej2_instances[0].destroy();$('#change-password-page #change-password-update').get(0).ej2_instances[0].destroy();// destroy the password visibility button
$('#change-password-page #change-password-view-button').get(0).ej2_instances[0].destroy();// destroy all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator.destroy();},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered when the Password Visibility button is clicked
         *
         * @param buttonElement {HTMLElement} button element being clicked
         *
         * @param inputId {String} the id for the input whose content visibility is being changed
         */passwordVisibilityButtonClicked:function passwordVisibilityButtonClicked(buttonElement,inputId){// check the state of the button is it 'active' or not
if(!$(buttonElement).hasClass('e-active')){// button is not active
// change the type for the input field
$(document.getElementById(inputId)).attr("type","text");// change the icon on the button to indicate the change in visibility
var ej2Button=buttonElement.ej2_instances[0];ej2Button.iconCss='zmdi zmdi-eye-off';ej2Button.dataBind();}else{// button is active
// change the type for the input field
$(document.getElementById(inputId)).attr("type","password");// change the icon on the button to indicate the change in visibility
var _ej2Button2=buttonElement.ej2_instances[0];_ej2Button2.iconCss='zmdi zmdi-eye';_ej2Button2.dataBind();}},/**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */scrollAndResizeEventListener:function(){var _ref119=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee116(){return regeneratorRuntime.wrap(function _callee116$(_context116){while(1){switch(_context116.prev=_context116.next){case 0:// place function execution in the event queue to be executed ASAP
window.setTimeout(function(){// adjust the tooltips elements on the changePassword form
$("#change-password-page #change-password-form ons-input").each(function(index,element){document.getElementById('change-password-form').ej2_instances[index].refresh(element);});},0);case 1:case'end':return _context116.stop();}}},_callee116,this);}));function scrollAndResizeEventListener(){return _ref119.apply(this,arguments);}return scrollAndResizeEventListener;}(),/**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */updateButtonClicked:function(){var _ref120=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee117(){return regeneratorRuntime.wrap(function _callee117$(_context117){while(1){switch(_context117.prev=_context117.next){case 0:// run the validation method for the profile form
utopiasoftware[utopiasoftware_app_namespace].controller.changePasswordPageViewModel.changePasswordFormValidator.whenValidate();case 1:case'end':return _context117.stop();}}},_callee117,this);}));function updateButtonClicked(){return _ref120.apply(this,arguments);}return updateButtonClicked;}(),/**
         * method is triggered when the changePassword form is successfully validated
         *
         * @returns {Promise<void>}
         */changePasswordFormValidated:function(){var _ref121=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee118(){var toast,promisesArray,promisesArrayPromise,userDetails,userId,resultsArray,_toast20,_toast21;return regeneratorRuntime.wrap(function _callee118$(_context118){while(1){switch(_context118.prev=_context118.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context118.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to change password';toast.dataBind();toast.show();return _context118.abrupt('return');case 10:// disable the "Update" button
$('#change-password-page #change-password-update').attr("disabled",true);// show the spinner on the 'Update' button to indicate process is ongoing
$('#change-password-page #change-password-update').get(0).ej2_instances[0].cssClass='';$('#change-password-page #change-password-update').get(0).ej2_instances[0].dataBind();$('#change-password-page #change-password-update').get(0).ej2_instances[0].start();// display page loader while completing the "update profile" request
$('#change-password-page .modal').css("display","table");promisesArray=[];// holds the array for the promises used to complete the process
promisesArrayPromise=null;// holds the promise gotten from the promisesArray
_context118.prev=17;_context118.next=20;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 20:userDetails=_context118.sent.userDetails;console.log("USER DETAILS BEFORE PASSWORD CHANGE",userDetails);// check if the current password input matches that in the current user password
_context118.prev=22;_context118.next=25;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json",type:"get",// contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+Base64.encode(userDetails.email+':'+jQuery('#change-password-current-password').val().trim()));},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false}));case 25:_context118.next=30;break;case 27:_context118.prev=27;_context118.t0=_context118['catch'](22);throw{responseText:JSON.stringify({message:"current password is incorrect."})};case 30:// temporary hold the user id
userId=userDetails.id;// delete the billing and shipping info from the userData object being updated because it's not needed.
// if the password change is successful, the response will include
// the billing and shipping retrieved from the server.
delete userDetails.billing;delete userDetails.shipping;// use the new password input to change/update the user password
userDetails.password=$('#change-password-page #change-password-form #change-password-new-password').val().trim();// now send the user profile/password change request to the remote server
promisesArray.push(Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/customers/'+userId),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(userDetails)})));// get the promise created from the promisesArray
promisesArrayPromise=Promise.all(promisesArray);// get the result from the promisesArray
_context118.next=38;return promisesArrayPromise;case 38:resultsArray=_context118.sent;// add the user's new password to the user details retrieved from the server
resultsArray[0].password=$('#change-password-page #change-password-form #change-password-new-password').val().trim();console.log("PASSWORD CHANGED",resultsArray[0]);// save the created user details data to ENCRYPTED app database as cached data
_context118.next=43;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:resultsArray[0]},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 43:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast20=$('.timed-page-toast').get(0).ej2_instances[0];_toast20.cssClass='success-ej2-toast';_toast20.timeOut=3000;_toast20.content='User password changed';_toast20.dataBind();_toast20.show();_context118.next=64;break;case 53:_context118.prev=53;_context118.t1=_context118['catch'](17);_context118.t1=JSON.parse(_context118.t1.responseText);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast21=$('.timed-page-toast').get(0).ej2_instances[0];_toast21.cssClass='error-ej2-toast';_toast21.timeOut=3000;_toast21.content='User password change failed. '+(_context118.t1.message||"");_toast21.dataBind();_toast21.show();case 64:_context118.prev=64;// enable the "Update" button
$('#change-password-page #change-password-update').removeAttr("disabled");// hide the spinner on the 'Update' button to indicate process is ongoing
$('#change-password-page #change-password-update').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#change-password-page #change-password-update').get(0).ej2_instances[0].dataBind();$('#change-password-page #change-password-update').get(0).ej2_instances[0].stop();// hide page loader
$('#change-password-page .modal').css("display","none");return _context118.finish(64);case 71:return _context118.abrupt('return',promisesArrayPromise);case 72:case'end':return _context118.stop();}}},_callee118,this,[[17,53,64,71],[22,27]]);}));function changePasswordFormValidated(){return _ref121.apply(this,arguments);}return changePasswordFormValidated;}()},/**
     * this is the view-model/controller for the Billing Info page
     */billingInfoPageViewModel:{/**
         * used to hold the parsley form validation object for the billing address form
         */billingInfoFormValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref122=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee120(){var countryDataArray;return regeneratorRuntime.wrap(function _callee120$(_context120){while(1){switch(_context120.prev=_context120.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context120.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context120.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.backButtonClicked;// initialise the billing info form validation
utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator=$('#billing-info-page #billing-info-form').parsley();// initialise the custom validation for the billing info 'country' field
$('#billing-info-page #billing-info-form #billing-info-country').parsley({value:function value(parsley){// return the value from the dropdownlist
return $('#billing-info-country').get(0).ej2_instances[0].value;}});// initialise the custom validation for the billing info 'state' field
$('#billing-info-page #billing-info-form #billing-info-state').parsley({value:function value(parsley){// function returns a 'custom' value
// get the State dropdownlist component
var stateDropDownList=$('#billing-info-state').get(0).ej2_instances[0];// check if the dropdownlist is enabled or not
if(stateDropDownList.enabled!==true){// dropdownlist is disabled
return" ";// return an empty string
}else{// dropdownlist is enabled
return stateDropDownList.value;// return the value from the dropdownlist
}}});// listen for billing form field validation failure event
utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
var tooltip=$('#billing-info-page #billing-info-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.content=fieldInstance.getErrorsMessages()[0];tooltip.dataBind();tooltip.open(fieldInstance.$element.get(0));});// listen for billing info form field validation success event
utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.on('field:success',function(fieldInstance){// hide tooltip from element
var tooltip=$('#billing-info-page #billing-info-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.close();});// listen for billing info form validation success
utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.on('form:success',utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidated);// listen for scroll event on the page to adjust the tooltips when page scrolls
$('#billing-info-page .content').on("scroll",utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.scrollAndResizeEventListener);_context120.prev=11;// create the "Cancel" button
new ej.buttons.Button({//iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
//iconPosition: "Left"
}).appendTo('#billing-info-cancel');// create the "Update" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#billing-info-update');countryDataArray=[];// holds the array containing country objects
// load the country data from the local list with the app
_context120.next=17;return Promise.resolve($.ajax({url:'country-list.json',type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}}));case 17:countryDataArray=_context120.sent;// create the tooltip objects for the billing info form
$('#billing-info-form textarea, #billing-info-form ons-input, #billing-info-form #billing-info-country, #billing-info-form #billing-info-state',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the html form object
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopLeft',opensOn:'Custom'}).appendTo($('#billing-info-page #billing-info-form').get(0));});// create the Country dropdown list from the select input
new ej.dropdowns.DropDownList({cssClass:"billing-info-dropdownlist",dataSource:countryDataArray,fields:{value:'code',text:'name'},placeholder:"Country",floatLabelType:'Auto',value:'NG',itemTemplate:'<span>${name}</span>',valueTemplate:'<span>${name}</span>'}).appendTo('#billing-info-country');// create the Country dropdown list from the select input
new ej.dropdowns.DropDownList({cssClass:"billing-info-dropdownlist",dataSource:countryDataArray.find(function(countryElement){return countryElement.code==="NG";}).states,fields:{value:'code',text:'name'},placeholder:"State",floatLabelType:'Auto',itemTemplate:'<span>${name}</span>',valueTemplate:'<span>${name}</span>',select:function(){var _ref123=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee119(){return regeneratorRuntime.wrap(function _callee119$(_context119){while(1){switch(_context119.prev=_context119.next){case 0:// listen for when dropdown list value is changed by selection
// handle method task in a different event block
window.setTimeout(function(){$('#billing-info-page #billing-info-form').get(0).ej2_instances[$('#billing-info-state').get(0)._utopiasoftware_validator_index].close();// call the method used to trigger the form validation
/*utopiasoftware[utopiasoftware_app_namespace].controller.
                                    billingInfoPageViewModel.updateButtonClicked()*/},0);case 1:case'end':return _context119.stop();}}},_callee119,this);}));function select(){return _ref123.apply(this,arguments);}return select;}()}).appendTo('#billing-info-state');// display the billing info on the billing info form
_context120.next=23;return utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.displayContent();case 23:_context120.next=28;break;case 25:_context120.prev=25;_context120.t0=_context120['catch'](11);console.log("BILLING ADDRESS ERROR",_context120.t0);case 28:_context120.prev=28;return _context120.finish(28);case 30:case'end':return _context120.stop();}}},_callee120,this,[[11,25,28,30]]);}));return function loadPageOnAppReady(){return _ref122.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){window.SoftInputMode.set('adjustResize');// update cart count
$('#billing-info-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);//add listener for when the window is resized by virtue of the device keyboard being shown
window.addEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.scrollAndResizeEventListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref124=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee121(){return regeneratorRuntime.wrap(function _callee121$(_context121){while(1){switch(_context121.prev=_context121.next){case 0:// hide the tooltips on the profile form
$('#billing-info-page #billing-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// reset all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.reset();//remove listener for when the window is resized by virtue of the device keyboard being shown
window.removeEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.scrollAndResizeEventListener,false);case 3:case'end':return _context121.stop();}}},_callee121,this);}));function pageHide(){return _ref124.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the tooltips on the profile form
$('#billing-info-page #billing-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// destroy the tooltip
tooltipArrayElem.destroy();});// destroy the Country & State DropDownLists
$('#billing-info-page #billing-info-country').get(0).ej2_instances[0].destroy();$('#billing-info-page #billing-info-state').get(0).ej2_instances[0].destroy();// destroy the "Cancel" and "Update" buttons
$('#billing-info-page #billing-info-cancel').get(0).ej2_instances[0].destroy();$('#billing-info-page #billing-info-update').get(0).ej2_instances[0].destroy();// destroy all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.destroy();},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */scrollAndResizeEventListener:function(){var _ref125=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee122(){return regeneratorRuntime.wrap(function _callee122$(_context122){while(1){switch(_context122.prev=_context122.next){case 0:// place function execution in the event queue to be executed ASAP
window.setTimeout(function(){// adjust the tooltips elements on the profile form
$('#billing-info-form textarea, #billing-info-form ons-input, #billing-info-form #billing-info-country, #billing-info-form #billing-info-state').each(function(index,element){document.getElementById('billing-info-form').ej2_instances[index].refresh(element);});},0);case 1:case'end':return _context122.stop();}}},_callee122,this);}));function scrollAndResizeEventListener(){return _ref125.apply(this,arguments);}return scrollAndResizeEventListener;}(),/**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */updateButtonClicked:function(){var _ref126=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee123(){return regeneratorRuntime.wrap(function _callee123$(_context123){while(1){switch(_context123.prev=_context123.next){case 0:// run the validation method for the billing-info form
utopiasoftware[utopiasoftware_app_namespace].controller.billingInfoPageViewModel.billingInfoFormValidator.whenValidate();case 1:case'end':return _context123.stop();}}},_callee123,this);}));function updateButtonClicked(){return _ref126.apply(this,arguments);}return updateButtonClicked;}(),/**
         * method is triggered when the billing-info form is successfully validated
         *
         * @returns {Promise<void>}
         */billingInfoFormValidated:function(){var _ref127=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee124(){var toast,promisesArray,promisesArrayPromise,userDetails,userId,userPassword,resultsArray,_toast22,_toast23;return regeneratorRuntime.wrap(function _callee124$(_context124){while(1){switch(_context124.prev=_context124.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context124.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to update your billing address';toast.dataBind();toast.show();return _context124.abrupt('return');case 10:// disable the "Update" button
$('#billing-info-page #billing-info-update').attr("disabled",true);// show the spinner on the 'Update' button to indicate process is ongoing
$('#billing-info-page #billing-info-update').get(0).ej2_instances[0].cssClass='';$('#billing-info-page #billing-info-update').get(0).ej2_instances[0].dataBind();$('#billing-info-page #billing-info-update').get(0).ej2_instances[0].start();// display page loader while completing the "update profile" request
$('#billing-info-page .modal').css("display","table");promisesArray=[];// holds the array for the promises used to complete the process
promisesArrayPromise=null;// holds the promise gotten from the promisesArray
_context124.prev=17;_context124.next=20;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 20:userDetails=_context124.sent.userDetails;console.log("USER DETAILS BEFORE BILLING INFO UPDATE",userDetails);// temporary hold the user id and password
userId=userDetails.id;userPassword=userDetails.password;// check if user details has the billing property
if(!userDetails.billing){// no billing property, so create it
// create the billing property
userDetails.billing={};}// set the billing email to the email of the user
userDetails.billing.email=userDetails.email;// use the input from the profile form to update the user details
userDetails.billing.company=$('#billing-info-page #billing-info-company').val().trim();userDetails.billing.address_1=$('#billing-info-page #billing-info-address-1').val().trim();userDetails.billing.address_2=$('#billing-info-page #billing-info-address-2').val().trim();userDetails.billing.postcode=$('#billing-info-page #billing-info-postcode').val().trim();userDetails.billing.city=$('#billing-info-page #billing-info-city').val().trim();userDetails.billing.country=$('#billing-info-page #billing-info-country').get(0).ej2_instances[0].value;userDetails.billing.state=$('#billing-info-page #billing-info-state').get(0).ej2_instances[0].value?$('#billing-info-page #billing-info-state').get(0).ej2_instances[0].value:"";// delete the properties not needed for the update from the userDetails object
delete userDetails.id;delete userDetails.password;// now send the user profile update request to the remote server
promisesArray.push(Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/customers/'+userId),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(userDetails)})));// get the promise created from the promisesArray
promisesArrayPromise=Promise.all(promisesArray);// get the result from the promisesArray
_context124.next=39;return promisesArrayPromise;case 39:resultsArray=_context124.sent;// add the user's password to the user details retrieved from the server
resultsArray[0].password=userPassword;// save the created user details data to ENCRYPTED app database as cached data
_context124.next=43;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:resultsArray[0]},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 43:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast22=$('.timed-page-toast').get(0).ej2_instances[0];_toast22.cssClass='success-ej2-toast';_toast22.timeOut=3000;_toast22.content='User billing address updated';_toast22.dataBind();_toast22.show();_context124.next=64;break;case 53:_context124.prev=53;_context124.t0=_context124['catch'](17);_context124.t0=JSON.parse(_context124.t0.responseText);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast23=$('.timed-page-toast').get(0).ej2_instances[0];_toast23.cssClass='error-ej2-toast';_toast23.timeOut=3000;_toast23.content='User billing address update failed. '+(_context124.t0.message||"");_toast23.dataBind();_toast23.show();case 64:_context124.prev=64;// enable the "Update" button
$('#billing-info-page #billing-info-update').removeAttr("disabled");// hide the spinner on the 'Update' button to indicate process is ongoing
$('#billing-info-page #billing-info-update').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#billing-info-page #billing-info-update').get(0).ej2_instances[0].dataBind();$('#billing-info-page #billing-info-update').get(0).ej2_instances[0].stop();// hide page loader
$('#billing-info-page .modal').css("display","none");return _context124.finish(64);case 71:return _context124.abrupt('return',promisesArrayPromise);case 72:case'end':return _context124.stop();}}},_callee124,this,[[17,53,64,71]]);}));function billingInfoFormValidated(){return _ref127.apply(this,arguments);}return billingInfoFormValidated;}(),/**
         * method is used to load the current billing info data into the billing info form
         * @returns {Promise<void>}
         */displayContent:function(){var _ref128=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee128(){var userDetails,countryDropDownList,statesDropDownList;return regeneratorRuntime.wrap(function _callee128$(_context128){while(1){switch(_context128.prev=_context128.next){case 0:_context128.prev=0;_context128.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:userDetails=_context128.sent.userDetails;console.log("USER DETAILS",userDetails);// display the user billing info data in the billing info form
$('#billing-info-page #billing-info-form #billing-info-company').val(userDetails.billing&&userDetails.billing.company?userDetails.billing.company:"");$('#billing-info-page #billing-info-form #billing-info-address-1').val(userDetails.billing&&userDetails.billing.address_1?userDetails.billing.address_1:"");$('#billing-info-page #billing-info-form #billing-info-address-2').val(userDetails.billing&&userDetails.billing.address_2?userDetails.billing.address_2:"");$('#billing-info-page #billing-info-form #billing-info-postcode').val(userDetails.billing&&userDetails.billing.postcode?userDetails.billing.postcode:"");$('#billing-info-page #billing-info-form #billing-info-city').val(userDetails.billing&&userDetails.billing.city?userDetails.billing.city:"");// get the country dropdownlist
countryDropDownList=$('#billing-info-page #billing-info-form #billing-info-country').get(0).ej2_instances[0];// temporarily remove the select event listener for the country dropdownlist
countryDropDownList.removeEventListener("select");// update the select dropdownlist for country
countryDropDownList.value=userDetails.billing&&userDetails.billing.country&&userDetails.billing.country!==""?userDetails.billing.country:'NG';countryDropDownList.dataBind();// update the select dropdownlist for state
statesDropDownList=$('#billing-info-page #billing-info-form #billing-info-state').get(0).ej2_instances[0];statesDropDownList.dataSource=countryDropDownList.dataSource.find(function(countryElement){return countryElement.code===countryDropDownList.value;}).states;statesDropDownList.dataBind();statesDropDownList.value=userDetails.billing&&userDetails.billing.state&&userDetails.billing.state!==""?userDetails.billing.state:null;statesDropDownList.dataBind();// check if the state dropdownlist has a value
if(statesDropDownList.value){// check if the state dropdownlist has a value
statesDropDownList.enabled=true;// enable the state dropdownlist
statesDropDownList.dataBind();}else if(countryDropDownList.value==='NG'){// if the country selected is nigeria
statesDropDownList.enabled=true;// enable the state dropdownlist
statesDropDownList.dataBind();}else{// the state dropdown has no value and the country selected is not nigeria
statesDropDownList.enabled=false;// disable the state dropdownlist
statesDropDownList.dataBind();}console.log("STATE VALUE",statesDropDownList.value);case 21:_context128.prev=21;// hide page preloader
$('#billing-info-page .page-preloader').css("display","none");// hide page modal loader
$('#billing-info-page .modal').css("display","none");// enable the "Update" button
$('#billing-info-page #billing-info-update').removeAttr("disabled");// reinstate the country dropdownlist "select" listener in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee127(){return regeneratorRuntime.wrap(function _callee127$(_context127){while(1){switch(_context127.prev=_context127.next){case 0:// reinstate the country dropdownlist "select" listener
countryDropDownList.addEventListener("select",_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee126(){var countryDropDownList;return regeneratorRuntime.wrap(function _callee126$(_context126){while(1){switch(_context126.prev=_context126.next){case 0:// listen for when dropdown list value is changed by selection
countryDropDownList=this;// holds this dropdown list
// execute the task in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee125(){var countryStatesArray,stateDropDownList;return regeneratorRuntime.wrap(function _callee125$(_context125){while(1){switch(_context125.prev=_context125.next){case 0:// get the country object and its states that represents the country value selected
countryStatesArray=countryDropDownList.getDataByValue(countryDropDownList.value).states;// get the state dropdownlist
stateDropDownList=$('#billing-info-page #billing-info-form #billing-info-state').get(0).ej2_instances[0];// reset the selected value for the State
stateDropDownList.value=null;// reset the dataSource for the State
stateDropDownList.dataSource=countryStatesArray;if(countryStatesArray.length>0){// there are states in the selected country
// enable the State dropdownlist for user selection
stateDropDownList.enabled=true;}else{// there are NO states in the selected country
// disable the State dropdownlist for user selection
stateDropDownList.enabled=false;// since the dropdownlist is disabled, remove any tooltip that is being displayed on this component
$('#billing-info-page #billing-info-form').get(0).ej2_instances[$('#billing-info-state').get(0)._utopiasoftware_validator_index].close();}// bind/update all changes made to the State dropdownlist
stateDropDownList.dataBind();case 6:case'end':return _context125.stop();}}},_callee125,this);})),0);case 2:case'end':return _context126.stop();}}},_callee126,this);})));case 1:case'end':return _context127.stop();}}},_callee127,this);})),0);return _context128.finish(21);case 27:case'end':return _context128.stop();}}},_callee128,this,[[0,,21,27]]);}));function displayContent(){return _ref128.apply(this,arguments);}return displayContent;}()},/**
     * this is the view-model/controller for the Shipping Info page
     */shippingInfoPageViewModel:{/**
         * used to hold the parsley form validation object for the shipping info form
         */shippingInfoFormValidator:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref132=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee130(){var countryDataArray;return regeneratorRuntime.wrap(function _callee130$(_context130){while(1){switch(_context130.prev=_context130.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context130.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context130.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.backButtonClicked;// initialise the shipping info form validation
utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator=$('#shipping-info-page #shipping-info-form').parsley();// initialise the custom validation for the shipping info 'country' field
$('#shipping-info-page #shipping-info-form #shipping-info-country').parsley({value:function value(parsley){// return the value from the dropdownlist
return $('#shipping-info-country').get(0).ej2_instances[0].value;}});// initialise the custom validation for the shipping info 'state' field
$('#shipping-info-page #shipping-info-form #shipping-info-state').parsley({value:function value(parsley){// function returns a 'custom' value
// get the State dropdownlist component
var stateDropDownList=$('#shipping-info-state').get(0).ej2_instances[0];// check if the dropdownlist is enabled or not
if(stateDropDownList.enabled!==true){// dropdownlist is disabled
return" ";// return an empty string
}else{// dropdownlist is enabled
return stateDropDownList.value;// return the value from the dropdownlist
}}});// listen for shipping form field validation failure event
utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.on('field:error',function(fieldInstance){// get the element that triggered the field validation error and use it to display tooltip
// display tooltip
var tooltip=$('#shipping-info-page #shipping-info-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.content=fieldInstance.getErrorsMessages()[0];tooltip.dataBind();tooltip.open(fieldInstance.$element.get(0));});// listen for shipping info form field validation success event
utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.on('field:success',function(fieldInstance){// hide tooltip from element
var tooltip=$('#shipping-info-page #shipping-info-form').get(0).ej2_instances[fieldInstance.$element.get(0)._utopiasoftware_validator_index];tooltip.close();});// listen for shipping info form validation success
utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.on('form:success',utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidated);// listen for scroll event on the page to adjust the tooltips when page scrolls
$('#shipping-info-page .content').on("scroll",utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.scrollAndResizeEventListener);_context130.prev=11;// create the "Cancel" button
new ej.buttons.Button({//iconCss: "zmdi zmdi-shopping-cart-add utopiasoftware-icon-zoom-one-point-two",
//iconPosition: "Left"
}).appendTo('#shipping-info-cancel');// create the "Update" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#shipping-info-update');countryDataArray=[];// holds the array containing country objects
// load the country data from the local list with the app
_context130.next=17;return Promise.resolve($.ajax({url:'country-list.json',type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}}));case 17:countryDataArray=_context130.sent;// create the tooltip objects for the shipping info form
$('#shipping-info-form textarea, #shipping-info-form ons-input, #shipping-info-form #shipping-info-country, #shipping-info-form #shipping-info-state',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the html form object
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopLeft',opensOn:'Custom'}).appendTo($('#shipping-info-page #shipping-info-form').get(0));});// create the Country dropdown list from the select input
new ej.dropdowns.DropDownList({cssClass:"shipping-info-dropdownlist",dataSource:countryDataArray,fields:{value:'code',text:'name'},placeholder:"Country",floatLabelType:'Auto',value:'NG',itemTemplate:'<span>${name}</span>',valueTemplate:'<span>${name}</span>'}).appendTo('#shipping-info-country');// create the Country dropdown list from the select input
new ej.dropdowns.DropDownList({cssClass:"shipping-info-dropdownlist",dataSource:countryDataArray.find(function(countryElement){return countryElement.code==="NG";}).states,fields:{value:'code',text:'name'},placeholder:"State",floatLabelType:'Auto',itemTemplate:'<span>${name}</span>',valueTemplate:'<span>${name}</span>',select:function(){var _ref133=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee129(){return regeneratorRuntime.wrap(function _callee129$(_context129){while(1){switch(_context129.prev=_context129.next){case 0:// listen for when dropdown list value is changed by selection
// handle method task in a different event block
window.setTimeout(function(){// since the dropdownlist value has changed, remove any tooltip that is being displayed on this component
$('#shipping-info-page #shipping-info-form').get(0).ej2_instances[$('#shipping-info-state').get(0)._utopiasoftware_validator_index].close();},0);case 1:case'end':return _context129.stop();}}},_callee129,this);}));function select(){return _ref133.apply(this,arguments);}return select;}()}).appendTo('#shipping-info-state');// display the shipping info on the shipping info form
_context130.next=23;return utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.displayContent();case 23:_context130.next=28;break;case 25:_context130.prev=25;_context130.t0=_context130['catch'](11);console.log("SHIPPING INFO ERROR",_context130.t0);case 28:_context130.prev=28;return _context130.finish(28);case 30:case'end':return _context130.stop();}}},_callee130,this,[[11,25,28,30]]);}));return function loadPageOnAppReady(){return _ref132.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){window.SoftInputMode.set('adjustResize');// update cart count
$('#shipping-info-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);//add listener for when the window is resized by virtue of the device keyboard being shown
window.addEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.scrollAndResizeEventListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref134=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee131(){return regeneratorRuntime.wrap(function _callee131$(_context131){while(1){switch(_context131.prev=_context131.next){case 0:// hide the tooltips on the profile form
$('#shipping-info-page #shipping-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});// reset all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.reset();//remove listener for when the window is resized by virtue of the device keyboard being shown
window.removeEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.scrollAndResizeEventListener,false);case 3:case'end':return _context131.stop();}}},_callee131,this);}));function pageHide(){return _ref134.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the tooltips on the shipping form
$('#shipping-info-page #shipping-info-form').get(0).ej2_instances.forEach(function(tooltipArrayElem){// destroy the tooltip
tooltipArrayElem.destroy();});// destroy the Country & State DropDownLists
$('#shipping-info-page #shipping-info-country').get(0).ej2_instances[0].destroy();$('#shipping-info-page #shipping-info-state').get(0).ej2_instances[0].destroy();// destroy the "Cancel" and "Update" buttons
$('#shipping-info-page #shipping-info-cancel').get(0).ej2_instances[0].destroy();$('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].destroy();// destroy all form validator objects
utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.destroy();},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered when the profile page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */scrollAndResizeEventListener:function(){var _ref135=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee132(){return regeneratorRuntime.wrap(function _callee132$(_context132){while(1){switch(_context132.prev=_context132.next){case 0:// place function execution in the event queue to be executed ASAP
window.setTimeout(function(){// adjust the tooltips elements on the shipping form
$('#shipping-info-form textarea, #shipping-info-form ons-input, #shipping-info-form #shipping-info-country, #shipping-info-form #shipping-info-state').each(function(index,element){document.getElementById('shipping-info-form').ej2_instances[index].refresh(element);});},0);case 1:case'end':return _context132.stop();}}},_callee132,this);}));function scrollAndResizeEventListener(){return _ref135.apply(this,arguments);}return scrollAndResizeEventListener;}(),/**
         * method is triggered when the user clicks the "Update" button
         *
         * @returns {Promise<void>}
         */updateButtonClicked:function(){var _ref136=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee133(){return regeneratorRuntime.wrap(function _callee133$(_context133){while(1){switch(_context133.prev=_context133.next){case 0:// run the validation method for the shipping-info form
utopiasoftware[utopiasoftware_app_namespace].controller.shippingInfoPageViewModel.shippingInfoFormValidator.whenValidate();case 1:case'end':return _context133.stop();}}},_callee133,this);}));function updateButtonClicked(){return _ref136.apply(this,arguments);}return updateButtonClicked;}(),/**
         * method is triggered when the shipping-info form is successfully validated
         *
         * @returns {Promise<void>}
         */shippingInfoFormValidated:function(){var _ref137=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee134(){var toast,promisesArray,promisesArrayPromise,userDetails,userId,userPassword,resultsArray,_toast24,_toast25;return regeneratorRuntime.wrap(function _callee134$(_context134){while(1){switch(_context134.prev=_context134.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context134.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to update shipping information';toast.dataBind();toast.show();return _context134.abrupt('return');case 10:// disable the "Update" button
$('#shipping-info-page #shipping-info-update').attr("disabled",true);// show the spinner on the 'Update' button to indicate process is ongoing
$('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].cssClass='';$('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].dataBind();$('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].start();// display page loader while completing the "update profile" request
$('#shipping-info-page .modal').css("display","table");promisesArray=[];// holds the array for the promises used to complete the process
promisesArrayPromise=null;// holds the promise gotten from the promisesArray
_context134.prev=17;_context134.next=20;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 20:userDetails=_context134.sent.userDetails;console.log("USER DETAILS BEFORE SHIPPING INFO UPDATE",userDetails);// temporary hold the user id and password
userId=userDetails.id;userPassword=userDetails.password;// check if user details has the shipping property
if(!userDetails.shipping){// no shipping property, so create it
// create the shipping property
userDetails.shipping={};}// use the input from the shipping form to update the user details
userDetails.shipping.first_name=$('#shipping-info-page #shipping-info-first-name').val().trim();userDetails.shipping.last_name=$('#shipping-info-page #shipping-info-last-name').val().trim();userDetails.shipping.company=$('#shipping-info-page #shipping-info-company').val().trim();userDetails.shipping.address_1=$('#shipping-info-page #shipping-info-address-1').val().trim();userDetails.shipping.address_2=$('#shipping-info-page #shipping-info-address-2').val().trim();userDetails.shipping.postcode=$('#shipping-info-page #shipping-info-postcode').val().trim();userDetails.shipping.city=$('#shipping-info-page #shipping-info-city').val().trim();userDetails.shipping.country=$('#shipping-info-page #shipping-info-country').get(0).ej2_instances[0].value;userDetails.shipping.state=$('#shipping-info-page #shipping-info-state').get(0).ej2_instances[0].value?$('#shipping-info-page #shipping-info-state').get(0).ej2_instances[0].value:"";// delete the properties not needed for the update from the userDetails object
delete userDetails.id;delete userDetails.password;// now send the user profile update request to the remote server
promisesArray.push(Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/customers/'+userId),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(userDetails)})));// get the promise created from the promisesArray
promisesArrayPromise=Promise.all(promisesArray);// get the result from the promisesArray
_context134.next=40;return promisesArrayPromise;case 40:resultsArray=_context134.sent;// add the user's password to the user details retrieved from the server
resultsArray[0].password=userPassword;// save the created user details data to ENCRYPTED app database as cached data
_context134.next=44;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.saveData({_id:"user-details",docType:"USER_DETAILS",userDetails:resultsArray[0]},utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 44:// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast24=$('.timed-page-toast').get(0).ej2_instances[0];_toast24.cssClass='success-ej2-toast';_toast24.timeOut=3000;_toast24.content='Shipping information updated';_toast24.dataBind();_toast24.show();_context134.next=65;break;case 54:_context134.prev=54;_context134.t0=_context134['catch'](17);_context134.t0=JSON.parse(_context134.t0.responseText);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast25=$('.timed-page-toast').get(0).ej2_instances[0];_toast25.cssClass='error-ej2-toast';_toast25.timeOut=3000;_toast25.content='Shipping information update failed. '+(_context134.t0.message||"");_toast25.dataBind();_toast25.show();case 65:_context134.prev=65;// enable the "Update" button
$('#shipping-info-page #shipping-info-update').removeAttr("disabled");// hide the spinner on the 'Update' button to indicate process is ongoing
$('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].dataBind();$('#shipping-info-page #shipping-info-update').get(0).ej2_instances[0].stop();// hide page loader
$('#shipping-info-page .modal').css("display","none");return _context134.finish(65);case 72:return _context134.abrupt('return',promisesArrayPromise);case 73:case'end':return _context134.stop();}}},_callee134,this,[[17,54,65,72]]);}));function shippingInfoFormValidated(){return _ref137.apply(this,arguments);}return shippingInfoFormValidated;}(),/**
         * method is used to load the current shipping info data into the shipping info form
         * @returns {Promise<void>}
         */displayContent:function(){var _ref138=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee138(){var userDetails,countryDropDownList,statesDropDownList;return regeneratorRuntime.wrap(function _callee138$(_context138){while(1){switch(_context138.prev=_context138.next){case 0:_context138.prev=0;_context138.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:userDetails=_context138.sent.userDetails;console.log("USER DETAILS",userDetails);// display the user shipping info data in the shipping info form
$('#shipping-info-page #shipping-info-form #shipping-info-first-name').val(userDetails.shipping&&userDetails.shipping.first_name?userDetails.shipping.first_name:"");$('#shipping-info-page #shipping-info-form #shipping-info-last-name').val(userDetails.shipping&&userDetails.shipping.last_name?userDetails.shipping.last_name:"");$('#shipping-info-page #shipping-info-form #shipping-info-company').val(userDetails.shipping&&userDetails.shipping.company?userDetails.shipping.company:"");$('#shipping-info-page #shipping-info-form #shipping-info-address-1').val(userDetails.shipping&&userDetails.shipping.address_1?userDetails.shipping.address_1:"");$('#shipping-info-page #shipping-info-form #shipping-info-address-2').val(userDetails.shipping&&userDetails.shipping.address_2?userDetails.shipping.address_2:"");$('#shipping-info-page #shipping-info-form #shipping-info-postcode').val(userDetails.shipping&&userDetails.shipping.postcode?userDetails.shipping.postcode:"");$('#shipping-info-page #shipping-info-form #shipping-info-city').val(userDetails.shipping&&userDetails.shipping.city?userDetails.shipping.city:"");// get the country dropdownlist
countryDropDownList=$('#shipping-info-page #shipping-info-form #shipping-info-country').get(0).ej2_instances[0];// temporarily remove the select event listener for the country dropdownlist
countryDropDownList.removeEventListener("select");// update the select dropdownlist for country
countryDropDownList.value=userDetails.shipping&&userDetails.shipping.country&&userDetails.shipping.country!==""?userDetails.shipping.country:'NG';countryDropDownList.dataBind();// update the select dropdownlist for state
statesDropDownList=$('#shipping-info-page #shipping-info-form #shipping-info-state').get(0).ej2_instances[0];statesDropDownList.dataSource=countryDropDownList.dataSource.find(function(countryElement){return countryElement.code===countryDropDownList.value;}).states;statesDropDownList.dataBind();statesDropDownList.value=userDetails.shipping&&userDetails.shipping.state&&userDetails.shipping.state!==""?userDetails.shipping.state:null;statesDropDownList.dataBind();// check if the state dropdownlist has a value
if(statesDropDownList.value){// check if the state dropdownlist has a value
statesDropDownList.enabled=true;// enable the state dropdownlist
statesDropDownList.dataBind();}else if(countryDropDownList.value==='NG'){// if the country selected is nigeria
statesDropDownList.enabled=true;// enable the state dropdownlist
statesDropDownList.dataBind();}else{// the state dropdown has no value and the country selected is not nigeria
statesDropDownList.enabled=false;// disable the state dropdownlist
statesDropDownList.dataBind();}console.log("STATE VALUE",statesDropDownList.value);case 23:_context138.prev=23;// hide page preloader
$('#shipping-info-page .page-preloader').css("display","none");// hide page modal loader
$('#shipping-info-page .modal').css("display","none");// enable the "Update" button
$('#shipping-info-page #shipping-info-update').removeAttr("disabled");// reinstate the country dropdownlist "select" listener in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee137(){return regeneratorRuntime.wrap(function _callee137$(_context137){while(1){switch(_context137.prev=_context137.next){case 0:// reinstate the country dropdownlist "select" listener
countryDropDownList.addEventListener("select",_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee136(){var countryDropDownList;return regeneratorRuntime.wrap(function _callee136$(_context136){while(1){switch(_context136.prev=_context136.next){case 0:// listen for when dropdown list value is changed by selection
countryDropDownList=this;// holds this dropdown list
// execute the task in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee135(){var countryStatesArray,stateDropDownList;return regeneratorRuntime.wrap(function _callee135$(_context135){while(1){switch(_context135.prev=_context135.next){case 0:// get the country object and its states that represents the country value selected
countryStatesArray=countryDropDownList.getDataByValue(countryDropDownList.value).states;// get the state dropdownlist
stateDropDownList=$('#shipping-info-page #shipping-info-form #shipping-info-state').get(0).ej2_instances[0];// reset the selected value for the State
stateDropDownList.value=null;// reset the dataSource for the State
stateDropDownList.dataSource=countryStatesArray;if(countryStatesArray.length>0){// there are states in the selected country
// enable the State dropdownlist for user selection
stateDropDownList.enabled=true;}else{// there are NO states in the selected country
// disable the State dropdownlist for user selection
stateDropDownList.enabled=false;// since the dropdownlist is disabled, remove any tooltip that is being displayed on this component
$('#shipping-info-page #shipping-info-form').get(0).ej2_instances[$('#shipping-info-state').get(0)._utopiasoftware_validator_index].close();}// bind/update all changes made to the State dropdownlist
stateDropDownList.dataBind();case 6:case'end':return _context135.stop();}}},_callee135,this);})),0);case 2:case'end':return _context136.stop();}}},_callee136,this);})));case 1:case'end':return _context137.stop();}}},_callee137,this);})),0);return _context138.finish(23);case 29:case'end':return _context138.stop();}}},_callee138,this,[[0,,23,29]]);}));function displayContent(){return _ref138.apply(this,arguments);}return displayContent;}()},/**
     * this is the view-model/controller for the Checkout page
     */checkoutPageViewModel:{/**
         * holds the user's Order object which will be sent to the server
         */chekoutOrder:null,/**
         * holds the array/list of countries where the user's shipping address can be located
         */countryArray:[],/**
         * holds the array/list of shipping zones where an order can be delivered
         */shoppingZonesArray:[],/**
         * flag whether to update the billing details for the
         * checkout order data using the billing details of the current user
         */updateOrderBillingDetails:false,/**
         * flag whether to update the shipping details for the
         * checkout order data using the shipping details of the current user
         */updateOrderShippingDetails:false,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref142=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee139(){var promisesArray,toast;return regeneratorRuntime.wrap(function _callee139$(_context139){while(1){switch(_context139.prev=_context139.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context139.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context139.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.backButtonClicked;// listen for scroll event on the page to adjust the tooltips when page scrolls
$('#checkout-page .content').on("scroll",utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.scrollAndResizeEventListener);// set the order object to be used by this page
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder=$('#app-main-navigator').get(0).topPage.data.orderData;_context139.prev=6;// create the accorodion ej2 component used on the "Checkout" page
new ej.navigations.Accordion({expandMode:'Single',expanded:utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.scrollAndResizeEventListener}).appendTo('#checkout-accordion');// create the Shipping method dropdown list from the select input
new ej.dropdowns.DropDownList({cssClass:"shipping-method-dropdownlist",dataSource:[],fields:{value:'method_id',text:'title'},placeholder:"Shipping Method",floatLabelType:'Auto',enabled:false,itemTemplate:'<span>${title}</span>',valueTemplate:'<span>${title}</span>'}).appendTo('#checkout-shipping-method-type');// create the payment method dropdown list from the select input
new ej.dropdowns.DropDownList({cssClass:"payment-method-dropdownlist",dataSource:[],fields:{value:'id',text:'title'},placeholder:"Payment Method",floatLabelType:'Auto',enabled:false,itemTemplate:'<span>${title}</span>',valueTemplate:'<span>${title}</span>'}).appendTo('#checkout-payment-method-type');// create the payment voucher multiselect dropdown list from the select input
new ej.dropdowns.MultiSelect({cssClass:"payment-voucher-dropdownlist",dataSource:[],//fields: { value: 'id', text: 'method_title'},
placeholder:"Payment Coupons",floatLabelType:'Auto',mode:"Box",showClearButton:false,showDropDownIcon:false,enabled:false}).appendTo('#checkout-payment-vouchers');// create the "Make Payment" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#checkout-make-payment');// create the tooltips for the checkout page
$('.utopiasoftware-checkout-failure',$thisPage).each(function(index,element){element._utopiasoftware_validator_index=index;// create the tool tips for every element being validated, but attach it to the page element
new ej.popups.Tooltip({cssClass:'utopiasoftware-ej2-validation-tooltip',position:'TopCenter',opensOn:'Custom'}).appendTo($thisPage.get(0));});//load the remote list of payment methods, list of shipping zones & local list of
// countries for the app; create a remote user cart containing the current checkout order for the user
promisesArray=[];// holds all created promises
promisesArray.push(Promise.resolve($.ajax(// load the list of payment gateways
{url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/payment_gateways',type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}})));promisesArray.push(Promise.resolve($.ajax(// load the list of shipping zones
{url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/shipping/zones',type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}})));promisesArray.push(Promise.resolve($.ajax(// load the list of available countries
{url:'country-list.json',type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}})));// create the user remote cart
promisesArray.push(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.createRemoteCartFromOrder());// wait for all promises to resolve
_context139.next=20;return Promise.all(promisesArray);case 20:promisesArray=_context139.sent;// filter only pay method that are enabled
promisesArray[0]=promisesArray[0].filter(function(paymentElem){return paymentElem.enabled===true;});// assign the payment method array as the dataSource for the payment method dropdownlist
$('#checkout-payment-method-type').get(0).ej2_instances[0].dataSource=promisesArray[0];$('#checkout-payment-method-type').get(0).ej2_instances[0].dataBind();//store the list of shipping zones as a view-model property
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.shoppingZonesArray=promisesArray[1];//store the list of countries as a view-model property
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.countryArray=promisesArray[2];_context139.next=41;break;case 28:_context139.prev=28;_context139.t0=_context139['catch'](6);_context139.next=32;return $('#app-main-navigator').get(0).popPage();case 32:console.log("CHECKOUT ERROR",_context139.t0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Error preparing checkout. Please retry';toast.dataBind();toast.show();case 41:_context139.prev=41;// hide page preloader
$('#checkout-page .page-preloader').css("display","none");// hide page modal loader
$('#checkout-page .modal').css("display","none");return _context139.finish(41);case 45:case'end':return _context139.stop();}}},_callee139,this,[[6,28,41,45]]);}));return function loadPageOnAppReady(){return _ref142.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function(){var _ref143=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee140(){var paymentMethodDropDown,toast;return regeneratorRuntime.wrap(function _callee140$(_context140){while(1){switch(_context140.prev=_context140.next){case 0:if(!($('#checkout-page #checkout-payment-method-type').length==0)){_context140.next=2;break;}return _context140.abrupt('return');case 2:// get payment method dropdownlist component
paymentMethodDropDown=$('#checkout-payment-method-type').get(0).ej2_instances[0];console.log("CHECKOUT DATASOURCE",paymentMethodDropDown.dataSource);// check if the datasource for the payment method has been set
if(!(paymentMethodDropDown.dataSource.length==0)){_context140.next=7;break;}// datasource for the payment method dropdownlist has not been set
// re-execute this method again after some time
window.setTimeout(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow,500);return _context140.abrupt('return');case 7:window.SoftInputMode.set('adjustResize');// adjust device input mode
//add listener for when the window is resized by virtue of the device keyboard being shown
window.addEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.scrollAndResizeEventListener,false);// show page preloader
$('#checkout-page .page-preloader').css("display","block");// show page modal loader
$('#checkout-page .modal').css("display","table");_context140.prev=11;_context140.next=14;return utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.displayContent();case 14:_context140.next=30;break;case 16:_context140.prev=16;_context140.t0=_context140['catch'](11);console.log("CHECKOUT SHOW ERROR",_context140.t0);// hide page preloader
$('#checkout-page .page-preloader').css("display","none");// hide page modal loader
$('#checkout-page .modal').css("display","none");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Checkout error. Please retry or Pull Down to refresh';toast.dataBind();toast.show();return _context140.abrupt('return');case 30:_context140.prev=30;_context140.next=33;return utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.validateOrderCheckout();case 33:_context140.next=37;break;case 35:_context140.prev=35;_context140.t1=_context140['catch'](30);case 37:_context140.prev=37;// hide page preloader
$('#checkout-page .page-preloader').css("display","none");// hide page modal loader
$('#checkout-page .modal').css("display","none");return _context140.finish(37);case 41:console.log("END OF CHECKOUT SHOW");case 42:case'end':return _context140.stop();}}},_callee140,this,[[11,16],[30,35,37,41]]);}));function pageShow(){return _ref143.apply(this,arguments);}return pageShow;}(),/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref144=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee141(){return regeneratorRuntime.wrap(function _callee141$(_context141){while(1){switch(_context141.prev=_context141.next){case 0://add listener for when the window is resized by virtue of the device keyboard being shown
window.removeEventListener("resize",utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.scrollAndResizeEventListener,false);// close the tooltips on the page
$('#checkout-page').get(0).ej2_instances.forEach(function(tooltipArrayElem){// hide the tooltip
tooltipArrayElem.close();});console.log("END OF CHECKOUT HIDE");case 3:case'end':return _context141.stop();}}},_callee141,this);}));function pageHide(){return _ref144.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the shipping method dropdownlist
$('#checkout-page #checkout-shipping-method-type').get(0).ej2_instances[0].destroy();// destroy the payment method dropdownlist
$('#checkout-page #checkout-payment-method-type').get(0).ej2_instances[0].destroy();// destroy the payment voucher multiselect dropdownlist
$('#checkout-page #checkout-payment-vouchers').get(0).ej2_instances[0].destroy();// destroy the "Make Payment"
$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].destroy();// destroy the page accordion
$('#checkout-page #checkout-accordion').get(0).ej2_instances[0].destroy();// destroy the tooltips on the page
$('#checkout-page').get(0).ej2_instances.forEach(function(tooltipArrayElem){// destroy the tooltip
tooltipArrayElem.destroy();});// reset the view-model properties
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder=null;utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.countryArray=[];utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.shoppingZonesArray=[];utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderBillingDetails=false;utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderShippingDetails=false;},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered when the page is scrolled or the display window is resized by
         * virtue of the device keyboard being displayed
         *
         * @returns {Promise<void>}
         */scrollAndResizeEventListener:function(){var _ref145=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee142(){return regeneratorRuntime.wrap(function _callee142$(_context142){while(1){switch(_context142.prev=_context142.next){case 0:// place function execution in the event queue to be executed ASAP
window.setTimeout(function(){// adjust the tooltips elements on the checkout page
$('#checkout-page .utopiasoftware-checkout-failure').each(function(index,element){document.getElementById('checkout-page').ej2_instances[index].refresh(element);});},0);case 1:case'end':return _context142.stop();}}},_callee142,this);}));function scrollAndResizeEventListener(){return _ref145.apply(this,arguments);}return scrollAndResizeEventListener;}(),/**
         * method is triggered when the "Edit" button for the billing details is clicked
         *
         * @returns {Promise<void>}
         */editBillingDetailsButtonClicked:function(){var _ref146=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee143(){return regeneratorRuntime.wrap(function _callee143$(_context143){while(1){switch(_context143.prev=_context143.next){case 0:// set the update billing details flag to true
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderBillingDetails=true;// display the billing details page
$('#app-main-navigator').get(0).pushPage('billing-info-page.html');case 2:case'end':return _context143.stop();}}},_callee143,this);}));function editBillingDetailsButtonClicked(){return _ref146.apply(this,arguments);}return editBillingDetailsButtonClicked;}(),/**
         * method is triggered when the "Edit" button for the shipping details is clicked
         *
         * @returns {Promise<void>}
         */editShippingDetailsButtonClicked:function(){var _ref147=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee144(){return regeneratorRuntime.wrap(function _callee144$(_context144){while(1){switch(_context144.prev=_context144.next){case 0:// set the update shipping details flag to true
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderShippingDetails=true;// display the shipping details page
$('#app-main-navigator').get(0).pushPage('shipping-info-page.html');case 2:case'end':return _context144.stop();}}},_callee144,this);}));function editShippingDetailsButtonClicked(){return _ref147.apply(this,arguments);}return editShippingDetailsButtonClicked;}(),/**
         * method is triggered when the "Edit" button for the shipping method is clicked
         *
         * @returns {Promise<void>}
         */editShippingMethodButtonClicked:function(){var _ref148=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee145(){return regeneratorRuntime.wrap(function _callee145$(_context145){while(1){switch(_context145.prev=_context145.next){case 0:// handle the task in a separate event block
window.setTimeout(function(){// enable the shipping method dropdownlist
var shippingMethodDropdownList=$('#checkout-page #checkout-shipping-method-type').get(0).ej2_instances[0];shippingMethodDropdownList.enabled=true;shippingMethodDropdownList.dataBind();},0);case 1:case'end':return _context145.stop();}}},_callee145,this);}));function editShippingMethodButtonClicked(){return _ref148.apply(this,arguments);}return editShippingMethodButtonClicked;}(),/**
         * method is triggered when the "Edit" button for the payment method is clicked
         *
         * @returns {Promise<void>}
         */editPaymentMethodButtonClicked:function(){var _ref149=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee146(){return regeneratorRuntime.wrap(function _callee146$(_context146){while(1){switch(_context146.prev=_context146.next){case 0:// handle the task in a separate event block
window.setTimeout(function(){// enable the payment method dropdownlist
var paymentMethodDropdownList=$('#checkout-page #checkout-payment-method-type').get(0).ej2_instances[0];paymentMethodDropdownList.enabled=true;paymentMethodDropdownList.dataBind();},0);case 1:case'end':return _context146.stop();}}},_callee146,this);}));function editPaymentMethodButtonClicked(){return _ref149.apply(this,arguments);}return editPaymentMethodButtonClicked;}(),/**
         * method is triggerd when  the "Apply" coupon button is clicked
         *
         * @returns {Promise<void>}
         */applyCouponButtonClicked:function(){var _ref150=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee147(){var toast,couponsArray,localOrderObject,_toast26;return regeneratorRuntime.wrap(function _callee147$(_context147){while(1){switch(_context147.prev=_context147.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context147.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to apply coupon';toast.dataBind();toast.show();return _context147.abrupt('return');case 10:_context147.prev=10;// show the page loader modal
$('#checkout-page .modal').css("display","table");// check if user has entered any  coupon code
if(!($('#checkout-page #checkout-payment-voucher-code').val().trim()==="")){_context147.next=14;break;}throw"error - no coupon code provided";case 14:_context147.next=16;return Promise.resolve($.ajax(// load the list of shipping zones
{url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/coupons',type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{code:$('#checkout-page #checkout-payment-voucher-code').val().trim()}}));case 16:couponsArray=_context147.sent;if(!(couponsArray.length==0)){_context147.next=19;break;}throw"error - no coupon found";case 19:// get a local/deep-clone copy of the page's checkout order object
localOrderObject=JSON.parse(JSON.stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));// update the coupons for the local order object to be sent to the server
localOrderObject.coupon_lines=localOrderObject.coupon_lines.map(function(couponElem){return{code:couponElem.code};});localOrderObject.coupon_lines.push({code:couponsArray[0].code});// add the new coupon
// update the checkout order data on the remote server
_context147.next=24;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+localOrderObject.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(localOrderObject)}));case 24:localOrderObject=_context147.sent;// update the page checkout order with the updated order from the server
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder=localOrderObject;// clear the coupon code entered into the coupon/voucher input
$('#checkout-page #checkout-payment-voucher-code').val("");// redisplay the page (redisplaying the page also hides the page loader when the process is complete)
_context147.next=29;return utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();case 29:_context147.next=42;break;case 31:_context147.prev=31;_context147.t0=_context147['catch'](10);// hide the page loader modal
$('#checkout-page .modal').css("display","none");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast26=$('.timed-page-toast').get(0).ej2_instances[0];_toast26.cssClass='error-ej2-toast';_toast26.timeOut=3000;_toast26.content='Coupon not applied. Invalid coupon code';_toast26.dataBind();_toast26.show();case 42:case'end':return _context147.stop();}}},_callee147,this,[[10,31]]);}));function applyCouponButtonClicked(){return _ref150.apply(this,arguments);}return applyCouponButtonClicked;}(),/**
         * method is triggerd when  the "Add" note button is clicked
         *
         * @returns {Promise<void>}
         */addNoteButtonClicked:function(){var _ref151=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee148(){var toast,localOrderObject,_toast27;return regeneratorRuntime.wrap(function _callee148$(_context148){while(1){switch(_context148.prev=_context148.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context148.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to add shipping notes to the order';toast.dataBind();toast.show();return _context148.abrupt('return');case 10:_context148.prev=10;// show page loader
$('#checkout-page .modal').css("display","table");// get a local/deep-clone copy of the page's checkout order object
localOrderObject=JSON.parse(JSON.stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));// update the customer note for the local order object to be sent to the server
localOrderObject.customer_note=$('#checkout-page #checkout-payment-order-note-text').val().trim();// update the coupons for the local order object to be sent to the server
localOrderObject.coupon_lines=localOrderObject.coupon_lines.map(function(couponElem){return{code:couponElem.code};});// update the checkout order data on the remote server
_context148.next=17;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+localOrderObject.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(localOrderObject)}));case 17:localOrderObject=_context148.sent;// update the page checkout order with the updated order from the server
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder=localOrderObject;// clear the coupon code entered into the coupon/voucher input
$('#checkout-page #checkout-payment-order-note-text').val("");// redisplay the page (redisplaying the page also hides the page loader when the process is complete)
_context148.next=22;return utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();case 22:_context148.next=35;break;case 24:_context148.prev=24;_context148.t0=_context148['catch'](10);// hide the page loader modal
$('#checkout-page .modal').css("display","none");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast27=$('.timed-page-toast').get(0).ej2_instances[0];_toast27.cssClass='error-ej2-toast';_toast27.timeOut=3000;_toast27.content='Shipping note could not added. Please retry';_toast27.dataBind();_toast27.show();case 35:case'end':return _context148.stop();}}},_callee148,this,[[10,24]]);}));function addNoteButtonClicked(){return _ref151.apply(this,arguments);}return addNoteButtonClicked;}(),/**
         * method is triggered when the user clicks the "Make Payment" button
         *
         * @returns {Promise<void>}
         */makePaymentButtonClicked:function(){var _ref152=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee151(){var toast,userDetails,payStackResponse,transactionCompletedUrl,searchParams,completedTransactionReference,localOrderObject,_toast28,_localOrderObject,_toast29;return regeneratorRuntime.wrap(function _callee151$(_context151){while(1){switch(_context151.prev=_context151.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context151.next=14;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to make payment';toast.dataBind();toast.show();// enable the "Make Payment" button
$('#checkout-page #checkout-make-payment').removeAttr("disabled");// hide the spinner from the 'Make Payment'
$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].dataBind();$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].stop();return _context151.abrupt('return');case 14:if(!(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.payment_method==="paystack")){_context151.next=76;break;}// user selected the paystack (Pay With Card)
// disable the "Make Payment" button
$('#checkout-page #checkout-make-payment').attr("disabled",true);// inform the user that payment gateway is being prepared
$('#loader-modal-message').html("Preparing Payment Channel...");$('#loader-modal').get(0).show();// show loader
_context151.prev=18;_context151.next=21;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 21:userDetails=_context151.sent.userDetails;_context151.next=24;return Promise.resolve($.ajax({url:'https://api.paystack.co/transaction/initialize',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Bearer "+Base64.decode(utopiasoftware[utopiasoftware_app_namespace].paystackAccessor));},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify({email:userDetails.email,amount:""+kendo.parseFloat(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.total)*100,callback_url:"https://shopoakexclusive.com/"})}));case 24:payStackResponse=_context151.sent;if(!(payStackResponse.status===true)){_context151.next=54;break;}_context151.next=28;return new Promise(function(resolve,reject){// create/open inapp browser
var transactionInAppBrowser=cordova.InAppBrowser.open(window.encodeURI(payStackResponse.data.authorization_url),'_blank','location=yes,clearcache=yes,clearsessioncache=yes,closebuttoncolor=#ffffff,hardwareback=no,hidenavigationbuttons=yes,hideurlbar=no,zoom=no,toolbarcolor=#3f51b5');// add event listeners for the transaction inapp browswer
transactionInAppBrowser.addEventListener("loadstart",function(loadStartEvent){// check which url is being loaded
if(loadStartEvent.url.startsWith("https://shopoakexclusive.com/")){// transaction was completed
// set a flag to indicate that the transaction was completed
transactionInAppBrowser._utopiasoftware_transaction_completed=true;// retrieve the full transaction completed url
transactionInAppBrowser._utopiasoftware_transaction_completed_url=loadStartEvent.url;// exit/close the inapp browser
transactionInAppBrowser.close();}});transactionInAppBrowser.addEventListener("loaderror",function(loadErrorEvent){// there is an error loading the transaction page, so exit/close inapp browser
transactionInAppBrowser.close();});transactionInAppBrowser.addEventListener("exit",function(exitEvent){// check if the transaction was completed or not
if(transactionInAppBrowser._utopiasoftware_transaction_completed===true){// transaction completed
// resolve parent promise
resolve(transactionInAppBrowser._utopiasoftware_transaction_completed_url);}else{// transaction was not completed
reject();// reject parent promise
}});});case 28:transactionCompletedUrl=_context151.sent;// get the search parameters object from the transaction completed url
searchParams=new URLSearchParams(transactionCompletedUrl.split("?")[1]);// get the 'reference' search parameter value
completedTransactionReference=searchParams.get("reference");// check if the transaction reference query parameter exist
if(!(!completedTransactionReference||completedTransactionReference==="")){_context151.next=33;break;}throw"error";case 33:// inform the user that their order is being placed
$('#loader-modal-message').html("Completing Order Placement...");// get a local/deep-clone copy of the page's checkout order object
localOrderObject=JSON.parse(JSON.stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));// update the order status (by setting the order paid flag) and transaction reference
localOrderObject.transaction_id=completedTransactionReference;localOrderObject.set_paid=true;// update the coupons for the local order object to be sent to the server
localOrderObject.coupon_lines=localOrderObject.coupon_lines.map(function(couponElem){return{code:couponElem.code};});// update the checkout order data on the remote server
_context151.next=40;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+localOrderObject.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(localOrderObject)}));case 40:localOrderObject=_context151.sent;_context151.prev=41;_context151.next=44;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.removeData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 44:_context151.next=48;break;case 46:_context151.prev=46;_context151.t0=_context151['catch'](41);case 48:// update the checkout-order-placement-modal with the checkout order number
$('#checkout-order-placement-modal .order-number').html(localOrderObject.number);// add the click handler for the 'checkout-order-placement-modal-ok-button'
$('#checkout-order-placement-modal #checkout-order-placement-modal-ok-button').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee149(){return regeneratorRuntime.wrap(function _callee149$(_context149){while(1){switch(_context149.prev=_context149.next){case 0:_context149.next=2;return $('ons-splitter').get(0).content.load("app-main-template");case 2:_context149.next=4;return $('#checkout-order-placement-modal').get(0).hide();case 4:case'end':return _context149.stop();}}},_callee149,this);}));// show the 'checkout-order-placement-modal'
_context151.next=52;return $('#checkout-order-placement-modal').get(0).show();case 52:_context151.next=55;break;case 54:throw"error";case 55:_context151.next=68;break;case 57:_context151.prev=57;_context151.t1=_context151['catch'](18);console.log("PAYMENT ERROR",_context151.t1);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast28=$('.timed-page-toast').get(0).ej2_instances[0];_toast28.cssClass='error-ej2-toast';_toast28.timeOut=3500;_toast28.content='Error making payment for this order. Try again';_toast28.dataBind();_toast28.show();case 68:_context151.prev=68;// enable the "Make Payment" button
$('#checkout-page #checkout-make-payment').removeAttr("disabled");// hide the spinner from the 'Make Payment'
$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].dataBind();$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].stop();// hide loader
$('#loader-modal').get(0).hide();return _context151.finish(68);case 75:return _context151.abrupt('return');case 76:if(!(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.payment_method==="cod")){_context151.next=120;break;}// user selected the cod (Cash on Delivery)
// disable the "Make Payment" button
$('#checkout-page #checkout-make-payment').attr("disabled",true);// inform the user that their order is being placed
$('#loader-modal-message').html("Completing Order Placement...");_context151.next=81;return $('#loader-modal').get(0).show();case 81:_context151.prev=81;// get a local/deep-clone copy of the page's checkout order object
_localOrderObject=JSON.parse(JSON.stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));// update the order status to "processing"
_localOrderObject.status="processing";// update the coupons for the local order object to be sent to the server
_localOrderObject.coupon_lines=_localOrderObject.coupon_lines.map(function(couponElem){return{code:couponElem.code};});// update the checkout order data on the remote server
_context151.next=87;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+_localOrderObject.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(_localOrderObject)}));case 87:_localOrderObject=_context151.sent;_context151.prev=88;_context151.next=91;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.removeData("user-cart",utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);case 91:_context151.next=95;break;case 93:_context151.prev=93;_context151.t2=_context151['catch'](88);case 95:// update the checkout-order-placement-modal with the checkout order number
$('#checkout-order-placement-modal .order-number').html(_localOrderObject.number);// add the click handler for the 'checkout-order-placement-modal-ok-button'
$('#checkout-order-placement-modal #checkout-order-placement-modal-ok-button').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee150(){return regeneratorRuntime.wrap(function _callee150$(_context150){while(1){switch(_context150.prev=_context150.next){case 0:_context150.next=2;return $('ons-splitter').get(0).content.load("app-main-template");case 2:_context150.next=4;return $('#checkout-order-placement-modal').get(0).hide();case 4:case'end':return _context150.stop();}}},_callee150,this);}));// show the 'checkout-order-placement-modal'
_context151.next=99;return $('#checkout-order-placement-modal').get(0).show();case 99:_context151.next=112;break;case 101:_context151.prev=101;_context151.t3=_context151['catch'](81);console.log("PAYMENT ERROR",_context151.t3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast29=$('.timed-page-toast').get(0).ej2_instances[0];_toast29.cssClass='error-ej2-toast';_toast29.timeOut=3500;_toast29.content='Error placing this order. Try again';_toast29.dataBind();_toast29.show();case 112:_context151.prev=112;// enable the "Make Payment" button
$('#checkout-page #checkout-make-payment').removeAttr("disabled");// hide the spinner from the 'Make Payment'
$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].dataBind();$('#checkout-page #checkout-make-payment').get(0).ej2_instances[0].stop();// hide loader
$('#loader-modal').get(0).hide();return _context151.finish(112);case 119:return _context151.abrupt('return');case 120:case'end':return _context151.stop();}}},_callee151,this,[[18,57,68,75],[41,46],[81,101,112,119],[88,93]]);}));function makePaymentButtonClicked(){return _ref152.apply(this,arguments);}return makePaymentButtonClicked;}(),/**
         * method is used to load the current checkout/order data into the page
         * @returns {Promise<void>}
         */displayContent:function(){var _ref155=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee154(){var userDetails,orderData,shippingCountryCode,shippingZoneId,shippingCountry,shippingZone,shippingMethodsArray,shippingMethodDropDown,paymentMethodDropDown,couponsMultiSelectDropDown,couponsArray,orderItemsDisplayContent,index;return regeneratorRuntime.wrap(function _callee154$(_context154){while(1){switch(_context154.prev=_context154.next){case 0:_context154.prev=0;_context154.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:userDetails=_context154.sent.userDetails;// check if the checkout order billing data should be updated with the current user's billing
if(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderBillingDetails===true){// billing data should be updated
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.billing=userDetails.billing;// reset the flag
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderBillingDetails=false;}// check if the checkout order shipping data should be updated with the current user's shipping
if(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderShippingDetails===true){// shipping data should be updated
// updatte the shipping data
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.shipping=userDetails.shipping;// reset the shipping method to 'nothing' (to ensure the user chooses a shipping method for their new
// shipping address)
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.shipping_lines[0]=utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.shipping_lines[0]||{};Object.assign(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.shipping_lines[0],{method_id:"",method_title:"",instance_id:""});utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder.shipping_lines[0].total="";// reset the flag
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.updateOrderShippingDetails=false;}// get the order object set on this page
orderData=utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder;console.log("CHECK OUT USER DETAILS",userDetails);// display the checkout data
$('#checkout-page #checkout-personal-details-email').html(userDetails.email);$('#checkout-page #checkout-personal-details-first-name').html(userDetails.first_name);$('#checkout-page #checkout-personal-details-last-name').html(userDetails.last_name);$('#checkout-page #checkout-billing-information-address').html(orderData.billing.address_1);$('#checkout-page #checkout-billing-information-city').html(orderData.billing.city);$('#checkout-page #checkout-shipping-information-first-name').html(orderData.shipping.first_name);$('#checkout-page #checkout-shipping-information-last-name').html(orderData.shipping.last_name);$('#checkout-page #checkout-shipping-information-address').html(orderData.shipping.address_1);$('#checkout-page #checkout-shipping-information-city').html(orderData.shipping.city);// get the shipping zone the of the user by checking the user's shipping country
shippingCountryCode=orderData.shipping.country==""?'NG':orderData.shipping.country;shippingZoneId=0;// set the shipping zone id to the default i.e. 'Rest of the world'
// find the country with the specified country code
shippingCountry=utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.countryArray.find(function(countryElem){return countryElem.code===shippingCountryCode;});// check if a shipping country was discovered
if(shippingCountry){// a shipping country was discovered
// get the shipping zone id which the shipping country belongs to
shippingZone=utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.shoppingZonesArray.find(function(shippingZoneElem){return shippingZoneElem.name===shippingCountry.name;});if(shippingZone){// a shipping zone was found
//get the id of the discovered shipping zone
shippingZoneId=shippingZone.id;}}// get the shipping methods attached to the discovered shipping zone
_context154.next=23;return Promise.resolve($.ajax(// load the list of shipping zones
{url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/shipping/zones/'+shippingZoneId+'/methods'),type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}}));case 23:shippingMethodsArray=_context154.sent;// filter the shipping methods for only the methods that are enabled
shippingMethodsArray=shippingMethodsArray.filter(function(shippingMethodElem){return shippingMethodElem.enabled===true;});// remove the "select" event listener for the shipping method dropdownlist
shippingMethodDropDown=$('#checkout-shipping-method-type').get(0).ej2_instances[0];shippingMethodDropDown.removeEventListener("select");// set the shippingMethodArray as the datasource for the shipping method dropdownlist
shippingMethodDropDown.dataSource=shippingMethodsArray;// set the pre-selected shipping method (i.e. the shippingMethod dropdownlist value)
// check if there are any shipping lines info available
if(orderData.shipping_lines.length>0){// if length is > 0, there are shipping lines info available
// set the shipping method dropdownlist value
shippingMethodDropDown.value=orderData.shipping_lines[0].method_id;// check if the shipping method dropdownlist value is an empty string
if(shippingMethodDropDown.value===""){// the value is an empty string
shippingMethodDropDown.value=null;// reset the shipping method dropdownlist value to null instead
}}shippingMethodDropDown.dataBind();// add the "select" event listener for the shipping method dropdownlist
shippingMethodDropDown.addEventListener("select",function(){// handle the task in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee152(){var toast,localOrderObject,remoteCartTotals,_toast30;return regeneratorRuntime.wrap(function _callee152$(_context152){while(1){switch(_context152.prev=_context152.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context152.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to change shipping method';toast.dataBind();toast.show();return _context152.abrupt('return');case 10:// display the page loader modal
$('#checkout-page .modal').css("display","table");// get a local/deep-clone copy of the page's checkout order object
localOrderObject=JSON.parse(JSON.stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));// update the shipping method for the local order object to be sent to the server
localOrderObject.shipping_lines[0]=localOrderObject.shipping_lines[0]||{};Object.assign(localOrderObject.shipping_lines[0],{method_id:shippingMethodDropDown.value,method_title:shippingMethodDropDown.text,instance_id:""+shippingMethodDropDown.getDataByValue(shippingMethodDropDown.value).instance_id});// update the coupons for the local order object to be sent to the server
localOrderObject.coupon_lines=localOrderObject.coupon_lines.map(function(couponElem){return{code:couponElem.code};});// perform some remote /asynchronous tasks needed to update the order shipping method
_context152.prev=15;_context152.next=18;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/oakscripts/setshipping.php',type:"post",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+Base64.encode(userDetails.email+':'+userDetails.password));},crossDomain:true,xhrFields:{withCredentials:true},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,// send the shipping method data represented by selected shipping method value
data:{id:shippingMethodDropDown.getDataByValue(shippingMethodDropDown.value).instance_id,method_id:shippingMethodDropDown.getDataByValue(shippingMethodDropDown.value).method_id}}));case 18:_context152.next=20;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v2/cart/calculate',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+Base64.encode(userDetails.email+':'+userDetails.password));},crossDomain:true,xhrFields:{withCredentials:true},dataType:"text",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}}));case 20:_context152.next=22;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v2/cart/totals',type:"get",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+Base64.encode(userDetails.email+':'+userDetails.password));},crossDomain:true,xhrFields:{withCredentials:true},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}}));case 22:remoteCartTotals=_context152.sent;// update the shipping method for the local order object to be sent to the server
localOrderObject.shipping_lines[0].total=""+remoteCartTotals.shipping_total;// update the checkout order data on the remote server
_context152.next=26;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+localOrderObject.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(localOrderObject)}));case 26:localOrderObject=_context152.sent;// update the page checkout order with the updated order from the server
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder=localOrderObject;// disable the shipping method dropdownlist
shippingMethodDropDown.enabled=false;shippingMethodDropDown.dataBind();// redisplay the page (redisplaying the page also hides the page loader when the process is complete)
_context152.next=32;return utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();case 32:_context152.next=47;break;case 34:_context152.prev=34;_context152.t0=_context152['catch'](15);console.log("CHECKOUT SHIPPING METHOD UPDATE ERROR",_context152.t0);_context152.t0=JSON.parse(_context152.t0.responseText.trim());// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast30=$('.timed-page-toast').get(0).ej2_instances[0];_toast30.cssClass='error-ej2-toast';_toast30.timeOut=3000;_toast30.content='Shipping method not updated, retry. '+(_context152.t0.message||"");_toast30.dataBind();_toast30.show();// hide the page loader modal
$('#checkout-page .modal').css("display","none");case 47:case'end':return _context152.stop();}}},_callee152,this,[[15,34]]);})),0);});// remove the "select" event listener for the shipping method dropdownlist
paymentMethodDropDown=$('#checkout-payment-method-type').get(0).ej2_instances[0];paymentMethodDropDown.removeEventListener("select");// set the pre-selected payment method for the order data
paymentMethodDropDown.value=orderData.payment_method;paymentMethodDropDown.dataBind();// add the "select" event listener for the payment method dropdownlist
paymentMethodDropDown.addEventListener("select",function(){// handle the task in a separate event block
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee153(){var toast,localOrderObject,_toast31;return regeneratorRuntime.wrap(function _callee153$(_context153){while(1){switch(_context153.prev=_context153.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context153.next=10;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to change payment method';toast.dataBind();toast.show();return _context153.abrupt('return');case 10:// display the page loader modal
$('#checkout-page .modal').css("display","table");// get a local/deep-clone copy of the page's checkout order object
localOrderObject=JSON.parse(JSON.stringify(utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder));// update the payment method for the local order object to be sent to the server
localOrderObject.payment_method=paymentMethodDropDown.value;localOrderObject.payment_method_title=paymentMethodDropDown.text;// update the coupons for the local order object to be sent to the server
localOrderObject.coupon_lines=localOrderObject.coupon_lines.map(function(couponElem){return{code:couponElem.code};});// update the checkout order data on the remote server
_context153.prev=15;_context153.next=18;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+localOrderObject.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(localOrderObject)}));case 18:localOrderObject=_context153.sent;// update the page checkout order with the updated order from the server
utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder=localOrderObject;// disable the payment method dropdownlist
paymentMethodDropDown.enabled=false;paymentMethodDropDown.dataBind();// redisplay the page (redisplaying the page also hides the page loader when the process is complete)
_context153.next=24;return utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.pageShow();case 24:_context153.next=39;break;case 26:_context153.prev=26;_context153.t0=_context153['catch'](15);console.log("CHECKOUT PAYMENT METHOD UPDATE ERROR",_context153.t0);_context153.t0=JSON.parse(_context153.t0.responseText);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast31=$('.timed-page-toast').get(0).ej2_instances[0];_toast31.cssClass='error-ej2-toast';_toast31.timeOut=3000;_toast31.content='Payment method not updated, retry. '+(_context153.t0.message||"");_toast31.dataBind();_toast31.show();// hide the page loader modal
$('#checkout-page .modal').css("display","none");case 39:case'end':return _context153.stop();}}},_callee153,this,[[15,26]]);})),0);});// set the order coupons
couponsMultiSelectDropDown=$('#checkout-payment-vouchers').get(0).ej2_instances[0];couponsArray=orderData.coupon_lines.map(function(couponElem){return couponElem.code;});// set the datasource and the values for the coupons mulitselect dropdown
couponsMultiSelectDropDown.dataSource=couponsArray;couponsMultiSelectDropDown.value=couponsArray;couponsMultiSelectDropDown.dataBind();// set the order notes i.e. shipping instructions
$('#checkout-page #checkout-payment-order-note-text').val(orderData.customer_note);// display the order items
orderItemsDisplayContent='';// holds the content to be displayed for the order items segment
for(index=0;index<orderData.line_items.length;index++){orderItemsDisplayContent+='<div class="col-xs-6" style="text-align: right; padding-right: 5px;\n                        padding-top: 10px; padding-bottom: 10px">'+orderData.line_items[index].name+'</div>\n                        <div class="col-xs-2" style="text-align: left;\n                        padding-top: 10px; padding-bottom: 10px">&times;'+orderData.line_items[index].quantity+'</div>\n                        <div class="col-xs-4" style="text-align: left; padding-left: 5px;\n                        padding-top: 10px; padding-bottom: 10px">\n                        &#x20a6;'+kendo.toString(kendo.parseFloat(orderData.line_items[index].subtotal),"n2")+'</div>\n                        <div class="clearfix visible-xs-block"></div>';}$('#checkout-page #checkout-order-items-container').html(orderItemsDisplayContent);// display checkout totals
$('#checkout-page #checkout-page-items-cost').html('&#x20a6;'+kendo.toString(kendo.parseFloat(orderData.total)-kendo.parseFloat(orderData.shipping_total)+kendo.parseFloat(orderData.discount_total),"n2"));$('#checkout-page #checkout-page-shipping-cost').html('&#x20a6;'+kendo.toString(kendo.parseFloat(orderData.shipping_total),"n2"));$('#checkout-page #checkout-page-discount-cost').html('&#x20a6;'+kendo.toString(kendo.parseFloat(orderData.discount_total),"n2"));$('#checkout-page #checkout-page-total-cost').html('&#x20a6;'+kendo.toString(kendo.parseFloat(orderData.total),"n2"));if(kendo.parseFloat(orderData.discount_total)>0){// if the discount total value is > zero
// display the discount total to user
$('#checkout-page .checkout-page-discount').css("display","block");}else{// the discount total is zero
// hide the discount total from user
$('#checkout-page .checkout-page-discount').css("display","none");}case 50:_context154.prev=50;return _context154.finish(50);case 52:case'end':return _context154.stop();}}},_callee154,this,[[0,,50,52]]);}));function displayContent(){return _ref155.apply(this,arguments);}return displayContent;}(),/**
         * method is a utility used to validate the order object/data i.e. the 'chekoutOrder' property of
         * the view-model
         *
         * @returns {Promise<void>} the Promise resolves when the order data is successfully validated; it
         * rejects when the validation fails.
         */validateOrderCheckout:function(){var _ref158=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee156(){var validationSuccessful;return regeneratorRuntime.wrap(function _callee156$(_context156){while(1){switch(_context156.prev=_context156.next){case 0:validationSuccessful=true;// flag indicates if checkout validation was successful or not
return _context156.abrupt('return',new Promise(function(){var _ref159=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee155(resolve,reject){var orderData,userDetails,tooltipIndex,_tooltipIndex,tooltip,_tooltipIndex2,_tooltip,_tooltipIndex3,_tooltipIndex4,_tooltip2,_tooltipIndex5,_tooltipIndex6,_tooltip3,_tooltipIndex7,_tooltipIndex8,_tooltip4,_tooltipIndex9;return regeneratorRuntime.wrap(function _callee155$(_context155){while(1){switch(_context155.prev=_context155.next){case 0:// disable the "Make Payment" button
$('#checkout-page #checkout-make-payment').attr("disabled",true);// get the checkout Order object
orderData=utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder;// validate the personal details segment
_context155.prev=2;_context155.next=5;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 5:userDetails=_context155.sent.userDetails;if(!(!userDetails.first_name||userDetails.first_name=="")){_context155.next=8;break;}throw"validation error";case 8:// user validation was successful
$('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-success').css("display","inline-block");$('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').css("display","none");// hide error tooltip for this segment
tooltipIndex=$('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;$('#checkout-page').get(0).ej2_instances[tooltipIndex].close();_context155.next=24;break;case 14:_context155.prev=14;_context155.t0=_context155['catch'](2);// user details could not be loaded, so user validation failed
$('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-success').css("display","none");$('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').css("display","inline-block");// display error tooltip for this segment
_tooltipIndex=$('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;tooltip=$('#checkout-page').get(0).ej2_instances[_tooltipIndex];tooltip.content="incomplete personal details";tooltip.dataBind();tooltip.open($('#checkout-page .checkout-personal-details-accordion-item .utopiasoftware-checkout-failure').get(0));// flag validation as failed
validationSuccessful=false;case 24:// validate the billing details segment
if(!orderData.billing.address_1||orderData.billing.address_1==""){// the billing address has NOT been provided
// signal that billing details validation failed
$('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-success').css("display","none");$('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').css("display","inline-block");// display error tooltip for this segment
_tooltipIndex2=$('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;_tooltip=$('#checkout-page').get(0).ej2_instances[_tooltipIndex2];_tooltip.content="incomplete billing details";_tooltip.dataBind();_tooltip.open($('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').get(0));// flag validation as failed
validationSuccessful=false;}else{// the billing address and other billing info have been provided
$('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-success').css("display","inline-block");$('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').css("display","none");// hide error tooltip for this segment
_tooltipIndex3=$('#checkout-page .checkout-billing-information-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;$('#checkout-page').get(0).ej2_instances[_tooltipIndex3].close();}// validate the shipping details segment
if(!orderData.shipping.address_1||orderData.shipping.address_1==""){// the shipping address has NOT been provided
// signal that shipping details validation failed
$('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-success').css("display","none");$('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').css("display","inline-block");// display error tooltip for this segment
_tooltipIndex4=$('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;_tooltip2=$('#checkout-page').get(0).ej2_instances[_tooltipIndex4];_tooltip2.content="incomplete shipping details";_tooltip2.dataBind();_tooltip2.open($('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').get(0));// flag validation as failed
validationSuccessful=false;}else{// the billing address and other billing info have been provided
$('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-success').css("display","inline-block");$('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').css("display","none");// hide error tooltip for this segment
_tooltipIndex5=$('#checkout-page .checkout-shipping-information-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;$('#checkout-page').get(0).ej2_instances[_tooltipIndex5].close();}// validate the shipping method segment
if(!$('#checkout-page #checkout-shipping-method-type').get(0).ej2_instances[0].value){// no shipping method
// signal that shipping method validation failed
$('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-success').css("display","none");$('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').css("display","inline-block");// display error tooltip for this segment
_tooltipIndex6=$('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;_tooltip3=$('#checkout-page').get(0).ej2_instances[_tooltipIndex6];_tooltip3.content="shipping method required";_tooltip3.dataBind();_tooltip3.open($('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').get(0));// flag validation as failed
validationSuccessful=false;}else{// shipping method has been set
$('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-success').css("display","inline-block");$('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').css("display","none");// hide error tooltip for this segment
_tooltipIndex7=$('#checkout-page .checkout-shipping-method-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;$('#checkout-page').get(0).ej2_instances[_tooltipIndex7].close();}// validate the payment method segment
if(!$('#checkout-page #checkout-payment-method-type').get(0).ej2_instances[0].value){// no shipping method
// signal that payment method validation failed
$('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-success').css("display","none");$('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').css("display","inline-block");// display error tooltip for this segment
_tooltipIndex8=$('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;_tooltip4=$('#checkout-page').get(0).ej2_instances[_tooltipIndex8];_tooltip4.content="payment method required";_tooltip4.dataBind();_tooltip4.open($('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').get(0));// flag validation as failed
validationSuccessful=false;}else{// payment method has been set
$('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-success').css("display","inline-block");$('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').css("display","none");// hide error tooltip for this segment
_tooltipIndex9=$('#checkout-page .checkout-payment-method-item .utopiasoftware-checkout-failure').get(0)._utopiasoftware_validator_index;$('#checkout-page').get(0).ej2_instances[_tooltipIndex9].close();}// check if the checkout order validation failed or succeeded
if(!(validationSuccessful===true)){_context155.next=34;break;}// validation was successful
// enable the "Make Payment" button
$('#checkout-page #checkout-make-payment').removeAttr("disabled");resolve();// resolve validation promise
return _context155.abrupt('return');case 34:// validation failed
// disable the "Make Payment" button
$('#checkout-page #checkout-make-payment').attr("disabled",true);reject();// reject validation promise
return _context155.abrupt('return');case 37:case'end':return _context155.stop();}}},_callee155,this,[[2,14]]);}));return function(_x53,_x54){return _ref159.apply(this,arguments);};}()));case 2:case'end':return _context156.stop();}}},_callee156,this);}));function validateOrderCheckout(){return _ref158.apply(this,arguments);}return validateOrderCheckout;}(),/**
         * method is a utility which is used to create a remote cart object on
         * the server using the order data provided.
         * Creating a remote cart can help with things like shipping calculations etc
         *
         * @param orderData
         * @returns {Promise<void>}
         */createRemoteCartFromOrder:function(){var _ref160=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee158(){var orderData=arguments.length>0&&arguments[0]!==undefined?arguments[0]:utopiasoftware[utopiasoftware_app_namespace].controller.checkoutPageViewModel.chekoutOrder;return regeneratorRuntime.wrap(function _callee158$(_context158){while(1){switch(_context158.prev=_context158.next){case 0:return _context158.abrupt('return',new Promise(function(){var _ref161=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee157(resolve,reject){var userDetails,addToCartPromises,index,cartItemData,_iteratorNormalCompletion2,_didIteratorError2,_iteratorError2,_iterator2,_step2,metaDataElem;return regeneratorRuntime.wrap(function _callee157$(_context157){while(1){switch(_context157.prev=_context157.next){case 0:_context157.prev=0;_context157.next=3;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 3:userDetails=_context157.sent.userDetails;_context157.next=6;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v2/cart/clear',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+Base64.encode(userDetails.email+':'+userDetails.password));},crossDomain:true,xhrFields:{withCredentials:true},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{}}));case 6:// create a loop to add all the line items in the order data to the remote cache
addToCartPromises=[];// holds all the promises used to add all items to the remote cart
index=0;case 8:if(!(index<orderData.line_items.length)){_context157.next=43;break;}console.log("1");cartItemData={};// use the line item meta data to create part of cartItemData
_iteratorNormalCompletion2=true;_didIteratorError2=false;_iteratorError2=undefined;_context157.prev=14;for(_iterator2=orderData.line_items[index].meta_data[Symbol.iterator]();!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){metaDataElem=_step2.value;console.log("2");if(metaDataElem.key==="_fpd_data"){// check the "key" property of the metaData object
console.log("3");if(!cartItemData.cart_item_data){// if this property is not created
cartItemData.cart_item_data={};// create the property
}console.log("4");if(!cartItemData.cart_item_data.fpd_data){// if this property is not created
cartItemData.cart_item_data.fpd_data={};// create the property
}console.log("5");// add custom data to the cart item
cartItemData.cart_item_data.fpd_data.fpd_product=metaDataElem.value;cartItemData.cart_item_data.fpd_data.fpd_product_price=""+orderData.line_items[index].price;}if(metaDataElem.key==="_fpd_print_order"){if(!cartItemData.cart_item_data){// if this property is not created
cartItemData.cart_item_data={};// create the property
}if(!cartItemData.cart_item_data.fpd_data){// if this property is not created
cartItemData.cart_item_data.fpd_data={};// create the property
}console.log("6");// add custom data to the cart item
cartItemData.cart_item_data.fpd_data.fpd_print_order=metaDataElem.value;}}// end of for-of loop
// add the other data for the cartItem
_context157.next=22;break;case 18:_context157.prev=18;_context157.t0=_context157['catch'](14);_didIteratorError2=true;_iteratorError2=_context157.t0;case 22:_context157.prev=22;_context157.prev=23;if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}case 25:_context157.prev=25;if(!_didIteratorError2){_context157.next=28;break;}throw _iteratorError2;case 28:return _context157.finish(25);case 29:return _context157.finish(22);case 30:cartItemData.product_id=orderData.line_items[index].product_id;cartItemData.variation_id=orderData.line_items[index].variation_id;cartItemData.quantity=orderData.line_items[index].quantity;console.log("7");// add the created cartItemData to remote user cart
_context157.t1=addToCartPromises;_context157.next=37;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v2/cart/add',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+Base64.encode(userDetails.email+':'+userDetails.password));},crossDomain:true,xhrFields:{withCredentials:true},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(cartItemData)}));case 37:_context157.t2=_context157.sent;_context157.t1.push.call(_context157.t1,_context157.t2);console.log("8");case 40:index++;_context157.next=8;break;case 43:_context157.next=45;return Promise.all(addToCartPromises);case 45:resolve();// resolve the parent promise
case 46:_context157.prev=46;return _context157.finish(46);case 48:case'end':return _context157.stop();}}},_callee157,this,[[0,,46,48],[14,18,22,30],[23,,25,29]]);}));return function(_x56,_x57){return _ref161.apply(this,arguments);};}()));case 1:case'end':return _context158.stop();}}},_callee158,this);}));function createRemoteCartFromOrder(){return _ref160.apply(this,arguments);}return createRemoteCartFromOrder;}()},/**
     * this is the view-model/controller for the Track Order page
     */trackOrderPageViewModel:{/**
         * holds the array of orders for the search result that was just run by the user
         */trackOrderResultsArray:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref162=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee160(){var searchAutoComplete;return regeneratorRuntime.wrap(function _callee160$(_context160){while(1){switch(_context160.prev=_context160.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context160.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context160.abrupt('return');case 3:// listen for the back button event
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.backButtonClicked;try{//instantiate the autocomplete widget for the search input
searchAutoComplete=new ej.dropdowns.AutoComplete({floatLabelType:"Never",placeholder:"Enter Order Number",allowCustom:true,filterType:"Contains",minLength:10000,// minimum number of characters that will automatically trigger autocomplete search
suggestionCount:20,// specified how many items will be in the popup
dataSource:[],blur:function blur(){// track when the component has lost focus
this._allowRemoteSearch=false;// set that remote search is NOT allowed
},change:function change(){// track when the component's value has changed
var searchValue="";// holds the term to be searched for
// check if the search component can perform a remote search
if(this._allowRemoteSearch!==true){// remote search is NOT allowed
this._allowRemoteSearch=false;// set that remote search is NOT allowed
return;// exit function
}/*// check that there is actually a search term entered in the search component
                            if(!this.value || this.value.trim() === ""){ // no search term
                                this._allowRemoteSearch = false; // set that remote search is NOT allowed
                                return; // exit function
                            }*/// update the search term value
searchValue=this.value?this.value.trim():"";// remove the focus from the search autocomplete component
this.focusOut();// run the actual search in a different event queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee159(){var searchResultsArray,userDetails,toast,_toast32;return regeneratorRuntime.wrap(function _callee159$(_context159){while(1){switch(_context159.prev=_context159.next){case 0:searchResultsArray=[];_context159.prev=1;// hide the previously displayed orders info
$('#track-order-page .row').css("display","none");// show the page loader
$('#track-order-page .modal').css("display","table");// load the user profile details from the app database
_context159.next=6;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 6:userDetails=_context159.sent.userDetails;_context159.next=9;return utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"search":searchValue});case 9:searchResultsArray=_context159.sent;_context159.next=12;return utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.displayPageContent(searchResultsArray[0]);case 12:if(searchResultsArray[0].length==0){// no orders were found
// hide the previously displayed orders info
$('#track-order-page .row').css("display","none");// hide the page loader
$('#track-order-page .modal').css("display","none");// inform the user that no result for the search was found'
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Sorry, no order was found.';toast.dataBind();toast.show();}else{// orders were found
// show the orders info
$('#track-order-page .row').css("display","block");// hide the page loader
$('#track-order-page .modal').css("display","none");}_context159.next=28;break;case 15:_context159.prev=15;_context159.t0=_context159['catch'](1);// hide the previously displayed orders info
$('#track-order-page .row').css("display","none");// show the page loader
$('#track-order-page .modal').css("display","none");// remove the focus from the search autocomplete component
$('#track-order-page #track-order-page-input').get(0).ej2_instances[0].focusOut();// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast32=$('.timed-page-toast').get(0).ej2_instances[0];_toast32.cssClass='error-ej2-toast';_toast32.timeOut=3000;_toast32.content='Sorry, a search error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"");_toast32.dataBind();_toast32.show();case 28:case'end':return _context159.stop();}}},_callee159,this,[[1,15]]);})),0);}}).appendTo('#track-order-page-input');}catch(err){}case 5:case'end':return _context160.stop();}}},_callee160,this);}));return function loadPageOnAppReady(){return _ref162.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// update cart count
$('#track-order-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustResize');// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.deviceOnlineListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref164=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee161(){return regeneratorRuntime.wrap(function _callee161$(_context161){while(1){switch(_context161.prev=_context161.next){case 0:// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.deviceOnlineListener,false);case 2:case'end':return _context161.stop();}}},_callee161,this);}));function pageHide(){return _ref164.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the search input autocomplete component
$('#track-order-page #track-order-page-input').get(0).ej2_instances[0].destroy();// reset the view-model properties
utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.trackOrderResultsArray=null;},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// go to the previous page on the stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');// hide all previously displayed ej2 toast
toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to track orders";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is triggered when the enter button is clicked on the device keyboard
         *
         * @param keyEvent
         * @returns {Promise<void>}
         */enterButtonClicked:function(){var _ref165=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee162(keyEvent){var searchAutoComplete;return regeneratorRuntime.wrap(function _callee162$(_context162){while(1){switch(_context162.prev=_context162.next){case 0:// check which key was pressed
if(keyEvent.which===kendo.keys.ENTER)// if the enter key was pressed
{// prevent the default action from occurring
keyEvent.preventDefault();keyEvent.stopImmediatePropagation();keyEvent.stopPropagation();// hide the device keyboard
Keyboard.hide();// get the search autocomplete component
searchAutoComplete=$('#track-order-page #track-order-page-input').get(0).ej2_instances[0];// update the value of the retrieved component
searchAutoComplete.value=$('#track-order-page #track-order-page-input').val();searchAutoComplete._allowRemoteSearch=true;// flag the remote search can occur
searchAutoComplete.dataBind();// bind new value to the component
searchAutoComplete.change();// trigger the change method
}case 1:case'end':return _context162.stop();}}},_callee162,this);}));function enterButtonClicked(_x58){return _ref165.apply(this,arguments);}return enterButtonClicked;}(),/**
         * method is used to load orders to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @param queryParam {Object} holds the objects that contains the query
         * params for the type of products to retrieve
         *
         * @returns {Promise<void>}
         */loadOrders:function(){var _ref166=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee163(queryParam){var pageToAccess=arguments.length>1&&arguments[1]!==undefined?arguments[1]:queryParam.page||1;var pageSize=arguments.length>2&&arguments[2]!==undefined?arguments[2]:queryParam.per_page||20;var promisesArray;return regeneratorRuntime.wrap(function _callee163$(_context163){while(1){switch(_context163.prev=_context163.next){case 0:queryParam.page=pageToAccess;queryParam.per_page=pageSize;promisesArray=[];// holds the array for the promises used to load the orders
// check if there is internet connection or not
if(navigator.connection.type!==Connection.NONE){// there is internet connection
// load the requested products list from the server
promisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/orders",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:queryParam})).then(function(ordersArray){// check if the ordersArray contains orders
if(ordersArray.length>0){// there are orders
// update the current search results array with the ordersArray
utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.trackOrderResultsArray=ordersArray;}resolve(ordersArray);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}// end of loading products with Internet Connection
else{// there is no internet connection
promisesArray.push(Promise.reject("no internet connection"));}return _context163.abrupt('return',Promise.all(promisesArray));case 5:case'end':return _context163.stop();}}},_callee163,this);}));function loadOrders(_x61){return _ref166.apply(this,arguments);}return loadOrders;}(),/**
         * method is used to display the retrieved products on the search popover
         *
         * @param ordersArray
         *
         * @returns {Promise<void>}
         */displayPageContent:function(){var _ref167=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee164(ordersArray){var displayCompletedPromise;return regeneratorRuntime.wrap(function _callee164$(_context164){while(1){switch(_context164.prev=_context164.next){case 0:displayCompletedPromise=new Promise(function(resolve,reject){var ordersContent="";// holds the contents for the orders
// check if the ordersArray is empty or not
if(ordersArray.length<=0){// there are no new content to display
resolve(ordersArray.length);// resolve promise with the length of the orders array
}else{// there are some orders to display
// loop through the array content and display it
for(var index=0;index<ordersArray.length;index++){if(ordersArray[index].status==="pending"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: brown">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.checkoutButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Checkout\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.cancelButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Cancel\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="processing"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: goldenrod">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="on-hold"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: black">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.checkoutButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Checkout\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.cancelButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Cancel\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="completed"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: green">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="cancelled"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: #d64113">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            trackOrderPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else{ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: black">\n                                '+ordersArray[index].status+'\n                            </span>\n                            </div>\n                            </div>';}}// attach the new orders to the page
$('#track-order-page #track-order-page-orders-container').html(ordersContent);resolve(ordersArray.length);// resolve the promise with length of the ordersArray
}});return _context164.abrupt('return',displayCompletedPromise);case 2:case'end':return _context164.stop();}}},_callee164,this);}));function displayPageContent(_x62){return _ref167.apply(this,arguments);}return displayPageContent;}(),/**
         * method is triggered when the "Check Out" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */checkoutButtonClicked:function(){var _ref168=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee166(buttonElem){var $buttonElement;return regeneratorRuntime.wrap(function _callee166$(_context166){while(1){switch(_context166.prev=_context166.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// show the page loader
$('#track-order-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee165(){var selectedOrder,toast;return regeneratorRuntime.wrap(function _callee165$(_context165){while(1){switch(_context165.prev=_context165.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.trackOrderResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context165.prev=3;_context165.next=6;return $('#app-main-navigator').get(0).pushPage("checkout-page.html",{data:{orderData:selectedOrder}});case 6:_context165.next=18;break;case 8:_context165.prev=8;_context165.t0=_context165['catch'](3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Order checkout failed. Please retry';toast.dataBind();toast.show();case 18:_context165.prev=18;// hide the page loader
$('#track-order-page .modal').css("display","none");return _context165.finish(18);case 21:case'end':return _context165.stop();}}},_callee165,this,[[3,8,18,21]]);})),0);case 3:case'end':return _context166.stop();}}},_callee166,this);}));function checkoutButtonClicked(_x63){return _ref168.apply(this,arguments);}return checkoutButtonClicked;}(),/**
         * method is triggered when the "Details" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */detailsButtonClicked:function(){var _ref170=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee168(buttonElem){var $buttonElement;return regeneratorRuntime.wrap(function _callee168$(_context168){while(1){switch(_context168.prev=_context168.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// show the page loader
$('#track-order-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee167(){var selectedOrder,toast;return regeneratorRuntime.wrap(function _callee167$(_context167){while(1){switch(_context167.prev=_context167.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.trackOrderResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context167.prev=3;_context167.next=6;return $('#app-main-navigator').get(0).pushPage("order-details-page.html",{data:{orderData:selectedOrder}});case 6:_context167.next=18;break;case 8:_context167.prev=8;_context167.t0=_context167['catch'](3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Order checkout failed. Please retry';toast.dataBind();toast.show();case 18:_context167.prev=18;// hide the page loader
$('#track-order-page .modal').css("display","none");return _context167.finish(18);case 21:case'end':return _context167.stop();}}},_callee167,this,[[3,8,18,21]]);})),0);case 3:case'end':return _context168.stop();}}},_callee168,this);}));function detailsButtonClicked(_x64){return _ref170.apply(this,arguments);}return detailsButtonClicked;}(),/**
         * method is triggered when the "Cancel" button on the
         * Orders Collection is clicked
         *
         * @returns {Promise<void>}
         */cancelButtonClicked:function(){var _ref172=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee171(buttonElem){var $buttonElement,toast;return regeneratorRuntime.wrap(function _callee171$(_context171){while(1){switch(_context171.prev=_context171.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// check if there is Internet connection
if(!(navigator.connection.type===Connection.NONE)){_context171.next=11;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to cancel this order';toast.dataBind();toast.show();return _context171.abrupt('return');case 11:// attach functions to handle the "Reject/No" and "Accept/Yes" buttons click event.
// These buttons are located in the 'Cancel Order Action Sheet'.
// Click event handlers must always be defined for these buttons when using this action sheet
// function for "Reject/No" button
$('#cancel-order-action-sheet #cancel-order-no').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee169(){return regeneratorRuntime.wrap(function _callee169$(_context169){while(1){switch(_context169.prev=_context169.next){case 0:_context169.next=2;return document.getElementById('cancel-order-action-sheet').hide();case 2:case'end':return _context169.stop();}}},_callee169,this);}));// function for "Accept/Yes" button
$('#cancel-order-action-sheet #cancel-order-yes').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee170(){var selectedOrder,userDetails,searchResultsArray,_toast33,_toast34;return regeneratorRuntime.wrap(function _callee170$(_context170){while(1){switch(_context170.prev=_context170.next){case 0:// display the page loader
$('#track-order-page .modal').css("display","table");_context170.prev=1;_context170.next=4;return document.getElementById('cancel-order-action-sheet').hide();case 4:// get the order that was selected for cancellation
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.trackOrderResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];// change the selectedOrder status to "cancelled"
selectedOrder.status="cancelled";// update the selectedOrder status remotely
_context170.next=8;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+selectedOrder.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(selectedOrder)}));case 8:_context170.next=10;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 10:userDetails=_context170.sent.userDetails;_context170.next=13;return utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"search":$('#track-order-page #track-order-page-input').get(0).ej2_instances[0].value||""});case 13:searchResultsArray=_context170.sent;_context170.next=16;return utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.displayPageContent(searchResultsArray[0]);case 16:// inform the user that the order has been cancelled
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast33=$('.timed-page-toast').get(0).ej2_instances[0];_toast33.cssClass='default-ej2-toast';_toast33.timeOut=2000;_toast33.content='Order #'+selectedOrder.id+' has been cancelled';_toast33.dataBind();_toast33.show();_context170.next=36;break;case 26:_context170.prev=26;_context170.t0=_context170['catch'](1);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast34=$('.timed-page-toast').get(0).ej2_instances[0];_toast34.cssClass='error-ej2-toast';_toast34.timeOut=3500;_toast34.content='Error cancelling order #'+selectedOrder.id+'. Try again';_toast34.dataBind();_toast34.show();case 36:_context170.prev=36;// display the page loader
$('#track-order-page .modal').css("display","none");return _context170.finish(36);case 39:case'end':return _context170.stop();}}},_callee170,this,[[1,26,36,39]]);}));// display the cancel order action sheet
_context171.next=15;return document.getElementById('cancel-order-action-sheet').show();case 15:case'end':return _context171.stop();}}},_callee171,this);}));function cancelButtonClicked(_x65){return _ref172.apply(this,arguments);}return cancelButtonClicked;}(),/**
         * method is triggered when the "Reorder" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */reorderButtonClicked:function(){var _ref175=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee173(buttonElem){var $buttonElement,toast;return regeneratorRuntime.wrap(function _callee173$(_context173){while(1){switch(_context173.prev=_context173.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// check if there is Internet connection
if(!(navigator.connection.type===Connection.NONE)){_context173.next=11;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to make a reorder';toast.dataBind();toast.show();return _context173.abrupt('return');case 11:// show the page loader
$('#track-order-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee172(){var selectedOrder,newOrder,_toast35;return regeneratorRuntime.wrap(function _callee172$(_context172){while(1){switch(_context172.prev=_context172.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.trackOrderResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context172.prev=3;// create a new order object
newOrder=JSON.parse(JSON.stringify(selectedOrder));// delete and reset all necessary properties for the new order
delete newOrder.id;newOrder.transaction_id="";newOrder.line_items.forEach(function(lineItem){delete lineItem.id;lineItem.total=lineItem.subtotal;// remove any discounts
for(var index=0;index<lineItem.meta_data.length;index++){delete lineItem.meta_data[index].id;}});newOrder.tax_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.shipping_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.fee_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});delete newOrder.coupon_lines;delete newOrder.discount_total;delete newOrder.discount_tax;newOrder.set_paid=false;// update the status of the new order to "pending"
newOrder.status="pending";// update the selectedOrder status remotely
_context172.next=18;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/orders',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(newOrder)}));case 18:newOrder=_context172.sent;_context172.next=21;return $('#app-main-navigator').get(0).pushPage("checkout-page.html",{data:{orderData:newOrder}});case 21:_context172.next=34;break;case 23:_context172.prev=23;_context172.t0=_context172['catch'](3);console.log(_context172.t0,"REORDER ERROR");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast35=$('.timed-page-toast').get(0).ej2_instances[0];_toast35.cssClass='error-ej2-toast';_toast35.timeOut=3000;_toast35.content='Placing new order failed. Please retry';_toast35.dataBind();_toast35.show();case 34:_context172.prev=34;// hide the page loader
$('#track-order-page .modal').css("display","none");return _context172.finish(34);case 37:case'end':return _context172.stop();}}},_callee172,this,[[3,23,34,37]]);})),0);case 13:case'end':return _context173.stop();}}},_callee173,this);}));function reorderButtonClicked(_x66){return _ref175.apply(this,arguments);}return reorderButtonClicked;}()},/**
     * this is the view-model/controller for the Completed Orders page
     */completedOrdersPageViewModel:{/**
         * holds the array of orders for the search result that was just run by the user
         */ordersResultsArray:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref177=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee174(){var userDetails,searchResultsArray,toast,_toast36;return regeneratorRuntime.wrap(function _callee174$(_context174){while(1){switch(_context174.prev=_context174.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context174.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context174.abrupt('return');case 3:// listen for the back button event
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#completed-orders-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#completed-orders-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#completed-orders-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#completed-orders-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#completed-orders-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});_context174.prev=6;// hide the previously displayed orders info
$('#completed-orders-page .row').css("display","none");// show the page loader
$('#completed-orders-page .modal').css("display","table");// load the user profile details from the app database
_context174.next=11;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 11:userDetails=_context174.sent.userDetails;_context174.next=14;return utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"status":"completed"});case 14:searchResultsArray=_context174.sent;_context174.next=17;return utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.displayPageContent(searchResultsArray[0]);case 17:if(searchResultsArray[0].length==0){// no orders were found
// hide the page preloader
$('#completed-orders-page .page-preloader').css("display","none");// hide the previously displayed orders info
$('#completed-orders-page .row').css("display","none");// hide the page loader
$('#completed-orders-page .modal').css("display","none");// inform the user that no result for the search was found'
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Sorry, no order was found.';toast.dataBind();toast.show();}else{// orders were found
// hide the page preloader
$('#completed-orders-page .page-preloader').css("display","none");// show the orders info
$('#completed-orders-page .row').css("display","block");// hide the page loader
$('#completed-orders-page .modal').css("display","none");}_context174.next=33;break;case 20:_context174.prev=20;_context174.t0=_context174['catch'](6);// hide the page preloader
$('#completed-orders-page .page-preloader').css("display","none");// hide the previously displayed orders info
$('#completed-orders-page .row').css("display","none");// show the page loader
$('#completed-orders-page .modal').css("display","none");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast36=$('.timed-page-toast').get(0).ej2_instances[0];_toast36.cssClass='error-ej2-toast';_toast36.timeOut=3000;_toast36.content='Sorry, a search error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"");_toast36.dataBind();_toast36.show();case 33:case'end':return _context174.stop();}}},_callee174,this,[[6,20]]);}));return function loadPageOnAppReady(){return _ref177.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// update cart count
$('#completed-orders-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustResize');// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.deviceOnlineListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref178=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee175(){return regeneratorRuntime.wrap(function _callee175$(_context175){while(1){switch(_context175.prev=_context175.next){case 0:// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.deviceOnlineListener,false);case 2:case'end':return _context175.stop();}}},_callee175,this);}));function pageHide(){return _ref178.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// reset the view-model properties
utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.ordersResultsArray=null;},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// go to the previous page on the stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');// hide all previously displayed ej2 toast
toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to view orders";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref179=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee176(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var userDetails,searchResultsArray,toast,_toast37;return regeneratorRuntime.wrap(function _callee176$(_context176){while(1){switch(_context176.prev=_context176.next){case 0:// disable pull-to-refresh widget till loading is done
$('#completed-orders-page #completed-orders-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');_context176.prev=2;// show the page loader
$('#completed-orders-page .modal').css("display","table");// load the user profile details from the app database
_context176.next=6;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 6:userDetails=_context176.sent.userDetails;_context176.next=9;return utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"status":"completed"});case 9:searchResultsArray=_context176.sent;_context176.next=12;return utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.displayPageContent(searchResultsArray[0]);case 12:if(searchResultsArray[0].length==0){// no orders were found
// hide the page preloader
$('#completed-orders-page .page-preloader').css("display","none");// hide the previously displayed orders info
$('#completed-orders-page .row').css("display","none");// hide the page loader
$('#completed-orders-page .modal').css("display","none");// inform the user that no result for the search was found'
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Sorry, no order was found.';toast.dataBind();toast.show();}else{// orders were found
// hide the page preloader
$('#completed-orders-page .page-preloader').css("display","none");// show the orders info
$('#completed-orders-page .row').css("display","block");// hide the page loader
$('#completed-orders-page .modal').css("display","none");}_context176.next=27;break;case 15:_context176.prev=15;_context176.t0=_context176['catch'](2);// hide the page preloader
$('#completed-orders-page .page-preloader').css("display","none");// show the page loader
$('#completed-orders-page .modal').css("display","none");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast37=$('.timed-page-toast').get(0).ej2_instances[0];_toast37.cssClass='error-ej2-toast';_toast37.timeOut=3000;_toast37.content='Sorry, a search error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"");_toast37.dataBind();_toast37.show();case 27:_context176.prev=27;// enable pull-to-refresh widget till loading is done
$('#completed-orders-page #completed-orders-page-pull-hook').removeAttr("disabled");// hide the preloader
$('#completed-orders-page .page-preloader').css("display","none");// signal that loading is done
doneCallBack();return _context176.finish(27);case 32:case'end':return _context176.stop();}}},_callee176,this,[[2,15,27,32]]);}));function pagePullHookAction(){return _ref179.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is used to load orders to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @param queryParam {Object} holds the objects that contains the query
         * params for the type of products to retrieve
         *
         * @returns {Promise<void>}
         */loadOrders:function(){var _ref180=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee177(queryParam){var pageToAccess=arguments.length>1&&arguments[1]!==undefined?arguments[1]:queryParam.page||1;var pageSize=arguments.length>2&&arguments[2]!==undefined?arguments[2]:queryParam.per_page||20;var promisesArray;return regeneratorRuntime.wrap(function _callee177$(_context177){while(1){switch(_context177.prev=_context177.next){case 0:queryParam.page=pageToAccess;queryParam.per_page=pageSize;promisesArray=[];// holds the array for the promises used to load the orders
// check if there is internet connection or not
if(navigator.connection.type!==Connection.NONE){// there is internet connection
// load the requested products list from the server
promisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/orders",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:queryParam})).then(function(ordersArray){// check if the ordersArray contains orders
if(ordersArray.length>0){// there are orders
// update the current search results array with the ordersArray
utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.ordersResultsArray=ordersArray;}resolve(ordersArray);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}// end of loading products with Internet Connection
else{// there is no internet connection
promisesArray.push(Promise.reject("no internet connection"));}return _context177.abrupt('return',Promise.all(promisesArray));case 5:case'end':return _context177.stop();}}},_callee177,this);}));function loadOrders(_x70){return _ref180.apply(this,arguments);}return loadOrders;}(),/**
         * method is used to display the retrieved products on the search popover
         *
         * @param ordersArray
         *
         * @returns {Promise<void>}
         */displayPageContent:function(){var _ref181=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee178(ordersArray){var displayCompletedPromise;return regeneratorRuntime.wrap(function _callee178$(_context178){while(1){switch(_context178.prev=_context178.next){case 0:displayCompletedPromise=new Promise(function(resolve,reject){var ordersContent="";// holds the contents for the orders
// check if the ordersArray is empty or not
if(ordersArray.length<=0){// there are no new content to display
resolve(ordersArray.length);// resolve promise with the length of the orders array
}else{// there are some orders to display
// loop through the array content and display it
for(var index=0;index<ordersArray.length;index++){if(ordersArray[index].status==="pending"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: brown">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.checkoutButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Checkout\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.cancelButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Cancel\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="processing"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: goldenrod">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="on-hold"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: black">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.checkoutButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Checkout\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.cancelButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Cancel\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="completed"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: green">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="cancelled"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: #d64113">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            completedOrdersPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else{ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: black">\n                                '+ordersArray[index].status+'\n                            </span>\n                            </div>\n                            </div>';}}// attach the new orders to the page
$('#completed-orders-page #completed-orders-page-orders-container').html(ordersContent);resolve(ordersArray.length);// resolve the promise with length of the ordersArray
}});return _context178.abrupt('return',displayCompletedPromise);case 2:case'end':return _context178.stop();}}},_callee178,this);}));function displayPageContent(_x71){return _ref181.apply(this,arguments);}return displayPageContent;}(),/**
         * method is triggered when the "Check Out" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */checkoutButtonClicked:function(){var _ref182=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee180(buttonElem){var $buttonElement;return regeneratorRuntime.wrap(function _callee180$(_context180){while(1){switch(_context180.prev=_context180.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// show the page loader
$('#completed-orders-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee179(){var selectedOrder,toast;return regeneratorRuntime.wrap(function _callee179$(_context179){while(1){switch(_context179.prev=_context179.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context179.prev=3;_context179.next=6;return $('#app-main-navigator').get(0).pushPage("checkout-page.html",{data:{orderData:selectedOrder}});case 6:_context179.next=18;break;case 8:_context179.prev=8;_context179.t0=_context179['catch'](3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Order checkout failed. Please retry';toast.dataBind();toast.show();case 18:_context179.prev=18;// hide the page loader
$('#completed-orders-page .modal').css("display","none");return _context179.finish(18);case 21:case'end':return _context179.stop();}}},_callee179,this,[[3,8,18,21]]);})),0);case 3:case'end':return _context180.stop();}}},_callee180,this);}));function checkoutButtonClicked(_x72){return _ref182.apply(this,arguments);}return checkoutButtonClicked;}(),/**
         * method is triggered when the "Details" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */detailsButtonClicked:function(){var _ref184=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee182(buttonElem){var $buttonElement;return regeneratorRuntime.wrap(function _callee182$(_context182){while(1){switch(_context182.prev=_context182.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// show the page loader
$('#completed-orders-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee181(){var selectedOrder,toast;return regeneratorRuntime.wrap(function _callee181$(_context181){while(1){switch(_context181.prev=_context181.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context181.prev=3;_context181.next=6;return $('#app-main-navigator').get(0).pushPage("order-details-page.html",{data:{orderData:selectedOrder}});case 6:_context181.next=18;break;case 8:_context181.prev=8;_context181.t0=_context181['catch'](3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Order checkout failed. Please retry';toast.dataBind();toast.show();case 18:_context181.prev=18;// hide the page loader
$('#completed-orders-page .modal').css("display","none");return _context181.finish(18);case 21:case'end':return _context181.stop();}}},_callee181,this,[[3,8,18,21]]);})),0);case 3:case'end':return _context182.stop();}}},_callee182,this);}));function detailsButtonClicked(_x73){return _ref184.apply(this,arguments);}return detailsButtonClicked;}(),/**
         * method is triggered when the "Cancel" button on the
         * Orders Collection is clicked
         *
         * @returns {Promise<void>}
         */cancelButtonClicked:function(){var _ref186=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee185(buttonElem){var $buttonElement,toast;return regeneratorRuntime.wrap(function _callee185$(_context185){while(1){switch(_context185.prev=_context185.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// check if there is Internet connection
if(!(navigator.connection.type===Connection.NONE)){_context185.next=11;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to cancel this order';toast.dataBind();toast.show();return _context185.abrupt('return');case 11:// attach functions to handle the "Reject/No" and "Accept/Yes" buttons click event.
// These buttons are located in the 'Cancel Order Action Sheet'.
// Click event handlers must always be defined for these buttons when using this action sheet
// function for "Reject/No" button
$('#cancel-order-action-sheet #cancel-order-no').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee183(){return regeneratorRuntime.wrap(function _callee183$(_context183){while(1){switch(_context183.prev=_context183.next){case 0:_context183.next=2;return document.getElementById('cancel-order-action-sheet').hide();case 2:case'end':return _context183.stop();}}},_callee183,this);}));// function for "Accept/Yes" button
$('#cancel-order-action-sheet #cancel-order-yes').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee184(){var selectedOrder,userDetails,searchResultsArray,_toast38,_toast39;return regeneratorRuntime.wrap(function _callee184$(_context184){while(1){switch(_context184.prev=_context184.next){case 0:// display the page loader
$('#completed-orders-page .modal').css("display","table");_context184.prev=1;_context184.next=4;return document.getElementById('cancel-order-action-sheet').hide();case 4:// get the order that was selected for cancellation
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];// change the selectedOrder status to "cancelled"
selectedOrder.status="cancelled";// update the selectedOrder status remotely
_context184.next=8;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+selectedOrder.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(selectedOrder)}));case 8:_context184.next=10;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 10:userDetails=_context184.sent.userDetails;_context184.next=13;return utopiasoftware[utopiasoftware_app_namespace].controller.trackOrderPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"status":"completed"});case 13:searchResultsArray=_context184.sent;_context184.next=16;return utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.displayPageContent(searchResultsArray[0]);case 16:// inform the user that the order has been cancelled
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast38=$('.timed-page-toast').get(0).ej2_instances[0];_toast38.cssClass='default-ej2-toast';_toast38.timeOut=2000;_toast38.content='Order #'+selectedOrder.id+' has been cancelled';_toast38.dataBind();_toast38.show();_context184.next=36;break;case 26:_context184.prev=26;_context184.t0=_context184['catch'](1);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast39=$('.timed-page-toast').get(0).ej2_instances[0];_toast39.cssClass='error-ej2-toast';_toast39.timeOut=3500;_toast39.content='Error cancelling order #'+selectedOrder.id+'. Try again';_toast39.dataBind();_toast39.show();case 36:_context184.prev=36;// display the page loader
$('#completed-orders-page .modal').css("display","none");return _context184.finish(36);case 39:case'end':return _context184.stop();}}},_callee184,this,[[1,26,36,39]]);}));// display the cancel order action sheet
_context185.next=15;return document.getElementById('cancel-order-action-sheet').show();case 15:case'end':return _context185.stop();}}},_callee185,this);}));function cancelButtonClicked(_x74){return _ref186.apply(this,arguments);}return cancelButtonClicked;}(),/**
         * method is triggered when the "Reorder" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */reorderButtonClicked:function(){var _ref189=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee187(buttonElem){var $buttonElement,toast;return regeneratorRuntime.wrap(function _callee187$(_context187){while(1){switch(_context187.prev=_context187.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// check if there is Internet connection
if(!(navigator.connection.type===Connection.NONE)){_context187.next=11;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to make a reorder';toast.dataBind();toast.show();return _context187.abrupt('return');case 11:// show the page loader
$('#completed-orders-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee186(){var selectedOrder,newOrder,_toast40;return regeneratorRuntime.wrap(function _callee186$(_context186){while(1){switch(_context186.prev=_context186.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.completedOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context186.prev=3;// create a new order object
newOrder=JSON.parse(JSON.stringify(selectedOrder));// delete and reset all necessary properties for the new order
delete newOrder.id;newOrder.transaction_id="";newOrder.line_items.forEach(function(lineItem){delete lineItem.id;lineItem.total=lineItem.subtotal;// remove any discounts
for(var index=0;index<lineItem.meta_data.length;index++){delete lineItem.meta_data[index].id;}});newOrder.tax_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.shipping_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.fee_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});delete newOrder.coupon_lines;delete newOrder.discount_total;delete newOrder.discount_tax;newOrder.set_paid=false;// update the status of the new order to "pending"
newOrder.status="pending";// update the selectedOrder status remotely
_context186.next=18;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/orders',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(newOrder)}));case 18:newOrder=_context186.sent;_context186.next=21;return $('#app-main-navigator').get(0).pushPage("checkout-page.html",{data:{orderData:newOrder}});case 21:_context186.next=34;break;case 23:_context186.prev=23;_context186.t0=_context186['catch'](3);console.log(_context186.t0,"REORDER ERROR");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast40=$('.timed-page-toast').get(0).ej2_instances[0];_toast40.cssClass='error-ej2-toast';_toast40.timeOut=3000;_toast40.content='Placing new order failed. Please retry';_toast40.dataBind();_toast40.show();case 34:_context186.prev=34;// hide the page loader
$('#completed-orders-page .modal').css("display","none");return _context186.finish(34);case 37:case'end':return _context186.stop();}}},_callee186,this,[[3,23,34,37]]);})),0);case 13:case'end':return _context187.stop();}}},_callee187,this);}));function reorderButtonClicked(_x75){return _ref189.apply(this,arguments);}return reorderButtonClicked;}()},/**
     * this is the view-model/controller for the Pending Orders page
     */pendingOrdersPageViewModel:{/**
         * holds the array of orders for the search result that was just run by the user
         */ordersResultsArray:null,/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref191=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee188(){var userDetails,searchResultsArray,toast,_toast41;return regeneratorRuntime.wrap(function _callee188$(_context188){while(1){switch(_context188.prev=_context188.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context188.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context188.abrupt('return');case 3:// listen for the back button event
event.target.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#pending-orders-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#pending-orders-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#pending-orders-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#pending-orders-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#pending-orders-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});_context188.prev=6;// hide the previously displayed orders info
$('#pending-orders-page .row').css("display","none");// show the page loader
$('#pending-orders-page .modal').css("display","table");// load the user profile details from the app database
_context188.next=11;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 11:userDetails=_context188.sent.userDetails;_context188.next=14;return utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"status":"pending"});case 14:searchResultsArray=_context188.sent;_context188.next=17;return utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.displayPageContent(searchResultsArray[0]);case 17:if(searchResultsArray[0].length==0){// no orders were found
// hide the page preloader
$('#pending-orders-page .page-preloader').css("display","none");// hide the previously displayed orders info
$('#pending-orders-page .row').css("display","none");// hide the page loader
$('#pending-orders-page .modal').css("display","none");// inform the user that no result for the search was found'
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Sorry, no order was found.';toast.dataBind();toast.show();}else{// orders were found
// hide the page preloader
$('#pending-orders-page .page-preloader').css("display","none");// show the orders info
$('#pending-orders-page .row').css("display","block");// hide the page loader
$('#pending-orders-page .modal').css("display","none");}_context188.next=33;break;case 20:_context188.prev=20;_context188.t0=_context188['catch'](6);// hide the page preloader
$('#pending-orders-page .page-preloader').css("display","none");// hide the previously displayed orders info
$('#pending-orders-page .row').css("display","none");// show the page loader
$('#pending-orders-page .modal').css("display","none");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast41=$('.timed-page-toast').get(0).ej2_instances[0];_toast41.cssClass='error-ej2-toast';_toast41.timeOut=3000;_toast41.content='Sorry, a search error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"");_toast41.dataBind();_toast41.show();case 33:case'end':return _context188.stop();}}},_callee188,this,[[6,20]]);}));return function loadPageOnAppReady(){return _ref191.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function pageShow(){// update cart count
$('#pending-orders-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);window.SoftInputMode.set('adjustResize');// listen for when the device does not have Internet connection
document.addEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.deviceOfflineListener,false);// listen for when the device has Internet connection
document.addEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.deviceOnlineListener,false);},/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref192=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee189(){return regeneratorRuntime.wrap(function _callee189$(_context189){while(1){switch(_context189.prev=_context189.next){case 0:// remove listener for when the device does not have Internet connection
document.removeEventListener("offline",utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.deviceOfflineListener,false);// remove listener for when the device has Internet connection
document.removeEventListener("online",utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.deviceOnlineListener,false);case 2:case'end':return _context189.stop();}}},_callee189,this);}));function pageHide(){return _ref192.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// reset the view-model properties
utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.ordersResultsArray=null;},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// go to the previous page on the stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered whenever the user's device is offline
         */deviceOfflineListener:function deviceOfflineListener(){// display toast to show that there is no internet connection
var toast=$('.page-toast').get(0).ej2_instances[0];toast.hide('All');// hide all previously displayed ej2 toast
toast.cssClass='default-ej2-toast';toast.content="No Internet connection. Connect to the Internet to view orders";toast.dataBind();toast.show();// show ej2 toast
},/**
         * method is triggered whenever the user's device is online
         */deviceOnlineListener:function deviceOnlineListener(){// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');},/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref193=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee190(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var userDetails,searchResultsArray,toast,_toast42;return regeneratorRuntime.wrap(function _callee190$(_context190){while(1){switch(_context190.prev=_context190.next){case 0:// disable pull-to-refresh widget till loading is done
$('#pending-orders-page #pending-orders-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');_context190.prev=2;// show the page loader
$('#pending-orders-page .modal').css("display","table");// load the user profile details from the app database
_context190.next=6;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 6:userDetails=_context190.sent.userDetails;_context190.next=9;return utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"status":"pending"});case 9:searchResultsArray=_context190.sent;_context190.next=12;return utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.displayPageContent(searchResultsArray[0]);case 12:if(searchResultsArray[0].length==0){// no orders were found
// hide the page preloader
$('#pending-orders-page .page-preloader').css("display","none");// hide the previously displayed orders info
$('#pending-orders-page .row').css("display","none");// hide the page loader
$('#pending-orders-page .modal').css("display","none");// inform the user that no result for the search was found'
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Sorry, no order was found.';toast.dataBind();toast.show();}else{// orders were found
// hide the page preloader
$('#pending-orders-page .page-preloader').css("display","none");// show the orders info
$('#pending-orders-page .row').css("display","block");// hide the page loader
$('#pending-orders-page .modal').css("display","none");}_context190.next=27;break;case 15:_context190.prev=15;_context190.t0=_context190['catch'](2);// hide the page preloader
$('#pending-orders-page .page-preloader').css("display","none");// show the page loader
$('#pending-orders-page .modal').css("display","none");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast42=$('.timed-page-toast').get(0).ej2_instances[0];_toast42.cssClass='error-ej2-toast';_toast42.timeOut=3000;_toast42.content='Sorry, a search error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"");_toast42.dataBind();_toast42.show();case 27:_context190.prev=27;// enable pull-to-refresh widget till loading is done
$('#pending-orders-page #pending-orders-page-pull-hook').removeAttr("disabled");// hide the preloader
$('#pending-orders-page .page-preloader').css("display","none");// signal that loading is done
doneCallBack();return _context190.finish(27);case 32:case'end':return _context190.stop();}}},_callee190,this,[[2,15,27,32]]);}));function pagePullHookAction(){return _ref193.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is used to load orders to the page
         *
         * @param pageToAccess {Integer} the page within the paginated categories to retrieve
         *
         * @param pageSize {Integer} the size of the page i.e. the number of category items to retrieve
         *
         * @param queryParam {Object} holds the objects that contains the query
         * params for the type of products to retrieve
         *
         * @returns {Promise<void>}
         */loadOrders:function(){var _ref194=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee191(queryParam){var pageToAccess=arguments.length>1&&arguments[1]!==undefined?arguments[1]:queryParam.page||1;var pageSize=arguments.length>2&&arguments[2]!==undefined?arguments[2]:queryParam.per_page||20;var promisesArray;return regeneratorRuntime.wrap(function _callee191$(_context191){while(1){switch(_context191.prev=_context191.next){case 0:queryParam.page=pageToAccess;queryParam.per_page=pageSize;promisesArray=[];// holds the array for the promises used to load the orders
// check if there is internet connection or not
if(navigator.connection.type!==Connection.NONE){// there is internet connection
// load the requested products list from the server
promisesArray.push(new Promise(function(resolve,reject){Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+"/wp-json/wc/v3/orders",type:"get",//contentType: "application/x-www-form-urlencoded",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:queryParam})).then(function(ordersArray){// check if the ordersArray contains orders
if(ordersArray.length>0){// there are orders
// update the current search results array with the ordersArray
utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.ordersResultsArray=ordersArray;}resolve(ordersArray);// resolve the parent promise with the data gotten from the server
}).catch(function(err){// an error occurred
reject(err);// reject the parent promise with the error
});}));}// end of loading products with Internet Connection
else{// there is no internet connection
promisesArray.push(Promise.reject("no internet connection"));}return _context191.abrupt('return',Promise.all(promisesArray));case 5:case'end':return _context191.stop();}}},_callee191,this);}));function loadOrders(_x79){return _ref194.apply(this,arguments);}return loadOrders;}(),/**
         * method is used to display the retrieved products on the search popover
         *
         * @param ordersArray
         *
         * @returns {Promise<void>}
         */displayPageContent:function(){var _ref195=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee192(ordersArray){var displayCompletedPromise;return regeneratorRuntime.wrap(function _callee192$(_context192){while(1){switch(_context192.prev=_context192.next){case 0:displayCompletedPromise=new Promise(function(resolve,reject){var ordersContent="";// holds the contents for the orders
// check if the ordersArray is empty or not
if(ordersArray.length<=0){// there are no new content to display
resolve(ordersArray.length);// resolve promise with the length of the orders array
}else{// there are some orders to display
// loop through the array content and display it
for(var index=0;index<ordersArray.length;index++){if(ordersArray[index].status==="pending"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: brown">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.checkoutButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Checkout\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.cancelButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Cancel\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="processing"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: goldenrod">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="on-hold"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: black">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.checkoutButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Checkout\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.cancelButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Cancel\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="completed"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: green">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else if(ordersArray[index].status==="cancelled"){ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: #d64113">\n                                '+ordersArray[index].status+'\n                            </span>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.reorderButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Reorder\n                            </ons-button>\n                            <ons-button disable-auto-styling modifier="quiet" \n                            onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                            pendingOrdersPageViewModel.detailsButtonClicked(this)"\n                            style="border-color: #ffffff; background-color: #ffffff; color: #363E7C;\n                                    margin: 0; padding: 0; transform: scale(0.75);" data-order-index="'+index+'">\n                                Details\n                            </ons-button>\n                            </div>\n                            </div>';}else{ordersContent+=' <div class="row" style="font-size: 1em; font-weight: 300;\n                            border-bottom: 1px lightgray solid; color: #6d6d72;">\n                            <div class="col-xs-2" style=" word-wrap: break-word; text-align: center; \n                            padding-left: 5px; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+ordersArray[index].id+'</div>\n                            <div class="col-xs-4" style=" word-wrap: break-word; \n                            text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                            '+kendo.toString(kendo.parseFloat(ordersArray[index].total),"n2")+'\n                            </div>\n                            <div class="col-xs-6" style="text-align: center; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 1px">\n                            <span style="display: block; text-transform: uppercase; color: black">\n                                '+ordersArray[index].status+'\n                            </span>\n                            </div>\n                            </div>';}}// attach the new orders to the page
$('#pending-orders-page #pending-orders-page-orders-container').html(ordersContent);resolve(ordersArray.length);// resolve the promise with length of the ordersArray
}});return _context192.abrupt('return',displayCompletedPromise);case 2:case'end':return _context192.stop();}}},_callee192,this);}));function displayPageContent(_x80){return _ref195.apply(this,arguments);}return displayPageContent;}(),/**
         * method is triggered when the "Check Out" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */checkoutButtonClicked:function(){var _ref196=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee194(buttonElem){var $buttonElement;return regeneratorRuntime.wrap(function _callee194$(_context194){while(1){switch(_context194.prev=_context194.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// show the page loader
$('#pending-orders-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee193(){var selectedOrder,toast;return regeneratorRuntime.wrap(function _callee193$(_context193){while(1){switch(_context193.prev=_context193.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context193.prev=3;_context193.next=6;return $('#app-main-navigator').get(0).pushPage("checkout-page.html",{data:{orderData:selectedOrder}});case 6:_context193.next=18;break;case 8:_context193.prev=8;_context193.t0=_context193['catch'](3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Order checkout failed. Please retry';toast.dataBind();toast.show();case 18:_context193.prev=18;// hide the page loader
$('#pending-orders-page .modal').css("display","none");return _context193.finish(18);case 21:case'end':return _context193.stop();}}},_callee193,this,[[3,8,18,21]]);})),0);case 3:case'end':return _context194.stop();}}},_callee194,this);}));function checkoutButtonClicked(_x81){return _ref196.apply(this,arguments);}return checkoutButtonClicked;}(),/**
         * method is triggered when the "Details" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */detailsButtonClicked:function(){var _ref198=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee196(buttonElem){var $buttonElement;return regeneratorRuntime.wrap(function _callee196$(_context196){while(1){switch(_context196.prev=_context196.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// show the page loader
$('#pending-orders-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee195(){var selectedOrder,toast;return regeneratorRuntime.wrap(function _callee195$(_context195){while(1){switch(_context195.prev=_context195.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context195.prev=3;_context195.next=6;return $('#app-main-navigator').get(0).pushPage("order-details-page.html",{data:{orderData:selectedOrder}});case 6:_context195.next=18;break;case 8:_context195.prev=8;_context195.t0=_context195['catch'](3);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.timeOut=3000;toast.content='Order checkout failed. Please retry';toast.dataBind();toast.show();case 18:_context195.prev=18;// hide the page loader
$('#pending-orders-page .modal').css("display","none");return _context195.finish(18);case 21:case'end':return _context195.stop();}}},_callee195,this,[[3,8,18,21]]);})),0);case 3:case'end':return _context196.stop();}}},_callee196,this);}));function detailsButtonClicked(_x82){return _ref198.apply(this,arguments);}return detailsButtonClicked;}(),/**
         * method is triggered when the "Cancel" button on the
         * Orders Collection is clicked
         *
         * @returns {Promise<void>}
         */cancelButtonClicked:function(){var _ref200=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee199(buttonElem){var $buttonElement,toast;return regeneratorRuntime.wrap(function _callee199$(_context199){while(1){switch(_context199.prev=_context199.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// check if there is Internet connection
if(!(navigator.connection.type===Connection.NONE)){_context199.next=11;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to cancel this order';toast.dataBind();toast.show();return _context199.abrupt('return');case 11:// attach functions to handle the "Reject/No" and "Accept/Yes" buttons click event.
// These buttons are located in the 'Cancel Order Action Sheet'.
// Click event handlers must always be defined for these buttons when using this action sheet
// function for "Reject/No" button
$('#cancel-order-action-sheet #cancel-order-no').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee197(){return regeneratorRuntime.wrap(function _callee197$(_context197){while(1){switch(_context197.prev=_context197.next){case 0:_context197.next=2;return document.getElementById('cancel-order-action-sheet').hide();case 2:case'end':return _context197.stop();}}},_callee197,this);}));// function for "Accept/Yes" button
$('#cancel-order-action-sheet #cancel-order-yes').get(0).onclick=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee198(){var selectedOrder,userDetails,searchResultsArray,_toast43,_toast44;return regeneratorRuntime.wrap(function _callee198$(_context198){while(1){switch(_context198.prev=_context198.next){case 0:// display the page loader
$('#pending-orders-page .modal').css("display","table");_context198.prev=1;_context198.next=4;return document.getElementById('cancel-order-action-sheet').hide();case 4:// get the order that was selected for cancellation
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];// change the selectedOrder status to "cancelled"
selectedOrder.status="cancelled";// update the selectedOrder status remotely
_context198.next=8;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+selectedOrder.id),type:"put",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(selectedOrder)}));case 8:_context198.next=10;return utopiasoftware[utopiasoftware_app_namespace].databaseOperations.loadData("user-details",utopiasoftware[utopiasoftware_app_namespace].model.encryptedAppDatabase);case 10:userDetails=_context198.sent.userDetails;_context198.next=13;return utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.loadOrders({"page":1,"per_page":20,"order":"desc","orderby":"date","customer":userDetails.id,"status":"pending"});case 13:searchResultsArray=_context198.sent;_context198.next=16;return utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.displayPageContent(searchResultsArray[0]);case 16:// inform the user that the order has been cancelled
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast43=$('.timed-page-toast').get(0).ej2_instances[0];_toast43.cssClass='default-ej2-toast';_toast43.timeOut=2000;_toast43.content='Order #'+selectedOrder.id+' has been cancelled';_toast43.dataBind();_toast43.show();_context198.next=36;break;case 26:_context198.prev=26;_context198.t0=_context198['catch'](1);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
_toast44=$('.timed-page-toast').get(0).ej2_instances[0];_toast44.cssClass='error-ej2-toast';_toast44.timeOut=3500;_toast44.content='Error cancelling order #'+selectedOrder.id+'. Try again';_toast44.dataBind();_toast44.show();case 36:_context198.prev=36;// display the page loader
$('#pending-orders-page .modal').css("display","none");return _context198.finish(36);case 39:case'end':return _context198.stop();}}},_callee198,this,[[1,26,36,39]]);}));// display the cancel order action sheet
_context199.next=15;return document.getElementById('cancel-order-action-sheet').show();case 15:case'end':return _context199.stop();}}},_callee199,this);}));function cancelButtonClicked(_x83){return _ref200.apply(this,arguments);}return cancelButtonClicked;}(),/**
         * method is triggered when the "Reorder" button on the
         * Orders Collection is clicked
         *
         * @buttonElem {HTMLButton}
         *
         * @returns {Promise<void>}
         */reorderButtonClicked:function(){var _ref203=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee201(buttonElem){var $buttonElement,toast;return regeneratorRuntime.wrap(function _callee201$(_context201){while(1){switch(_context201.prev=_context201.next){case 0:$buttonElement=$(buttonElem);// get a jQuery reference to the button element that was clicked
// check if there is Internet connection
if(!(navigator.connection.type===Connection.NONE)){_context201.next=11;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to make a reorder';toast.dataBind();toast.show();return _context201.abrupt('return');case 11:// show the page loader
$('#pending-orders-page .modal').css("display","table");// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee200(){var selectedOrder,newOrder,_toast45;return regeneratorRuntime.wrap(function _callee200$(_context200){while(1){switch(_context200.prev=_context200.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.pendingOrdersPageViewModel.ordersResultsArray[window.parseInt($buttonElement.attr("data-order-index"))];console.log("ORDER INDEX",$buttonElement.attr("data-order-index"));console.log("SELECTED ORDER",selectedOrder);_context200.prev=3;// create a new order object
newOrder=JSON.parse(JSON.stringify(selectedOrder));// delete and reset all necessary properties for the new order
delete newOrder.id;newOrder.transaction_id="";newOrder.line_items.forEach(function(lineItem){delete lineItem.id;lineItem.total=lineItem.subtotal;// remove any discounts
for(var index=0;index<lineItem.meta_data.length;index++){delete lineItem.meta_data[index].id;}});newOrder.tax_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.shipping_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.fee_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});delete newOrder.coupon_lines;delete newOrder.discount_total;delete newOrder.discount_tax;newOrder.set_paid=false;// update the status of the new order to "pending"
newOrder.status="pending";// update the selectedOrder status remotely
_context200.next=18;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/orders',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(newOrder)}));case 18:newOrder=_context200.sent;_context200.next=21;return $('#app-main-navigator').get(0).pushPage("checkout-page.html",{data:{orderData:newOrder}});case 21:_context200.next=34;break;case 23:_context200.prev=23;_context200.t0=_context200['catch'](3);console.log(_context200.t0,"REORDER ERROR");// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast45=$('.timed-page-toast').get(0).ej2_instances[0];_toast45.cssClass='error-ej2-toast';_toast45.timeOut=3000;_toast45.content='Placing new order failed. Please retry';_toast45.dataBind();_toast45.show();case 34:_context200.prev=34;// hide the page loader
$('#pending-orders-page .modal').css("display","none");return _context200.finish(34);case 37:case'end':return _context200.stop();}}},_callee200,this,[[3,23,34,37]]);})),0);case 13:case'end':return _context201.stop();}}},_callee201,this);}));function reorderButtonClicked(_x84){return _ref203.apply(this,arguments);}return reorderButtonClicked;}()},/**
     * this is the view-model/controller for the Order Details page
     */orderDetailsPageViewModel:{/**
         * holds the Order object which contains details to be displayed
         */orderDetails:null,/**
         * holds the array containing order notes belonging to
         * the specified order object (i.e. orderDetails)
         */orderNotesArray:[],/**
         * event is triggered when page is initialised
         */pageInit:function pageInit(event){//function is used to initialise the page if the app is fully ready for execution
var loadPageOnAppReady=function(){var _ref205=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee202(){var promisesArray,orderId,toast;return regeneratorRuntime.wrap(function _callee202$(_context202){while(1){switch(_context202.prev=_context202.next){case 0:if(!(!ons.isReady()||utopiasoftware[utopiasoftware_app_namespace].model.isAppReady===false)){_context202.next=3;break;}setTimeout(loadPageOnAppReady,500);// call this function again after half a second
return _context202.abrupt('return');case 3:// listen for the back button event
$('#app-main-navigator').get(0).topPage.onDeviceBackButton=utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.backButtonClicked;// add method to handle the loading action of the pull-to-refresh widget
$('#order-details-page-pull-hook',$thisPage).get(0).onAction=utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.pagePullHookAction;// register listener for the pull-to-refresh widget
$('#order-details-page-pull-hook',$thisPage).on("changestate",function(event){// check the state of the pull-to-refresh widget
switch(event.originalEvent.state){case'initial':// update the displayed content
$('#order-details-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-down" size="24px" style="color: #363E7C"></ons-icon>');break;case'preaction':// update the displayed content
$('#order-details-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-icon icon="md-long-arrow-up" size="24px" style="color: #363E7C"></ons-icon>');break;case'action':// update the displayed content
$('#order-details-page-pull-hook-fab',event.originalEvent.pullHook).html('<ons-progress-circular indeterminate modifier="pull-hook"></ons-progress-circular>');break;}});// set the order object to be used by this page
utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderDetails=$('#app-main-navigator').get(0).topPage.data.orderData;_context202.prev=7;// create the "Reorder" button
new ej.splitbuttons.ProgressButton({cssClass:'e-hide-spinner',duration:10*60*60*1000// set spinner/progress duration for 10 hr
}).appendTo('#order-details-reorder');// load the order notes attached to the loaded order details
promisesArray=[];// holds all created promises
orderId=utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderDetails.id;// get the id for the specified order object
promisesArray.push(Promise.resolve($.ajax(// load the order notes for the specified order object
{url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+orderId+'/notes'),type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{"type":"any"}})));// wait for all promises to resolve
_context202.next=14;return Promise.all(promisesArray);case 14:promisesArray=_context202.sent;// get the order notes belonging to the specified order object
utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderNotesArray=promisesArray[0];// display the order details
_context202.next=18;return utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.displayContent();case 18:// enable the "Reorder" button
$('#order-details-page #order-details-reorder').removeAttr("disabled");_context202.next=30;break;case 21:_context202.prev=21;_context202.t0=_context202['catch'](7);console.log("ORDER DETAILS ERROR",_context202.t0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 30:_context202.prev=30;// hide page preloader
$('#order-details-page .page-preloader').css("display","none");// hide page modal loader
$('#order-details-page .modal').css("display","none");return _context202.finish(30);case 34:case'end':return _context202.stop();}}},_callee202,this,[[7,21,30,34]]);}));return function loadPageOnAppReady(){return _ref205.apply(this,arguments);};}();var $thisPage=$(event.target);// get the current page shown
// call the function used to initialise the app page if the app is fully loaded
loadPageOnAppReady();},/**
         * method is triggered when page is shown
         */pageShow:function(){var _ref206=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee203(){return regeneratorRuntime.wrap(function _callee203$(_context203){while(1){switch(_context203.prev=_context203.next){case 0:window.SoftInputMode.set('adjustPan');// adjust device input mode
// update cart count
$('#order-details-page .cart-count').html(utopiasoftware[utopiasoftware_app_namespace].model.cartCount);case 2:case'end':return _context203.stop();}}},_callee203,this);}));function pageShow(){return _ref206.apply(this,arguments);}return pageShow;}(),/**
         * method is triggered when page is hidden
         */pageHide:function(){var _ref207=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee204(){return regeneratorRuntime.wrap(function _callee204$(_context204){while(1){switch(_context204.prev=_context204.next){case 0:case'end':return _context204.stop();}}},_callee204,this);}));function pageHide(){return _ref207.apply(this,arguments);}return pageHide;}(),/**
         * method is triggered when page is destroyed
         */pageDestroy:function pageDestroy(){// destroy the "Reorder" button
$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].destroy();// reset the view-model properties
utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderDetails=null;utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderNotesArray=[];},/**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */backButtonClicked:function backButtonClicked(){// get back to the previous page on the app-main navigator stack
$('#app-main-navigator').get(0).popPage();},/**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */pagePullHookAction:function(){var _ref208=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee205(){var doneCallBack=arguments.length>0&&arguments[0]!==undefined?arguments[0]:function(){};var promisesArray,orderId,toast;return regeneratorRuntime.wrap(function _callee205$(_context205){while(1){switch(_context205.prev=_context205.next){case 0:// disable pull-to-refresh widget till loading is done
$('#order-details-page #order-details-page-pull-hook').attr("disabled",true);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');_context205.prev=2;// load the order notes attached to the loaded order details
promisesArray=[];// holds all created promises
orderId=utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderDetails.id;// get the id for the specified order object
promisesArray.push(Promise.resolve($.ajax(// load the order notes for the specified order object
{url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+('/wp-json/wc/v3/orders/'+orderId+'/notes'),type:"get",//contentType: "application/json",
beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:true,data:{"type":"any"}})));// wait for all promises to resolve
_context205.next=8;return Promise.all(promisesArray);case 8:promisesArray=_context205.sent;// get the order notes belonging to the specified order object
utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderNotesArray=promisesArray[0];// display the order details
_context205.next=12;return utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.displayContent();case 12:// enable the "Reorder" button
$('#order-details-page #order-details-reorder').removeAttr("disabled");_context205.next=26;break;case 15:_context205.prev=15;_context205.t0=_context205['catch'](2);// hide the page preloader
$('#order-details-page .page-preloader').css("display","none");// show the page loader
$('#order-details-page .modal').css("display","none");console.log("ORDER DETAILS ERROR",_context205.t0);// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.page-toast').get(0).ej2_instances[0];toast.cssClass='error-ej2-toast';toast.content='Sorry, an error occurred.'+(navigator.connection.type===Connection.NONE?" Connect to the Internet.":"")+' Pull down to refresh and try again';toast.dataBind();toast.show();case 26:_context205.prev=26;// enable pull-to-refresh widget till loading is done
$('#order-details-page #order-details-page-pull-hook').removeAttr("disabled");// hide the preloader
$('#order-details-page .page-preloader').css("display","none");// signal that loading is done
doneCallBack();return _context205.finish(26);case 31:case'end':return _context205.stop();}}},_callee205,this,[[2,15,26,31]]);}));function pagePullHookAction(){return _ref208.apply(this,arguments);}return pagePullHookAction;}(),/**
         * method is triggered when the user clicks the "Reorder" button
         *
         * @returns {Promise<void>}
         */reorderButtonClicked:function(){var _ref209=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee207(){var toast;return regeneratorRuntime.wrap(function _callee207$(_context207){while(1){switch(_context207.prev=_context207.next){case 0:if(!(navigator.connection.type===Connection.NONE)){_context207.next=14;break;}// there is no Internet connection
// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast to show that an error
toast=$('.timed-page-toast').get(0).ej2_instances[0];toast.cssClass='default-ej2-toast';toast.timeOut=3000;toast.content='Connect to the Internet to make a reorder';toast.dataBind();toast.show();// enable the "Reorder" button
$('#order-details-page #order-details-reorder').removeAttr("disabled");// hide the spinner from the 'Reorder' button
$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].dataBind();$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].stop();return _context207.abrupt('return');case 14:// show the page loader
$('#order-details-page .modal').css("display","table");// disable the "Reorder" button
$('#order-details-page #order-details-reorder').attr("disabled",true);// add the spinner from the 'Reorder'
$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].cssClass='';$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].dataBind();$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].start();// handle the tasks in a separate queue
window.setTimeout(_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee206(){var selectedOrder,newOrder,_toast46;return regeneratorRuntime.wrap(function _callee206$(_context206){while(1){switch(_context206.prev=_context206.next){case 0:// get the selected order to be checked out
selectedOrder=utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderDetails;_context206.prev=1;// create a new order object
newOrder=JSON.parse(JSON.stringify(selectedOrder));// delete and reset all necessary properties for the new order
delete newOrder.id;newOrder.transaction_id="";newOrder.line_items.forEach(function(lineItem){delete lineItem.id;lineItem.total=lineItem.subtotal;// remove any discounts
for(var index=0;index<lineItem.meta_data.length;index++){delete lineItem.meta_data[index].id;}});newOrder.tax_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.shipping_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});newOrder.fee_lines.forEach(function(item){delete item.id;for(var index=0;index<item.meta_data.length;index++){delete item.meta_data[index].id;}});delete newOrder.coupon_lines;delete newOrder.discount_total;delete newOrder.discount_tax;newOrder.set_paid=false;// update the status of the new order to "pending"
newOrder.status="pending";// update the selectedOrder status remotely
_context206.next=16;return Promise.resolve($.ajax({url:utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl+'/wp-json/wc/v3/orders',type:"post",contentType:"application/json",beforeSend:function beforeSend(jqxhr){jqxhr.setRequestHeader("Authorization","Basic "+utopiasoftware[utopiasoftware_app_namespace].accessor);},dataType:"json",timeout:240000,// wait for 4 minutes before timeout of request
processData:false,data:JSON.stringify(newOrder)}));case 16:newOrder=_context206.sent;// hide the page loader
$('#order-details-page .modal').css("display","none");// disable the "Reorder" button
$('#order-details-page #order-details-reorder').removeAttr("disabled",true);// add the spinner from the 'Reorder'
$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].dataBind();$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].stop();// display the checkout page using the selected order
_context206.next=24;return $('#app-main-navigator').get(0).replacePage("checkout-page.html",{data:{orderData:newOrder}});case 24:_context206.next=42;break;case 26:_context206.prev=26;_context206.t0=_context206['catch'](1);console.log(_context206.t0,"REORDER ERROR");// hide the page loader
$('#order-details-page .modal').css("display","none");// disable the "Reorder" button
$('#order-details-page #order-details-reorder').removeAttr("disabled",true);// add the spinner from the 'Reorder'
$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].cssClass='e-hide-spinner';$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].dataBind();$('#order-details-page #order-details-reorder').get(0).ej2_instances[0].stop();// hide all previously displayed ej2 toast
$('.page-toast').get(0).ej2_instances[0].hide('All');$('.timed-page-toast').get(0).ej2_instances[0].hide('All');// display toast message
_toast46=$('.timed-page-toast').get(0).ej2_instances[0];_toast46.cssClass='error-ej2-toast';_toast46.timeOut=3000;_toast46.content='Placing new order failed. Please retry';_toast46.dataBind();_toast46.show();case 42:_context206.prev=42;return _context206.finish(42);case 44:case'end':return _context206.stop();}}},_callee206,this,[[1,26,42,44]]);})),0);case 20:case'end':return _context207.stop();}}},_callee207,this);}));function reorderButtonClicked(){return _ref209.apply(this,arguments);}return reorderButtonClicked;}(),/**
         * method is used to load the order details data into the page
         * @returns {Promise<void>}
         */displayContent:function(){var _ref211=_asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee208(){var orderData,_displayContent,index,orderNote,_index;return regeneratorRuntime.wrap(function _callee208$(_context208){while(1){switch(_context208.prev=_context208.next){case 0:try{// get the order object set on this page
orderData=utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderDetails;// display the orderDetails data
$('#order-details-page #order-details-list .order-details-order-number').html('#'+orderData.id);$('#order-details-page #order-details-list .order-details-order-status').html(''+orderData.status);// check if the order created date (in GMT) has a pending 'Z' appended to the time
if(!orderData.date_created_gmt.endsWith("Z")){// no pending 'Z', so add the 'Z'
// add the pending 'Z' to ensure the date meets the ISO format
orderData.date_created_gmt+='Z';}$('#order-details-page #order-details-list .order-details-order-date').html(''+kendo.toString(new Date(orderData.date_created_gmt),"MMMM dd, yyyy"));$('#order-details-page #order-details-list .order-details-order-total').html('&#x20a6;'+kendo.toString(kendo.parseFloat(orderData.total),"n2"));$('#order-details-page #order-details-list .order-details-payment-method').html(''+orderData.payment_method_title);$('#order-details-page #order-details-list .order-details-shipping-method').html(''+(orderData.shipping_lines[0]?orderData.shipping_lines[0].method_title:""));$('#order-details-page #order-details-list .order-details-shipping-cost').html('&#x20a6;'+kendo.toString(kendo.parseFloat(orderData.shipping_total),"n2"));// update the order shipping updates/notes
_displayContent='';// holds the contents to be generated in the for-loop
for(index=0;index<utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderNotesArray.length;index++){// attach the order updates/notes
orderNote=utopiasoftware[utopiasoftware_app_namespace].controller.orderDetailsPageViewModel.orderNotesArray[index];// get the current order note object
_displayContent+='\n                    <div class="col-xs-6" style="text-align: right; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px;\n                            text-transform: lowercase; word-wrap: break-word">'+orderNote.note+'</div>';// check if the order note created date (in GMT) has a pending 'Z' appended to the time
if(!orderNote.date_created_gmt.endsWith("Z")){// no pending 'Z', so add the 'Z'
// add the pending 'Z' to ensure the date meets the ISO format
orderNote.date_created_gmt+='Z';}_displayContent+='\n                    <div class="col-xs-6" style="text-align: left; padding-left: 5px;\n                            padding-top: 10px; padding-bottom: 10px;\n                            text-transform: lowercase; word-wrap: break-word">\n                    '+kendo.toString(new Date(orderNote.date_created_gmt),"MMMM dd, yyyy")+'        \n                    </div>\n                    <div class="clearfix visible-xs-block"></div>';}$('#order-details-page #order-details-list .order-details-order-notes').html(_displayContent);// display the items in the order
_displayContent='';// reset the displayContent variable for use in the next for-loop
for(_index=0;_index<orderData.line_items.length;_index++){_displayContent+='<div class="col-xs-6" style="text-align: right; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.line_items[_index].name+'</div>\n                        <div class="col-xs-2" style="text-align: left; padding-left: 5px;\n                            padding-top: 10px; padding-bottom: 10px">&times;'+orderData.line_items[_index].quantity+'</div>\n                        <div class="col-xs-4" style="text-align: left; padding-left: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                        &#x20a6;'+kendo.toString(kendo.parseFloat(orderData.line_items[_index].subtotal),"n2")+'</div>\n                        <div class="clearfix visible-xs-block"></div>';}$('#order-details-page #order-details-list .order-details-order-items').html(_displayContent);// display the Billing Details
_displayContent='';// reset the displayContent variable for next use
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                '+(orderData.billing.first_name+" "+orderData.billing.last_name)+'</div>';//check if the billing details contains a company name
if(orderData.billing.company&&orderData.billing.company!==""){// there is company name, so display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.company+'</div>';}// check if the billing details contains a 1st address line
if(orderData.billing.address_1&&orderData.billing.address_1!==""){// there is 1st address line, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.address_1+'</div>';}// check if the billing details contains a 2nd address line
if(orderData.billing.address_2&&orderData.billing.address_2!==""){// there is 2nd address line, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.address_2+'</div>';}_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.city+'</div>';// check if the billing details contains a state
if(orderData.billing.state&&orderData.billing.state!==""){// there is state, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.state+'</div>';}// check if the billing details contains a postal code
if(orderData.billing.postcode&&orderData.billing.postcode!==""){// there is postal code, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.postcode+'</div>';}_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.country+'</div>';_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.phone+'</div>';_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.billing.email+'</div>';$('#order-details-page #order-details-list .order-details-billing-details').html(_displayContent);// display the Shipping Details
_displayContent='';// reset the displayContent variable for next use
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">\n                '+(orderData.shipping.first_name+" "+orderData.shipping.last_name)+'</div>';//check if the shipping details contains a company name
if(orderData.shipping.company&&orderData.shipping.company!==""){// there is company name, so display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.shipping.company+'</div>';}// check if the shipping details contains a 1st address line
if(orderData.shipping.address_1&&orderData.shipping.address_1!==""){// there is 1st address line, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.shipping.address_1+'</div>';}// check if the shipping details contains a 2nd address line
if(orderData.shipping.address_2&&orderData.shipping.address_2!==""){// there is 2nd address line, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.shipping.address_2+'</div>';}_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.shipping.city+'</div>';// check if the shipping details contains a state
if(orderData.shipping.state&&orderData.shipping.state!==""){// there is state, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.shipping.state+'</div>';}// check if the shipping details contains a postal code
if(orderData.shipping.postcode&&orderData.shipping.postcode!==""){// there is postal code, display it
_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.shipping.postcode+'</div>';}_displayContent+='<div class="col-xs-12" style="text-align: left; padding-right: 5px;\n                            padding-top: 10px; padding-bottom: 10px">'+orderData.shipping.country+'</div>';$('#order-details-page #order-details-list .order-details-shipping-details').html(_displayContent);}finally{}case 1:case'end':return _context208.stop();}}},_callee208,this);}));function displayContent(){return _ref211.apply(this,arguments);}return displayContent;}()}};

//# sourceMappingURL=controller-compiled.js.map