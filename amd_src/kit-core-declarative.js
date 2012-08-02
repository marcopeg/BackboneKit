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















});