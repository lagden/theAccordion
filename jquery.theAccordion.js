/**
 * jquery.theAccordion.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 */

// Debouce
if (!Function.prototype.debounce) {
    Function.prototype.debounce = function(wait, immediate) {
        'use strict';

        var func = this,
            timeout, args, context, timestamp, result;

        var later = function() {
            var last = new Date().getTime() - timestamp;

            if (last < wait && last > 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function() {
            context = this;
            args = arguments;
            timestamp = new Date().getTime();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };
}

// Plugin
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'greensock/TweenMax'], factory);
    } else {
        factory(jQuery, TweenMax);
    }
}(function($, TM) {

    'use strict';

    var $win = $(window);

    var pluginName = 'theAccordion',
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

    var local = {
        _click: function(idx, event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }

            var $els = this.blocks[idx] || false;
            if ($els) {
                var isOpen = $els.$block.hasClass(this.options.flag);
                var m = (isOpen) ? 'close' : 'open';
                this[m](idx);
            }
        },
        _update: function(idx, $els) {
            var $content = $els.$content;
            var isOpen = $els.$block.hasClass(this.options.flag);

            if ($content.length === 1) {
                this.mapContentSize[idx] = $content.outerHeight();
                if (isOpen)
                    this.open(idx);
            }
        },
        _updateDebouce: function(idx) {
            this.update(idx);
        }.debounce(500, false),
    };

    // Trigger Append Event
    var oAppend = $.fn.append;
    $.fn.append = function() {
        return oAppend.apply(this, arguments).trigger('append.' + pluginName);
    };

    // Trigger Prepend Event
    var oPrepend = $.fn.prepend;
    $.fn.prepend = function() {
        return oPrepend.apply(this, arguments).trigger('prepend.' + pluginName);
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
        this.resizeTimeout = null;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var events = [
                'prepend.' + pluginName,
                'append.' + pluginName,
                'removed.' + pluginName
            ];

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

                var $elements = {
                    '$block': $block,
                    '$icon': $icon,
                    '$canvas': $canvas,
                    '$content': $content
                };

                this.blocks.push($elements);
                $block.on('click.' + pluginName, this.options.handler, this.proxy(local._click, i, event));

                if (this.options.selfUpdate)
                    $content.on(events.join(' '), this.proxy(local._updateDebouce, i, event));
            }

            $win.on('resize', this.proxy(local._updateDebouce, event));
        },

        // Open block
        open: function(idx, callback) {
            var $els = this.blocks[idx] || false;
            if ($els) {
                TM.to($els.$canvas, 0.5, {
                    height: this.mapContentSize[idx],
                    immediateRender: true,
                    overwrite: 'all',
                    onComplete: function() {
                        $els.$block.addClass(this.options.flag);
                        $els.$icon.removeClass(this.options.iconPlus).addClass(this.options.iconMinus);
                        if (callback)
                            callback(this, idx, $els);
                    }.bind(this)
                });
            }
        },

        // Close block
        close: function(idx, callback) {
            var $els = this.blocks[idx] || false;
            if ($els) {
                TM.to($els.$canvas, 0.5, {
                    height: 0,
                    immediateRender: true,
                    overwrite: 'all',
                    onComplete: function() {
                        $els.$block.removeClass(this.options.flag);
                        $els.$icon.removeClass(this.options.iconMinus).addClass(this.options.iconPlus);
                        if (callback)
                            callback(this, idx, $els);
                    }.bind(this)
                });
            }
        },

        // Update blocks size
        update: function(idx, callback) {
            var $els;
            if (idx || idx === 0) {
                $els = this.blocks[idx] || false;
                if ($els)
                    this.proxy(local._update, idx, $els)();
            } else {
                for (var i = 0, len = this.blocks.length; i < len; i++) {
                    $els = this.blocks[i];
                    this.proxy(local._update, i, $els)();
                }
            }
            if (callback)
                callback();
        },

        // Proxy
        proxy: function(m) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function() {
                m.apply(this, args);
            }.bind(this);
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