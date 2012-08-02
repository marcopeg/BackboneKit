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
       OVERRIDES - Backbone.View.extend()
       
       - recursive options extension
       - recursive plugins listing
       - inheritance
       
***************************************************************************************/
;(function($,_,Backbone){
	
	
	var _extend = Backbone.View.extend;
	
	Backbone.View.extend = function( childProp ) {
		
		
		// Get prototype and new class's options out of the BackboneJS extension logic.
		var protoOptions = _.clone(this.prototype.options) 	|| {};
		var childOptions = _.clone(childProp.options) 		|| {};
		
		// Get mixins arrays from proto and child to be merged.
		var protoMixins = _.clone(this.prototype.mixins);
		var childMixins = _.clone(childProp.mixins);
		
		// Get plugins arrays from proto and child to be merged.
		var protoPlugins = _.clone(this.prototype.plugins);
		var childPlugins = _.clone(childProp.plugins);
		
		// Get events from proto and child to be merged
		var protoEvents 			= _.clone(this.prototype.events) || {};
		var childEvents 			= _.clone(childProp.events) || {};
		
		var protoModelEvents 		= _.clone(this.prototype.modelEvents) || {};
		var childModelEvents 		= _.clone(childProp.modelEvents) || {};
		
		var protoCollectionEvents 	= _.clone(this.prototype.collectionEvents) || {};
		var childCollectionEvents 	= _.clone(childProp.collectionEvents) || {};
		
		var protoViewEvents 		= _.clone(this.prototype.viewEvents) || {};
		var childViewEvents 		= _.clone(childProp.viewEvents) || {};
		
		var protoParentEvents 		= _.clone(this.prototype.parentEvents) || {};
		var childParentEvents 		= _.clone(childProp.parentEvents) || {};
		
		
		
		
		
		// -- BackboneJS
		// Default BackboneJS extends
		var ex = _extend.apply( this, arguments );
		// -- BackboneJS
		
		
		
		
		
		// Setup a merged options object to the new class.
		ex.prototype.options = $.extend( true, {}, protoOptions, childOptions );
		
		
		// Setup merged plugins array.
		if ( protoMixins && childMixins ) {
			
			ex.prototype.mixins = protoMixins;
			
			_.each( childMixins, function( mixin ) {
				
				if ( _.indexOf( ex.prototype.mixins, mixin ) < 0 ) ex.prototype.mixins.push( mixin );
				
			});
			
		};
		
		
		// Setup merged plugins array.
		if ( protoPlugins && childPlugins ) {
			
			ex.prototype.plugins = protoPlugins;
			
			_.each( childPlugins, function( plug ) {
				
				if ( _.indexOf( ex.prototype.plugins, plug ) < 0 ) ex.prototype.plugins.push( plug );
				
			});
			
		};
		
		// Attach merged declarative events
		ex.prototype.events 				= $.extend( true, {}, protoEvents, 				childEvents );
		ex.prototype.modelEvents 			= $.extend( true, {}, protoModelEvents, 		childModelEvents );
		ex.prototype.collectionEvents 		= $.extend( true, {}, protoCollectionEvents, 	childCollectionEvents );
		ex.prototype.viewEvents 			= $.extend( true, {}, protoViewEvents, 			childViewEvents );
		ex.prototype.parentEvents 			= $.extend( true, {}, protoParentEvents, 		childParentEvents );
		
		
		
		







/***************************************************************************************
       SUPER Emulation
       
       this.$sup() -> super
       this.$call( 'method', p1, p2, ... )
       this.$apply( 'method', [ p1, p2, ... ] )
       
***************************************************************************************/
		
		// Save the parent prototype reference.
		ex.prototype._super = this.prototype;
		
		ex.prototype.$sup = function() {
			
			return this._super;
			
		};
		
		ex.prototype.$call = function() {
			
			_args = _.values( arguments );
			
			// Overlay - try to fetch arguments based on the type of the first one.
			// [ 'methodName', arg1, arg2, ... ]
			// [ true, 'methodName, arg1, arg2, ... ]
			_shiftContext = _args.shift();
			
			if ( _.isBoolean(_shiftContext) ) {
				
				_methodName = _args.shift();
				
			} else {
				
				_methodName = _shiftContext;
				
				_shiftContext = false;
				
			}
			
			// Fix up the arguments object
			if ( _args.length ) {
				
				arguments = _args.shift();
				
			} else {
				
				arguments = [];
				
			}
			
			// Fetch the "super" reference from the context or from the prototype.
			var _super = this.__super || _.clone(this.constructor.prototype._super);
			
			// Setup a "double super" reference into the context so parent's $super methods
			// will use this as _super (before instruction)
			this.__super = _super._super;
			
			
			
			// Search for requested method into the parent object.
			if ( !_super[_methodName] ) return;
			
			_method = _super[_methodName];
			
			
			
			// Choose the way to propagate execution's context
			if ( _shiftContext ) {
				var _return = _method.call( _super, arguments );	
				
			} else {
				var _return = _method.call( this, arguments );	
				
			}
			
			// Delete the super-super link to allow next request!!!
			delete( this.__super );
			
			return _return;
				
		};
		
		ex.prototype.$apply = function() {
			
			_args = _.values( arguments );
			
			// Overlay - try to fetch arguments based on the type of the first one.
			// [ 'methodName', [ args ] ]
			// [ true, 'methodName, [ args ] ]
			_shiftContext = _args.shift();
			
			if ( _.isBoolean(_shiftContext) ) {
				
				_methodName = _args.shift();
				
			} else {
				
				_methodName = _shiftContext;
				
				_shiftContext = false;
				
			}
			
			// Fix up the arguments object
			if ( _args.length ) {
				
				arguments = _args.shift();
				
			} else {
				
				arguments = [];
				
			}
			
			
			
			
			// Fetch the "super" reference from the context or from the prototype.
			var _super = this.__super || _.clone(this.constructor.prototype._super);
			
			// Setup a "double super" reference into the context so parent's $super methods
			// will use this as _super (before instruction)
			this.__super = _super._super;
			
			
			
			
			// Search for requested method into the parent object.
			if ( !_super[_methodName] ) return;
			
			_method = _super[_methodName];
			
			
			
			
			// Choose the way to propagate execution's context
			if ( _shiftContext ) {
				var _return = _method.apply( _super, arguments );	
				
			} else {
				var _return = _method.apply( this, arguments );	
				
			}
			
			// Delete the super-super link to allow next request!!!
			delete( this.__parent );
			
			return _return;
			
		};
		
		
		return ex;
	
	// ---------------------------------------------------
	}; // EndOf: View.extend() ---
	// ---------------------------------------------------



})($,_,Backbone);
/************************[[    E X T E N D    ]]*************************************/







});