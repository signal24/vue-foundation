import Vue from 'vue';
import moment from 'moment';

let durationEls = [];

function updateDurations() {
    durationEls.forEach(updateDuration);
}

setInterval(updateDurations, 1000);

Vue.directive('duration', {
    bind: applyDuration,
    update: applyDuration,
    unbind: removeDuration
});

function applyDuration(el, binding) {
    if (binding.value == binding.oldValue) return;
    if (!binding.value) return removeDuration(el);

    el.$includeSeconds = typeof(el.attributes['no-seconds']) === 'undefined';

    let baseTimeAttr = el.attributes['base-time'];
    if (baseTimeAttr) {
        el.$startTs = moment(baseTimeAttr.value).valueOf() - (binding.value * 1000);
    }
    else {
        el.$startTs = moment(binding.value).valueOf();
    }

    if (!el.$isConfigured) {
        el.$isConfigured = true;
        durationEls.push(el);
    }

    updateDuration(el);
}

function updateDuration(el) {
    let ts = el.$startTs;
    let diff = Math.round((Date.now() - ts) / 1000);
    el.innerText = secondsToString(diff, el.$includeSeconds === false);
}

function removeDuration(el) {
    if (el.$isConfigured) {
        durationEls.remove(el);
        el.$isConfigured = false;
    }
    
    el.innerText = '-';
}

function secondsToString(seconds, shouldSkipSeconds) {
    let result = [];
    let days = Math.floor(seconds / 86400);
    days && result.push(days + 'd');
    seconds -= days * 86400;
    let hours = Math.floor(seconds / 3600);
    (days || hours) && result.push(hours + 'h');
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    (days || hours || minutes) && result.push(minutes + 'm');
    if (!shouldSkipSeconds) {
        seconds -= minutes * 60;
        result.push(seconds + 's');
    }
    else if (!result.length) {
        result.push('0m');
    }
    return result.join(' ');
}