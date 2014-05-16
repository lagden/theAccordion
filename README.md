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

When you append or prepend a content in container, itself will update size.

## Api

### open

Open a block by index.

**idx** `type: int`  
**callback** `type: function` *optional*

#### Example

    $el.theAccordion('open', 0);
    
    /* or */
    
    $el.data('theAccordion').open(0, function(instance, idx, $els){
        console.log('do something!');
    });
    
### close

Close a block by index.

**idx** `type: int`  
**callback** `type: function` *optional*

#### Example

    $el.theAccordion('close', 0);
    
    /* or */
    
    $el.data('theAccordion').close(0);
    
### update

Update canvas size according to the size of the content.

**idx** `type: int` *optional*  
**callback** `type: function` *optional*

#### Example

    $el.theAccordion('update');
    
    /* or */
    
    $el.data('theAccordion').update();
