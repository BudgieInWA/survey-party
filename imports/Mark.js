import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// All geo coordinates are [lng, lat] in storage. This enables geo-based queries like 'near'.

const Mark = {
  /** @type Mongo.Collection */
  collection:  new Mongo.Collection('mark'),
  /** @type Mongo.Collection */
  history: new Mongo.Collection('mark.history'),
};



Meteor.methods({
  'mark.createPoint'({ partyId, kind, coordinates } = {}) {
    if (!partyId || !coordinates) throw "missing-arg";
    // TODO check that user is in party

    const mark = {
      partyId,
      kind,
      location: {
        type: 'Point',
        coordinates,
      },
    };
    const _id = Mark.collection.insert(mark);

    if (Meteor.isClient) {
      // TODO set up the insert trick below (on the client) by monkeypatching here.
      Mark.history.insert({ ...mark, _id, ownerId: Meteor.userId() });
    }

    return _id;
  },
  'mark.createLine'({ partyId, kind, positions } = {}) {
    throw new Error("not-implemented");
    return Mark.collection.insert({});
  },
  'mark.createArea'({ partyId, kind, positions } = {}) {
    throw new Error("not-implemented");
    return Mark.collection.insert({});
  },
});

if (Meteor.isServer) {
}

export default Mark;