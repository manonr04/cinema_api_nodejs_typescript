import { Router } from 'express';
import * as movieController from '../controllers/movieController';

const router = Router();

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

export default router;