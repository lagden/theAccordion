# jquery.theAccordion.js

Simple Accordion plugin

## Dependencies

    - jQuery
    - Greensock

## Installation

Install with [Bower](http://bower.io):

    bower install --save theAccordion

The component can be used as an AMD module or a global.

## Api

### open

Open a block by index.

#### Example

    $el.theAccordion('open', 0);
    
    /* or */
    
    $el.data('theAccordion').open(0);
    
### close

Close a block by index.

#### Example

    $el.theAccordion('close', 0);
    
    /* or */
    
    $el.data('theAccordion').close(0);
    
### update

Update canvas size according to the size of the content.

#### Example

    $el.theAccordion('update');
    
    /* or */
    
    $el.data('theAccordion').update();



