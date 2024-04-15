import axios from 'axios';
import onChange from 'on-change';


const validateName = (name) => (name.trim().length ? [] : ['name cannot be empty']);
const validateEmail = (email) => (/\w+@\w+/.test(email) ? [] : ['invalid email']);
const validateField = (fieldname, data) => (fieldname === 'name' ? validateName(data) : validateEmail(data));

export default () => {
// 1 шаг
  const formHTML = `
  <form id="registrationForm">
    <div class="form-group">
        <label for="inputName">Name</label>
        <input type="text" class="form-control" id="inputName" placeholder="Введите ваше имя" name="name" required>
    </div>
    <div class="form-group">
        <label for="inputEmail">Email</label>
        <input type="text" class="form-control" id="inputEmail" placeholder="Введите email" name="email" required>
    </div>
    <input type="submit" value="Submit" class="btn btn-primary">
</form>`;
  const formContainer = document.querySelector('.form-container');
  formContainer.innerHTML = formHTML;
  // 3 шаг
  const state = {
    errors: {
      name: [],
      email: [],
    },
    values: {
      name: '',
      email: '',
    },
  };
  // 2 шаг
  const form = document.querySelector('form');
  const submit = document.querySelector('[type="submit"]');

  /* 4 шаг
    const hasErrors = () => (_.values(state.errors).reduce((acc, curr) => (curr.length > 0
    ? acc.concat(curr)
    : acc), [])
    .length > 0);
    */

  // 3 шаг
  const watcgState = onChange(state, (path) => {
    // console.log(path);
    const selector = path.split('.')[1];
    const input = document.querySelector(`[name=${selector}]`);
    if (validateField(selector, state.values[selector]).length === 0) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }
    // submit.disabled = hasErrors(state);
    submit.disabled = state.errors.name.length !== 0 || state.errors.email.length !== 0;
  });

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const targetName = e.target.name;
    const data = new FormData(form).get(targetName);
    watcgState.values[targetName] = data;
    watcgState.errors[targetName] = validateField(targetName, data);
  });

  // 2 шаг
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    axios.post('/users', state.values)
      .then((response) => {
        document.body.innerHTML = `<p>${response.data.message}</p>`;
      })
      .catch((errors) => {
        console.log(errors);
      });
  });
};


/*
axios post запрос:
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });*/
