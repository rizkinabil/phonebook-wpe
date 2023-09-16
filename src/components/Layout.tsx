import React, { ReactNode } from 'react';
import Header from './header/Header';
import { Container } from 'cherry-components';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      <Container>
        <Header />
        <main>{children}</main>
      </Container>
    </>
  );
};

export default Layout;
