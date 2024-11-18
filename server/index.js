import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // frontend origin
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jejaksinema',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

app.get('/', (req, res) => {
    res.send('Server is running! Use API endpoints like /api/recent-reviews or /api/movies-of-the-month');
});

// API Endpoint: Recent Reviews
app.get('/api/recent-reviews', (req, res) => {
    const query = `
        SELECT r.reviewId, r.filmId, r.ulasan, r.rating, r.like, r.dislike, r.tanggal, u.username, f.poster, f.judul
        FROM Review r
        JOIN User u ON r.userId = u.userId
        JOIN Film f ON r.filmId = f.filmId
        ORDER BY r.tanggal DESC
        LIMIT 10;
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API Endpoint: Movies of the Month
app.get('/api/movies-of-the-month', (req, res) => {
    const query = `
        SELECT filmId, judul, poster, filmreview 
        FROM Film
        ORDER BY filmreview DESC
        LIMIT 3;
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API Endpoint: Top Rated Movies
app.get('/api/top-rated-movies', (req, res) => {
    const query = `
        SELECT filmId, judul, poster, filmrating
        FROM Film
        WHERE filmrating >= 4.5
        ORDER BY filmrating DESC
        LIMIT 6;
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API Endpoint: User Profil
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT username, profilepicture 
        FROM User
        WHERE userId = ?;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    });
});

// API Endpoint: Favorite Movies
app.get('/api/user/:userId/favorites', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT f.filmId, f.judul, f.poster, DATE_FORMAT(fav.tanggal, '%Y-%m-%d') AS loggedDate, r.rating
        FROM Favorite fav
        JOIN Film f ON fav.filmId = f.filmId
        LEFT JOIN Review r ON fav.filmId = r.filmId AND r.userId = fav.userId
        WHERE fav.userId = ?
        ORDER BY fav.tanggal DESC
        LIMIT 4;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API Endpoint: Reviewed Movies
app.get('/api/user/:userId/reviews', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT r.filmId, f.judul, f.poster, r.rating, DATE_FORMAT(r.tanggal, '%Y-%m-%d') AS loggedDate, r.ulasan
        FROM Review r
        JOIN Film f ON r.filmId = f.filmId
        WHERE r.userId = ?
        ORDER BY r.tanggal DESC
        LIMIT 4;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
