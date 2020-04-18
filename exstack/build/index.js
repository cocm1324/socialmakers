"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var PORT = 3000;
var App = /** @class */ (function () {
    function App() {
        this.application = express_1.default();
    }
    return App;
}());
var app = new App().application;
app.get("/", function (req, res) {
    res.send("start");
});
app.listen(PORT, function () { return console.log("Server started from Port " + PORT); });
//# sourceMappingURL=index.js.map