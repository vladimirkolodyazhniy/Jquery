
jQuery(function(){
	jQuery('#wrapper').loadProgress();
});

// loadProgress plugin
;(function($){
	function loadProgress(options){
		this.options = $.extend({
			progressHolder: '.progress-overlay',
			bar: 'span',
			brokenPath: 'images/broken.jpg'
		},options);
		this.init();
	}
	loadProgress.prototype = {
		init: function(){
			if (this.options.holder){
				this.findElements();
				this.loadItems();
			}
		},
		findElements: function(){
			this.loadedImageCount = 0;
			this.imageCount = 0;
			this.overlay = $(this.options.holder).find(this.options.progressHolder);
			this.progress = this.overlay.find(this.options.bar);
		},
		updateProgress: function(value){
			this.progressValue = Math.floor((100 / this.imageCount) * value);
			this.progress.text(this.progressValue + '%' + ' '+ ' '+ this.loadedImageCount + ' '+ 'of' + ' '+ this.imageCount + ' '+ 'loaded');
			this.progress.css('width', this.progressValue + '%');
			if(this.progressValue === 100){
				this.done();
			}
		},
		loadItems: function(){
			var self = this;
			$('*').each(function(){
				var element = $(this),
					path,
					isBg = element.css('background-image') != 'none',
					isImage = element.is('img');
				if(isBg || isImage){
					if(isBg) {
						var image = new Image();
						path = element.css('background-image').replace('url(','').replace(')','');
						element.css('background-image', 'url(' +path+')');
						self.imageCount++;
					}else if(isImage){
						self.imageCount++;
						path = element.attr('src');
						element.attr('src', path);
					}
					$("<img />").load(function(){
						self.loadedImageCount++;
						self.updateProgress(self.loadedImageCount);
					}).on('error', function(){
						element.attr('src', self.options.brokenPath);
						self.loadedImageCount++;
						self.updateProgress(self.loadedImageCount);
					}).attr('src', path);
				}
			});
		},
		done: function(){
			var self = this;
			setTimeout(function(){
				$(self.overlay).fadeOut(300);
			}, 500);
		}
	};
	$.fn.loadProgress = function(opt){
		return this.each(function(){
			$(this).data('loadProgress', new loadProgress($.extend(opt, {holder: this})));
		});
	};
}(jQuery));