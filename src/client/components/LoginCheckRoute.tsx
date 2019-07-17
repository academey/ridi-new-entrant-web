import { getAccessToken } from 'client/utils/storage';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface ILoginCheckRouteParam {
  mustLoggedIn?: boolean;
  mustNotLoggedIn?: boolean;
  component: any;
  [index: string]: any;
}
const LoginCheckRoute = ({
  component: Component,
  mustLoggedIn,
  mustNotLoggedIn,
  ...rest
}: ILoginCheckRouteParam) => (
  <Route
    {...rest}
    render={(props) => {
      if (mustLoggedIn === mustNotLoggedIn) {
        throw new Error('하나만 존재해야 한다');
      }
      const isLoggedIn = Boolean(getAccessToken());
      const accessSuccess = (mustLoggedIn && isLoggedIn) || (mustNotLoggedIn && !isLoggedIn);

      // TODO : 요청 날린 referer 쪽으로 돌려보내기.
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
