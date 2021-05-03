import BaseCtrl from './base';
import POI from '../models/poi';
import {IPOIDocument} from '../models/types';
import {createBucket} from 'mongoose-gridfs';
import mongoose from 'mongoose';
import sharp from 'sharp';
import * as fs from "fs";


export default class POICtrl extends BaseCtrl<IPOIDocument> {
  model = POI;
  projection: '_id, name, creator, createdAt';

  setCreatorAndLocType = (req, res, next) => {
    req.body.creator = req.user._id;
    req.body.loc.type = 'Point';
    next();
  };

  deletePoisFromTrip = (req, res, next) => {
    this.model.deleteMany({_id: req.trips.pois})
      .then(() => next())
      .catch(err => res.status(500).json({message: `Could not delete these elements (${err})`}));
  };

  updatePoiToAddImage = (req, res, next) =>
    this.model.findOneAndUpdate({ _id: req.pois._id }, { $addToSet: { images: req.pois.images} }, {new: true})
      .then(m => (this.model.hasOwnProperty('load')) ? this.model['load'](m._id) : m)
      .then(m => req[this.model.collection.collectionName] = m)
      .then(() => next())
      .catch(err => {
        console.error(err);
        res.status(500).json({message: err});
      });

  addImage = (req, res, next) => {
    const deleteFile = () => fs.unlinkSync(file.path);

    const file = req.file;
    const _id = mongoose.Types.ObjectId();
    const fileOptions = {
      _id,
      filename: _id.toString() + '_' + file.originalname,
      contentType: file.mimetype,
      metadata: {
        poi: req.pois._id,
        creator: req.user.username
      }
    };

    const maxDimension = parseInt(process.env.MAX_IMAGE_DIMENSION || '500', 10);
    const wStream = createBucket().createWriteStream(fileOptions);
    sharp(file.path).resize(maxDimension).toBuffer()
      .then(img => wStream.write(img))
      .then(a => wStream.end())
      .then(() => {
        const poi = req.pois;
        deleteFile();
        poi.images.push({
          description: req.body.description,
          id: _id,
          uploaded: Date.now(),
          user: req.user.username
        });
             })
      .then(() => next())
      .catch(err => {
        console.error(err);
        res.status(500).json({message: err});
      })
  }

  getImage = (req,res) => {
    try {
      const bucket = createBucket();
      const id = mongoose.Types.ObjectId(req.params.imageId);
      bucket.findOne({_id: id}, (err, file) => {
        if (err) {
          //logger.error('Could not read image from database', err);
          res.status(500).json({message: (err.message || err)})
        } else {
          res.set('Content-Type', file.contentType);
          bucket.createReadStream({_id: id}).pipe(res);
        }
      });
    } catch (err) {
      res.status(500).json({message: err.message})
    }
  };

}
