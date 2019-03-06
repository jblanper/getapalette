export default class Color {
    constructor (r, g, b, alpha = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = alpha;
    }

    reset () {
        this.r = this.initial.r;
        this.g = this.initial.g;
        this.b = this.initial.b;
        this.a = this.initial.a;
    }

    get rgb () {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    toBW (method = 'luminosity') {
        let bwValue;

        switch (method) {
            case 'luminosity':
                bwValue = Math.round(
                    (this.r * .2126) + (this.g * .7152) + (this.b * .0722)
                );
                break;
            case 'average':
                bwValue = Math.round((this.r + this.g + this.b) / 3);
                break;
            case 'lightness':
                bwValue = Math.round(
                    (Math.max(this.r, this.g, this.b) +
                    Math.max(this.r, this.g, this.b)) / 2
                );
                break;
            default:
                throw Error(`Incorrect method: "${method}"`);
        }

        this.r = this.g = this.b = bwValue;
    }

    rgbToHsl() {
        // https://gist.github.com/mjackson/5311256
        // http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
        let r = this.r, g = this.g, b = this.b;
        r /= 255, g /= 255, b /= 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        // get luminance
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            // get saturation depending on luminance
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            // get hue depending of max rgb channel
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        // adapt values
        h = Math.round(this.h * 360);
        s = Math.round(this.s * 100);
        l = Math.round(this.l * 100);

        return [ h, s, l ];
    }
}
