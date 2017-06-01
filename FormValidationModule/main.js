$(function(){
    moduleValidation.init();
});

var moduleValidation = (function($){
    var variables = {
        errorClass: 'error',
        regEmail: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    };
    return {
        init: function(){
            var self = this;

            $('form.validation-form').each(function() {
                self.form = $(this);
                self.inputs = self.form.find('.form-control, .required-checkbox');
                self.loading = self.form.find('.loader').hide();

                self.formSubmit();
            });
        },
        validateForm: function() {
            var self = this;
            var stateArray = [];
            this.inputs.each(function(i, item) {
                var $obj = $(item)
                $obj.parent().removeClass(variables.errorClass);
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
                    errorState: !variables.regEmail.test($obj.val()),
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
                    window.location.assign("http://dev.designer.tradeonly.com/editor_v2/build/index.html?templateId=204");
                },
                error: function(jqXHR, ajaxOptions, exception){
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
        showErrors : function(stateArray){
            stateArray.forEach(function(item) {
                var $obj = item.$obj;
                var hasErrors = item.errorState;

                if(hasErrors) {
                    $obj.parent().addClass(variables.errorClass);
                    if (item.field === 'password') {
                        $('.password-alert').show();
                        $obj.parent().removeClass(variables.errorClass);
                    }
                }

                $obj.one('change', function() {
                    if (item.field === 'password') {
                        $('.password-alert').hide();
                    }
                    $(this).parent().removeClass(variables.errorClass);
                });
            })
        },
        formSubmit: function() {
            var self = this;

            self.form.on('submit', function(e){
                e.preventDefault();
                var validateState = self.validateForm();
                if (!validateState.hasErrors) {
                    self.sendData();
                } else {
                    self.showErrors(validateState.stateArray)
                }
            });
        }
    };
})(jQuery);
