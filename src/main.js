// - global css
import Vue from 'vue';
import VueTouch from 'vue-touch';
import './theme/theme.scss';

// - images
require('../static/images/gil2.jpg');
require('../static/images/table-football.jpg');

/**
 *
 */
function DOMLoaded() {

	Vue.use(VueTouch);

	// +TODO: flexible height
	// +TODO: fallback for underlay if there is no underlay image(set from overlay)
	// TODO: multiple question support

	const swiper = new Vue({
		el: '#swiper',
		data: {
			isPanLeft: false,
			isPanRight: false,
			xLimit: 150,					// - horizontal pan limit in px
			yLimit: 20,						// - vertical pan limit in px
			rLimit: 15,						// - rotate on pan limit in px
			enablePlay: false,
			enableSwipeX: true, 			// - default false
			enableSwipeY: true,				// - not used
			style: {},						// - inline css object
			hint: {
				enable: true,
				isVisible: false
			},
			question: {
				active: true,
				text: 'זה משחק נחמד?',
				imgSrc: './static/images/table-football.jpg',
				imgSrcBack: './static/images/gil2.jpg',
				isFlexibleHeight: true
			},
			answer: {
				accept: false,				// - accept button state
				cancel: false,				// - cancel button state
				acceptText: 'כן',
				cancelText: 'לא'
			},
			results: {
				active: false,				// - show results state
				correctType: 'accept',	 	// - left = answers.cancel | right = answers.accept
				isCorrect: null				// - is correct answer state
			}
		},
		created: function() {
			if (this.hint.enable) {
				setTimeout(function() {
					this.hint.isVisible = true;
					this.runHint();
				}.bind(this), 300);
			} else {
				this.enablePlay = true;
			}
		},
		methods: {
			'runHint': function () {
				setTimeout(() => {
					this.hint.isVisible = false;
					this.enablePlay = true;
				}, 2000);
			},
			//Panning - pan, panstart, panmove, panend, pancancel, panleft, panright, panup, pandown
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
			'hideQuestion': function({ animateBefore = false, duration = 300 }) {
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
				this.results.active = true;
				this.results.isCorrect = this.answer[this.results.correctType];
				this.enablePlay = false;
			},
			'reset': function() {
				// - not used
				this.enablePlay = true;
				this.answer.accept = false;
				this.answer.cancel = false;
			},
			'showNextQuestion': function() {
				// ... iterate data array
			},
			'setUnderlayBackgroundImage': function() {
				const url = this.question.imgSrcBack || this.question.imgSrc;
				return `url(${url})`;
			}
		}
	});

	const flipper = new Vue({
		el: '#flipper',
		data: {
			flip: false,
			touched: false,
			tip: {
				text: 'הפכו וגלו'
			},
			front: {
				src: 'http://demos2.gambit.ph/before-after/wp-content/uploads/sites/10449/2014/12/5fcb0a55.jpeg',
				credit: 'סלבה',
				text: 'מקנה לדירה מראה כפרי'
			},
			back: {
				src: 'http://demos2.gambit.ph/before-after/wp-content/uploads/sites/10449/2014/12/5fcb0a55_.jpg',
				credit: 'זיו קורן',
				text: 'הוספת טקסטיל ושטיחים מקנה לדירה מראה כפרי ונעים ובעלות זניחה יח'
			}
		},
		methods: {
			flipCard: function() {
				this.tip.active = false;
				this.flip = !this.flip;
				this.touched = true;
			}
		}
	});
}

document.addEventListener('DOMContentLoaded', DOMLoaded);
