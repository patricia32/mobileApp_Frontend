const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { use } = require('react');

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
       SELECT users.username, users.profilePicPath, stories.storyID
       FROM users
       JOIN stories ON stories.userUsername = users.username
       WHERE username = ?;
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

// Endpoint to get user profile picture path
app.get('/user/getUserProfilePicPath', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
       SELECT profilePicPath
       FROM users
       WHERE username = ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching profile picture path' });

        if (result.length === 0) 
            return res.status(404).send({ error: 'User not found' });
        
        res.json(result[0]); 
    });
});

// Endpoint to add a new comment to a post
app.post('/post/addComment', (req, res) => {  
    const { postID, userUsername, commentText } = req.body;
    if (!postID || !userUsername || !commentText) 
        return res.status(400).send({ error: 'Post ID, User Username and Comment Text are required' });

    const query = `
       INSERT INTO comments (postID, userUsername, commentText)
       VALUES (?, ?, ?);
    `;

    db.query(query, [postID, userUsername, commentText], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err); 
            return res.status(500).send({ error: 'Error adding comment' });
        }

        res.send('Comment added successfully');
    });
});

// Endpoint to check if a user liked a post
app.get('/post/checkLike', (req, res) => {
    const postID = req.query.postID; 
    const userUsername = req.query.userUsername;
    
    if (!postID || !userUsername) 
        return res.status(400).send({ error: 'Post ID and User Username are required' });

    const query = `
       SELECT EXISTS (
              SELECT 1 
              FROM likes 
              WHERE postID = ? AND userUsername = ?
         ) AS isLiked;
    `;

    db.query(query, [postID, userUsername], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error checking like' });

        const isLiked = result[0].isLiked === 1; 
        res.json({ isLiked });
    });
});

// Endpoint to like a post
app.post('/post/like', (req, res) => {
    const { postID, userUsername } = req.body;
    if (!postID || !userUsername) 
        return res.status(400).send({ error: 'Post ID and User Username are required' });

    // Check if the user has already liked the post
    const checkQuery = `
       SELECT 1 
       FROM likes 
       WHERE postID = ? AND userUsername = ?
    `;
    db.query(checkQuery, [postID, userUsername], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error checking like status' });

        if (result.length > 0) {
            return res.status(400).send({ error: 'Post already liked by user' });
        }

        // If not already liked, insert the like
        const query = `
           INSERT INTO likes (postID, userUsername)
           VALUES (?, ?);
        `;

        db.query(query, [postID, userUsername], (err, result) => {
            if (err) 
                return res.status(500).send({ error: 'Error liking post' });

            res.send('Post liked successfully');
        });
    });
});



// Endpoint to unlike a post
app.delete('/post/unlike', (req, res) => {
    const { postID, userUsername } = req.body;
    if (!postID || !userUsername) 
        return res.status(400).send({ error: 'Post ID and User Username are required' });

    const query = `
       DELETE FROM likes
       WHERE postID = ? AND userUsername = ?;
    `;

    db.query(query, [postID, userUsername], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error unliking post' });

        res.send('Post unliked successfully');
    });
});


