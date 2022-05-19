// # viết cái required trước:
//     1.tạo cái form options trước. để truyền các địa chỉ cần setup vào.
//     2. tạo đối tường và các rules tương ứng.
//     3. truyền khối object options vào đối tượng
//     4. có khối rồi thì lấy ra form tương ứng để làm tiền đề select những đứa con.
//     5. để tránh lỗi phát sinh do sơ ý ta nên xử lý logic: nếu tồn tại form thì ...
//     6. trước khi muốn lắng nghe các event trên các thẻ input thì ta phải lắng nghe nó từ đó ms có thế set mã vào.
//     7. để select ra đúng thẻ ta phải viết rules để biến đối số truyền vào thành 1 chuỗi để dùng ở hàm sau.
//     8. trong rule hãy return về object vì object có thể thực hiện nhiều hành động, kể cả chạy function.
//     9. trong object đó thứ 1 phải trả về đối số, thứ 2 là key test và function của nó để ra các bài test.
//     10. khi viết ở rules return cái thì thì nó sẽ biến thành value của key rules bên Options. vì vậy khi mà gọi đối tượng Validator thì value rules nhận đc là thứ là vừa ms nhận từ thằng return.
//     11. Có tập hợp các rule rồi thì ta bắt đầu lặp qua các phần tử cúa nó bằng forEach. để lấy đc các cái rule theo 1 cách độc lập. Lấy ra thằng Id của th3 muốn settings. 
//     12. lấy nó ra thôi. sau khi có nó thì ta lắng nghe thôi. nhớ xử lý thêm logic nếu tồn tại VÌ ta đang tạo thư viện. r sau đó hãy lắn nghe event blur.
//     13. tạo 1 biến lưu giá trị trong thẻ input xem nó có rỗng ko? nếu rỗng làm j? 
//     14. để làm đc 13 ta phải trỏ tới hàm test. ở thằng onblur ta có thể lấy đc value và thằng test() rồi. Việc tiếp theo của ta là viết hàm Test để chạy nó.
//     15. Viết funtion test. cầm value của người dùng nhập truyền vào function đó để chạy.
//     16 Nguyên tắc của các Rule:
//         - khi lỗi trả ra message lỗi.
//         - khi hợp lệ ko trả ra gì( undefined).
//     17. trong test() ta phải theem6 vào trim() để tránh người dùng đánh dư khoẳng trắng.
//     18. logic lấy ra đúng thẻ form message:
//         - đứng từ thẻ input- chọc ra thẻ cha- chọn về lại thẻ form message.
//         - inputElement.parentElement.querySelector('.form-message')
//     19. Dùng else để xử lý khi có value. thêm class đỏ.
//     20. để tiện khi bấm submit thì ta kéo đoạn từ on blur ra ngoài để dùng chung.



//Đối tượng Validator
function Validator(options){
      //Lấy element cha
      function getParentElement(element,selector){
            while(element.parentElement){
                  if(element.parentElement.matches(selector)){       //Kiểm tra xem có selector k?
                        return element.parentElement;
                  }
                  element = element.parentElement
            }
      }


      var selectorRules = {}
      //Hàm thực hiện validate
      function validate(inputElement, rule){
            var errorMessage;
            var errorElement = getParentElement(inputElement, options.formGroupSelector).querySelector(options.errorMess);

            //Lấy ra các Rules của selector
            var rules = selectorRules[rule.selector];
            //Lặp qua từng rule và kiểm tra
            for(var i = 0; i < rules.length; i++){
                  switch (inputElement.type){
                        case 'radio':
                        case 'checkbox':
                              errorMessage =rules[i](
                                    formElement.querySelector(rule.selector + ':checked')
                              );
                              break;
                        default:
                              errorMessage = rules[i](inputElement.value);
                  }
                  if(errorMessage) break; // Nếu có lỗi dừng ktra
            }

            //Nếu nhập sai hiện errorMessage
            if(errorMessage){
                  errorElement.innerHTML = errorMessage;
                  getParentElement(inputElement, options.formGroupSelector).classList.add('invalid');
            }else{
                  errorElement.innerHTML = '';
                  getParentElement(inputElement, options.formGroupSelector).classList.remove('invalid');
            }

            return !errorMessage;
      }

      //Lấy element của form cần validate
      var formElement = document.querySelector(options.form);
      if(formElement){

            //Khi submit form
            formElement.onsubmit = function(e){
                  e.preventDefault(); //Hủy hành vi mặc định

                  var isFormValid = true;

                  options.rules.forEach(function(rule){
                        var inputElement = formElement.querySelector(rule.selector);
                        var isValid = validate(inputElement,rule);
                        if(!isValid){
                              isFormValid = false;
                        }
                  });

                  if(isFormValid){

                        //Submit với js
                        if(typeof options.onSubmit === 'function'){

                              var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                              var formValues = Array.from(enableInputs).reduce(function(values,input){
                                    switch(input.type){
                                          case 'radio':
                                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                                break;
                                          case 'checkbox':
                                                if(!input.matches(':checked')) return values;
                                                if(!Array.isArray(values[input.name])){
                                                      values[input.name] = []
                                                }
                                                values[input.name].push(input.value);
                                                break;
                                          case 'file':
                                                values[input.name] = input.files;
                                                break;
                                          default:
                                                values[input.name] = input.value;
                                    }
                                    return values;
                              },{});
                              options.onSubmit(formValues);
                        }
                        //SUbmit với hành vi mặc định
                        else{
                              formElement.submit()
                        }
                  }

            }
            options.rules.forEach(function(rule){

                  //Lưu lại các rules cho mỗi input
                  if(Array.isArray(selectorRules[rule.selector])){
                        selectorRules[rule.selector].push(rule.test);
                  }else{
                        selectorRules[rule.selector] = [rule.test];
                  }

                  var inputElements = formElement.querySelectorAll(rule.selector);
                  Array.from(inputElements).forEach(function(inputElement){
                        // Trường hợp blur khỏi ô input
                        inputElement.onblur = function(){
                              validate(inputElement,rule);
                        }

                        //Mỗi khi người dùng nhập
                        inputElement.oninput = function(){
                              var errorElement = getParentElement(inputElement, options.formGroupSelector).querySelector(options.errorMess);
                              errorElement.innerHTML = '';
                              getParentElement(inputElement, options.formGroupSelector).classList.remove('invalid');
                        }
                  })
                  
            })
      }
}

//Định nghĩa các Rules

Validator.isRequired = function(selector, message){
      return {
            selector: selector,
            test: function(value){
                  return value ? undefined : message || "Vui lòng nhập đủ thông tin";
            }
      }
}

Validator.isEmail = function(selector, message){
      return {
            selector: selector,
            test: function(value){
                  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                  return regex.test(value) ? undefined : message || "Vui lòng nhập đủ thông tin";
            }
      }
}

Validator.minLength = function(selector, min, message){
      return {
            selector: selector,
            test: function(value){
                  return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự `;
            }
      }
}

Validator.isConfirm = function(selector, getConfirmValue, message){
      return {
            selector: selector,
            test: function(value){
                  return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
            }
      }
}