import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { Spinner } from '/imports/lib/components';

import Party from './Party';

const PartyListScreen = () => {
  const isLoading = useSubscribe('parties');
  const parties = useFind(() => Party.list(), []);

  return (
    <main>
      <h1>Join a party</h1>

      {isLoading() && <Spinner />}

      {parties.length ?
        <ul>
          {parties.map(({ _id, name }) =>
            <li key={_id}>
              <a href={`/party/${_id}`} data-partyid={_id} onClick={clickJoinParty}>{name}</a>
            </li>
          )}
        </ul> :
        <p className="empty-section">No parties to join.</p>
      }

      <button onClick={createParty}>Create a Party</button>
    </main>
  )
}

const clickJoinParty = (ev) => {
  Meteor.call('me.joinParty', { partyId: ev.currentTarget.dataset.partyid });
  return false; // stop navigation (because we don't use a router yet).
};

const createParty = () => {
  const partyId = Meteor.apply('party.create', [{}], { returnStubValue: true });
  Meteor.call('me.joinParty', { partyId });
}

export default PartyListScreen;
