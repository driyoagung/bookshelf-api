class BookDatabaseError extends Error {
  constructor (message) {
    super(message)
    this.name = 'BookDatabaseError'
  }
}

class BookInsertError extends BookDatabaseError {
  constructor (message) {
    super(message)
    this.name = 'BookInsertError'
  }
}

class BookNotFoundError extends BookDatabaseError {
  constructor (message) {
    super(message)
    this.name = 'BookNotFoundError'
  }
}

class BookUpdateError extends BookDatabaseError {
  constructor (message) {
    super(message)
    this.name = 'BookUpdateError'
  }
}

module.exports = {
  BookDatabaseError,
  BookInsertError,
  BookNotFoundError,
  BookUpdateError
}
