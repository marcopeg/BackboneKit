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
       MIXINS - View Code Injection
       
       Attach properties and new methods to a target view object.
       Inject before and after logic to existing methods
       
       // Attach functionality on-the fly
       myView.mixin({ foo:function(){ ... } })
       
       // Attach a plugin by name
       myView.mixin( 'myPlugin' )
       ( 'myPlugin' is requested as 'Backbone.Kit.Plugin.myPlugin' )
       
***************************************************************************************/
;(function($,_,Backbone){

	Backbone.View.mixin = function( _mixin ) {
		
		// Loads mixin by name from the Kit Mixin repository.
		if ( _.isString(_mixin) ) _mixin = Backbone.Kit.Mixin[_mixin];
		
		// protect from undefined mixin request.
		if ( !_mixin ) return this;
		
		// protect from undefined target
		var _self = this.prototype;
		if ( !_self ) return this;
		
		
		
		
		// Extract the before/after kays from the mixin configuration.
		// Then remove it from the mixin configuration to prevent propagation in the target object
		var _before = _mixin.before 	|| {};			if ( _mixin.before ) 	delete _mixin['before'];
		var _after	= _mixin.after 	|| {};				if ( _mixin.after ) 	delete _mixin['after'];
		
		
		
		
		// Apply missing properties and methods.
		_.defaults( _self, _mixin );
		
		// Apply missing properties to the attribute property.
		_.defaults( _self.attributes		|| {}, 		_mixin.attributes 			|| {} );
		
		// Apply missing event handlers.
		_.defaults( _self.events			|| {}, 		_mixin.events 				|| {} );
		_.defaults( _self.viewEvents 		|| {}, 		_mixin.viewEvents 			|| {} );
		_.defaults( _self.parentEvents 		|| {}, 		_mixin.parentEvents 		|| {} );
		_.defaults( _self.modelEvents 		|| {}, 		_mixin.modelEvents 			|| {} );
		_.defaults( _self.collectionEvents 	|| {}, 		_mixin.collectionEvents 	|| {} );
		
		
		
		// Inject before / after logic
		_.each( _before, function( method, name ) {
			
			Backbone.Kit.extendMethodBefore( _self, name, method );
			
		});
		
		_.each( _after, function( method, name ) {
			
			Backbone.Kit.extendMethodAfter( _self, name, method );
			
		});
		
		
		// return class definition object
		return this;
		
	};
	
	
	/**
	 * Attach multiple mixins passed as array.
	 * 
	 * If no mixins are found it check into the prototype mixins configuration param to
	 * loads all configured mixins.
	 */
	Backbone.View.attachMixins = function( mixins ) {
		
		// Fallback to the configured mixins list
		if ( !mixins ) {
			
			if ( !this.prototype || !this.prototype.mixins || !_.isArray(this.prototype.mixins) ) return;
			
			mixins = this.prototype.mixins;	
			
		};
		
		
		// Loads Mixins
		_.each( mixins, function( mixin ) {
			
			this.mixin( mixin );
			
		}, this);
		
		
	};


	
	








/***************************************************************************************
       CONFIGURABLE MIXINS
       
       Loads every mixin as defined into the "mixins" array.
       
***************************************************************************************/
		
	var _View = Backbone.View;
	
	Backbone.View = _View.extend({
		
		_ensureElement: function() {
			
			_View.prototype._ensureElement.apply( this, arguments );	
			
			this.constructor.attachMixins();
			
		}
		
	});
	
})($,_,Backbone);
/******************************** [[ M I X I N S ]] ***********************************/

















});