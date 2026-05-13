import React from 'react';
import { Outlet } from 'react-router-dom';

// Layout just renders the current page — Header1 is inside each page component
function Layout() {
  return <Outlet />;
}

export default Layout;
