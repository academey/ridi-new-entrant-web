import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Layout from './pages/Layout';

const Root = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default Root;
