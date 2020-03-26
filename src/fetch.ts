import * as playwright from 'playwright';
import * as opt from 'optimist';
import { BrowserTypeLaunchOptions } from 'playwright';
import { writeFileSync } from 'fs';

let argv = opt.demand(['u'])
    .alias('u', 'url')
    .alias('d', 'debug')
    .alias('b', 'browser')
    .alias('t', 'timeout')
    .alias('f', 'file')
    .boolean('d')
    .default('debug', false)
    .default('browser', 'chromium')
    .default('timeout', 10000)
    .argv;

(async () => {
    let options: BrowserTypeLaunchOptions = {}, browserType;

    if (argv.debug) {
        options.dumpio = true;
    }

    try {
        if (argv.browser == 'chromium') {
            options.args = ['--no-sandbox', '--disable-setuid-sandbox'];
            browserType = playwright.chromium;
        } else if (argv.browser == 'firefox') {
            browserType = playwright.firefox;
        } else if (argv.browser == 'webkit') {
            browserType = playwright.webkit;
        } else {
            return;
        }

        let browser = await browserType.launch(options),
            context = await browser.newContext(),
            page = await context.newPage();

        context.setDefaultTimeout(argv.timeout);

        await page.goto(argv.url, {
            waitUntil: "domcontentloaded"
        });

        page.on('pageerror', (error: Error) => {
            console.error(error.message);
            process.exit(1);
        })

        let html = await page.content();

        if (argv.file) {
            writeFileSync(argv.file, html);
            console.log('Html content has been written to ' + argv.file);
        } else {
            console.log(html);
        }

        await browser.close();
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
    
    process.exit(0);
})();
