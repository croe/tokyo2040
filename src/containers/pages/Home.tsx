import React, {useCallback, useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import {ReduxState} from "../../constants/store";
import {connect} from "react-redux";
import {blocks, domains, missions} from "../../constants/api";
import {Action, Dispatch} from "redux";
import firebase from '../../constants/firebase';
import {authActions} from "../../modules/Auth";
import {setUserInfo} from "../organisms/AuthContainer";
import CountdownTimer from '../../components/molecules/CountdownTimer';
import KNNDetector from '../../components/molecules/KNNdetector';
import Modal from 'react-modal';

Modal.setAppElement("#root");

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
  const [fdomain, setDomains]:any = useState([]);
  const [fmission, setFMissions]:any = useState([]);
  const [mystatus, setMyStatus]:any = useState({
    proved: 0
  });
  const [mission, setMissions]:any = useState([]);

  // FIXME: ほんとはReduxにしたい
  const detectLabel = useCallback((detected:any) => {
    // Mission名が渡ってくるので、現状のmissionと紐付ける。
    console.log(fmission);
    setMissions(detected);
  }, [fmission]);

  useEffect(() => {
    const blockchainObserver:any = blocks.onSnapshot((doc: any) => {
      const data:any = doc.data();
      setBlock(data);
    });
    return blockchainObserver;
  },[]);

  useEffect(() => {
    const domainsObserver: any = domains.onSnapshot((snapshot: any) => {
      const docs:any = snapshot.docs.map((doc:any, i:number) => doc.data());
      setDomains(docs);
      console.log(docs);
    });
    return domainsObserver;
  },[]);

  useEffect(() => {
    const missionsObserver:any = missions.onSnapshot((snapshot: any) => {
      const docs:any = snapshot.docs.map((doc:any, i:number) => doc.data());
      setFMissions(docs);
      console.log(docs);
    });
    return missionsObserver;
  }, []);

  useEffect(() => {
    props.refLogin!()
  },[]);

  // TODO: Domainのsuppportersをmapして自分の実績を把握する。

  return (
    <>
      <h1>Home page - You: {props.userInfo.displayName} -</h1>
      <h2>Blockcount: {block.height} </h2>
      <Link to="/signin">signin</Link><br/>
      <Link to="/mission">mission</Link>
      <CountdownTimer {...block} />
      <KNNDetector callback={detectLabel} />
    </>
  )
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)