
jQuery(function(){
	jQuery('#nav').scalingMenu();
	jQuery('#navResonsive').scalingMenu({
		responsive: true
	});
});

// scalingMenu plugin
;(function($){
	function scalingMenu(options){
		this.options = $.extend({
			items: 'li',
			responsive: false,
			responsiveClass: 'responsive'
		},options);
		this.init();
	}
	scalingMenu.prototype = {
		init: function(){
			if (this.options.holder){
				this.findElements();
				this.setWidth();
				if(this.options.responsive){
					this.nav.addClass(this.options.responsiveClass);
					this.setWidthResponsive();
				}
			}
		},
		findElements: function(){
			this.nav = $(this.options.holder);
			this.navWidth = this.nav.width();
			this.items = this.nav.find(this.options.items);
			this.itemsLength = this.items.length;
		},
		setWidthResponsive: function(){
			for(var i = 0; i < this.itemsLength; i++){
				var percent = this.items.eq(i).width()/this.navWidth * 100;
				this.items.eq(i).width(percent + '%');
			}
		},
		getDiff: function(){
			return (this.navWidth - this.getWidth()) / this.itemsLength;
		},
		getWidth: function(){
			var fullWidth = 0;
			for(var i = 0; i < this.itemsLength; i++){
				fullWidth += this.items.eq(i).width();
			}
			return fullWidth;
		},
		setWidth: function(){
			var widthDiff = this.getDiff();
			for(var i = 0; i < this.itemsLength; i++){
				this.items.eq(i).width(this.items.eq(i).width() + widthDiff);
			}
		}
	};
	$.fn.scalingMenu = function(opt){
		return this.each(function(){
			$(this).data('scalingMenu', new scalingMenu($.extend(opt, {holder: this})));
		});
	};
}(jQuery));