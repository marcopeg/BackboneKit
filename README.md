BackboneKIT
===========

BackboneJS is a great tool to roganize Javascript code but miss some basic feature like **plugin support** and **inheritance**.
Inspiration comes from complex tools like ExtJS (aka Sencha) and i'm sure many of your will implement my code better!

BackboneKIT is an add-on script that alter the way BackboneJS do some stuff. 
You should use BackboneJS the way you know but under the cowling you have much power!

I didn't reinvent the wheel... just put elegant white tires on Backbone!

## What comes with BackboneKit?

* Inheritance
* Declarative Events
* Plugins Support
* Global Access to Components

## Where to test it?

I setted up a jsFiddle to fork. 
It contains the latest versions of jQuery, Underscore, BackboneJS and BackboneKIT.

[open the BackboneKIT fiddle](http://jsfiddle.net/mpeg/r83au/)


Inheritance
===========

Pretend to have this situation:

- Character
	- GoodCharacter
		- Wizard
	- EvilCharacter
		- Sorcerer

Every _character_ have a name and some logic to display itself.
Frodo is part of "goods", Gandalf is a good Wizard and Saruman an "evil" Sorcerer.
Each _type_ of LOTR characters may display different informations but all of them have a name and some shared logics!

[I setted up a jsFiddle running example you can fork and play with!](http://jsfiddle.net/mpeg/wU83C/)

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


