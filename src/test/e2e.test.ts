import { AddressInfo } from "net"
import path from "path"
import { createServer, ViteDevServer } from "vite"
import { describe, expect, beforeEach, it, afterEach } from 'vitest'
import puppeteer, { Browser } from 'puppeteer';
describe('there is a server', () => {
    let server: ViteDevServer
    let port: number
    let browser: Browser
    beforeEach(async () => {
        browser = await puppeteer.launch();
        server = await createServer({
            // any valid user config options, plus `mode` and `configFile`
            configFile: path.resolve(__dirname, './fixture/basic/vite.config.ts'),
            server: {
                host: '127.0.0.1',
                port: 1337,
            }
        })
    
        await server.listen()
    
        // server.printUrls()
        // console.log(server)
        port = (server.httpServer!.address() as AddressInfo).port
    })

    it('test', async () => {
        expect(port).toBeDefined()

        const page = await browser.newPage();
        await page.goto(`http://127.0.0.1:${port}/`);

        await page.waitForFunction('document.querySelector(\'title\') != null')

        expect(typeof (await page.content()) === 'string').toBeTruthy()
        expect(await page.content()).contains('Hello World')

        await page.close()
    })

    afterEach(async () => {
        await server.close()
        await browser.close();
    })
})
