Element.prototype.onEvent = function (name, action) {
    this.addEventListener(name, action, { passive: false });
    return this;
};

Element.prototype.offEvent = function (name, action) {
    this.removeEventListener(name, action, { passive: false });
    return this;
};

Element.prototype.getAttr = function (name) {
    return this.getAttribute(name);
}

Element.prototype.offAttr = function (name) {
    this.removeAttribute(name);
}

Element.prototype.onAttr = function (name, value) {
    this.setAttribute(name, value);
    return this;
}

Element.prototype.isAttr = function (name) {
    return this.hasAttribute(name);
}

Element.prototype.setW = function (value) {
    this.style.width = value + (typeof value === 'number' ? 'px' : '');
    return this;
}

Element.prototype.setH = function (value) {
    this.style.height = value + (typeof value === 'number' ? 'px' : '');
    return this;
}

Element.prototype.setWH = function (width, height) {
    this.style.width = width + (typeof width === 'number' ? 'px' : '');
    this.style.height = height + (typeof height === 'number' ? 'px' : '');
    return this;
}

Element.prototype.setArgs = function (args) {
    if (!args) return;
    let opt = Object.keys(args);
    for (var i = 0; i < opt.length; i++) {
        let f = args[opt[i]];
        this.style[opt[i]] = (typeof f === 'number' ? f + 'px' : f);
    }

    return this;
}

Element.prototype.offCss = function (name) {
    if (this.classList)
        this.classList.remove(name);
    else {
        let c = this.className.split(' ');
        let index = c.indexOf(name);
        if (index > -1) {
            c.splice(index, 1);
            this.className = c.join(' ');
        }
    }
    return this;
}

Element.prototype.onCss = function (name) {
    if ('classList' in this)
        this.classList.add(name);
    else {
        let c = this.className.split(' ');
        if (c.indexOf(name) == -1) {
            c.push(name);
            this.className = c.join(' ');
        }
    }
    return this;
}

Object.prototype.collection = function (action) {
    if (this == null || this.length == 0) return;
    for (var i = 0; i < this.length; i++) {
        action(this[i], i);
    }
    return this;
};
