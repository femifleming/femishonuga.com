define([
	__cargo_context__ === "staging" ? '/_jsapps/imagegallery/base.js' : 'https://static.cargo.site/assets/builds/imagegallery/base.js',
	'text!/_jsapps/imagegallery/slideshow/defaults.json'
],
function(
	GalleryBase,
	defaults
) {

	return GalleryBase.extend({

		name: 'Slideshow',
		parentView: null,

		// allows images to be resized inside the Cargo editor
		allowsResize: true,

		// limits the size of each image to its natural size
		limitResize: true,

		/**
		 * Set attributes to el for layout options.
		 *
		 * @return {Object} attributes
		 */
		setElAttributes: function () {

			var model_data = this.galleryOptions.data;

			this.el.style.paddingBottom = ''
			this.$el.removeAttr('image-gallery-horizontal-align image-gallery-vertical-align image-gallery-pad image-gallery-gutter data-exploded image-gallery-row data-slideshow-in-transition');
			this.$el.addClass('slick ');
			this.$el.attr({
				'image-gallery'	: this.name.toLowerCase(),
				'style': '',
				'data-constrained-by' : model_data.constrain_height ? "height" : "width"
			});

		},

		/**
		 * Bind event listeners.
		 *
		 * @return {Object} this
		 */
		initialize: function (options) {

			var _this = this;

			this.rendered = false;
			this.exploded = false;
			this.unexplodeTimer = null;

			if (!options){
				return
			}

			if( options.parentView) {
				this.parentView = options.parentView;
			}

			if ( options.galleryOptions){
				this.galleryOptions = options.galleryOptions;

				var model_data = Object.assign({}, this.galleryOptions.data);
				this.galleryOptions.data =  _.defaults(model_data || {}, JSON.parse(defaults))
			}

			if ( options.mobile_active){
				this.mobile_active = options.mobile_active
			}

			this.onVisibilityChange = _.bind(this.onVisibilityChange, this);
			this.updateIntersectionObservers();


			this.updateSlick = _.bind(this.updateSlick, this);
			this.unExplodeView = _.bind(this.unExplodeView, this);
			this.explodeView = _.bind(this.explodeView, this);
			this.initSlick = _.bind(this.initSlick, this);
			this.resetIndication = _.bind(this.resetIndication, this);

			this.el.addEventListener('intersectionChange', this.onVisibilityChange);

			// listening happens in render step since we do not want the initial render to be delayed at all

			return this;
		},

		updateIntersectionObservers: function(){

			var closestPin = this.el.closest('.fixed');

			var scrollEl = null;
			if(closestPin){
				if( closestPin ){
					scrollEl = this.el.closest('.container') || null;
				}
			}

			this.visible = false;
			if(!window.__slideshowIntersectionObservers){
				window.__slideshowIntersectionObservers = {};
			}

			var intersectionID = scrollEl && scrollEl.hasAttribute('data-id') ? scrollEl.getAttribute('data-id')  : 'window';
			this.intersectionID = intersectionID;

			if (!window.__slideshowIntersectionObservers[intersectionID] ){


				window.__slideshowIntersectionObservers[intersectionID] = new IntersectionObserver(function(entries){

					entries.forEach(function(entry){

						let position = 'inside'
						if(entry.boundingClientRect.top - entry.boundingClientRect.height < 0 && !entry.isIntersecting){
							position = 'above'
						} else if (entry.boundingClientRect.top > 0 && !entry.isIntersecting){
							position = 'below'
						}

						entry.target.dispatchEvent(new CustomEvent('intersectionChange', {
							detail: {
								visible: entry.isIntersecting,
								position: position,
							},
							bubbles: false
						}));
					});		

				},{
					root: scrollEl,
					rootMargin: '0px',
					threshold: 0
				});

			}
		},

		destroy: function(){

			this.el.removeEventListener('intersectionChange', this.onVisibilityChange);

			if(window.__slideshowIntersectionObservers[this.intersectionID]){
				window.__slideshowIntersectionObservers[this.intersectionID].unobserve(this.el);
			}
			
			this.stopListening();
			var $slideshow = this.$el

			$slideshow.off();

			if ( $slideshow.is('.slick-initialized') ){
				$slideshow.slick('unslick')
			};


		},

		remove: function(){

			Backbone.View.prototype.remove.apply(this, arguments);

		},

		onVisibilityChange: function(e){

			this.visible = e.detail.visible;

			if(this.visible){
				if ( this.$el.hasClass('slick-initialized') ){
					this.$el.slick('getSlick').lazyLoad();
				}
				this.resume();
			} else {
				this.pause();
			}
		},

		pause: function(){
			if ( this.$el.hasClass('slick-initialized') && this.galleryOptions.data.autoplay ){
				this.$el.slick('slickPause')
			}
		},

		resume: function(){
			if ( this.$el.hasClass('slick-initialized') && this.galleryOptions.data.autoplay && this.visible){
				this.$el.slick('slickPlay')
			}
		},

		/**
		 * Handle the changes to the model triggered from the admin panel
		 * @param  {Object} event
		 * @param  {Object} options sent from settings model, changing and value
		 */
		handleUpdates: function(galleryOptions, options){

			if (galleryOptions){
				this.galleryOptions = Object.assign({},galleryOptions);
			}

			if ( !options || !this.$el.is('.slick-initialized') ){
				return
			}

			switch (options.changing) {

				case "constrain_height":

					this.pause();

					this.$el.slick('getSlick').$slideTrack.css({
						'transform': ''
					});

					this.$el.slick('getSlick').$slideTrack.finish();

					this.$el.slick('setPosition');

					this.$el.find('.gallery_card').css('height', '');

					this.setElAttributes();

					// reset the cached heights
					this.elementH = 0;

					Cargo.Plugins.elementResizer.refresh();
					break;

				case "image_alignment":
					this.setAlignmentAttributes();
					break;

				case "autoplaySpeed":

					if ( this.galleryOptions.data['transition-type'] !== 'scrub' ){
						this.$el.slick('slickSetOption', 'autoplaySpeed', options.value *1000 , false);
						this.$el.slick('setPosition');
					}

					break;

				case "transition-type":

					var currentSlide = this.$el.slick('getSlick').currentSlide;

					this.$el.slick('getSlick').$slideTrack.finish();
					this.$el.slick('getSlick').$slides.finish();

					this.$el.slick('getSlick').$slideTrack.removeAttr('style');
					this.$el.slick('getSlick').$slides.removeAttr('style');

					this.$el.removeClass('scrub fade slide');
					this.$el.addClass(options.value);

					if ( this.galleryOptions.data['transition-type'] === 'scrub' ){
						this.$el.slick('slickSetOption', 'speed', 0);
					} else {
						this.$el.slick('slickSetOption', 'speed', parseFloat(this.galleryOptions.data.speed)*1000);
					}

					if ( options.value == 'slide' && parseFloat(this.galleryOptions.data.speed) != 0){
						this.$el.slick('slickSetOption', 'variableWidth', true)						
					} else {
						this.$el.slick('slickSetOption', 'variableWidth', false)						
					}

					this.$el.slick('slickSetOption', 'fade', options.value == 'scrub' || options.value == 'fade' , true );
					this.$el.slick('slickGoTo', currentSlide, true);

					this.$el.slick('setPosition');

					break;

				case "speed":

					var currentSlide = this.$el.slick('getSlick').currentSlide;

					if ( options.value == 0 && this.$el.slick('getSlick').options.fade == false ){

						this.$el.slick('getSlick').$slideTrack.finish();
						this.$el.slick('getSlick').$slides.finish();

						this.$el.slick('getSlick').$slideTrack.removeAttr('style');
						this.$el.slick('getSlick').$slides.removeAttr('style');

						this.$el.slick('slickSetOption', 'fade', true, false );
						this.$el.slick('slickGoTo', currentSlide, true);

					} else if ( galleryOptions.data['transition-type'] != 'fade' && this.$el.slick('getSlick').options.fade == true ){

						this.$el.slick('getSlick').$slideTrack.finish();
						this.$el.slick('getSlick').$slides.finish();

						this.$el.slick('getSlick').$slideTrack.removeAttr('style');
						this.$el.slick('getSlick').$slides.removeAttr('style');

						this.$el.slick('slickSetOption', 'fade', false, false );
						this.$el.slick('slickGoTo', currentSlide, true);

					}
					if ( options.value == 0 ){
						this.$el.slick('slickSetOption', 'variableWidth', false);						
						this.$el.slick('slickSetOption', 'cssEase', 'none', false );
					} else {

						if ( galleryOptions.data['transition-type'] == 'slide' ){
							this.$el.slick('slickSetOption', 'variableWidth', true);							
						}

						this.$el.slick('slickSetOption', 'cssEase', 'ease-in-out', false );
					}

					this.$el.slick('slickSetOption', 'speed', options.value *1000 , true)
					break;

				case "autoplay":

					this.$el.slick('setPosition');

					if ( this.galleryOptions.data['transition-type'] === 'scrub'){
						this.$el.slick('slickSetOption', 'autoplay', false, false)
						this.$el.slick('slickPause')

						if ( options.value  ){
							this.startScrubAutoplay();
						} else {
							this.stopScrubAutoplay();
						}
					} else {
						this.$el.slick('slickSetOption', 'autoplay', options.value, false)
						if ( options.value  ){
							this.$el.slick('slickPlay')
						} else {
							this.$el.slick('slickPause')
						}
					}

					break;

				case "arrows":
					this.$el.slick('slickSetOption', 'arrows', options.value, true )
					break;
				case 'captions':

					this.pause();

					if ( this.$el.hasClass('slick-initialized') ){
						this.$el.slick('destroy');
					};

					this.render();

					break;		
				default:
				    break;
			}

		},

		/**
		 * @return {Object} this
		 */
		render: function () {

			if(window.__slideshowIntersectionObservers[this.intersectionID]){
				window.__slideshowIntersectionObservers[this.intersectionID].unobserve(this.el);	
			}
			
			if ( Cargo.Core.ImageGallery.draggingInEditor && (this.parentView.isEditing)) {
				this.explodeView();
				return;
			}

			var elWidth = this.el.offsetWidth;

			var _this = this;
			var model_data = Object.assign({}, this.galleryOptions.data);

			// set defaults for galleries that havent gotten updated settings
			if ( !model_data.hasOwnProperty('captions') ){
				model_data.captions = true;
			}			

			this.el.innerHTML ='';

			this.images = _.sortBy(this.parentView.images, 'index');

			this.singleImage = false;

			if ( _.keys(this.images).length == 1 ){
				this.singleImage = true;
				var repeatImage = _.extend({}, this.images[0]);
				this.images.push(repeatImage);
			}

			_.each( this.images, function(imageObject, index) {
				var image = _this.createItem(imageObject);

				image.setAttribute('data-gallery-item', '')
				// this step realigns serialized order with render order
				image.setAttribute('data-gallery-item-index', index);

				// caption is the last element in the queue with a data-caption attribute
				var interiorImages = image.querySelectorAll('img[width][height], iframe[width][height], video[width][height]')
				var caption = document.createElement('DIV')
				var hasCaption = false;

				caption.className = 'gallery_image_caption'

				_.each(interiorImages, function(interiorImage){

					interiorImage.setAttribute('data-gallery-uid', imageObject.data.uid)

					if (interiorImage.hasAttribute('data-caption')){
						caption.innerHTML = interiorImage.getAttribute('data-caption')
						hasCaption = true
					}

					$(interiorImage).removeAttr( 'data-elementresizer-no-resize data-elementresizer-no-centering data-elementresizer-no-vertical-resize');

				});

				if ( image.hasAttribute('width') && image.hasAttribute('height') && !image.hasAttribute('data-elementresizer-child') ){
					$(image).removeAttr( 'data-elementresizer-no-resize data-elementresizer-no-centering data-elementresizer-no-vertical-resize')
				}

				var slide, ratio;
				var isLink = false;
				var slide_inner = document.createElement('DIV');


				// make the whole slide into a link
				if ( image.tagName === 'A' && interiorImages.length == 1 ){
					isLink = true;

					if ( interiorImages[0].hasAttribute('autoplay') ){
						interiorImages[0].removeAttribute('autoplay');
						interiorImages[0].setAttribute('data-autoplay', '');
					}

					slide = image;
					slide_inner.appendChild(interiorImages[0]);

					slide.innerHTML ='';

					//slide = image.cloneNode(true)
					ratio = interiorImages[0].getAttribute('height')/ interiorImages[0].getAttribute('width');


				} else {

					if ( image.hasAttribute('autoplay') ){
						image.removeAttribute('autoplay');
						image.setAttribute('data-autoplay', '');
					}

					// only change specific styles since we need to maintain cursor properties
					$(image).css('margin', '')
					ratio = image.getAttribute('height')/image.getAttribute('width')

					slide = document.createElement('DIV')
					slide_inner.appendChild(image)

				}

				$(slide_inner).attr({
					'class': 'gallery_card_image'
				})
				if ( imageObject.activeClass){
					slide.classList.add('active')
				}				

				slide.appendChild(slide_inner)

				slide.classList.add('gallery_card')
				slide.style.width = elWidth+'px'


				if ( image.hasAttribute('data-caption') ){

					caption.innerHTML = image.getAttribute('data-caption');
					hasCaption = true;

				}


				if ( hasCaption && model_data.captions){

					slide.appendChild(caption);
					slide.classList.add('has_caption');
				}

				slide.setAttribute('data-gallery-item-id', index)

				_this.el.appendChild(slide)

			});

			this.setElAttributes();
			this.initSlick();
			this.setAlignmentAttributes();
			this.$el.prepend('<div class="slideshow-nav" style="display: none" contenteditable="false"><a href="#" data-prev>Prev</a> / <a href="#" data-next>Next</a> (<span data-current data-ignore-changes>1</span> of <span data-total data-ignore-changes>1</span>)</div>')

			// initialized needs to be added before refresh in order for the images to have their models
			this.$el.addClass('initialized');

			// scrollMonitor.recalculateLocations();
			Cargo.Plugins.elementResizer.requestRefreshTick();

			if( window.__slideshowIntersectionObservers[this.intersectionID] ){
				window.__slideshowIntersectionObservers[this.intersectionID].observe(this.el);				
			}


			this.updateSlick();

			this.stopListening();
			this.listenTo(Cargo.Event, "elementresizer_update_complete", this.updateSlick);

			if ( CargoEditor){
				this.focusSlide	= _.bind(this.focusSlide,this);
				this.focusSlide = _.debounce(this.focusSlide, 120)				
				this.listenTo(CargoEditor.events, "cursor-activity", this.focusSlide);
			}

			this.exploded = false;
			Cargo.Event.trigger('image_gallery_rendered', this);

			return this;
		},

		focusSlide: function(){

			if ( !this.isAdminEdit){
				return;
			}

			var activeRange = CargoEditor.getActiveRange()

			if ( !activeRange){

				if ( this.visible){
					this.resume();					
				}

				return
			}

			var nodeInsideSlideShow = false;
			var selectedItem = CargoEditor.helpers.getAllEffectivelyContainedNodes(
				activeRange,
				_.bind(function(node){
					
					nodeInsideSlideShow = (this.el.contains(node) && document.contains(node)) || nodeInsideSlideShow;
					return (
						node.nodeName === "IMG" ||
						node.nodeName === "VIDEO" ||
						node.nodeName === "IFRAME"
					)
				}, this)
			);

			if ( !nodeInsideSlideShow || selectedItem.length == 0){

				if ( this.visible ){
					this.resume();					
				}

			} else {

				if (this.$el.slick){
					var slideIndex = 0;
					var slide = closest(selectedItem[0], function(parent){
						if(parent && parent.nodeType === Node.ELEMENT_NODE && parent.nodeName === "DIV") {
							return parent.hasAttribute('data-slick-index');
						}
					});
					if ( slide ){
						slideIndex = slide.getAttribute('data-slick-index');
					}		
					this.$el.slick('slickGoTo', slideIndex, true);
				}

				this.pause();				
			}

		},

		setAlignmentAttributes: function(){

			var model_data = Object.assign({}, this.galleryOptions.data);

			this.$el.find('.slick-track').attr({
				'image-gallery-vertical-align': model_data.image_vertical_align
			});

			this.$el.find('.gallery_card').attr({
				'image-gallery-horizontal-align': model_data.image_horizontal_align
			});			
		},

		explodeView: function(){

			if ( this.exploded ){
				return;
			}

			this.stopListening();

			var _this = this;

			this.exploded = true;

			if ( this.$el.hasClass('slick-initialized') ){
				this.$el.slick('destroy');
				this.$el.find('.slick-arrow, .slick-list').hide();
			};

			this.$el.removeClass('slick');

			this.$el.attr('data-exploded', '');

			// hide excluded item so it doesn't get removed and cancel the drag event

			this.$el.find('.gallery_image_caption').hide();

			this.el.innerHTML = '';

			this.images = _.sortBy(this.parentView.images, 'index');
				
			_.each( this.images, function(imageObject, index) {

				var imageObject = _this.images[index];
				var card = document.createElement('DIV');

				$(card).attr({
					'class': 'gallery_card',
					'data-gallery-item-id': index
				});

				card.className = 'gallery_card';

				var cardInner = document.createElement('DIV');
				cardInner.className = 'gallery_card_image';

				var item = _this.createItem(imageObject);

				if ( item.tagName === "A"){
					cardInner = item;
					var media = item.querySelector('img, video, iframe');
					if ( media){
						media.removeAttribute('data-lazy');
						media.setAttribute('data-elementresizer-no-resize', '')						
					}

				} else {
					item.setAttribute('data-elementresizer-no-resize', '')
					item.removeAttribute('data-lazy')
					cardInner.appendChild(item)
				}

				$(cardInner).attr({
					'class': 'gallery_card_image',
					'style': 'display: block; padding-bottom: '+((parseInt(imageObject.height) / parseInt(imageObject.width))* 100 ) + '%',
				});

				card.appendChild(cardInner);
				_this.el.appendChild(card);
			});

			var newHeight = Math.max( this.$el.height(), parseInt(this.el.getAttribute('data-drag-height')));

			newHeight = Math.max(150,newHeight)	

			this.$el.height(newHeight);

			Cargo.Plugins.elementResizer.refresh();

			this.parentView.cachedRects.needsUpdate = true;
			this.parentView.updateCacheRects();
		},

		unExplodeView: function(){

			if ( !this.exploded || this.$el.hasClass('slick-initialized') ){
				return;
			}

			this.$el.height('');

			this.$el.removeAttr('data-exploded');

			this.$el.find('.gallery_image_caption').css('display', '');

			var galleryCards = this.$el.find('.gallery_card_image');

			galleryCards.each(function(index, card){

				var cardItem = card.querySelector('img, video, iframe');
				card.style.paddingBottom = '';

				if ( !cardItem ){
					return;
				}
				card.removeAttribute('data-rotation')
				cardItem.removeAttribute('data-elementresizer-no-resize');
				cardItem.removeAttribute('data-rotation');
				cardItem.setAttribute('style','');

			});

			this.exploded = false;

			this.render();

			return;

		},


		getThumbRectPositionRelatedToPoint: function(point,rect){

			var in_y = false,
				in_x = false,
				above = false,
				below = false,
				to_left = false,
				to_right = false,
				distance = 0,
				rise = 0,
				run = 0,
				midpoint_distance = 0,
				midpoint_rise = 0,
				midpoint_run = 0;

			if ( point.x >= (rect.left) && point.x <= (rect.left+rect.width) ){
				in_x = true;
			}

			if ( point.y >= (rect.top) && point.y <= (rect.top+rect.height) ){
				in_y = true;
			}

			if ( rect.left > point.x ){
				to_right = true;
			} else if ( point.x > rect.left+rect.width ){
				to_left = true;
			}

			if ( rect.top > point.y ){
				below = true;
			} else if ( point.y > rect.top+rect.height ){
				above = true;
			}

			if ( in_x && in_y){

				var midpoint_rise = rect.midPoint.y - point.y;
				var midpoint_run = rect.midPoint.x - point.x;
				midpoint_distance = Math.sqrt(midpoint_rise*midpoint_rise + midpoint_run*midpoint_run)

			} else {

				if ( below ){

					rise = rect.top - point.y;

				} else if ( above ) {

					rise = (rect.top+rect.height) - point.y;

				}

				if ( to_right ){

					run = rect.left - point.x;

				} else if (to_left){

					run = (rect.left + rect.width) - point.x;

				}

			}

			distance = Math.sqrt( (rise*rise)+(run*run) );

			return {
				in_x: in_x,
				in_y: in_y,
				above: above,
				below: below,
				to_right: to_right,
				to_left: to_left,
				distance: distance,
				midpoint_rise: midpoint_rise,
				midpoint_run: midpoint_run,
				midpoint_distance: midpoint_distance,
				rise: rise,
				run: run,
				inside: in_x && in_y
			}

		},

		indicateInsertion: function(event, dragged, dragRect){

			if ( !dragRect ){
				return;
			}

			clearTimeout(this.unexplodeTimer);
			if ( !this.exploded ){

				this.explodeView();
				return
			}

			if ( this.images.length < 2){
				this.parentView.insertionPoint = 0;
				return;
			}

			var m = {x: event.clientX, y: event.clientY}
			var minDistAbove = 9e9;
			var minDistBelow = 9e9;
			var minDistToRight = 9e9;
			var minDistToLeft = 9e9;
			var minDist = 9e9;

			var closestThumbToLeft = "default";
			var closestThumbToRight = "default";
			var closestThumbAbove = "default";
			var closestThumbBelow = "default";
			var closestThumb = "default";



			// build data into cache rects, also find closest thumb index
			for (var i in this.parentView.cachedRects.rects ){

				if ( i == 'default'){
					continue
				}

				var positions = this.getThumbRectPositionRelatedToPoint(m, this.parentView.cachedRects.rects[i] )
				this.parentView.cachedRects.rects[i].positions = positions;

				if ( this.parentView.cachedRects.rects[i].positions.distance < minDist ){
					minDist = this.parentView.cachedRects.rects[i].positions.distance;
					closestThumb = i;
				}

				if ( this.parentView.cachedRects.rects[i].positions.above && this.parentView.cachedRects.rects[i].positions.distance < minDistAbove){
					minDistAbove = this.parentView.cachedRects.rects[i].positions.distance;
					closestThumbAbove = i;
				}

				if ( this.parentView.cachedRects.rects[i].positions.below && this.parentView.cachedRects.rects[i].positions.distance < minDistBelow){
					minDistBelow = this.parentView.cachedRects.rects[i].positions.distance;
					closestThumbBelow = i;
				}

				if ( this.parentView.cachedRects.rects[i].positions.to_left && this.parentView.cachedRects.rects[i].positions.distance < minDistToLeft){
					minDistToLeft = this.parentView.cachedRects.rects[i].positions.distance;
					closestThumbToLeft = i;
				}

				if ( this.parentView.cachedRects.rects[i].positions.to_right && this.parentView.cachedRects.rects[i].positions.distance < minDistToRight){
					minDistToRight = this.parentView.cachedRects.rects[i].positions.distance;
					closestThumbToRight = i;
				}
			}

			var targetNext = targetPrev = horizVertical = indicatePrev = indicateNext = "default";


			if ( this.parentView.cachedRects.rects[closestThumb].midPoint.x > m.x){

				// now to figure out where it gets indiciated
				var prevItem = $('[data-gallery-item-id="'+(parseInt(closestThumb)-1)+'"]');

				if (prevItem.length > 0){

					if (
						(
							this.parentView.cachedRects.rects.hasOwnProperty(prevItem.attr('data-gallery-item-id') ) &&
							this.parentView.cachedRects.rects[ prevItem.attr('data-gallery-item-id') ].midPoint.x < this.parentView.cachedRects.rects[closestThumb].midPoint.x
						) ||
						prevItem.attr('data-gallery-item-id') == closestThumbToLeft
					) {
						indicatePrev = prevItem.attr('data-gallery-item-id');
					}

				}

				targetNext = closestThumb;
				indicateNext = targetNext;

			} else {

				// now to figure out where it gets indiciated
				var nextItem = $('[data-gallery-item-id="'+(parseInt(closestThumb)+1)+'"]');

				if (nextItem.length > 0){

					if (
						(
							this.parentView.cachedRects.rects.hasOwnProperty(nextItem.attr('data-gallery-item-id') ) &&
							this.parentView.cachedRects.rects[ nextItem.attr('data-gallery-item-id') ].midPoint.x > this.parentView.cachedRects.rects[closestThumb].midPoint.x
						) ||
						nextItem.attr('data-gallery-item-id') == closestThumbToRight
					) {
						indicateNext = nextItem.attr('data-gallery-item-id')
					}

					targetNext = nextItem.attr("data-gallery-item-id");

				} else {

					targetNext = 9e9;

				}

				indicatePrev = closestThumb
			}


			var nextRotation = 0;
			var prevRotation = 0;

			this.$el.find('.indication-prev, .indication-next').removeClass('indication-prev indication-next')

			if ( indicatePrev != 'default' ){
				this.$el.find('[data-gallery-item-id="'+indicatePrev+'"]').addClass('indication-prev').css({
					'transform' : 'translateX(-2.5rem) rotate('+prevRotation+'deg)',
					'transition' : 'transform .08s cubic-bezier(0, 0, 0, 1)',
					'position': 'relative',
					'z-index' : '99'
				})
			}

			if ( indicateNext != 'default' ){
				this.$el.find('[data-gallery-item-id="'+indicateNext+'"]').addClass('indication-next').css({
					'transform' : 'translateX(2.5rem) rotate('+nextRotation+'deg)',
					'transition' : 'transform .08s cubic-bezier(0, 0, 0, 1)',
					'position': 'relative',
					'z-index' : '99'
				})
			}

			var galleryCards = 	this.$el.find('.gallery_card').not('.indication-next, .indication-prev');
			galleryCards.each(function(index){

				var $card = $(this);

				$card.css({
					'position': '',
					'transform' : '',
					'z-index' : ''
				})
			})

			this.parentView.insertionPoint = targetNext
			this.$el.removeAttr('data-slideshow-in-transition')

		},


		resetIndication: function(){

			var _this = this;

			this.parentView.insertionPoint = 0;

			var $galleryCards = this.$el.find('.gallery_card');
			$galleryCards.each(function(index, card){

				var $card = $(this);

				$card.css({
					'position': '',
					'z-index' : ''
				})
			})
			$galleryCards.removeClass('indication-next indication-prev')

			// allow implementationfixes to reset and rerender at the end
			if ( Cargo.Core.ImageGallery.draggingInEditor){

				this.parentView.draggingOverGallery = true

			} else if ( this.exploded && !this.parentView.adding_item ){

				clearTimeout(this.unexplodeTimer)
				this.unexplodeTimer = setTimeout(function(){
					_this.unExplodeView();
				}, 200)

			}

		},

		initSlick: function(){

			var _this = this;

			var $slideshow = this.$el

			var isAdminEdit = false
			var mouseTimeout
			var mouseDownTarget
			var currentCursor
			var dragTimer;
			var canSelect = false;
			var transitionAttributeSet = false;
			var mouseDown = false;

			try {
				if(parent.hasOwnProperty('Cargo')) {
					this.isAdminEdit = isAdminEdit = parent.Cargo.Helper.IsAdminEdit();
				}
			} catch(e) {
				// Cross domain issue
			}

			var model_data = Object.assign({}, this.galleryOptions.data);

			var autoplay = model_data.autoplay;

			var slickOptions = {

				autoplay: (this.galleryOptions.data['transition-type'] === 'scrub') ? false : autoplay,
				autoplaySpeed: model_data.autoplaySpeed * 1000,
				speed: (this.galleryOptions.data['transition-type'] === 'scrub') ? 0 : model_data.speed * 1000,
				fade: model_data['transition-type'] == 'fade' || model_data.speed == 0 || (this.galleryOptions.data['transition-type'] === 'scrub'),
				arrows: model_data.arrows,

				cssEase: model_data.speed == 0 ? 'none': 'ease-in-out',
				useCSS: true,
				useTransform: true,
				adaptiveHeight: false,
				prevArrow: '<div class="slick-prev image-gallery-navigation">\
								<svg version="1.1" class="left-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\
									 viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve">\
										<polyline class="arrow-outline outer-color" points="21,29 10,18 21,7 	"/>\
										<polyline class="arrow-shape inner-color"class="st1" points="21,29 10,18 21,7 	"/>\
								</svg>\
							</div>',
				nextArrow: '<div class="slick-next image-gallery-navigation">\
								<svg version="1.1" class="right-arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\
									 viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve">\
										<polyline class="arrow-outline outer-color" points="21,29 10,18 21,7 	"/>\
										<polyline class="arrow-shape inner-color"class="st1" points="21,29 10,18 21,7 	"/>\
								</svg>\
							</div>',
				dots: false,
				variableWidth: this.galleryOptions.data['transition-type'] == 'slide' && this.galleryOptions.data.speed != 0,
			    lazyLoad: 'ondemand',
				accessibility: !isAdminEdit,
				draggable: !isAdminEdit && this.galleryOptions.data['transition-type'] !== 'scrub',
				pauseOnHover: isAdminEdit,
				touchMove: !isAdminEdit && this.galleryOptions.data['transition-type'] !== 'scrub',
				preventDefaults: false,
			};

			$slideshow.removeClass('scrub fade slide');
			$slideshow.addClass( model_data['transition-type'] );

			var slideshowNav = this.el.querySelector('.slideshow-nav')
			if( slideshowNav && slideshowNav.setSaveable) {
				slideshowNav.setSaveable(false)
			}
			var nextArrow = this.el.querySelector('.slick-next')
			if ( nextArrow && nextArrow.setSaveable) {
				nextArrow.setSaveable(false)
			}

			var prevArrow = this.el.querySelector('.slick-prev')
			if ( prevArrow && prevArrow.setSaveable) {
				prevArrow.setSaveable(false)
			}

			var datestamp = 0;
			var inertiaDirection = 'forward'
			var autoplayTimeout;

		    var mouseMoved =false;
		    var stopImageDrag = true;
			var videoResumeTimer;
			var slideshowRect = 0;
			var startMouseX = 0;
			var startMouseY = 0;
			var startSlideIndex = 0;
			var cancelClick = false;

			var dragTimer;
			var resumeVideos = function(slick){

				var isMobile = Cargo.Helper.isMobile();
				var currentSlide = $slideshow.slick('slickCurrentSlide');

				if ( !slick.$slides){
					return
				}

				if ( slick.$slides.length == 0 || !slick.$slides[currentSlide]){
					return;
				}

				var videos = slick.$slides[currentSlide].querySelectorAll('video[data-autoplay]');

				// moving the video element causes autoplay to break. Fix that by calling
				// .play() on the affected elements.
				_.each(videos, function(videoEl){

					if ( videoEl.hasAttribute('muted') ){
						videoEl.muted = true;
					}

					// this is to prevent videos from playing in takeover mode on ajax-load
					if ( isMobile && !videoEl.hasAttribute('playsinline') ){
						videoEl.setAttribute('playsinline', '')
					}

					// use video promise to play back
					var playPromise = videoEl.play();

					if (playPromise !== undefined) {
					  playPromise.then(function() {

					    // Automatic playback started!
					  }).catch(function(error) {

						var isPlaying  = videoEl.currentTime > 0 && !videoEl.paused && !videoEl.ended && videoEl.readyState > 2;
					  	// expose controls when auto playback fails

					  	if ( !isPlaying ){

							videoEl.play().catch(function(error){

								videoEl.muted = true;
								videoEl.setAttribute('muted', '')

								videoEl.play().catch(function(error){
							  		videoEl.setAttribute('controls', '');
								});
							});
					  	}

					  });
					}

				});


				_.each(videos, function(videoEl){
					if ( videoEl.hasAttribute('muted') ){
						videoEl.muted = true;
					}
					// safari will complain if there isn't a promise callback
					// even if the promise is empty
					var playPromise = videoEl.play();

					if (playPromise !== undefined) {

					  playPromise.then(function() {
					    // Automatic playback started!
					  }).catch(function(error) {

					  });
					}
				})
			}

	       function captureClick(event){

	       		if ( event.target.tagName && event.target.tagName === "VIDEO" ){
	       			cancelClick = true;
	       		}	

	        	if ( mouseMoved ){
					cancelClick = true;
		        	event.preventDefault();
				    event.stopPropagation();
	        	}
			    window.removeEventListener('click', captureClick, true); // cleanup
	        }


			var onMouseMove = function(event){

				var isTouch = event.type ==='touchmove';
				var clientX = isTouch? event.touches[0].clientX : event.clientX;
				var clientY = isTouch ? event.touches[0].clientY : event.clientY;
				var mouseDeltaX = (startMouseX-clientX);
				var mouseDeltaY = (startMouseY-clientY);

				if ( !mouseMoved && Math.abs(mouseDeltaX) > 10  ){
					mouseMoved = true;
				}

				if ( _this.galleryOptions.data['transition-type'] == 'scrub' ){

					var percentage = (mouseDeltaX/slideshowRect.width);
					// ensure we stay within modulo range
					percentage = (percentage+1000)%1;

					var numberOfSlides = $slideshow.slick('getSlick').$slides.length;
					var slideMoveDelta = Math.floor(numberOfSlides*percentage);
					var targetSlide = (startSlideIndex+slideMoveDelta+numberOfSlides)%numberOfSlides;

					$slideshow.slick('slickGoTo', targetSlide, true);
				}

			}

			var holdDelta = 0;
			var inertiaBuilt = false;

			var bindScrubNav = function(){
				var $nextArrow = $slideshow.find('.slick-next');

				$nextArrow.off('mousedown.scrub touchstart.scrub mouseup.nav mouseleave.nav touchend.nav')
				if ( _this.galleryOptions.data['transition-type'] !== 'scrub'){
					return
				}
				$nextArrow.on('mousedown.scrub touchstart.scrub',function(event){

					holdDelta = 500;
					inertiaBuilt = false;
					onStartNextNavClick();
					$(this).on('mouseup.nav mouseleave.nav touchend.nav', function(){
						onReleaseNav();
						$(this).off('mouseup.nav mouseleave.nav touchend.nav')
					});
				})

				var $prevArrow = $slideshow.find('.slick-prev');
		
				$prevArrow.off('mousedown.scrub touchstart.scrub mouseup.nav mouseleave.nav touchend.nav');
				if ( _this.galleryOptions.data['transition-type'] !== 'scrub'){
					return
				}
				$prevArrow.on('mousedown.scrub touchstart.scrub',function(){

					holdDelta = 500;
					inertiaBuilt = false;

					onStartPrevNavClick();
					$(this).on('mouseup.nav mouseleave.nav touchend.nav', function(){
						onReleaseNav();
						$(this).off('mouseup.nav mouseleave.nav touchend.nav')
					});
				})
			}

			var onStartNextNavClick = function(event){
				clearTimeout(autoplayTimeout)
				autoplayTimeout = setTimeout(function(){
					onHoldNextNav();
				}, holdDelta)
				holdDelta = Math.min(holdDelta, 500);
			}

			var onStartPrevNavClick = function(event){
				clearTimeout(autoplayTimeout)
				holdDelta = Math.min(holdDelta, 500);
				autoplayTimeout = setTimeout(function(){
					onHoldPrevNav();
				}, holdDelta)
			}

			var onHoldNextNav = function(){

				holdDelta = Math.max(20, Math.min(250,holdDelta*.9));

				clearTimeout(autoplayTimeout)
				var currentSlide = $slideshow.slick('slickCurrentSlide');
				var numberOfSlides = $slideshow.slick('getSlick').$slides.length;
				var targetSlide = (currentSlide+1+numberOfSlides)%numberOfSlides;
				$slideshow.slick('slickGoTo', targetSlide, true);
				clearTimeout(autoplayTimeout)

				autoplayTimeout = setTimeout(function(){
					inertiaBuilt = true;
					onHoldNextNav();
				}, holdDelta)
			}

			var onHoldPrevNav = function(){

				holdDelta = Math.max(20, Math.min(250,holdDelta*.9));

				clearTimeout(autoplayTimeout)
				var currentSlide = $slideshow.slick('slickCurrentSlide');
				var numberOfSlides = $slideshow.slick('getSlick').$slides.length;
				var targetSlide = (currentSlide-1+numberOfSlides)%numberOfSlides;

				$slideshow.slick('slickGoTo', targetSlide, true);
				clearTimeout(autoplayTimeout)

				autoplayTimeout = setTimeout(function(){
					inertiaBuilt = true;
					onHoldPrevNav();
				}, holdDelta)
			}

			var onReleaseNav = function(){
				clearTimeout(autoplayTimeout)

				if ( inertiaBuilt ){
					decayAutoPlay(holdDelta, 30)					
				}			

			}


			var scrubAutoplay = function(dontExecute){

				if ( _this.galleryOptions.data.autoplay ) {

					var currentSlide = $slideshow.slick('slickCurrentSlide');
					var numberOfSlides = $slideshow.slick('getSlick').$slides.length;
					var targetSlide;

					if ( inertiaDirection === 'forward'){
						targetSlide = (currentSlide+1+numberOfSlides)%numberOfSlides;
					} else {
						targetSlide = (currentSlide-1+numberOfSlides)%numberOfSlides;
					}
					$slideshow.slick('slickGoTo', targetSlide, true);

					clearTimeout(autoplayTimeout)

					autoplayTimeout = setTimeout(function(){
						scrubAutoplay();
					}, parseFloat(_this.galleryOptions.data.autoplaySpeed)*1000)

				}
			}

			this.startScrubAutoplay = scrubAutoplay;

			this.stopScrubAutoplay = function(){
				clearTimeout(autoplayTimeout)
			}


			var decayAutoPlay = function(delta, iteration){

				var newDelta = delta*1.05+(iteration*.5)
				var newIteration = iteration+1;

				var currentSlide = $slideshow.slick('slickCurrentSlide');
				var numberOfSlides = $slideshow.slick('getSlick').$slides.length;
				var targetSlide
				if ( inertiaDirection === 'forward'){
					targetSlide = (currentSlide+1+numberOfSlides)%numberOfSlides;
				} else {
					targetSlide = (currentSlide-1+numberOfSlides)%numberOfSlides;
				}

				clearTimeout(autoplayTimeout)

				if ( model_data.autoplay && newDelta >=  Math.min(.25, parseFloat(model_data.autoplaySpeed))*1000){

					autoplayTimeout = setTimeout(function(){
						scrubAutoplay()
					}, parseFloat(model_data.autoplaySpeed)*1000 );
				} else if ( newDelta < 200 ){
					autoplayTimeout = setTimeout(function(){
						decayAutoPlay(newDelta, newIteration)
					}, newDelta);
				} else if(model_data.autoplay){
					autoplayTimeout = setTimeout(function(){
						scrubAutoplay()
					}, parseFloat(model_data.autoplaySpeed)*1000 );
				}

				$slideshow.slick('slickGoTo', targetSlide, true);

			}


			var endMouseMove = function(event){
				var isTouch = event.type ==='touchend';

				mouseDown = false;
				$slideshow.removeAttr('data-mousedown');
				clearTimeout(dragTimer)
				clearTimeout(autoplayTimeout)

				// cleanup for capture
				setTimeout(function(){
				    window.removeEventListener('click', captureClick, true); // cleanup
				}, 10)


				// calc delta at time of release rather than wait for slide


				if ( _this.galleryOptions.data['transition-type'] === 'scrub' ){

					$('body').removeClass('slideshow-scrub-dragging');

					var newDate = new Date().getTime();
					timeDelta = newDate-datestamp;
					if ( timeDelta < 100){
						autoplayTimeout = setTimeout(function(){
							decayAutoPlay(timeDelta, timeDelta*.5)
						}, timeDelta);
					}

				}

				if ( isTouch){
					window.removeEventListener('touchmove', onMouseMove)
					window.removeEventListener('touchend', endMouseMove)

				} else {
					window.removeEventListener('mousemove', onMouseMove);
					window.removeEventListener('mouseup', endMouseMove)

				}
			}

			var lastSlideIndex = 0;
			var onMouseDown = function(event){

				if( mouseDown) {
					return;
				}
				mouseDown = true;


				if ( event.button == 2){
					return
				}

				clearTimeout(autoplayTimeout)
				$slideshow.attr('data-mousedown', '')
				cancelClick = false;
				mouseMoved = false;
				stopImageDrag = true;
				clearTimeout(dragTimer)

				dragTimer = setTimeout(function(){

					if ( !mouseMoved){
						stopImageDrag = false;
					}

				}, 250)


				if ( isAdminEdit){
					return
				}

				var isTouch = event.type ==='touchstart';

				startMouseX = isTouch? event.originalEvent.touches[0].clientX : event.clientX;
				startMouseY = isTouch? event.originalEvent.touches[0].clientY : event.clientY;

				if ( _this.galleryOptions.data['transition-type'] !== 'scrub' ){

					if ( isTouch){
						window.addEventListener('touchmove', onMouseMove)
						window.addEventListener('touchend', endMouseMove)
					} else {
						window.addEventListener('mousemove', onMouseMove)
						window.addEventListener('mouseup', endMouseMove)
					}
	
				} else {

					$('body').addClass('slideshow-scrub-dragging');

					slideshowRect = $slideshow.get(0).getBoundingClientRect();
					startSlideIndex = $slideshow.slick('slickCurrentSlide')
					$slideshow.slick('slickPause')

					if ( isTouch){
						window.addEventListener('touchmove', onMouseMove)
						window.addEventListener('touchend', endMouseMove)

					} else {
						event.preventDefault();
						window.addEventListener('mousemove', onMouseMove)
						window.addEventListener('mouseup', endMouseMove)
					}
				}
			    window.addEventListener(
			        'click',
			        captureClick,
			        true
			    )
			}

			$slideshow
				.slick(slickOptions)
				.on('afterChange', function(event, slick, currentSlide){

					var videoIframe  = slick.$slides[lastSlideIndex].querySelector('iframe');

					if ( videoIframe ){
						var iframeSrc = videoIframe.getAttribute('src');
						videoIframe.setAttribute('src', '');
						setTimeout(function(){
							videoIframe.setAttribute('src', iframeSrc);
						}, 200)
					}

					datestamp = new Date().getTime();

					clearTimeout(videoResumeTimer);
					videoResumeTimer = setTimeout(function(){
						resumeVideos(slick)
					}, 400)

					$slideshow.removeAttr('data-slideshow-in-transition')
					Cargo.Event.trigger('slideshow_update');
					_this.el.__cachedSlide = currentSlide;
				})
				.on(isAdminEdit ? 'dblclick' : 'click', '.slick-list > *', function(e){
					if ( !mouseMoved  && !cancelClick ) {
						if ( e.target.classList.contains('image-zoom') || $(e.target).closest('a').length >0 ){
							clearTimeout(autoplayTimeout)
							return
						}
						$slideshow.slick('slickNext');
					}
				}).on('dragstart', '.slick-list img', function(e){
					if ( !isAdminEdit && stopImageDrag){
						e.preventDefault();
						e.stopPropagation();
					}

				}).on('dragend', '.slick-list img', function(e){
					$slideshow.trigger('touchend.slick');
				}).on('beforeChange', function(event, slick, currentSlide, nextSlide){

					// if at end and going forwards
					if (currentSlide == slick.$slides.length -1 && nextSlide == 0){
						inertiaDirection = 'forward'
					} else if (currentSlide == 0 && nextSlide == slick.$slides.length -1){
						inertiaDirection = 'backward'
					} else if ( nextSlide > currentSlide){
						inertiaDirection = 'forward'
					} else {
						inertiaDirection = 'backward'
					}

					var currentTime = 0;
					_.each(slick.$slides[currentSlide].querySelectorAll('video'), function(videoEl){

						videoEl.pause();
						currentTime = videoEl.currentTime;

					});

					// if at beginning and going backwards
					if ( currentSlide == 0 && nextSlide == slick.$slides.length -1 ){
						$slideshow.find('.slick-cloned').last().find('video').each(function(){
							this.currentTime = currentTime;
						})
					}

					// if at end and going forwards
					if (currentSlide == slick.$slides.length -1 && nextSlide == 0){
						$slideshow.find('.slick-cloned').first().find('video').each(function(){
							this.currentTime = currentTime;
						})
					}


					$slideshow.attr('data-slideshow-in-transition', '')
					lastSlideIndex = currentSlide
				}).on('reInit', bindScrubNav);


			resumeVideos($slideshow.slick('getSlick'));

			bindScrubNav();

			$slideshow.on('mousedown.slideshow', '.slick-list', onMouseDown)
			$slideshow.on('touchstart.slideshow', '.slick-list', onMouseDown);

			if (this.galleryOptions.data['transition-type'] === 'scrub' ){
				autoplayTimeout = setTimeout(function(){
					scrubAutoplay();
				}, parseFloat(_this.galleryOptions.data.autoplaySpeed)*1000)
			}


			$slideshow.find('.slick-cloned').removeAttr('data-gallery-item-id');

			if ( this.singleImage ){
				$slideshow.find('[data-slick-index="1"] *').attr('data-exclude-item', '')
			}

			if ( isAdminEdit) {
				$slideshow.find('.slick-cloned *, .slick-cloned').attr("data-exclude-item", '');
			}

			$slideshow.find('.slick-list').on('scroll', function(e){
				// prevent scrolling when selecting text
				this.scrollLeft = 0;
			});



			var currentSlide = 0;


			var $slides = $slideshow.slick('getSlick').$slides;


			// if gallery is in the process of breakdown during init, avoid touching current slides or navigating
			if ( $slides && $slides.length > 0){

				if ( this.el.__cachedSlide ){
					$slideshow.slick('slickGoTo', this.el.__cachedSlide, true);
					currentSlide = this.el.__cachedSlide;
					this.el.__cachedSlide = null;
				}

				_.each($slideshow.slick('getSlick').$slides[currentSlide].querySelectorAll('video[data-autoplay]'), function(videoEl){

					var playPromise = videoEl.play();

					// gotta do it like this or safari will complain
					if (playPromise !== undefined) {

					  playPromise.then(function() {
					    // Automatic playback started!
					  }).catch(function(error) {

					  });
					}
				});
			}


			this.rendered = true;

		},

		slickTimeout: null,

		elementH: null,
		elementW: null,
		updateSlick: function(){
			var _this = this;

			if ( !document.contains(this.el) ){
				this.destroy();
				return;
			}

			// use page element to get values directly from elementResizer
			var pageEl = this.pageEl;

			if( !this.pageEl ){
				pageEl = this.$el.closest('.page_content');
				if( pageEl.length > 0){
					pageEl = this.pageEl = pageEl.get(0);
				}
			}

			if( !pageEl ){
				return;
			}

			if ( this.exploded || !this.$el.hasClass('slick-initialized') ){
				return
			}

			var $slides = this.$el.slick('getSlick').$slides;
			if ( !$slides || $slides.length  == 0){
				return;
			}

			var elRect = this.el.getBoundingClientRect();

			if ( this.galleryOptions.data.constrain_height) {

				var pluginTargets = Cargo.Plugins.elementResizer.options.targets;

				var activeImages = [];
				_.each(pluginTargets, function(target) {
					if( target.container  == pageEl){
						activeImages = target.children
					}
				});
				activeImages = _.filter(activeImages, function(obj){
					return _this.el.contains(obj.element);
				});

				var shortestImage = null;
				var shortestHeight = 9e9;
				_.each(activeImages, function(obj){

					if(obj.actualHeight <= shortestHeight){
						shortestImage = obj.element;
						shortestHeight = obj.actualHeight;
					}
				})


				_.each(activeImages, function(obj){

					var imageWidth = obj.originalWidth
					var imageHeight = obj.originalHeight;

					var reduction = shortestHeight / imageHeight;

					var newHeight = shortestHeight;
					var newWidth = newHeight*(imageWidth/imageHeight)
					newWidth = Math.min(newWidth, Math.round(elRect.width));


					obj.element.style.width = newWidth + 'px';
					obj.element.style.height = newHeight + 'px';


				})

			}

			// get tallest image
			// get tallest caption
			// force size because safari is terrible with this stuff
			var captions = this.el.querySelectorAll('.gallery_image_caption');
			var images = this.el.querySelectorAll('.gallery_card_image');
			var galleryCards = this.el.querySelectorAll('.gallery_card');
			var list = this.el.querySelector('.slick-list')
			var navigation = this.el.querySelectorAll('.image-gallery-navigation');

			var maxImageHeight = 0;
			var maxCaptionHeight = 0;
			var cardPadHeight = 0;

			var captionOrder = 2;
			var imgOrder = 1; 
			var orderIsReversed = false

			for(var i = 0; i < captions.length; i++){
				var caption = captions[i];
				var captionStyle = window.getComputedStyle(caption);

				maxCaptionHeight = Math.max(maxCaptionHeight, parseFloat(captionStyle.getPropertyValue('height')) +
					parseFloat(captionStyle.getPropertyValue('margin-top')) +
					parseFloat(captionStyle.getPropertyValue('margin-bottom'))
				);
				if ( i == 0){
					var captionStyle = window.getComputedStyle(caption);
					captionOrder = parseInt(captionStyle.order)
				}

			}

			// in case you are putting your caption at the bottom through CSS
			for(var i = 0; i < images.length; i++){
				var image = images[i];

				maxImageHeight = Math.max(maxImageHeight, image.offsetHeight );	
				if ( i == 0){
					var cardImgStyle = window.getComputedStyle(image);
					imgOrder = parseInt(cardImgStyle.order)
				}
			}

			if ( imgOrder > captionOrder ){
				orderIsReversed = true;
			}

			if ( galleryCards.length > 0){
				var galleryCardStyle = window.getComputedStyle(galleryCards[0]);
				cardPadHeight = (
					parseFloat(galleryCardStyle.getPropertyValue('margin-top')) +
					parseFloat(galleryCardStyle.getPropertyValue('margin-bottom')) +
					parseFloat(galleryCardStyle.getPropertyValue('padding-top')) +
					parseFloat(galleryCardStyle.getPropertyValue('padding-bottom'))
				);
			}


			if ( this.galleryOptions.data.constrain_height ) {
				_.each(navigation, function(nav){
					nav.style.marginTop = orderIsReversed ? maxCaptionHeight+'px' : ''
					nav.style.height = maxImageHeight+'px';
				});

				if ( orderIsReversed ){
					list.querySelector('.slick-track').style.alignItems = 'flex-end';
				} else {
					list.querySelector('.slick-track').style.alignItems = '';					
				}

			} else {
				_.each(navigation, function(nav){
					nav.style.marginTop = ''
					nav.style.height = '';			
				});				
			}


			list.style.width = Math.round(elRect.width)+'px'
			list.style.height = (maxImageHeight+maxCaptionHeight+cardPadHeight)+'px';

			_.each(galleryCards, function(card){
				card.style.width = Math.round(elRect.width)+'px';
			});

			this.elementH = elRect.height;

			this.el.setAttribute('data-drag-height', this.elementH);

			this.$el.slick('setPosition');

		},

		resizeImage: function(targetImage, scale){

			scale = Math.min(Math.max(5, Math.round(scale)), 100);

			var targetIndex = parseInt($(targetImage).closest('[data-gallery-item-id]').attr('data-gallery-item-id'));
			var targetMid = targetImage.getAttribute('data-mid');

			var currentScale = targetImage.hasAttribute('data-scale') ? parseInt(targetImage.getAttribute('data-scale') ) : 100;

			if ( targetIndex == 0 ){

				this.$el.find('.slick-cloned').last().find('[data-mid="'+targetMid+'"]').attr('data-scale', scale)

			} else if (targetIndex == this.images.length -1 ){

				this.$el.find('.slick-cloned').first().find('[data-mid="'+targetMid+'"]').attr('data-scale', scale)

			}

			if ( scale == 100 ){
				targetImage.removeAttribute('data-scale');
			} else {
				targetImage.setAttribute('data-scale', scale);
			}

			// trigger new sizes and refresh slideshow position
			Cargo.Plugins.elementResizer.update();


		}

	})


});
