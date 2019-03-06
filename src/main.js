import Sketch from './sketch.js';

function main () {
    const canvas = document.querySelector('#sketch');
    const ctx = canvas.getContext('2d');

    const sketch = new Sketch(ctx);

    sketch.init().then(msg => console.log(msg)).catch(errorMsg => console.log(errorMsg));
};

main();
