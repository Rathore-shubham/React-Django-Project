import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async () => {
    const bookData = {
      title,
      release_year: releaseYear,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      const data = await response.json();
      setBooks([...books, data]);
      setTitle("");  // Clear the input fields after adding the book
      setReleaseYear("");
    } catch (error) {
      console.error(error);
    }
  };

  const updateTitle = async (pk, release_year) => {
    if (!newTitle.trim()) return; // Prevent updating with empty title

    const bookData = {
      title: newTitle,
      release_year,
    };
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const data = await response.json();
      setBooks((prev) => prev.map((book) => (book.id === pk ? data : book)));
      setNewTitle(""); // Clear the input after updating
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (pk) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      // Assuming no content response after successful delete
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Book website</h1>
      <div className="Div">
        <input
          type="text"
          placeholder="Book title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Release year..."
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button onClick={addBook}>Add book</button>
      </div>

      {books.map((book) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <h2>{book.release_year}</h2>
          <input
            type="text"
            placeholder="New Book title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            onClick={() => updateTitle(book.id, book.release_year)}
            disabled={!newTitle.trim()}
          >
            Update
          </button>
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}

export default App;
