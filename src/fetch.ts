import * as playwright from 'playwright';
import * as opt from 'optimist';

let argv = opt.demand(['u'])
    .alias('u', 'url')
    .alias('b', 'browser')
    .alias('t', 'timeout')
    .default('browser', 'chromium')
    .default('timeout', 10000)
    .argv;

(async () => {
    let browserType;

    if (argv.browser == 'chromium') {
        browserType = playwright.chromium;
    } else if (argv.browser == 'firefox') {
        browserType = playwright.firefox;
    } else if (argv.browser == 'webkit') {
        browserType = playwright.webkit;
    } else {
        return;
    }

    try {
        let browser = await browserType.launch(),
            context = await browser.newContext(),
            page = await context.newPage();

        page.setDefaultTimeout(argv.timeout);

        await page.goto(argv.url, {
            waitUntil: "domcontentloaded"
        });

        page.on('pageerror', (error: Error) => {
            console.log(error.message);
            process.exit(1);
        })

        let html = await page.content();
        console.log(html);

        await browser.close();
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
    
    process.exit(0);
})();
