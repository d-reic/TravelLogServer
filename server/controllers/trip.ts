import Trip from '../models/trip';
import BaseCtrl from './base';
import {ITripDocument} from '../models/types';

export default class TripCtrl extends BaseCtrl<ITripDocument> {

  projection: '_id, name, creator, createdAt';
  model = Trip;

  setCreator = (req, res, next) => {
    req.body.creator = req.user._id;
    next();
  };

  getOwn = (req, res) => {
    this.model.find({creator: req.user._id}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    }).populate('creator').select('-pois');
  };

  getPaginated = (req, res) => {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: 10
    }
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    }).skip(pageOptions.page * pageOptions.limit)
    .limit(10);
  };

  addPoiToTrip = (req, res, next) =>
    this.model.findOneAndUpdate({ _id: req._id }, req.body, {new: true}) //TODO: how to update array
      .then(m => (this.model.hasOwnProperty('load')) ? this.model['load'](m._id) : m)
      .then(m => req[this.model.collection.collectionName] = m)
      .then(() => next())
      .catch(err => {
        console.error(err);
        res.status(500).json({message: err});
      });

  removePoiFromTrip = (req, res, next) =>
    this.model.findOneAndUpdate({ _id: req._id }, req.body, {new: true}) //TODO: how to update array
      .then(m => (this.model.hasOwnProperty('load')) ? this.model['load'](m._id) : m)
      .then(m => req[this.model.collection.collectionName] = m)
      .then(() => next())
      .catch(err => {
        console.error(err);
        res.status(500).json({message: err});
      });
}
