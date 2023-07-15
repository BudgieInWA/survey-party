import React, { useCallback, useState } from 'react';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';
import { useTracker } from 'meteor/react-meteor-data';

import randomProfile from './randomProfile';

const LoginScreen = () => {
  const [{ icon, name }, setProfile] = useState(randomProfile);
  const loggingIn = useTracker(() => Meteor.loggingIn(), []);

  const refreshName = useCallback(() => setProfile(randomProfile()), []);
  const login = useCallback(() => {
    Accounts.createUser({ profile: { icon }, username: name, password: Random.secret(10) })
  }, [icon, name])

  return (
    <main>
      <h1>Welcome Partier 🥳</h1>

      {loggingIn ? 'Logging in...' :
        <>
          <div className="proposed-name">
            {icon} {name}
            <button onClick={refreshName}>🔄</button>
          </div>
          <button onClick={login}>Continue with this Pseudonym</button>
        </>
      }
    </main>
  )
}

export default LoginScreen;
