import Color from './color.js';

export default class ImageAnalyzer {
    constructor (ctx) {
        this.ctx = ctx;
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;

        this.imgData = this.ctx.getImageData(0, 0, this.width, this.height);

        this.paletteFactor = 6;
        this.palettes = [];
        this.imageColors = [];

        this.setColorsData();
        this.setPaletteData();
    }

    divideColorsByRange (colorColl) {
        let rMax = 255, rMin =0;
        let gMax = 255, gMin =0;
        let bMax = 255, bMin =0;

        colorColl.forEach(c => {
            rMin = Math.min(rMin, c.r);
            rMax = Math.max(rMax, c.r);
            gMin = Math.min(gMin, c.g);
            gMax = Math.max(gMax, c.g);
            bMin = Math.min(bMin, c.b);
            bMax = Math.max(bMax, c.b);
        });

        const rRange = rMax - rMin;
        const gRange = gMax - gMin;
        const bRange = bMax - bMin;

        let majorChannel;

        if (bRange >= rRange && bRange >= gRange) majorChannel = 'b';
        else if (gRange >= rRange && gRange >= bRange) majorChannel = 'g';
        else majorChannel = 'r';

        const orderedColl= colorColl.slice()
            .sort((a, b) => b[majorChannel] - a[majorChannel]);

        const half = Math.floor(orderedColl.length / 2);

        return [
            orderedColl.slice(0, half),
            orderedColl.slice(half, orderedColl.length)
        ];
    }

    setPaletteData () {
        let bucket = this.divideColorsByRange(this.imageColors);

        for (let i = 0; i < this.paletteFactor; i++) {
            let temp = [];
            let palette = [];

            bucket.forEach(coll => {
                palette.push(this.averageColors(coll));

                const [ bucket1, bucket2 ] = this.divideColorsByRange(coll);
                temp.push(bucket1);
                temp.push(bucket2);
            });

            this.palettes.push(palette);
            bucket = temp;
        }
    }

    setColorsData () {
        for (let i = 0; i < this.pixelsData.length; i += 4) {
            const color = new Color(...this.pixelsData.slice(i, i + 4));

            this.imageColors.push(color);
        }
    }

    averageColors (colors) {
        let rTotal = 0, gTotal = 0, bTotal = 0;

        colors.forEach(color => {
            rTotal += color.r * color.r;
            gTotal += color.g * color.g;
            bTotal += color.b * color.b;
        });

        const rAvg = Math.round(Math.sqrt(rTotal / colors.length));
        const gAvg = Math.round(Math.sqrt(gTotal / colors.length));
        const bAvg = Math.round(Math.sqrt(bTotal / colors.length));

        return new Color(rAvg, gAvg, bAvg);
    }

    get pixelsData () {
        return this.imgData.data;
    }
}
