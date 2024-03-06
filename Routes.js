const express = require("express");
const router = express.Router();
const db = require("./database");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./Middleware");

router.use(express.json());

const bookRoutes = "/books";
const reviewRoutes = "/reviews";
const userRoutes = "/users";

//book routes
router.get("/", (req, res) => {
  res.send("Welcome to the Bookstore API");
});

router.get(bookRoutes, authenticateToken, (req, res) => {
  const sql = "SELECT * FROM books";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving books from the database");
    } else {
      res.json(results);
    }
  });
});

router.get(`${bookRoutes}/:isbn`, authenticateToken, (req, res) => {
  const { isbn } = req.params;
  const sql = "SELECT * FROM books WHERE isbn = ?";
  db.query(sql, [isbn], (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving book details from the database");
    } else {
      if (results.length === 0) {
        res.status(404).send("Book not found");
      } else {
        res.json(results[0]);
      }
    }
  });
});

router.get(
  `${bookRoutes}/get-book-by-author/:author`,
  authenticateToken,
  (req, res) => {
    const { author } = req.params;
    const sql = "SELECT * FROM books WHERE author = ?";
    db.query(sql, [author], (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving book details from the database");
      } else {
        if (results.length === 0) {
          res.status(404).send("Book not found");
        } else {
          res.json(results[0]);
        }
      }
    });
  }
);

router.get(
  `${bookRoutes}/get-book-by-title/:title`,
  authenticateToken,
  (req, res) => {
    const { title } = req.params;
    const sql = "SELECT * FROM books WHERE title = ?";
    db.query(sql, [title], (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving book details from the database");
      } else {
        if (results.length === 0) {
          res.status(404).send("Book not found");
        } else {
          res.json(results[0]);
        }
      }
    });
  }
);

router.get(
  `${bookRoutes}/get-book-by-id/:id`,
  authenticateToken,
  (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM books WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        res.status(500).send("Error retrieving book details from the database");
      } else {
        if (results.length === 0) {
          res.status(404).send("Book not found");
        } else {
          res.json(results[0]);
        }
      }
    });
  }
);

router.post(bookRoutes, authenticateToken, (req, res) => {
  const { isbn, title, author, price, quantity } = req.body;
  const sql =
    "INSERT INTO books (isbn, title, author, price, quantity) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [isbn, title, author, price, quantity], (err, result) => {
    if (err) {
      res.status(500).send("Error adding book to the database");
    } else {
      res.status(201).send("Book added successfully");
    }
  });
});

//reviews routes
router.get(reviewRoutes, authenticateToken, (req, res) => {
  const sql = "SELECT * FROM reviews";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error retrieving review details from the database");
    } else {
      res.json(results);
    }
  });
});

router.get(
  `${reviewRoutes}/get-rating-by-bookid/:bookid`,
  authenticateToken,
  (req, res) => {
    const { bookid } = req.params;
    const sql = "SELECT rating from reviews WHERE book_id = ?";
    db.query(sql, [bookid], (err, results) => {
      if (err) {
        res
          .status(500)
          .send(
            "Error retrieving review of the particular book from the database"
          );
      } else {
        if (results.length === 0) {
          res.status(404).send("Book not found");
        } else {
          res.json(results[0]);
        }
      }
    });
  }
);

router.post(
  `${reviewRoutes}/post-update-by-bookid/:bookid`,
  authenticateToken,
  (req, res) => {
    const { bookid } = req.params;
    const { rating } = req.body;

    const sql = "UPDATE reviews SET rating=? WHERE book_id=?";
    db.query(sql, [rating, bookid], (err, results) => {
      if (err) {
        console.error("Error updating values in the database:", err);
        res.status(500).send("Error updating values in the database");
      } else {
        if (results.affectedRows === 0) {
          res.status(404).send("Book not found");
        } else {
          const sql2 = "SELECT * FROM reviews WHERE book_id = ?";
          db.query(sql2, [bookid], (err, reviews) => {
            if (err) {
              console.error("Error fetching reviews from the database:", err);
              res.status(500).send("Error fetching reviews from the database");
            } else {
              res.json(reviews);
            }
          });
        }
      }
    });
  }
);

router.delete(
  `${reviewRoutes}/delete-rating-by-bookid/:bookid`,
  authenticateToken,
  (req, res) => {
    const { bookid } = req.params;

    const sql = "UPDATE reviews SET rating=NULL WHERE book_id=?";
    db.query(sql, [bookid], (err, results) => {
      if (err) {
        console.error("Error deleting rating in the database:", err);
        res.status(500).send("Error deleting rating in the database");
      } else {
        if (results.affectedRows === 0) {
          res.status(404).send("Book not found");
        } else {
          const sql2 = "SELECT * FROM reviews WHERE book_id = ?";
          db.query(sql2, [bookid], (err, reviews) => {
            if (err) {
              console.error("Error fetching reviews from the database:", err);
              res.status(500).send("Error fetching reviews from the database");
            } else {
              res.json(reviews);
            }
          });
        }
      }
    });
  }
);

router.post(reviewRoutes, authenticateToken, (req, res) => {
  const { book_id, user_id, rating } = req.body;
  const sql = "INSERT INTO reviews (book_id,user_id,rating) values (?,?,?)";
  db.query(sql, [book_id, user_id, rating], (err, results) => {
    if (err) {
      res.status(500).send("Error updating values in the database");
    } else {
      res.status(201).send("Reviews added successfully");
    }
  });
});

//users routes
router.get(userRoutes, (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error extracting values from database");
    } else {
      res.json(results);
    }
  });
});

router.post(`${userRoutes}/register`, (req, res) => {
  const { username, email, pass } = req.body;
  const sql = "INSERT INTO users (username, email, pass) values (?,?,?)";
  db.query(sql, [username, email, pass], (err, results) => {
    if (err) {
      res.status(500).send("Error updating values in the database");
    } else {
      const accessToken = jwt.sign(
        { username: username, email: email },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.status(201).json({
        accessToken: accessToken,
        message: "User registered successfully",
      });
    }
  });
});

router.post(`${userRoutes}/login`, (req, res) => {
  const { username, pass } = req.body;
  const sql = "SELECT * FROM users where username = ? and pass = ?";
  db.query(sql, [username, pass], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (results.length > 0) {
        const accessToken = jwt.sign(
          { username: username },
          process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ accessToken: accessToken });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  });
});

module.exports = router;
