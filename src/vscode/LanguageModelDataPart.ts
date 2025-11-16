export class LanguageModelDataPart {
    mimeType: string;
    data: Uint8Array;

    constructor(data: Uint8Array, mimeType: string) {
        this.mimeType = mimeType;
        this.data = data;
    }

    static image(data: Uint8Array, mimeType: string): LanguageModelDataPart {
        return new LanguageModelDataPart(data, mimeType);
    }

    static json(value: object, mime: string = 'text/x-json'): LanguageModelDataPart {
        const textEncoder = new TextEncoder();
        const rawStr = JSON.stringify(value, undefined, '\t');
        return new LanguageModelDataPart(textEncoder.encode(rawStr), mime);
    }

    static text(value: string, mime: string = 'text/plain'): LanguageModelDataPart {
        const textEncoder = new TextEncoder();
        return new LanguageModelDataPart(textEncoder.encode(value), mime);
    }

    toJSON() {
        return {
            mimeType: this.mimeType,
            data: this.data,
        };
    }
}
