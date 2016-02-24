jQuery(function(){
	RepsonsiveBlock({
		selector: '#box1',
		position: {
			'..700' : {
				selector: '#footer ',
				method: 'prependTo' // insertAfter, insertBefore, appendTo, prependTo
			},
			'701..1000' : {
				selector: '#header',
				method: 'appendTo' // insertAfter, insertBefore, appendTo, prependTo
			},
			'1000..' : {
				selector: '#sidebar',
				method: 'prependTo' // insertAfter, insertBefore, appendTo, prependTo
			}
		}
	});
	RepsonsiveBlock({
		selector: '#box',
		position: {
			'..700' : {
				selector: '#header',
				method: 'prependTo' // insertAfter, insertBefore, appendTo, prependTo
			},
			'701..1000' : {
				selector: '#footer',
				method: 'appendTo' // insertAfter, insertBefore, appendTo, prependTo
			},
			'1000..' : {
				selector: '#sidebar',
				method: 'prependTo' // insertAfter, insertBefore, appendTo, prependTo
			}
		}
	});
});

/*
 * RepsonsiveBlock
 */
RepsonsiveBlock = (function($){
	// init variables
	var handlers = [],
		prevWinWidth,
		win = $(window),
		nativeMatchMedia = false;

	// detect match media support
	if(window.matchMedia) {
		if(window.Window && window.matchMedia === Window.prototype.matchMedia) {
			nativeMatchMedia = true;
		} else if(window.matchMedia.toString().indexOf('native') > -1) {
			nativeMatchMedia = true;
		}
	}

	// prepare resize handler
	function resizeHandler() {
		var winWidth = win.width();
		if(winWidth !== prevWinWidth) {
			prevWinWidth = winWidth;

			// loop through range groups
			$.each(handlers, function(index, rangeObject){
				// disable current active area if needed
				$.each(rangeObject, function(property, item) {
					if(item.currentActive && !matchRange(item.range[0], item.range[1])) {
						item.currentActive = false;
						if(typeof item.disableCallback === 'function') {
							item.disableCallback();
						}
					}
				});
				// enable areas that match current width
				$.each(rangeObject, function(property, item) {
					if(!item.currentActive && matchRange(item.range[0], item.range[1])) {
						// make callback
						item.currentActive = true;
						if(typeof item.enableCallback === 'function') {
							item.enableCallback();
						}
					}
				});
			});
		}
	}
	win.bind('load resize orientationchange', resizeHandler);

	// test range
	function matchRange(r1, r2) {
		var mediaQueryString = '';
		if(r1 > 0) {
			mediaQueryString += '(min-width: ' + r1 + 'px)';
		}
		if(r2 < Infinity) {
			mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
		}
		return matchQuery(mediaQueryString, r1, r2);
	}

	// media query function
	function matchQuery(query, r1, r2) {
		if(window.matchMedia && nativeMatchMedia) {
			return matchMedia(query).matches;
		} else if(window.styleMedia) {
			return styleMedia.matchMedium(query);
		} else if(window.media) {
			return media.matchMedium(query);
		} else {
			return prevWinWidth >= r1 && prevWinWidth <= r2;
		}
	}

	// range parser
	function parseRange(rangeStr) {
		var rangeData = rangeStr.split('..');
		var x1 = parseInt(rangeData[0], 10) || -Infinity;
		var x2 = parseInt(rangeData[1], 10) || Infinity;
		return [x1, x2].sort(function(a, b){
			return a - b;
		});
	}

	// export public functions
	return (
		function addRange(options) {
			// parse data and add items to collection
			var result = {};
			$.each(options.position, function(key, data){
				result[key] = {
					range: parseRange(key),
					enableCallback : function(){
						$(options.selector)[data.method](data.selector);
					}
				};
			});
			handlers.push(result);

			// call resizeHandler to recalculate all events
			prevWinWidth = null;
			resizeHandler();
		}
	)
}(jQuery));