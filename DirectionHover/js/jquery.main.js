jQuery(function() {
	jQuery('.hoverHolder').hoverItem();
});

// hoverItem plugin
;(function($) {
	function hoverItem(options) {
		this.options = $.extend({
			elem: 'a',
			hoverElem: '.hover-mask',
			hoverClass: 'hover',
			aminSpeed : 300
		},options);
		this.init();
	}
	hoverItem.prototype = {
		init: function(){
			if (this.options.holder) {
				this.atachEvent();
			}
		},
		atachEvent: function() {
			var self = this;
			this.elements = $(this.options.holder).find(this.options.elem);
			this.elements.each(function() {
				var el = $(this),
				hoverElem = el.find(self.options.hoverElem);
				el.on({
					mouseenter: function(e) {
						var direction = self.getDirection(el,{x : e.pageX, y : e.pageY}),
							styleCSS = self.getStyle(direction);
						el.addClass(self.options.hoverClass);
						hoverElem.css(styleCSS.from).stop().animate(styleCSS.to, self.options.aminSpeed);
					},
					mouseleave: function(e) {
						var direction = self.getDirection(el,{ x : e.pageX, y : e.pageY }),
							styleCSS = self.getStyle(direction);
						el.removeClass(self.options.hoverClass);
						hoverElem.stop().animate(styleCSS.from, self.options.aminSpeed);
					}
				});
			});
		},
		getDirection: function(el,coords) {
			var width = el.width(),
				height = el.height(),
				offset = el.offset(),
				x = (coords.x - offset.left - ( width/2 )) * ( width > height ? (height/width ) : 1 ),
				y = (coords.y - offset.top  - ( height/2 )) * ( height > width ? (width/height ) : 1 ),
				/** first calculate the angle of the point,
				add 180 deg to get rid of the negative values
				divide by 90 to get the quadrant
				add 3 and do a modulo by 4  to shift the quadrants to a proper clockwise TRBL (top/right/bottom/left) **/
				direction = Math.round( ( ( ( Math.atan2(y, x) * (180 / Math.PI)) + 180 ) / 90 ) + 3 ) % 4;

			return direction;
		},
		getStyle: function(direction) {
			var fromStyle,
				toStyle,
				fromTop = {left: 0, top: '-100%'},
				fromBottom = {left: 0, top: '100%'},
				fromLeft = {left: '-100%', top: 0},
				fromRight = {left: '100%', top: 0},
				toTop = {top : 0},
				toLeft = {left : 0};
			switch(direction){
				case 0:
					fromStyle = fromTop;
					toStyle = toTop;
					break;
				case 1:
					fromStyle = fromRight;
					toStyle = toLeft;
					break;
				case 2:
					fromStyle = fromBottom;
					toStyle = toTop;
					break;
				case 3:
					fromStyle = fromLeft;
					toStyle = toLeft;
					break;
			}
			return {from: fromStyle, to: toStyle};
		}
	};
	$.fn.hoverItem = function(opt) {
		return this.each(function() {
			$(this).data('hoverItem', new hoverItem($.extend(opt, { holder: this })));
		});
	};
}(jQuery));