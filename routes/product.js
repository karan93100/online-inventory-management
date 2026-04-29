const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Middleware to check login
function isLoggedIn(req, res, next) {
    if (req.session.user) return next();
    res.redirect('/login');
}

// All Products Page
router.get('/', isLoggedIn, (req, res) => {
    db.query('SELECT * FROM products ORDER BY created_at DESC', (err, products) => {
        if (err) throw err;
        res.render('products', { 
            user: req.session.user, 
            products: products 
        });
    });
});

// Add New Product (POST)
router.post('/add', isLoggedIn, (req, res) => {
    const { name, category, price, quantity, description } = req.body;
    
    db.query(
        'INSERT INTO products (name, category, price, quantity, description) VALUES (?, ?, ?, ?, ?)',
        [name, category, price, quantity, description],
        (err) => {
            if (err) {
                console.error(err);
                return res.send('Error adding product');
            }
            res.redirect('/products');
        }
    );
});

module.exports = router;