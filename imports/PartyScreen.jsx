import React, { useEffect, useState } from 'react';
import { useFind, useSubscribe, useTracker } from 'meteor/react-meteor-data';
import geolocation from './geolocation';
import { coords } from './lib';
import { Button, Spinner } from './lib/components';

import PartyMap from './PartyMap';
import Party from './Party';


const PartyScreen = () => {
  const user = useTracker(() => Meteor.user(), []);
  const partyId = user?.currentPartyId;

  const partyLoading = useSubscribe('party', partyId);
  const party = useFind(() => Party.collection.find(partyId), [partyId])?.[0];
  const membersLoading = useSubscribe('party.members', { partyId });
  const members = useFind(() => Party.members({ partyId }), [partyId]);

  const [isPresent, setPresent] = useState(false);
  useEffect(() => {
    if (isPresent) {
      const interval = setInterval(updatePosition, 1000);
      return () => clearInterval(interval); }
  },
  [isPresent]);
  const updatePosition = () => Meteor.callPromise('me.updateLocation', { coordinates: coords(geolocation()) });

  return (
    <main>
      <h1>🧭 {party?.name}</h1>

      {membersLoading() || partyLoading() && <Spinner />}

      <h2>Members</h2>
      <ul>
        {members.map(({ _id, username, icon }) => <li key={_id}>{icon} {username}</li>)}
      </ul>

      <label className={"form-control"}>
        <input type="checkbox" checked={isPresent} onChange={() => setPresent(!isPresent)} />
        📍 {user?.icon}
        Visible Agent
      </label>

      <Button variant="danger" action={leaveParty} >Bail</Button>
      {party?.ownerId === user._id &&
        <Button variant="danger-outline" action={closeParty}>Close</Button>
      }

      <PartyMap partyId={partyId} members={members} />
    </main>
  )
}

const leaveParty = () => Meteor.callPromise('me.leaveParty');
const closeParty = () => Meteor.callPromise('me.closeParty');

export default PartyScreen;
