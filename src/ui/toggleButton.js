import { html } from './html.js';

export default class ToggleButton {
    constructor ({parent, prop, scope = null, updateFn = null, value, label}) {
        this.prop = prop;
        this.scope = scope;
        this.updateFn = updateFn;

        this.label = label;
        this.value = value;

        this.node = null;
        this.parent = parent;

        this.render();
        this.eventListener();
    }

    render () {
        this.node = html('button', {
            textContent: this.label, id: this.prop, classes: ['toggle']
        }, null);

        if (!this.value) this.node.classList.add('deactivated');

        this.parent.node.appendChild(this.node);
    }

    eventListener () {
        this.node.addEventListener('click', this.eventHandler.bind(this));
    }

    eventHandler (e) {
        this.node.classList.toggle('deactivated');
        this.value = !this.value

        if (this.scope) this.scope[this.prop] = this.value;
        else this.parent.scope[this.prop] = this.value;

        if (this.updateFn) this.updateFn();
        else this.parent.updateFn();
    }
}
