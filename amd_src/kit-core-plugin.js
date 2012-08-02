define([
	window.__backboneKitAmdBackbone, 
	window.__backboneKitAmdUnderscore, 
	window.__backboneKitAmdJQuery
	
],function( 
	Backbone,
	_, 
	$
){











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























});