import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { PDFDocument, PageSizes } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';
import { FontDiscovery } from "../services/google-fonts/discovery.ts";
import fontkit from 'npm:@pdf-lib/fontkit';

export async function getCert(ctx: Context) {
    const fontDiscovery = new FontDiscovery();
    const fontData = await fontDiscovery.discover('Noto Sans Thai Looped');
    
    // Create a new PDFDocument
    const certDoc = await PDFDocument.create();
    certDoc.registerFontkit(fontkit);
    const baseFont = await certDoc.embedFont(fontData);
    
    // Add a page to the PDFDocument and draw some text
    const backgroundDataBytes = await Deno.readFileSync('empty-cert.png')
    const backgroundImage = await certDoc.embedPng(backgroundDataBytes)
    const backgroundDimensions = backgroundImage.scale(0.24);
    
    const page = certDoc.addPage([PageSizes.A4[1], PageSizes.A4[0]]);
    
    page.drawImage(backgroundImage, {
        x: (page.getWidth() - backgroundDimensions.width) / 2,
        y: (page.getHeight() - backgroundDimensions.height) / 2,
        width: backgroundDimensions.width,
        height: backgroundDimensions.height
    });
    
    page.setFont(baseFont);
    page.drawText('Creating PDFs in Deno is awesome!', {
        x: 100,
        y: 300,
    });
    
    // Save the PDFDocument and write it to a file
    const pdfBytes = await certDoc.save();
    
    ctx.response.headers.set('Content-type', 'application-pdf');
    ctx.response.headers.set('Content-disposition', 'attachment; filename=certificate.pdf');
    ctx.response.body = pdfBytes;
}