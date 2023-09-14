import React from 'react';
import Navbar from './navbar/Navbar';
function Layout(props) {
  return (
    <>
      <Navbar />
      <div className = "min-h-screen">
        {props.children}
      </div>
    </>
  );
}

export default Layout;
