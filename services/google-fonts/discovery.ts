export class FontDiscovery {
    private _fallbackFontName: string;

    constructor(fallbackFontName: string) {
        this._fallbackFontName = fallbackFontName;
    }

    async discover(fontName: string): Promise<ArrayBuffer> {
        console.log('Discovering font', fontName);
        try {
            const result = await this._discover(fontName);
            console.log('Discovered!');
            return result;
        } catch (_) {
            console.error(`Specified font is missing [${fontName}], use fallback font [${this._fallbackFontName}]`);
            const result = await this._discover(this._fallbackFontName);
            return result;
        }
    }

    private async _discover(fontName: string): Promise<ArrayBuffer> {
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