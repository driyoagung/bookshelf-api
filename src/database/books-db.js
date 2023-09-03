const { nanoid } = require('nanoid')
const {
  BookInsertError,
  BookDatabaseError,
  BookNotFoundError,
  BookUpdateError,
} = require('../error/book-error')

class BooksDB {
  constructor() {
    this._books = []
  }

  getAllBooks() {
    return this._books
  }

  getAllBooksWithFilter({ name, reading, finished }) {
    let books = this._books

    if (typeof name !== 'undefined') {
      name = name.toLowerCase()
      books = books.filter((book) => book.name.toLowerCase().includes(name))
    }

    if (typeof reading !== 'undefined') {
      reading = Number(reading)
      books = books.filter((book) => book.reading === Boolean(reading))
    }

    if (typeof finished !== 'undefined') {
      finished = Number(finished)
      books = books.filter((book) => book.finished === Boolean(finished))
    }

    return books
  }

  getBookById(id) {
    const book = this.getAllBooks().find((book) => book.id === id)
    if (!book) {
      throw new BookNotFoundError('Buku tidak ditemukan')
    }
    return book
  }

  addBook({
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }) {
    const id = nanoid(20)
    const insertedAt = new Date().toISOString()
    const updatedAt = new Date().toISOString()
    const finished = Boolean(pageCount === readPage)

    const book = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      insertedAt,
      updatedAt,
    }

    if (!name) {
      throw new BookInsertError('Gagal menambahkan buku. Mohon isi nama buku')
    } else if (readPage > pageCount) {
      throw new BookInsertError(
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      )
    }

    this._books.push(book)
    const isInserted = this._books.filter((book) => book.id === id).length > 0

    if (isInserted) {
      return book
    }

    throw new BookDatabaseError('Buku gagal ditambahkan')
  }

  updateBook(
    id,
    { name, year, author, summary, publisher, pageCount, readPage, reading },
  ) {
    const index = this._books.findIndex((book) => book.id === id)
    const insertedAt = new Date().toISOString()
    const updatedAt = new Date().toISOString()
    const finished = Boolean(pageCount === readPage)

    if (index === -1) {
      throw new BookNotFoundError('Gagal memperbarui buku. Id tidak ditemukan')
    } else if (!name) {
      throw new BookUpdateError('Gagal memperbarui buku. Mohon isi nama buku')
    } else if (readPage > pageCount) {
      throw new BookUpdateError(
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      )
    }

    if (index !== -1) {
      this._books[index] = {
        ...this._books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt,
      }

      return this._books[index]
    }

    throw new BookDatabaseError('Buku gagal diupdate')
  }

  deleteBook(id) {
    const index = this._books.findIndex((book) => book.id === id)

    if (index === -1) {
      throw new BookNotFoundError('Buku gagal dihapus. Id tidak ditemukan')
    }

    if (index !== -1) {
      this._books.splice(index, 1)
      return true
    }

    throw new BookDatabaseError('Buku gagal dihapus')
  }
}

module.exports = new BooksDB()
