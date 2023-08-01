import React from 'react';
import { useFind, useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Spinner } from './lib/components';

import PartyMap from './PartyMap';
import Party from './Party';


const PartyScreen = () => {
  const user = useTracker(() => Meteor.user(), []);
  const partyId = user?.currentPartyId;

  let isLoading = useSubscribe('party.members', { partyId });
  const members = useFind(() => Party.members({ partyId }));

  return (
    <main>
      <h1>Survey Party 🧭</h1>

      {isLoading() && <Spinner />}

      <h2>Members</h2>
      <ul>
        {members.map(({ _id, username, icon }) => <li key={_id}>{icon} {username}</li>)}
      </ul>

      <button onClick={leaveParty}>Leave</button>

      <PartyMap partyId={partyId} members={members} />
    </main>
  )
}

const leaveParty = () => Meteor.callPromise('me.leaveParty');

export default PartyScreen;
