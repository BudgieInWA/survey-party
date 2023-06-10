import React, { useEffect, useState } from 'react';
import { Hello } from './Hello.jsx';

export const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    Meteor.callPromise('partier.join').then(setUserId);
  }, [])

  return (
    <div className="container-fluid">
      <h1>Survey Party</h1>
      <Hello userId={userId}/>
    </div>
  );
};
