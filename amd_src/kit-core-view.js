/**
 * BackboneKit - BackboneJS View Extension
 */

// --- [[    R e q u i r e J S      A M D    ]] ---
define([window.__backboneKitAmdBackbone,window.__backboneKitAmdUnderscore,window.__backboneKitAmdJQuery],function(Backbone,_,$){














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
			
			
			
			// Add plugins from instance options
			if ( this.options.plugins && _.isArray(this.options.plugins) ) {
				
				for ( var i in this.options.plugins ) {
					
					if ( this.plugins.indexOf(this.options.plugins[i]) <= 0 ) {
						
						this.plugins.push(this.options.plugins[i]);
						
					}
					
				}
				
			}
			
			
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
					
					// Try to define if the function is a real function or a constructor of an existing object.
					// If it is a constructor we add it to the properties list!
					if ( _.isEmpty( plugin[prop].prototype ) ) {
						plugin._.added.methods.push( prop );	
						
					} else {
						plugin._.added.properties.push( prop );
						
					}
					
				
				
				
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
			
			// Add loaded methods to the callbacks chain to be callbackable!
			// All values are unique in the array!
			for ( var i in plugin._.added.methods ) {
				if ( this._methods.indexOf(plugin._.added.methods[i]) < 0 ) {
					this._methods.push( plugin._.added.methods[i] );
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
			for ( var i in plugin._.added.methods ) {
				
				// Remove method's name from the calbackable list.
				var _methods = [];
				
				for ( var j in this._methods ) {
					
					if ( plugin._.added.methods.indexOf(this._methods[j]) < 0 ) _methods.push(this._methods[j]);
					
				};
				
				this._methods = _methods;
				
				// Remove the method
				delete this[plugin._.added.methods[i]];
				
			}
			
			// Remove added literals:
			for ( var i=0; i<plugin._.added.literals.length; i++ ) delete this[plugin._.added.literals[i]];
			
			// Remove added properties:
			for ( var i=0; i<plugin._.added.properties.length; i++ ) delete this[plugin._.added.properties[i]];
			
			// Remove the reference from the loaded plugins list
			var _plugins = [];
			
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
			
			_methods: [ 'initialize', 'render', 'remove' ],
			
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












});
// --- [[    R e q u i r e J S      A M D    ]] ---