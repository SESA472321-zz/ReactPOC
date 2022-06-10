import "./App.css";
import React, {Component, useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Navbar/Layout";
import ListRequests from "./Requests/ListRequests";
import AddEditRequests from "./Requests/FormRequests";
import Error from "./Navbar/Error";
import Pagination from "./Requests/Pagination";
import ListUsers from "./User/ListUsers";
import AddEditUsers from "./User/FormUsers";
import Home from "./Home";
import OidcCallback from "./OidcCallback";

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ListRequests />} />
            <Route path="Home" element={<Home />} />
            <Route path="ListRequests" element={<ListRequests />} />
            <Route path="Pagination" element={<Pagination />} />
            <Route path={`FormRequests/:id`} element={<AddEditRequests />} /> 
            <Route path="ListUsers" element={<ListUsers />} />       
            <Route path={`FormUsers/:id`} element={<AddEditUsers />} />
            <Route path="oidc-callback" element={<OidcCallback />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
}

export default App;
