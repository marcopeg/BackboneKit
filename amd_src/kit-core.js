/**
 * BackboneKit
 * general information file
 */


define([
	window.__backboneKitAmdBackbone
	
],function(
	Backbone
	
){















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
















});