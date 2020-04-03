import Vue from 'vue';

Vue.filter('bytes', value => {
    var i = Math.floor( Math.log(value) / Math.log(1024) );
    return (value / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
});

Vue.filter('dash', function(value) {
    return value !== null && value !== undefined && String(value).length ? value : '-';
});

Vue.filter('dash-zeros', function(value) {
    return value ? value : '-';
});

Vue.filter('grammarcase', function(value) {
    return value ? value.grammarcase() : null;
});

Vue.filter('lowercase', function(value) {
    return value ? value.toLowerCase() : null;
});

Vue.filter('number', function(value) {
    if (value === null || !/^[0-9]+$/.test(value)) return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

Vue.filter('phone', value => {
    let cleanValue = value.replace(/[^0-9]/g, '').replace(/^1/, '');
    if (cleanValue.length != 10) return value;
    return '(' + cleanValue.substr(0, 3) + ') ' + cleanValue.substr(3, 3) + '-' + cleanValue.substr(6);
});

Vue.filter('ucfirst', function(value) {
    return value ? value.ucfirst() : null;
});

Vue.filter('ucwords', function(value) {
    return value ? value.ucwords() : null;
});

Vue.filter('uppercase', function(value) {
    return value ? value.toUpperCase() : null;
});

Vue.filter('unsnake', function(value) {
    return value ? value.unsnake() : null;
});

Vue.filter('us-currency', value => {
    return Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});