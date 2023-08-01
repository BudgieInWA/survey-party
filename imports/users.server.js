import { Accounts } from 'meteor/accounts-base';

// Add extra fields to the user doc when creating a user.
Accounts.onCreateUser((options, user) => {
  user.icon = options.profile?.icon;
  console.log({ newUser: user });
  return user;
});

// Automatically publish the logged in user's own details.
Meteor.publish(null, () => {
  const userId = Meteor.userId();
  if (!userId) return;

  return Meteor.users.find({ _id: userId }, { fields: { icon: 1, currentPartyId: 1 } });
});
