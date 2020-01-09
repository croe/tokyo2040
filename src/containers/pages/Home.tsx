import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import {ReduxState} from "../../constants/store";
import {connect} from "react-redux";
import {blocks, domains} from "../../constants/api";
import {Action, Dispatch} from "redux";
import firebase from '../../constants/firebase';
import {authActions} from "../../modules/Auth";
import {setUserInfo} from "../organisms/AuthContainer";
import CountdownTimer from '../../components/molecules/CountdownTimer';
import KNNDetector from '../../components/molecules/KNNdetector';

function mapStateToProps(state: ReduxState) {
  return Object.assign({}, {userInfo: state.userInfo});
}

function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
  return {
    refLogin: () => {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {return}
        dispatch(authActions.login(setUserInfo(user)));
      })
    }
  }
}

const Home = (props: any) => {

  const [block, setBlock]:any = useState([]);
  const [domain, setDomains]:any = useState([]);

  useEffect(() => {
    const blockchainObserver:any = blocks.onSnapshot((doc: any) => {
      const data:any = doc.data();
      setBlock(data);
    });
    return blockchainObserver;
  },[]);

  useEffect(() => {
    const domainsObserver: any = domains.onSnapshot((doc: any) => {
      const data:any = doc;
      setDomains(data);
    });
    return domainsObserver;
  },[]);

  useEffect(() => {
    props.refLogin!()
  },[]);

  return (
    <>
      <h1>Home page - You: {props.userInfo.displayName} -</h1>
      <h2>Blockcount: {block.height} </h2>
      {/*<img src={tiger} width="400" id="image" alt=""/>*/}
      <Link to="/signin">signin</Link><br/>
      <Link to="/mission">mission</Link>
      <CountdownTimer {...block} />
      <KNNDetector />
    </>
  )
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)