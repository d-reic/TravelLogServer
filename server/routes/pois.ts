import POICtrl from "../controllers/poi";
import multer from 'multer';


module.exports = function (router, jwtAuth, isOwner, isAdminOrOwner) {

  const poiCtrl = new POICtrl();

  const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      } }
  });

  /**
   * @openapi
   * tags:
   *   name: Pois
   *   description: Management of Pois
   */

  /**
   *
   *
   * @swagger
   * components:
   *   schemas:
   *     BasePoi:
   *       type: object
   *       properties:
   *         name:
   *            type: string
   *            description: The POI'S name.
   *            example: "Museum"
   *         description:
   *            type: string
   *            description: The POIS's description.
   *            example: Der Grazer Schlossberg ist die höchste Ergehbung von Graz
   *         type:
   *            type: string
   *            description: type of poi
   *      FullPoi:
   *       allOf:
   *        - $ref: '#/components/schemas/BasePoi'
   *        - type: object
   *          properties:
   *            location:
   *              type: object
   *              description: Coordinates of the POI
   *              properties:
   *                type:
   *                  type: string
   *                  description: Type of location
   *                coordinates:
   *                  type: array
   *                  items:
   *                     type: integer
   *
   *
   *
   */


  router.route('/pois').post(jwtAuth, poiCtrl.setCreatorAndLocType, poiCtrl.insert, poiCtrl.show);
  router.route('/pois').get(jwtAuth, isAdminOrOwner, poiCtrl.getAll);
  router.route('/pois/:poiId').delete(jwtAuth, isAdminOrOwner, poiCtrl.delete);
  router.route('/pois/:poiId').put(jwtAuth, isOwner, poiCtrl.setCreatorAndLocType, poiCtrl.update, poiCtrl.show);
  router.route('/pois/:poiId').get(jwtAuth, isAdminOrOwner, poiCtrl.show);
  router.route('/pois/:poiId/image').post(jwtAuth, isAdminOrOwner, upload.single('file'),poiCtrl.addImage, poiCtrl.updatePoiToAddImage, poiCtrl.show);
  router.route('/pois/images/:imageId').get(jwtAuth, poiCtrl.getImage);

  router.param('poiId', poiCtrl.load);

}
