import React, { useEffect, useState } from "react";
import axios from "axios";

function BookList() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", category: "", publishedYear: "", availableCopies: "" });
  const [editBookId, setEditBookId] = useState(null);
  const [editBookData, setEditBookData] = useState({});

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/books");
      setBooks(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchBooks(); }, []);

  // Add new book
  const addBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.category || !newBook.publishedYear || !newBook.availableCopies) {
      alert("Please fill all fields!");
      return;
    }
    try {
      await axios.post("http://localhost:5000/books", newBook);
      setNewBook({ title: "", author: "", category: "", publishedYear: "", availableCopies: "" });
      fetchBooks();
    } catch (err) { console.error(err); }
  };

  // Delete book
  const deleteBook = async (id) => {
    try { await axios.delete(`http://localhost:5000/books/${id}`); fetchBooks(); } 
    catch (err) { console.error(err); }
  };

  // Start edit
  const startEdit = (book) => { setEditBookId(book._id); setEditBookData(book); };

  // Update book
  const updateBook = async () => {
    try { await axios.put(`http://localhost:5000/books/${editBookId}`, editBookData); setEditBookId(null); fetchBooks(); }
    catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Library Books</h2>

      <h3>Add New Book</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px" }}>
        <input placeholder="Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
        <input placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
        <input placeholder="Category" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} />
        <input placeholder="Year" type="number" value={newBook.publishedYear} onChange={e => setNewBook({...newBook, publishedYear: e.target.value})} />
        <input placeholder="Copies" type="number" value={newBook.availableCopies} onChange={e => setNewBook({...newBook, availableCopies: e.target.value})} />
        <button onClick={addBook} style={{ cursor: "pointer", width: "100px" }}>Add Book</button>
      </div>

      <h3>All Books</h3>
      <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#eee" }}>
          <tr><th>Title</th><th>Author</th><th>Category</th><th>Year</th><th>Copies</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book._id}>
              <td>{editBookId === book._id ? <input value={editBookData.title} onChange={e => setEditBookData({...editBookData, title: e.target.value})} /> : book.title}</td>
              <td>{editBookId === book._id ? <input value={editBookData.author} onChange={e => setEditBookData({...editBookData, author: e.target.value})} /> : book.author}</td>
              <td>{editBookId === book._id ? <input value={editBookData.category} onChange={e => setEditBookData({...editBookData, category: e.target.value})} /> : book.category}</td>
              <td>{editBookId === book._id ? <input type="number" value={editBookData.publishedYear} onChange={e => setEditBookData({...editBookData, publishedYear: e.target.value})} /> : book.publishedYear}</td>
              <td>{editBookId === book._id ? <input type="number" value={editBookData.availableCopies} onChange={e => setEditBookData({...editBookData, availableCopies: e.target.value})} /> : book.availableCopies}</td>
              <td>
                {editBookId === book._id ? <button onClick={updateBook} style={{ cursor: "pointer" }}>Save</button> :
                  <>
                    <button onClick={() => startEdit(book)} style={{ cursor: "pointer" }}>Edit</button>
                    <button onClick={() => deleteBook(book._id)} style={{ cursor: "pointer", marginLeft: "5px" }}>Delete</button>
                  </>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
