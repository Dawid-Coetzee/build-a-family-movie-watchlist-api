import express from "express";
import { getWatchlist, addMovie, updateMovie, deleteMovie } from "../utils/db.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";

const router = express.Router();

router.get("/:userId", authenticate, (req, res) => {
    try {
        const watchlist = getWatchlist(Number(req.params.userId));
        return res.status(200).json({ watchlist }); 
    } catch {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.post("/:userId/movies",authenticate , authorizeModification, (req, res) => {
    try {
        addMovie(Number(req.params.userId), req.body);
        return res.status(201).json({message: "Movie Successfully Added."})
    } catch {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.put("/:userId/movies/:movieId",authenticate , authorizeModification, (req, res) => {
    try {
        const { userId, movieId } = req.params;
        updateMovie(Number(userId), Number(movieId), req.body);
        return res.status(200).json({message: "Movie Successfully Updated."});
    } catch {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

router.delete("/:userId/movies/:movieId",authenticate , authorizeModification, (req, res) => {
    try {
        const { userId, movieId } = req.params;
        deleteMovie(Number(userId), Number(movieId));
        return res.status(200).json({message: "Movie Successfully Deleted."})
    } catch {
        return res.status(500).json({error: "Internal Server Error"})
    }
})

export default router;