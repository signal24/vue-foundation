/*///////////////////////////////////////////////
Number Prototype Functions
///////////////////////////////////////////////*/
Number.prototype.format = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
