import { Outlet, Link } from "react-router-dom";
import "./navstyle.css";
import logo from './logo.png';
import React, {Component, useState, useEffect} from "react";

const Layout = () => {
  return (
    < >
      <nav className="navbar navbar-custom">
        <div className="container-fluid">
          <div className="navbar-header">
            <img src={logo} alt="Logo" />
          </div>
          <ul className="nav navbar-nav">
            <li className="active"><Link className = "whiteChar" to="/ListRequests">Requests</Link></li>
            <li className="active"><Link className = "whiteChar" to="/Pagination">Pagination</Link></li>
            {/* <li className="active"><Link className = "whiteChar" to="/ListRequestsPing">Requests Ping</Link></li> */}
            <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" href="#" className = "whiteChar">Back Office<span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><Link to="/ListUsers">User</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;