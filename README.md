# jquery.theAccordion.js

Simple Accordion plugin

## Dependencies

    - jQuery
    - Greensock

## Installation

Install with [Bower](http://bower.io):

    bower install --save theAccordion

The component can be used as an AMD module or a global.

## Default Options

    defaults = {
        block: ' > .theAccordion__block',
        handler: ' > .theAccordion__handler:first',
        icon: ' > .theAccordion__handler > .theAccordion__handler--title > span:first',
        canvas: ' > .theAccordion__canvas:first',
        content: ' > .theAccordion__content:first',
        flag: 'aberto',
        iconPlus: 'icon-plus',
        iconMinus: 'icon-minus',
        selfUpdate: true
    };

### selfUpdate

When you append or prepend a content from container, it will update itself.

##### Event removed

Example of usage:

	$.when($container.find('p:first').remove()).then(
	    function($removed) {
	        $container.trigger('removed.theAccordion');
	    }
	);

## Api

### open

Open a block by index.

Param        | Type          | Optional
------------ | ------------- | ------------
**idx**      | `int`         | 
**callback** | `function`    | *

#### Example

    $el.theAccordion('open', 0);
    
    /* or */
    
    $el.data('theAccordion').open(0, function(instance, idx, $elements){
        console.log('do something!');
    });
    
### close

Close a block by index.

Param        | Type          | Optional
------------ | ------------- | ------------
**idx**      | `int`         | 
**callback** | `function`    | *

#### Example

    $el.theAccordion('close', 0);
    
    /* or */
    
    $el.data('theAccordion').close(0);
    
### update

Update canvas size according to the size of the content.

Param        | Type          | Optional
------------ | ------------- | ------------
**idx**      | `int`         | *
**callback** | `function`    | *

#### Example

    $el.theAccordion('update');
    
    /* or */
    
    $el.data('theAccordion').update();
