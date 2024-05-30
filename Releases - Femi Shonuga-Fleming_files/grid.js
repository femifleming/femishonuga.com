define([

],
function(

) {
	return Backbone.View.extend({

		name: 'Grid',
		parentView: null,

		/**
		 * Set attributes to el for layout options.
		 *
		 * @return {Object} attributes
		 */
		attributes: function () {
			var model_data = this.model.get('data')

			var attributes = {
				'thumbnails'	: this.name.toLowerCase(),
				'grid-row'		: '',
				'thumbnails-pad'    : '',
				'thumbnails-gutter'	: '',
				'data-elementresizer': ''
			};

			return attributes;
		},

		/**
		 * Bind event listeners.
		 *
		 * @return {Object} this
		 */
		initialize: function (options) {
			if(options && options.parentView) {
				this.parentView = options.parentView;
			}

			this.listenTo(this.collection, 'sync', function(collection, response, options){

			    if(options.from_pagination) {
			        if(options.xhr && options.xhr.parsed_response) {
			            this.render(options.xhr.parsed_response);
			        } else {
			            this.render(response);
			        }
			    } else {
			        this.render();
			    }

			});

			this.listenTo(this.collection, 'change', this.collectionChange);

			// this.model = thumbnail settings. Render on change to dynamically update
			this.listenTo(this.model, 'change', this.handleUpdates);

			// Listener for when this view begins editing after it is first rendered
			// for a static way to check if we are editing use:
			// this.parentView.isEditing()
			this.listenTo(this.parentView, 'is_editing', function(isEditing) {
				// Do your thing
			});

			return this;
		},

		/**
		 * Fired when a collection has changed
		 * Check to see if there is thumb_meta data in the 
		 * attributes and if so, re-render
		 * @param  {Object} model The model that has changed
		 */
		collectionChange: function(model) {
			var allow_change = ['thumb_meta', 'title', 'tags'];
			var has_change = _.findKey(model.changedAttributes(), function(value, key, object){ return (_.indexOf(allow_change, key) >= 0); });
			
			// There was a change to the thumb data, run an update
			if(has_change !== undefined) {
				this.render();
			}
		},

		/**
		 * Handle the changes to the model triggered from the admin panel
		 * @param  {Object} event
		 * @param  {Object} options sent from settings model, changing and value
		 */		
		handleUpdates: function(event, options){
			if ( !options){
				return
			}

			if ( this.hidden ){
				return
			}

			var model_data = this.model.get('data')
			
			switch (options.changing) {

				case 'mobile_active':
					if ( model_data.responsive ){
						this.updateColumns();
					}
					break;

				case 'responsive':
					if ( this.model.get('mobile_active')){
						this.updateColumns();
					}
    				break;

				case 'thumbnail_mode':
					break;

				case 'metadata':
					break;

				case 'crop':
					this.render();
					break;

				case 'columns':
				case 'responsive_columns':
					this.updateColumns();
					break;	

				case 'thumb_crop':
					this.render();
					break;					

				case 'show_tags':
					this.render();
					break;		

				case 'show_thumbs':
					if ( model_data.show_thumbs ){
						this.render();						
					}
					break;

				case 'show_title':
					this.render();
					break;	

				case 'show_excerpt':
					this.render();
					break;
				

				default:
				    break;	
			}

		},

		/**
		 * @return {Object} this
		 */
		render: function (response) {
			var _this = this;	
			var data = Cargo.API.GetDataPackage('Pages', this.collection.toJSON());

			if ( response ){

				var pages = _.filter(response, function(page, index){

					if ( data.Pages[index] ){
						if ( page.id !== data.Pages[index].id) {
							return true
						}						
					}

				});

				data.Pages = pages

				// if there are no pages, we do not render
				if ( pages.length == 0){
					return
				}

			}

			var model_data = _.clone(this.model.get('data'))
			// Load the template
			var template = Cargo.Template.Get(this.model.get('name'), this.model.getTemplatePath());

			data = _.extend(data, { 'settings' : model_data });			

			if ( this.model.get('mobile_active') && model_data.responsive){

				data.settings = _.extend(data.settings, model_data.mobile_data);	
			}

			var markup = Cargo.Core.Handlebars.Render(template, data)

			if ( response ){
				this.$el.append(markup)
			} else {
				this.$el.html(markup);				
			}

			Cargo.Plugins.elementResizer.requestRefreshTick();				
			Cargo.Event.trigger('thumbnails_render_complete');			
			return this;
		},

		updateColumns: function(){
			
			var model_data = _.clone(this.model.get('data'))
			if ( this.model.get('mobile_active') && model_data.responsive){
				model_data = _.extend(model_data, model_data.mobile_data);	
			}

			var thumbs = this.el.querySelectorAll('.thumbnail')

			for (var i = 0; i< thumbs.length; i++){
				thumbs[i].setAttribute('grid-col', 'x'+model_data.column_size)
			}

			Cargo.Plugins.elementResizer.requestTick();

		},


		hideThumbs: function(){
			this.hidden = true;
			this.el.style.display = "none"
		},

		showThumbs: function(){
			this.hidden = false;
			this.el.style.display = "";
		}
	})
	

});
