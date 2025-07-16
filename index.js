const myLibrary = [];

function Book(title, author, pages, read, id = crypto.randomUUID()) {
    // the constructor...
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = id;
}

function addBookToLibrary(title, author, pages, read) {
    // function to add a book to the library
    // take params, create a book then store it in the array
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
}

function displayBooks() {
    // function to display books in the library
    const libraryContainer = document.querySelector('.library');
    libraryContainer.innerHTML = ''; // Clear previous content

    myLibrary.forEach((book) => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <p>Read: ${book.read ? 'Yes' : 'No'}</p>
            <button class="remove" data-id="${book.id}">Remove</button>
        `;
        libraryContainer.appendChild(bookElement);
    });

    // Add event listeners to remove buttons
    libraryContainer.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', function () {
            const idToRemove = this.getAttribute('data-id');
            const index = myLibrary.findIndex(book => book.id === idToRemove);
            if (index !== -1) {
                myLibrary.splice(index, 1);
                displayBooks();
            }
        });
    });

    // Add event listeners to toggle read status
    libraryContainer.querySelectorAll('.book').forEach(bookElement => {
        const bookId = bookElement.querySelector('.remove').getAttribute('data-id');
        
        // Add a "Toggle Read" button
        const toggleReadBtn = document.createElement('button');
        toggleReadBtn.textContent = 'Toggle Read';
        toggleReadBtn.classList.add('toggle-read');
        toggleReadBtn.setAttribute('data-id', bookId);
        bookElement.appendChild(toggleReadBtn);

        // Add event listener to the "Toggle Read" button
        toggleReadBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering other click events
            const idToToggle = toggleReadBtn.getAttribute('data-id');
            toggleReadStatus(idToToggle);
        });

        // Add hover class for highlighting
        bookElement.classList.add('hoverable');
    });
}

function toggleReadStatus(bookId) {
    // function to toggle the read status of a book
    const book = myLibrary.find(b => b.id === bookId);
    if (book) {
        book.read = !book.read;
        displayBooks();
    }
}


// Create and insert the New Book button and modal form
document.addEventListener('DOMContentLoaded', () => {
    // New Book button
    const newBookBtn = document.createElement('button');
    newBookBtn.textContent = 'New Book';
    newBookBtn.id = 'new-book-btn';
    document.body.prepend(newBookBtn);

    // Modal dialog
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <form id="book-form" method="dialog">
            <h2>Add New Book</h2>
            <label>Title: <input type="text" name="title" required></label><br>
            <label>Author: <input type="text" name="author" required></label><br>
            <label>Pages: <input type="number" name="pages" min="1" required></label><br>
            <label>Read: <input type="checkbox" name="read"></label><br>
            <button type="submit">Add Book</button>
            <button type="button" id="close-dialog">Cancel</button>
        </form>
    `;
    document.body.appendChild(dialog);

    // Show dialog on button click
    newBookBtn.addEventListener('click', () => dialog.showModal());

    // Close dialog
    dialog.querySelector('#close-dialog').addEventListener('click', () => {
        dialog.querySelector('#book-form').reset(); // Clear the form
        dialog.close();
    });

    // Handle form submission
    dialog.querySelector('#book-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(this);
        const title = formData.get('title');
        const author = formData.get('author');
        const pages = Number(formData.get('pages'));
        const read = formData.get('read') === 'on';
        addBookToLibrary(title, author, pages, read);
        displayBooks();
        dialog.close();
        this.reset();
    });
});

// Optional: Call displayBooks() on page load
document.addEventListener('DOMContentLoaded', displayBooks);