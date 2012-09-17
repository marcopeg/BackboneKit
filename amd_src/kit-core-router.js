/**
 * BackboneKit - BackboneJS Router Extension
 */

// --- [[    R e q u i r e J S      A M D    ]] ---
define([window.__backboneKitAmdBackbone,window.__backboneKitAmdUnderscore,window.__backboneKitAmdJQuery],function(Backbone,_,$){












/********************************************************
        BackboneKIT - Core Router Extension
        -----------------------------------------------
        
        
*********************************************************/
;(function($,_,Backbone){
	
			
	_.extend(Backbone.Router.prototype,{
		
		refresh: function() {
			
			var _tmp = Backbone.history.fragment;
			
			this.navigate( _tmp + (new Date).getTime() );
			
			this.navigate( _tmp, { trigger:true } );
			
		}
		
	});
	
	
	
})($,_,Backbone);
/******* [[    C O R E    R O U T E R    E X T E N D    ]] ******/

















});
// --- [[    R e q u i r e J S      A M D    ]] ---