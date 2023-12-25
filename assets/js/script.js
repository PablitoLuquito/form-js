(function() {
  class ValidateForm {
    constructor() {
      this.name = document.querySelector('#name');
      this.lastname = document.querySelector('#lastname');
      this.cpfInput = document.querySelector('#cpf');
      this.user = document.querySelector('#user');
      this.password = document.querySelector('#password');
      this.repPassword = document.querySelector('#repeat-password');
    }

    getClicks() {
      document.addEventListener('click', event => {
        const element = event.target;
        const passwords = document.querySelectorAll('.password');
        
        if(element.classList.contains('submit')) {
          event.preventDefault();
          this.checkInputs();
        }

        if(element.classList.contains('reveal-password')) {
          for(let input of passwords) {
            if(input.type === 'password') {
              input.type = 'text';
            } else {
              input.type = 'password';
          }
          }
        }
      })
    }
  
    getCpf() {
      function formatCpf(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
      }

      this.cpfInput.addEventListener('keydown', event => {
        if(event.key === 'Backspace') {
          return;
        }
        if(event.key === 'Tab') {
          return;
        }
        if(!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
        this.cpfInput.value = formatCpf(this.cpfInput.value);
      })
    }

    cpfResolve(cpf) {
      const clearCpf = cpf.replace(/\D+/g, '');

      function getDigit(partialCpf) {
        const cpfArray = Array.from(partialCpf);
        let regressive = cpfArray.length + 1;
        let total = cpfArray.reduce((acc, value) => {
          acc += (regressive * Number(value));
          regressive--;
          return acc;
        }, 0);
        const digit = 11 - (total % 11);
        return digit > 9 ? '0' : String(digit);
      }

      function getNewCpf() {
        const partialCpf = clearCpf.slice(0, -2);
        const penultDigt = getDigit(partialCpf);
        const lastDigit = getDigit(partialCpf + penultDigt);
        return partialCpf + penultDigt + lastDigit;
      }

      function validate() {
        if(clearCpf.length !== 11) return false;
        if(clearCpf[0].repeat(11) === clearCpf) return false;
        
        return getNewCpf() === clearCpf;
      }

      return validate();
    }

    errorMessage(text) {
      const msg = document.createElement('p');
      msg.innerText = text;
      message.classList.add('error-message');
      return message.appendChild(msg);
    }

    successMessage(text) {
      const msg = document.createElement('p');
      msg.innerText = text;
      message.classList.add('success-message');
      return message.appendChild(msg);
    }

    capitalize(string) {
      return string.replace(/\b\w/g, match => match.toUpperCase());
    }

    checkInputs() {
      if(!this.name.value || !this.name.value || !this.cpfInput.value) {
        console.log(this.name.value);
        return this.errorMessage(
          'Necessário preencher todos os campos corretamente.\nYou must fill in all fields correctly.'
        );
      }

      if(/[0-9]/.test(this.name.value) || /[0-9]/.test(this.lastname.value)) {
        return this.errorMessage(
          'Nome e Sobrenome não podem conter números.\nFirst Name and Last Name cannot contain numbers.'
        );
      }

      if(this.user.value.length < 3 || this.user.value.length > 20) {
        return this.errorMessage(
          'O campo usuário deve conter de 3 a 12 caracteres.\nThe user field must contain 3 to 12 characters.'
        );
      }

      if(!/^[a-zA-Z0-9]+$/.test(this.user.value)) {
        return this.errorMessage(
          'O campo usuário deve conter apenas letras e números.\nThe user field must contain only letters and numbers.'
        );
      }

      if(!this.cpfResolve(this.cpfInput.value)) {
        return this.errorMessage(
          'CPF inválido.\nInvalid CPF.'
        );
      }

      if(this.password.value.length < 6 || this.password.value.length > 12) {
        return this.errorMessage(
          'O campo senha deve conter de 6 a 12 caracteres.\nThe password field must contain 3 to 12 characters.'
        );
      }

      if(this.password.value !== this.repPassword.value) {
        return this.errorMessage(
          "As senhas não conferem.\nThe passwords don't match."
        );
      }

      return this.successMessage(`${this.capitalize(this.name.value)} ${this.capitalize(this.lastname.value)} 
        Do CPF: ${this.cpfInput.value} e Usuário: ${this.user.value}.
        Seu cadastro foi finalizado com sucesso!
        Sua senha é: ${this.password.value}
      `);
    }
  }

  const message = document.querySelector('#msg');
  const form = new ValidateForm();
  form.getClicks();
  form.getCpf();
})();
