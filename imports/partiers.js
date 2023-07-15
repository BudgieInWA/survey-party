import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import randomProfile from './randomProfile';

// Geo coordinates are [lng, lat] in mongo.

export const PartierCollection = new Mongo.Collection('partier');

Meteor.methods({
  'partier.join'({ name } = {}) {
    return PartierCollection.insert({ ...randomProfile() });
  },

  'partier.setLocation'({ _id, coordinates }) {
    return PartierCollection.update({ _id }, {$set: {
      location: {
        type: 'Point',
        coordinates,
      }
    } });
  },

  'party.new'({ }) {
    // DEBUG Currently clears out everything.
    // TODO filter to keep recently active
    PartierCollection.remove({});
  }
});

if (Meteor.isServer) {
  PartierCollection.remove({});
  Meteor.publish('partier.list', function() {
    return PartierCollection.find({});
  });
}