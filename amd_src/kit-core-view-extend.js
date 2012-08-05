/**
 * BackboneKit - BackboneJS View Extension
 */

// --- [[    R e q u i r e J S      A M D    ]] ---
define([window.__backboneKitAmdBackbone,window.__backboneKitAmdUnderscore,window.__backboneKitAmdJQuery],function(Backbone,_,$){












/********************************************************
        BackboneKIT - Core View's extend() method logic
        -----------------------------------------------
        
        This script implements inheritance behavior for views.
        
*********************************************************/
;(function($,_,Backbone){
	
	
	Backbone.Kit.viewOriginalExtend = Backbone.View.extend;
	
	Backbone.View.extend = function( protoProps, classProps ) {
		
		
		
		// Get prototype and new class's options out of the BackboneJS extension logic.
		var protoOptions 			= _.clone( Backbone.Kit.getValue( this.prototype, 		'options', {} ) );
		var childOptions 			= _.clone( Backbone.Kit.getValue( protoProps, 			'options', {} ) );
		
		// Get prototype and new class's attributes out of the BackboneJS extension logic.
		var protoAttributes			= _.clone( Backbone.Kit.getValue( this.prototype, 		'attributes', {} ) );
		var childAttributes 		= _.clone( Backbone.Kit.getValue( protoProps, 			'attributes', {} ) );
		
		// Get plugins arrays from proto and child to be merged.
		var protoPlugins 			= _.clone( Backbone.Kit.getValue( this.prototype, 		'plugins', [] ) );
		var childPlugins 			= _.clone( Backbone.Kit.getValue( protoProps, 			'plugins', [] ) );
		
		// Get events from proto and child to be merged
		var protoEvents 			= _.clone( Backbone.Kit.getValue( this.prototype, 		'events', {} ) );
		var childEvents 			= _.clone( Backbone.Kit.getValue( protoProps, 			'events', {} ) );
		
		var protoModelEvents 		= _.clone( Backbone.Kit.getValue( this.prototype, 		'modelEvents', {} ) );
		var childModelEvents 		= _.clone( Backbone.Kit.getValue( protoProps, 			'modelEvents', {} ) );
		
		var protoCollectionEvents 	= _.clone( Backbone.Kit.getValue( this.prototype, 		'collectionEvents', {} ) );
		var childCollectionEvents 	= _.clone( Backbone.Kit.getValue( protoProps, 			'collectionEvents', {} ) );
		
		var protoViewEvents 		= _.clone( Backbone.Kit.getValue( this.prototype, 		'viewEvents', {} ) );
		var childViewEvents 		= _.clone( Backbone.Kit.getValue( protoProps, 			'viewEvents', {} ) );
		
		var protoParentEvents 		= _.clone( Backbone.Kit.getValue( this.prototype, 		'parentEvents', {} ) );
		var childParentEvents 		= _.clone( Backbone.Kit.getValue( protoProps, 			'parentEvents', {} ) );
		
		var protoMethods			= _.clone( Backbone.Kit.getValue( this.prototype, 		'_methods', [] ) );
		var childMethods			= Backbone.Kit.getMethods( protoProps );
		
		
		
		// -- BackboneJS
		// Default BackboneJS extends
		var ex = Backbone.Kit.viewOriginalExtend.apply( this, arguments );
		// -- BackboneJS
		
		
		
		
		/**
		 * Apply Merged Values
		 */
		
		// Setup a merged options object to the new class.
		ex.prototype.options 		= $.extend( true, {}, protoOptions, 	childOptions );
		ex.prototype.attributes 	= $.extend( true, {}, protoAttributes, 	childAttributes );
		
		
		// Setup merged plugins array.
		if ( protoPlugins && childPlugins ) {
			
			ex.prototype.plugins = protoPlugins;
			
			_.each( childPlugins, function( plug ) {
				
				if ( _.indexOf( ex.prototype.plugins, plug ) < 0 ) ex.prototype.plugins.push( plug );
				
			});
			
		};
		
		
		// Build child "_methods" list inheriting and extending parent's methods with new method names.
		for ( var i in childMethods ) {
			
			if ( protoMethods.indexOf(childMethods[i]) < 0 ) {
				
				ex.prototype._methods.push( childMethods[i] );
			
			}
			
		}
		
		
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
			delete( this.__super);
			
			return _return;
			
		};
		
		
		
		
		
		
		
		
		
		return ex;
		
	};
	
	
	
	
	
})($,_,Backbone);
/******* [[    C O R E    V I E W    E X T E N D    ]] ******/

















});
// --- [[    R e q u i r e J S      A M D    ]] ---