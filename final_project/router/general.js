const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const present = users.filter((user) => user.username === username);

    if (present.length === 0) {
      users.push({ "username": req.body.username, "password": req.body.password });
      return res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } else {
    return res.status(400).json({ message: "Username and password are required" });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    const getBooks = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 1000); // Closing parentheses here
    });
    }
    
    getBooks()
        .then((books) => res.json(books))
        .catch((err) => res.status(500).json({ error: "An error occurred" }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn]; // Assuming books is an object where ISBN is the key

    if (book) {
        return res.json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter((book) => book.author === author);

    if (filteredBooks.length > 0) {
        return res.json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
      const title = req.params.title;
    const filteredBooks = Object.values(books).filter((book) => book.title === title);

    if (filteredBooks.length > 0) {
        return res.json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
