// page init
jQuery(function() {
	jQuery('.lazyLoad').lazyLoad();
});

// lazy load plugin
;(function($) {
	function LazyLoad(options) {
		this.options = $.extend( {
			items: 'img',
			loadingClass: 'loading'
		},options);
		this.init();
	}
	LazyLoad.prototype =  {
		init: function() {
			var self = this;
			if (this.options.holder)  {
				this.findElements();
				this.attachEvents();
			}
		},
		findElements: function() {
			this.win = $(window);
			this.images = $(this.options.items);
			this.imgHolder = this.images.parent().addClass(this.options.loadingClass);
		},
		attachEvents: function() {
			var self = this;
			self.checkPosition();
			self.win.on('scroll resize orientationchange', function() {
				self.checkPosition();
			});
		},
		checkPosition: function() {
			var self = this;
			self.inview = self.images.filter(function()  {
				self.winScrollTop = self.win.scrollTop();
				self.winHeight = self.win.height();
				self.elemOffsetTop = $(this).offset().top;
				self.elemHeight = $(this).height();
				return self.elemOffsetTop + self.elemHeight >= self.winScrollTop && self.elemOffsetTop <= self.winScrollTop + self.winHeight;
			});
			self.loadItems(self.inview);
		},
		loadItems: function(image) {
			var self = this;
			image.each(function() {
				var img = $(this),
				imgHolder = img.parent(),
				path = img.attr('data-src');
				if (path) {
					img.removeAttr("data-src").attr('src', path);
					img.on('load', function() {
						self.images = self.images.not(img);
						imgHolder.removeClass(self.options.loadingClass);
					});
				}
			});
		}
	};
	$.fn.lazyLoad = function(opt) {
		return this.each(function() {
			$(this).data('LazyLoad', new LazyLoad($.extend(opt,  {holder: this})));
		});
	};
}(jQuery));