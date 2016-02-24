
jQuery(function() {
	jQuery('#wrapper').multiLevelMenu();
	jQuery('.btn-destroy').on('click', function(e) {
		e.preventDefault();
		jQuery('#wrapper').data('MultiLevelMenu').destroy();
	});
});

// multiLevelMenu plugin
;(function($) {
	function MultiLevelMenu(options) {
		this.options = $.extend({
			opener: '.opener',
			nav: '#nav',
			activeNavClass: 'nav-active',
			menuOpenClass: 'menu-open',
			overlayClass: 'overlay',
			container: '.container',
			elements: 'li',
			links: 'a',
			drop: 'ul',
			animDuration:'500',
			backBtn: '>.back-btn',
			dropClass: 'dropMenu',
			caretTemplate: '<span class="fa fa-caret-right"></span>'
		}, options);
		this.init();
	}
	MultiLevelMenu.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.atachEvent();
			}
		},
		findElements: function() {
			this.nav = $(this.options.nav);
			this.navWidth = this.nav.width();
			this.body = $('body');
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.opener);
			this.drop = this.nav.find(this.options.drop);
			this.elements = this.nav.find(this.options.elements);
			this.elements.data('drops', this.elements.closest(this.drop));
			this.links = this.nav.find(this.options.links);
		},
		openDrop: function (item) {
			item.addClass(this.options.menuOpenClass);
				if(item.data('drop')) {
					item.data('drop').addClass(this.options.overlayClass);
				}
		},
		closeDrop: function (item) {
			item.removeClass(this.options.menuOpenClass);
			if(item.data('drop')) {
				item.data('drop').removeClass(this.options.overlayClass);
			}
		},
		atachEvent: function() {
			var self = this;
			this.clickHandler = function(e) {
				e.preventDefault();
				if (!self.body.hasClass(self.options.activeNavClass)) {
					self.openNav();
				} else {
					self.closeNav();
				}
			};
			this.elements.each(function() {
				var item = $(this),
					drop = item.find('>' + self.options.drop),
					elems = drop.find('>' + self.options.elements),
					backBtn = elems.find(self.options.backBtn);
				item.data('drop', item.closest(self.drop));
				if (drop.length) {
					var link = item.find('>' + self.options.links);

					link[0].openDropHandler = function(e) {
						e.preventDefault();
						self.openDrop(item);
					};

					link[0].closeDropHandler = function(e) {
						e.preventDefault();
						self.closeDrop(item);
					};

					drop.addClass(self.options.dropClass);
					link.append(self.options.caretTemplate).addClass('caret');
					backBtn.prepend(self.options.caretTemplate).addClass('caret');
					link.on('click', link[0].openDropHandler);
					backBtn.on('click', link[0].closeDropHandler);

				}
			});
			self.opener.on('click', this.clickHandler);
		},
		openNav: function() {
			this.body.addClass(this.options.activeNavClass);
			this.container.stop().animate({ left:this.navWidth }, this.options.animDuration);
		},
		closeNav: function() {
			var self = this;
			this.body.removeClass(this.options.activeNavClass);
			self.container.stop().animate({ left:0 }, self.options.animDuration, function() {
				self.container.removeAttr('style');
				self.elements.removeClass(self.options.menuOpenClass);
				if(self.elements.data('drops')) {
					self.elements.data('drops').removeClass(self.options.overlayClass);
				}
			});
		},
		destroy: function() {
			var self = this;
			this.links.filter('.caret').removeClass('caret').children('span').remove();
			this.opener.off('click', this.clickHandler);
			this.links.each(function() {
				$(this)
					.off('click', this.openDropHandler)
					.off('click', this.closeDropHandler);
			});
			this.drop.removeClass(this.options.dropClass);
			this.closeDrop(this.elements);
			this.closeNav();
			self.elements.removeData('drop', self.drop);
		}
	};
	$.fn.multiLevelMenu = function(opt) {
		return this.each(function() {
			$(this).data('MultiLevelMenu', new MultiLevelMenu($.extend(opt, { holder: this })));
		});
	};
}(jQuery));
