-- TABEL MOVIES
CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY, -- ID untuk setiap film
    title VARCHAR(255) NOT NULL,             -- Judul film
    genre JSON,                              -- Genre dalam format JSON ["Action", "Drama"]
    release_year YEAR,                            -- Tahun rilis film
    rating FLOAT,                            -- Rating film
    deskripsi TEXT,                          -- Deskripsi film
    image VARCHAR(255),                      -- URL atau path
    update_status BOOLEAN,                   -- Status pembaruan
    premium BOOLEAN,                         -- Status premium 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP -- Waktu pembuatan
);
INSERT INTO movies (title, genre, release_year, rating, deskripsi, image, update_status, premium)
VALUES 
    ('Dilan', '["romantis","aksi","drama"]', 2018, 4.2, 'Percintaan remaja bandung', '/images/image28.png', FALSE, TRUE),
    ('DilDont Look UP!an', '["komedi","fiksi"]', 2021, 4.7, 'jangan Lihat ke atas, nanti lak-lakan kamu disentil', '/images/lanjutTonton0.png', FALSE, TRUE);
    
-- TABEL TRENDING
CREATE TABLE trending (
    trending_id INT AUTO_INCREMENT PRIMARY KEY, -- ID tiap list trending
    movie_id INT NOT NULL,                      -- ID film (relasi ke tabel movies)
    view_count INT DEFAULT 0,                   -- Jumlah penonton (untuk menentukan trending)
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE -- Relasi ke tabel movies
)
UPDATE trending
SET view_count = view_count + 1
WHERE movie_id = 1;

-- TABLE WATCHED
CREATE TABLE watched (
    watched_id INT AUTO_INCREMENT PRIMARY KEY, -- ID tiap list tontotonan
    user_id INT NOT NULL,                      -- ID pengguna 
    movie_id INT NOT NULL,                     -- ID film 
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Waktu film ditonton
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, -- Relasi ke tabel users
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE -- Relasi ke tabel movies
);
INSERT INTO watched (user_id, movie_id)

