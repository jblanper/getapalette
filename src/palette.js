export default class Palette {
    constructor ({ctx, data}) {
        this.ctx = ctx;
        this.data = data;

        this.width = (window.innerHeight < window.innerWidth) 
            ? window.innerHeight
            : window.innerWidth;
        this.factor = 2;

        this.cellSizes = [];
        this.offsets = [];
        this.rowNums = [];

        this.setPaletteSizes();
    }

    setPaletteSizes () {
        this.data.forEach(palette => {
            const rowNum = Math.round(
                Math.sqrt(palette.length)
            );
            const cellSize = Math.floor(this.width / rowNum);
            const offset = Math.floor(
                (this.width - (cellSize * rowNum)) / 2
            );

            this.rowNums.push(rowNum);
            this.cellSizes.push(cellSize);
            this.offsets.push(offset);
        });
    }

    changeCanvasSize () {
        if ((this.ctx.canvas.width !== this.width) ||
            (this.ctx.canvas.width !== this.ctx.canvas.height)) {

            this.ctx.canvas.width = this.width;
            this.ctx.canvas.height = this.width;
        }
    }

    clear() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.strokeStyle = '#ccc';
        this.ctx.strokeRect(0, 0, this.width, this.width)
    }

    draw () {
        this.changeCanvasSize();
        this.clear();
        this.ctx.save();
        this.ctx.translate(
            this.offsets[this.factor],
            this.offsets[this.factor]
        );

        this.data[this.factor].forEach((color, i) => {
            const x = (i % this.rowNums[this.factor]) *
                this.cellSizes[this.factor];
            const y = Math.floor(i / this.rowNums[this.factor]) *
                this.cellSizes[this.factor];

            this.ctx.fillStyle = color.rgb;
            this.ctx.fillRect(
                x, y,
                this.cellSizes[this.factor],
                this.cellSizes[this.factor]
            );
        });
        this.ctx.restore()
    }

    copyColorsToClipboard () {
        // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
        console.log(this.data, this.factor)
        const el = document.createElement('textarea');
        el.value = this.data[this.factor].map(c => c.rgb).join(', ');
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

}