// Endpoint to get all feed posts 
app.get('/post/getFeedPosts', (req, res) => {
    const username = req.query.username; 
    if (!username) 
        return res.status(400).send({ error: 'Username is required' });

    const query = `
       SELECT *, users.profilePicPath
        FROM posts
        JOIN users ON users.username = posts.userUsername
        WHERE userUsername != ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching posts from feed' });
        
        res.json(result); 
    });
});

// Endpoint to check if an user is followed by another one
app.get('/user/checkFollowing', (req, res) => {
    const usernameFollowing = req.query.usernameFollowing; 
    const usernameFollowed = req.query.usernameFollowed; 
    
    // Check if both parameters are provided
    if (!usernameFollowing || !usernameFollowed) 
        return res.status(400).send({ error: 'usernameFollowing and usernameFollowed are required' });
    

    const query = `
        SELECT EXISTS(
            SELECT 1
            FROM followers
            WHERE userUsername = ? AND followedUsername = ?
        ) AS isFollowing;
    `;

    // Execute the query to check if the user is following another user
    db.query(query, [usernameFollowing, usernameFollowed], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Error checking follow status' });
        }

        // Convert the result to a boolean (1 -> true, 0 -> false)
        const isFollowing = result[0].isFollowing === 1;
        
        // Send the boolean value as the response
        res.json(isFollowing);
    });
});


app.put('/user/follow', (req, res) => {
    const {usernameFollowing, usernameFollowed} = req.body;

    if (!usernameFollowing || !usernameFollowed) 
        return res.status(400).send({ error: 'usernameFollowing and usernameFollowed are required' });

    // Check if the user is already following the followed user
    const checkQuery = `
        SELECT 1 
        FROM followers
        WHERE userUsername = ? AND followedUsername = ?
    `;
    
    db.query(checkQuery, [usernameFollowing, usernameFollowed], (err, result) => {
        if (err) return res.status(500).send({ error: 'Error checking follow status' });

        if (result.length > 0) {
            return res.status(400).send({ error: 'Already following this user' });
        }

        const insertQuery = `
            INSERT INTO followers (userUsername, followedUsername)
            VALUES (?, ?)
        `;

        db.query(insertQuery, [usernameFollowing, usernameFollowed], (err, result) => {
            if (err) return res.status(500).send({ error: 'Error following user' });
            
            res.json({ message: 'Successfully followed user', affectedRows: result.affectedRows });
        });
    });
});


app.delete('/user/unFollow', (req, res) => {
    
    const {usernameFollowing, usernameFollowed} = req.body;

    if (!usernameFollowing || !usernameFollowed) 
        return res.status(400).send({ error: 'usernameFollowing and usernameFollowed are required' });

    // Check if the follow relationship exists before trying to delete
    const checkQuery = `
        SELECT 1 
        FROM followers
        WHERE userUsername = ? AND followedUsername = ?
    `;
    
    db.query(checkQuery, [usernameFollowing, usernameFollowed], (err, result) => {
        if (err) return res.status(500).send({ error: 'Error checking follow status' });

        if (result.length === 0) {
            return res.status(400).send({ error: 'You are not following this user' });
        }

        const deleteQuery = `
            DELETE
            FROM followers
            WHERE userUsername = ? AND followedUsername = ?
        `;

        db.query(deleteQuery, [usernameFollowing, usernameFollowed], (err, result) => {
            if (err) return res.status(500).send({ error: 'Error unfollowing user' });
            
            res.json({ message: 'Successfully unfollowed user', affectedRows: result.affectedRows });
        });
    });
});



app.get('/story/getStoriesData_bulletsList', (req, res) => {
    const username = req.query.username;

    console.log("stories for ", username)

    if(!username)
        return res.status(400).send({ error: 'Username is required' });

    const query = `
        SELECT followers.followedUsername, stories.storyID, users.profilePicPath
        FROM followers
        JOIN stories ON stories.userUsername = followers.followedUsername
        JOIN users ON users.username = followers.followedUsername
        WHERE followers.userUsername = ?;
    `;

    db.query(query, [username], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching data for story bullets list.' });
        res.json(result); 
    });
})

app.get('/story/getStoryImages', (req, res) => {
    const storyID = req.query.storyID;

    console.log("story images for storyID = ", storyID)

    if(!storyID)
        return res.status(400).send({ error: 'storyID is required' });

    const query = `
       SELECT imagePath
       FROM storyImages
       WHERE storyID = ?;
    `;

    db.query(query, [storyID], (err, result) => {
        if (err) 
            return res.status(500).send({ error: 'Error fetching story data.' });
        
        console.log(result);
        res.json(result); 


    });
})

// Test endpoint
app.get('/', (req, res) => {
    res.send('API is working!');
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
