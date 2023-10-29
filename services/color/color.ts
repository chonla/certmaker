import { RGB, rgb } from 'https://cdn.skypack.dev/pdf-lib@^1.17.1?dts';
import { decodeHex } from "https://deno.land/std@0.204.0/encoding/hex.ts";

export class Color {
    parseRGB(rgbColor: string): RGB {
        if (!/[0-9a-f]{6}/i.test(rgbColor)) {
            throw new Error('invalid rgb color');
        }

        const rr = rgbColor.substring(0, 2);
        const gg = rgbColor.substring(2, 4);
        const bb = rgbColor.substring(4, 6);

        const r = (decodeHex(rr).at(0) || 0)/ 255;
        const g = (decodeHex(gg).at(0) || 0)/ 255;
        const b = (decodeHex(bb).at(0) || 0)/ 255;

        return rgb(r, g, b);
    }
}