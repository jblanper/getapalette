export default class Palette {
    constructor ({ctx, data}) {
        this.ctx = ctx;
        this.data = data;

        this.width = (window.innerHeight < window.innerWidth) 
            ? window.innerHeight
            : window.innerWidth;
        this.index = 3;

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
            this.offsets[this.index],
            this.offsets[this.index]
        );

        this.data[this.index].forEach((color, i) => {
            const x = (i % this.rowNums[this.index]) *
                this.cellSizes[this.index];
            const y = Math.floor(i / this.rowNums[this.index]) *
                this.cellSizes[this.index];

            this.ctx.fillStyle = color.rgb;
            this.ctx.fillRect(
                x, y,
                this.cellSizes[this.index],
                this.cellSizes[this.index]
            );
        });
        this.ctx.restore()
    }
}
