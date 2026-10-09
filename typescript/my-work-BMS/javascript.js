
        const bookForm = document.getElementById("BookForm");
        const bookList = document.getElementById("BookList");
        const emptyMessage = document.getElementById("empty-message");
        const notification = document.getElementById("notification");
        const submitBtn = document.getElementById("submit-btn");
        const cancelBtn = document.getElementById("cancel-btn");
        const formTitle = document.getElementById("form-title");
        const loadingIndicator = document.getElementById("loading-indicator");
        const searchInput = document.getElementById("search-input");
        const searchLoader = document.getElementById("search-loader");
        
        
        const totalCountEl = document.getElementById("total-count");
        const genreStatsEl = document.getElementById("genre-stats");


        const errors = {
            title: document.getElementById('error-title'),
            author: document.getElementById('error-author'),
            isbn: document.getElementById('error-isbn'),
            date: document.getElementById('error-date')
        };

       
        let books = [];        
        let filteredBooks = []; 
        let editingIndex = -1; 
        let searchTimeout = null;

       
        const showNotification = (message, type = 'success') => {
            notification.textContent = message;
            const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
            notification.className = `fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white font-semibold transition-all duration-300 z-50 opacity-0 -translate-y-full pointer-events-none ${colors[type] || colors.info}`;
            
            requestAnimationFrame(() => {
                 notification.classList.remove('opacity-0', '-translate-y-full', 'pointer-events-none');
                 notification.classList.add('opacity-100', 'translate-y-0');
            });

            setTimeout(() => {
                notification.classList.remove('opacity-100', 'translate-y-0');
                notification.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
            }, 4000);
        };

        const toggleLoading = (isLoading, text = "Processing...") => {
            if (isLoading) {
                loadingIndicator.innerHTML = `<div class="loader mr-2"></div> ${text}`;
                loadingIndicator.classList.remove('hidden');
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                loadingIndicator.classList.add('hidden');
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        };

        const clearErrors = () => {
            document.querySelectorAll('input, select').forEach(el => el.classList.remove('input-error'));
            Object.values(errors).forEach(el => el.classList.add('hidden'));
        };

      


        const validateInputs = (data) => {
            let isValid = true;
            clearErrors();

            if (!data.title.trim()) {
                document.getElementById('title').classList.add('input-error');
                errors.title.classList.remove('hidden');
                isValid = false;
            }

            
            if (!data.author.trim()) {
                document.getElementById('author').classList.add('input-error');
                errors.author.classList.remove('hidden');
                isValid = false;
            }
           
  
            const cleanIsbn = data.isbn.replace(/-/g, '');
            const isbnRegex = /^[0-9-]+X?$/i; 
            if (!isbnRegex.test(data.isbn) || (cleanIsbn.length !== 10 && cleanIsbn.length !== 13)) {
                document.getElementById('isbn').classList.add('input-error');
                errors.isbn.textContent = "ISBN must be 10 or 13 digits";
                errors.isbn.classList.remove('hidden');
                isValid = false;
            }

            const selectedDate = new Date(data.publication_date);
            const today = new Date();
            if (selectedDate > today) {
                document.getElementById('publication_date').classList.add('input-error');
                errors.date.classList.remove('hidden');
                isValid = false;
            }

            return isValid;
        };

        const calculateAge = (dateString) => {
            if (!dateString) return "-";
            const today = new Date();
            const pubDate = new Date(dateString);
            let age = today.getFullYear() - pubDate.getFullYear();
            const m = today.getMonth() - pubDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < pubDate.getDate())) age--;
            return age >= 0 ? (age === 0 ? "New Release" : `${age} years`) : "N/A";
        };

        const getGenreClass = (genre) => {
            const map = {
                'fiction': "badge-red", 'non-fiction': "badge-green",
                'science-fiction': "badge-blue", 'mystery': "badge-rose",
                'biography': "badge-purple", 'history': "badge-amber",
                'technology': "badge-blue",
            };
            return map[genre?.toLowerCase()] || 'badge-gray';
        };

        const formatDate = (dateString) => {
            if (!dateString) return "N/A";
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(dateString).toLocaleDateString("en-US", options);
        };

      

        const simulateServerDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchExternalData = async () => {
            try {
                showNotification("Connecting to Open Library API...", "info");
                toggleLoading(true, "Fetching Data...");
                

                const response = await fetch('https://openlibrary.org/subjects/programming.json?limit=6');
                
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                
                if (!data.works || data.works.length === 0) throw new Error("No data received from API");


                const apiBooks = data.works.map(work => ({
                    title: work.title,
                    author: work.authors[0]?.name || "Unknown Author",
                

                    isbn: `978-${Math.floor(Math.random() * 1000000000)}`, 
                  

                    publication_date: new Date(Date.now() - Math.floor(Math.random() * 315360000000)).toISOString().split('T')[0], 
                    genre: "Technology"
                }));

                books = [...apiBooks];
                filteredBooks = [...books];
                renderBooks();
                showNotification("Real book data loaded successfully!", "success");

            } catch (error) {
                console.error("API Fetch Error:", error);
                showNotification(`Failed to load external data: ${error.message}`, "error");
            } finally {
                toggleLoading(false);
            }
        };

       

        const handleSearch = async (query) => {
          

            if (!query.trim()) {
                fetchExternalData();
                return;
            }
          
            searchLoader.classList.remove('hidden'); 

            
            try {
              

                showNotification(`Searching for "${query}"...`, "info");
                
              
                const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
                
                if (!response.ok) throw new Error("Search API Failed");

                const data = await response.json();

           

                const searchResults = data.docs.map(doc => ({
                    title: doc.title,
                    author: doc.author_name ? doc.author_name[0] : "Unknown Author",
                    
                 

                    isbn: doc.isbn ? doc.isbn[0] : `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
                    publication_date: doc.first_publish_year ? `${doc.first_publish_year}-01-01` : new Date().toISOString().split('T')[0],
                    genre: doc.subject ? doc.subject[0] : "General"
                }));
              

                books = [...searchResults];
                filteredBooks = [...books];
                
                renderBooks();
                showNotification(`Found ${searchResults.length} books.`, "success");

            } catch (error) {
                console.error(error);
                showNotification("Search failed. Try again.", "error");
            } finally {
                searchLoader.classList.add('hidden');
            }
        };

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e.target.value);
            }, 600); 
        });

       

        bookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const bookData = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                isbn: document.getElementById('isbn').value,
                publication_date: document.getElementById('publication_date').value,
                genre: document.getElementById('genre').value
            };

          

            if (!validateInputs(bookData)) {
                showNotification("Please fix errors in the form", "error");
                return;
            }

            try {
               
                const action = editingIndex >= 0 ? "Updating" : "Saving";
                toggleLoading(true, `${action} to server...`);
                
            

                await simulateServerDelay(1500); 

             
                if (editingIndex >= 0) {
                    books[editingIndex] = bookData;
                    showNotification("Book updated successfully!", "success");
                    cancelEdit();
                } else {
                    books.unshift(bookData);
                    showNotification("Book added to library!", "success");
                    bookForm.reset();
                    clearErrors();
                }
            

                if (!searchInput.value) {
                    filteredBooks = [...books];
                    renderBooks();
                }

            } catch (error) {
                showNotification("Server Error: Could not save data", "error");
            } finally {
                toggleLoading(false);
            }
        });

        window.deleteBook = async (index) => {
            if (!confirm('Are you sure you want to remove this book?')) return;

         

            const row = bookList.children[index];
            if(row) row.classList.add('opacity-50', 'bg-red-50');

            try {
                showNotification("Deleting from server...", "info");
                await simulateServerDelay(1200);

              

                if (editingIndex === index) cancelEdit();
                else if (index < editingIndex) editingIndex--;

               
                const bookToDelete = filteredBooks[index];
                books = books.filter(b => b !== bookToDelete);


                filteredBooks = filteredBooks.filter((_, i) => i !== index);
                
                renderBooks();
                showNotification("Book deleted permanently", "success");

            } catch (error) {
                showNotification("Delete failed: Network error", "error");
                if(row) row.classList.remove('opacity-50', 'bg-red-50');
            }
        };

        window.editBook = (index) => {
            const book = filteredBooks[index];
            const masterIndex = books.indexOf(book);
            
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('isbn').value = book.isbn;
            document.getElementById('publication_date').value = book.publication_date;
            document.getElementById('genre').value = book.genre;

            editingIndex = masterIndex;
            clearErrors();
            
            formTitle.textContent = "Edit Book Details";
            submitBtn.textContent = "Update Book";
            submitBtn.className = "flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200";
            cancelBtn.classList.remove('hidden');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.cancelEdit = () => {
            bookForm.reset();
            clearErrors();
            editingIndex = -1;
            formTitle.textContent = "Add New Book";
            submitBtn.textContent = "Add Book";
            submitBtn.className = "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200";
            cancelBtn.classList.add('hidden');
        };

       

        const renderStats = () => {
            totalCountEl.textContent = books.length;
            if (books.length === 0) {
                genreStatsEl.innerHTML = '<span class="text-sm text-gray-400 italic">No data</span>';
                return;
            }
            const stats = books.reduce((acc, book) => {
                acc[book.genre] = (acc[book.genre] || 0) + 1;
                return acc;
            }, {});
            genreStatsEl.innerHTML = Object.entries(stats).map(([genre, count]) => {
                const badgeColor = getGenreClass(genre);
                return `<div class="flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200"><span class="w-2 h-2 rounded-full ${badgeColor.replace('text-', 'bg-').split(' ')[0]}"></span><span class="text-sm font-medium text-gray-700">${genre}: <strong>${count}</strong></span></div>`;
            }).join('');
        };

        const renderBooks = () => {
            renderStats();
            bookList.innerHTML = "";
            
            if (filteredBooks.length === 0) {
                emptyMessage.classList.remove("hidden");
                return;
            }
            emptyMessage.classList.add("hidden");

            filteredBooks.forEach((book, index) => {
                const { title, author, isbn, publication_date, genre } = book;
                const row = document.createElement('tr');
                row.className = "hover:bg-gray-50 border-b last:border-0 transition-all duration-300";
                
                row.innerHTML = `
                    <td class="p-4 font-medium text-gray-900">${title}</td>
                    <td class="p-4 text-gray-600">${author}</td>
                    <td class="p-4 font-mono text-xs text-gray-500">${isbn}</td>
                    <td class="p-4 text-gray-600">${formatDate(publication_date)}</td>
                    <td class="p-4 text-gray-600 font-medium whitespace-nowrap">${calculateAge(publication_date)}</td>
                    <td class="p-4"><span class="px-2 py-1 rounded-full text-xs font-semibold ${getGenreClass(genre)}">${genre}</span></td>
                    <td class="p-4 text-center">
                        <div class="flex justify-center items-center gap-2">
                            <button onclick="editBook(${index})" class="text-blue-500 hover:text-blue-700 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg></button>
                            <button onclick="deleteBook(${index})" class="text-red-500 hover:text-red-700 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>
                        </div>
                    </td>
                `;
                bookList.appendChild(row);
            });
        };

       
        fetchExternalData();
