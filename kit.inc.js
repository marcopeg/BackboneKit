










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















/********************************************************
        VIEW EXTENSION
*********************************************************/
;(function($,_,Backbone){
	
	// Fetch a reference to the original Backbone.View object
	var _view 	= Backbone.View;
	var _proto 	= _view.prototype;
	
	
	
	
	// BackboneKIT View Object
	var KitView = function() {
		
		
		
		/**
		 *  -- VIEW CONSTRUCTOR --
		 * This is a complete refactor of the Backbone View's constructor logi.
		 * It uses all original logic but add some 
		 */
		var constructor = function( options ) {
			
			// <------ beforeContruct()
			// allow options pre-processing.
			var evt = Backbone.Kit.callback( this, 'beforeConstruct', arguments );
			if ( evt.hasResult() ) options = evt.results;
			
			
			
			
			// >> BACKBONE <<
			this.cid = _.uniqueId('view');
			this._configure(options || {});
			
			
			
			// KIT-ID
			// Each view is provided with a global-unique _id property.
			// You can configure this property inside objects and instances options.
			// View's DOM node will be added by a "kit-id" property to expose the id.
			
			// Enforce the ID structure to optimize for the global view store.
			if ( !this._id && this.options._id ) this._id = this.options._id;
			if ( !this._id ) this._id = this.id || this.cid;
			// TODO: check for global existance!
			
			// Setup the "data-view-id" for the DOM node to store reference with the global views store.
			this.attributes = Backbone.Kit.getValue( this, 'attributes', {} );
			if ( !this.attributes['kit-idd'] ) this.attributes['kit-id'] = this._id;
			
			
			
			// <------ afterConfigure()
			Backbone.Kit.callback( this, 'afterConfigure', arguments );
			
			
			
			
			// >> BACKBONE <<
			this._ensureElement();
			
			// KIT-ID >> Check for "kit-id" existance then set it up
			if ( !this.$el.attr('kit-id') ) this.$el.attr( 'kit-id', this._id );
			
			// Parent View Relation
			if ( this.options.parent ) this.setParent( this.options.parent );
			
			
			// Load associated plugins but not it's events
			// plugin's events are associated AFTER callbacks and instance's declarative events
			Backbone.Kit.store.LPlugin[this._id] = [];
			this.loadPlugins( null, false );
			
			
			// Apply before/after callbacks for all metods found inside the object.
			Backbone.Kit.applyCallbacks( this, arguments );
			
			
			
			
			// >> BACKBONE <<
			this.initialize.apply(this, arguments);
			this.delegateEvents();
			
			// Bind Declarative Events
			this.bindModelEvents();
			this.bindCollectionEvents();
			this.bindViewEvents();
			this.bindParentEvents();
			
			
			// Associate plugins events when all callbacks are configured.
			this.loadPluginsEvents();
			
			
			// Add the view to the global views store.
			Backbone.Kit.addView( this );
			
			
			
			
			// <------ afterContruct()
			// allow post-processing logics
			Backbone.Kit.callback( this, 'afterConstruct', arguments );

			
		};
		
		
		
		
		












/************************************************************************************
        PARENT RELATION
************************************************************************************/		
		
		/**
		 * Parent Relation Setter
		 * ToDo:
		 * - check for parent to be derived from a view item.
		 * - check for prevent parent to be chidlren (prevent loops)
		 */
		var setParent = function( parent ) {
			
			this.parent = parent;
			
			return this;
			
		};
		














/************************************************************************************
        DECLARATIVE EVENTS
************************************************************************************/
		
		// Declarative events map.
		var viewMethods = {
			model: 			{},
			collection: 	{},
			view: 			{},
			parent:			{}
		};
		
		
		var _bindDeclarativeEvents = function ( prop, events, cid ) {
			
			cid = cid || this.cid;
			
			var methods = (viewMethods[prop][cid] || (viewMethods[prop][cid] = []));
			
			for (var eventName in events) {
				
				var method = events[eventName];
				
				if (!_.isFunction(method)) method = this[events[eventName]];
				
				if (!method) throw new Error('Method "' + events[eventName] + '" does not exist');
				
				methods.push(method);
				
				if ( prop === 'view' ) {
					
					this.on(eventName, method, this);
					
				} else {
					
					if ( !this[prop] ) return;
					
					this[prop].on(eventName, method, this);
					
				}
				
			}
			
		};
	
		var _unbindDeclarativeEvents = function( prop, cid ) {
		
			cid = cid || this.cid;
			
			var methods = viewMethods[prop][cid];
			
			if (!methods) return;
			
			var method;
			
			if ( prop === 'view' ) {
				
				while (method = methods.pop()) this.off(null, method, this);
				
			} else {
				
				while (method = methods.pop()) this[prop].off(null, method, this);
					
			}
			
			delete viewMethods[prop][cid];
			
		};
		
		
		
		
		var bindModelEvents = function (modelEvents) {
			
			if ( !this.model ) return;
			
			if (!(modelEvents || (modelEvents = Backbone.Kit.getValue(this, 'modelEvents')))) return;
			
			this.unbindModelEvents();
			
			_bindDeclarativeEvents.call( this, 'model', modelEvents );
			
		};
		
		var bindCollectionEvents = function (collectionEvents) {
			
			if ( !this.collection ) return;
			
			if (!(collectionEvents || (collectionEvents = Backbone.Kit.getValue(this, 'collectionEvents')))) return;
			
			this.unbindCollectionEvents();
			
			_bindDeclarativeEvents.call( this, 'collection', collectionEvents );
			
		};
		
		var bindViewEvents = function( viewEvents ) {
			
			if (!(viewEvents || (viewEvents = Backbone.Kit.getValue(this, 'viewEvents')))) return;
			
			this.unbindViewEvents();
			_bindDeclarativeEvents.call( this, 'view', viewEvents );
			
			
		};
		
		var bindParentEvents = function( parentEvents ) {
			
			if (!(parentEvents || (parentEvents = Backbone.Kit.getValue(this, 'parentEvents')))) return;
			
			this.unbindParentEvents();
			
			if ( this.parent ) _bindDeclarativeEvents.call( this, 'parent', parentEvents );
			
		};
		
		var unbindModelEvents			= function() { _unbindDeclarativeEvents.call( this, 'model' ) };
		var unbindCollectionEvents		= function() { _unbindDeclarativeEvents.call( this, 'collection' ) };
		var unbindViewEvents			= function() { _unbindDeclarativeEvents.call( this, 'view' ) };
		var unbindParentEvents			= function() { _unbindDeclarativeEvents.call( this, 'parent' ) };














/************************************************************************************
        PLUGIN SUPPORT
************************************************************************************/

		var loadPlugin = function( plugin, loadEvents ) {
			
			// Plugin's events are loaded by default.
			// you can prevent to load events by pass "false" as second param.
			if ( loadEvents !== false ) loadEvents = true;
			
			// ToDo: fetch plugin from the Kit.store.Plugin by name
			if ( _.isString(plugin) ) return;
			
			// Eval a plugin into closure funciton
			if ( _.isFunction(plugin) ) plugin = plugin.apply( this );
			
			// Apply default values to the plugin
			plugin._ = {
				
				// plugin internal callbacks
				initialize: null,
				
				reserved: {
					literals: 		[ '_', 'before', 'after', 'events', 'modelEvents', 'collectionEvents', 'viewEvents', 'parentEvents' ],
					properties:		[ 'cid' ]
				},
				
				// Will store a list of added literals and properties to remove at unloading time.
				added: {
					literals:		[],
					properties:		[],
					methods:		[]
				}
				
			};
			
			// Skip already loaded plugins
			if ( this.loadedPlugins.indexOf(plugin) >= 0 ) return;
			
			
			
			// Compose the plugin's uniqueID.
			// this information is used when unloading the plugin.
			if ( !plugin.cid ) plugin.cid = this.cid + _.uniqueId('plugin');
			
			
			// Export the plugin's initialization logic to prevent to mixin into the
			// targer object.
			// "plugin::initialize()" will be executed 
			if ( plugin['initialize'] ) {
				
				plugin._.initialize = plugin['initialize'];
				
				delete( plugin['initialize'] );
				
			}
			
			
			
			/**
			 * Merge plugin's attributes to the target object.
			 */
			for ( var prop in plugin ) {
				
				// -----
				// Add plugin's methods to the target object:
				if (
					_.isFunction(plugin[prop]) 
					&& !this[prop]
					&& prop.substring(0,6) !== 'before'
					&& prop.substring(0,5) !== 'after'
				) {
					
					// Add method to the targer object and append a reference to the plugin info
					// internal reference is need when removing the plugin
					this[prop] = plugin[prop];
					plugin._.added.methods.push( prop );
				
				
				
				// -----
				// Add literals or merge existing ones:
				} else if (
					!_.isFunction(plugin[prop])
					&& _.isObject(plugin[prop])
					&& plugin._.reserved.literals.indexOf(prop) < 0
				) {
					
					// Literal does no exists in original object.
					// Add it and save a reference for removing when unload the plugin.
					if ( !this[prop] ) {
						
						this[prop] = plugin[prop];
						plugin._.added.literals.push(prop);
					
					// Literal exists in the original object.
					// Apply plugin's literal as default to the target object.	
					} else {
						
						_.defaults( this[prop], plugin[prop] );
						
					}
				
				// -----
				// Add non existing properties:
				} else if (
					!this[prop]
					&& !_.isFunction(plugin[prop])
					&& !_.isObject(plugin[prop])
					&& plugin._.reserved.properties.indexOf(prop) < 0
				) {
					
					this[prop] = plugin[prop];
					plugin._.added.properties.push(prop);
					
				}
				
			}
			
			
			// Load plugin's events if required.
			if ( loadEvents ) loadPluginEvents.call( this, plugin );
			
			
			// Add a reference to the loaded plugins list inside the target object.
			Backbone.Kit.store.LPlugin[this._id].push( plugin ); 
			
			// Run the plugin's initialize logic.
			if ( _.isFunction(plugin._.initialize) ) plugin._.initialize.call( this, plugin );
			
			return this;
			
		};
		
		
		var loadPluginEvents = function( plugin ) {
			
			unloadPluginEvents.call( this, plugin );
			
			// DOM Events
			if ( plugin.events && !_.isEmpty(plugin.events) ) {
				
				var delegateEventSplitter = /^(\S+)\s*(.*)$/;
				
				// -- from backbone's delegateEvents
				events = plugin.events;
				for (var key in events) {
			        var method = events[key];
			        if (!_.isFunction(method)) method = this[events[key]];
			        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
			        var match = key.match(delegateEventSplitter);
			        var eventName = match[1], selector = match[2];
			        method = _.bind(method, this);
			        eventName += '.delegateEvents' + plugin.cid; // !!!! "plugin.cid" is important !!!!
			        if (selector === '') {
			          this.$el.bind(eventName, method);
			        } else {
			          this.$el.delegate(selector, eventName, method);
			        }
			      }
			    // -- from backbone's delegateEvents
		    
		    };
			
			// Declarative Events:
			_bindDeclarativeEvents.call( this, 'model', 		plugin.modelEvents 			|| {}, plugin.cid );
			_bindDeclarativeEvents.call( this, 'collection', 	plugin.collectionEvents 	|| {}, plugin.cid );
			_bindDeclarativeEvents.call( this, 'view', 			plugin.viewEvents 			|| {}, plugin.cid );
			_bindDeclarativeEvents.call( this, 'parent', 		plugin.parentEvents 		|| {}, plugin.cid );
			
			return this;
			
		};
		
		var unloadPluginEvents = function( plugin ) {
			
			// DOM Events: 
			this.$el.unbind('.delegateEvents' + plugin.cid);
			
			// Declarative Events:
			_unbindDeclarativeEvents.call( this,		'model', 			plugin.cid );
			_unbindDeclarativeEvents.call( this,		'collection', 		plugin.cid );
			_unbindDeclarativeEvents.call( this,		'view', 			plugin.cid );
			_unbindDeclarativeEvents.call( this,		'parent', 			plugin.cid );
			
			return this;
				
		};
		
		
		
		/**
		 * Try to remove a plugin footprint from the target object.
		 */
		var unloadPlugin = function( plugin ) {
			
			// Remove added methods:
			for ( var i=0; i<plugin._.added.methods.length; i++ ) delete this[plugin._.added.methods[i]];
			
			// Remove added literals:
			for ( var i=0; i<plugin._.added.literals.length; i++ ) delete this[plugin._.added.literals[i]];
			
			// Remove added properties:
			for ( var i=0; i<plugin._.added.properties.length; i++ ) delete this[plugin._.added.properties[i]];
			
			// Remove the reference from the loaded plugins list
			var _plugins = []
			
			// Unload plugin events:
			unloadPluginEvents.call( this, plugin );			
			
			// Remove the plugin from the Kit LPlugin store:
			for ( var i=0; i<Backbone.Kit.store.LPlugin[this._id].length; i++ ) {
				
				if ( Backbone.Kit.store.LPlugin[this._id][i] !== plugin ) _plugins.push(Backbone.Kit.store.LPlugin[this._id][i]);
				
			}
			
			Backbone.Kit.store.LPlugin[this._id] = _plugins;
			
			return this;
			
		};
		
		
		
		
		
		/**
		 * Mass load/unloads
		 */
		
		var loadPlugins = function( plugins, loadEvents ) {
			
			plugins = plugins || this.plugins;
			
			for ( var i=0; i<plugins.length; i++ ) this.loadPlugin( plugins[i], loadEvents );
			
		};
		
		var loadPluginsEvents = function( plugins ) {
			
			if ( !plugins ) {
				plugins = plugins || Backbone.Kit.store.LPlugin[this._id];
			}
			
			for ( var i=0; i<plugins.length; i++ ) this.loadPluginEvents( plugins[i] );
			
		};
		
		var unloadPlugins = function( plugins ) {
			
			if ( !plugins ) {
				plugins = plugins || Backbone.Kit.store.LPlugin[this._id].reverse();
			}
			
			for ( var i=0; i<plugins.length; i++ ) this.unloadPlugin( plugins[i] );
			
		};

		
		
		
		
		
		
		
		
		
		
/************************************************************************************
        RENDERING UTILITIES
************************************************************************************/
		
		
		/**
		 * renderTo( target, p1, p2, ... )
		 * Replace target DOM content with this element
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		var renderTo = function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.html( this.el );
			
			return this;
			
		};
		
		/**
		 * renderAfter( target, p1, p2, ... )
		 * Place "this.el" AFTER the target DOM element
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		var renderAfter = function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.after( this.el );
			
			return this;
			
		};
		
		/**
		 * renderBefore( target, p1, p2, ... )
		 * Place "this.el" BEFORE the target DOM element
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		var renderBefore = function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.before( this.el );
			
			return this;
			
		};
		
		/**
		 * appendTo( target, p1, p2, ... )
		 * Append "this.el" to target DOM content
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 *
		 * -- prevent rendering --
		 * appendTo( target, false )
		 * this way the method will not render the view.
		 */
		var appendTo = function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.append( this.el );
			
			return this;
			
		};
		
		/**
		 * prependTo( target, p1, p2, ... )
		 * Prepend "this.el" to target DOM content (at the beginning)
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 *
		 * -- prevent rendering --
		 * appendTo( target, false )
		 * this way the method will not render the view.
		 */
		var prependTo = function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.prepend( this.el );
			
			return this;
			
		};
		
		
		
		
		
		
		
		
		
		
		/**
		 * VIEW EXTENDED PROPERTIES
		 * Properties to be added to the Backbone.View object
		 */
		return {
			
			_methods: [],
			
			// Rebuilded Logic!
			constructor: 		constructor,
			
			// Parent Relation Support
			setParent:			setParent,
			
			// Plugins Support
			plugins: 				[],
			loadedPlugins: 			[],
			loadPlugin:				loadPlugin,
			loadPluginEvents:		loadPluginEvents,
			loadPlugins:			loadPlugins,
			loadPluginsEvents:		loadPluginsEvents,
			unloadPlugin:			unloadPlugin,
			unloadPlugins:			unloadPlugins,
			
			// Declarative Events
			bindModelEvents:		bindModelEvents,			unbindModelEvents:			unbindModelEvents,
			bindCollectionEvents:	bindCollectionEvents,		unbindCollectionEvents:		unbindCollectionEvents,
			bindViewEvents:			bindViewEvents,				unbindViewEvents:			unbindViewEvents,
			bindParentEvents:		bindParentEvents,			unbindParentEvents:			unbindParentEvents,
			
			
			// Rendering utilities
			renderTo: 				renderTo,
			renderAfter: 			renderAfter,
			renderBefore: 			renderBefore,
			appendTo: 				appendTo,
			prependTo: 				prependTo
			
		};
		
		
	}; // -- BackboneKIT View Object;
	
	
	// Apply BackboneKIT's View extension to Backbone.View object
	// To extend Backbone.View object with the Kit properties I use the original Backbone's extend() method!
	// No inheritance, callbacks and other strange thing are attached to the View itself.
	Backbone.View = Backbone.Kit.viewOriginalExtend.call( _view, KitView() );
	
	
})($,_,Backbone);
/******* [[    V I E W    E X T E N S I O N    ]] ******/




