String.prototype.escapeHtml = function() {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// this isn't implemented in Vue filters because why would you ever turn something _into_ kebab case for user display?
String.prototype.kebab = function() {
    return this.replace(/ /g, '-');
}

// TODO: what would this be used for?
String.prototype.lcfirst = function() {
    return this.substr(0, 1).toLowerCase() + this.substr(1);
}

// this isn't implemented in Vue filters because why would you ever turn something _into_ Snake case for user display?
String.prototype.snake = function() {
    return this.replace(/ /g, '_');
}

String.prototype.ucfirst = function() {
    return this.substr(0, 1).toUpperCase() + this.substr(1);
}

String.prototype.ucwords = function() {
    return this.replace(/^[a-z]| [a-z]/gi, function(value) {
        return value.toUpperCase();
    });
}

String.prototype.unsnake = function() {
    return this.replace(/_/g, ' ');
}