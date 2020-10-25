(() => {
  let model = {
    currentBookData: {
      title: '',
      author: '',
      ISBN: ''
    },
    errors: {},
  }

  const controller = {
    init: function () {
      formView.init();
    },

    handleChange: (e) => {
      model.currentBookData = {
        ...model.currentBookData,
        [e.target.id]: e.target.value
      }
    },

    validateData: () => {
      const { currentBookData, errors } = model;
      const currentBookDataKeys = Object.keys(currentBookData);
      currentBookDataKeys.forEach(key => {
        if (!currentBookData[key]) {
          errors[key] = `${key} cannot be empty`
        }
      });

      return errors
    },

    handleSubmit: (e) => {
      e.preventDefault();
      const errors = Object.values(controller.validateData())

      if (errors.length) {
        controller.warningMessage(errors.join(','), 'error')
      } else {
        controller.addNewBook();
      }

      formView.bookInputs.forEach(input => {
        input.value = ''
      })

      model = {
        currentBookData: {
          title: '',
          author: '',
          ISBN: ''
        },
        errors: {}
      }
    },

    addNewBook: function () {
      resultView.init();
      controller.warningMessage('Book added successfully', 'success')
    },

    warningMessage: function (message, className) {
      controller.removeWarningMessage();
      warningView.init(message, className)
    },

    removeWarningMessage: function () {
      if (document.querySelector('.alert') !== null) {
        document.querySelector('.alert').remove();
        clearTimeout(warningView.removeAfterThreeSeconds);
      }
    },

    deleteBook: function (e) {
      if (e.target.className === 'delete') {
        e.target.parentElement.remove();
        controller.warningMessage('Book deleted successfully', 'success')
      }
    }
  } 

  const formView = {
    init: function () {
      this.submitBtn = document.getElementById('submit-btn');
      this.title = document.getElementById('title');
      this.author = document.getElementById('author');
      this.isbn = document.getElementById('isbn');
      this.bookInputs = [...document.getElementsByClassName('book-input')]
      this.render()
    },

    render: function () {
      // Add event listener to the submission of the form
      this.submitBtn.addEventListener('click', controller.handleSubmit);
      this.bookInputs.forEach(input => {
        input.addEventListener('change', controller.handleChange)
      })
    }
  }

  const resultView = {
    init: function () {
      this.bookList = document.getElementById('book-list');
      this.bookList.addEventListener('click', controller.deleteBook)
      this.render()
    },

    render: function () {
      const {title, author, ISBN} = model.currentBookData;

      resultView.bookList.innerHTML += `
      <tr>
      <td>${title}</td>
      <td>${author}</td>
      <td>${ISBN}</td>
      <td class="delete">X</td>
      </tr>
      `
    }
  }

  const warningView = {
    init: function (message, className) {
      // Create errros div if there is any error
      this.div = document.createElement('div');
      this.div.className = `alert ${className}`;
      this.div.appendChild(document.createTextNode(message.replace(/,/g, ' / ')));
      this.container = document.querySelector('.container');
      this.render();
    },

    render: function () {
      // Insert alert
      setTimeout(() => {
        this.container.insertBefore(this.div, formView.bookForm);
      }, 0)
    }
  }

  controller.init();
})()
