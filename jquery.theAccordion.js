/**
 * jquery.theAccordion.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'greensock/TweenMax'], factory);
    } else {
        // Browser globals
        factory(jQuery, TweenMax);
    }
}(function($, TM) {

    'use strict';

    var pluginName = 'theAccordion',
        defaults = {
            block: '> .theAccordion__block',
            handler: '> .theAccordion__handler:first',
            icon: '> .theAccordion__handler > .theAccordion__handler--title > span:first',
            content: '> .theAccordion__content:first',
            flag: 'aberto',
            iconPlus: 'icon-plus',
            iconMinus: 'icon-minus'
        };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$blocks;
        this.blocks = {};
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.mapContentSize = [];
        this.proxy = {};
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var that = this;

            this.proxy.clica = $.proxy(_onClick, this);

            this.$blocks = this.$element.find(this.options.block);
            this.$blocks.each(function(idx, block){
                var $block = $(block);
                var $icon = $block.find(that.options.icon);
                var $content = $block.find(that.options.content);
                if($content.length === 1) {
                    that.mapContentSize[idx] = $content.outerHeight();
                    TM.set($content, {height: 0});
                }
                if(block.id)
                    that.blocks[el.id] = $block;

                $block.on('click.' + pluginName, that.options.handler, {'block': $block, 'idx': idx, 'content': $content, 'icon': $icon}, that.proxy.clica);
            });
        },
        open: function(bloco) {
            var b = this.blocks[bloco] || false;
            var handler;
            if(b) {
                handler = b.find(this.options.handler);
                if(handler.length === 1)
                    handler.trigger('click.' + pluginName);
            }
        }
    };

    // Private methods
    function _onClick(event) {
        var that = this;
        event.stopPropagation();

        var idx = event.data.idx,
            $block = event.data.block,
            $icon = event.data.icon,
            $content = event.data.content;

        if($block.hasClass(this.options.flag)) {
            event.preventDefault();
            TM.to($content, 0.5, {height: 0, onComplete: function(){
                $block.removeClass(that.options.flag);
                $icon.removeClass(that.options.iconMinus).addClass(that.options.iconPlus);
            }});
        } else {
            TM.to($content, 0.5, {height: this.mapContentSize[idx], onComplete: function(){
                $block.addClass(that.options.flag);
                $icon.removeClass(that.options.iconPlus).addClass(that.options.iconMinus);
            }});
        }
    }

    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, pluginName))
                    $.data(this, pluginName, new Plugin(this, options));
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function() {
                var instance = $.data(this, pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function')
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            });

            return returns !== undefined ? returns : this;
        }
        return null;
    };
}));