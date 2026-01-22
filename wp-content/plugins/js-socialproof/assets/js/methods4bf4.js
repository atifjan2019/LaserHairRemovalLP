
jQuery(document).ready(function($) {
	$('body').append('<div id="js--socialproof-wrapper"></div>');
	var data_array 				= js_socialproof_vars.popup_data,
		data_settings			= js_socialproof_vars.settings.js_socialproof_position,
		popup_position_class	= 'js--socialproof-popup__'+js_socialproof_vars.settings.js_socialproof_position,
		popup_animation_class	= js_socialproof_vars.settings.js_socialproof_opening_animation,
		popup_interval			= js_socialproof_vars.settings.js_socialproof_popup_interval,
		popup_gone_interval		= js_socialproof_vars.settings.js_socialproof_popup_gone_interval*1000,
		popup_style_type_class	= 'js--socialproof-'+js_socialproof_vars.settings.js_socialproof_style_type,
		popup_bg_color			= js_socialproof_vars.settings.js_socialproof_bg_color,
		popup_text_color		= js_socialproof_vars.settings.js_socialproof_text_color,
		popup_text				= js_socialproof_vars.settings.js_socialproof_popup_text,
		popup_times				= js_socialproof_vars.settings.js_socialproof_activity_times,
		css_styles				= js_socialproof_vars.settings.js_socialproof_popup_css,
		disable_popup_on_mobile	= js_socialproof_vars.settings.js_socialproof_disable_popup_on_mobile,
		times					= popup_times.split(',');

		if ( js_is_mobile_devices() == true ) {
			popup_position_class = 'js--socialproof-popup__mobile_only';
		} else {
			popup_position_class = 'js--socialproof-popup__'+js_socialproof_vars.settings.js_socialproof_position;
		}

	if ( data_array !== 0 ) {
		$.each( data_array, function(k,v) {
			fullname 	= ( v['name'].full_name ) ? v['name'].full_name : '' ;
			picture 	= ( v['name'].picture ) ? v['name'].picture : '';
			city 		= ( v['location'].city ) ? v['location'].city : '';
			state 		= ( v['location'].state ) ? v['location'].state : '';
			activity	= ( v.activity ) ? v.activity : '';
			when 		= js_socialproof_getRandomItems(1, times);
			pop_text 	= popup_text.replace(/{/g, '<').replace(/}/g, '>').replace('/fullname', fullname ).replace('/city', city ).replace('/state', state ).replace('/when', when ).replace('/activity', activity );

			var result = '<div class="js--socialproof-popup '+popup_position_class+' '+popup_animation_class+' '+popup_style_type_class+' js--socialproof-hide"><div class="js--socialproof-popup__details"><div class="js--socialproof-popup__image"><img class="'+popup_style_type_class+'" src="'+picture+'" alt="Picture"></div><div class="js--socialproof-popup__content">'+pop_text+'</div></div><a class="js--socialproof-popup__close-button"><svg class="bx--toast-popup__icon" aria-label="close" width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z" fill-rule="nonzero"/></svg></a></div>';
			$('#js--socialproof-wrapper').append(result);
		});

		// Handle popup Interval
		$(".js--socialproof-popup").each(function(index){
			var _this = $(this);
			(function(that, i) { 
				i++;
				setTimeout(function() { 
					_this.removeClass('js--socialproof-hide').addClass('fade-in').delay(popup_gone_interval).fadeOut();
				}, i * 1000 * popup_interval);
			})(this, index);
		});

		// Handle close button
		$('.js--socialproof-popup__close-button').click(function () {
			$('#js--socialproof-wrapper').remove();
		});

		// Handle Styles
		$("body").append(css_styles);

		// IF POPUP DISABLED ON MOBILE DEVICE
		if ( js_is_mobile_devices() == true && disable_popup_on_mobile == 'on' ) {
			$('#js--socialproof-wrapper').css( 'display', 'none' );
		}
	}

	function js_socialproof_getRandomItems(n, list) {
		const copy = Array.from(list);
		return Array.from(Array(n), () => copy.splice(Math.floor(copy.length * Math.random()), 1)[0]);
	}

	function js_is_mobile_devices() {
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			return true;
		} else {
			return false;
		}
	}

});

