export class FontDiscovery {
    constructor() {

    }

    async discover(fontName: string): Promise<ArrayBuffer> {
        const escapedFontName = fontName.replaceAll(' ', '+');
        const fontCSSURL = `https://fonts.googleapis.com/css2?family=${escapedFontName}:wght@400&display=swap`;
        const fontCSS = await fetch(fontCSSURL);
        const cssData = await fontCSS.text();
        const fontURLMatch = /src: url\(([^\)]+)\)/.exec(cssData);
        if (!!fontURLMatch && fontURLMatch.length > 1) {
            const fontURL = fontURLMatch[1];
            const fontDataResponse = await fetch(fontURL);
            const fontDataBinary = await fontDataResponse.arrayBuffer();
            return Promise.resolve(fontDataBinary);
        }
        return Promise.reject('No font data found');
    }
}