/**
 * jquery.theAccordion.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'greensock/TweenMax'], factory);
    } else {
        factory(jQuery, TweenMax);
    }
}(function($, TM) {

    'use strict';

    (function($, sr) {

        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function(func, threshold, execAsap) {

            var timeout;

            return function debounced() {
                var obj = this,
                    args = arguments;

                function delayed() {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                };

                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        }

        // smartResize
        jQuery.fn[sr] = function(fn) {
            return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
        };

    })(jQuery, 'smartResize');


    function _toggle(idx, cmd) {
        var $block = this.blocks[idx] || false;
        var $handler;
        if ($block) {
            $block[cmd](this.options.flag);
            $handler = $block.find(this.options.handler);
            if ($handler.length === 1)
                $handler.trigger('click.' + pluginName);
        }
    }

    function _onClick(event) {
        var that = this;
        event.stopPropagation();
        event.preventDefault();

        var idx = event.data.idx,
            $block = event.data.block,
            $icon = event.data.icon,
            $canvas = event.data.canvas;

        if ($block.hasClass(this.options.flag))
            TM.to($canvas, 0.5, {
                height: 0,
                immediateRender: true,
                overwrite: 'all',
                onComplete: function() {
                    $block.removeClass(that.options.flag);
                    $icon.removeClass(that.options.iconMinus).addClass(that.options.iconPlus);
                }
            });
        else
            TM.to($canvas, 0.5, {
                height: this.mapContentSize[idx],
                immediateRender: true,
                overwrite: 'all',
                onComplete: function() {
                    $block.addClass(that.options.flag);
                    $icon.removeClass(that.options.iconPlus).addClass(that.options.iconMinus);
                }
            });
    }

    function _resizeEnds(event) {
        this.update();
    }

    var pluginName = 'theAccordion',
        defaults = {
            block: ' > .theAccordion__block',
            handler: ' > .theAccordion__handler:first',
            icon: ' > .theAccordion__handler > .theAccordion__handler--title > span:first',
            canvas: ' > .theAccordion__canvas:first',
            content: ' > .theAccordion__content:first',
            flag: 'aberto',
            iconPlus: 'icon-plus',
            iconMinus: 'icon-minus'
        };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$blocks = null;
        this.blocks = [];
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.mapContentSize = [];
        this.proxy = {};
        this.resizeTimeout = null;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.proxy.clica = $.proxy(_onClick, this);

            this.$blocks = this.$element.find(this.options.block);
            for (var i = 0, len = this.$blocks.length; i < len; i++) {
                var $block = $(this.$blocks[i]);
                var $icon = $block.find(this.options.icon);
                var $canvas = $block.find(this.options.canvas);
                var $content = $canvas.find(this.options.content);
                if ($content.length === 1) {
                    this.mapContentSize.push($content.outerHeight());
                    TM.set($canvas, {
                        height: 0
                    });
                }

                this.blocks.push($block);

                $block.on('click.' + pluginName, this.options.handler, {
                    'block': $block,
                    'idx': i,
                    'canvas': $canvas,
                    'icon': $icon
                }, this.proxy.clica);
            }

            this.proxy.resize = $.proxy(_resizeEnds, this);
            $(window).smartResize(this.proxy.resize);
        },

        // Open block
        open: function(idx) {
            _toggle.call(this, idx, 'removeClass');
        },

        // Close block
        close: function(idx) {
            _toggle.call(this, idx, 'addClass');
        },

        // Update blocks size
        update: function() {
            for (var i = 0, len = this.$blocks.length; i < len; i++) {
                var $block = $(this.$blocks[i]);
                var $content = $block.find(this.options.canvas + this.options.content);
                if ($content.length === 1) {
                    this.mapContentSize[i] = $content.outerHeight();
                    if ($block.hasClass(this.options.flag))
                        this.open(i);
                }
            }
        },

        // Debounce
        debounce: function(threshold, execAsap) {
            var func = this,
                timeout;

            return function debounced() {
                var obj = this,
                    args = arguments;

                function delayed() {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                };

                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        }
    };

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