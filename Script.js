const bookForm = document.getElementById('bookForm');
    const bookTableBody = document.querySelector('#bookTable tbody');
    const searchInput = document.getElementById('searchInput');
    let books = [];

    // Helper: Calculate Book Age
    const calculateBookAge = (year) => new Date().getFullYear() - year;

    // Helper: Validate Form Inputs
    const isValidForm = ({ title, author, year, isbn, genre }) => {
      if (!title || !author || !year || !isbn || !genre) {
        alert('All fields must be filled!');
        return false;
      }
      if (isNaN(isbn)) {
        alert('ISBN must be a number!');
        return false;
      }
      return true;
    };

    // Add a New Book
    const addBook = (book) => {
      books.push(book);
      renderBooks();
    };

    // Edit a Book
    const editBook = (index) => {
      const book = books[index];
      document.getElementById('title').value = book.title;
      document.getElementById('author').value = book.author;
      document.getElementById('year').value = book.year;
      document.getElementById('isbn').value = book.isbn;
      document.getElementById('genre').value = book.genre;
      books.splice(index, 1);
      renderBooks();
    };

    // Delete a Book
    const deleteBook = (index) => {
      books.splice(index, 1);
      renderBooks();
    };

    // Render Books in the Table
    const renderBooks = () => {
      bookTableBody.innerHTML = '';  // Clear previous rows
      books.forEach(({ title, author, year, isbn, genre }, index) => {
        const age = calculateBookAge(year);
        const row = `
          <tr>
            <td>${title}</td>
            <td>${author}</td>
            <td>${year}</td>
            <td>${isbn}</td>
            <td>${genre}</td>
            <td>${age} years</td>
            <td>
              <button onclick="editBook(${index})">Edit</button>
              <button onclick="deleteBook(${index})">Delete</button>
            </td>
          </tr>
        `;
        bookTableBody.insertAdjacentHTML('beforeend', row);
      });
    };

    // Simulate Data Fetching with Promises
    const fetchBooksFromServer = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulating success or failure randomly
          Math.random() > 0.2
            ? resolve([
                { title: 'Book A', author: 'Author A', year: 2010, isbn: '12345', genre: 'Fiction' },
                { title: 'Book B', author: 'Author B', year: 2015, isbn: '67890', genre: 'Science' }
              ])
            : reject('Failed to fetch books from server.');
        }, 1000);
      });
    };

    // Fetch Data from External API
    const fetchBooksFromAPI = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        if (!response.ok) throw new Error('Failed to fetch books from API.');
        const data = await response.json();
        const apiBooks = data.map((item) => ({
          title: item.title,
          author: 'Unknown',
          year: 2021,
          isbn: item.id.toString(),
          genre: 'Fiction'
        }));
        books = [...books, ...apiBooks];
        renderBooks();
      } catch (error) {
        alert(error.message);
      }
    };

    // Search Books Asynchronously
    const searchBooks = async () => {
      const query = searchInput.value.toLowerCase();
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
      );
      bookTableBody.innerHTML = '';  // Clear previous rows
      filteredBooks.forEach(({ title, author, year, isbn, genre }, index) => {
        const age = calculateBookAge(year);
        const row = `
          <tr>
            <td>${title}</td>
            <td>${author}</td>
            <td>${year}</td>
            <td>${isbn}</td>
            <td>${genre}</td>
            <td>${age} years</td>
            <td>
              <button onclick="editBook(${index})">Edit</button>
              <button onclick="deleteBook(${index})">Delete</button>
            </td>
          </tr>
        `;
        bookTableBody.insertAdjacentHTML('beforeend', row);
      });
    };

    // Form Submission Handler
    bookForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: parseInt(document.getElementById('year').value),
        isbn: document.getElementById('isbn').value,
        genre: document.getElementById('genre').value,
      };
      if (isValidForm(book)) {
        addBook(book);
        bookForm.reset();
      }
    });

    // Fetch Books on Page Load
    fetchBooksFromServer()
      .then((serverBooks) => {
        books = serverBooks;
        renderBooks();
      })
      .catch((error) => alert(error));

    fetchBooksFromAPI();