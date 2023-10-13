import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { PDFDocument, PageSizes } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';
import { FontDiscovery } from "../services/google-fonts/discovery.ts";
import fontkit from 'npm:@pdf-lib/fontkit';
import { FALLBACK_FONT, PIXEL_PER_INCH } from "../constants/config.ts";

export async function getCert(ctx: Context) {
    // PDF pixel density is 72 pixel-per-inch.
    // A4 paper height in landscape mode is 8.27 inch
    // convert desired font size to pixel use size * 72;
    const fallbackFontSize = 0.7 * PIXEL_PER_INCH;

    const recipient = ctx.request.url.searchParams.get('recipient');
    const font = ctx.request.url.searchParams.get('font');
    const certTemplate = ctx.request.url.searchParams.get('template');
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

    let x;
    if (positionX === null) {
        // x is omitted, put it center
        x = (page.getWidth() - baseFont.widthOfTextAtSize(recipient, fontSize)) / 2;
    } else {
        x = Number.parseInt(positionX, 10);
    }
    page.drawText('Creating PDFs in Deno is awesome!', {
        x: x,
        y: 300,
        size: fontSize,
        font: baseFont
    });

    // Save the PDFDocument and write it to a file
    const pdfBytes = await certDoc.save();

    ctx.response.headers.set('Content-type', 'application-pdf');
    ctx.response.headers.set('Content-disposition', 'attachment; filename=certificate.pdf');
    ctx.response.body = pdfBytes;
}