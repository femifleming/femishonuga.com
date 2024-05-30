define([

],
function(

) {	
	return Backbone.View.extend({

		constructor: function(){

			// call super constructor
			Backbone.View.prototype.constructor.apply( this, arguments );

			this.compileItemDescriptors();

		},

		createItem: function(itemDescriptor, clean){

			// use clean to generate clean items not for gallery use
			
			switch(itemDescriptor.type){

				case 'video' :

					var el = document.createElement('video');

					if ( !clean ){
						el.__galleryItemUID__ = itemDescriptor.data.uid;
						el.__galleryInstanceUID__ = this.galleryOptions.gallery_instance_id;

						el.setAttribute('data-gallery-item-index', itemDescriptor.index)
						el.setAttribute('data-gallery-uid', itemDescriptor.data.uid)

						if ( !_.isEmpty(itemDescriptor.meta)){
							el.setAttribute('data-meta', JSON.stringify(itemDescriptor.meta) )
						}						
					}

					el.setAttribute('width', itemDescriptor.width)
					el.setAttribute('height', itemDescriptor.height)

					if ( itemDescriptor.mediaSrcs.length == 1 ){

						el.setAttribute('src',itemDescriptor.mediaSrcs[0].src );
						el.setAttribute('type',itemDescriptor.mediaSrcs[0].type );

					} else {

						_.each( itemDescriptor.mediaSrcs, function(sourceObj) {

							var source = document.createElement('SOURCE');
							source.setAttribute('src',sourceObj.src );
							source.setAttribute('type',sourceObj.type );
							el.appendChild(source);

						});
					}

					if ( itemDescriptor.playsinline){
						el.setAttribute('playsinline', '')									
					};

					if ( itemDescriptor.muted){
						el.setAttribute('muted', '')									
					};

					if ( itemDescriptor.autoplay){
						el.setAttribute('autoplay', '')
					};

					if ( itemDescriptor.loop){
						el.setAttribute('loop', '')					
					};

					if ( itemDescriptor.controls){
						el.setAttribute('controls', '')					
					};
					if ( itemDescriptor.controlsList){
						el.setAttribute('controlslist', itemDescriptor.controlsList)					
					};					

					if ( itemDescriptor.poster){
						el.setAttribute('poster', itemDescriptor.poster)					
					};	

					if ( itemDescriptor.alt ){
						el.setAttribute('alt', itemDescriptor.alt)
					};

					if ( itemDescriptor.title ){
						el.setAttribute('title', itemDescriptor.title)
					};					

					if ( itemDescriptor.caption ){
						el.setAttribute('data-caption', itemDescriptor.caption)
					};

					if ( itemDescriptor.scale ){
						el.setAttribute('data-scale', itemDescriptor.scale)
					};

					if ( itemDescriptor.rotation ){
						el.setAttribute('data-rotation', itemDescriptor.rotation)
					};

					if ( itemDescriptor.logoMode ){
						el.setAttribute('data-icon-mode', '')
					};

					if ( itemDescriptor.draggable ){
						el.setAttribute('data-draggable', '')
					};

					return el;
					break;

				case 'frame' :

					var el = document.createElement('iframe');

					if ( !clean ){
						el.__galleryItemUID__ = itemDescriptor.data.uid;
						el.__galleryInstanceUID__ = this.galleryOptions.gallery_instance_id;

						el.setAttribute('data-gallery-item-index', itemDescriptor.index)
						el.setAttribute('data-gallery-uid', itemDescriptor.data.uid)


						if ( !_.isEmpty(itemDescriptor.meta)){
							el.setAttribute('data-meta', JSON.stringify(itemDescriptor.meta) )
						}						
					}					

					el.setAttribute('frameborder', '0')
					
					el.setAttribute('width', itemDescriptor.width);
					el.setAttribute('height', itemDescriptor.height);
					el.setAttribute('src', itemDescriptor.itemSrc);
					el.setAttribute('allowFullScreen','');
					
					if( itemDescriptor.allow){
						el.setAttribute('allow', itemDescriptor.allow);	
					}

					if ( itemDescriptor.alt ){
						el.setAttribute('alt', itemDescriptor.alt)
					};

					if ( itemDescriptor.title ){
						el.setAttribute('title', itemDescriptor.title)
					};	

					if ( itemDescriptor.caption ){
						el.setAttribute('data-caption', itemDescriptor.caption)
					};

					if ( itemDescriptor.scale ){
						el.setAttribute('data-scale', itemDescriptor.scale)
					};

					if ( itemDescriptor.rotation ){
						el.setAttribute('data-rotation', itemDescriptor.rotation)
					};	

					if ( itemDescriptor.draggable ){
						el.setAttribute('data-draggable', '')
					};					

					return el;		
					break;

				case 'image': 

					var el = document.createElement('img');

					if ( !clean ){
						el.__galleryItemUID__ = itemDescriptor.data.uid;
						el.__galleryInstanceUID__ = this.galleryOptions.gallery_instance_id;

						el.setAttribute('data-gallery-item-index', itemDescriptor.index)
						el.setAttribute('data-gallery-uid', itemDescriptor.data.uid)

						if ( !_.isEmpty(itemDescriptor.meta)){
							el.setAttribute('data-meta', JSON.stringify(itemDescriptor.meta) )
						}
					}

					el.setAttribute('width', itemDescriptor.width)
					el.setAttribute('height', itemDescriptor.height)
					el.setAttribute('src', itemDescriptor.itemSrc || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")

					if ( itemDescriptor.itemSrcO ){
						el.setAttribute('data-src', itemDescriptor.itemSrcO || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")
					};

					if ( itemDescriptor.mid ){
						el.setAttribute('data-mid', itemDescriptor.mid)
					};

					if ( itemDescriptor.noZoom ){
						el.setAttribute('data-no-zoom', itemDescriptor.noZoom)
					};

					if ( itemDescriptor.caption ){
						el.setAttribute('data-caption', itemDescriptor.caption)
					};

					if ( itemDescriptor.alt ){
						el.setAttribute('alt', itemDescriptor.alt)
					};

					if ( itemDescriptor.title ){
						el.setAttribute('title', itemDescriptor.title)
					};

					if ( itemDescriptor.scale ){
						el.setAttribute('data-scale', itemDescriptor.scale)
					}

					if ( itemDescriptor.rotation ){
						el.setAttribute('data-rotation', itemDescriptor.rotation)
					};

					if ( itemDescriptor.draggable ){
						el.setAttribute('data-draggable', '')
					};							
					if ( itemDescriptor.logoMode ){
						el.setAttribute('data-icon-mode', '')
					};		
					if ( itemDescriptor.markerID ){
						el.setAttribute('data-marker-id', itemDescriptor.markerID)
					};
						

					return el;
					break;

				case 'image_link':

					var el = document.createElement('a');

					if ( !clean ){
						el.__galleryItemUID__ = itemDescriptor.data.uid;

						el.setAttribute('data-gallery-uid', itemDescriptor.data.uid);
					}

					if ( itemDescriptor.dataProduct ){
						el.setAttribute('data-product', itemDescriptor.dataProduct)
					}

					if ( itemDescriptor.dataVariant ){
						el.setAttribute('data-variant', itemDescriptor.dataVariant)
					}

					if ( itemDescriptor.rel ){
						el.setAttribute('rel', itemDescriptor.rel)
					}

					if ( itemDescriptor.tags ){
						el.setAttribute('data-tags', itemDescriptor.tags)
					}

					if ( itemDescriptor.target ){
						el.setAttribute('target', itemDescriptor.target)
					}	

					if ( itemDescriptor.skuID && itemDescriptor.productID ){
						el.setAttribute('data-product', itemDescriptor.productID);
						el.setAttribute('data-sku', itemDescriptor.skuID);
					} 

					if ( itemDescriptor.referrer ){
						el.setAttribute('referrer', itemDescriptor.referrer)
					};

					if ( !clean && itemDescriptor.activeClass){
						el.classList.add('active');
					}


					el.setAttribute('href', itemDescriptor.href);

					var descriptorClone = _.clone(itemDescriptor);

					var interiorItem;

					switch(itemDescriptor.childTagName) {

						case 'IMG':
							descriptorClone.type = 'image'
							interiorItem = this.createItem(descriptorClone, true);

							if ( clean ){
								el.setAttribute('class', 'image-link')								
							}

							break;

						case 'VIDEO':
							descriptorClone.type = 'video'
							interiorItem = this.createItem(descriptorClone, true);
							break;

						case 'IFRAME':
							descriptorClone.type = 'frame'										
							interiorItem = this.createItem(descriptorClone, true);
							break;						

						default:
							return
					}

					if ( !clean ){
						interiorItem.setAttribute('data-gallery-item-index', itemDescriptor.index)	

						if ( !_.isEmpty(itemDescriptor.meta) ){
							interiorItem.setAttribute('data-meta', JSON.stringify(itemDescriptor.meta));							
						}
					}

					el.appendChild(interiorItem);

					return el;
					break;
			}
		},

		itemDescriptors: [

			{
				type: 'video',
				tagName: 'video',
				matches: function(el){

					return el.nodeName === "VIDEO" && el.hasAttribute('width') && el.hasAttribute('height') && !el.hasAttribute('data-exclude-item');

				}
			},

			{
				type: 'frame',
				tagName: 'iframe',
				matches: function(el){

					return el.nodeName === "IFRAME" && el.hasAttribute('width') && el.hasAttribute('height') && !el.hasAttribute('data-exclude-item');

				}
			},

			{
				type: 'image',
				tagName: 'img',
				matches: function(el){

					return el.nodeName === "IMG" && el.hasAttribute('width') && el.hasAttribute('height') && !el.hasAttribute('data-exclude-item') && (el.hasAttribute('src') || el.hasAttribute('data-mid'))  ;

				}
			},

			{
				type: 'image_link',
				tagName: 'a',
				findChildren: function(el){

					var firstImage = el.querySelectorAll('img[width][height], video[width][height], iframe[width][height]')[0];

					if(firstImage) {
						return [firstImage];
					}

					return [];

				},
				matches: function(el){

					return el.nodeName === "A" && el.querySelectorAll('img[width][height], video[width][height], iframe[width][height]').length > 0 && !el.hasAttribute('data-exclude-item');

				}
			}

		],

		compileItemDescriptors: function() { 

			this.allItemTagNames = [];

			_.each(this.itemDescriptors, function(descriptor){

				this.allItemTagNames = _.union(this.allItemTagNames, [descriptor.tagName]);

			}, this);

		},

		getGalleryItems: function(){

			// if there is an item passed through, we use it, otherwise we find items in the element
			var candidateElements = this.el.querySelectorAll(this.allItemTagNames.join(',')),
				results = [];

			if(candidateElements.length > 0) {

				var handledElements = [],
					matchedDescriptor,
					matchedChildren,
					i;

				_.each(candidateElements, function(el, index){

					if(handledElements.indexOf(el) !== -1) return;

					matchedDescriptor = _.filter(this.itemDescriptors, function(d){
						return d.matches(el);
					})[0];

					if(matchedDescriptor !== undefined) {

						matchedChildren = [];

						// if we are wrapping a link around an image, look for the uid around that image and hoist it onto the link
						var preexistingUID = undefined;

						// check for child elements
						if(matchedDescriptor.findChildren) {

							matchedChildren = matchedDescriptor.findChildren(el);

							for(i = 0; i < matchedChildren.length; i++) {
								if(matchedChildren[i].__galleryItemUID__){
									preexistingUID = matchedChildren[i].__galleryItemUID__;
								}
								handledElements.push(matchedChildren[i]);
							}

						}

						results.push({
							el: el,
							children: matchedChildren,
							type: matchedDescriptor.type,
							UID: el.__galleryItemUID__ || preexistingUID
						});

					}

					handledElements.push(el);

				}, this);

			}

			return results;

		},

		serialize: function(){

			var items = this.getGalleryItems(),
				list = {};

			_.each(items, function(item, index){

				var itemSrc,
					mediaSrcs = [],
					href,
					allow,
					activeClass,
					target,
					productID,
					skuID,
					markerID,
					rel,
					dataProduct,
					dataVariant,
					tags,
					autoplay,
					muted,
					loop,
					poster,
					controls,
					controlsList,
					playsinline,
					caption,
					height, 
					width,
					scale,
					rotation,
					draggable,
					logoMode,
					noZoom,
					childTagName,
					itemIndex,
					mid,
					alt,
					title,
					referrer,
					meta = {},
					isNew = false;

				if(!item.UID) {

					item.UID = _.uniqueId();
					isNew = true;
				}

				if(list.hasOwnProperty(item.UID)) {
					return;
				}

				if(item.type === "image_link") {
					allow = item.children[0].getAttribute('allow') || '';
					itemSrc = item.children[0].getAttribute('src') || '';
					itemSrcO = item.children[0].getAttribute('data-src') || '';
					href = item.el.getAttribute('href');
					activeClass = item.el.classList.contains('active');
					rel = item.el.rel;
					dataProduct = item.el.getAttribute('data-product');
					dataVariant = item.el.getAttribute('data-variant');
					tags = item.el.getAttribute('data-tags');					
					target = item.el.target;
					autoplay = item.children[0].hasAttribute('autoplay') || item.children[0].hasAttribute('data-autoplay');
					controls = item.children[0].hasAttribute('controls');
					controlsList = item.children[0].getAttribute('controlslist');
					playsinline = item.children[0].hasAttribute('playsinline') || item.children[0].hasAttribute('webkit-playsinline');

					// product links
					productID = (item.el.hasAttribute('data-product') ? item.el.getAttribute('data-product') : undefined);
					skuID = (item.el.hasAttribute('data-sku') ? item.el.getAttribute('data-sku') : undefined);

					markerID = (item.children[0] && item.children[0].hasAttribute('data-marker-id') ? item.children[0].getAttribute('data-marker-id') : undefined);

					muted = item.children[0].hasAttribute('muted');
					loop = item.children[0].hasAttribute('loop');
					poster = item.children[0].getAttribute('poster');
					childTagName = item.children[0].tagName;

					if ( childTagName === 'VIDEO'){
						
						if ( item.children[0].hasAttribute('src') ){

							mediaSrcs = [
								{
									src : item.children[0].getAttribute('src'),
									type: item.children[0].getAttribute('type')
								}
							];

						} else if ( item.children[0].children.length > 0  ){

							_.each(item.children[0].children, function(source){

								if ( source.tagName === 'SOURCE'){
									mediaSrcs.push({
										src: source.getAttribute('src'),
										type: source.getAttribute('type')
									})
								}
							});

						}

					}					

					// if this is an initial gathering, then the item doesn't have an itemIndex so it is assigned	
					if( item.el.hasAttribute('data-gallery-item-index') ) {

						itemIndex = parseInt(item.el.getAttribute('data-gallery-item-index'));

					// if the link itself is newly created but it's around a previously created element, we grab the index from that element	
					} else if ( item.children[0].hasAttribute('data-gallery-item-index') ) {

						itemIndex = parseInt(item.children[0].getAttribute('data-gallery-item-index'));

					} else {

						itemIndex = index;

					}

					// metadata _should_ be stored on the interior image element
					if ( item.children[0].hasAttribute('data-meta') ) {

						meta = Cargo.Core.ImageGallery.parseGalleryOptions(item.children[0].getAttribute('data-meta'));

					}
					if(item.children[0].hasAttribute('alt')) {
						alt = item.children[0].getAttribute('alt');
					}
					if(item.children[0].hasAttribute('title')) {
						title = item.children[0].getAttribute('title');
					}					

					noZoom = item.children[0].hasAttribute('data-no-zoom');					
					draggable = item.children[0].hasAttribute('data-draggable');
					logoMode = item.children[0].hasAttribute('data-icon-mode');

					if(item.children[0].hasAttribute('data-scale')) {
						scale = item.children[0].getAttribute('data-scale');
					}

					if(item.children[0].hasAttribute('data-rotation')) {
						rotation = item.children[0].getAttribute('data-rotation');
					}				

					if(item.children[0].hasAttribute('data-caption')) {
						caption = item.children[0].getAttribute('data-caption');
					}

					if(item.children[0].hasAttribute('data-mid')) {
						mid = item.children[0].getAttribute('data-mid');
					}

					if(item.children[0].hasAttribute('width')) {
						width = item.children[0].getAttribute('width');
					}

					if(item.children[0].hasAttribute('height')) {
						height = item.children[0].getAttribute('height');
					}

				} else {
					
					itemSrc = item.el.getAttribute('src') || null;
					allow = item.el.getAttribute('allow') || '';
					
					if ( item.type == 'video'){

						if ( item.el.hasAttribute('src') ){

							mediaSrcs = [
								{
									src : item.el.getAttribute('src'),
									type: item.el.getAttribute('type')
								}
							];

						} else if ( item.el.children.length > 0  ){

							_.each(item.el.children, function(source){

								if ( source.tagName === 'SOURCE'){
									mediaSrcs.push({
										src: source.getAttribute('src'),
										type: source.getAttribute('type')
									})
								}
							});
						}
					
					}


					itemSrcO = item.el.getAttribute('data-src') || null;

					autoplay = item.el.hasAttribute('autoplay') || item.el.hasAttribute('data-autoplay');
					controls = item.el.hasAttribute('controls');
					controlsList = item.el.getAttribute('controlslist');
					playsinline = item.el.hasAttribute('playsinline') || item.el.hasAttribute('webkit-playsinline');

					markerID = (item.el.hasAttribute('data-marker-id') ? item.el.getAttribute('data-marker-id') : undefined);

					muted = item.el.hasAttribute('muted');
					loop = item.el.hasAttribute('loop');
					poster = item.el.getAttribute('poster');

					// if this is an initial gathering, then the item doesn't have an itemIndex so it is assigned				
					if( item.el.hasAttribute('data-gallery-item-index') ) {
						itemIndex = parseInt(item.el.getAttribute('data-gallery-item-index'));
					} else {
						itemIndex = index;
					}

					// cache meta data on element so it transports seamlessly with image
					if( item.el.hasAttribute('data-meta') ) {

						meta = Cargo.Core.ImageGallery.parseGalleryOptions(item.el.getAttribute('data-meta'));

					} 

					if(item.el.hasAttribute('alt')) {
						alt = item.el.getAttribute('alt');
					}
					if(item.el.hasAttribute('title')) {
						title = item.el.getAttribute('title');
					}

					noZoom = item.el.hasAttribute('data-no-zoom')
					draggable = item.el.hasAttribute('data-draggable')
					logoMode = item.el.hasAttribute('data-icon-mode')

					if(item.el.hasAttribute('data-scale')) {
						scale = item.el.getAttribute('data-scale');
					}

					if(item.el.hasAttribute('data-rotation')) {
						rotation = item.el.getAttribute('data-rotation');
					}		

					if(item.el.hasAttribute('data-mid')) {
						mid = item.el.getAttribute('data-mid');
					}					

					if(item.el.hasAttribute('data-caption')) {
						caption = item.el.getAttribute('data-caption');
					}

					if(item.el.hasAttribute('width')) {
						width = item.el.getAttribute('width');
					}

					if(item.el.hasAttribute('height')) {
						height = item.el.getAttribute('height');
					}

				}

				list[item.UID] = {
					type: item.type,
					index: itemIndex,

					// required for all items
					width: width,
					height: height,

					// elements changeable through modals
					href: href,
					activeClass: activeClass,
					caption: caption,
					target: target,
					rel: rel,
					tags: tags,
					scale: scale,
					rotation: rotation,
					noZoom: noZoom,
					draggable:draggable,
					logoMode:logoMode,

					skuID: skuID,
					productID: productID,
					dataVariant:dataVariant,
					dataProduct:dataProduct,

					markerID: markerID,

					meta: meta,

					alt: alt,
					title: title,

					childTagName: childTagName,
					autoplay: autoplay,
					muted: muted,
					controls: controls,
					controlsList: controlsList,
					playsinline: playsinline,
					poster: poster,
					loop: loop,
					mid: mid,
					mediaSrcs: mediaSrcs,
					itemSrcO: itemSrcO,
					itemSrc: itemSrc,
					allow: allow,
					data: {
						uid: item.UID,
						isNew: isNew
					}
				}

			});

			return list;

		}


	});
	

});