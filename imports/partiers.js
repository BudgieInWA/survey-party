import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import randomProfile from './randomProfile';

// All geo coordinates are [lng, lat].

export const PartierCollection = new Mongo.Collection('partier');

Meteor.methods({
  'partier.join'({ name } = {}) {
    return PartierCollection.insert({ ...randomProfile() });
  },

  'partier.setLocation'({ _id, location }) {
    return PartierCollection.update({ _id }, {$set: {
      location: {
        type: 'Point',
        coordinates: location,
      }
    } });
  },
});

if (Meteor.isServer) {
  Meteor.publish('partier.list', function() {
    return PartierCollection.find({});
  });
}