"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CharPlugin = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Symbol2 = require("fable-core/umd/Symbol");

var _Symbol3 = _interopRequireDefault(_Symbol2);

var _String = require("fable-core/umd/String");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CharPlugin = exports.CharPlugin = function () {
  _createClass(CharPlugin, [{
    key: _Symbol3.default.reflection,
    value: function () {
      return {
        type: "Fable.Plugins.CharPlugin",
        interfaces: ["Fable.IReplacePlugin"],
        properties: {}
      };
    }
  }]);

  function CharPlugin() {
    _classCallCheck(this, CharPlugin);
  }

  _createClass(CharPlugin, [{
    key: "TryReplace",
    value: function (com, info) {
      (0, _String.fsFormat)("Checking info %A")(function (x) {
        console.log(x);
      })(info);

      if (info.ownerFullName === "System.Char") {
        if (info.methodName === "IsWhiteSpace") {
          throw new Error("TODO");
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }]);

  return CharPlugin;
}();

(0, _Symbol2.setType)("Fable.Plugins.CharPlugin", CharPlugin);
//# sourceMappingURL=Fable.Plugins.System.Char.js.map