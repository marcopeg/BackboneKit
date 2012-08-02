/**
 * BackboneKit - BackboneJS View Extension
 */

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




















});