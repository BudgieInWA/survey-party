import React, { useCallback } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import PartyScreen from './PartyScreen';
import LoginScreen from './LoginScreen';

export const App = () => {
  const user = useTracker(() => Meteor.user(), []);
  const logout = useCallback(() => Meteor.logout(), []);

  return <>
    <div className="header">
      <div className="user">
        {user
          ? <>{user.icon} {user.username}
            <button onClick={logout}>log out</button>
          </>
          : ''
        }
      </div>
    </div>
    {user ? <PartyScreen/> : <LoginScreen/>}
  </>;
};
