// - global css
import Vue from 'vue';
import VueTouch from 'vue-touch';
import './theme/theme.scss';

// - images
require('../static/images/gil2.jpg');
require('../static/images/table-football.jpg');
require('../static/images/dunk.jpg');

/**
 *
 */
function DOMLoaded() {

	const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

	Vue.use(VueTouch);

	// TODO(done): flexible height
	// TODO(done): fallback for underlay if there is no underlay image(set from overlay)
	// TODO(done): multiple question support
	// TODO(done): hint styles
	// TODO(done): results icons styles
	// TODO: max image height
	// TODO: transition between questions
	// Hammer Pan Events: pan, panstart, panmove, panend, pancancel, panleft, panright, panup, pandown

	const swiperDefaults = {
		enablePlay: true,				// enable/disable events
		isPanLeft: false,
		isPanRight: false,
		xLimit: 150,					// - horizontal pan limit in px
		yLimit: 20,						// - vertical pan limit in px
		rLimit: 15,						// - rotate on pan limit in px
		enableSwipeX: true, 			// - default false
		enableSwipeY: true,				// - not used
		style: {}						// - inline css object
	};
	const swiper = new Vue({
		el: '#swiper',
		data: {
			...swiperDefaults,			// default params
			question: {},				// current
			answer: {},					// current
			results: {},				// current
			enablePlay: false,			// initially overrides default value
			currentIndex: 0,			// index of items to iterate data
			hint: {
				enable: false,
				isVisible: false,
				text: 'החלק לבחירה'
			},
			timeline: {
				showHintDelay: 300,
				hideHintDelay: 3000,
				questionLeaveDuration: 300,
				showResultsDuration: 3000
			},
			items: [
				{
					question: {
						active: true,
						text: '1 - זה משחק נחמד?',
						imgSrc: './static/images/dunk.jpg',
						imgSrcBack: './static/images/table-football.jpg',
						isFlexibleHeight: true
					},
					answer: {
						accept: false,
						cancel: false,
						acceptText: 'כן',
						cancelText: 'לא'
					},
					results: {
						active: false,
						correctType: 'accept',
						isCorrect: null
					}
				},
				{
					question: {
						active: true,
						text: '2 - זה משחק נחמד?',
						imgSrc: './static/images/gil2.jpg',
						imgSrcBack: './static/images/table-football.jpg',
						isFlexibleHeight: true
					},
					answer: {
						accept: false,
						cancel: false,
						acceptText: 'כן',
						cancelText: 'לא'
					},
					results: {
						active: false,
						correctType: 'accept',
						isCorrect: null
					}
				},
				{
					question: {
						active: true,
						text: '3 - זה משחק נחמד?',
						imgSrc: './static/images/table-football.jpg',
						imgSrcBack: '',
						isFlexibleHeight: false
					},
					answer: {
						accept: false,
						cancel: false,
						acceptText: 'כן',
						cancelText: 'לא'
					},
					results: {
						active: false,
						correctType: 'accept',
						isCorrect: null
					}
				}
			]
		},
		beforeMount: function() {
			console.log('beforeMount');
			this.setCurrentItem();
		},
		mounted: function() {
			console.log('mounted');
		},
		beforeUpdate: function() {
			console.log('beforeUpdate');
		},
		updated: function() {
			console.log('updated');
		},
		created: function() {
			this.runHint();
		},
		methods: {
			'runHint': function () {
				this.hint.enable = this.currentIndex === 0;

				const { showHintDelay, hideHintDelay } = this.timeline;
				const showHint = () => {
					this.hint.isVisible = true;
				};
				const hideHint = () => {
					this.hint.isVisible = false;
					this.enablePlay = true;
				};

				if (this.hint.enable) {
					Promise.resolve()
						.then(delay(showHintDelay))
						.then(showHint)
						.then(delay(hideHintDelay))
						.then(hideHint);
				} else {
					this.enablePlay = true;
				}
			},
			'onPanMove': function ({ deltaX, deltaY }, ...rest) {
				//console.info('PanMove: ', deltaX, deltaY, rest);
				const { xLimit, yLimit, rLimit } = this;
				const x = parseInt(deltaX, 10);
				const y = parseInt(Math.abs(deltaY), 10) * (yLimit / xLimit);
				const r = x * (rLimit / xLimit);
				const isOutOfLimit = Math.abs(deltaX) > xLimit;

				this.style = {
					'transform': `translate(${x}px, ${y}px) rotate(${r}deg)`,
					'opacity': Math.max(((xLimit - Math.abs(deltaX)) / xLimit + 0.5), 0.1), // 0 - 1
					'boxShadow': '1px 1px 15px 0px rgba(0, 0, 0, 0.07)',
					'borderColor': `${isOutOfLimit ? '#dded64' : ''}`
				};
				this.isPanLeft	= x < 0;
				this.isPanRight = x > 0;
			},
			'onPanEnd': function ({ deltaX }, ...rest) {
				//console.info('PanEnd: ', ...rest);
				const { xLimit, style } = this;
				const isOutOfLimit = Math.abs(deltaX) > xLimit;

				if (isOutOfLimit) {
					//console.log(' - hide');
					this.selectAnswer({ deltaX });
					this.hideQuestion({ animateBefore: false });
					this.showResults();
				} else {
					//console.log(' - reset');
					this.style = {
						...style,
						'opacity': 1,
						'transition': '250ms ease-out',
						'transform': 'translate(0px, 0px) rotate(0deg)'
					};
				}
			},
			'selectAnswer': function({ deltaX }) {
				this.answer.accept = deltaX > 0;
				this.answer.cancel = deltaX < 0;
			},
			'onAnswerClick': function(event) {
				const isAccept = event.target.classList.contains('accept');
				this.selectAnswer({ deltaX: isAccept ? 1 : -1 });
				this.hideQuestion({ animateBefore: true });
				this.showResults();
			},
			'hideQuestion': function({ animateBefore = false, duration = this.timeline.questionLeaveDuration }) {
				const { style } = this;
				const { accept } = this.answer;

				if (animateBefore) {
					// in case if answer selected not by swipe(pan)
					this.style = {
						...style,
						'opacity': 0,
						'transition': `${duration}ms ease-out`,
						'transform': accept ? 'translate(400px, 5px) rotate(40deg)' : 'translate(-400px, 5px) rotate(-40deg)'
					};
					setTimeout(() => {
						this.question.active = false;
					}, duration);
				} else {
					this.question.active = false;
				}
			},
			'showResults': function() {
				const { showResultsDuration } = this.timeline;
				Promise.resolve()
					.then(() => {
						this.results.active = true;
						this.results.isCorrect = this.answer[this.results.correctType];
						this.enablePlay = false;
					})
					.then(delay(showResultsDuration))
					.then(this.showNextQuestion);
			},
			'reset': function() {
				Object.assign(this, swiperDefaults, {});
			},
			'showNextQuestion': function() {
				// ... iterate data array
				const nextIndex = this.currentIndex + 1;
				if (this.items.length > nextIndex) {
					Promise.resolve()
						.then(this.reset)
						.then(() => {
							this.currentIndex = nextIndex;
							this.setCurrentItem(nextIndex);
						});
				}
			},
			'setUnderlayBackgroundImage': function() {
				const url = this.question.imgSrcBack || this.question.imgSrc;
				return `url(${url})`;
			},
			'setCurrentItem': function(index = this.currentIndex) {
				this.question	 = this.items[index].question;
				this.answer		 = this.items[index].answer;
				this.results	 = this.items[index].results;
			}
		}
	});
}

document.addEventListener('DOMContentLoaded', DOMLoaded);
