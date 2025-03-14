'use strict';

import puppeteer from 'puppeteer';
import cluster from 'cluster';
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { sessions, links, seconds, proxy, userName, password } = require('./config.json');

(async () => {
    let tries = 0;
    for (let index = 0; index < sessions; index++) {
        if (!cluster.isWorker) {
            cluster.fork();
        } else {
            while (true) {
                tries++;
                const browser = await puppeteer.launch({
                    headless: true,
                    args: (proxy && userName && password) ? [
                        `--proxy-server=${proxy}`
                    ] : []
                });
                const context = await browser.createIncognitoBrowserContext();
                const page = await context.newPage();
                page.setDefaultNavigationTimeout(0);
                if (proxy && userName && password) {
                    await page.authenticate({
                        username: userName,
                        password: password
                    });
                }
                await page.setRequestInterception(true);

                await page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Mobile Safari/537.36');

                page.on('request', request => {
                    const url = request.url();
                    
                    // Filter out image and font requests
                    if (request.resourceType() === 'image' || request.resourceType() === 'font' || request.resourceType() === 'stylesheet') {
                        request.abort();
                    } else {
                        request.continue();
                    }
                });

                try {
                    var randReqUrls = shuffle(links);
                    for (var i = 0; i < randReqUrls.length; i++) {
                        const now = new Date().toLocaleTimeString();
                        await page.goto(randReqUrls[i], { waitUntil: 'networkidle2' });
                        await page.waitForTimeout(seconds * 1000);
                        console.log(`[${now}] ${randReqUrls[i]}`);
                    }

                } catch (err) {
                    console.log("Couldn't fetch page " + err);
                }

                await browser.close();
            }
        }
    }

})();

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
