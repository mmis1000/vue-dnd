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

    it('the browser is up', async () => {
        expect(port).toBeDefined()

        const page = await browser.newPage();
        await page.goto(`http://127.0.0.1:${port}/`);

        expect(await page.content()).contains('Hello World')

        await page.close()
    })

    it('Drag and drop succeeded', async () => {
        const page = await browser.newPage();
        await page.goto(`http://127.0.0.1:${port}/native/index.html`, { waitUntil: 'networkidle2' });

        const oldBucket = await page.evaluate(function () {
            return document.getElementById('ball-0')?.parentElement?.id
        })

        expect(oldBucket).toBe('bucket-0')

        await page.evaluate(async function () {
            const dataTransfer = new DataTransfer()
            document.getElementById('ball-0')!.dispatchEvent(new DragEvent('dragstart', {
                dataTransfer
            }))
            await new Promise(r => setTimeout(r, 0))
            document.getElementById('bucket-1')!.dispatchEvent(new DragEvent('dragenter', {
                dataTransfer
            }))
            document.getElementById('bucket-1')!.dispatchEvent(new DragEvent('dragover', {
                dataTransfer
            }))
            await new Promise(r => setTimeout(r, 0))
            document.getElementById('bucket-1')!.dispatchEvent(new DragEvent('drop', {
                dataTransfer
            }))
            await new Promise(r => setTimeout(r, 0))
        })

        const bucket = await page.evaluate(async function () {
            return document.getElementById('ball-0')?.parentElement?.id
        })

        expect(bucket).toBe('bucket-1')

        await page.close()
    })

    it('Drag and drop succeeded', async () => {
        const page = await browser.newPage();
        await page.goto(`http://127.0.0.1:${port}/pointer/index.html`, { waitUntil: 'networkidle2' });

        const oldBucket = await page.evaluate(function () {
            return document.getElementById('ball-0')?.parentElement?.id
        })

        expect(oldBucket).toBe('bucket-0')

        const res = await page.evaluate(async function () {
            try {
                const oldBallPosition = document.getElementById('ball-0')!.getBoundingClientRect()

                const mouseId = 0
                const mouseX = oldBallPosition.left + oldBallPosition.width / 2
                const mouseY = oldBallPosition.top + oldBallPosition.height / 2

                const targetBoxPosition = document.getElementById('bucket-1')!.getBoundingClientRect()

                const targetMouseX = targetBoxPosition.left + targetBoxPosition.width / 2
                const targetMouseY = targetBoxPosition.top + targetBoxPosition.height / 2

                document.getElementById('ball-0')!.dispatchEvent(new PointerEvent('pointerdown', {
                    pointerId: mouseId,
                    clientX: mouseX,
                    clientY: mouseY
                }))

                await new Promise(r => setTimeout(r, 0))

                document.getElementById('ball-0')!.dispatchEvent(new PointerEvent('pointermove', {
                    pointerId: mouseId,
                    clientX: (mouseX + targetMouseX) / 2,
                    clientY: (mouseY + targetMouseY) / 2
                }))

                await new Promise(r => setTimeout(r, 0))

                document.getElementById('ball-0')!.dispatchEvent(new PointerEvent('pointermove', {
                    pointerId: mouseId,
                    clientX: targetMouseX,
                    clientY: targetMouseY
                }))

                await new Promise(r => setTimeout(r, 0))

                document.getElementById('ball-0')!.dispatchEvent(new PointerEvent('pointerup', {
                    pointerId: mouseId,
                    clientX: targetMouseX,
                    clientY: targetMouseY
                }))

                await new Promise(r => setTimeout(r, 0))
                return { tag: 'succeed', mouseX,  mouseY, targetMouseX, targetMouseY}
            } catch (err) {
                return 'failed'
            }
        })

        const bucket = await page.evaluate(async function () {
            return document.getElementById('ball-0')?.parentElement?.id
        })

        expect(bucket).toBe('bucket-1')

        await page.close()
    })


    afterEach(async () => {
        await server.close()
        await browser.close();
    })
})