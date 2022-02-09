import VueStash from 'vue-stash-nested';

import app from '../app';
app.use(VueStash);

import InfiniteScroll from './infinite-scroll';
app.use(InfiniteScroll);

import ResizeWatcher from './resize-watcher';
app.use(ResizeWatcher);
