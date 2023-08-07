import React from 'react';

export const Spinner = () => '⏳';

export const Button = ({
  variant = 'light',
  action = () => {},
  arg,
  args = [arg],
  onClick = (ev) => { action(...args); return false; },
  children
}) =>
  <button className={`btn btn-${variant}`} onClick={onClick}>{children}</button>