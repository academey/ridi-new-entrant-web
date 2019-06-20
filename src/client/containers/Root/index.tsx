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
  loginCheckStart: (accessToken: string) => void;
}

class Root extends React.PureComponent<IRootProps> {
  constructor(props: IRootProps) {
    super(props);
    this.checkAuth();
  }

  public checkAuth = () => {
    const accessToken = getAccessToken();

    if (accessToken) {
      this.props.loginCheckStart(accessToken);
    }
  };

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
  loginCheckStart: (accessToken: string) =>
    dispatch(actionCreators.loginCheckStart(accessToken)),
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(Root);
