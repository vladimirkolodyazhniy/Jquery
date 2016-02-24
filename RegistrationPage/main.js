$(function(){
    $('#signup-form').formValidation();
    $('#signin-form').formValidation();
    $('#forgot-password').formValidation();
    changeModal();
});


function changeModal() {
    $('.changeBtn, .closeBtn').on('click', function(e) {
        e.preventDefault();
        var $link = $(this);
        var block = $link.attr('href');
        $(block).fadeIn().addClass('active').siblings().fadeOut().removeClass('active');
    });
}

;(function($){
    function FormValidation(options) {
        this.options = $.extend({
            errorClass: 'error',
            regEmail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        }, options);
        this.init();
    }
    FormValidation.prototype = {
        init: function(){

            this.form = $(this.options.holder);
            this.inputs = this.form.find('.form-control, .required-checkbox');
            this.loading = this.form.find('.loader').hide();

            this.formSubmit();
        },
        validateForm: function() {
            var self = this;
            var stateArray = [];

            this.inputs.each(function(i, item) {
                var $obj = $(item)
                $obj.parent().removeClass(self.options.errorClass);
                var state = self.checkField(i, $obj);
                if (state) {
                    stateArray.push({
                        $obj: $obj,
                        errorState: state.errorState,
                        field: state.field
                    })
                }
            });

            var errorStates = stateArray.map(function(item) {return item.errorState});

            return {
                hasErrors: errorStates.indexOf(true) >= 0,
                stateArray: stateArray
            }
        },
        checkField: function(i, $obj) {
            var className = $obj.attr('class');
            if (className.indexOf('required-email') > 0) {
                return {
                    errorState: !this.options.regEmail.test($obj.val()),
                    field: 'simple'
                };
            }
            if (className.indexOf('required-checkbox') >= 0) {
                return {
                    errorState: $obj.get(0).checked === false,
                    field: 'simple'
                };
            }
            if (className.indexOf('required') > 0) {
                return {
                    errorState: !$obj.val().length || $obj.val() === $obj.attr('rel'),
                    field: 'simple'
                };
            }
            if (className.indexOf('require-password') > 0) {
                if( $("#password").val().length === 0 ) {
                    return {
                        errorState: $("#password").val().length === 0,
                        field: 'simple'
                    }
                } else {
                    return {
                        errorState: ($("#password").val() !== $("#confirm-password").val()),
                        field: 'password'
                    }
                }
            }
        },
        sendData: function() {
            var self = this;

            self.loading.show();

            $.ajax({
                type: self.form.attr('method'),
                url: self.form.attr('action'),
                data: self.form.serialize(),
                success: function(data) {
                    console.log('Success!!!');
                    self.loading.hide();
                    // window.location.assign("http://dev.designer.tradeonly.com/editor_v2/build/index.html?templateId=204");
                },
                error: function(jqXHR, ajaxOptions, exception) {
                    if (jqXHR.status === 0) {
                        console.log('Not connect.n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        console.log('Requested page not found. [404]');
                    } else if (jqXHR.status == 500) {
                        console.log('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        console.log('Requested JSON parse failed.');
                    } else if (exception === 'timeout') {
                        console.log('Time out error.');
                    } else if (exception === 'abort') {
                        console.log('Ajax request aborted.');
                    } else {
                        console.log('Uncaught Error.n' + jqXHR.responseText);
                    }

                    self.loading.hide();
                }
            });
        },
        showErrors : function(stateArray) {
            var self = this;

            stateArray.forEach(function(item) {
                var $obj = item.$obj;
                var hasErrors = item.errorState;

                if(hasErrors) {
                    $obj.parent().addClass(self.options.errorClass);

                    if (item.field === 'password') {
                        $('.password-alert').show();
                        $obj.parent().removeClass(self.options.errorClass);
                    }
                }

                $obj.one('change', function() {
                    if (item.field === 'password') {
                        $('.password-alert').hide();
                    }
                    $(this).parent().removeClass(self.options.errorClass);
                });
            })
        },
        formSubmit: function() {
            var self = this;

            self.form.on('submit', function(e){
                var validateState = self.validateForm();
                e.preventDefault();
                if (!validateState.hasErrors) {
                    self.sendData();
                } else {
                    self.showErrors(validateState.stateArray)
                }
            });
        }
    }
    $.fn.formValidation = function(opt) {
        return this.each(function () {
            $(this).data('FormValidation', new FormValidation($.extend(opt,{holder:this})));
        });
    };
})(jQuery);
