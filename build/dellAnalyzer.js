"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var request = require('request');
// implements 也是继承
var DellAnalyzer = /** @class */ (function () {
    function DellAnalyzer() {
    }
    DellAnalyzer.getInstance = function () {
        if (!DellAnalyzer.instance) {
            // 单例
            DellAnalyzer.instance = new DellAnalyzer();
        }
        return DellAnalyzer.instance;
    };
    // 分析内容
    DellAnalyzer.prototype.getCourseInfo = function (html) {
        // console.log("pic",title)
        var courseInfos = [];
        var $ = cheerio_1.default.load(html);
        var pic = $('.il_img'); //图片dom
        pic.map(function (index, ele) {
            var title = '图片';
            var img = $(ele).find('img').attr('src');
            var obj = {
                title: title,
                img: img,
            };
            courseInfos.push(obj);
        });
        var result = {
            data: courseInfos,
            time: new Date().getTime()
        };
        return result;
    };
    // 存储内容
    DellAnalyzer.prototype.generateJsonContent = function (content, filePath) {
        var fileContent = {};
        // 下载图片
        this.downloadImg(content);
        if (fs_1.default.existsSync(filePath)) {
            // 判断文件是否存在
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[content.time] = content.data;
        return fileContent;
    };
    // 下载图片
    DellAnalyzer.prototype.downloadImg = function (res) {
        var _this = this;
        var imgSrc = res.data;
        imgSrc.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
            var title, pathJoin, stream;
            return __generator(this, function (_a) {
                title = new Date().getTime();
                pathJoin = path_1.default.join(__dirname, "../image/" + title + ".png");
                stream = fs_1.default.createWriteStream(pathJoin);
                request("http:" + item.img).pipe(stream).on("close", function () {
                });
                return [2 /*return*/];
            });
        }); });
    };
    DellAnalyzer.prototype.analyze = function (html, filePath) {
        var content = this.getCourseInfo(html); //处理抓取的信息
        var fileContent = this.generateJsonContent(content, filePath); //下载图片
        return JSON.stringify(fileContent);
    };
    return DellAnalyzer;
}());
exports.default = DellAnalyzer;
