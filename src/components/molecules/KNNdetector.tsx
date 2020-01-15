import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import {domains, model} from "../../constants/api";
import Modal from "react-modal";
import styled from "styled-components";
import color from "../../constants/colors";
import Mappin from "../../components/atoms/resource/mappin.png";
import Swal from 'sweetalert2';

const Sketch = require('react-p5');
const QrReader = require('react-qr-reader');
const ml5 = require('ml5');

const KNNDetector = forwardRef((props:any, ref:any) => {

  const [knnClassifier, initializeKNN]: any = useState(ml5.KNNClassifier());
  const [featureExtractor, initializeFE]: any = useState({});
  const [video, initVideo]: any = useState({});
  const [result, setResult]: any = useState("");
  const [knnData, setKnnData]: any = useState("");
  const [selectedDomain, setSelectedDomain]: any = useState("");
  const [isSelectModal, setIsSelectModal]: any = useState(false);
  const [isKNNModal, setIsKNNModal]: any = useState(true);

  const handleClickOpenSelectedModal = useCallback(() => { setIsSelectModal(true) }, []);
  const handleClickCloseSelectedModal = useCallback(() => { setIsSelectModal(false) }, []);
  const handleClickOpenKNNModal = useCallback(() => { setIsKNNModal(true) }, []);
  const handleClickCloseKNNModal = useCallback(() => { setIsKNNModal(false) }, []);

  useImperativeHandle(ref, () => ({
    getClassify() {
      classify()
    },
    learningMap() {
      addExample()
    }
  }));

  const setup = (p: any) => {
    initializeFE(ml5.featureExtractor('MobileNet', modelReady));
    initVideo(p.createCapture(
      {
        audio: false,
        video: {
          facingMode: {
            exact: "environment"
          }
        }
      }
      // p.VIDEO
      ).size(320, 320).addClass('knn_video').hide());
  };

  const modelReady = () => {
    console.log('model loaded', video);
  };

  const addExample = useCallback(() => {
    console.log(featureExtractor, selectedDomain);
    if (selectedDomain) {
      const features = featureExtractor.infer(video);
      const label: string = selectedDomain;
      knnClassifier.addExample(features, label);
      save();
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
    if (err) {
      console.error(err);
    }

    if (result.confidencesByLabel) {
      const confidences = result.confidencesByLabel;

      if (result.label) {
        if (result.label.length < 3) {
          const labelToNum = +result.label;
          const numToLabel = knnClassifier.mapStringToIndex[labelToNum];
          setResult(`${numToLabel}: ${confidences[numToLabel] * 100} %`);
          props.callback(numToLabel);
        } else {
          setResult(`${result.label}: ${confidences[result.label] * 100} %`);
          props.callback(result.label);
        }
      }
    }
  };

  const save = useCallback(() => {
    const dataset = knnClassifier.getClassifierDataset();
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
    // tensors.map((tensor:any,i:number) => {
    //   let t:any = {};
    //   t[i] = JSON.stringify(tensor);
    //   console.log(t);
    //   model.doc('map').update(t)
    // });
    console.log(knnClassifier.getCountByLabel());
    const modelData = JSON.stringify({dataset, tensors});
    setKnnData(modelData);
    model.doc("map").update({data: modelData});
    // model.doc("map").update({
    //   dataset: JSON.stringify(dataset),
    //   tensors: JSON.stringify(tensors)
    // });
  }, [knnClassifier, setKnnData]);

  useEffect(() => {
    const mapModelObserver: any = model.doc("map").onSnapshot((doc: any) => {
      if (doc.data().data) {
        const {dataset, tensors} = JSON.parse(doc.data().data);
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
        console.log(knnClassifier.getCountByLabel())
      }
    });
    return mapModelObserver;
  }, [knnClassifier]);

  const customStyles = {
    overlay: {
      backgroundColor: "transparent",
      width: '1px',
      height: '1px'
    },
    content: {
      width: '1px',
      height: '1px',
      padding: 0
    }
  };

  const customStyles2 = {
    overlay: {
      backgroundColor: "transparent"
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '1000'
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

  const handleScan = (data: any) => {
    if (data) {
      domains.doc(data).get()
        .then((doc: any) => {
          setSelectedDomain(doc.data().placeName);
          Swal.fire(
            'Pinned',
            `現在地を記録しました`,
            'success'
          );
          handleClickCloseSelectedModal();
        });
    }
  }

  const handleError = (err: any) => {
    console.error(err)
  }

  return (
    <>
      <Modal isOpen={isKNNModal}
             style={customStyles}
      >
        <Sketch setup={setup}/>
      </Modal>
      <Modal isOpen={isSelectModal}
             style={customStyles2}
      >
        <ModalContainer>
          <TrainingCloseButton onClick={handleClickCloseSelectedModal}/>
          <QrReader delay={300} onScan={handleScan} onError={handleError}/>
        </ModalContainer>
      </Modal>
      <TrainingOpenButton onClick={toggleSelectModal}><MappinIcon /></TrainingOpenButton>
    </>
  );

});

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

const TrainingOpenButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px; 
  border-radius: 50%;
  background-color: ${color.background.glass};
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${color.text.primary};
  overflow: hidden;
  z-index: 100;
  font-size: 20px;
`;

const MappinIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background-image: url(${Mappin});
  background-size: contain;
  background-repeat: no-repeat;
`;

export default KNNDetector