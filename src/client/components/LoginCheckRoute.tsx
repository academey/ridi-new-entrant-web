import { getAccessToken } from 'client/utils/storage';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface ILoginCheckRouteParam {
  mustLoggedIn?: boolean;
  component: any;
  [index: string]: any;
}
const LoginCheckRoute = ({
  component: Component,
  mustLoggedIn,
  ...rest
}: ILoginCheckRouteParam) => (
  <Route
    {...rest}
    render={(props) => {
      const accessSuccess = mustLoggedIn === !!getAccessToken();
      const redirectPath = mustLoggedIn ? '/auth/login' : '/';

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
