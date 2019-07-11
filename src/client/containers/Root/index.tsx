import * as React from 'react';

import Header from 'client/containers/Header';
import { ErrorBoundary } from 'client/pages';
import Routing from 'client/pages/Routing';
import { actionCreators } from 'client/store/auth';
import { getAccessToken } from 'client/utils/storage';
import Notifications from 'react-notify-toast';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';

interface IRootProps {
  loginCheckStart: () => void;
}

class Root extends React.PureComponent<IRootProps> {
  constructor(props: IRootProps) {
    super(props);

    if (getAccessToken()) {
      this.props.loginCheckStart();
    }
  }

  public render() {
    return (
      <div>
        <Notifications />
        <Header />
        <ErrorBoundary>
          <Routing />
        </ErrorBoundary>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginCheckStart: () => dispatch(actionCreators.loginCheckStart()),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(Root);
