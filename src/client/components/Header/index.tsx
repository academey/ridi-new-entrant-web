import * as React from 'react';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';

const Header = () => (
  <div>
    <Navbar color="light" light={true} expand="md">
      <NavbarBrand href="/">Ridi Mini Library</NavbarBrand>
      <NavbarToggler />
      <Collapse navbar={true}>
        <Nav className="ml-auto" navbar={true}>
          <NavItem>
            <NavLink href="/components/">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://github.com/reactstrap/reactstrap">
              GitHub
            </NavLink>
          </NavItem>
          <UncontrolledDropdown nav={true} inNavbar={true}>
            <DropdownToggle nav={true} caret={true}>
              Options
            </DropdownToggle>
            <DropdownMenu right={true}>
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem divider={true} />
              <DropdownItem>Reset</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  </div>
);

export default Header;
