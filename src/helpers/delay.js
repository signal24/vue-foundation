import app from '../app';

app.config.globalProperties.$delay = ms => new Promise(resolve => setTimeout(resolve, ms));
