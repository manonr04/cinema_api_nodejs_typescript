import { Router } from 'express';
import * as movieController from '../controllers/movieController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - duration
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré du film
 *         title:
 *           type: string
 *           description: Titre du film
 *         description:
 *           type: string
 *           description: Description du film
 *         duration:
 *           type: integer
 *           description: Durée du film en minutes
 *         releaseDate:
 *           type: string
 *           format: date
 *           description: Date de sortie du film
 *         genre:
 *           type: string
 *           description: Genre du film
 *         afficheUrl:
 *           type: string
 *           description: URL de l'affiche du film
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Récupère tous les films
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des films
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Non autorisé
 */
router.get('/', movieController.getAllMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Récupère un film par son ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Détails du film
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Film non trouvé
 */
router.get('/:id', movieController.getMovieById);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Crée un nouveau film
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Film créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post('/', movieController.createMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Met à jour un film existant
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               afficheUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Film mis à jour
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Film non trouvé
 */
router.put('/:id', movieController.updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Supprime un film
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film à supprimer
 *     responses:
 *       204:
 *         description: Film supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Film non trouvé
 */
router.delete('/:id', movieController.deleteMovie);

export default router;
