import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import Home from './containers/pages/Home'
import Signin from './containers/pages/Signin'
import Mission from './containers/pages/Mission'
import {ReduxState} from "./constants/store";
import {connect} from "react-redux";
import {HOME, SIGNIN, MISSION} from "./constants/routes";
import styled, {createGlobalStyle, ThemeProvider} from "styled-components";
import bgImg from './bg.png';
import TransactionButton from './components/molecules/TransactionButton';

const GlobalStyle = createGlobalStyle<any>`
  * { box-sizing: border-box; }
  html {
    margin: 0;
    padding: 0;
  }
  body {
    margin: 0;
    font-family: ${p => p.theme.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &:before {
      content: "";
      width: 100%;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      background-image: url(${bgImg});
      background-size: cover;
      background-repeat: no-repeat;
      z-index: -1;
    }
  }
`;

function mapStateToProps(state: ReduxState) {
  return Object.assign({}, {userInfo: state.userInfo});
}

const App = () => {

  return (
    <ThemeProvider theme={{ fontFamily: "font-family:'游ゴシック Medium',YuGothic,YuGothicM,'Hiragino Kaku Gothic ProN','Hiragino Kaku Gothic Pro',メイリオ,Meiryo,sans-serif" }}>
      <GlobalStyle />
      <BrowserRouter>
        <AppContainer>
          <Switch>
            <Route exact path={HOME}><Home /></Route>
            <Route path={SIGNIN}><Signin /></Route>
            <Route path={MISSION}><Mission /></Route>
          </Switch>
          <TransactionButton />
        </AppContainer>
      </BrowserRouter>
    </ThemeProvider>
  )
};

const AppContainer = styled.div`
　width: 100%;
  padding: 20px;
`;

export default connect(
  mapStateToProps
)(App)