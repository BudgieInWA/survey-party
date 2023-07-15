import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import PartyMap from './PartyMap';

const PartyScreen = () => {
  const user = useTracker(() => Meteor.user(), []);

  return (
    <main>
      <h1>Survey Party 🧭</h1>

      <PartyMap userId={user._id}/>
    </main>
  )
}

export default PartyScreen;
