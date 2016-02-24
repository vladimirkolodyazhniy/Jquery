// page init
jQuery(window).load(function(){
	jQuery('body').animateLoad();
});

// animateLoad plugin
;(function($){
	function AnimateLoad(options){
		this.options = $.extend({
			animateClass: 'animated',
			items: '.box-anim',
		},options);
		this.init();
	}
	AnimateLoad.prototype = {
		init: function(){
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
			}
		},
		findElements: function(){
			this.win = $(window);
			this.elements = $(this.options.items);
		},
		attachEvents: function(){
			var self = this;
			self.checkPosition();
			self.win.on('scroll resize orientationchange', function(){
				self.checkPosition();
			});
		},
		checkPosition: function(){
			var self = this;
			self.inview = self.elements.filter(function() {
				var viewTop = self.win.scrollTop(),
					viewBottom = viewTop + self.win.height(),
					top = $(this).offset().top,
					bottom = top + $(this).height();
				return top <= viewBottom && bottom >= viewTop;
			});
			self.loadItem(self.inview);
		},
		setStyle: function(element) {
			var duration = element.attr('data-duration'),
				delay = element.attr('data-delay'),
				effect = element.attr('data-effect'),
				iteration = element.attr('data-iteration');
			if(effect){
				element.addClass(effect);
			}
			if(duration) {
				element.css({
					'animation-duration': duration
				});
			}
			if(delay) {
				element.css({
					'animation-delay': delay
				});
			}
			if(iteration) {
				element.css({
					'animation-iteration-count': iteration
				});
			}
		},
		loadItem: function(items){
			var self = this;
			items.each(function(){
				var item = $(this);
				if(!item.hasClass(self.options.animateClass)){
					item.addClass(self.options.animateClass);
					self.setStyle(item);
					self.elements = self.elements.not(item);
				}
			});
		}
	};
	$.fn.animateLoad = function(opt){
		return this.each(function(){
			$(this).data('AnimateLoad', new AnimateLoad($.extend(opt, {holder: this})));
		});
	};
}(jQuery));