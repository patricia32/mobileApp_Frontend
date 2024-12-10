const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
// app.use(cors());

const corsOptions = {
    origin: '*', // Allow all origins (for development purposes)
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));


// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '88991144',
    database: 'mobile_db',
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Connection to MySQL failed:', err);
        return;
    }
    console.log('Connected to MySQL!');

    // Read and execute queries from schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log('Path to schema.sql:', schemaPath);
    
    fs.readFile(schemaPath, 'utf8', (err, schemaSQL) => {
        if (err) {
            console.error('Error reading schema.sql:', err);
            return;
        }

        // Split SQL commands by semicolon
        const queries = schemaSQL.split(';');

        // Execute each query
        queries.forEach(query => {
            if (query.trim()) { // Execute non-empty queries
                db.query(query.trim(), (err, result) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        return;
                    }
                    console.log('Query executed successfully!');
                });
            }
        });
    });
});


// Endpoint to get user profile information
app.get('/getUserProfile', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });
    
    const query = `
       SELECT * FROM users WHERE username = ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching profile data' });

        if (result.length === 0) 
            return res.status(404).send({ error: 'User not found' });
        
        res.json(result[0]); 
    });
});

// Endpoint to get the id and photoPath of the posts of a user
app.get('/getUserPosts_id_and_photoPath', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
       SELECT *
        FROM posts
        WHERE userUsername = (SELECT username FROM users WHERE username = ?);
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching posts' });

        if (result.length === 0) 
            return res.status(404).send({ error: 'No posts found for this user' });
        
        res.json(result); 
    });
});

// Endpoint to get user following list length
app.get('/getUserFollowingListLength', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
       SELECT COUNT(*) AS followingListLength
        FROM followers
        WHERE userUsername = ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching following list length' });

        res.json(result[0]); 
    });
});

// Endpoint to get user followers list length
app.get('/getUserFollowersListLength', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
       SELECT COUNT(*) AS followersListLength
        FROM followers
        WHERE followedUsername = ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching followers list length' });

        res.json(result[0]); 
    });
});

// Endpoint to get user following list length
app.get('/getUserFollowingListLength', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
       SELECT COUNT(*) AS followingListLength
        FROM followers
        WHERE userUsername = ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching following list length' });

        res.json(result[0]); 
    });
});

// Endpoint to get user followers list
app.get('/getUserFollowersList', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
        SELECT u.username, u.profilePicPath
        FROM users u
        INNER JOIN followers f ON u.username = f.userUsername
        WHERE f.followedUsername = ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching followers list' });

        res.json(result); 
    });
});

// Endpoint to get user following list
app.get('/getUserFollowingList', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
       SELECT u.username, u.profilePicPath
        FROM users u
        INNER JOIN followers f ON u.username = f.followedUsername
        WHERE f.userUsername = ?;
    `;
    
    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching following list' });

        res.json(result); 
    });
});

// Endpoint to get post data
app.get('/post/getPostData', (req, res) => {
    const postID = req.query.postID; 
    const username = req.query.username;
    
    if (!postID || !username) 
        return res.status(400).send({ error: 'Post ID and Username are required' });

    const query = `
       SELECT posts.*, users.profilePicPath
       FROM posts
       JOIN users ON posts.userUsername = users.username
       WHERE postID = ? AND users.username = ?;
    `;

    db.query(query, [postID, username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching post data' });

        if (result.length === 0) 
            return res.status(404).send({ error: 'Post not found' });
        
        res.json(result); 
    });
});

// Endpoint to get post likes number 
app.get('/post/getLikesNumber', (req, res) => {
    const postID = req.query.postID; 
    if (!postID) 
        return res.status(400).send({ error: 'Post ID is required' });

    const query = `
        SELECT COUNT(*) AS likesNumber
        FROM likes
        WHERE postID = ?;
    `;

    db.query(query, [postID], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching likes number' });

        res.json(result[0]); 
    });
});

// Endpoint to get post likes
app.get('/post/getLikes', (req, res) => {
    const postID = req.query.postID; 
    if (!postID) 
        return res.status(400).send({ error: 'Post ID is required' });

    const query = `
        SELECT users.username, users.profilePicPath
        FROM likes
        JOIN users ON likes.userUsername = users.username
        WHERE postID = ?;
    `;

    db.query(query, [postID], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching likes' });

        res.json(result); 
    });
});

// Endpoint to get post comments number
app.get('/post/getCommentsNumber', (req, res) => {
    const postID = req.query.postID; 
    if (!postID) 
        return res.status(400).send({ error: 'Post ID is required' });

    const query = `
       SELECT COUNT(*) AS commentsNumber
       FROM comments
       WHERE postID = ?;
    `;

    db.query(query, [postID], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching comments number' });

        res.json(result[0]); 
    });
});

// Endpoint to get post comments
app.get('/post/getComments', (req, res) => {
    const postID = req.query.postID; 
    if (!postID) 
        return res.status(400).send({ error: 'Post ID is required' });

    const query = `
       SELECT comments.*, users.profilePicPath
       FROM comments
       JOIN users ON comments.userUsername = users.username
       WHERE postID = ?;
    `;

    db.query(query, [postID], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching comments' });

        res.json(result); 
    });
});




// Test endpoint
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});