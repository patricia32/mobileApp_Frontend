CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    profilePicPath VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS followers (
    userUsername VARCHAR(255) NOT NULL,
    -- The user who is following
    followedUsername VARCHAR(255) NOT NULL,
    -- The user who is being followed
    PRIMARY KEY (userUsername, followedUsername),
    FOREIGN KEY (userUsername) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (followedUsername) REFERENCES users(username) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS stories (
    storyID INT AUTO_INCREMENT PRIMARY KEY,
    userUsername VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userUsername) REFERENCES users(username) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS storyImages (
    imageID INT AUTO_INCREMENT PRIMARY KEY,
    storyID INT NOT NULL,
    imagePath VARCHAR(255) NOT NULL,
    FOREIGN KEY (storyID) REFERENCES stories(storyID) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS posts (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    userUsername VARCHAR(255) NOT NULL,
    postPhotoPath VARCHAR(255) NOT NULL,
    postDescription TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userUsername) REFERENCES users(username) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userUsername VARCHAR(255) NOT NULL,
    postID INT NOT NULL,
    FOREIGN KEY (userUsername) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userUsername VARCHAR(255) NOT NULL,
    postID INT NOT NULL,
    commentText TEXT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (userUsername) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (postID) REFERENCES posts(postID) ON DELETE CASCADE
);
-- -- Inserting sample users
-- INSERT INTO users (username, profilePicPath, password)
-- VALUES ('Patri', 'https://picsum.photos/201', 'p'),
--     (
--         'Corina Dragotoniu',
--         'https://picsum.photos/202',
--         'p'
--     ),
--     ('Alice', 'https://picsum.photos/203', 'p'),
--     ('Bob', 'https://picsum.photos/204', 'p'),
--     ('Charlie', 'https://picsum.photos/205', 'p');
-- -- Inserting sample followers
-- -- Inserting sample stories
-- INSERT INTO stories (userUsername)
-- VALUES ('Patri'),
--     ('Corina Dragotoniu'),
--     ('Alice'),
--     ('Bob'),
--     ('Charlie');
-- -- Inserting sample story images
-- INSERT INTO storyImages (storyID, imagePath)
-- VALUES (1, 'https://picsum.photos/201'),
--     (1, 'https://picsum.photos/202'),
--     (1, 'https://picsum.photos/203'),
--     (2, 'https://picsum.photos/202'),
--     (3, 'https://picsum.photos/206'),
--     (3, 'https://picsum.photos/207'),
--     (4, 'https://picsum.photos/208'),
--     (4, 'https://picsum.photos/209'),
--     (5, 'https://picsum.photos/210'),
--     (5, 'https://picsum.photos/211');
-- -- Inserting sample posts
-- INSERT INTO posts (userUsername, postPhotoPath, postDescription)
-- VALUES (
--         'Patri',
--         'https://picsum.photos/301',
--         'This is the first post description'
--     ),
--     (
--         'Corina Dragotoniu',
--         'https://picsum.photos/302',
--         'Here is another post content'
--     ),
--     (
--         'Alice',
--         'https://picsum.photos/303',
--         'Alice shares her thoughts with everyone'
--     ),
--     (
--         'Bob',
--         'https://picsum.photos/304',
--         'Bob has a new perspective to share'
--     ),
--     (
--         'Charlie',
--         'https://picsum.photos/305',
--         'Charlie just posted something cool'
--     );
-- -- Inserting sample likes for posts
-- INSERT INTO likes (userUsername, postID)
-- VALUES ('Patri', 2),
--     ('Corina Dragotoniu', 1),
--     ('Alice', 4),
--     ('Bob', 5),
--     ('Charlie', 3);
-- -- Inserting sample comments for posts
-- INSERT INTO comments (userUsername, postID, commentText, date)
-- VALUES ('Patri', 1, 'Great post!', '2024-12-01'),
--     (
--         'Corina Dragotoniu',
--         1,
--         'This is very insightful.',
--         '2024-12-02'
--     ),
--     ('Alice', 2, 'I really like this!', '2024-12-03'),
--     ('Bob', 3, 'Nice one, Alice!', '2024-12-04'),
--     (
--         'Charlie',
--         4,
--         'Bob, this is amazing!',
--         '2024-12-05'
--     );
-- INSERT INTO comments (userUsername, postID, commentText, date)
-- INSERT INTO followers (userUsername, followerUsername)
-- VALUES ('Patri', 'Corina Dragotoniu'),
--     ('Patri', 'Alice'),
--     ('Corina Dragotoniu', 'Alice'),
--     ('Corina Dragotoniu', 'Bob'),
--     ('Alice', 'Bob'),
--     ('Bob', 'Charlie');
--
--
--
-- Query to get the profile picture path and the numbers of the followers and the followed users for a specific user