define([
	window.__backboneKitAmdBackbone, 
	window.__backboneKitAmdUnderscore, 
	window.__backboneKitAmdJQuery
	
],function( 
	Backbone,
	_, 
	$
	
){












/***************************************************************************************
       GLOBAL VIEW COLLECTION
       
       Creates a "viewID" property for the instance then adds the view object to the
       global Backbone.Kit collection.
       
       This way every View instance can be globally accessed with:
       Backbone.Kit.getView('viewID')
       
       viewID should be the view.id or view.cid.
       
***************************************************************************************/
;(function($,_,Backbone){
	
	
	
	var _View = Backbone.View;
	
	Backbone.View = _View.extend({
		
		_ensureElement: function() {
			
			_View.prototype._ensureElement.apply( this, arguments );	
			
			this.viewID = this.$el.attr('id') || this.id || this.cid ;
			
			Backbone.Kit.addView( this.viewID, this );
			
			// Setup DOM attributes
			this.attributes = this.attributes || {};
			this.attributes['data-view-id'] = this.viewID;
			
			
			// Fill item's attributes as defined into the View's object
			_.each( this.attributes, function( val, key ) {
				
				this.$el.attr( key, val );
				
			}, this );
						
		},

		
		
		/**
		 * Shortcut for the Backbone.Kit.getView()
		 */
		
		get: function( id ) {
			
			return Backbone.Kit.getView( id );
			
		}		
				
		
	});
	
	
	
	
	
})($,_,Backbone);
/****************[[    G L O B A L     V I E W     C O L L E C T I O N    ]]************************/





















});