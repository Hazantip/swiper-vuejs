// - global css
import Vue from 'vue';
import swiperComponent from './swiper/swiper.vue';
import './theme/theme.scss';

/**
 *
 */
function DOMLoaded() {

	// TODO(done): flexible height
	// TODO(done): fallback for underlay if there is no underlay image(set from overlay)
	// TODO(done): multiple question support
	// TODO(done): hint styles
	// TODO(done): results icons styles
	// TODO(done): min/max image height
	// TODO: decide not/will be possible to scroll? it's important for ignoreOverflowParent solution
	// TODO: transition between questions
	// Hammer Pan Events: pan, panstart, panmove, panend, pancancel, panleft, panright, panup, pandown

	const swiperActivity = new Vue({
		el: '#swiper',
		template: '<swiper />',
		components: {
			'swiper': swiperComponent
		}
	});

}

document.addEventListener('DOMContentLoaded', DOMLoaded);
