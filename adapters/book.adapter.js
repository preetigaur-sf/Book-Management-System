class BookAdapter {
  static adapt(data) {
    return {
      title: data.book_title || data.title,

      price: data.book_price || data.price,

      authorName: data.writer || data.authorName,

      categoryName: data.genre || data.categoryName,

      isbn: data.book_isbn || data.isbn,

      publication_date: data.published_on || data.publication_date,
    };
  }
}

module.exports = BookAdapter;
