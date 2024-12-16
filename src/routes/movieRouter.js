import express from "express";
import {
  getAllMovies,
  createMovie,
  deleteMovie,
  getMovieBySearch,
  shortBy,
  filterByGenre,
  updateView,
} from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.get("/movie", getAllMovies); //OK
movieRouter.get("/movie/genre/:genre", filterByGenre); //OK
movieRouter.get("/movie/:short", shortBy); //OK
movieRouter.get("/movie/search/:title", getMovieBySearch); //OK
movieRouter.post("/upload", createMovie);
movieRouter.patch("/movie/view/:id", updateView); //OK
movieRouter.delete("/movie/:id", deleteMovie); //OK

export default movieRouter;
 