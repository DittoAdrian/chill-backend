import {
  serviceGetMovies,
  serviceCreateMovie,
  serviceDeleteMovie,
  serviceGetMovieBySearch,
  serviceShortByRating,
  serviceFilterByGenre,
  serviceUpdateView,
  serviceShortByTranding,
} from "../services/movieService.js";

// Get All Movies
export const getAllMovies = async (req, res) => {
  try {
    const result = await serviceGetMovies();
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

//Create Movie
export const createMovie = async (req, res) => {
  try {
    const payload = req.body;
    const result = await serviceCreateMovie(payload);
    res.status(200).send(result);
  } catch (err) {
    res.send(err);
  }
};

// Delete Movies
export const deleteMovie = async (req, res) => {
  const {id} = req.params;
  try {
    const result = await serviceDeleteMovie(id);
    res.status(202).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Search By Word
export const getMovieBySearch = async (req, res) => {
  const { title } = req.params;

  // Validasi input
  if (!title || typeof title !== 'string') {
    return res.status(400).send({ message: "Parameter 'title' is required and must be a string." });
  }

  try {
    const result = await serviceGetMovieBySearch(title);
    res.status(200).send(result);
  } catch (err) {
    res.send(err);
  }
};

// Short By Rating
export const shortByRating = async (req, res) => {
  const payload = req.body;
  try {
    const result = await serviceShortByRating(payload);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Short By View Count
export const shortByTrending = async (req, res) => {
  const payload = req.body;
  try {
    const result = await serviceShortByTranding(payload);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Short By
export const shortBy = async (req, res) => {
  const { short } = req.params;
  const { row } = req.query;
  if (short == "rating") {
    try {
      const result = await serviceShortByRating(row);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }
  if (short == "trending") {
    try {
      const result = await serviceShortByTranding(row);
      res.status(200).send(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }
};

// Filter By Genre
export const filterByGenre = async (req, res) => {
  const genre = req.params.genre;
  const { row } = req.query;
  try {
    const result = await serviceFilterByGenre(genre, row);
    res.status(200).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
};

//Update View Count
export const updateView = async (req, res) => {
  const {id} = req.params;
  try {
    const result = await serviceUpdateView(id);
    res.status(200).send(result);
  } catch (err) {
    res.send(err);
  }
};
