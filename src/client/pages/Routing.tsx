import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { BookPage, HomePage, LoginPage, RegisterPage } from './index';

const Routing: React.FC = () => {
  return (
    <Switch>
      <Route exact={true} path="/" component={HomePage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/authors" component={BookPage} />
      <Route path="/books" component={BookPage} />
    </Switch>
  );
};

export default Routing;
