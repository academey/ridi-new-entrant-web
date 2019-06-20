import { getAccessToken } from 'client/utils/storage';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface ILoginCheckRouteParam {
  mustNotLoggedIn?: boolean;
  component: any;
  [index: string]: any;
}
const LoginCheckRoute = ({
  component: Component,
  mustNotLoggedIn,
  ...rest
}: ILoginCheckRouteParam) => (
  <Route
    {...rest}
    render={(props) => {
      const accessSuccess =
        (!mustNotLoggedIn && getAccessToken()) ||
        (mustNotLoggedIn && !getAccessToken());
      const redirectPath = !mustNotLoggedIn ? '/auth/login' : '/';

      if (accessSuccess) {
        return React.createElement(Component, props);
      }
      return (
        <Redirect
          to={{ pathname: redirectPath, state: { from: props.location } }}
        />
      );
    }}
  />
);

export default LoginCheckRoute;
