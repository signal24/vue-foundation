import app from '../app';

import VueStash from 'vue-stash-nested'
app.use(VueStash)

import InfiniteScroll from './infinite-scroll'
app.use(InfiniteScroll);

import ResizeWatcher from './resize-watcher'
app.use(ResizeWatcher)