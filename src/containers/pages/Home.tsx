import * as React from 'react';
import AuthContainer from '../organisms/AuthContainer';
import {Link} from "react-router-dom";
import tiger from '../../tiger.jpg'
const ml5 = require('ml5');

class Home extends React.Component {

  classifyImg:any = () => {
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

  public componentDidMount(){
    // once the component has mount, start the classification
    this.classifyImg();
  }


  public render(){
    return (
      <div>
        <h1>Home page</h1>
        <AuthContainer />
        <img src={tiger} width="400" id="image" alt=""/>
        <Link to="/about">about</Link>
      </div>
    )
  }
}

export default Home