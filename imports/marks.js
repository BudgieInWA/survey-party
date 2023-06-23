import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import randomProfile from './randomProfile';

// All geo coordinates are [lng, lat] in storage. This enables geo-based queries like 'near'.

export const MarkCollection = new Mongo.Collection('mark');
MarkCollection.History = new Mongo.Collection('mark.history');
// TODO set up the insert trick below (on the client) by monkeypatching here.

Meteor.methods({
  'mark.addPoint'({ kind, position } = {}) {
    if (!kind || !position) throw "missing-arg";

    const mark = {
      kind,
      location: {
        type: 'Point',
        coordinates: position,
      },
    };
    const _id = MarkCollection.insert(mark);

    if (Meteor.isClient) {
      MarkCollection.History.insert({ ...mark, _id, owner: Meteor.userId() });
    }

    return _id;
  },
  'mark.addLine'({ kind, position } = {}) {
    throw new Error("not-implemented");
    return MarkCollection.insert({});
  },
  'mark.addArea'({ kind, position } = {}) {
    throw new Error("not-implemented");
    return MarkCollection.insert({});
  },
});

if (Meteor.isServer) {
  MarkCollection.remove({ 'location.coordinates': null });

  Meteor.publish('mark.list', function () {
    return MarkCollection.find({});
  });
}