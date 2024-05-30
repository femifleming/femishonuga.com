define([
	__cargo_context__ === "staging" ? '/_jsapps/imagegallery/base.js' : 'https://static.cargo.site/assets/builds/imagegallery/base.js'
],
function(
	GalleryBase
) {

	return GalleryBase.extend({

		// these ratios are local to the individual layout mode because the relative sizing of the captions will be different
		// from gallery to gallery
		cached_caption_pad_ratios : {

		},

		// same as above
		cached_el_sizes : {

		},

		name: 'Columns',
		parentView: null,

		/**
		 * Set attributes to el for layout options.
		 *
		 */
		setElAttributes: function () {

			var model_data = Object.assign({}, this.galleryOptions.data);
			if ( this.mobile_active && model_data.responsive){
				model_data = _.extend(Object.assign({},model_data), model_data.mobile_data);
			}
			if ( parseFloat(model_data.padding) > 0){
				this.el.removeAttribute('data-padding-zero', '')
			} else {
				this.el.setAttribute('data-padding-zero', '')
			}

			this.el.classList.remove('slick');
			this.el.removeAttribute('zero-height');
			
			this.el.removeAttribute('image-gallery-horizontal-align');
			this.el.removeAttribute('image-gallery-vertical-align');
			this.el.removeAttribute('data-exploded');
			this.el.removeAttribute('image-gallery-row');
			this.el.removeAttribute('data-slideshow-in-transition')

			this.el.setAttribute('image-gallery',this.name.toLowerCase());
			this.el.setAttribute('image-gallery-row','');
			this.el.setAttribute('image-gallery-pad',model_data.image_padding);
			this.el.setAttribute('image-gallery-gutter',model_data.image_padding * 2);
			this.el.setAttribute('style','');

		},

		/**
		 * Bind event listeners.
		 *
		 * @return {Object} this
		 */
		initialize: function (options) {

			if (!options){
				return
			}

			if( options.parentView) {
				this.parentView = options.parentView;
			}

			if ( options.galleryOptions){
				this.galleryOptions = Object.assign({}, options.galleryOptions)
			}

			if ( options.mobile_active){
				this.mobile_active = options.mobile_active
			}


			this.requestTick = _.bind(this.requestTick, this);
			Cargo.Event.once('BaseUnit:set', function(){
				this.cached_el_sizes = {};
			}, this);
			Cargo.Event.on('BaseUnit:refresh', this.requestTick);

			this.triggerElementResizerUpdate = _.bind(this.triggerElementResizerUpdate, this);

			// .render() is called from inside parent view

			// this.model = thumbnail settings. Render on change to dynamically update
			// this.listenTo(this.model, 'change', this.handleUpdates);

			return this;
		},

		mobileToggle: function(){

			var isMobileSize = Cargo.Helper.IsMobileWindowSize( baseUnit.cache.window.w )

			if ( !this.mobile_active && isMobileSize ){
				this.mobile_active = true;
				this.handleUpdates(null, {changing: 'mobile_active'})

			} else if ( this.mobile_active && !isMobileSize ){
				if ( this.parentView)
				this.mobile_active = false;
				this.handleUpdates(null, {changing: 'mobile_active'})

			}

		},

		requestTick: function(){
			var _this = this;
			if ( !this.ticking ){
				window.requestAnimationFrame(function(){
					_this.mobileToggle();
					_this.ticking = false;
				})
			}
			this.ticking = true;			
		},

		destroy: function(){
			Cargo.Event.off('BaseUnit:refresh', this.requestTick);
		},

		/**
		 * Handle the changes to the model triggered from the admin panel
		 * @param  {Object} event
		 * @param  {Object} options sent from settings model, changing and value
		 */
		handleUpdates: function(galleryOptions, options){


			if ( galleryOptions ){
				this.galleryOptions = Object.assign({}, galleryOptions);
			}


			switch (options.changing) {

				case 'responsive_image_padding':
					if ( this.mobile_active ){
						this.updatePadding();
					}

					break;
				case 'image_padding':

					if ( !this.mobile_active || !this.galleryOptions.data.responsive){
						this.updatePadding();
					}

					break;

				case 'mobile_active':
					if ( this.galleryOptions.data.responsive ){
						this.render();
					}
					break;
					
				case 'captions':

					this.render();

					break;					

				case 'responsive':
					if ( this.mobile_active){
						this.render();
					}
    				break;

				case 'thumbnail_mode':
					break;

				case 'responsive_columns':
				case 'columns':
					this.render();
					break;

				default:
				    break;
			}

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


			const rects = this.parentView.cachedRects.rects

			var targetNext = targetPrev = horizVertical = indicatePrev = indicateNext = "default";
			var percX, percY;

			if ( rects[closestThumb].positions.inside ){
				percX = rects[closestThumb].positions.midpoint_run / (rects[closestThumb].width * -.5);
				percY = rects[closestThumb].positions.midpoint_rise / (rects[closestThumb].height * -.5);
			} else {

				if (closestThumb == closestThumbToRight){
					percX = 1;
				} else if ( closestThumb == closestThumbToLeft ){
					percX = -1;
				}  else {
					percX = m.x > rects[closestThumb].midPoint.x ? 1: -1;
				}

				if ( closestThumb == closestThumbAbove ){
					percY = -1;
				} else if ( closestThumb == closestThumbBelow ) {
					percY = 1;
				} else {
					percY = m.y > rects[closestThumb].midPoint.y ? 1: -1;
				}

			}

			// if we are inside the thumb, test if we favor a specific side
			if (
				percX > 0
				&& (
					(
						(
							(
								rects[closestThumb].positions.inside
								&& rects[closestThumb].top == rects[closestThumbToRight].top
								&& parseInt(closestThumb) == parseInt(closestThumbToRight)-1
							)
							|| (
								!rects[closestThumb].positions.inside
								&& (
									(
										closestThumb == closestThumbToRight
										&& rects[closestThumbToLeft].top == rects[closestThumb].top
									)
									|| (
										rects[closestThumbToLeft].top == rects[closestThumbToRight].top
										&& parseInt(closestThumbToLeft) == parseInt(closestThumbToRight)-1
									)
								)
							)
						)
						&& Math.abs(percX) >= Math.abs(percY*1.2) + -.2
					)
					|| (
						percY < 0
						&& (
							closestThumbAbove == "default"
						)
					)
				)
			){

				if ( closestThumb == closestThumbToRight ){
					targetNext = closestThumbToRight;
					targetPrev = closestThumbToLeft;
				} else {
					targetNext = closestThumbToRight;
					targetPrev = closestThumb;
				}

				horizVertical = "horizontal"

			} else if (

				percX <= 0
				&& (
					(
						(
							(
								rects[closestThumb].positions.inside
								&& rects[closestThumb].top == rects[closestThumbToLeft].top
								&& parseInt(closestThumbToLeft) == parseInt(closestThumb)-1
							)
							|| (
								!rects[closestThumb].positions.inside
								&& (
									(
										closestThumb == closestThumbToLeft
										&& rects[closestThumbToRight].top == rects[closestThumb].top
									)
									|| (
										rects[closestThumbToLeft].top == rects[closestThumbToRight].top
										&& parseInt(closestThumbToLeft) == parseInt(closestThumbToRight)-1
									)
								)
							)
						)
						&& Math.abs(percX) >= Math.abs(percY*1.2) + -.2
					)
					|| (
						percY < 0
						&& (
							closestThumbAbove == "default"
						)
					)
				)
			){

				if ( closestThumb == closestThumbToLeft){
					targetNext = closestThumbToRight;
					targetPrev = closestThumbToLeft;
				} else {
					targetNext = closestThumb;
					targetPrev = closestThumbToLeft;
				}

				horizVertical = "horizontal"
			} else {

				if ( rects[closestThumb].positions.inside ){


					if ( percY >= 0 ) {

						var nextThumb = this.$el.find('[data-gallery-item-id="'+closestThumb+'"]').next('[data-gallery-item-id]')
						if ( nextThumb.length> 0){
							targetNext = nextThumb.attr('data-gallery-item-id')
						}
						targetPrev = closestThumb;

					} else {

						var prevThumb = this.$el.find('[data-gallery-item-id="'+closestThumb+'"]').prev('[data-gallery-item-id]')
						if ( prevThumb.length> 0){
							targetPrev = prevThumb.attr('data-gallery-item-id')
						}
						targetNext = closestThumb;
					}

				} else {
					if ( closestThumbAbove == closestThumb) {

						var nextThumb = this.$el.find('[data-gallery-item-id="'+closestThumb+'"]').next('[data-gallery-item-id]')
						if ( nextThumb.length> 0){
							targetNext = nextThumb.attr('data-gallery-item-id')
						}
						targetPrev = closestThumb;

					} else {

						var prevThumb = this.$el.find('[data-gallery-item-id="'+closestThumb+'"]').prev('[data-gallery-item-id]')
						if ( prevThumb.length> 0){
							targetPrev = prevThumb.attr('data-gallery-item-id')
						}
						targetNext = closestThumb;
					}
				}



				horizVertical = "vertical";

			}

			indicatePrev = targetPrev;
			indicateNext = targetNext;

			if( horizVertical =='horizontal' ){

				if ( targetNext == 'default' ){
					targetNext = parseInt(this.$el.find('[data-gallery-item-id="'+(parseInt(targetPrev)+1)+'"]').attr('data-gallery-item-id'));
					// indicateNext ='default'
				} else {

					if ( targetPrev == 'default'){
						indicateNext = 0
					} else {
						indicateNext = parseInt(this.$el.find('[data-gallery-item-id="'+(parseInt(targetPrev)+1)+'"]').attr('data-gallery-item-id'));
					}

				}

				if ( targetPrev == 'default' ){
					targetPrev = parseInt(this.$el.find('[data-gallery-item-id="'+(parseInt(targetPrev))+'"]').attr('data-gallery-item-id'));
					// indicatePrev ='nope!!!!!'
				} else {
					indicatePrev = parseInt(this.$el.find('[data-gallery-item-id="'+(parseInt(targetPrev))+'"]').attr('data-gallery-item-id'));
				}

			} else {

				// if we are at the bottom of the gallery, choose whether or not to display the 'prev indication or not'
				if (targetNext == 'default')	{

					var columns = this.$el.find('div[column]')
					var minHeight = 9e9;
					var shortestColumnIndex = 1;

					columns.each(function(i){
						var index = i+1;
						var height = this.getBoundingClientRect().height;
						if ( height < minHeight ){
							shortestColumnIndex = index;
							minHeight = height;
						}
					});

					if ( parseInt(this.$el.find('[data-gallery-item-id="'+targetPrev+'"]').closest('div[column]').attr('column')) != shortestColumnIndex ) {
						indicatePrev = "default"
					} else {
						indicatePrev = targetPrev
					}

					targetNext = 9e9;

				}

			}

			this.$el.find('.indication-prev, .indication-next').removeClass('indication-prev indication-next');

			var rotatedPrevItem = this.$el.find('[data-gallery-item-id="'+indicatePrev+'"] [data-rotation]');
			var rotatedNextItem = this.$el.find('[data-gallery-item-id="'+indicateNext+'"] [data-rotation]');
			var nextRotation = 0;
			var prevRotation = 0;

			if ( rotatedPrevItem.length >0){
				prevRotation = rotatedPrevItem.attr('data-rotation');
			}

			if ( rotatedNextItem.length >0){
				nextRotation = rotatedNextItem.attr('data-rotation');
			}

			if ( horizVertical == 'horizontal' ){

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

			} else {

				if ( indicatePrev != 'default' ){

					this.$el.find('[data-gallery-item-id="'+indicatePrev+'"]').addClass('indication-prev').css({
						'transform' : 'translateY(-2.5rem) rotate('+prevRotation+'deg)',
						'transition' : 'transform .08s cubic-bezier(0, 0, 0, 1)',
						'position': 'relative',
						'z-index' : '99'
					})

				}

				if ( indicateNext != 'default' ){

					this.$el.find('[data-gallery-item-id="'+indicateNext+'"]').addClass('indication-next').css({
						'transform' : 'translateY(2.5rem) rotate('+nextRotation+'deg)',
						'transition' : 'transform .08s cubic-bezier(0, 0, 0, 1)',
						'position': 'relative',
						'z-index' : '99'
					})

				}
			}

			var galleryCards = 	this.$el.find('.gallery_card').not('.indication-next, .indication-prev');
			galleryCards.each(function(card){

				var $card = $(this);
				var rotation = 0;
				var rotationItem = $card.find('[data-rotation]');
				if ( rotationItem.length >0 ){
					rotation = rotationItem.attr('data-rotation');
				}
				$card.css({
					'position': '',
					'transform' : rotation ? 'rotate('+rotation+'deg)': '',
					'z-index' : ''
				})
			})

			this.parentView.insertionPoint = targetNext

		},

		resetIndication: function(){

			this.parentView.insertionPoint = 0;

			var $galleryCards = this.$el.find('.gallery_card');
			$galleryCards.each(function(index, card){

				var $card = $(this);
				var rotation = 0;
				var rotationItem = $card.find('[data-rotation]');
				if ( rotationItem.length >0 ){
					rotation = rotationItem.attr('data-rotation');
				}
				$card.css({
					'position': '',
					'transform' : rotation ? 'rotate('+rotation+'deg)': '',
					'z-index' : ''
				})
			})
			$galleryCards.removeClass('indication-next indication-prev')

		},

		/**
		 * @return {Object} this
		 */

		render: function () {

			var _this = this;
			var model_data = Object.assign({}, this.galleryOptions.data);
			if ( this.mobile_active && model_data.responsive){
				model_data = _.extend(Object.assign({},model_data), model_data.mobile_data);
			}

			// set defaults for galleries that havent gotten updated settings
			if ( !model_data.hasOwnProperty('captions') ){
				model_data.captions = true;
			}

			var fragment = document.createDocumentFragment();

			var padding = parseFloat(model_data.image_padding);

			var baseSize = baseUnit.cache.size;
			var baseWidth = baseUnit.cache.window.w;



			var pad_caption_key = 'pad_'+model_data.image_padding+'_col_'+model_data.column_size+'_fontSize_'+baseSize;
			var col_padding_ratio = 0;
			var caption_padding_ratio = 0;

			if ( this.cached_caption_pad_ratios.hasOwnProperty(pad_caption_key)){
				caption_padding_ratio = this.cached_caption_pad_ratios[pad_caption_key];
			} else {

				var caption_measure = document.createElement('DIV')
				caption_measure.className = 'gallery_card'
				caption_measure.setAttribute('image-gallery-col', 'x'+model_data.column_size)
				caption_measure.setAttribute('image-gallery-pad', model_data.image_padding)
				var caption_inner = document.createElement('DIV')
				caption_inner.className = 'gallery_image_caption'
				caption_inner.innerText ='Testing Text'

				caption_measure.appendChild(caption_inner)
				this.el.appendChild(caption_measure);

				var captionRect = caption_inner.getBoundingClientRect();

				if ( captionRect.width != 0 ){
					caption_padding_ratio = captionRect.height/captionRect.width;
					this.cached_caption_pad_ratios[pad_caption_key] = caption_padding_ratio;
				}

			}

			if ( padding != 0){

				var cachedPadding = Cargo.Core.ImageGallery.getCachedPaddingSize(baseSize, padding);
				var pad_size = 0;
				var elWidth = 0;

				var el_pad_key ='windowWidth_'+baseWidth;

				if ( this.cached_el_sizes.hasOwnProperty(baseWidth) ){
					elWidth = this.cached_el_sizes[el_pad_key];
				} else {

					var measurement_wrapper = document.createElement('DIV')
						measurement_wrapper.setAttribute('image-gallery-pad', model_data.image_padding)
						measurement_wrapper.style.boxSizing = "border-box"
						measurement_wrapper.style.width = "100%"
						measurement_wrapper.style.height = "10px"

					var measurement_inner = document.createElement('DIV')
						measurement_inner.style.width = "100%"
						measurement_inner.style.boxSizing = "border-box"
						measurement_inner.style.height = "10px"
						measurement_inner.className = "measure_inner"

					measurement_wrapper.appendChild(measurement_inner)

					this.el.appendChild(measurement_wrapper)
					elWidth = measurement_inner.getBoundingClientRect().width;
					this.cached_el_sizes[el_pad_key] = elWidth
				}


				if ( cachedPadding ){

					pad_size = cachedPadding

				} else {

					var measure_div_container = document.createElement('DIV');

					measure_div_container.style.cssText = 'position: fixed; top: -999px; left: -9999px; width: 0;'
					if ( model_data.responsive && this.mobile_active ){
						measure_div_container.setAttribute('responsive-layout','')
					}

					for (var j = 0; j < 10; j++){
						var measure_div = document.createElement('DIV')
						measure_div.setAttribute('image-gallery-pad', padding)
						measure_div_container.appendChild(measure_div)
					}

					this.el.appendChild(measure_div_container)
					pad_size = measure_div_container.getBoundingClientRect().height / 10;
					if ( pad_size !== 0){
						Cargo.Core.ImageGallery.setCachedPaddingSize(baseSize, pad_size, padding);
					}
				}

				col_padding_ratio = pad_size / ((elWidth / model_data.columns) - pad_size)

			} else {
				col_padding_ratio = 0;
			}



			var column_heights = [];
			var shortest_column = 0;
			var columns = [];

			for (var i = 0; i < model_data.columns; i++){
				column_heights[i] = 0;
				columns[i] = document.createElement('div');
				columns[i].setAttribute('column', i+1);
				columns[i].setAttribute('image-gallery-col', 'x'+model_data.column_size);
			}

			var images = _.sortBy(this.parentView.images, 'index');

			_.each( images, function(imageObject, index) {

				var image = _this.createItem(imageObject);

				image.setAttribute('data-gallery-item', '');
				image.setAttribute('data-gallery-item-index', index);

				// if this is being run as a mobile subview, maintain meta data when rendering

				var parentViewPath = _this.parentView.options.path ;
				if ( _this.parentView.options.path != 'columns' ){

					var meta_data = {}
					if ( _.property(index)(model_data.meta_data)  ){
						meta_data[parentViewPath] = model_data.meta_data[index]
					} else {
						meta_data[parentViewPath] = imageObject.meta
					}
					image.setAttribute('data-meta', JSON.stringify(meta_data));

				}

				var shortest_height = 9e9;

				for (var j =0; j < column_heights.length; j++){

					if ( column_heights[j] < shortest_height){
						shortest_height = column_heights[j];
						shortest_column = j;
					}

				}

				var interiorImages = image.querySelectorAll('img[width][height], iframe[width][height], video[width][height]')
				var caption = document.createElement('DIV')
				var isLink = false

				caption.className = 'gallery_image_caption'
				if ( imageObject.caption ){
					if (  /<[a-z][\s\S]*>/i.test(imageObject.caption)  ){
						caption.innerHTML = imageObject.caption;
					} else {
						caption.innerText = imageObject.caption;
					}
				}

				_.each(interiorImages, function(interiorImage){

					if ( interiorImage.hasAttribute('data-elementresizer-child') ){
						return
					}

					interiorImage.setAttribute('data-elementresizer-no-resize' , '');
					interiorImage.setAttribute('data-elementresizer-no-centering' , '');
					interiorImage.setAttribute('data-elementresizer-no-vertical-resize', '');
					interiorImage.removeAttribute('data-icon-mode');

					interiorImage.style.width = ''
					interiorImage.style.height = ''
				});

				if ( image.hasAttribute('width') && image.hasAttribute('height') && !image.hasAttribute('data-elementresizer-child') ){
					image.setAttribute('data-elementresizer-no-resize' , '');
					image.setAttribute('data-elementresizer-no-centering' , '');
					image.setAttribute('data-elementresizer-no-vertical-resize', '');
					image.removeAttribute('data-icon-mode');

					image.style.width = ''
					image.style.height = ''
				}

				var ratio,
					thumb;

				if ( image.tagName === 'A' && interiorImages.length == 1 ){

					isLink = true
					thumb = image;
					ratio = interiorImages[0].getAttribute('height')/ interiorImages[0].getAttribute('width');
				} else {
					ratio = image.getAttribute('height')/image.getAttribute('width')
					thumb = document.createElement('DIV')
				}

				var setRotation = false;
				if ( !isNaN(imageObject.rotation) && imageObject.rotation !== 0 && imageObject.rotation!== 360 ){
					setRotation = true;
				}


				if ( imageObject.draggable){
					thumb.setAttribute('data-draggable', '')
				}

				thumb.setAttribute('class' , 'gallery_card');
				if ( imageObject.activeClass){
					image.classList.add('active')
				}				
				// thumb.setAttribute('image-gallery-col' , 'x' + model_data.column_size);
				thumb.setAttribute('image-gallery-pad' , model_data.image_padding);
				thumb.setAttribute('data-gallery-item-id' , index);
				thumb.style.transform = setRotation ? 'rotate('+imageObject.rotation+'deg)' : ''

				var thumb_inner = document.createElement('DIV')

				if ( isLink ){

					interiorImages[0].removeAttribute('data-scale');
					interiorImages[0].style.width = '';
					interiorImages[0].style.height = '';
					interiorImages[0].style.margin = '';
					thumb_inner.appendChild(interiorImages[0])

				} else {

					image.removeAttribute('data-scale');
					image.style.width = '';
					image.style.height = '';
					image.style.margin = '';
					thumb_inner.appendChild(image);
				}

				thumb_inner.setAttribute('class', 'gallery_card_image');
				thumb_inner.setAttribute('data-elementresizer-no-resize' , '');
				thumb_inner.setAttribute('data-elementresizer-no-centering' , '');
				thumb_inner.setAttribute('style', 'height: 0px; padding-bottom: ' + (ratio*100) + '%');


				thumb.appendChild(thumb_inner)

				if ( imageObject.caption ){
					if (  /<[a-z][\s\S]*>/i.test(imageObject.caption)  ){
						caption.innerHTML = imageObject.caption;
					} else {
						caption.innerText = imageObject.caption;
					}
				}

				if ( imageObject.caption && model_data.captions ){
					thumb.appendChild(caption);
					thumb.classList.add('has_caption');
					column_heights[shortest_column]+= ratio + col_padding_ratio + caption_padding_ratio;

				} else {
					column_heights[shortest_column]+= ratio + col_padding_ratio;
				}

				columns[shortest_column].appendChild(thumb)

			});

			for (var k = 0; k < model_data.columns; k++){
				fragment.appendChild(columns[k]);
			}

			if ( Cargo.Helper.IsAdminEdit() ){

				this.el.innerHTML = '';
				this.el.appendChild(fragment);

			} else {

				var newEl = document.createElement('div');
				var elAttributes = this.el.attributes;

				_.each(elAttributes, function(attr){
					newEl.setAttribute(attr.name, attr.value);
				});

				newEl.appendChild(fragment)
				var oldEl = this.el;
				oldEl.parentNode.insertBefore(newEl, oldEl);
				oldEl.parentNode.removeChild(oldEl);
				this.parentView.setElement(newEl)
			}

			this.setElAttributes();

			this.el.classList.add('initialized');
			this.rendered = true;
			Cargo.Plugins.elementResizer.requestRefreshTick();
			Cargo.Event.trigger('image_gallery_rendered', this);
			return this;

		},

		updatePadding: function(){

			var model_data = Object.assign({}, this.galleryOptions.data);

			if ( this.mobile_active && model_data.responsive){
				model_data = _.extend(Object.assign({},model_data), model_data.mobile_data);
			}

			var thumbs = this.el.querySelectorAll('.gallery_card')

			for (var i = 0; i< thumbs.length; i++){
				thumbs[i].setAttribute('image-gallery-pad', model_data.image_padding)
			}

			this.el.setAttribute('image-gallery-pad', model_data.image_padding)
			this.el.setAttribute('image-gallery-gutter', model_data.image_padding * 2)

			this.triggerElementResizerUpdate();

		},

		triggerElementResizerUpdate: _.debounce(function(){
			Cargo.Plugins.elementResizer.requestTick();
		}, 300)


	})


});
