$(document).ready(function () {
  $('#author-form').hide();
  $('#book-form').hide();
  getAuthors();
  submitAuthorForm();
  submitBookForm();
  toggleAuthorForm();
  toggleBookForm();
});

// GET ALL AUTHORS
function getAuthors() {
  $.get('http://localhost:3000/authors', function (data) {
    let grid = $('#authors-grid');
    data.forEach((author) => {
      let card = buildAuthorCard(author);
      grid.append(card);
    });
  });
}

function submitAuthorForm() {
  $('#author-form').on('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(this);
    let formDataObject = {};
    formData.forEach(function (value, key) {
      formDataObject[key] = value;
    });
    createAuthor(formDataObject);
  });
}

function submitBookForm() {
  $('#book-form').on('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(this);
    let formDataObject = {};
    formData.forEach(function (value, key) {
      formDataObject[key] = value;
    });
    createBook(formDataObject);
  });
}

// CREATE AUTHOR
function createAuthor(authorData) {
  $.post({
    url: 'http://localhost:3000/authors',
    contentType: 'application/json',
    data: JSON.stringify(authorData),
    success: function (data) {
      let grid = $('#authors-grid');
      let card = buildAuthorCard(data);
      grid.append(card);
    },
  });
}

function createBook(bookData) {
  const authorID = bookData.author_id;
  delete bookData.author_id;
  $.post({
    url: `http://localhost:3000/authors/${authorID}/books`,
    contentType: 'application/json',
    data: JSON.stringify(bookData),
    success: function () {
      alert('Livro criado com sucesso!');
      window.location.reload();
    },
  });
}

// GET AUTHOR'S BOOKS
function getAuthorBooks(authorId) {
  $.get(`http://localhost:3000/authors/${authorId}/books`, function (data) {
    let grid = $(`#books-grid-${authorId}`);
    data.forEach((book) => {
      let card = buildBookCard(book);
      grid.append(card);
    });
  });
}

function buildSelect() {
  return new Promise((resolve, reject) => {
    let select = $('<select class="form-select" name="author_id"></select>');
    $.get('http://localhost:3000/authors', function (data) {
      data.forEach((author) => {
        let option = `<option value="${author.id}">${author.name}</option>`;
        select.append(option);
      });
      resolve(select);
    });
  });
}

function toggleAuthorForm() {
  $('#author-btn').on('click', function (event) {
    $('#author-form').toggle();
  });
}

function toggleBookForm() {
  let isAdded = false;
  $('#book-btn').on('click', function (event) {
    $('#book-form').toggle();
    buildSelect().then((select) => {
      if (!isAdded) {
        isAdded = true;
        $('#book-form').prepend(select);
      }
    });
  });
}

function buildBookCard(book) {
  return `<div class="card col-4" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text">${book.synopsis}</p>
            </div>
          </div>`;
}

function buildAuthorCard(author) {
  getAuthorBooks(author.id);
  return `
          <div class="col-4">
            <div class="card-category" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(images/card.jpg)">
              <a id="author-link" data-bs-toggle="modal" data-bs-target="#booksModal${author.id}">
                ${author.name}
              </a>
            </div>
          </div>
          <div class="modal fade" id="booksModal${author.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${author.name}</h5>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body container-fluid text-center">
                    <div class="row text-center" id="books-grid-${author.id}">
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          `;
}
