

// -- Global Name Wrapper --
(function($,_,Backbone) {















	_.extend( Backbone, {
		
		Kit: {
			
			// General Kit informations
			version: 	'0.0.0',
			author: 	'Marco Pegoraro - MPeg',
			
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
				
			},
			
			
			
			/**
			 * Walk throught class ancestors to inherith (mixing) required property.
			 */
			__TO__DELETE__inheritProperty: function( obj, pro ) {
				
				// Compose the list of property value versions across class ancestors.
				
				var v = [];
				
				var p = obj.__proto__;
				
				while ( _.isObject(p) ) {
					
					//obj[pro] = $.extend( true, {}, p[pro], obj[pro] );
					if ( p[pro] ) v.push( p[pro] );
					
					p = p.__proto__;
					
				}
				
				// Apply new values level after level.
				
				obj[pro] = null;
				
				_.each( v.reverse(), function( step ) {
					
					obj[pro] = $.extend( true, {}, obj[pro], step );
					
				}, this );
				
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
	
	var _extend = Backbone.View.extend;
	
	Backbone.View.extend = function( childProp ) {
		
		// Get prototype and new class's options out of the BackboneJS extension logic.
		var protoOptions = _.clone(this.prototype.options) 	|| {};
		var childOptions = _.clone(childProp.options) 		|| {};
		
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
		if ( protoPlugins && childPlugins ) {
			
			ex.prototype.plugins = protoPlugins;
			
			_.each( childPlugins, function( plug ) {
				
				if ( _.indexOf( ex.prototype.plugins, plug ) < 0 ) ex.prototype.plugins.push( plug );
				
			});
			
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
			
		}
		
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
				
		}
		
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
			
		}
		
		
		return ex;
	
	// ---------------------------------------------------
	}; // EndOf: View.extend() ---
	// ---------------------------------------------------











/***************************************************************************************
       PLUGINS - Make View Pluginable
       
       Attach properties and new methods to a target view object.
       Inject before and after logic to existing methods
       
       // Attach functionality on-the fly
       myView.plugin({ foo:function(){ ... } })
       
       // Attach a plugin by name
       myView.plugin( 'myPlugin' )
       ( 'myPlugin' is requested as 'Backbone.Kit.Plugin.myPlugin' )
       
***************************************************************************************/
	
	Backbone.View.plugin = function( _plugin ) {
		
		// Loads plugin by name from the Kit Plugin repository.
		if ( _.isString(_plugin) ) _plugin = Backbone.Kit.Plugin[_plugin];
		
		// protect form undefined plugins
		if ( !_plugin ) return this;
		
		// protect from undefined target
		var _self = this.prototype;
		if ( !_self ) return this;
		
		
		
		
		// Extract the before/after kays from the plugin configuration.
		// Then remove it from the plugin configuration to prevent propagation in the target object
		var _before = _plugin.before 	|| {};
		var _after	= _plugin.after 	|| {};
		
		if ( _plugin.before ) 	delete _plugin['before'];
		if ( _plugin.after ) 	delete _plugin['after'];
		
		
		
		
		
		
		// Internal properties default values
		_self.attributes 	= _self.attributes 		|| {};
		_plugin.attributes 	= _plugin.attributes 	|| {};
		
				
		// we add those methods which exists on `_plugin` but not on `_self` to the latter
		_.defaults( _self, _plugin );
		
		// and we do the same for events
		_.defaults( _self.events, 		_plugin.events );
		_.defaults( _self.attributes, 	_plugin.attributes );
		
		
		
		
		
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
	 * Attach multiple plugins passed as array.
	 * 
	 * If no plugins are found it check into the prototype plugins configuration param to
	 * loads all configured plugins.
	 */
	Backbone.View.attachPlugins = function( plugins ) {
		
		// Fallback to the configured plugins list
		if ( !plugins ) {
			
			if ( !this.prototype || !this.prototype.plugins || !_.isArray(this.prototype.plugins) ) return;
			
			plugins = this.prototype.plugins;	
			
		}
		
		
		// Loads plugins
		_.each( plugins, function( plug ) {
			
			this.plugin( plug );
			
		}, this);
		
		
	}
	
	
	


	
	
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
		
		
		/**
		 * Ensure Extension Method
		 * loads internal logic to extend Backbone.View capabilities
		 */
		_ensureElement: function() {
			
			_View.prototype._ensureElement.apply( this, arguments );	
			
			// Global View Repository
			this._ensureGlobalView.apply( this, arguments );
			
			// View Parent Relations
			this._ensureParentView.apply( this, arguments );
			
			// Configurable Plugins
			this._ensureConfigurablePlugins.apply( this, arguments );
			
		},
		
		
		/**
		 * Add post construction logic to bind declarative events
		 */
		constructor: function () {
			
			_View.apply(this, Array.prototype.slice.call(arguments));
			
			this.bindModelEvents();
			
			this.bindCollectionEvents();
			
			this.bindViewEvents();
			
			this.bindParentEvents();
			
		},




		
		
		
		
		
/***************************************************************************************
       GLOBAL VIEW COLLECTION
       
       Creates a "viewID" property for the instance then adds the view object to the
       global Backbone.Kit collection.
       
       This way every View instance can be globally accessed with:
       Backbone.Kit.getView('viewID')
       
       viewID should be the view.id or view.cid.
       
***************************************************************************************/
		
		_ensureGlobalView: function() {
			
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
			
		},
		
		
		
		
		
		
		
		
		
		
/***************************************************************************************
       PARENT VIEW RELATION
***************************************************************************************/
		
		_ensureParentView: function() {
			
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
       CONFIGURABLE PLUGINS
       
       Loads every plugins as defined into the "plugins" array.
       
***************************************************************************************/
		
		_ensureConfigurablePlugins: function() {
			
			// Attach configurable plugins
			this.constructor.attachPlugins();
			
			
		},
		
		
		
		
		
		
		
		
		
		
		
		
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
		
		_bindDeclarativeEvents: function (prop, events) {
			
			var methods = (viewMethods[prop][this.cid] || (viewMethods[prop][this.cid] = []));
			
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
	
		_unbindDeclarativeEvents: function (prop) {
			
			var methods = viewMethods[prop][this.cid];
			
			if (!methods) return;
			
			var method;
			
			if ( prop === 'view' ) {
				
				while (method = methods.pop()) this.off(null, method, this);
				
			} else {
				
				while (method = methods.pop()) this[prop].off(null, method, this);
					
			}
			
			delete viewMethods[prop][this.cid];
			
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
		unbindParentEvents: 		function() { this._unbindDeclarativeEvents('parent') },

		














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
	
	







	
	
	





// -- Global Name Wrapper --
})( jQuery, _, Backbone );
	
	

