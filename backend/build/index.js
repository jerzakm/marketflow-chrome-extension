module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/allegroHandlers/offerData.ts":
/*!******************************************!*\
  !*** ./src/allegroHandlers/offerData.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nexports.__esModule = true;\r\nexports.getOfferBids = function (client, sessionHandle, itemId) {\r\n    return new Promise(function (resolve, reject) {\r\n        client.doGetBidItem2({\r\n            sessionHandle: sessionHandle, itemId: itemId\r\n        }, function (err, result) {\r\n            resolve(result);\r\n            reject(err);\r\n        });\r\n    });\r\n};\r\nexports.processOfferData = function (offerData) {\r\n    var processedData = [];\r\n    if (offerData.biditemList) {\r\n        for (var _i = 0, _a = offerData.biditemList.item; _i < _a.length; _i++) {\r\n            var b = _a[_i];\r\n            var bid = b.bidsArray.item;\r\n            var entry = {\r\n                timestamp: bid[7],\r\n                price: bid[6],\r\n                quantity: bid[5]\r\n            };\r\n            processedData.push(entry);\r\n        }\r\n    }\r\n    return processedData;\r\n};\r\n\n\n//# sourceURL=webpack:///./src/allegroHandlers/offerData.ts?");

/***/ }),

/***/ "./src/allegroHandlers/soapAuth.ts":
/*!*****************************************!*\
  !*** ./src/allegroHandlers/soapAuth.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nexports.__esModule = true;\r\nvar soap = __webpack_require__(/*! soap */ \"soap\");\r\nexports.createSoapClient = function (accessToken) {\r\n    return new Promise(function (resolve, reject) {\r\n        try {\r\n            var url = process.env.ALLEGRO_WDSL_URL;\r\n            soap.createClient(url, function (err, client) {\r\n                resolve(client);\r\n            });\r\n        }\r\n        catch (e) {\r\n            reject(e);\r\n        }\r\n    });\r\n};\r\nexports.doLoginWithAccessToken = function (client, accessToken) {\r\n    return new Promise(function (resolve, reject) {\r\n        client.doLoginWithAccessToken({\r\n            accessToken: accessToken,\r\n            countryCode: 1,\r\n            webapiKey: process.env.ALLEGRO_WEBAPI_KEY\r\n        }, function (err, result) {\r\n            if (err) {\r\n                reject(err);\r\n            }\r\n            else {\r\n                resolve(result);\r\n            }\r\n        });\r\n    });\r\n};\r\n\n\n//# sourceURL=webpack:///./src/allegroHandlers/soapAuth.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (this && this.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nexports.__esModule = true;\r\nvar soapAuth_1 = __webpack_require__(/*! ./allegroHandlers/soapAuth */ \"./src/allegroHandlers/soapAuth.ts\");\r\nvar offerData_1 = __webpack_require__(/*! ./allegroHandlers/offerData */ \"./src/allegroHandlers/offerData.ts\");\r\nvar app = __webpack_require__(/*! express */ \"express\")();\r\n__webpack_require__(/*! dotenv */ \"dotenv\").config({ path: '.env' });\r\napp.get('/', function (req, res) {\r\n    res.end('hello world!');\r\n});\r\napp.use('/health', __webpack_require__(/*! ./routes/health.ts */ \"./src/routes/health.ts\"));\r\napp.use(function (req, res) {\r\n    res\r\n        .status(404)\r\n        .json({\r\n        message: 'not found'\r\n    });\r\n});\r\napp.use(function (err, req, res, next) {\r\n    var error = {\r\n        status: err.status || 500,\r\n        message: err.message || 'Something went wrong!'\r\n    };\r\n    if (true) {\r\n        error['stack'] = err.stack;\r\n    }\r\n    res\r\n        .status(err.status || 500)\r\n        .json(error);\r\n});\r\nvar port = process.env.PORT || 5000;\r\n// app.listen(port, () => console.log(`app backend is running on port ${port}`))\r\nfunction test() {\r\n    return __awaiter(this, void 0, void 0, function () {\r\n        var accessToken, soapClient, webApiSession, offerId, offerData, processedData, response;\r\n        return __generator(this, function (_a) {\r\n            switch (_a.label) {\r\n                case 0:\r\n                    accessToken = process.env.ALLEGRO_TEMP_TOKEN;\r\n                    return [4 /*yield*/, soapAuth_1.createSoapClient(accessToken)];\r\n                case 1:\r\n                    soapClient = _a.sent();\r\n                    return [4 /*yield*/, soapAuth_1.doLoginWithAccessToken(soapClient, accessToken)];\r\n                case 2:\r\n                    webApiSession = _a.sent();\r\n                    offerId = 8626300812;\r\n                    return [4 /*yield*/, offerData_1.getOfferBids(soapClient, webApiSession.sessionHandlePart, offerId)];\r\n                case 3:\r\n                    offerData = _a.sent();\r\n                    processedData = offerData_1.processOfferData(offerData);\r\n                    response = {\r\n                        timestamp: Date.now(),\r\n                        offer: offerId,\r\n                        data: processedData\r\n                    };\r\n                    console.log(response);\r\n                    return [2 /*return*/];\r\n            }\r\n        });\r\n    });\r\n}\r\ntest();\r\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ }),

/***/ "./src/routes/health.ts":
/*!******************************!*\
  !*** ./src/routes/health.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nexports.__esModule = true;\r\nvar express = __webpack_require__(/*! express */ \"express\");\r\nvar router = express.Router();\r\nrouter.get('/', function (req, res) {\r\n    res.json({\r\n        status: 'up'\r\n    });\r\n});\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./src/routes/health.ts?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "soap":
/*!***********************!*\
  !*** external "soap" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"soap\");\n\n//# sourceURL=webpack:///external_%22soap%22?");

/***/ })

/******/ });