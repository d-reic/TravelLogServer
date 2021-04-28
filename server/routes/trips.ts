import TripCtrl from "../controllers/trip";
import POICtrl from "../controllers/poi";

module.exports = function (router, jwtAuth, isOwner, isAdminOrOwner) {
  const tripCtrl = new TripCtrl();
  const poiCtrl = new POICtrl();

  /**
   * @openapi
   * tags:
   *   name: Trips
   *   description: Management of Trips
   */

  /**
   *
   *
   * @swagger
   * components:
   *   schemas:
   *     Trip:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: The trip's name.
   *           example: "Pacific Trail"
   *         description:
   *           type: string
   *           description: The trip's description.
   *           example: From Los Angeles to Vancouver 4000 Miles.
 *           begin:
   *           type: string
   *           description: Start date of trip
 *           end:
   *           type: string
   *           description: End date of trip
   *         pois:
   *           type: array
   *           description: POIS of the trip
   *           items:
   *             $ref: '#/components/schemas/BasePoi'
   *
   *
   */

  /**
   * @swagger
   * /trips:
   *   post:
   *     summary: Add new Trip to collection
   *     description:  Adds new trip, sets creator and responds with trip.
   *     tags:
   *       - Trips
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *          $ref: '#/components/schemas/Trip'
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: The trip to be added
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/Trip'
   *
   */
  router.route('/trips').post(jwtAuth, tripCtrl.setCreator, tripCtrl.insert, tripCtrl.show);

  /**
   * @swagger
   * /trips/{tripId}:
   *   put:
   *     summary: Updates trip
   *     tags:
   *       - Trips
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *          $ref: '#/components/schemas/Trip'
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: The updated trip
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/Trip'
   *
   */
  router.route('/trips/:tripId').put(jwtAuth, isOwner, tripCtrl.setCreator, tripCtrl.update, tripCtrl.show);

  /**
   * @swagger
   * /trips/mine:
   *   get:
   *     summary: Gets trips of currently logged in user
   *     tags:
   *       - Trips
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: List of trips of the user
   *         content:
   *           application/json:
   *             schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/Trip'
   *
   */
  router.route('/trips/mine').get(jwtAuth, tripCtrl.getOwn);

  router.route('/trips').get(jwtAuth, tripCtrl.getPaginated);

  /**
   * @swagger
   * /trips/{tripId}:
   *   get:
   *     summary: Details of one trip
   *     tags:
   *       - Trips
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: The trip referenced by TripId
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/Trip'
   *
   */
  router.route('/trips/:tripId').get(jwtAuth, tripCtrl.show);

  /**
   * @swagger
   * /trips/{tripId}:
   *   delete:
   *     summary: Delete a trip referenced by tripId
   *     tags:
   *       - Trips
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: Trip was deleted successfully
   *
   */
  router.route('/trips/:tripId').delete(jwtAuth, isAdminOrOwner, poiCtrl.deletePoisFromTrip, tripCtrl.delete);

  /**
   * @swagger
   * /trips/count:
   *   get:
   *     summary: Get amount of trips
   *     tags:
   *       - Trips
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: The trip referenced by TripId
   *         content:
   *           application/json:
   *             schema:
   *              type: integer
   */
  router.route('/trips/count').get(jwtAuth, tripCtrl.count);

  /**
   * @swagger
   * /trips/{tripId}/addPOI:
   *   post:
   *     summary: Add a new poi to an existing trip
   *     tags:
   *       - Trips
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: The updated trip with the added poi
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/Trip'
   *
   */
router.route('/trips/:tripId/addPOI').post(jwtAuth, isOwner, poiCtrl.setCreatorAndLocType, poiCtrl.insert, tripCtrl.addPoiToTrip, tripCtrl.show);

  /**
   * @swagger
   * /trips/{tripId}/{poiId}:
   *   delete:
   *     summary: Remove a point from a trip ( but not from DB)
   *     tags:
   *       - Trips
   *     security:
   *      - jwt: []
   *     responses:
   *       200:
   *         description: The trip of which the POI was removed
   *         content:
   *           application/json:
   *             schema:
   *              $ref: '#/components/schemas/Trip'
   *
   */
  router.route('/trips/:tripId/:poiId').delete(jwtAuth, isOwner, tripCtrl.removePoiFromTrip, tripCtrl.show);

  router.param('poiId', poiCtrl.load)
  router.param('tripId', tripCtrl.load);
}
