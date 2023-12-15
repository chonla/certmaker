import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { exists } from "https://deno.land/std@0.209.0/fs/exists.ts";

export async function getTemplate(ctx: Context) {
    const templateName = ctx.params?.templateName;
    let templateDataBytes: Uint8Array;
    if (templateName) {
        templateDataBytes = await Deno.readFile(`templates/empty-cert.png`);
    } else {
        const isReadableFile = await exists(`templates/${templateName}.png`, {
            isReadable: true,
            isFile: true
        });
        if (isReadableFile) {
            templateDataBytes = await Deno.readFile(`templates/${templateName}.png`);
        } else {
            templateDataBytes = await Deno.readFile(`templates/empty-cert.png`);
        }
    }

    ctx.response.headers.set('Content-type', 'image/png');
    ctx.response.headers.set('Content-disposition', 'attachment; filename=background.png');
    ctx.response.body = templateDataBytes;
}