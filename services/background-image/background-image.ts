export class BackgroundImage {
    async resolve(imageUrl: string): Promise<Uint8Array> {
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            const imageDataResponse = await fetch(imageUrl);

            console.log(imageDataResponse);
            const imageDataBinary = await imageDataResponse.arrayBuffer();
            const imageUint8Array = new Uint8Array(imageDataBinary);
            return imageUint8Array;
        }
        return await Deno.readFile(`templates/${imageUrl}.png`);
    }
}