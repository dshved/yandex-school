'use strict';

window.MyForm = {
  form: document.forms['myForm'],
  timer: undefined,
  validate: function() {
    const { fio, email, phone } = window.MyForm.getData(myForm);
    const isValid = false;
    const errorFields = [];

    function validateEmail(email) {
      const regex = /^[-a-z0-9!#$%&'*+\/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+\/=?^_`{|}~]+)*@(?:yandex|ya|\.)*(?:ru|ua|by|kz|com|[a-z][a-z])$/;
      return regex.test(email);
    };

    function validateFio(fio) {
      if (fio.trim().split(' ').length === 3) {
        return true;
      }
      return false;
    };

    function validatePhone(phone) {
      let phoneNumbers = phone.replace(/\D/g, '').split('');
      if (phoneNumbers.length === 11) {
        let sum = 0;
        phoneNumbers.forEach(item => {
          sum += item * 1;
        });

        if (sum >= 30) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    };

    if (!validateFio(fio)) {
      errorFields.push('fio');
    }

    if (!validateEmail(email)) {
      errorFields.push('email');
    }

    if (!validatePhone(phone)) {
      errorFields.push('phone');
    }

    if (!errorFields.length) {
      return { isValid: true, errorFields };
    }
    return { isValid: false, errorFields };

  },
  getData: function() {

    const fio = window.MyForm.form.elements['fio'].value;
    const email = window.MyForm.form.elements['email'].value;
    const phone = window.MyForm.form.elements['phone'].value;

    return { fio, email, phone };
  },
  setData: function(object) {
    window.MyForm.form.elements['fio'].value = object['fio'];
    window.MyForm.form.elements['email'].value = object['email'];
    window.MyForm.form.elements['phone'].value = object['phone'];
  },
  clearErrors: function() {
    const fio = window.MyForm.form.elements['fio'].classList.remove('error');
    const email = window.MyForm.form.elements['email'].classList.remove('error');
    const phone = window.MyForm.form.elements['phone'].classList.remove('error');
  },

  submit: function() {
    clearTimeout(window.MyForm.timer);
    window.MyForm.clearErrors();
    const resultValidate = window.MyForm.validate();
    if (resultValidate.isValid) {
      submitButton.disabled = true;
      let url = window.MyForm.form.action;
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          let resultContainer = document.getElementById('resultContainer');
          resultContainer.className = '';
          resultContainer.innerHTML = '';
          if (data.status === 'success') {
            resultContainer.classList.add('success');
            resultContainer.innerHTML = 'Success';
          }

          if (data.status === 'error') {
            resultContainer.classList.add('error');
            resultContainer.innerHTML = data.reason;
          }

          if (data.status === 'progress') {
            resultContainer.classList.add('progress');
            resultContainer.innerHTML = `Повторный запрос через ${data.timeout} миллесекунд`;
            window.MyForm.timer = setTimeout(function() {
              window.MyForm.submit()
            }, data.timeout);
          }
        })
        .catch();

    } else {
      const errorFields = resultValidate.errorFields;
      errorFields.forEach(item => {
        window.MyForm.form.elements[item].classList.add('error');
      });
    }
  },
};


$(document).ready(function() {
  $('#phone').mask('+7(000)000-00-00');

  $("#submitButton").click(function(e) {
    e.preventDefault();
    window.MyForm.submit();
  });
});