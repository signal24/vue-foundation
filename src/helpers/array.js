Object.defineProperty(Array.prototype, 'remove', {
    enumerable: false,
    value: function(element) {
        let index = this.indexOf(element);
        index > -1 && this.splice(index, 1);
    }
});

Object.defineProperty(Array.prototype, 'replace', {
    enumerable: false,
    value: function(element, replacement) {
        let index = this.indexOf(element);
        index > -1 && this.splice(index, 1, replacement);
    }
});

Object.defineProperty(Array.prototype, 'first', {
    enumerable: false,
    value: function() {
        return this[0] || undefined;
    }
});

Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    value: function() {
        return this.length ? this[this.length - 1] : undefined;
    }
});