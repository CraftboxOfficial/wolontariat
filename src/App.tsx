import type { Component } from 'solid-js';

import logo from './logo.svg';
import styles from './App.module.css';
import { Route, Routes } from "solid-app-router";
import { styled } from 'solid-styled-components';
import { HomePage } from './pages/HomePage';

export const App: Component = () => {

  return (
    <AppStyle>
      <Routes>
        <Route path="/" component={HomePage} />
      </Routes>
    </AppStyle>
  );
};


const AppStyle = styled("div")(() => {
  return {
    height: "100%",
    minHeight: "100%",
    width: "100%",
    minWidth: "100%"
  }
})