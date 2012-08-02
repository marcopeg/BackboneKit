

// -- Global Name Wrapper --
;(function($,_,Backbone) {



















/***************************************************************************************
       BACKBONE CORE OBJECT
       
***************************************************************************************/
	
	_.extend( Backbone, {
		
		Kit: {
			
			// General Kit informations
			version: 	'0.0.0',
			author: 	'Marco Pegoraro - MPeg',
			
			// Mixin Archive
			Mixin: {},
			
			// Plugins Archive
			Plugin: {},
			
			
			
			
			
			
			
			
			
			
/***************************************************************************************
       UI Components Collection and Accessors
***************************************************************************************/
			
			_views: {},
			
			/**
			 * Add a component to the store.
			 */
			addView: function( id, obj ) {
				
				Backbone.Kit._views[ id ] = obj;
				
			},
			
			
			/**
			 * Tryes to fetch required component by it's id
			 */
			getView: function( id ) {
				
				if ( _.has( Backbone.Kit._views, id) ) {
					return Backbone.Kit._views[id];
					
				} 
				
				return false
				
			},
			
			/**
			 * It only unset the reference to the element!
			 * This is called by the Component's destroy() method!
			 */
			delView: function( id ) {
				
				if ( _.has( Backbone.Kit._views, id) ) {
					
					return delete Backbone.Kit._views[id];
					
				}
				
				return false;
				
			},
			
			
			
			
			
			
			
			
			
			
			
			
			
			/**
			 * Methods Extension Utility
			 *
			 * these functions can inject logic before and after the execution of a method.
			 * if your custom logic return a non-null value this value is returned by the original method.
			 *
			 * if you "before logic" return a non-null value the original logic is skipped.
			 */
			
			extendMethodBefore: function( _target, methodName, extensionLogic ) {
				
				if ( _.isUndefined(_target[methodName]) ) return;
				
				var methodLogic = _target[methodName];
				
				_target[methodName] = function() {
					
					var extensionResult = extensionLogic.apply( this, arguments );
					
					if ( extensionResult != null ) return extensionResult;
					
					return methodLogic.apply( this, arguments );
						
				};
				
			},
			
			extendMethodAfter: function( _target, methodName, extensionLogic ) {
				
				if ( _.isUndefined(_target[methodName]) ) return;
				
				var methodLogic = _target[methodName];
				
				_target[methodName] = function() {
					
					var originalResult = methodLogic.apply( this, arguments );
					
					var extensionResult = extensionLogic.apply( this, arguments );
					
					if ( extensionResult != null ) return extensionResult;
					
					return originalResult;
						
				};
				
			}
			
		}
		
	});
	
	
	
	
	
	
	
/***************************************************************************************
       Exports "Kit" to the global namespace
***************************************************************************************/
	
	window.Kit = Backbone.Kit;













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


























		
/***************************************************************************************
       DECLARATIVE EVENTS
       
       Based upon the great GIT:
       https://github.com/Codecademy/backbone.declarative
       
       It allow to define:
       - viewEvents
       - parentEvents
       - modelEvents
       - collectionEvents
       
***************************************************************************************/
;(function($,_,Backbone){	

	
	// Helper function to get a value from a Backbone object as a property
	// or as a function.
	var getValue = function(object, prop) { 
		
		if (!(object && object[prop])) return null;
		
		return _.isFunction(object[prop]) ? object[prop]() : object[prop];
		
	};
	
	var _View = Backbone.View;
	
	// Declarative events map.
	var viewMethods = {
		model: 			{},
		collection: 	{},
		view: 			{},
		parent:			{}
	};
	
	
	
	Backbone.View = _View.extend({
		
		constructor: function () {
			
			_View.apply(this, Array.prototype.slice.call(arguments));
			
			this.bindModelEvents();
			
			this.bindCollectionEvents();
			
			this.bindViewEvents();
			
			this.bindParentEvents();
	
		},
		
		
		_bindDeclarativeEvents: function (prop, events, cid ) {
			
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
			
		},
	
		_unbindDeclarativeEvents: function( prop, cid ) {
		
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
			
		},
	
		bindModelEvents: function (modelEvents) {
			
			if ( !this.model ) return;
			
			if (!(modelEvents || (modelEvents = getValue(this, 'modelEvents')))) return;
			
			this.unbindModelEvents();
			
			this._bindDeclarativeEvents('model', modelEvents);
			
		},
		
		bindCollectionEvents: function (collectionEvents) {
			
			if ( !this.collection ) return;
			
			if (!(collectionEvents || (collectionEvents = getValue(this, 'collectionEvents')))) return;
			
			this.unbindCollectionEvents();
			
			this._bindDeclarativeEvents('collection', collectionEvents);
			
		},
		
		bindViewEvents: function( viewEvents ) {
			
			if (!(viewEvents || (viewEvents = getValue(this, 'viewEvents')))) return;
			
			this.unbindViewEvents();
			this._bindDeclarativeEvents('view', viewEvents);
			
			
		},
		
		bindParentEvents: function( parentEvents ) {
			
			if (!(parentEvents || (parentEvents = getValue(this, 'parentEvents')))) return;
			
			this.unbindParentEvents();
			this._bindDeclarativeEvents('parent', parentEvents);
			
			
		},
		
		unbindModelEvents: 			function() { this._unbindDeclarativeEvents('model') },
		unbindCollectionEvents: 	function() { this._unbindDeclarativeEvents('collection') },
		unbindViewEvents: 			function() { this._unbindDeclarativeEvents('view') },
		unbindParentEvents: 		function() { this._unbindDeclarativeEvents('parent') }
		

	});


})($,_,Backbone);
/***********************[[   D E C L A R A T I V E       E V E N T S    ]]*************************/













/**************************************************************************************
       CONFIGURABLE PLUGINS
       
       Loads every plugins as defined into the "plugins" array.
       
***************************************************************************************/
;(function($,_,Backbone){
	
	
	var _View = Backbone.View;

	Backbone.View = _View.extend({
		
		
		/**
		 * Ensure Extension Method
		 * loads internal logic to extend Backbone.View capabilities
		 */
		_ensureElement: function() {
			
			_View.prototype._ensureElement.apply( this, arguments );
			
			this.loadPlugins();
			
		},
		
		
		
		
		
		
		
		
		/**
		 * Utilities to load/unload multiple plugins at once
		 */
		
		loadPlugins: function( plugins ) {
			
			plugins = plugins || this.plugins;
			
			_.each( plugins, this.loadPlugin, this );
			
		},
		
		// Unload revert the plugin order to start unloading the last loaded plugin!
		unloadPlugins: function( plugins ) {
			
			plugins = plugins || this.plugins;
			
			_.each( plugins.reverse(), this.unloadPlugin, this );
			
		},
		
		
		
		
		
		
		
		
		
		/**
		 * Loads a plugin into the instance.
		 * -- different types of properties are handled in different ways! --
		 */
		
		loadPlugin: function( plugin ) {
			
			plugin._ = {
				reserved: {
					literals: 		[ '_', 'before', 'after', 'events', 'viewEvents' ],
					properties:		[ 'cid' ]
				},
				
				// Will store a list of added literals and properties to remove at unloading time.
				added: {
					literals:		[],
					properties:		[]
				},
				
				// Will store original methods when extending with "before" and "after" keys.
				// This informations helps to restore original target status when unload plugins.
				befored: {},
				aftered: {}
				
			};
			
			
			
			// Compose the plugin's ID
			if ( !plugin.cid ) plugin.cid = this.cid + _.uniqueId('plugin');
			//console.log( 'loadPlugin: ' + plugin.cid );
			
			
			
			// Extend target object with methods, literals and properties defined into the plugin
			_.each( plugin, function( val, prop ) {
				
				// before/after method code injection
				if ( prop === 'before' ) {
					
					_.each( val, function( logic, name ){
						
						Backbone.Kit.extendMethodBefore( this, name, logic );
						
						
					}, this);
					
				} else if ( prop === 'after' ) {
				
					_.each( val, function( logic, name ){
						
						Backbone.Kit.extendMethodAfter( this, name, logic );
						
					}, this);
					
					
					
				// Methods
				} else if ( _.isFunction(val) ) {
					__loadPluginMethod.call( this, prop, val );
				
				
				// Literal Objects
				// {}
				} else if ( _.isObject(val) ) {
					
					// skip reserved literals
					if ( plugin._.reserved.literals.indexOf(prop) >= 0 ) return;
					
					// Set defaults to an existing literal
					if ( this[prop] ) {
						_.defaults( this[prop], val );
					
					// Add a non-existing literal
					} else {
						this[prop] = val;
						plugin._.added.literals.push(prop);
						
					}
				
				// Generic Properties
				} else {
					
					// skip reserved properties!
					if ( plugin._.reserved.properties.indexOf(prop) >= 0 ) return;
					
					// skip existing properies
					if ( this[prop] ) return;
					
					this[prop] = val;
					plugin._.added.properties.push(prop);
					
				}
				
			}, this);
			
			// Load plugin's events:
			__loadPluginEvents.call( this, plugin );
			
		},
		
		
		
		
		
		
		
		/**
		 * Unloads a plugin from the instance.
		 * try to remove plugin's footprint where it is possible.
		 */
		
		unloadPlugin: function( plugin ) {
			
			//console.log( "unloadPlugin: " + plugin.cid );
			
			// Extend target object with methods, literals and properties defined into the plugin
			_.each( plugin, function( val, prop ) {
				
				// remove before/after code injection.
				// BUG: after this "delete" action loadPlugin() is not able to load injections another time!
				if ( prop === 'before' ) {
					
					_.each( val, function( logic, name ){
						
						delete( this[name] );
						
					}, this);
					
				} else if ( prop === 'after' ) {
				
					_.each( val, function( logic, name ){
						
						delete( this[name] );
						
					}, this);
					
					
					
				// Methods
				} else if ( _.isFunction(val) ) {
					__unloadPluginMethod.call( this, prop, val );
				
				
				// Literal Objects
				// {}
				} else if ( _.isObject(val) ) {
					
					// skip already undefined properies
					if ( !this[prop] ) return;
					
					// skip reserved literals
					if ( plugin._.reserved.literals.indexOf(prop) >= 0 ) return;
					
					// remove this property only if was added by the plugin!
					if ( plugin._.added.literals.indexOf(prop) >= 0 ) delete( this[prop] );
				
				// Generic Properties
				} else {
					
					// skip already undefined properies
					if ( !this[prop] ) return;
					
					// skip reserved properties!
					if ( plugin._.reserved.properties.indexOf(prop) >= 0 ) return;
					
					// remove this property only if was added by the plugin!
					if ( plugin._.added.properties.indexOf(prop) >= 0 ) delete( this[prop] );
					
				}
				
			}, this);
			
			
			// Unload plugin's DOM Events:
			__unloadPluginEvents.call( this, plugin );
			
			this.delegateEvents();
			
		}
		
		
	});
	
	
	
	
	
	
	
	
	
	/**
	 * Internal Logics
	 */
	
	
	var __loadPluginMethod = function( prop, val ) {
				
		if ( !_.isUndefined(this[prop]) ) return;
		
		this[prop] = val;
		
	};
	
	
	var __loadPluginEvents = function( plugin ) {
				
		__unloadPluginEvents.call( this, plugin );
		
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
	    
	    
	    // Declarative Events
	    this._bindDeclarativeEvents('model', 		plugin.modelEvents 			|| {}, plugin.cid );
		this._bindDeclarativeEvents('collection', 	plugin.collectionEvents 	|| {}, plugin.cid );
		this._bindDeclarativeEvents('view', 		plugin.viewEvents 			|| {}, plugin.cid );
		this._bindDeclarativeEvents('parent', 		plugin.parentEvents 		|| {}, plugin.cid );
		
	};
	
	
	var __unloadPluginMethod = function( prop, val ) {
				
		if ( _.isUndefined(this[prop]) ) return;
		
		if ( !_.isEqual( this[prop], val ) ) return;
		
		delete( this[prop] );
		
	};
	
	var __unloadPluginEvents = function( plugin ) {
		
		// DOM Events
		this.$el.unbind('.delegateEvents' + plugin.cid);
		
		// Declarative Events
	    this._unbindDeclarativeEvents('model', 			plugin.cid );
		this._unbindDeclarativeEvents('collection', 	plugin.cid );
		this._unbindDeclarativeEvents('view', 			plugin.cid );
		this._unbindDeclarativeEvents('parent', 		plugin.cid );
		
	};
	


})($,_,Backbone);
/*******************[ C O N F I G U R A B L E      P L U G I N S ] ****************************/


















/***************************************************************************************
       CORE VIEW EXTENSION
       
***************************************************************************************/


;(function($,_,Backbone){

	var _View = Backbone.View;
	
	Backbone.View = _View.extend({
		
		
		/**
		 * Ensure Extension Method
		 * loads internal logic to extend Backbone.View capabilities
		 */
		_ensureElement: function() {
			
			_View.prototype._ensureElement.apply( this, arguments );	
			
			
			// View Parent Relations
			if ( this.options.parent ) this.setParent( this.options.parent );
			
			
		},

		
		/**
		 * Utility for setting the parent view.
		 */
		setParent: function( parent ) {
			
			this.parent = parent;
			
			this.bindParentEvents();
			
			return this;
			
		},
		










/***************************************************************************************
       RENDERING FACILITIES
***************************************************************************************/	
		
		/**
		 * renderTo( target, p1, p2, ... )
		 * Replace target DOM content with this element
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		renderTo: function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.html( this.el );
			
			return this;
			
		},
		
		/**
		 * renderAfter( target, p1, p2, ... )
		 * Place "this.el" AFTER the target DOM element
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		renderAfter: function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.after( this.el );
			
			return this;
			
		},
		
		/**
		 * renderBefore( target, p1, p2, ... )
		 * Place "this.el" BEFORE the target DOM element
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		renderBefore: function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.before( this.el );
			
			return this;
			
		},
		
		/**
		 * appendTo( target, p1, p2, ... )
		 * Append "this.el" to target DOM content
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		appendTo: function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.append( this.el );
			
			return this;
			
		},
		
		/**
		 * prependTo( target, p1, p2, ... )
		 * Prepend "this.el" to target DOM content (at the beginning)
		 *
		 * First argument must be a DOM reference.
		 * Oter arguments will be sent to this.render() method
		 */
		prependTo: function() {
			
			arguments = _.values( arguments );
			
			var $target = $( arguments.shift() );
			
			if ( !$target.length ) return false;
			
			// render the element only if the sencond (and last) argument is set to false.
			if ( arguments.length > 1 || arguments[0] !== false) this.render.apply( this, arguments );
			
			$target.prepend( this.el );
			
			return this;
			
		}



	// --------------------------------------------------
	}); // End Backbone.View extension
	// --------------------------------------------------


})($,_,Backbone);
/******************************** [[    C O R E     V I E W   ]] ***********************************/






























// -- Global Name Wrapper --
})( jQuery, _, Backbone );
	
	

