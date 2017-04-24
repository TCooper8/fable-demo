"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.environment = exports.Set = exports.backtrack = exports.Less = exports.Greater = exports.Equal = exports.Modulus = exports.Divide = exports.Multiply = exports.Subtract = exports.Add = exports.Expression = exports.Token = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.tokenize = tokenize;
exports.parse = parse;
exports.print = print;
exports.malformed = malformed;
exports.math = math;
exports.SchemeList = SchemeList;
exports.Nil = Nil;
exports.compare = compare;
exports.extend = extend;
exports.lookup = lookup;
exports.zip = zip;
exports.If = If;
exports.Let = Let;
exports.LetRec = LetRec;
exports.LetStar = LetStar;
exports.Lambda = Lambda;
exports.Cat = Cat;
exports.Cons = Cons;
exports.Car = Car;
exports.Cdr = Cdr;
exports.Quote = Quote;
exports.Eval = Eval;
exports.Macro = Macro;
exports.Begin = Begin;
exports.Define = Define;
exports.Display = Display;
exports.CallCC = CallCC;
exports.Ambivalent = Ambivalent;
exports.interp = interp;
exports.apply = apply;
exports.rep = rep;
exports.test = test;

var _Symbol2 = require("fable-core/umd/Symbol");

var _Symbol3 = _interopRequireDefault(_Symbol2);

var _Util = require("fable-core/umd/Util");

var _List = require("fable-core/umd/List");

var _List2 = _interopRequireDefault(_List);

var _BigInt = require("fable-core/umd/BigInt");

var _BigInt2 = _interopRequireDefault(_BigInt);

var _String = require("fable-core/umd/String");

var _Seq = require("fable-core/umd/Seq");

var _Map = require("fable-core/umd/Map");

var _GenericComparer = require("fable-core/umd/GenericComparer");

