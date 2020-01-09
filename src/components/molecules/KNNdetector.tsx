import React, {useCallback, useEffect, useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import {model} from "../../constants/api";

const Sketch = require('react-p5');
const ml5 = require('ml5');

const KNNDetector = (props:any) => {

  const [knnClassifier, initializeKNN] = useState(ml5.KNNClassifier());
  const [result, setResult]:any = useState("");
  const [knnData, setKnnData]:any = useState("");

  let video: any;
  let featureExtractor: any;

  const setup = (p: any) => {
    featureExtractor  = ml5.featureExtractor('MobileNet', modelReady);
    // video = p.createCapture({
    //   audio: false,
    //   video: {
    //     facingMode: {
    //       exact: "environment"
    //     }
    //   }
    // });
    video = p.createCapture(p.VIDEO);
  };

  const modelReady = () => {
    console.log('model loaded',video);
  };

  const addExample = (label: string) => {
    const features = featureExtractor.infer(video);
    knnClassifier.addExample(features, label);
  };

  const classify = () => {
    const numLabels = knnClassifier.getNumLabels();
    if (numLabels <= 0) {
      console.error('There is no examples in any label');
      return;
    }

    const features = featureExtractor.infer(video);
    knnClassifier.classify(features, gotResults);
  };

  const gotResults = (err: any, result: any) => {
    if (err) {
      console.error(err);
    }

    if (result.confidencesByLabel) {
      const confidences = result.confidencesByLabel;

      if (result.label) {
        console.log(result.label, `${confidences[result.label] * 100} %`);
        setResult(`${result.label}: ${confidences[result.label] * 100} %`);
      }
      // classify();
    }
  };

  const handleClickAddEx1 = useCallback(() => {
    addExample('map1');
  }, [featureExtractor])

  const handleClickAddEx2 = useCallback(() => {
    addExample('map2');
  }, [featureExtractor])

  const start = useCallback(() => {
    classify();
  }, []);

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
    model.update({data: modelData});
  }, [knnClassifier, setKnnData]);

  const load = useCallback(() => {
    model.get().then((data: any) => {
      const { dataset, tensors } = JSON.parse(data.data().data);
      console.log(dataset, tensors);
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
      console.log(knnClassifier.getCount());
    });
  }, [knnClassifier, knnData]);

  const handleClickClearAllLabel = useCallback(() => {
    knnClassifier.clearAllLabels();
  }, [knnClassifier, knnData]);

  useEffect(() => {
    const mapModelObserver: any = model.onSnapshot((doc: any) => {
      const { dataset, tensors } = JSON.parse(doc.data().data);
      console.log(dataset, tensors);
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
      console.log(knnClassifier.getCount());
    });
    return mapModelObserver;
  }, [])

  return (
    <>
      <h2>KNN Detector</h2>
      <button onClick={handleClickAddEx1}>add Ex1</button>
      <button onClick={handleClickAddEx2}>add Ex2</button>
      <button onClick={start}>Start</button>
      <button onClick={handleClickClearAllLabel}>Clear</button>
      <button onClick={save}>Save</button>
      <button onClick={load}>Load</button>
      <p>{result}</p>
      <Sketch setup={setup} />
    </>
  );

};

export default KNNDetector