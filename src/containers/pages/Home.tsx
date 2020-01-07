import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import tiger from '../../tiger.jpg'
import {ReduxState} from "../../constants/store";
import {connect} from "react-redux";
import {blocks} from "../../constants/api";
import {Action, Dispatch} from "redux";
import firebase from '../../constants/firebase';
import {authActions} from "../../modules/Auth";
import {setUserInfo} from "../organisms/AuthContainer";
import CountdownTimer from '../../components/molecules/CountdownTimer';
const ml5 = require('ml5');

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

  useEffect(() => {
    const blockchainObserver:any = blocks.onSnapshot((doc) => {
      const data:any = doc.data();
      setBlock(data);
    });
    return blockchainObserver;
  },[]);

  useEffect(() => {
    props.refLogin!()
  },[]);

  useEffect(() => {
    const classifyImg = () => {
      // Initialize the Image Classifier method with MobileNet
      const classifier = ml5.imageClassifier('MobileNet', modelLoaded);
      // When the model is loaded
      function modelLoaded() {
        console.log('Model Loaded!');
      }
      // Put the image to classify inside a variable
      const image = document.getElementById('image');
      // Make a prediction with a selected image
      classifier.predict(image, 5, function(err:any, results:any) {
        // print the result in the console
        console.log(results);
      })
    }
    classifyImg();
  },[]);

  return (
    <>
      <h1>Home page - You: {props.userInfo.displayName} -</h1>
      <h2>Blockcount: {block.height} </h2>
      <img src={tiger} width="400" id="image" alt=""/>
      <Link to="/signin">signin</Link><br/>
      <Link to="/mission">mission</Link>
      <CountdownTimer {...block} />
    </>
  )
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)