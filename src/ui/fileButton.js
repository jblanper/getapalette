import { html } from './html.js';

export default class FileButton {
    constructor ({
        parent, label, scopeOptions = undefined, updateFn = null,
        type = 'image'
    }) {
        this.scopeOptions = scopeOptions;
        this.updateFn = updateFn;

        this.type = type;
        this.label = label;

        this.parent = parent;
        this.node = null;
        this.input = null;

        this.render();
        this.eventListener();
    }

    render () {
        this.input = html('input', {type: 'file', id: this.prop}, null);
        this.node = html('label',
            {textContent: this.label, classes: ['file-btn']},
            [this.input]
        );

        this.parent.node.appendChild(this.node);
    }

    eventListener () {
        this.input.addEventListener('change', this.eventHandler.bind(this));
    }

    eventHandler (e) {
        const reader = new FileReader();

        reader.onload = file => {
            // either url or not yet parsed json
            const result = (this.type === 'json')
                ? JSON.parse(file.target.result)
                : file.target.result;

            const options = (this.scopeOptions)
                ? {[this.scopeOptions]: result}
                : result;

            if (this.updateFn) this.updateFn(options);
            else this.parent.updateFn(options);
        }

        if (this.type === 'image') reader.readAsDataURL(e.target.files[0]);
        if (this.type === 'json') reader.readAsText(e.target.files[0]);
    }
}
