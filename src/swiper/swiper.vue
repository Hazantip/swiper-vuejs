<template>
	<div class="swiper" :class="{ disable: !enablePlay }">
		<div class="swiper-main">
			<!-- hint -->
			<transition name="fade">
				<div class="swiper-hint" v-if="hint.isVisible">
					<div class="swiper-hint-inner">
						<!-- hide after delay -->
						<i class="icon icon-arrow-right">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve" width="100%" height="100%"><path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111  C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587  c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z" /></svg>
						</i>
						<i class="icon icon-pointer">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 188.079 188.079" style="enable-background:new 0 0 188.079 188.079;" xml:space="preserve" width="100%" height="100%"><path d="M177.274,96.588l-0.028,0.001V94.5c0-8.284-6.716-15-15-15s-15,6.716-15,15V78c0-8.284-6.716-15-15-15s-15,6.716-15,15V63  c0-8.284-7.216-15-15.5-15s-15.464,7.216-15.464,15.5L86.246,15c0-8.284-6.716-15-15-15s-15,6.716-15,15v97.25  c0,0-15.346-46.083-36.937-35.104c-7.548,3.838-10.705,12.947-6.953,20.54l27.911,56.484c0,0,17.252,33.909,47.339,33.909h40  c27.614,0,49.699-22.386,49.699-50L177.274,96.588z"/></svg>
						</i>
						<i class="icon icon-arrow-left">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 31.494 31.494" style="enable-background:new 0 0 31.494 31.494;" xml:space="preserve" width="100%" height="100%"><path d="M10.273,5.009c0.444-0.444,1.143-0.444,1.587,0c0.429,0.429,0.429,1.143,0,1.571l-8.047,8.047h26.554  c0.619,0,1.127,0.492,1.127,1.111c0,0.619-0.508,1.127-1.127,1.127H3.813l8.047,8.032c0.429,0.444,0.429,1.159,0,1.587  c-0.444,0.444-1.143,0.444-1.587,0l-9.952-9.952c-0.429-0.429-0.429-1.143,0-1.571L10.273,5.009z" /></svg>
						</i>
						<div class="text">
							{{ hint.text }}
						</div>
					</div>
				</div>
			</transition>
			
			<!-- image: always positioned absolute -->
			<v-touch @panmove="onPanMove" @panend="onPanEnd">
				<div
						class="swiper-image swiper-image--overlay"
						:class="{ left: isPanLeft, right: isPanRight }"
						:style="[style, { backgroundImage: 'url(' + this.question.imgSrc + ')' }]"
						v-if="question.active"
				>
					<!--<img :src="question.imgSrc" alt="" v-if="question.isFlexibleHeight">-->
					<div class="swiper-question">{{ this.question.text }}</div>
				</div>
			</v-touch>
			
			<!-- Image underlay:
				- Behave like a sizer,
				- if isFlexibleHeight : height based on inner hidden img tag with src from overlay image
				- else : underlay height is based on paddingBottom: 100%(square class - .swiper-image--fixed)
			-->
			<div
					class="swiper-image swiper-image--underlay"
					:class="{ 'swiper-image--fixed': !this.question.isFlexibleHeight }"
					:style="{ backgroundImage: setUnderlayBackgroundImage() }"
			>
				<img v-if="this.question.isFlexibleHeight" :src="this.question.imgSrc" alt="">
			</div>
			
			<!-- results -->
			<div class="swiper-results">
				<transition name="fadeIn">
					<div v-if="this.results.isCorrect && this.results.active"  class="swiper-result swiper-result--correct">
						<i class="icon icon-success">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 329.954 329.954" style="enable-background:new 0 0 329.954 329.954;" xml:space="preserve" width="100%" height="100%">
									<path d="M99.85,299.045c2.813,2.813,6.629,4.393,10.607,4.393c3.979,0,7.794-1.581,10.606-4.393L325.56,94.548  c2.814-2.813,4.394-6.628,4.394-10.606c0-3.979-1.58-7.794-4.394-10.607l-42.427-42.426c-5.857-5.857-15.355-5.858-21.213,0  L110.461,182.37l-42.428-42.428c-2.813-2.813-6.629-4.394-10.607-4.394s-7.793,1.581-10.606,4.394L4.393,182.369  c-5.857,5.858-5.857,15.355,0,21.213L99.85,299.045z" />
								</svg>
						</i>
					</div>
					<div v-if="!this.results.isCorrect && this.results.active" class="swiper-result swiper-result--incorrect">
						<i class="icon icon-error">
							<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 284.559 284.559" style="enable-background:new 0 0 284.559 284.559;" xml:space="preserve" width="100%" height="100%">
									<path d="M4.394,237.739l42.427,42.427c2.812,2.813,6.629,4.394,10.606,4.394c3.978,0,7.794-1.581,10.606-4.394  l74.246-74.246l74.246,74.246c2.813,2.813,6.629,4.394,10.606,4.394c3.978,0,7.794-1.581,10.607-4.394l42.427-42.427  c5.858-5.858,5.858-15.355,0-21.213L205.92,142.28l74.245-74.247c2.814-2.813,4.394-6.628,4.394-10.606  c0-3.979-1.58-7.794-4.394-10.607L237.739,4.393c-5.857-5.858-15.356-5.858-21.213,0.001L142.28,78.639L68.033,4.394  c-5.857-5.858-15.356-5.858-21.213,0L4.394,46.82C1.58,49.633,0,53.448,0,57.426c0,3.978,1.58,7.793,4.394,10.606l74.245,74.247  L4.394,216.526C-1.465,222.384-1.465,231.881,4.394,237.739z" />
								</svg>
						</i>
					</div>
				</transition>
				<!-- show after answer -->
				<div class="swiper-question">{{ this.question.text }}</div>
			</div>
		</div> <!-- main END -->
		
		<div class="swiper-answers">
			<!-- set one of as active on panEnd -->
			<div class="answer accept" :class="{ active: this.answer.accept }" v-on:click="onAnswerClick">{{this.answer.acceptText}}</div>
			<div class="answer cancel" :class="{ active: this.answer.cancel }" v-on:click="onAnswerClick">{{this.answer.cancelText}}</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import VueTouch from 'vue-touch';

	Vue.use(VueTouch);

	const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

	const swiperDefaults = {
		enablePlay: true,				// enable/disable events
		isPanLeft: false,
		isPanRight: false,
		xLimit: 150,					// - horizontal pan limit in px
		yLimit: 50,						// - vertical pan limit in px
		rLimit: 25,						// - rotate on pan limit in px
		enableSwipeX: true, 			// - default false
		enableSwipeY: true,				// - not used
		style: {}						// - inline css object
	};
	
	export default {
		'components': {
			
		},
		'props': {
			data: Object,
			index: Number
		},
		'computed': {
			
		},
		data () {
			return {
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
							imgSrc: '/assets/images/dunk.jpg',
							imgSrcBack: '/assets/images/table-football.jpg',
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
							imgSrc: '/assets/images/gil2.jpg',
							imgSrcBack: '/assets/images/table-football.jpg',
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
							imgSrc: '/assets/images/table-football.jpg',
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
					},
					{
						question: {
							active: true,
							text: '4 - זה משחק נחמד?',
							imgSrc: '/assets/images/wide_nba.png',
							imgSrcBack: '/assets/images/table-football.jpg',
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
					}
				]
			}
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
			this.enablePlay = true;
//			this.runHint();
		},
		'methods': {
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
				const y = parseInt(deltaY, 10) * (yLimit / xLimit);
				const r = x * (rLimit / xLimit) * 0.5;
				const isOutOfLimit = Math.abs(deltaX) > xLimit;
				
				this.style = {
					'transform': `translate(${x}px, ${y}px) rotate(${-r}deg)`,
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
						'transform': accept ? 'translate(120%, 5px) rotate(40deg)' : 'translate(-120%, 5px) rotate(-40deg)'
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
	}
</script>

<style lang="scss">
	@import "../_mixins.scss";
	@import 'swiper.scss';
</style>
