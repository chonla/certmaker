import { FontDiscovery } from "./discovery.ts";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { assertEquals } from "https://deno.land/std@0.204.0/assert/mod.ts";
import * as base64 from "https://deno.land/std@0.204.0/encoding/base64.ts";

Deno.test('font discovery', async (t: Deno.TestContext) => {
    mf.install();

    const targetFontName = 'some_font_name';
    const fontData = 'font_data';
    const expectedFontData = new ArrayBuffer(fontData.length);
    const buf = new Uint8Array(expectedFontData);
    for (let i = 0, dataLen = fontData.length; i < dataLen; i++) {
        buf[i] = fontData.charCodeAt(i);
    };

    const discovery = new FontDiscovery('fallback_font_name');

    await t.step('successful discovery - should get font data from font url in css', async () => {
        mf.mock(`GET@/css2`, (req: Request, _params) => {
            if (req.url.endsWith('?family=some_font_name:wght@400&display=swap')) {
                return new Response('src: url(http://actual_font_url.local/desired_font)', { status: 200 });
            }
            throw new Error('unexpected font request querystring');
        });
        mf.mock('GET@/desired_font', (_res, _params) => {
            return new Response(fontData, { status: 200 });
        });

        const result = await discovery.discover(targetFontName);

        assertEquals(base64.encodeBase64(result), base64.encodeBase64(expectedFontData));
    });

    await t.step('failed discovery - should get font data from fallback font', async () => {
        mf.mock(`GET@/css2`, (req: Request, _params) => {
            if (req.url.endsWith('?family=some_font_name:wght@400&display=swap')) {
                return new Response('no such font!', { status: 404 });
            }
            if (req.url.endsWith('?family=fallback_font_name:wght@400&display=swap')) {
                return new Response('src: url(http://actual_font_url.local/fallback_font)', { status: 200 });
            }
            throw new Error('unexpected font request querystring');
        });
        mf.mock('GET@/fallback_font', (_res, _params) => {
            return new Response(fontData, { status: 200 });
        });

        const result = await discovery.discover(targetFontName);

        assertEquals(base64.encodeBase64(result), base64.encodeBase64(expectedFontData));
    });

    mf.reset();
    mf.uninstall();
});