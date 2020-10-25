(() => {
  //our model
  let model = {
    books: [],
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
    //fill the model field with input change
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
        const lastBookId = model.books.length;
        model.books.push({ ...model.currentBookData, id: lastBookId + 1 })
        controller.addNewBook();
      }

      formView.bookInputs.forEach(input => {
        input.value = ''
      })

      console.log(model)

      model = {
        ...model,
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
      }
    },

    deleteBook: (e) => {
      const index  = model.books.findIndex(book => book.id === e.target.id)
      model.books.splice(index, 1)
      controller.warningMessage('Book deleted successfully', 'success');
      resultView.render();
    }
  }

  const formView = {
    init: function () {
      this.submitBtn = document.getElementById('submit-btn');
      this.title = document.getElementById('title');
      this.author = document.getElementById('author');
      this.isbn = document.getElementById('isbn');
      this.bookInputs = [...document.getElementsByClassName('book-input')];

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
      resultView.bookList.innerHTML = '';

      model.books.forEach(book => {
        const { title, author, ISBN, id } = book;
        const tr = `
            <tr >
            <td>${title}</td>
            <td>${author}</td>
            <td>${ISBN}</td>
            <td class="delete" id=${id}>X</td>
            </tr>
            `
        resultView.bookList.innerHTML += tr
      })
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
