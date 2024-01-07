import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { PDFDocument, PageSizes } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';
import { FontDiscovery } from "../services/google-fonts/discovery.ts";
import fontkit from 'npm:@pdf-lib/fontkit';
import { FALLBACK_FONT, PIXEL_PER_INCH } from "../constants/config.ts";
import { Color } from "../services/color/color.ts";
import { decode } from "https://deno.land/x/pngs@0.1.1/mod.ts";
import { BackgroundImage } from "../services/background-image/background-image.ts";

export async function getCert(ctx: Context) {
    const paperA4LandscapeWidthInPixel = 842;
    const fallbackFontSize = 0.5;
    const fallbackTemplate = 'empty-cert';
    const fallbackMarginLeft = 0;
    const fallbackFontColor = '000000';

    ctx.request.url.searchParams.forEach((v, k) => console.log(`${k}:${v}`));
    
    const recipient = ctx.request.url.searchParams.get('recipient') || `Recipient's Name`;
    const font = ctx.request.url.searchParams.get('font');
    const certTemplate = ctx.request.url.searchParams.get('template') || fallbackTemplate;
    const fontSizeQuery = ctx.request.url.searchParams.get('fontsize') || `${fallbackFontSize}`;
    const fontColorQuery = ctx.request.url.searchParams.get('fontcolor') || fallbackFontColor;
    const positionX = ctx.request.url.searchParams.get('x'); // in inch
    const positionY = ctx.request.url.searchParams.get('y'); // in inch
    const marginLeftQuery = ctx.request.url.searchParams.get('marginleft') || `${fallbackMarginLeft}`; // in inch

    const fontDiscovery = new FontDiscovery(FALLBACK_FONT);
    const fontData = await fontDiscovery.discover(font || FALLBACK_FONT);
    const fontSize = Number.parseFloat(fontSizeQuery) * PIXEL_PER_INCH;
    const fontColor = (new Color()).parseRGB(fontColorQuery);
    const marginleft = Number.parseFloat(marginLeftQuery) * PIXEL_PER_INCH;

    console.log(font)

    // Create a new PDFDocument
    const certDoc = await PDFDocument.create();
    certDoc.registerFontkit(fontkit);
    const baseFont = await certDoc.embedFont(fontData);

    // Add a page to the PDFDocument and draw some text
    const backgroundDataBytes = await (new BackgroundImage()).resolve(certTemplate);
    const backgroundImage = await certDoc.embedPng(backgroundDataBytes);
    const { width } = decode(backgroundDataBytes);
    const scale = paperA4LandscapeWidthInPixel / width;
    const backgroundDimensions = backgroundImage.scale(scale);

    const page = certDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);

    page.drawImage(backgroundImage, {
        x: (page.getWidth() - backgroundDimensions.width) / 2,
        y: (page.getHeight() - backgroundDimensions.height) / 2,
        width: backgroundDimensions.width,
        height: backgroundDimensions.height
    });

    // estimate where to put recipient's name
    page.moveTo(0, 0);
    let x;
    let y;
    if (!positionX) {
        // x is omitted, put it center
        const textWidth = baseFont.widthOfTextAtSize(recipient, fontSize);
        x = Math.round((page.getWidth() - textWidth - marginleft) / 2);
    } else {
        x = (Number.parseFloat(positionX) * PIXEL_PER_INCH);
    }
    if (!positionY) {
        // y is omitted, put it center
        const textHeight = baseFont.heightAtSize(fontSize);
        y = Math.round((page.getHeight() - textHeight) / 2);
    } else {
        y = Number.parseFloat(positionY) * PIXEL_PER_INCH;
    }
    page.drawText(recipient, {
        x: x + marginleft,
        y: y,
        size: fontSize,
        font: baseFont,
        color: fontColor,
    });

    // Save the PDFDocument and write it to response
    const pdfBytes = await certDoc.save();
    ctx.response.headers.set('Content-type', 'application-pdf');
    ctx.response.headers.set('Content-disposition', 'attachment; filename=certificate.pdf');
    ctx.response.body = pdfBytes;
}