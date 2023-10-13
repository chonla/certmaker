import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { PDFDocument, PageSizes } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';
import { FontDiscovery } from "../services/google-fonts/discovery.ts";
import fontkit from 'npm:@pdf-lib/fontkit';
import { FALLBACK_FONT, PIXEL_PER_INCH } from "../constants/config.ts";

export async function getCert(ctx: Context) {
    // PDF pixel density is 72 pixel-per-inch.
    // A4 paper height in landscape mode is 8.27 inch
    // convert desired font size to pixel use size * 72;
    const fallbackFontSize = 0.5 * PIXEL_PER_INCH;
    const fallbackTemplate = 'empty-cert';

    const recipient = ctx.request.url.searchParams.get('recipient') || `Recipient's Name`;
    const font = ctx.request.url.searchParams.get('font');
    const certTemplate = ctx.request.url.searchParams.get('template') || fallbackTemplate;
    const fontSizeQuery = ctx.request.url.searchParams.get('fontsize') || `${fallbackFontSize}`;
    const positionX = ctx.request.url.searchParams.get('x');
    const positionY = ctx.request.url.searchParams.get('y');

    const fontDiscovery = new FontDiscovery(FALLBACK_FONT);
    const fontData = await fontDiscovery.discover(font || FALLBACK_FONT);
    const fontSize = Number.parseInt(fontSizeQuery, 10);

    // Create a new PDFDocument
    const certDoc = await PDFDocument.create();
    certDoc.registerFontkit(fontkit);
    const baseFont = await certDoc.embedFont(fontData);

    // Add a page to the PDFDocument and draw some text
    const backgroundDataBytes = await Deno.readFileSync(`${certTemplate}.png`);
    const backgroundImage = await certDoc.embedPng(backgroundDataBytes);
    const backgroundDimensions = backgroundImage.scale(1);

    const page = certDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);

    page.drawImage(backgroundImage, {
        x: (page.getWidth() - backgroundDimensions.width) / 2,
        y: (page.getHeight() - backgroundDimensions.height) / 2,
        width: backgroundDimensions.width,
        height: backgroundDimensions.height
    });

    // estimate where to put recipient's name
    let x;
    let y;
    if (positionX === null) {
        // x is omitted, put it center
        const textWidth = baseFont.widthOfTextAtSize(recipient, fontSize);
        x = Math.round((page.getWidth() - textWidth) / 2);
    } else {
        x = Number.parseInt(positionX, 10);
    }
    if (positionY === null) {
        // y is omitted, put it center
        const textHeight = baseFont.heightAtSize(fontSize);
        y = Math.round((page.getHeight() - textHeight) / 2);
    } else {
        y = Number.parseInt(positionY, 10);
    }
    page.drawText(recipient, {
        x: x,
        y: y,
        size: fontSize,
        font: baseFont
    });

    // Save the PDFDocument and write it to response
    const pdfBytes = await certDoc.save();
    ctx.response.headers.set('Content-type', 'application-pdf');
    ctx.response.headers.set('Content-disposition', 'attachment; filename=certificate.pdf');
    ctx.response.body = pdfBytes;
}