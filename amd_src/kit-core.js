/**
 * BackboneKit - BackboneJS View Extension
 */

// --- [[    R e q u i r e J S      A M D    ]] ---
define([window.__backboneKitAmdBackbone,window.__backboneKitAmdUnderscore,window.__backboneKitAmdJQuery],function(Backbone,_,$){












/********************************************************
        BackboneKIT - Core Namespace Definition
*********************************************************/
;(function($,_,Backbone){
	
	
	
	
	
	
	
	
	/**
	 * Fucking IE!!!
	 * adds Array::indexOf() support to this sheetball browser!
	 */
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(obj, start) {
			for (var i = (start || 0), j = this.length; i < j; i++) {
				if (this[i] === obj) { return i; }
			}
			return -1;
		}
	}
	
	/**
	 * String::capitalize()
	 * capitalize first letter of a string.
	 */
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};
	
	/**
	 * BackboneJS core (with default value!)
	 * Helper function to get a value from a Backbone object as a property
	 * or as a function.
	 */
	var getValue = function( object, prop, defaultValue ) {
		
		if (!(object && object[prop])) return defaultValue;
		
		return _.isFunction(object[prop]) ? object[prop]() : object[prop];
		
	};
	
	/**
	 * Fetch all app-related methods from an object.
	 */
	var getMethods = function( object, _filter ) {
		
		// Reserved names
		//_filter = _filter || [ '$', 'constructor', 'make', 'delegateEvents', 'undelegateEvents', 'on', 'off', 'trigger', 'bind', 'unbind', 'setElement' ];
		_filter = _filter || [];
		
		
		var methods 	= [];
		
		for ( var prop in object ) {
			
			// Skip reserved names and non-function properties
			if ( 
					prop.substring(0,6) === 'before' 
				|| 	prop.substring(0,5) === 'after' 
				|| 	prop.substring(0,1) === '_' 
				||	_filter.indexOf(prop) >= 0
				|| !_.isFunction(object[prop])
			) continue;
			
			
			methods.push( prop );
			
		};
		
		return methods;
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Callback Result Object
	 * encapsulated utility class to handle response from a callback function
	 */
	
	var CallbackResult = function() {
			
		var hasResult = function( prop ) {
			
			// test for general non-null returned value
			if ( !prop ) return !( this.results === null || this.results === undefined );
			
			// test for a key in returned values
			if ( !this.results ) return false;
			if ( !this.results[prop] ) return false;
			
			return true;
			
		};
		
		var getResult = function( prop, defaultValue ) {
			
			if ( this.hasResult(prop) ) return this.results[prop];
			
			return defaultValue;
			
		};
		
		return {
			
			called: 	false,
			results: 	null,
			
			hasResult:	hasResult,
			getResult:	getResult
			
		}
		
	};

	
	/**
	 * Generic Callback Utility
	 * search given context for a method to execute
	 */
	var callback = function( object, name, args ) {
		
		// CallbackResult object will contain info about the callback execution
		var evt = new CallbackResult();
		
		
		// Execute the given callback
		if ( _.isFunction(name) ) {
			
			evt.called		= true;
			evt.results 	= name.apply( object, args );
		
		// Search for a callback and execute if exists	
		} else if ( object[name] ) {
				
			evt.called		= true;
			evt.results 	= object[name].apply( object, args );
			
		}
		
		// Return execution results
		return evt;
		
	};
	
	/**
	 * Sets up a before/after logic for all context related methods.
	 * "_methods" property is computed every time a class is inherited from another!
	 */
	var applyCallbacks = function( object, args ) {
		
		_.each( object._methods, function( methodName ) {
			
			var method = object[methodName];
			
			object[methodName] = function() {
				
				// beforeEvent()
				var beforeName = 'before'+methodName.capitalize();
				
				// Class beforeEvent()
				var evt = Backbone.Kit.callback( this, beforeName, arguments );
				if ( evt.hasResult('arguments') ) 	arguments = evt.getResult('arguments');
				else if ( evt.hasResult('return') ) return evt.getResult('return');
				else if ( evt.hasResult() )			return evt.results;
				
				// Plugins beforeEvent()
				for ( var i=0; i<Backbone.Kit.store.LPlugin[object._id].length; i++ ) {
					
					var evt = Backbone.Kit.callback( this, Backbone.Kit.store.LPlugin[this._id][i][beforeName], arguments );
					if ( evt.hasResult('arguments') ) 	arguments = evt.getResult('arguments');
					else if ( evt.hasResult('return') ) return evt.getResult('return');
					else if ( evt.hasResult() )			return evt.results;
					
				}
				
				
				
				// -- original method --
				var _returnValue = method.apply( object, arguments );	
				
				
				
				// afterEvent()
				var afterName = 'after'+methodName.capitalize();
				
				// Class afterEvent();
				var evt = Backbone.Kit.callback( this, afterName, arguments );
				if ( evt.hasResult('return') ) 	_returnValue = evt.getResult('return');
				else if ( evt.hasResult() )		_returnValue = evt.results;
				
				// Plugins afterEvent()
				for ( var i=0; i<Backbone.Kit.store.LPlugin[object._id].length; i++ ) {
					
					var evt = Backbone.Kit.callback( this, Backbone.Kit.store.LPlugin[this._id][i][afterName], arguments );
					if ( evt.hasResult('return') ) 	_returnValue = evt.getResult('return');
					else if ( evt.hasResult() )		_returnValue = evt.results;
					
				}
				
				
				
				return _returnValue;
				
			};
			
		});
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * View Store Management Tools
	 */
	
	var addView = function( view ) {
		
		Backbone.Kit.store.View[ view._id ] = view;
		
	};
	
	var getView = function( viewId ) {
		
		if ( _.has( Backbone.Kit.store.View, viewId ) ) {
			
			return Backbone.Kit.store.View[viewId];
			
		} 
		
		return false;
		
	};
	
	var delView = function( viewId ) {
		
		// Accept a view object as reference
		if ( _.isObject(viewId) ) viewId = viewId._id;
		
		if ( _.has( Backbone.Kit.store.View, viewId ) ) {
					
			return delete Backbone.Kit.store.View[viewId];
			
		}
		
		return false;
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Backbone Namespace
	 */
	var Kit = function() {
		
		return {
			
			// Informations about BackboneKIT distribution
			info: {
			
				// Info about BackboneKIT
				version: 	'1.0.3',
				git:		'https://github.com/movableapp/BackboneKit',
				blog:		'http://movableapp.com',
				
				// Info about the autor
				author: {
					name:	'Marco Pegoraro',
					mail:	'marco.pegoraro@gmail.com',
					blog:	'http://movableapp.com'
				},
				
				// Info about contributors
				contributors: []
			
			},
			
			// Store collects objects lists
			store: {
				
				// All instanciated views are listed here by ID or CID
				View: {},
				
				// BackboneKIT's registered plugins goes here
				Plugin: {},
				
				// Collects loaded plugins as named arrays:
				// 'view0' : [ {}, {} ]
				// 
				// Load/Unload plugins stores informations here
				LPlugin: {}
				
			},
			
			
			// Utilities
			getValue: 			getValue,
			getMethods:			getMethods,
			
			// Generic callback triggering utility
			callback: 			callback,
			applyCallbacks: 	applyCallbacks,
			
			
			
			// View Store Management Tools
			addView: addView,
			getView: getView,
			delView: delView,
			
			
			// Private pass-through container.
			_: {}			
			
		};
		
	};
	
	
	// Extend BackboneJS adding the Kit namespace.
	_.extend( Backbone, { Kit:Kit() });
	
	// Export BackboneKIT namespace to the global namespace for convenience.
	window.Kit = Backbone.Kit;
	
	
})($,_,Backbone);
/******* [[    C O R E    N A M E S P A C E    ]] ******/

















});
// --- [[    R e q u i r e J S      A M D    ]] ---