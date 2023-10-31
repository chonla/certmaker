import { rgb } from "https://cdn.skypack.dev/pdf-lib@^1.17.1?dts";
import { Color } from "./color.ts";
import { assertEquals } from "https://deno.land/std@0.204.0/assert/assert_equals.ts";
import { assertThrows } from "https://deno.land/std@0.204.0/assert/assert_throws.ts";

Deno.test('RGB color parsing', () => {
    const color = new Color();
    const expectedRGB = rgb(171 / 255, 205 / 255, 239 / 255);

    const result = color.parseRGB('ABCDEF');

    assertEquals(result, expectedRGB);
});

Deno.test('RGB color with # parsing', () => {
    const color = new Color();
    const expectedRGB = rgb(171 / 255, 205 / 255, 239 / 255);

    const result = color.parseRGB('#ABCDEF');

    assertEquals(result, expectedRGB);
});

Deno.test('RGBA color parsing', () => {
    const color = new Color();
    const expectedRGB = rgb(171 / 255, 205 / 255, 239 / 255);

    const result = color.parseRGB('ABCDEF00');

    assertEquals(result, expectedRGB);
});

Deno.test('RGBA color with # parsing', () => {
    const color = new Color();
    const expectedRGB = rgb(171 / 255, 205 / 255, 239 / 255);

    const result = color.parseRGB('#ABCDEF00');

    assertEquals(result, expectedRGB);
});

Deno.test('Invalid RGB color parsing', () => {
    const color = new Color();

    assertThrows(() => {
        color.parseRGB('BCDEFG');
    });
});

Deno.test('Invalid RGB with # color parsing', () => {
    const color = new Color();

    assertThrows(() => {
        color.parseRGB('#BCDEFG');
    });
});

Deno.test('Invalid RGBA color parsing', () => {
    const color = new Color();

    assertThrows(() => {
        color.parseRGB('BCDEFG00');
    });
});

Deno.test('Invalid RGBA with # color parsing', () => {
    const color = new Color();

    assertThrows(() => {
        color.parseRGB('#BCDEFG00');
    });
});