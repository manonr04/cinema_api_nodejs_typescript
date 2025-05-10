import { Router } from "express";
import * as controller from "../controllers/roomController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré de la salle
 *         name:
 *           type: string
 *           description: Nom de la salle
 *         capacity:
 *           type: integer
 *           description: Capacité d'accueil de la salle
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Récupère toutes les salles
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Liste des salles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       400:
 *         description: Requête invalide
 */
router.get("/", controller.getAllRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Récupère une salle par son ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la salle
 *     responses:
 *       200:
 *         description: Détails de la salle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Salle non trouvée
 */
router.get("/:id", controller.getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Crée une nouvelle salle
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Salle créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/", controller.createRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Met à jour une salle
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la salle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Salle mise à jour
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Salle non trouvée
 */
router.put("/:id", controller.updateRoom);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Supprime une salle
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la salle
 *     responses:
 *       204:
 *         description: Salle supprimée avec succès
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Salle non trouvée
 */
router.delete("/:id", controller.deleteRoom);

export default router;
