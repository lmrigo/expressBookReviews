const express = require('express');
let getBooks = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Synchronous version
  // return res.status(200).send(JSON.stringify(books, null, 4));
  getBooks()
    .then((books) => {
      return res.status(200).send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
      return res.status(300).json({message: "Error fetching books"});
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params?.isbn;
  // let book = books[isbn];
  let books = await getBooks();
  let book = books[isbn];
  console.log(book)
  return res.status(200).send(book);
 });

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params?.author;
  let books = await getBooks();
  let authorBooks = Object.values(books).filter(b => b.author === author);
  return res.status(200).send(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params?.title;
  let books = await getBooks();
  let titleBooks = Object.values(books).filter(b => b.title === title);
  return res.status(200).send(titleBooks[0]);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params?.isbn;
  let book = books[isbn];
  return res.status(200).send(book?.reviews);
});

module.exports.general = public_users;
