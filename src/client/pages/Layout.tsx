import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from 'client/components/Header';
import { AboutPage, BookPage, ErrorBoundary, HomePage } from './index';

const Layout: React.FC = () => {
  return (
    <div>
      <Header />
      <ErrorBoundary>
        <Switch>
          <Route exact={true} path="/" component={HomePage} />
          <Route path="/authors" component={BookPage} />
          <Route path="/books" component={BookPage} />
        </Switch>
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
