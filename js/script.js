import SlideNav from './slide.js';

const slide = new SlideNav('.slide', '.slide-wrapper', 0, true, '.custom-controls');
slide.init();
slide.addArrow('.prev', '.next');
