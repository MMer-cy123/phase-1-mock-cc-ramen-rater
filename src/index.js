// write your code here
// API base URL
const baseURL = 'http://localhost:3000';

// DOM elements
const ramenMenu = document.getElementById('ramen-menu');
const ramenDetail = document.getElementById('ramen-detail');
const editForm = document.getElementById('edit-ramen');
const newRamenForm = document.getElementById('new-ramen');

// Retrieve all ramen objects from the server
function fetchRamen() {
  fetch(`${baseURL}/ramens`)
    .then(response => response.json())
    .then(data => {
      data.forEach(ramen => displayRamen(ramen));
    });
}

// Display a ramen in the menu
function displayRamen(ramen) {
  const ramenImage = document.createElement('img');
  ramenImage.src = ramen.image;
  ramenImage.alt = ramen.name;
  ramenImage.addEventListener('click', () => displayRamenDetail(ramen));
  ramenMenu.appendChild(ramenImage);
}

// Display the details of a ramen
function displayRamenDetail(ramen) {
  ramenDetail.innerHTML = `
    <img src="${ramen.image}" alt="${ramen.name}" />
    <h2>${ramen.name}</h2>
    <h3>${ramen.restaurant}</h3>
    <h3>Rating: <span id="rating">${ramen.rating}</span> / 10</h3>
    <p id="comment">${ramen.comment}</p>
  `;

  const ratingInput = document.getElementById('new-rating');
  const commentInput = document.getElementById('new-comment');

  // Set initial values for the edit form
  ratingInput.value = ramen.rating;
  commentInput.value = ramen.comment;

  // Update ramen rating and comment on form submission
  editForm.addEventListener('submit', event => {
    event.preventDefault();
    const newRating = ratingInput.value;
    const newComment = commentInput.value;

    updateRamen(ramen.id, newRating, newComment);
  });
}

// Update the rating and comment of a ramen
function updateRamen(id, rating, comment) {
  fetch(`${baseURL}/ramens/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating, comment }),
  })
    .then(response => response.json())
    .then(data => {
      const ratingDisplay = document.getElementById('rating');
      const commentDisplay = document.getElementById('comment');
      ratingDisplay.textContent = data.rating;
      commentDisplay.textContent = data.comment;
    });
}

// Create a new ramen
function createRamen(event) {
  event.preventDefault();
  const nameInput = document.getElementById('new-name');
  const restaurantInput = document.getElementById('new-restaurant');
  const imageInput = document.getElementById('new-image');
  const ratingInput = document.getElementById('new-rating');
  const commentInput = document.getElementById('new-comment');

  const name = nameInput.value;
  const restaurant = restaurantInput.value;
  const image = imageInput.value;
  const rating = ratingInput.value;
  const comment = commentInput.value;

  fetch(`${baseURL}/ramens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, restaurant, image, rating, comment }),
  })
    .then(response => response.json())
    .then(data => {
      displayRamen(data);
      clearFormInputs();
    });
}

// Clear the input fields in the new ramen form
function clearFormInputs() {
  const formInputs = document.querySelectorAll('#new-ramen input, #new-ramen textarea');
  formInputs.forEach(input => (input.value = ''));
}

// Delete a ramen
function deleteRamen(id) {
  fetch(`${baseURL}/ramens/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      const ramenImage = document.querySelector(`#ramen-menu img[alt="${id}"]`);
      ramenImage.remove();
      ramenDetail.innerHTML = '';
    });
}

// Event listener for new ramen form submission
newRamenForm.addEventListener('submit', createRamen);

// Initialize the app
fetchRamen();
