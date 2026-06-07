class BookAdapter {
  static adapt(data) {
    return {
      title: data.title,

      price: data.price,

      authorName: data.authorName,

      categoryName: data.categoryName,

      isbn: data.isbn,

      publication_date: data.publication_date,
    };
  }
}

module.exports = BookAdapter;
