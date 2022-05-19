function Validator(option){
      var formElement = document.querySelector(option.form);
      if(formElement){
            option.rules.forEach(function(rule){
                  var inputElement = formElement.querySelector(rule.selector);
                  var errorElement = inputElement.parentElement.querySelector(option.errorMess);
                  var errorMessage = rule.test(inputElement.value);
                  if(inputElement){
                        inputElement.onblur = function(){
                              if(errorMessage){
                                    errorElement.innerHTML = errorMessage;
                                    inputElement.parentElement.classList.add('invalid')
                              }
                              else{
                                    errorElement.innerHTML = '';
                                    inputElement.parentElement.classList.remove('invalid')
                              }
                        }

                        inputElement.oninput = function(){
                              var errorElement = inputElement.parentElement.querySelector(option.errorMess);
                              inputElement.parentElement.classList.remove('invalid');
                              errorElement.innerHTML = '';
                        }
                        return !errorMessage;
                  }
            })
      }
}

Validator.isRequired = function(select){
      return {
            selector: select,
            test: function(value){
                  return value ? undefined : 'Vui lòng nhập đủ thông tin';
            }
      }
}