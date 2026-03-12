"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EBook = void 0;
var BaseBook_js_1 = require("./BaseBook.js");
var EBook = /** @class */ (function (_super) {
    __extends(EBook, _super);
    function EBook(book) {
        var _this = _super.call(this, book) || this;
        _this.fileSize = "5MB";
        return _this;
    }
    return EBook;
}(BaseBook_js_1.BaseBook));
exports.EBook = EBook;
