export default class CachedImage {
    constructor ({url, width = null}) {
        this.url = url;
        this.width = width;

        this.img;
        this.height;
        this.cachedCtx;
    }

    init () {
        return this.setImg()
        .then(msg => {
            console.log(msg)

            this.setCachedImg();
            
            return 'Created cached image and got its data';
        }).catch(errorMsg => console.log(errorMsg));
    }

    setImg () {
        return new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.src = this.url;

            this.img.onload = _ => resolve(`"${this.img.src}" loaded`);
            this.img.onerror = _ => reject(`Error loading "${this.img.src}"`);
        });
    }

    setCachedImg () {
        this.setImgSize();

        // fake canvas to load image
        this.cachedCtx = Object.assign(
            document.createElement('canvas'),
            {width: this.width, height: this.height}
        ).getContext('2d');

        this.cachedCtx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    setImgSize () {
        const imgRatio = this.img.height / this.img.width;

        if (this.width) {
            this.height = this.width * imgRatio;
        }
        else {
            const browserRatio = window.innerHeight / window.innerWidth;

            if (browserRatio < imgRatio) {
                this.width = window.innerHeight / imgRatio;
                this.height = window.innerHeight;
            }
            else {
                this.width = window.innerWidth;
                this.height = window.innerWidth * imgRatio;
            }
        }
    }
}
