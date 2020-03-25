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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const playwright = __importStar(require("playwright"));
const opt = __importStar(require("optimist"));
let argv = opt.demand(['u'])
    .alias('u', 'url')
    .alias('b', 'browser')
    .alias('t', 'timeout')
    .default('browser', 'chromium')
    .default('timeout', 10000)
    .argv;
(() => __awaiter(void 0, void 0, void 0, function* () {
    let browserType;
    if (argv.browser == 'chromium') {
        browserType = playwright.chromium;
    }
    else if (argv.browser == 'firefox') {
        browserType = playwright.firefox;
    }
    else if (argv.browser == 'webkit') {
        browserType = playwright.webkit;
    }
    else {
        return;
    }
    try {
        let browser = yield browserType.launch(), context = yield browser.newContext(), page = yield context.newPage();
        page.setDefaultTimeout(argv.timeout);
        yield page.goto(argv.url, {
            waitUntil: "domcontentloaded"
        });
        page.on('pageerror', (error) => {
            console.log(error.message);
            process.exit(1);
        });
        let html = yield page.content();
        console.log(html);
        yield browser.close();
    }
    catch (e) {
        console.log(e.message);
        process.exit(1);
    }
    process.exit(0);
}))();
