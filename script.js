$(document).ready(function () {
  getAuthors();
  submitForm();
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

function submitForm() {
  $('#author-form').on('submit', function (event) {
    let formData = new FormData(this);
    let formDataObject = {};
    formData.forEach(function (value, key) {
      formDataObject[key] = value;
    });
    createAuthor(formDataObject);
  });
}

// CREATE AUTHOR

function createAuthor(author_data) {
  $.post({
    url: 'http://localhost:3000/authors',
    contentType: 'application/json',
    data: JSON.stringify(author_data),
  });
}

// GET AUTHOR'S BOOKS

function getAuthorBooks(author_id) {
  $.get(`http://localhost:3000/authors/${author_id}/books`, function (data) {
    let grid = $('#books-grid');
    data.forEach((book) => {
      let card = buildBookCard(book);
      grid.append(card);
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
            <div class="card-category" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://raw.githubusercontent.com/lewagon/fullstack-images/master/uikit/breakfast.jpg)">
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
                    <div class="row text-center" id="books-grid">
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
