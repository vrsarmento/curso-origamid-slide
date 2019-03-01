import debounce from './debounce.js';

export class Slide {
	constructor(slide, wrapper, initialSlide) {
		this.slide = document.querySelector(slide);
		this.wrapper = document.querySelector(wrapper);
		this.distances = { finalPosition: 0, startX: 0, movement: 0 };
		this.activeClass = 'active';
		this.initialSlide = initialSlide;
		this.resizeTimeout = 500;
		this.distanceToChangeSlide = 120;
	}

	updatePosition(clientX) {
		this.distances.movement = (this.distances.startX - clientX) * 1.6;
		return this.distances.finalPosition - this.distances.movement;
	}

	transition(active) {
		this.slide.style.transition = active ? 'transform .3s' : '';
	}

	moveSlide(distX) {
		this.distances.movePosition = distX;
		this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
	}

	onStart(event) {
		let moveType;
		if (event.type === 'mousedown') {
			event.preventDefault();
			this.distances.startX = event.clientX;
			moveType = 'mousemove';
		} else {
			this.distances.startX = event.changedTouches[0].clientX;
			moveType = 'touchmove';
		}
		this.wrapper.addEventListener(moveType, this.onMove);
		this.transition(false);
	}

	onMove(event) {
		const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
		const finalPosition = this.updatePosition(pointerPosition);
		this.moveSlide(finalPosition);
	}

	onEnd(event) {
		const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
		this.wrapper.removeEventListener(moveType, this.onMove);
		this.distances.finalPosition = this.distances.movePosition;
		this.transition(true);
		this.changeSlideOnEnd();
	}

	changeSlideOnEnd() {
		if (this.distances.movement > this.distanceToChangeSlide && this.index.next !== undefined) {
			this.activeNextSlide();
		} else if (this.distances.movement < -this.distanceToChangeSlide && this.index.prev !== undefined) {
			this.activePrevSlide();
		} else {
			this.changeSlide(this.index.active);
		}
	}

	addSlideEvents() {
		this.wrapper.addEventListener('mousedown', this.onStart);
		this.wrapper.addEventListener('touchstart', this.onStart);
		this.wrapper.addEventListener('mouseup', this.onEnd);
		this.wrapper.addEventListener('touchend', this.onEnd);
	}

	slidePosition(slide) {
		const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
		return -(slide.offsetLeft - margin);
	}

	slidesConfig() {
		this.slideArray = [...this.slide.children].map((element) => {
			const position = this.slidePosition(element);
			return { element, position };
		});
	}

	slidesIndexNav(index) {
		const last = this.slideArray.length - 1;
		this.index = {
			prev: index ? index - 1 : undefined,
			active: index,
			next: index === last ? undefined : index + 1
		};
	}

	changeActiveClass() {
		this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
		this.slideArray[this.index.active].element.classList.add(this.activeClass);
	}

	changeSlide(index) {
		const activeSlide = this.slideArray[index];
		this.moveSlide(activeSlide.position);
		this.slidesIndexNav(index);
		this.distances.finalPosition = activeSlide.position;
		this.changeActiveClass();
	}

	activePrevSlide() {
		if (this.index.prev !== undefined ) this.changeSlide(this.index.prev);
	}

	activeNextSlide() {
		if (this.index.next !== undefined ) this.changeSlide(this.index.next);
	}

	onResize() {
		setTimeout(() => {
			this.slidesConfig();
			this.changeSlide(this.index.active);
		}, this.resizeTimeout);
	}

	addResizeEvent() {
		window.addEventListener('resize', this.onResize);
	}

	bindEvents() {
		this.onStart = this.onStart.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onEnd = this.onEnd.bind(this);
		this.activePrevSlide = this.activePrevSlide.bind(this);
		this.activeNextSlide = this.activeNextSlide.bind(this);
		this.onResize = debounce(this.onResize.bind(this), 200);
	}

	init() {
		this.transition(true);
		this.bindEvents();
		this.addSlideEvents();
		this.slidesConfig();
		this.addResizeEvent();
		this.changeSlide(this.initialSlide);
		return this;
	}
}

export class SlideNav extends Slide {
	addArrow(prev, next) {
		this.prevElement = document.querySelector(prev);
		this.nextElement = document.querySelector(next);
		this.addArrowEvent();
	}

	addArrowEvent() {
		this.prevElement.addEventListener('click', this.activePrevSlide);
		this.nextElement.addEventListener('click', this.activeNextSlide);
	}
}