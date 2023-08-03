import React from 'react';
import { useFind, useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Spinner } from './lib/components';

import PartyMap from './PartyMap';
import Party from './Party';


const PartyScreen = () => {
  const user = useTracker(() => Meteor.user(), []);
  const partyId = user?.currentPartyId;

  const partyLoading = useSubscribe('party', partyId);
  const party = useFind(() => Party.collection.find(partyId), [partyId]);
  const membersLoading = useSubscribe('party.members', { partyId });
  const members = useFind(() => Party.members({ partyId }), [partyId]);

  return (
    <main>
      <h1>🧭 {party?.name}</h1>

      {membersLoading() || partyLoading() && <Spinner />}

      <h2>Members</h2>
      <ul>
        {members.map(({ _id, username, icon }) => <li key={_id}>{icon} {username}</li>)}
      </ul>

      <button onClick={leaveParty} className="btn btn-danger">Bail</button>
      {party?.ownerId === user._id &&
        <button onClick={closeParty} className="btn btn-danger-outline">Close</button>
      }

      <PartyMap partyId={partyId} members={members} />
    </main>
  )
}

const leaveParty = () => Meteor.callPromise('me.leaveParty');
const closeParty = () => Meteor.callPromise('me.closeParty');

export default PartyScreen;
