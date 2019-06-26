import { IStoreState } from 'client/store';
import { actionCreators } from 'client/store/auth';
import { User } from 'database/models/User';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from 'reactstrap';
import { compose, Dispatch } from 'redux';

interface IHeaderProps {
  user: User;
  logout: () => void;
}

class Header extends React.Component<IHeaderProps, any> {
  public getAuthNavLink = () => {
    const { user, logout } = this.props;

    if (user) {
      return (
        <Nav className="ml-auto" navbar={true}>
          <NavItem>
            <div>{user.email} 님 안녕하세요!</div>
          </NavItem>
          <NavItem>
            <NavLink onClick={logout}>로그아웃</NavLink>
          </NavItem>
        </Nav>
      );
    }

    return (
      <Nav className="ml-auto" navbar={true}>
        <NavItem>
          <NavLink tag={Link} to="/auth/login/">
            로그인
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/auth/register/">
            회원가입
          </NavLink>
        </NavItem>
      </Nav>
    );
  };

  public render() {
    return (
      <div>
        <Navbar color="light" light={true} expand="md">
          <NavbarBrand href="/">Ridi Mini Library</NavbarBrand>
          <NavbarToggler />
          <Collapse navbar={true}>{this.getAuthNavLink()}</Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }: IStoreState) => {
  return {
    user: auth.get('user'),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch(actionCreators.logout()),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Header);
