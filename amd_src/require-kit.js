




/**
 * !!! GLOBAL NAMESPACE POLLUTION !!!
 * these globals are used to configure AMD modules BackboneKit depends.
 */
if ( !window.__backboneKitAmdBackbone ) 	window.__backboneKitAmdBackbone 	= 'backbone';
if ( !window.__backboneKitAmdUnderscore ) 	window.__backboneKitAmdUnderscore 	= 'underscore';
if ( !window.__backboneKitAmdJQuery ) 		window.__backboneKitAmdJQuery 		= 'jquery';


require.config({
	
	// Change this to configure your UI folder location
	// this url must be relative to the require base path
	baseUrl: './kit/',
	
	shim: {
		
		
		/**
		 * The Core and BackboneJS extensions
		 */
		'kit-core' : {
			deps: 	[ window.__backboneKitAmdJQuery, window.__backboneKitAmdUnderscore, window.__backboneKitAmdBackbone ]
		},
		
		'kit-core-view-extend' : {
			deps:	[ 'kit-core' ]
		},
		
		/*
		'kit-core-extend' : {
			deps:	[ 'kit-core' ]
		},
		
		'kit-core-mixin' : {
			deps:	[ 'kit-core-extend' ],
		},
		
		'kit-core-global-view' : {
			deps:	[ 'kit-core-mixin' ],
		},
		
		'kit-core-declarative' : {
			deps:	[ 'kit-core-global-view' ]
		},
		
		'kit-core-plugin' : {
			deps:	[ 'kit-core-declarative' ],
		},
		*/
		
		'kit-core-router' : {
			deps:	[ 'kit-core' ]
		},
		
		'kit-core-view' : {
			deps:	[ 'kit-core-view-extend' ]
		}
		
				
	}
	
});

define([
	
	'backbone',
	
	// The Core
	'kit-core-view',
	
	

],function( Backbone ){ return Backbone; });