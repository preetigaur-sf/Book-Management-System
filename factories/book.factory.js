class BookFactory {

  static createBook(data) {

    return {
      title: data.title,
      isbn: data.isbn,
      publication_date: data.publication_date,
      price: data.price,
      AuthorId: data.AuthorId,
      CategoryId: data.CategoryId,
    };

  }

}

module.exports = BookFactory;