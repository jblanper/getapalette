import CachedImage from './image.js';
import ImageAnalyzer from './imageAnalyzer.js';
import Palette from './palette.js';
import Menu from './ui/menu.js';

export default class Sketch {
    constructor (ctx, options) {
        this.ctx = ctx;
        this.backgroundColor = options.backgroundColor;

        this.imageUrl = options.imageUrl;
        this.imageWidth = options.imageWidth;
        this.drawingType = options.drawingType;
    }

    init ({imageUrl = this.imageUrl} = {}) {
        this.clear();

        this.cachedImg = new CachedImage({url: imageUrl, width: this.imageWidth});

        return this.cachedImg.init()
        .then(msg => {
            console.log(msg);

            // analyze image
            this.imageAnalyzer = new ImageAnalyzer(this.cachedImg.cachedCtx);

            //plotting
            this.palette = new Palette({
                ctx: this.ctx, data: this.imageAnalyzer.palettes
            });

            // other setup
            this.setBindings();

            this.draw();

            return 'Sketch initialized';
        });
    }

    setBindings () {
        const menu = new Menu({
            showOnLoad: true,
            updateFn: this.draw.bind(this),
            scope: this
        });

        menu.createComponent('description', {
            title: 'Get a palette!',
            content: ['Upload an image and generate a palette with the most representative colors. Select the option "palette" below to get the palette. Use de slider to determine the number of colors. Enjoy!']
        });

        menu.addSeparator();

        const drawingTypeSelect = menu.createComponent('select', {
            prop: 'drawingType' ,
            label: 'draw options',
            options: ['image', 'palette'],
            value: this.drawingType 
        });

        menu.addSeparator();

        // sections //
        const drawingTypeSection = menu.createComponent('section', {
            select: drawingTypeSelect,
            emptyMessage: 'No options for this section'
        });

        /// section palette ///
        const paletteDivisionSlider = menu.createComponent('slider', {
            parent: drawingTypeSection,
            label: 'palette factor',
            max: 5,
            min: 0,
            prop: 'index',
            scope: this.palette,
            value: this.palette.index
        });

        drawingTypeSection.createGroup({
            name: 'palette',
            nodes: [paletteDivisionSlider]
        });

        // end sections //
        menu.addSeparator();

        menu.createComponent('fileButton', {
            scopeOptions: 'imageUrl',
            updateFn: this.init.bind(this),
            label: 'upload IMG'
        });

        menu.createComponent('downloadButton', {
            fn: this.setPng.bind(this),
            label: 'download IMG'
        });

        menu.addSignature();
    }

    setPng () {
        const cachedCanvasCtx = Object.assign(
            document.createElement('canvas'),
            {width: this.ctx.canvas.width, height: this.ctx.canvas.height}
        ).getContext('2d');

        cachedCanvasCtx.drawImage(this.ctx.canvas, 0, 0);

        const data =  cachedCanvasCtx.canvas.toDataURL('image/png');

        const win = window.open();
        win.document.write(`<img src="${data}" />`);
    }

    drawImage () {
        this.ctx.canvas.width = this.cachedImg.width;
        this.ctx.canvas.height = this.cachedImg.height;

        this.ctx.drawImage(
            this.cachedImg.cachedCtx.canvas, 0, 0,
            this.cachedImg.width, this.cachedImg.height
        );
    }

    clear () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw () {
        switch (this.drawingType) {
            case 'image': this.drawImage(); break;
            case 'palette': this.palette.draw(); break;
        }
    }
}
