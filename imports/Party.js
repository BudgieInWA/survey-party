import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Mark from './Mark';

// Geo coordinates are [lng, lat] in mongo.

const Party = {
  collection: new Mongo.Collection('party'),

  list() {
    return Party.collection.find({ open: true }, { fields: { name: 1, open: 1 } });
  },

  members({ _id, partyId = _id }) {
    return Meteor.users.find(
      { currentPartyId: partyId },
      { fields: { username: 1, icon: 1, currentPartyId: 1, location: 1, locationAt: 1 } }
    );
  },

  marks({ _id, partyId = _id }) {
    return Mark.collection.find({ partyId });
  }
};

if (Meteor.isServer) {
  Meteor.publish('party', (args) => Party.collection.find(args));
  Meteor.publish('parties', () => Party.list());

  // TODO check that user is in party:
  Meteor.publish('party.members', (args) => Party.members(args));
  Meteor.publish('party.marks', (args) => Party.marks(args));
}

Meteor.methods({
  'party.create'({ name }) {
    const user = Meteor.user({ fields: { username: 1 } });
    if (!user) throw new Meteor.Error('not-authorised');

    console.debug(user)
    if (!name) name = `${user.username}'s Party`;

    return Party.collection.insert({
      name,
      ownerId: user._id,
      open: true,
    });
  },
  // TODO auto close the party when it is idle

  'party.close'({ partyId }) {
    const user = Meteor.user({ fields: { _id: 1 } });
    if (!user) throw new Meteor.Error('not-authorised');

    const party = Party.collection.find({ _id: partyId }, { fields: { ownerId: 1 } })?.[0];
    if (!party) throw new Meteor.Error('not-found');

    // Checking if the user is the owner of the party
    if (party.ownerId !== user._id) throw new Meteor.Error('not-allowed');

    return Party.collection.update({ _id: partyId, ownerId: user._id }, { $set: { open: false } });
  },


  'me.joinParty'({ partyId }) {
    if (Party.collection.find({ _id: partyId }).count() === 0) throw new Meteor.Error('not-found');

    return Meteor.users.update(
      { _id: Meteor.userId() },
      { $set: { currentPartyId: partyId } }
    );
    // return Party.collection.update({ _id: partyId }, { $push: { attendeeIds: userId } });
  },

  'me.leaveParty'() {
    return Meteor.users.update(
      { _id: Meteor.userId() },
      { $unset: { currentPartyId: 1 } }
    );
  },

  'me.updateLocation'({ coordinates }) {
    return Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
          location: { type: 'Point', coordinates },
          locationAt: new Date(),
        }
      }
    );
  },
});

export default Party;
