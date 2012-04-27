(function ($) {
    $.thunder = {};

    $.thunder.settings = {
        version: '1.0.6'
    };

    var methods = {
        message: {
            create: function ($this, cssClass, message, options) {
                var settings = $.extend({
                    animate: true,
                    focus: false,
                    close: {
                        show: true,
                        title: 'Close this notification'
                    }
                }, options);

                $this.addClass('thunder-notification');
                $this.hide();
                $this.empty();

                var $focus = $({});
                var $targetScroll = ($this.parent().css('overflow') == 'visible' ? $('html:not(:animated),body:not(:animated)') : $this.parent());
                var $content = $('<div class="thunder-notification-content"></div>');

                $this.addClass(cssClass);
                $this.append($content);

                if ($.isArray(message) && message.length > 0) {
                    var ul = $('<ul></ul>');
                    $.each(message, function () {
                        ul.append($('<li></li>').html(this.Text));
                    });
                    $content.html(ul);
                } else {
                    $content.html(message);
                }

                if (settings.focus) {
                    $focus = $this.prev('.thunder-notification-focus');
                    if ($focus.size() == 0) {
                        $this.before('<div class="thunder-notification-focus"></div>');
                        $focus = $this.prev('.thunder-notification-focus');
                    }
                }

                if (settings.animate) {
                    if (settings.focus) {
                        $targetScroll.animate({ scrollTop: $focus.offset().top - 20 }, 'slow', function () {
                            $this.slideDown();
                        });
                    } else {
                        $this.slideDown();
                    }
                } else {
                    $targetScroll.scrollTop(($focus.offset().top - 20));
                    $this.show();
                }

                if (settings.close.show) {
                    var $close = $('<a class="close" href="#"></a>');

                    $close.attr('title', settings.close.title);
                    $this.append($close);

                    $close.click(function (e) {
                        if (settings.animate) {
                            $this.slideUp();
                        } else {
                            $this.hide();
                        }
                        e.preventDefault();
                    });
                }
            },
            success: function (message, options) {
                return this.each(function () {
                    methods.message.create($(this), 'thunder-success', message, options);
                });
            },
            error: function (message, options) {
                return this.each(function () {
                    methods.message.create($(this), 'thunder-error', message, options);
                });
            },
            attention: function (message, options) {
                return this.each(function () {
                    methods.message.create($(this), 'thunder-attention', message, options);
                });
            },
            information: function (message, options) {
                return this.each(function () {
                    methods.message.create($(this), 'thunder-information', message, options);
                });
            }
        }
    };

    $.fn.message = function (method) {
        if (methods.message[method]) {
            return methods.message[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method == 'object' || typeof method == 'string') {
            return methods.message.success.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.message');
        }
    };

    $.fn.ajaxForm = function (options) {
        var $form = $(this);
        var settings = $.extend({
            message: null,
            loading: null,
            disableElements: 'input,select,textarea,button',
            onSuccess: function () {
            },
            onBefore: function () {
            },
            onComplete: function () {
            }
        }, options);
        var $message = $(settings.message);
        var $loading = $(settings.loading);
        var $button = $form.find('input[type="submit"]');

        if ($message.size() == 0) {
            $form.before('<div class="thunder-form-message"></div>');
            $message = $form.prev('.thunder-form-message');
        }

        if ($loading.size() == 0) {
            $button.after('<span class="thunder-form-loading"></span>');
            $loading = $form.find('.thunder-form-loading');
            $loading.css({
                'margin-top': -$button.outerHeight(),
                'margin-left': $button.outerWidth() + 2
            });
        }

        $form.data('message', $message);

        $message.hide();
        $loading.hide();

        if (!$form.attr('action') || $form.attr('action').trim() == '') {
            $message.message('error', 'Form action no exist.');
        }

        $form.live('submit', function () {
            $message.hide();

            $.ajax({
                statusCode: statusCode($message),
                url: $form.attr('action'),
                type: $form.attr('method'),
                headers: { 'Thunder-Ajax': true },
                data: $form.serialize(),
                beforeSend: function () {
                    $(settings.disableElements, $form).disableElement();
                    $loading.show();
                    settings.onBefore();
                },
                complete: function () {
                    $(settings.disableElements, $form).enableElement();
                    $loading.hide();
                    settings.onComplete();
                },
                success: function (r) {
                    window.setTimeout(function () {
                        if (typeof (r) == 'object') {
                            if (r.Status) {
                                if (r.Status == 200) {
                                    settings.onSuccess($form, r);
                                }
                                else {
                                    if (r.Messages) {
                                        if (r.Status == 202) {
                                            $message.message('error', r.Messages);
                                        } else if (r.Status == 203) {
                                            $message.message('information', r.Messages);
                                        } else if (r.Status == 204) {
                                            $message.message('attention', r.Messages);
                                        }
                                    } else {
                                        $message.message('error', 'Message no exist in request result.');
                                    }
                                }
                            }
                        } else {
                            if ($(r).is('.message')) {
                                $message.html(r);
                                $message.show();
                            } else {
                                settings.onSuccess($form, r);
                            }
                        }
                    }, 0);
                }
            });

            return false;
        });
    };

    $.fn.grid = function (options) {
        var $grid = $(this);
        var settings = $.extend({
            message: null,
            loading: null,
            form: null,
            url: $grid.data('url'),
            pageSize: !$grid.data('page-size') ? 10 : $grid.data('page-size'),
            load: !$grid.data('load') ? true : $grid.data('load'),
            orders: [],
            onComplete: function () {
            },
            onBeforeSubmit: function () {
            }
        }, options);
        var $message = $(settings.message);
        var $loading = $(settings.loading);
        var $form = $(settings.form);
        var $content = $('<div class="thunder-grid-content"></div>');

        $grid.html($content);

        if ($message.size() == 0) {
            $grid.before('<div class="thunder-grid-message"></div>');
            $message = $grid.prev('.thunder-grid-message');
        }

        if ($form.size() == 0) {
            $grid.prepend('<form class="thunder-grid-form"></form>');
            $form = $('.thunder-grid-form', $grid);
        }

        $form.append('<input type="hidden" name="CurrentPage" value="0" />');
        $form.append('<input type="hidden" name="PageSize" value="' + settings.pageSize + '" />');
        $form.setOrders(settings.orders);

        if (!settings.url || settings.url == '') {
            $message.message('error', 'Url is null.');
            return;
        }

        var createLoading = function () {
            if ($(settings.loading).size() == 0) {
                $content.html('<div class="thunder-grid-loading"></div>');
                $loading = $('.thunder-grid-loading', $content);
            }

            $loading.hide();
        };

        var load = function (loading) {
            settings.onBeforeSubmit();
            
            $.ajax({
                statusCode: statusCode($message),
                type: 'POST',
                data: $form.serialize(),
                url: settings.url,
                headers: { 'Thunder-Ajax': true },
                beforeSend: function () {
                    loading.show();
                },
                complete: function () {
                    loading.hide();
                },
                success: function (r) {
                    if (typeof (r) == 'string') {
                        $content.html(r);
                        $('tbody tr:even', $grid).addClass('even');
                        settings.onComplete($grid);
                    }
                }
            });
        };

        var paginate = function (currentPage) {
            $('input:hidden[name="CurrentPage"]', $form).val(currentPage);
            load($('.thunder-paged-loading', $grid));
        };

        if (settings.load) {
            createLoading();
            load($loading);
        }

        $form.submit(function () {
            $('input:hidden[name="CurrentPage"]', $form).val(0);
            createLoading();
            load($loading);
            return false;
        });

        $('a.thunder-grid-paged', $grid).live('click', function (e) {
            var $this = $(this);
            if (!$this.is('.disabled')) {
                paginate($this.data('page'));
            }
            e.preventDefault();
        });

        $('a.thunder-grid-order', $grid).live('click', function (e) {
            var $this = $(this);
            if ($this.data('column') != 'undefined' && $this.data('asc') != 'undefined') {
                $form.setOrders([{ 'Column': $this.data('column'), 'Asc': $this.data('asc')}]);
                $('input:hidden[name="CurrentPage"]', $form).val(0);
                load($loading);
            }
            e.preventDefault();
        });

        $('select.thunder-grid-paged', $grid).live('change', function () {
            var $this = $(this);
            paginate($('option:selected', $this).val());
        });
    };

    $.modal = function (options) {
        var settings = $.extend({
            iframe: false,
            iframeScroll: 'no',
            url: '',
            width: 600,
            resizable: false,
            draggable: false,
            cssClass: '',
            onOpen: function () {
            },
            onClose: function () {
            }
        }, options);

        if ($('body')['dialog'] == undefined) {
            $.error('This project not implement jquery.ui.');
            return;
        }

        if ($('.thunder-modal').size() == 0) {
            $('body').prepend('<div class="thunder-modal"></div>');
        }

        var $modal = $('.thunder-modal', $('body'))
            .addClass(settings.cssClass);

        window.modalInstance = $modal;

        $modal.dialog($.extend({
            autoOpen: true,
            modal: true,
            open: function () {
                $('.ui-dialog-titlebar ').remove();

                if (settings.iframe) {
                    var $iframe = $('<iframe frameborder="0" marginheight="0" marginwidth="0" scrolling="auto"></iframe>');

                    $iframe.attr('scrolling', settings.iframeScroll);
                    $iframe.attr('src', settings.url);
                    $iframe.attr('width', $modal.width());
                    $iframe.attr('height', $modal.height());

                    $modal.css('overflow', 'hidden');
                    $modal.html($iframe);

                    $iframe.load(function () {
                        settings.onOpen($($iframe.contents()[0]));
                        $('.thunder-modal-close', $($iframe.contents()[0])).live('click', function (e) {
                            e.preventDefault();
                            $.closeModal();
                        });
                    });
                } else {
                    $modal.append('<div class="thunder-modal-message"></div>')
                          .append('<img src="content/jquery.thunder/images/loading.gif" class="thunder-modal-loading" />');
                    $.ajax({
                        statusCode: statusCode($('.thunder-modal-message', $modal), { close: { show: false} }),
                        headers: { 'Thunder-Ajax': true, 'Thunder-Modal': true },
                        url: settings.url,
                        success: function (html) {
                            $modal.html(html);
                            settings.onOpen($modal);
                        }
                    });
                }
            },
            beforeClose: function () {
                settings.onClose($modal);
                $modal.empty();
                $modal.dialog('destroy');
            }
        }, settings));
    };

    $.closeModal = function () {
        if (window.modalInstance) {
            window.modalInstance.dialog('close');
        }
    };

    $.fn.setOrders = function (orders) {
        return this.each(function () {
            var $this = $(this);
            $('input.thunder-grid-order', $this).remove();
            $.each(orders, function (i) {
                $this.append('<input type="hidden" class="thunder-grid-order" name="Orders[' + i + '].Column" value="' + this.Column + '" />');
                $this.append('<input type="hidden" class="thunder-grid-order" name="Orders[' + i + '].Asc" value="' + this.Asc + '" />');
            });
        });
    };

    $.fn.disableElement = function () {
        return this.each(function () {
            $(this).attr('disabled', 'disabled');
        });
    };

    $.fn.enableElement = function () {
        return this.each(function () {
            $(this).removeAttr('disabled');
        });
    };

    $.fn.serializeObject = function () {
        var data = {};
        var array = this.serializeArray();
        $.each(array, function () {
            if (data[this.name]) {
                if (!data[this.name].push) {
                    data[this.name] = [data[this.name]];
                }
                data[this.name].push(this.value || '');
            } else {
                data[this.name] = this.value || '';
            }
        });
        return data;
    };

    statusCode = function ($message, options) {
        var settings = $.extend({}, options);

        return {
            400: function () {
                $message.message('error', 'Bad request.', settings);
                $('.thunder-modal-loading').hide();
            },
            401: function () {
                $message.message('error', 'Unauthorized.', settings);
                $('.thunder-modal-loading').hide();
            },
            403: function () {
                $message.message('error', 'Forbidden.', settings);
                $('.thunder-modal-loading').hide();
            },
            404: function () {
                $message.message('error', 'Page not found.', settings);
                $('.thunder-modal-loading').hide();
            },
            405: function () {
                $message.message('error', 'Method not allowed.', settings);
                $('.thunder-modal-loading').hide();
            },
            407: function () {
                $message.message('error', 'Proxy authentication required.', settings);
                $('.thunder-modal-loading').hide();
            },
            408: function () {
                $message.message('error', 'Request timeout.', settings);
                $('.thunder-modal-loading').hide();
            },
            500: function () {
                $message.message('error', 'Internal server error.', settings);
                $('.thunder-modal-loading').hide();
            },
            501: function () {
                $message.message('error', 'Not implemented.', settings);
                $('.thunder-modal-loading').hide();
            },
            502: function () {
                $message.message('error', 'Bad gateway.', settings);
                $('.thunder-modal-loading').hide();
            },
            503: function () {
                $message.message('error', 'Service unavailable.', settings);
                $('.thunder-modal-loading').hide();
            }
        };
    };

    String.prototype.replaceAll = function (searchValue, replaceValue) {
        var str = this;
        var position = str.indexOf(searchValue);
        while (position > -1) {
            str = str.replace(searchValue, replaceValue);
            position = str.indexOf(searchValue);
        }
        return (str);
    };

    $(function () {
        $.each($('form[data-ajax]'), function () {
            var $form = $(this);
            if ($form.data('ajax')) {
                $form.ajaxForm({
                    onBefore: function () {
                        if (window[$form.data('ajax-before')]) {
                            window[$form.data('ajax-before')]();
                        }
                    },
                    onComplete: function () {
                        if (window[$form.data('ajax-complete')]) {
                            window[$form.data('ajax-complete')]();
                        }
                    },
                    onSuccess: function (form, r) {
                        if (window[$form.data('ajax-success')]) {
                            window[$form.data('ajax-success')](form, r);
                        }
                    }
                });
            }
        });

        $('.thunder-modal-close').live('click', function (e) {
            e.preventDefault();
            $.closeModal();
        });
    });

})(jQuery);
