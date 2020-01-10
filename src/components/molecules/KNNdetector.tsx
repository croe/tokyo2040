import React, {useCallback, useEffect, useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import {domains, model} from "../../constants/api";
import Modal from "react-modal";
import styled from "styled-components";
import color from "../../constants/colors";

const Sketch = require('react-p5');
const QrReader = require('react-qr-reader');
const ml5 = require('ml5');

const KNNDetector = (props:any) => {

  const [knnClassifier, initializeKNN]:any = useState(ml5.KNNClassifier());
  const [featureExtractor, initializeFE]:any = useState({});
  const [video, initVideo]:any = useState({});
  const [result, setResult]:any = useState("");
  const [knnData, setKnnData]:any = useState("");
  const [selectedDomain, setSelectedDomain]:any = useState("");
  const [isSelectModal, setIsSelectModal]:any = useState(false);
  const [isKNNModal, setIsKNNModal]:any = useState(true);

  const handleClickOpenSelectedModal = useCallback(() => {setIsSelectModal(true);}, []);
  const handleClickCloseSelectedModal = useCallback(() => {setIsSelectModal(false);}, []);
  const handleClickOpenKNNModal = useCallback(() => {setIsKNNModal(true)},[]);
  const handleClickCloseKNNModal = useCallback(() => {setIsKNNModal(false)},[]);

  const setup = (p: any) => {
    initializeFE(ml5.featureExtractor('MobileNet', modelReady));
    initVideo(p.createCapture(p.VIDEO));
    // initVideo(p.createCapture({
    //   audio: false,
    //   video: {
    //     facingMode: {
    //       exact: "environment"
    //     }
    //   }
    // }).size(320, 320));
  };

  const modelReady = () => {
    console.log('model loaded',video);
  };

  const addExample = useCallback(() => {
    console.log(featureExtractor, selectedDomain);
    if (selectedDomain) {
      const features = featureExtractor.infer(video);
      const label:string = selectedDomain;
      knnClassifier.addExample(features, label);
    }
  }, [featureExtractor, selectedDomain]);

  const classify = useCallback(() => {
    const numLabels = knnClassifier.getNumLabels();
    if (numLabels <= 0) {
      console.error('There is no examples in any label');
      return;
    }

    const features = featureExtractor.infer(video);
    knnClassifier.classify(features, gotResults);
  }, [knnClassifier, featureExtractor, video]);

  const gotResults = (err: any, result: any) => {
    console.log(knnClassifier.mapStringToIndex);
    if (err) {
      console.error(err);
    }

    if (result.confidencesByLabel) {
      const confidences = result.confidencesByLabel;

      if (result.label) {
        if (result.label.length < 3) {
          console.log(result);
          const labelToNum = +result.label;
          const numToLabel = knnClassifier.mapStringToIndex[labelToNum];
          setResult(`${numToLabel}: ${confidences[numToLabel] * 100} %`);
          props.callback(numToLabel);
        } else {
          console.log(result);
          setResult(`${result.label}: ${confidences[result.label] * 100} %`);
          props.callback(result.label);
        }
      }
      // classify();
    }
  };

  const save = useCallback(() => {
    const dataset = knnClassifier.getClassifierDataset();
    console.log(dataset);
    if (knnClassifier.mapStringToIndex.length > 0) {
      Object.keys(dataset).forEach((key) => {
        if (knnClassifier.mapStringToIndex[key]) {
          dataset[key].label = knnClassifier.mapStringToIndex[key];
        }
      });
    }
    const tensors = Object.keys(dataset).map((key) => {
      const t = dataset[key];
      if (t) {
        return t.dataSync();
      }
      return null;
    });
    const modelData = JSON.stringify({ dataset, tensors });
    setKnnData(modelData);
    model.doc("map").update({data: modelData});
  }, [knnClassifier, setKnnData]);

  const load = useCallback(() => {
    model.doc("map").get().then((data: any) => {
      const { dataset, tensors } = JSON.parse(data.data().data);
      console.log(dataset, tensors, Object.keys(dataset).map(key => dataset[key].label));
      knnClassifier.mapStringToIndex = Object.keys(dataset).map(key => dataset[key].label);
      const tensorsData = tensors
        .map((tensor: any, i: number) => {
          if (tensor) {
            const values = Object.keys(tensor).map(v => tensor[v]);
            return tf.tensor(values, dataset[i].shape, dataset[i].dtype);
          }
          return null;
        })
        .reduce((acc: any, cur: any, j: any) => {
          acc[j] = cur;
          return acc;
        }, {});
      knnClassifier.setClassifierDataset(tensorsData);
    });
  }, [knnClassifier, knnData]);

  const handleClickClearAllLabel = useCallback(() => {
    knnClassifier.clearAllLabels();
  }, [knnClassifier, knnData]);

  useEffect(() => {
    const mapModelObserver: any = model.doc("map").onSnapshot((doc: any) => {
      if (doc.data().data) {
        const { dataset, tensors } = JSON.parse(doc.data().data);
        knnClassifier.mapStringToIndex = Object.keys(dataset).map(key => dataset[key].label);
        console.log(knnClassifier.mapStringToIndex);
        const tensorsData = tensors
          .map((tensor: any, i: number) => {
            if (tensor) {
              const values = Object.keys(tensor).map(v => tensor[v]);
              return tf.tensor(values, dataset[i].shape, dataset[i].dtype);
            }
            return null;
          })
          .reduce((acc: any, cur: any, j: any) => {
            acc[j] = cur;
            return acc;
          }, {});
        knnClassifier.setClassifierDataset(tensorsData);
        console.log(knnClassifier.getCount());
      }
    });
    return mapModelObserver;
  }, [])

  const customStyles = {
    overlay: {
      backgroundColor : "transparent"
    },
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      zIndex                : '1000'
    }
  };

  const toggleKNNModal = () => {
    handleClickCloseSelectedModal();
    if (isKNNModal) {
      handleClickCloseKNNModal();
    } else {
      handleClickOpenKNNModal();
    }
  };

  const toggleSelectModal = () => {
    handleClickCloseKNNModal();
    if (isSelectModal) {
      handleClickCloseSelectedModal();
    } else {
      handleClickOpenSelectedModal();
    }
  };

  const handleScan = (data:any) => {
    if (data) {
      domains.doc(data).get()
        .then((doc:any) => {
          setSelectedDomain(doc.data().placeName);
          handleClickCloseSelectedModal();
        });
    }
  }

  const handleError = (err:any) => {
    console.error(err)
  }

  return (
    <>
      <Modal isOpen={isKNNModal}
             style={customStyles}
      >
        <h2>KNN Detector</h2>
        <button onClick={addExample}>Training</button>
        <button onClick={classify}>Start</button>
        <button onClick={handleClickClearAllLabel}>Clear</button>
        <button onClick={save}>Save</button>
        <button onClick={load}>Load</button>
        <p>{result}</p>
        <Sketch setup={setup} />
      </Modal>
      <Modal isOpen={isSelectModal}
             style={customStyles}
      >
        <ModalContainer>
          <TrainingCloseButton onClick={handleClickCloseSelectedModal} />
          <QrReader delay={300} onScan={handleScan} onError={handleError} />
        </ModalContainer>
      </Modal>
      <DomainSelectOpenButton onClick={toggleKNNModal}/>
      <TrainingOpenButton onClick={toggleSelectModal} />
    </>
  );

};

const ModalContainer = styled.div`
  position: relative;
  width: 320px;
  padding: 20px;
`;

const TrainingCloseButton = styled.button`
  position: absolute;
  width: 30px;
  height: 30px;
  top: -10px;
  right: -10px;
  background-color: ${color.background.secondary};
  border-radius: 50%;
  z-index: 100;
  &:after {
    content: "×";
    color: ${color.text.white1};
    font-size: 20px;
    font-weight: bold;
  }
`;

const DomainSelectOpenButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 90px;
  width: 60px;
  height: 60px; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${color.background.secondary};
  box-shadow: 0 0 3px ${color.shadow.primary};
  overflow: hidden;
  z-index: 100;
`;

const TrainingOpenButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${color.background.secondary};
  box-shadow: 0 0 3px ${color.shadow.primary};
  overflow: hidden;
  z-index: 100;
`;

export default KNNDetector