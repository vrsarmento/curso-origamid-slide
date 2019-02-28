export default class Slide {
	constructor(slide, wrapper) {
		this.slide = document.querySelector(slide);
		this.wrapper = document.querySelector(wrapper);
		this.distances = { finalPosition: 0, startX: 0, movement: 0 };
	}

	bindEvents() {
		this.onStart = this.onStart.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onEnd = this.onEnd.bind(this);
	}

	updatePosition(clientX) {
		this.distances.movement = (this.distances.startX - clientX) * 1.6;
		return this.distances.finalPosition - this.distances.movement;
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

	changeSlide(index) {
		const activeSlide = this.slideArray[index];
		this.moveSlide(activeSlide.position);
		this.slidesIndexNav(index);
		this.distances.finalPosition = activeSlide.position;
	}

	init() {
		this.bindEvents();
		this.addSlideEvents();
		this.slidesConfig();
		this.changeSlide(3);
		return this;
	}
}