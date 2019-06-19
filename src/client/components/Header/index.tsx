import * as React from 'react';
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

const Header = () => (
  <div>
    <Navbar color="light" light={true} expand="md">
      <NavbarBrand href="/">Ridi Mini Library</NavbarBrand>
      <NavbarToggler />
      <Collapse navbar={true}>
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
      </Collapse>
    </Navbar>
  </div>
);

export default Header;
