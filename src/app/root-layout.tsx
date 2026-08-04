import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [location.pathname]);
  return null;
};

export const RootLayout: React.FC = () => (
  <>
    <ScrollToTop />
    <Outlet />
  </>
);

export default RootLayout;
