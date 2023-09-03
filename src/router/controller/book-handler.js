const BooksDB = require('../../database/books-db')
const { BookInsertError, BookUpdateError, BookNotFoundError } = require('../../error/book-error')

const addBookHandler = (request, h) => {
  try {
    const book = BooksDB.addBook(request.payload)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: book.id
      }
    })

    response.code(201)
    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })
    response.code(500)

    if (error instanceof BookInsertError) {
      response.code(400)
    }

    return response
  }
}

const getAllBooksHandler = (request, h) => ({
  status: 'success',
  data: {
    books: BooksDB.getAllBooksWithFilter(request.query).map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  }
})

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  try {
    const book = BooksDB.getBookById(bookId)
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })

    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })

    response.code(404)
    return response
  }
}

const updateBookHandler = (request, h) => {
  try {
    const { bookId } = request.params
    BooksDB.updateBook(bookId, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })

    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })

    response.code(500)
    if (error instanceof BookNotFoundError) {
      response.code(404)
    } else if (error instanceof BookUpdateError) {
      response.code(400)
    }

    return response
  }
}

const deleteBookHandler = (request, h) => {
  try {
    const { bookId } = request.params
    BooksDB.deleteBook(bookId)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })

    return response
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    })

    response.code(500)
    if (error instanceof BookNotFoundError) {
      response.code(404)
    }

    return response
  }
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler
}
