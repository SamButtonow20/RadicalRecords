const db = require('../database/db');

// Get a user by Google ID
function getUserByGoogleId(googleId) {
    const sql = "SELECT * FROM users WHERE google_id = ?";
    return db.get(sql, googleId);
}

// Get a user by Email
function getUserByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    return db.get(sql, email);
}

// Create a new user in the database
function createUser(userData) {
    try {
        const sql = `
            INSERT INTO users 
            (google_id, display_name, first_name, last_name, email, user_type)
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const info = db.run(sql, userData);
        return info;
    } catch (err) {
        console.error("Error creating new user:", err);
        throw new Error("Error creating new user in the database.");
    }
}

module.exports = {
    getUserByGoogleId,
    getUserByEmail,
    createUser
};
