import { REDUX_FORM_KEY } from 'client/pages/auth/RegisterPage/constants';
import { IStoreState } from 'client/store';
import { actionCreators } from 'client/store/auth';
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, Dispatch } from 'redux';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';

interface IRegisterPageProps {
  registerLoading: boolean;
  registerError: boolean;
  registerErrorMessage: string;
  message: string;
  registerStart: (email: string, password: string) => void;
}

interface IRegisterPageFormState {
  email: string;
  password: string;
}

class RegisterPage extends React.Component<
  InjectedFormProps<IRegisterPageFormState> & IRegisterPageProps
> {
  public submit = ({ email, password }: IRegisterPageFormState) => {
    const { registerStart } = this.props;

    registerStart(email, password);
  };

  public render() {
    const {
      registerLoading,
      registerError,
      registerErrorMessage,
      pristine,
      submitting,
      reset,
      handleSubmit,
      message,
    } = this.props;

    console.log(registerLoading, registerError, registerErrorMessage);

    return (
      <div>
        RegisterPage~~~~
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
  return {
    registerLoading: auth.get('registerLoading'),
    registerError: auth.get('registerError'),
    registerErrorMessage: auth.get('registerErrorMessage'),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  registerStart: (email: string, password: string) =>
    dispatch(actionCreators.registerStart(email, password)),
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
)(RegisterPage);
