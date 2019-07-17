import LoginCheckRoute from 'client/components/LoginCheckRoute';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { BookPage, HomePage, LoginPage, RegisterPage } from './index';

const Routing: React.FC = () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={BookPage} />
      <LoginCheckRoute
        mustNotLoggedIn
        path="/auth/login"
        component={LoginPage}
      />
      <LoginCheckRoute
        mustNotLoggedIn
        path="/auth/register"
        component={RegisterPage}
      />
      <Route path="/authors" component={BookPage} />
      <Route path="/books" component={BookPage} />
      <LoginCheckRoute mustLoggedIn exact={true} path="/user/profile" component={BookPage} />
    </Switch>
  );
};

export default Routing;