var _GenericComparer2 = _interopRequireDefault(_GenericComparer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Token = exports.Token = function () {
    function Token(caseName, fields) {
        _classCallCheck(this, Token);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(Token, [{
        key: _Symbol3.default.reflection,
        value: function () {
            return {
                type: "Index.Token",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
                cases: {
                    Close: [],
                    Number: ["string"],
                    Open: [],
                    Quote: [],
                    String: ["string"],
                    Symbol: ["string"],
                    Unquote: []
                }
            };
        }
    }, {
        key: "Equals",
        value: function (other) {
            return (0, _Util.equalsUnions)(this, other);
        }
    }, {
        key: "CompareTo",
        value: function (other) {
            return (0, _Util.compareUnions)(this, other);
        }
    }]);

    return Token;
}();

(0, _Symbol2.setType)("Index.Token", Token);

function tokenize(source) {
    var string = function string(acc) {
        return function (_arg1) {
            string: while (true) {
                var $var1 = _arg1.tail != null ? _arg1.head === "\"" ? [7, _arg1.tail] : _arg1.head === "\\" ? _arg1.tail.tail != null ? _arg1.tail.head === "\"" ? [0, _arg1.tail.tail] : _arg1.tail.head === "\\" ? [6, _arg1.tail.tail] : _arg1.tail.head === "b" ? [1, _arg1.tail.tail] : _arg1.tail.head === "f" ? [2, _arg1.tail.tail] : _arg1.tail.head === "n" ? [3, _arg1.tail.tail] : _arg1.tail.head === "r" ? [4, _arg1.tail.tail] : _arg1.tail.head === "t" ? [5, _arg1.tail.tail] : [8, _arg1.head, _arg1.tail] : [8, _arg1.head, _arg1.tail] : [8, _arg1.head, _arg1.tail] : [9];

                switch ($var1[0]) {
                    case 0:
                        acc = acc + "\"";
                        _arg1 = $var1[1];
                        continue string;

                    case 1:
                        acc = acc + "\b";
                        _arg1 = $var1[1];
                        continue string;

                    case 2:
                        acc = acc + "\f";
                        _arg1 = $var1[1];
                        continue string;

                    case 3:
                        acc = acc + "\n";
                        _arg1 = $var1[1];
                        continue string;

                    case 4:
                        acc = acc + "\r";
                        _arg1 = $var1[1];
                        continue string;

                    case 5:
                        acc = acc + "\t";
                        _arg1 = $var1[1];
                        continue string;

                    case 6:
                        acc = acc + "\\";
                        _arg1 = $var1[1];
                        continue string;

                    case 7:
                        return [acc, $var1[1]];

                    case 8:
                        acc = acc + $var1[1];
                        _arg1 = $var1[2];
                        continue string;

                    case 9:
                        throw new Error("Malformed string.");
                }
            }
        };
    };

    var comment = function comment(_arg2) {
        comment: while (true) {
            var $var2 = _arg2.tail == null ? [1] : _arg2.head === "\n" ? [0, _arg2.tail] : _arg2.head === "\r" ? [0, _arg2.tail] : [2, _arg2.tail];

            switch ($var2[0]) {
                case 0:
                    return $var2[1];

                case 1:
                    return new _List2.default();

                case 2:
                    _arg2 = $var2[1];
                    continue comment;
            }
        }
    };

    var token = function token(acc_1) {
        return function (_arg3) {
            token: while (true) {
                var $var3 = _arg3.tail != null ? _arg3.head === ")" ? [0, _arg3] : /^\s*$/.test(_arg3.head) ? [1, _arg3.tail, _arg3.head] : [2] : [2];

                switch ($var3[0]) {
                    case 0:
                        return [acc_1, $var3[1]];

                    case 1:
                        return [acc_1, $var3[1]];

                    case 2:
                        if (_arg3.tail != null) {
                            acc_1 = acc_1 + _arg3.head;
                            _arg3 = _arg3.tail;
                            continue token;
                        } else {
                            return [acc_1, new _List2.default()];
                        }

                }
            }
        };
    };

    var tokenize_ = function tokenize_(acc_2) {
        return function (_arg4) {
            tokenize_: while (true) {
                var $var4 = _arg4.tail != null ? /^\s*$/.test(_arg4.head) ? [0, _arg4.tail, _arg4.head] : [1] : [1];

                switch ($var4[0]) {
                    case 0:
                        acc_2 = acc_2;
                        _arg4 = $var4[1];
                        continue tokenize_;

                    case 1:
                        var $var5 = _arg4.tail != null ? _arg4.head === "\"" ? [5, _arg4.tail] : _arg4.head === "'" ? [2, _arg4.tail] : _arg4.head === "(" ? [0, _arg4.tail] : _arg4.head === ")" ? [1, _arg4.tail] : _arg4.head === "," ? [3, _arg4.tail] : _arg4.head === "-" ? _arg4.tail.tail != null ? function () {
                            var t_1 = _arg4.tail.tail;
                            var d_1 = _arg4.tail.head;
                            return !isNaN(parseInt(d_1));
                        }() ? [6, _arg4.tail.head, _arg4.tail.tail] : [7] : [7] : _arg4.head === ";" ? [4, _arg4.tail] : [7] : [7];

                        switch ($var5[0]) {
                            case 0:
                                acc_2 = new _List2.default(new Token("Open", []), acc_2);
                                _arg4 = $var5[1];
                                continue tokenize_;

                            case 1:
                                acc_2 = new _List2.default(new Token("Close", []), acc_2);
                                _arg4 = $var5[1];
                                continue tokenize_;

                            case 2:
                                acc_2 = new _List2.default(new Token("Quote", []), acc_2);
                                _arg4 = $var5[1];
                                continue tokenize_;

                            case 3:
                                acc_2 = new _List2.default(new Token("Unquote", []), acc_2);
                                _arg4 = $var5[1];
                                continue tokenize_;

                            case 4:
                                acc_2 = acc_2;
                                _arg4 = comment($var5[1]);
                                continue tokenize_;

                            case 5:
                                var patternInput = string("")($var5[1]);
                                acc_2 = new _List2.default(new Token("String", [patternInput[0]]), acc_2);
                                _arg4 = patternInput[1];
                                continue tokenize_;

                            case 6:
                                var patternInput_1 = token("-" + $var5[1])($var5[2]);
                                acc_2 = new _List2.default(new Token("Number", [patternInput_1[0]]), acc_2);
                                _arg4 = patternInput_1[1];
                                continue tokenize_;

                            case 7:
                                var $var6 = _arg4.tail != null ? _arg4.head === "+" ? _arg4.tail.tail != null ? function () {
                                    var t = _arg4.tail.tail;
                                    var d = _arg4.tail.head;
                                    return !isNaN(parseInt(d));
                                }() ? [0, _arg4.tail.head, _arg4.tail.tail] : !isNaN(parseInt(_arg4.head)) ? [0, _arg4.head, _arg4.tail] : [1] : !isNaN(parseInt(_arg4.head)) ? [0, _arg4.head, _arg4.tail] : [1] : !isNaN(parseInt(_arg4.head)) ? [0, _arg4.head, _arg4.tail] : [1] : [1];

                                switch ($var6[0]) {
                                    case 0:
                                        var patternInput_2 = token($var6[1])($var6[2]);
                                        acc_2 = new _List2.default(new Token("Number", [patternInput_2[0]]), acc_2);
                                        _arg4 = patternInput_2[1];
                                        continue tokenize_;

                                    case 1:
                                        if (_arg4.tail == null) {
                                            return (0, _List.reverse)(acc_2);
                                        } else {
                                            var patternInput_3 = token(_arg4.head)(_arg4.tail);
                                            acc_2 = new _List2.default(new Token("Symbol", [patternInput_3[0]]), acc_2);
                                            _arg4 = patternInput_3[1];
                                            continue tokenize_;
                                        }

                                }

                        }

                }
            }
        };
    };

    return tokenize_(new _List2.default())(source);
}

var Expression = exports.Expression = function () {
    function Expression(caseName, fields) {
        _classCallCheck(this, Expression);

        this.Case = caseName;
        this.Fields = fields;
    }

    _createClass(Expression, [{
        key: _Symbol3.default.reflection,
        value: function () {
            return {
                type: "Index.Expression",
                interfaces: ["FSharpUnion"],
                cases: {
                    Current: ["function"],
                    Dummy: ["string"],
                    Function: ["function"],
                    List: [(0, _Util.makeGeneric)(_List2.default, {
                        T: Expression
                    })],
                    Number: [_BigInt2.default],
                    Special: ["function"],
                    String: ["string"],
                    Symbol: ["string"]
                }
            };
        }
    }]);

    return Expression;
}();

(0, _Symbol2.setType)("Index.Expression", Expression);

function parse(source) {
    var map = function map(_arg1) {
        if (_arg1.Case === "Number") {
            return new Expression("Number", [(0, _BigInt.parse)(_arg1.Fields[0])]);
        } else if (_arg1.Case === "String") {
            return new Expression("String", [_arg1.Fields[0]]);
        } else if (_arg1.Case === "Symbol") {
            return new Expression("Symbol", [_arg1.Fields[0]]);
        } else {
            throw new Error("Syntax error.");
        }
    };

    var list = function list(f) {
        return function (t) {
            return function (acc) {
                var patternInput = parse_(new _List2.default())(t);
                return parse_(new _List2.default(new Expression("List", [f(patternInput[0])]), acc))(patternInput[1]);
            };
        };
    };

    var parse_ = function parse_(acc_1) {
        return function (_arg2) {
            parse_: while (true) {
                var $var7 = _arg2.tail == null ? [7] : _arg2.head.Case === "Open" ? [0, _arg2.tail] : _arg2.head.Case === "Close" ? [1, _arg2.tail] : _arg2.head.Case === "Quote" ? _arg2.tail.tail != null ? _arg2.tail.head.Case === "Open" ? [2, _arg2.tail.tail] : [3, _arg2.tail.head, _arg2.tail.tail] : [6, _arg2.head, _arg2.tail] : _arg2.head.Case === "Unquote" ? _arg2.tail.tail != null ? _arg2.tail.head.Case === "Open" ? [4, _arg2.tail.tail] : [5, _arg2.tail.head, _arg2.tail.tail] : [6, _arg2.head, _arg2.tail] : [6, _arg2.head, _arg2.tail];

                switch ($var7[0]) {
                    case 0:
                        return list(function (x) {
                            return x;
                        })($var7[1])(acc_1);

                    case 1:
                        return [(0, _List.reverse)(acc_1), $var7[1]];

                    case 2:
                        return list(function (e) {
                            return (0, _List.ofArray)([new Expression("Symbol", ["quote"]), new Expression("List", [e])]);
                        })($var7[1])(acc_1);

                    case 3:
                        acc_1 = new _List2.default(new Expression("List", [(0, _List.ofArray)([new Expression("Symbol", ["quote"]), map($var7[1])])]), acc_1);
                        _arg2 = $var7[2];
                        continue parse_;

                    case 4:
                        return list(function (e_1) {
                            return (0, _List.ofArray)([new Expression("Symbol", ["unquote"]), new Expression("List", [e_1])]);
                        })($var7[1])(acc_1);

                    case 5:
                        acc_1 = new _List2.default(new Expression("List", [(0, _List.ofArray)([new Expression("Symbol", ["unquote"]), map($var7[1])])]), acc_1);
                        _arg2 = $var7[2];
                        continue parse_;

                    case 6:
                        acc_1 = new _List2.default(map($var7[1]), acc_1);
                        _arg2 = $var7[2];
                        continue parse_;

                    case 7:
                        return [(0, _List.reverse)(acc_1), new _List2.default()];
                }
            }
        };
    };

    var patternInput_1 = parse_(new _List2.default())(tokenize(source));
    return patternInput_1[0];
}

function print(_arg1) {
    var $var8 = _arg1.Case === "String" ? [2, _arg1.Fields[0]] : _arg1.Case === "Symbol" ? [2, _arg1.Fields[0]] : _arg1.Case === "Number" ? [3, _arg1.Fields[0]] : _arg1.Case === "Function" ? [4] : _arg1.Case === "Special" ? [4] : _arg1.Case === "Current" ? [4] : _arg1.Case === "Dummy" ? [5] : _arg1.Fields[0].tail != null ? _arg1.Fields[0].head.Case === "Dummy" ? [0] : [1, _arg1.Fields[0]] : [1, _arg1.Fields[0]];

    switch ($var8[0]) {
        case 0:
            return "";

        case 1:
            return "(" + (0, _String.join)(" ", (0, _List.map)(function (_arg1_1) {
                return print(_arg1_1);
            }, $var8[1])) + ")";

        case 2:
            return $var8[1];

        case 3:
            return (0, _Util.toString)($var8[1]);

        case 4:
            return "Function";

        case 5:
            return "";
    }
}

function malformed(n, e) {
    throw new Error((0, _String.fsFormat)("Malformed '%s': %s")(function (x) {
        return x;
    })(n)(print(new Expression("List", [(0, _List.ofArray)([e])]))));
}

function math(ident, unary, op, name, cont, _arg1) {
    if (_arg1.tail != null) {
        if (_arg1.head.Case === "Number") {
            if (_arg1.tail.tail == null) {
                return cont(new Expression("Number", [(0, _BigInt.op_Multiply)(unary, _arg1.head.Fields[0])]));
            } else {
                var op_ = function op_(a) {
                    return function (_arg2) {
                        if (_arg2.Case === "Number") {
                            return op(a)(_arg2.Fields[0]);
                        } else {
                            return malformed((0, _String.fsFormat)("%s arg")(function (x) {
                                return x;
                            })(name), _arg2);
                        }
                    };
                };

                return cont(new Expression("Number", [(0, _Seq.fold)(function ($var9, $var10) {
                    return op_($var9)($var10);
                }, _arg1.head.Fields[0], _arg1.tail)]));
            }
        } else {
            return malformed(name, new Expression("List", [_arg1]));
        }
    } else {
        return cont(new Expression("Number", [ident]));
    }
}

function SchemeList(cont, _arg1) {
    return cont(new Expression("List", [_arg1]));
}

function Nil(cont, _arg1) {
    if (_arg1.tail == null) {
        return cont(new Expression("List", [new _List2.default()]));
    } else {
        throw new Error("/Users/admin/dev/fable-demo/demo-fscheme/src/index.fsx", 111, 15);
    }
}

var Add = exports.Add = function () {
    var ident = _BigInt.zero;
    var unary = _BigInt.one;

    var op = function op(x) {
        return function (y) {
            return (0, _BigInt.op_Addition)(x, y);
        };
    };

    var name = "addition";
    return function (cont) {
        return function (_arg1) {
            return math(ident, unary, op, name, cont, _arg1);
        };
    };
}();

var Subtract = exports.Subtract = function () {
    var ident = _BigInt.zero;
    var unary = (0, _BigInt.fromInt32)(-1);

    var op = function op(x) {
        return function (y) {
            return (0, _BigInt.op_Subtraction)(x, y);
        };
    };

    var name = "subtraction";
    return function (cont) {
        return function (_arg1) {
            return math(ident, unary, op, name, cont, _arg1);
        };
    };
}();

var Multiply = exports.Multiply = function () {
    var ident = _BigInt.one;
    var unary = _BigInt.one;

    var op = function op(x) {
        return function (y) {
            return (0, _BigInt.op_Multiply)(x, y);
        };
    };

    var name = "multiplication";
    return function (cont) {
        return function (_arg1) {
            return math(ident, unary, op, name, cont, _arg1);
        };
    };
}();

var Divide = exports.Divide = function () {
    var ident = _BigInt.one;
    var unary = _BigInt.one;

    var op = function op(x) {
        return function (y) {
            return (0, _BigInt.op_Division)(x, y);
        };
    };

    var name = "division";
    return function (cont) {
        return function (_arg1) {
            return math(ident, unary, op, name, cont, _arg1);
        };
    };
}();

var Modulus = exports.Modulus = function () {
    var ident = _BigInt.one;
    var unary = _BigInt.one;

    var op = function op(x) {
        return function (y) {
            return (0, _BigInt.op_Modulus)(x, y);
        };
    };

    var name = "modulus";
    return function (cont) {
        return function (_arg1) {
            return math(ident, unary, op, name, cont, _arg1);
        };
    };
}();

function compare(pred, name, cont, _arg1) {
    var $var11 = _arg1.tail != null ? _arg1.head.Case === "Number" ? _arg1.tail.tail != null ? _arg1.tail.head.Case === "Number" ? _arg1.tail.tail.tail == null ? [0, _arg1.head.Fields[0], _arg1.tail.head.Fields[0]] : [1, _arg1] : [1, _arg1] : [1, _arg1] : [1, _arg1] : [1, _arg1];

    switch ($var11[0]) {
        case 0:
            return cont(pred($var11[1])($var11[2]) ? new Expression("Number", [_BigInt.one]) : new Expression("Number", [_BigInt.zero]));

        case 1:
            return malformed(name, new Expression("List", [$var11[1]]));
    }
}

var Equal = exports.Equal = function () {
    var pred = function pred(x) {
        return function (y) {
            return x.Equals(y);
        };
    };

    var name = "equality";
    return function (cont) {
        return function (_arg1) {
            return compare(pred, name, cont, _arg1);
        };
    };
}();

var Greater = exports.Greater = function () {
    var pred = function pred(x) {
        return function (y) {
            return x.CompareTo(y) > 0;
        };
    };

    var name = "greater";
    return function (cont) {
        return function (_arg1) {
            return compare(pred, name, cont, _arg1);
        };
    };
}();

var Less = exports.Less = function () {
    var pred = function pred(x) {
        return function (y) {
            return x.CompareTo(y) < 0;
        };
    };

    var name = "less";
    return function (cont) {
        return function (_arg1) {
            return compare(pred, name, cont, _arg1);
        };
    };
}();

function extend(env, bindings) {
    return new _List2.default({
        contents: (0, _Map.create)(bindings, new _GenericComparer2.default(_Util.compare))
    }, env);
}

function lookup(env, symbol) {
    var matchValue = (0, _Seq.tryPick)(function (frame) {
        return (0, _Map.tryFind)(symbol, frame.contents);
    }, env);

    if (matchValue == null) {
        throw new Error((0, _String.fsFormat)("No binding for '%s'.")(function (x) {
            return x;
        })(symbol));
    } else {
        return matchValue;
    }
}

function zip(args, parameters) {
    var args_ = void 0;
    var plen = parameters.length;

    if (args.length === plen) {
        args_ = args;
    } else {
        var split = function split(ts) {
            return (0, _Seq.toList)(ts(plen - 1)(args));
        };

        args_ = (0, _List.append)(split(function (count) {
            return function (source) {
                return (0, _Seq.take)(count, source);
            };
        }), (0, _List.ofArray)([new Expression("List", [split(function (count_1) {
            return function (source_1) {
                return (0, _Seq.skip)(count_1, source_1);
            };
        })])]));
    }

    return (0, _Seq.toList)((0, _Seq.zip)(parameters, args_));
}

var backtrack = exports.backtrack = new _List2.default();

function If(cont, env, _arg1) {
    var $var12 = _arg1.tail != null ? _arg1.tail.tail != null ? _arg1.tail.tail.tail != null ? _arg1.tail.tail.tail.tail == null ? [0, _arg1.head, _arg1.tail.tail.head, _arg1.tail.head] : [1, _arg1] : [1, _arg1] : [1, _arg1] : [1, _arg1];

    switch ($var12[0]) {
        case 0:
            return interp(function (_arg2) {
                var $var13 = _arg2.Case === "List" ? _arg2.Fields[0].tail == null ? [0] : [2] : _arg2.Case === "String" ? _arg2.Fields[0] === "" ? [0] : [2] : _arg2.Case === "Number" ? _arg2.Fields[0].Equals(_BigInt.zero) ? [1, _arg2.Fields[0]] : [2] : [2];

                switch ($var13[0]) {
                    case 0:
                        return interp(cont, env, $var12[2]);

                    case 1:
                        return interp(cont, env, $var12[2]);

                    case 2:
                        return interp(cont, env, $var12[3]);
                }
            }, env, $var12[1]);

        case 1:
            return malformed("if", new Expression("List", [$var12[1]]));
    }
}

function Let(cont, env, _arg3) {
    var $var14 = _arg3.tail != null ? _arg3.head.Case === "List" ? _arg3.tail.tail != null ? _arg3.tail.tail.tail == null ? [0, _arg3.head.Fields[0], _arg3.tail.head] : [1, _arg3] : [1, _arg3] : [1, _arg3] : [1, _arg3];

    switch ($var14[0]) {
        case 0:
            var mapbind = function mapbind(acc) {
                return function (_arg4) {
                    var $var15 = _arg4.tail == null ? [1] : _arg4.head.Case === "List" ? _arg4.head.Fields[0].tail != null ? _arg4.head.Fields[0].head.Case === "Symbol" ? _arg4.head.Fields[0].tail.tail != null ? _arg4.head.Fields[0].tail.tail.tail == null ? [0, _arg4.head.Fields[0].tail.head, _arg4.head.Fields[0].head.Fields[0], _arg4.tail] : [2] : [2] : [2] : [2] : [2];

                    switch ($var15[0]) {
                        case 0:
                            return interp(function (x) {
                                return mapbind(new _List2.default([$var15[2], {
                                    contents: x
                                }], acc))($var15[3]);
                            }, env, $var15[1]);

                        case 1:
                            var frame = (0, _List.reverse)(acc);
                            var env_ = extend(env, frame);
                            return interp(cont, env_, $var14[2]);

                        case 2:
                            throw new Error("Malformed 'let' binding.");
                    }
                };
            };

            return mapbind(new _List2.default())($var14[1]);

        case 1:
            return malformed("let", new Expression("List", [$var14[1]]));
    }
}

function LetRec(cont, env, _arg5) {
    var $var16 = _arg5.tail != null ? _arg5.head.Case === "List" ? _arg5.tail.tail != null ? _arg5.tail.tail.tail == null ? [0, _arg5.head.Fields[0], _arg5.tail.head] : [1, _arg5] : [1, _arg5] : [1, _arg5] : [1, _arg5];

    switch ($var16[0]) {
        case 0:
            var bind = function bind(_arg6) {
                var $var17 = _arg6.Case === "List" ? _arg6.Fields[0].tail != null ? _arg6.Fields[0].head.Case === "Symbol" ? _arg6.Fields[0].tail.tail != null ? _arg6.Fields[0].tail.tail.tail == null ? [0, _arg6.Fields[0].head.Fields[0]] : [1, _arg6] : [1, _arg6] : [1, _arg6] : [1, _arg6] : [1, _arg6];

                switch ($var17[0]) {
                    case 0:
                        return [$var17[1], {
                            contents: new Expression("Dummy", ["Dummy 'letrec'"])
                        }];

                    case 1:
                        return malformed("letrec binding", $var17[1]);
                }
            };

            var env_ = function (bindings) {
                return extend(env, bindings);
            }((0, _List.map)(bind, $var16[1]));

            var frame = env_.head.contents;

            var mapupdate = function mapupdate(_arg7) {
                var $var18 = _arg7.tail == null ? [1] : _arg7.head.Case === "List" ? _arg7.head.Fields[0].tail != null ? _arg7.head.Fields[0].head.Case === "Symbol" ? _arg7.head.Fields[0].tail.tail != null ? _arg7.head.Fields[0].tail.tail.tail == null ? [0, _arg7.head.Fields[0].tail.head, _arg7.head.Fields[0].head.Fields[0], _arg7.tail] : [2] : [2] : [2] : [2] : [2];

                switch ($var18[0]) {
                    case 0:
                        return interp(function (x) {
                            frame.get($var18[2]).contents = x;
                            return mapupdate($var18[3]);
                        }, env_, $var18[1]);

                    case 1:
                        return interp(cont, env_, $var16[2]);

                    case 2:
                        throw new Error("Malformed 'let' binding.");
                }
            };

            return mapupdate($var16[1]);

        case 1:
            return malformed("letrec", new Expression("List", [$var16[1]]));
    }
}

function LetStar(cont, env, _arg8) {
    var $var19 = _arg8.tail != null ? _arg8.head.Case === "List" ? _arg8.tail.tail != null ? _arg8.tail.tail.tail == null ? [0, _arg8.head.Fields[0], _arg8.tail.head] : [1, _arg8] : [1, _arg8] : [1, _arg8] : [1, _arg8];

    switch ($var19[0]) {
        case 0:
            var foldbind = function foldbind(env_) {
                return function (_arg9) {
                    var $var20 = _arg9.tail == null ? [1] : _arg9.head.Case === "List" ? _arg9.head.Fields[0].tail != null ? _arg9.head.Fields[0].head.Case === "Symbol" ? _arg9.head.Fields[0].tail.tail != null ? _arg9.head.Fields[0].tail.tail.tail == null ? [0, _arg9.head.Fields[0].tail.head, _arg9.head.Fields[0].head.Fields[0], _arg9.tail] : [2] : [2] : [2] : [2] : [2];

                    switch ($var20[0]) {
                        case 0:
                            return interp(function (x) {
                                return foldbind(function (bindings) {
                                    return extend(env_, bindings);
                                }((0, _List.ofArray)([[$var20[2], {
                                    contents: x
                                }]])))($var20[3]);
                            }, env_, $var20[1]);

                        case 1:
                            return interp(cont, env_, $var19[2]);

                        case 2:
                            throw new Error("Malformed 'let*' binding.");
                    }
                };
            };

            return foldbind(env)($var19[1]);

        case 1:
            return malformed("let*", new Expression("List", [$var19[1]]));
    }
}

function Lambda(cont, env, _arg10) {
    var $var21 = _arg10.tail != null ? _arg10.head.Case === "List" ? _arg10.tail.tail != null ? _arg10.tail.tail.tail == null ? [0, _arg10.tail.head, _arg10.head.Fields[0]] : [1, _arg10] : [1, _arg10] : [1, _arg10] : [1, _arg10];

    switch ($var21[0]) {
        case 0:
            var closure = function closure(cont_) {
                return function (env_) {
                    return function (args) {
                        var mapbind = function mapbind(acc) {
                            return function (_arg11) {
                                if (_arg11.tail == null) {
                                    var env__ = extend((0, _List.append)(env, env_), (0, _List.reverse)(acc));
                                    return interp(cont_, env__, $var21[1]);
                                } else if (_arg11.head[0].Case === "Symbol") {
                                    return interp(function (x) {
                                        return mapbind(new _List2.default([_arg11.head[0].Fields[0], {
                                            contents: x
                                        }], acc))(_arg11.tail);
                                    }, env_, _arg11.head[1]);
                                } else {
                                    throw new Error("Malformed lambda param.");
                                }
                            };
                        };

                        return mapbind(new _List2.default())(zip(args, $var21[2]));
                    };
                };
            };

            return cont(new Expression("Special", [closure]));

        case 1:
            return malformed("lambda", new Expression("List", [$var21[1]]));
    }
}

function Cat(cont, _arg12) {
    var $var22 = _arg12.tail != null ? _arg12.head.Case === "List" ? _arg12.tail.tail != null ? _arg12.tail.head.Case === "List" ? _arg12.tail.tail.tail == null ? [0, _arg12.head.Fields[0], _arg12.tail.head.Fields[0]] : [1, _arg12] : [1, _arg12] : [1, _arg12] : [1, _arg12] : [1, _arg12];

    switch ($var22[0]) {
        case 0:
            return cont(new Expression("List", [(0, _List.append)($var22[1], $var22[2])]));

        case 1:
            return malformed("cat", new Expression("List", [$var22[1]]));
    }
}

function Cons(cont, _arg13) {
    var $var23 = _arg13.tail != null ? _arg13.tail.tail != null ? _arg13.tail.head.Case === "List" ? _arg13.tail.tail.tail == null ? [0, _arg13.head, _arg13.tail.head.Fields[0]] : [1, _arg13] : [1, _arg13] : [1, _arg13] : [1, _arg13];

    switch ($var23[0]) {
        case 0:
            return cont(new Expression("List", [new _List2.default($var23[1], $var23[2])]));

        case 1:
            return malformed("cons", new Expression("List", [$var23[1]]));
    }
}

function Car(cont, _arg14) {
    var $var24 = _arg14.tail != null ? _arg14.head.Case === "List" ? _arg14.head.Fields[0].tail != null ? _arg14.tail.tail == null ? [0, _arg14.head.Fields[0].head] : [1, _arg14] : [1, _arg14] : [1, _arg14] : [1, _arg14];

    switch ($var24[0]) {
        case 0:
            return cont($var24[1]);

        case 1:
            return malformed("car", new Expression("List", [$var24[1]]));
    }
}

function Cdr(cont, _arg15) {
    var $var25 = _arg15.tail != null ? _arg15.head.Case === "List" ? _arg15.head.Fields[0].tail != null ? _arg15.tail.tail == null ? [0, _arg15.head.Fields[0].tail] : [1, _arg15] : [1, _arg15] : [1, _arg15] : [1, _arg15];

    switch ($var25[0]) {
        case 0:
            return cont(new Expression("List", [$var25[1]]));

        case 1:
            return malformed("cdr", new Expression("List", [$var25[1]]));
    }
}

function Quote(cont, env) {
    var unquote = function unquote(cont_) {
        return function (_arg16) {
            var $var26 = _arg16.Case === "List" ? _arg16.Fields[0].tail != null ? _arg16.Fields[0].head.Case === "Symbol" ? _arg16.Fields[0].head.Fields[0] === "unquote" ? _arg16.Fields[0].tail.tail != null ? _arg16.Fields[0].tail.tail.tail == null ? [0, _arg16.Fields[0].tail.head] : [1, _arg16] : [1, _arg16] : [2, _arg16.Fields[0]] : [2, _arg16.Fields[0]] : [2, _arg16.Fields[0]] : [3, _arg16];

            switch ($var26[0]) {
                case 0:
                    return interp(cont_, env, $var26[1]);

                case 1:
                    return malformed("unquote (too many args)", $var26[1]);

                case 2:
                    var mapunquote = function mapunquote(acc) {
                        return function (_arg17) {
                            if (_arg17.tail == null) {
                                return new Expression("List", [(0, _List.reverse)(acc)]);
                            } else {
                                return unquote(function (x) {
                                    return mapunquote(new _List2.default(x, acc))(_arg17.tail);
                                })(_arg17.head);
                            }
                        };
                    };

                    return cont_(mapunquote(new _List2.default())($var26[1]));

                case 3:
                    return cont_($var26[1]);
            }
        };
    };

    return function (_arg18) {
        var $var27 = _arg18.tail != null ? _arg18.tail.tail == null ? [0, _arg18.head] : [1, _arg18] : [1, _arg18];

        switch ($var27[0]) {
            case 0:
                return unquote(cont)($var27[1]);

            case 1:
                return malformed("quote", new Expression("List", [$var27[1]]));
        }
    };
}

function Eval(cont, env, _arg19) {
    var $var28 = _arg19.tail != null ? _arg19.tail.tail == null ? [0, _arg19.head] : [1, _arg19] : [1, _arg19];

    switch ($var28[0]) {
        case 0:
            return function () {
                var cont_1 = function cont_1(expression) {
                    return interp(cont, env, expression);
                };

                return function (expression_1) {
                    return interp(cont_1, env, expression_1);
                };
            }()($var28[1]);

        case 1:
            return malformed("interp", new Expression("List", [$var28[1]]));
    }
}

function Macro(cont, env, _arg20) {
    var $var29 = _arg20.tail != null ? _arg20.head.Case === "List" ? _arg20.tail.tail != null ? _arg20.tail.tail.tail == null ? [0, _arg20.tail.head, _arg20.head.Fields[0]] : [1, _arg20] : [1, _arg20] : [1, _arg20] : [1, _arg20];

    switch ($var29[0]) {
        case 0:
            var closure = function closure(cont_) {
                return function (env_) {
                    return function (args) {
                        var bind = function bind(_arg21) {
                            if (_arg21[0].Case === "Symbol") {
                                var p = _arg21[0].Fields[0];
                                return [p, {
                                    contents: _arg21[1]
                                }];
                            } else {
                                return malformed("macro parameter", _arg21[1]);
                            }
                        };

                        var env__ = function (bindings) {
                            return extend(env, bindings);
                        }(function (list) {
                            return (0, _List.map)(bind, list);
                        }(zip(args, $var29[2])));

                        return interp(function (expression) {
                            return interp(cont_, env_, expression);
                        }, env__, $var29[1]);
                    };
                };
            };

            return cont(new Expression("Special", [closure]));

        case 1:
            return malformed("macro", new Expression("List", [$var29[1]]));
    }
}

function _Set(cont, env, _arg22) {
    var $var30 = _arg22.tail != null ? _arg22.head.Case === "Symbol" ? _arg22.tail.tail != null ? _arg22.tail.tail.tail == null ? [0, _arg22.tail.head, _arg22.head.Fields[0]] : [1, _arg22] : [1, _arg22] : [1, _arg22] : [1, _arg22];

    switch ($var30[0]) {
        case 0:
            return interp(function (x) {
                lookup(env, $var30[2]).contents = x;
                return cont(new Expression("Dummy", [(0, _String.fsFormat)("Set %s")(function (x) {
                    return x;
                })($var30[2])]));
            }, env, $var30[1]);

        case 1:
            return malformed("set!", new Expression("List", [$var30[1]]));
    }
}

exports.Set = _Set;

function Begin(cont, env) {
    var foldinterp = function foldinterp(last) {
        return function (_arg23) {
            if (_arg23.tail == null) {
                return cont(last);
            } else {
                return interp(function (x) {
                    return foldinterp(x)(_arg23.tail);
                }, env, _arg23.head);
            }
        };
    };

    return foldinterp(new Expression("Dummy", ["Empty 'begin'"]));
}

function Define(cont, env, _arg24) {
    var $var31 = _arg24.tail != null ? _arg24.head.Case === "Symbol" ? _arg24.tail.tail != null ? _arg24.tail.tail.tail == null ? [0, _arg24.tail.head, _arg24.head.Fields[0]] : [1, _arg24] : [1, _arg24] : [1, _arg24] : [1, _arg24];

    switch ($var31[0]) {
        case 0:
            var def = {
                contents: new Expression("Dummy", ["Dummy 'define'"])
            };
            env.head.contents = (0, _Map.add)($var31[2], def, env.head.contents);
            return interp(function (x) {
                def.contents = x;
                return cont(new Expression("Dummy", [(0, _String.fsFormat)("Defined %s")(function (x) {
                    return x;
                })($var31[2])]));
            }, env, $var31[1]);

        case 1:
            return malformed("define", new Expression("List", [$var31[1]]));
    }
}

function Display(cont, _arg25) {
    var $var32 = _arg25.tail != null ? _arg25.tail.tail == null ? [0, _arg25.head] : [1, _arg25] : [1, _arg25];

    switch ($var32[0]) {
        case 0:
            (0, _String.fsFormat)("%s")(function (x) {
                console.log(x);
            })(print($var32[1]));
            return cont(new Expression("Dummy", ["Dummy 'display'"]));

        case 1:
            return malformed("display", new Expression("List", [$var32[1]]));
    }
}

function CallCC(cont, env, _arg26) {
    var $var33 = _arg26.tail != null ? _arg26.tail.tail == null ? [0, _arg26.head] : [1, _arg26] : [1, _arg26];

    switch ($var33[0]) {
        case 0:
            return interp(function (_arg27) {
                return _arg27.Case === "Special" ? _arg27.Fields[0](cont)(env)((0, _List.ofArray)([new Expression("Current", [cont])])) : malformed("call/cc", _arg27);
            }, env, $var33[1]);

        case 1:
            return malformed("call/cc", new Expression("List", [$var33[1]]));
    }
}

function Ambivalent(cont, env, args) {
    if (args.tail == null) {
        if (backtrack.tail == null) {
            (0, _String.fsFormat)("No more solutions.")(function (x) {
                console.log(x);
            });
            return cont(new Expression("Dummy", ["Unsolvable"]));
        } else {
            var t = backtrack.tail;
            var back = backtrack.head;
            exports.backtrack = backtrack = t;
            return back(null);
        }
    } else {
        exports.backtrack = backtrack = new _List2.default(function () {
            return Ambivalent(cont, env, args.tail);
        }, backtrack);
        return interp(cont, env, args.head);
    }
}

var environment = exports.environment = (0, _List.ofArray)([{
    contents: (0, _Map.create)((0, _List.ofArray)([["*", {
        contents: new Expression("Function", [Multiply])
    }], ["/", {
        contents: new Expression("Function", [Divide])
    }], ["%", {
        contents: new Expression("Function", [Modulus])
    }], ["+", {
        contents: new Expression("Function", [Add])
    }], ["-", {
        contents: new Expression("Function", [Subtract])
    }], ["=", {
        contents: new Expression("Function", [Equal])
    }], [">", {
        contents: new Expression("Function", [Greater])
    }], ["<", {
        contents: new Expression("Function", [Less])
    }], ["if", {
        contents: new Expression("Special", [function (cont) {
            return function (env) {
                return function (_arg1) {
                    return If(cont, env, _arg1);
                };
            };
        }])
    }], ["let", {
        contents: new Expression("Special", [function (cont_1) {
            return function (env_1) {
                return function (_arg3) {
                    return Let(cont_1, env_1, _arg3);
                };
            };
        }])
    }], ["letrec", {
        contents: new Expression("Special", [function (cont_2) {
            return function (env_2) {
                return function (_arg5) {
                    return LetRec(cont_2, env_2, _arg5);
                };
            };
        }])
    }], ["let*", {
        contents: new Expression("Special", [function (cont_3) {
            return function (env_3) {
                return function (_arg8) {
                    return LetStar(cont_3, env_3, _arg8);
                };
            };
        }])
    }], ["lambda", {
        contents: new Expression("Special", [function (cont_4) {
            return function (env_4) {
                return function (_arg10) {
                    return Lambda(cont_4, env_4, _arg10);
                };
            };
        }])
    }], ["list", {
        contents: new Expression("Function", [function (cont_5) {
            return function (_arg1_1) {
                return SchemeList(cont_5, _arg1_1);
            };
        }])
    }], ["nil", {
        contents: new Expression("Function", [function (cont_6) {
            return function (_arg1_2) {
                return Nil(cont_6, _arg1_2);
            };
        }])
    }], ["cat", {
        contents: new Expression("Function", [function (cont_7) {
            return function (_arg12) {
                return Cat(cont_7, _arg12);
            };
        }])
    }], ["cons", {
        contents: new Expression("Function", [function (cont_8) {
            return function (_arg13) {
                return Cons(cont_8, _arg13);
            };
        }])
    }], ["car", {
        contents: new Expression("Function", [function (cont_9) {
            return function (_arg14) {
                return Car(cont_9, _arg14);
            };
        }])
    }], ["cdr", {
        contents: new Expression("Function", [function (cont_10) {
            return function (_arg15) {
                return Cdr(cont_10, _arg15);
            };
        }])
    }], ["quote", {
        contents: new Expression("Special", [function (cont_11) {
            return function (env_5) {
                return Quote(cont_11, env_5);
            };
        }])
    }], ["interp", {
        contents: new Expression("Special", [function (cont_12) {
            return function (env_6) {
                return function (_arg19) {
                    return Eval(cont_12, env_6, _arg19);
                };
            };
        }])
    }], ["macro", {
        contents: new Expression("Special", [function (cont_13) {
            return function (env_7) {
                return function (_arg20) {
                    return Macro(cont_13, env_7, _arg20);
                };
            };
        }])
    }], ["set!", {
        contents: new Expression("Special", [function (cont_14) {
            return function (env_8) {
                return function (_arg22) {
                    return _Set(cont_14, env_8, _arg22);
                };
            };
        }])
    }], ["begin", {
        contents: new Expression("Special", [function (cont_15) {
            return function (env_9) {
                return Begin(cont_15, env_9);
            };
        }])
    }], ["define", {
        contents: new Expression("Special", [function (cont_16) {
            return function (env_10) {
                return function (_arg24) {
                    return Define(cont_16, env_10, _arg24);
                };
            };
        }])
    }], ["display", {
        contents: new Expression("Function", [function (cont_17) {
            return function (_arg25) {
                return Display(cont_17, _arg25);
            };
        }])
    }], ["call/cc", {
        contents: new Expression("Special", [function (cont_18) {
            return function (env_11) {
                return function (_arg26) {
                    return CallCC(cont_18, env_11, _arg26);
                };
            };
        }])
    }], ["amb", {
        contents: new Expression("Special", [function (cont_19) {
            return function (env_12) {
                return function (args) {
                    return Ambivalent(cont_19, env_12, args);
                };
            };
        }])
    }]]), new _GenericComparer2.default(_Util.compare))
}]);

function interp($var114, $var115, $var116) {
    var _loop = function _loop() {
        var cont = $var114;
        var env = $var115;
        var expression = $var116;
        var $var34 = expression.Case === "Number" ? [0, expression] : expression.Case === "String" ? [0, expression] : expression.Case === "Current" ? [0, expression] : expression.Case === "Symbol" ? [1, expression.Fields[0]] : expression.Case === "List" ? expression.Fields[0].tail != null ? [2, expression.Fields[0].head, expression.Fields[0].tail] : [4] : expression.Case === "Dummy" ? [3, expression.Fields[0]] : [4];

        switch ($var34[0]) {
            case 0:
                return {
                    v: cont($var34[1])
                };

            case 1:
                return {
                    v: cont(lookup(env, $var34[1]).contents)
                };

            case 2:
                $var114 = function $var114(_arg28) {
                    if (_arg28.Case === "Function") {
                        return apply(cont, env, _arg28.Fields[0], $var34[2]);
                    } else if (_arg28.Case === "Special") {
                        return _arg28.Fields[0](cont)(env)($var34[2]);
                    } else if (_arg28.Case === "Current") {
                        var $var35 = $var34[2].tail != null ? $var34[2].tail.tail == null ? [0, $var34[2].head] : [1, $var34[2]] : [1, $var34[2]];

                        switch ($var35[0]) {
                            case 0:
                                return _arg28.Fields[0]($var35[1]);

                            case 1:
                                return malformed("call/cc args", new Expression("List", [$var35[1]]));
                        }
                    } else {
                        return malformed("expression", _arg28);
                    }
                };

                $var115 = env;
                $var116 = $var34[1];
                return "continue|interp";

            case 3:
                throw new Error((0, _String.fsFormat)("Cannot interpuate dummy value: %s")(function (x) {
                    return x;
                })($var34[1]));

            case 4:
                throw new Error("Malformed expression.");
        }
    };

    interp: while (true) {
        var _ret = _loop();

        switch (_ret) {
            case "continue|interp":
                continue interp;

            default:
                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
        }
    }
}

function apply(cont, env, fn, args) {
    var mapinterp = function mapinterp(acc) {
        return function (_arg29) {
            if (_arg29.tail == null) {
                return fn(cont)((0, _List.reverse)(acc));
            } else {
                return interp(function (a) {
                    return mapinterp(new _List2.default(a, acc))(_arg29.tail);
                }, env, _arg29.head);
            }
        };
    };

    return mapinterp(new _List2.default())(args);
}

function rep(env) {
    var interp_ = function interp_(_arg1) {
        var $var36 = _arg1.Case === "Symbol" ? _arg1.Fields[0] === "?" ? [0] : [1, _arg1] : [1, _arg1];

        switch ($var36[0]) {
            case 0:
                if (backtrack.tail == null) {
                    (0, _String.fsFormat)("No current problem.")(function (x) {
                        console.log(x);
                    });
                    return new Expression("Dummy", ["No problem"]);
                } else {
                    var t = backtrack.tail;
                    var h = backtrack.head;
                    exports.backtrack = backtrack = t;
                    return h(null);
                }

            case 1:
                return interp(function (x) {
                    return x;
                }, env, $var36[1]);
        }
    };

    return function ($var40) {
        return function (_arg1_1) {
            return print(_arg1_1);
        }(function ($var39) {
            return interp_(function ($var38) {
                return function (list) {
                    return list.head;
                }(function ($var37) {
                    return parse((0, _Seq.toList)($var37));
                }($var38));
            }($var39));
        }($var40));
    };
}

function test() {
    var _case = function _case(source) {
        return function (expected) {
            try {
                var output = function () {
                    var clo1 = rep(environment);
                    return function (arg10) {
                        return clo1(arg10);
                    };
                }()(source);

                if (output !== expected) {
                    (0, _String.fsFormat)("TEST FAILED: %s [Expected: %s, Actual: %s]")(function (x) {
                        console.log(x);
                    })(source)(expected)(output);
                }
            } catch (ex) {
                (0, _String.fsFormat)("TEST CRASHED: %s [%s]")(function (x) {
                    console.log(x);
                })(ex.message)(source);
            }
        };
    };

    _case("\"hello\"")("hello");

    _case("\"\\\"\"")("\"");

    _case("\"\\b\"")("\b");

    _case("\"\\f\"")("\f");

    _case("\"\\n\"")("\n");

    _case("\"\\r\"")("\r");

    _case("\"\\t\"")("\t");

    _case("\"\\\\\"")("\\");

    _case("1")("1");

    _case("+1")("1");

    _case("-1")("-1");

    _case("(*)")("1");

    _case("(* 2)")("2");

    _case("(* 2 3)")("6");

    _case("(* 2 3 4)")("24");

    _case("(/)")("1");

    _case("(/ 2)")("2");

    _case("(/ 9 2)")("4");

    _case("(/ 12 2 3)")("2");

    _case("(%)")("1");

    _case("(% 2)")("2");

    _case("(% 9 2)")("1");

    _case("(% 8 2)")("0");

    _case("(% 26 7 3)")("2");

    _case("(+)")("0");

    _case("(+ 10)")("10");

    _case("(+ 10 2)")("12");

    _case("(+ 10 2 3)")("15");

    _case("(-)")("0");

    _case("(- 10)")("-10");

    _case("(- 10 2)")("8");

    _case("(- 10 2 3)")("5");

    _case("(if (* 0 1) 10 20)")("20");

    _case("(if (* 1 1) 10 20)")("10");

    _case("(if (* 1 1) 10 bomb)")("10");

    _case("(* 1234567890987654321 1234567890987654321)")("1524157877457704723228166437789971041");

    _case("(let ((x 2)) x)")("2");

    _case("(let ((a 00) (b 10) (c 20)) (if a b c))")("20");

    _case("(let ((square (lambda (x) (* x x)))) (square 4))")("16");

    _case("(let ((square (lambda (x) (* x x)))) square)")("Function");

    _case("(let ((times3 (let ((n 3)) (lambda (x) (* n x))))) (times3 4))")("12");

    _case("(let ((times3 (let ((makemultiplier (lambda (n) (lambda (x) (* n x))))) (makemultiplier 3)))) (times3 5))")("15");

    _case("(letrec ((factorial (lambda (n) (if n (* n (factorial (- n 1))) 1)))) (factorial 4))")("24");

    _case("(let ((a 1) (b 2)) (let ((a b) (b a)) b))")("1");

    _case("(let ((a 1) (b 2)) (let* ((a b) (b a)) b))")("2");

    _case("(let ((a 5)) (let ((b (* a 2))) (let ((c (- b 3))) c)))")("7");

    _case("(let* ((a 5) (b (* a 2)) (c (- b 3))) c)")("7");

    _case("(list 1 2 3)")("(1 2 3)");

    _case("(car (list 1 2 3))")("1");

    _case("(cdr (list 1 2 3))")("(2 3)");

    _case("(cat '(1 2) '(a b))")("(1 2 a b)");

    _case("(cat '(1 2) '())")("(1 2)");

    _case("(cat '() '(1 2))")("(1 2)");

    _case("(cons 1 (list 2 3))")("(1 2 3)");

    _case("(cons 1 (cons 2 (cons 3 nil)))")("(1 2 3)");

    _case("(let ((a 1) (b 2) (c 3)) (list a b c))")("(1 2 3)");

    _case("(let ((a (list 1 2 3))) (car a))")("1");

    _case("(let ((a (list 1 2 3))) (cdr a))")("(2 3)");

    _case("(quote (* 2 3))")("(* 2 3)");

    _case("'(* 2 3)")("(* 2 3)");

    _case("(interp '(* 2 3))")("6");

    _case("(quote (* 2 (- 5 2)))")("(* 2 (- 5 2))");

    _case("(quote (* 2 (unquote (- 5 2))))")("(* 2 3)");

    _case("'(* 2 ,(- 5 2))")("(* 2 3)");

    _case("(quote (quote 1 2 3))")("(quote 1 2 3)");

    _case("(let ((x 'rain) (y 'spain) (z 'plain)) '(the ,x in ,y falls mainly on the ,z))")("(the rain in spain falls mainly on the plain)");

    _case("(let ((or (macro (a b) '(if ,a 1 (if ,b 1 0))))) (or 1 BOOM))")("1");

    _case("(let ((and (macro (a b) '(if ,a (if ,b 1 0) 0)))) (and 0 BOOM))")("0");

    _case("(let ((a 1)) (begin (set! a 2) a))")("2");

    _case("(let* ((a 5) (dummy (set! a 10))) a)")("10");

    _case("(begin (define fac (lambda (x) (if x (* x (fac (- x 1))) 1))) (fac 7))")("5040");

    _case("(begin (define square (lambda (x) (* x x))) (square 4))")("16");

    _case("(let ((x 4)) (begin (define y 8) (* x y))))")("32");

    _case("(and 0 0)")("0");

    _case("(and 1 0)")("0");

    _case("(and 0 1)")("0");

    _case("(and 1 1)")("1");

    _case("(or 0 0)")("0");

    _case("(or 1 0)")("1");

    _case("(or 0 1)")("1");

    _case("(or 1 1)")("1");

    _case("(not? 0)")("1");

    _case("(not? 1)")("0");

    _case("(xor 0 0)")("0");

    _case("(xor 1 0)")("1");

    _case("(xor 0 1)")("1");

    _case("(xor 1 1)")("0");

    _case("(let ((square (lambda (x) (* x x)))) (map square '(1 2 3 4 5 6 7 8 9)))")("(1 4 9 16 25 36 49 64 81)");

    _case("(let ((square (lambda (x) (* x x)))) (map square '(9)))")("(81)");

    _case("(let ((square (lambda (x) (* x x)))) (map square '()))")("()");

    _case("(fold * 1 '(2 3 4 5))")("120");

    _case("(reverse '(1 2 3))")("(3 2 1)");

    _case("(call/cc (lambda (c) (c 10)))")("10");

    _case("(call/cc (lambda (c) (if (c 10) 20 30)))")("10");

    _case("(+ 8 (call/cc (lambda (k^) (* (k^ 5) 100))))")("13");

    _case("(* (+ (call/cc (lambda (k^) (/ (k^ 5) 4))) 8) 3)")("39");
}
//# sourceMappingURL=index.js.map