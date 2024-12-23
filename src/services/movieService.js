import {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  createNewMovie,
  getMovieByTitle,
  getMovieByWord,
  shortByRating,
  shortByTrending,
  filterByGenre,
  updateView,
} from "../repositories/movieRepository.js";

// Get All Movies
export const serviceGetMovies = async () => {
  return await getMovies();
};

// Update Movie title/genre/image/year
export const serviceUpdateUser = async () => {};

// ===== Create Movie =====
export const serviceCreateMovie = async (payload) => {
  const { title, genre, release_year, rating, deskripsi, image } = payload;

  if (!title || !genre || !release_year || !image) {
    return {
      status: 400,
      message: "Masukkan data dengan lengkap!",
    };
  }

  const newPayload = {
    title: title,
    genreJSON: JSON.stringify(genre),
    release_year: release_year,
    rating: rating || 0,
    deskripsi: deskripsi || "",
    image: image,
    update_status: 0,
  };
  return createNewMovie(newPayload);
};

// ===== Delete Movie =====
export const serviceDeleteMovie = async (id) => {
  return await deleteMovie(id);
};

// ===== Searching By Word =====
export const serviceGetMovieBySearch = async (title) => {
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
    return resultData;
  } catch (error) {
    throw error;
  }
};

// ===== Short By Rating =====
export const serviceShortByRating = async (row) => {
  return await shortByRating(row);
};

// ===== Short By View Count =====
export const serviceShortByTranding = async (row) => {
  return await shortByTrending(row);
};

// ===== Filter By Genre =====
export const serviceFilterByGenre = async (genre, row) => {
  return await filterByGenre(genre, row);
};

// ===== Update ViewCount =====
export const serviceUpdateView = async (id) => {
  return await updateView(id);
};

// Contoh
// const contohCreate = await createNewMovie({
//       title : 'Dummy Movie',
//       genre : ["Horor", "Studying"],
//       release_year : 2024,
//       rating : 8.7,
//       deskripsi : "lorem ipsum dolor siamet ketumprang keumpret",
//       image : "/image/dummy.jpg"
//     });
//     console.log(contohCreate);
