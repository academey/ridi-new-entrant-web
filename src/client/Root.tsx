import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from 'client/components/Header';
import { ErrorBoundary } from 'client/pages';
import Notifications from 'react-notify-toast';
import Routing from './pages/Routing';

const Root = () => {
  return (
    <div>
      <Notifications />
      <Header />
      <ErrorBoundary>
        <Routing />
      </ErrorBoundary>
    </div>
  );
};

export default Root;
