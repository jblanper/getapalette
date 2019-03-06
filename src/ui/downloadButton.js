import { html } from './html.js';

export default class DownloadButton {
    constructor ({parent, label, fn}) {
        this.fn = fn;

        this.label = label;

        this.parent = parent;
        this.node = null;

        this.render();
        this.eventListener();
    }

    render () {
        this.node = html('button', {textContent: this.label}, null);
        this.parent.node.appendChild(this.node)
    }

    eventListener () {
        this.node.addEventListener('click', this.eventHandler.bind(this));
    }

    eventHandler (e) {
        // download function
        this.fn();
    }
}
