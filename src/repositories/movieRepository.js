import { query } from "express";
import { pool } from "../utils/moviesDatabase.js";

// ========== CRUD ==========
// Get All Movies
export const getMovies = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM movies");
    return rows;
  } catch (err) {
    throw err;
  }
};

// Get Movie By Id
export const getMovieById = async (payload) => {
  const { id } = payload;
  const query = `
    SELECT *
    FROM movies
    WHERE movie_id = ?`;
  try {
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (err) {
    throw err;
  }
};

// Insert Movies
export async function createMovie(payloadData) {
  const { title, genre, release_year, rating, deskripsi, image } = payloadData;

  const genreJSON = JSON.stringify(genre);
  const update_status = 0;
  const query = `
          INSERT INTO movies 
          (title, genre, release_year, rating, deskripsi, image, update_status)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const value = [
    title,
    genreJSON,
    release_year,
    rating,
    deskripsi,
    image,
    update_status,
  ];

  try {
    const [result] = await pool.query(query, value);
    return result;
  } catch (err) {
    throw err;
  }
}

// update Movie
export const updateMovie = async (id, payload) => {
  const updateFields = [];
  const updateValues = [];

  //cari data apa saja yang teradpat pada json
  if (payload.title) {
    updateFields.push("title = ?");
    updateValues.push(payload.title);
  }
  if (payload.genre) {
    updateFields.push("genre = ?");
    updateValues.push(JSON.stringify(payload.genre));
  }
  if (payload.release_year) {
    updateFields.push("release_year = ?");
    updateValues.push(payload.release_year);
  }
  if (payload.rating) {
    updateFields.push("rating = ?");
    updateValues.push(payload.rating);
  }
  if (payload.deskripsi) {
    updateFields.push("deskripsi = ?");
    updateValues.push(payload.deskripsi);
  }
  if (payload.image) {
    updateFields.push("image = ?");
    updateValues.push(payload.image);
  }
  if (payload.update_status) {
    updateFields.push("update_status = ?");
    updateValues.push(payload.update_status);
  }
  if (payload.premium) {
    updateFields.push("premium = ?");
    updateValues.push(payload.premium);
  }
  updateValues.push(id);

  const query = `
        UPDATE movies 
        SET ${updateFields.join(",")}
        WHERE movie_id = ?`;
  try {
    const [result] = await pool.query(query, updateValues);
    if (result.affectedRows > 0) {
      return getMovieById({ id: id });
    } else {
      throw new Error(`data movie dengan ID ${id} tidak ditemukan.`);
    }
  } catch (error) {
    throw error;
  }
};

// Delete Movie
export const deleteMovie = async (id) => {
  const data = parseInt(id, 10);

  const query = `
      DELETE FROM movies
      WHERE movie_id = ?`;
  try {
    const [rows] = await pool.query(query, [data]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// ============ Buisness Logic ============

// Create New Movie
export const createNewMovie = async (payload) => {
  const {
    title,
    genreJSON,
    release_year,
    rating,
    deskripsi,
    image,
    update_status,
  } = payload;
  const query = `
          INSERT INTO movies 
          (title, genre, release_year, rating, deskripsi, image, update_status)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const value = [
    title,
    genreJSON,
    release_year,
    rating,
    deskripsi,
    image,
    update_status,
  ];
  try {
    const [result] = await pool.query(query, value);
    return result;
  } catch (err) {
    throw err;
  }
};

// Get Movie By Name
export const getMovieByTitle = async (payload) => {
  const { title } = payload;
  const query = `
    SELECT *
    FROM movies
    WHERE title = ? `;

  try {
    const [rows] = await pool.query(query, [title]);
    return rows;
  } catch (err) {
    throw err;
  }
};

//Get Movie By Include Word
export const getMovieByWord = async (payload) => {
  const { title } = payload;
  const query = `
    SELECT *
    FROM movies
    WHERE title LIKE ?`;
  const value = `%${title}%`;

  try {
    const [rows] = await pool.query(query, [value]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// ===== Searching By Word =====
export const getMoviesBySearch = async (payload) => {
  const { title } = payload;
  let resultData = [];

  try {
    const dataByName = await getMovieByTitle({ title: title });
    resultData.push(...dataByName);
    const dataByWord = await getMovieByWord({ title: title });

    // validasi untuk mencegah duplikasi data pencarian
    const uniqueTitles = new Set(resultData.map((item) => item.title));

    dataByWord.forEach((item) => {
      if (!uniqueTitles.has(item.title)) {
        uniqueTitles.add(item.title);
        resultData.push(item);
      }
    });

    console.log(resultData);
  } catch (err) {
    throw err;
  }
};

// ===== Short By Rating =====
export const shortByRating = async (row) => {
  const query = `
    SELECT *
    FROM movies
    WHERE rating BETWEEN 1 AND 5
    ORDER BY rating DESC
    LIMIT ?;`;
  const rowFormat = parseInt(row, 10) || 10;
  try {
    const [rows] = await pool.query(query, [rowFormat]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// ===== Short Trending =====
export const shortByTrending = async (row) => {
  const query = `
   SELECT *
   FROM movies
   ORDER BY view_count DESC
   LIMIT ?;`;
  const rowFormat = parseInt(row, 10) || 10;

  try {
    const [rows] = await pool.query(query, [rowFormat]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// ===== Update View Count =====
export const updateView = async (id) => {
  const query = `
    UPDATE movies
    SET view_count = view_count + 1
    WHERE movie_id = ?`;

  try {
    const [rows] = await pool.query(query, [parseInt(id, 10)]);
    return rows;
  } catch (err) {
    throw err;
  }
};

// ===== Filter By Genre =====
export const filterByGenre = async (genre, row) => {
  const query = `
  SELECT *
  FROM movies
  WHERE JSON_CONTAINS(genre, ?)
  LIMIT ?`;
  const genreFormat = `"${genre}"`;
  const rowFomrmat = parseInt(row, 10);

  try {
    const [rows] = await pool.query(query, [genreFormat, rowFomrmat]);
    return rows;
  } catch (err) {
    throw err;
  }
};
