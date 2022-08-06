const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => { 
    const { 
      name, 
      year, 
      author, 
      summary, 
      publisher, 
      pageCount, 
      readPage, 
      reading 
    } = request.payload;
    
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = false;

    if (pageCount == readPage) {
      finished = true;
    }

    const newBooks = {
        id, 
        name, 
        year, 
        author, 
        summary,
        publisher,
        pageCount, 
        readPage,
        finished,
        reading, 
        insertedAt, 
        updatedAt,
    };

    // const isSuccess = books.filter((book) => book.id === id).length > 0;
    // const isNameEmpty = books.filter((book) => book.name === undefined) > 0;
    // const readPageOverload = books.filter((book) => book.readPage > book.pageCount) > 0; 

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      
      })
      response.code(400);
      return response;
    }

    if (name !== undefined && readPage <= pageCount) {
      books.push(newBooks);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    
    response.code(500);
    return response;
};

const getAllBookHandler = (request, h) => {
  const { id, name, publisher } = request.params ; // kita ambil query dari url, isinya object, abis itu kita taruh value dari object tsb ke variable

  if (books.length !== 0) {
    const response = h.response({
        status: 'success',
        data:
        {
          books: 
            books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
              }))
        },
      });
    response.code(200);
    return response;
  };

  const response = h.response({
    status: 'success',
    data: {books},
  })
  response.code(200);
  return response;

};

const getBookByIdHandler = (request, h) =>  {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];
  

  if (book !== undefined) {
    return {
      status: 'success',
      data : {
        book,
      }
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};


const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const { 
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
   } = request.payload;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  if (books[index].name === "") {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (books[index].readPage > books[index].pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
}

module.exports = { 
  addBookHandler, 
  getAllBookHandler, 
  getBookByIdHandler, 
  editBookByIdHandler,
  deleteBookByIdHandler,
};
