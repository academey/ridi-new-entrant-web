import { REDUX_FORM_KEY } from 'client/pages/auth/LoginPage/constants';
import { IStoreState } from 'client/store';
import { actionCreators } from 'client/store/auth';
import { fromJS } from 'immutable';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';

interface ILoginPageProps {
  loginLoading: boolean;
  loginError: boolean;
  loginErrorMessage: string;
  message: string;
  loginStart: (email: string, password: string) => void;
}

interface ILoginFormState {
  email: string;
  password: string;
}

class LoginPage extends React.Component<
  InjectedFormProps<ILoginFormState> & ILoginPageProps
> {
  public submit = ({ email, password }: ILoginFormState) => {
    const { loginStart } = this.props;

    loginStart(email, password);
  };

  public render() {
    const {
      loginLoading,
      loginError,
      loginErrorMessage,
      pristine,
      submitting,
      reset,
      handleSubmit,
      message,
    } = this.props;

    console.log(loginLoading, loginError, loginErrorMessage);

    return (
      <div>
        LoginPage~~~~
        <form onSubmit={handleSubmit(this.submit)}>
          <div>{message}</div>
          <div>
            <label>Email </label>
            <Field
              name="email"
              component="input"
              type="text"
              placeholder="Email"
            />
          </div>
          <div>
            <label>Password </label>
            <Field
              name="password"
              component="input"
              type="password"
              placeholder="password"
            />
          </div>
          <div>
            <button type="submit" disabled={pristine || submitting}>
              Submit
            </button>
            <button
              type="button"
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear Values
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }: IStoreState) => {
  console.log(auth.toJS());
  return {
    loginLoading: auth.get('loginLoading'),
    loginError: auth.get('loginError'),
    loginErrorMessage: auth.get('loginErrorMessage'),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loginStart: (email: string, password: string) =>
    dispatch(actionCreators.loginStart(email, password)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReduxForm = reduxForm({
  form: REDUX_FORM_KEY,
});
export default compose(
  withConnect,
  withReduxForm,
)(LoginPage);
