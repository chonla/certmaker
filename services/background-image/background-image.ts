export class BackgroundImage {
    async resolve(imageUrl: string): Promise<Uint8Array> {
        const selfReferenceBase = 'https://certmaker.deno.dev/templates/';
        if (imageUrl.startsWith(selfReferenceBase)) { // self reference
            const actualImageUrl = imageUrl.substring(selfReferenceBase.length);
            return await Deno.readFile(`templates/${actualImageUrl}.png`);
        }
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            const imageDataResponse = await fetch(imageUrl);
            const imageDataBinary = await imageDataResponse.arrayBuffer();
            const imageUint8Array = new Uint8Array(imageDataBinary);
            return imageUint8Array;
        }
        return await Deno.readFile(`templates/${imageUrl}.png`);
    }
}