--- IMPORTANT ---

**THIS IS AN OLD REPOSITORY**  
I intentionally leave this repository available to remember me how I was coding back in 2012!  
Please don't clone or use this repo because is certainly out of date!

--- IMPORTANT ---  




BackboneKIT
===========

BackboneJS is a great tool to organize Javascript code but miss some basic feature like **plugin support** and **inheritance**.
Inspiration from missing features comes from more complex tools like ExtJS (aka Sencha)

BackboneKIT is an add-on script that alter the way BackboneJS do some stuff.  
That means **BackboneKIT does NOT alter the way you already use BackboneJS**!

You should use BackboneJS the way you know but under the cowling you have much power!  
You should also use *new methods* and *new objects* supplied by the Kit but it is not  mandatory.

I didn't reinvent the wheel... just put elegant white tires on BackboneJS!

## What comes with BackboneKit?

- **Inheritance**  
Yes, with Kit you should access ancestors's methods and properties!
- **Callbacks**  
interact with Backbone's constructor, interact with all declared methods - _beforeMethod()_, _afterMethod()_  

- **Declarative Events**  
Do you know _events:{}_ object?  
What do you think if you should code _modelEvents:{}_, _collectionEvents:{}_ and more?  

- **Plugins Support**  
adds and remove features on-the-fly from objects with plugins:  
`sidebar.loadPlugin( bounceOnHover );`  

- **Global Access to Components**  
`Backbone.Kit.getView('sidebar').render()`

## Where to test it?

I setted up a jsFiddle to fork. 
It contains the latest versions of jQuery, Underscore, BackboneJS and BackboneKIT.

[open the BackboneKIT fiddle](http://jsfiddle.net/mpeg/r83au/)










## Callbacks

Callback may be useful when extending components and want to add _pre_ or _post_ logic to a method.


#### Methods Callbacks
For every method you define in a Backbone.View Kit will add a _beforeMethod_ and _afterMethod_ callbacks.

If you define a _render()_ method every descendand classes can interact with a _beforeRender()_ and _afterRender()_ method.

Each callback receives all _arguments_ was given to the original method.   
_before{Method}_ callbacks may alter arguments by returning an object like this:

	function beforeRender( txt ) {
		
		txt = 'my version of text';
		
		return {
			arguments: [ txt ]
		}
		
	}

You can also **prevent the execution of original method** by returning a non null value.  
Returned value will be sent to the caller and original method logic will not be executed:

	function beforeRender() {
		
		if ( this.hasRendered ) return false;
	
	}


#### Constructor Callbacks
BackboneKIT redesigns View's contructor() logic and offers you some API to interact with by exposing callbacks:

- beforeConstruct( options ): here you can alter _options_ by returning your custom options object. [try this callback here!](http://jsfiddle.net/mpeg/pAnJe/)
- afterConfigure()
- afterConstruct()

Constructor Callbacks are very usefull whe you need to change some object property **before Backbone's initialization** logic.

Code below let you use a simple string as initialization options:

	// I want to write this:
	new Div('my text...').renderTo('body');
	
	// My Div source may be something like this:
	var Div = Backbone.View.extend({
		
		options: { content:'' },
		
		beforeConstruct: function( opt ) {
			if ( _.isString(opt) ) return { content:opt }
		},
		
		render: function() {		
			this.$el.html( this.options.content );
		}
		
	});

[>> You can play whit this kind of code here!](http://jsfiddle.net/mpeg/pAnJe/)





## Inheritance

Pretend to have this situation:

- Character
	- GoodCharacter
		- Wizard
	- EvilCharacter
		- Sorcerer

Every _character_ have a name and some logic to display itself.
Frodo is part of "goods", Gandalf is a good Wizard and Saruman an "evil" Sorcerer.
Each _type_ of LOTR characters may display different informations but all of them have a name and some shared logics!
	
	/**
	 * This is a generic Container class.
	 * render() will set some text into associated DOM node.
	 */
	var Container = Backbone.View.extend({
		
		render: function( txt ) {
			
			this.$el.html( txt )
		
		}
	
	});
	
	/**
	 * This is a Panel.
	 * render() alters received param then call it's super.
	 */
	var Panel = Container.extend({
		
		render: function( txt ) {
		
			txt = ' -- panel: ' + txt;
			
			this.$call( 'render', txt );
		
		}
	
	});

[jsFiddle for the above code](http://jsfiddle.net/mpeg/etKfb/)

[>> Play with inheritance in this jsFiddle!](http://jsfiddle.net/mpeg/wU83C/)   
In this jsFiddle I set up some LotR characters, Frodo, Gandalf, etc... some are *good characters* and someone else are *bad characters*...  
Try to extend this example the way you want!

#### this.$sup()
Give access to the super object.

#### this.$call( 'functionName', p1, p2, ... )

Try to call "functionName" on the _super_ object.
It pass "this" as execution context to the super.

You can decide to execute with parent's context by adding "true" as first param:

`this.$call( true, 'functionName', p1, p1, ... )`
above "functionName" receive `this.$sup()` as context.


#### this.$apply( 'functionName', [ p1, p2, ... ] );

Just like _$call_ but works with arguments list.

[Don't forget to play with Inheritance jsFiddle!](http://jsfiddle.net/mpeg/wU83C/)











## Declarative Events

**Declarative Events** lets you *define all handled events* in a clear ad **DRY notation** according to the Backbone's *event* declarations.
NOTE: inspiration comes from Codecademy *backbone.declarative* Git:   
https://github.com/Codecademy/backbone.declarative

[>> play with Declarative Events on jsFiddle!](http://jsfiddle.net/mpeg/6Nrwz/)

I often need to set up custom events on view's collection, model and view itself just like DOM events.
BackboneKIT offers a way to write something like:

	events: {
		'click' : 'onClick'
	},
	
	initialize: function() {
		this.model.on( 'change', this.onModelChange, this );
	}
	
But I think there is a DRY way to set up events for view's actors:
	
	// View's DOM Events:
	events: {
		'click' : 'onClick'
	},
	
	// Model's Events:
	modelEvents: {
		'change' : 'onModelChange'
	},
	
	// Collection's Events:
	collectionEvents: {
		'add' : 'onCollectionAdd'
	},
	
	// Events triggered to the view object:
	viewEvents: {
		'changeStatus' : 'onChangeStatus'
	},
	
	// Events triggered to the parent view object (if available):
	parentEvents: {
		'destroy' : 'onParentDestroy'
	}

[>> play with Declarative Events on jsFiddle!](http://jsfiddle.net/mpeg/6Nrwz/)   
This example show you how to use Declarative Events to DRY bind model's changes into Views.

[>> play with a real world example about Declarative Events](http://jsfiddle.net/mpeg/etKfb/)   
This is a **real world example**.    
You have a list of StarWars characters who comes **form a collection of models**.    
You can add new items or edit existing ones by **interacting with** the list and the form.

App's components talks all together by **triggering and listening events**.   
Listening for events is done using the clean _Declarative Events_ offered by BackboneKIT.















## Plugins Support

With the work "plugin" I mean a set of property and methods to be merged with an existing object.    
One plugin may be added to multiple objects.

	// Define a plugin
	var myPlugin = {
		foo: function() { alert("do something"); }
	};
	
	// Apply a plugin to an object
	var myView = Backbone.View.extend();
	myView.plugin( myPlugin );
	
	// Use the object and plugin's methods
	var myViewInstance = new myView();
	myViewInstance.foo();



