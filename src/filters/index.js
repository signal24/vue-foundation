import app from '../app';

const filterFns = {
    bytes(value) {
        var i = Math.floor( Math.log(value) / Math.log(1024) );
        return (value / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
    },

    dash(value) {
        return value !== null && value !== undefined && String(value).length ? value : '-';
    },

    dashZeros(value) {
        return value ? value : '-';
    },

    grammarcase(value) {
        return value ? value.grammarcase() : null;
    },

    lowercase(value) {
        return value ? value.toLowerCase() : null;
    },

    number(value) {
        if (value === null || !/^[0-9]+$/.test(value)) return value;
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    phone(value) {
        if (!value) return value;
        let cleanValue = value.replace(/[^0-9]/g, '').replace(/^1/, '');
        if (cleanValue.length != 10) return value;
        return '(' + cleanValue.substr(0, 3) + ') ' + cleanValue.substr(3, 3) + '-' + cleanValue.substr(6);
    },

    ucfirst(value) {
        return value ? value.ucfirst() : null;
    },

    ucwords(value) {
        return value ? value.ucwords() : null;
    },

    uppercase(value) {
        return value ? value.toUpperCase() : null;
    },

    unsnake(value) {
        return value ? value.unsnake() : null;
    },

    usCurrency(value) {
        return '$' + Number(value).toFixed(3).replace(/0$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
};

function registerFilters(filters) {
    for (let filterName of Object.keys(filters)) {
        registerFilter(filterName, filters[filterName]);
    }
}

function registerFilter(name, fn) {
    filterFns[name] = fn;
}

app.config.globalProperties.$filter = (value, ...filters) => {
    for (let filter of filters) {
        value = filterFns[filter](value);
    }

    return value;
};

export {
    registerFilter,
    registerFilters
};