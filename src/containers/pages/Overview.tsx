import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Link} from "react-router-dom";
import {ReduxState} from "../../constants/store";
import H2 from '../../components/atoms/Heading2';
import {connect} from "react-redux";
import {blocks, domains, tokens} from "../../constants/api";
import {Action, Dispatch} from "redux";
import firebase from '../../constants/firebase';
import {authActions} from "../../modules/Auth";
import {setUserInfo} from "../organisms/AuthContainer";
import CountdownTimer from '../../components/molecules/CountdownTimer';
import KNNDetector from '../../components/molecules/KNNdetector';
import Modal from 'react-modal';
import {missionActions} from "../../modules/Mission";
import missionsList from '../../constants/missions.json';
import MissionCard from '../../components/molecules/MissionCard';
import {filter, uniq} from 'lodash';
import styled from "styled-components";
import color from "../../constants/colors";
import Hand from "../../components/atoms/resource/hand.png";

const QrReader = require('react-qr-reader');
const Swal = require('sweetalert2');

Modal.setAppElement("#root");

function mapStateToProps(state: ReduxState) {
  return Object.assign({}, {
    userInfo: state.userInfo,
    missionInfo: state.missionInfo
  });
}
function mapDispatchToProps(dispatch: Dispatch<Action<string>>) {
  return {
    refLogin: () => {
      firebase.auth().onAuthStateChanged(user => {
        if (!user) {return}
        dispatch(authActions.login(setUserInfo(user)));
      })
    },
    set: (data:any) => {
      dispatch(missionActions.set(data));
    }
  }
}

const Overview = (props: any) => {

  const [block, setBlock]:any = useState([]);
  const [fdomain, setDomains]:any = useState([]);
  const [myMissions, setMyMissions]:any = useState([]);
  const [detectedDomain, setDetectedDomain]:any = useState("");
  const [MyPoint, setMyPoint]:any = useState(0);
  const [mapModel, setMapModel]:any = useState([]);

  const KnnRef:any = useRef();

  // FIXME: ほんとはReduxにしたい
  const detectLabel = (detected:any) => {
    setDetectedDomain(filter(missionsList, (o:any) => o.placeName === detected));
  };

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
      let points:number = 0;
      const hero:any = filter(docs, (o:any) => o.hero === props.userInfo.uid);
      hero.map((item:any) => {
        switch (item.level) {
          case 1: points += 5; break;
          case 2: points += 10; break;
          case 3: points += 20; break;
          default: return;
        }
      });
      setMyPoint(points);
      setDomains(docs);
    });
    return domainsObserver;
  },[props]);

  useEffect(() => {
    props.refLogin!()
    console.log(props);
  },[]);

  useEffect(() => {
    domains.doc('CI_ELvKrdqg').get().then((doc:any) => {
      if (detectedDomain.length > 0) {
        if (filter(doc.data().supporters, (o:any) => o === props.userInfo.uid).length >= (detectedDomain[0].level ** 2 - 1)) {
          setMyMissions(uniq([...myMissions, ...detectedDomain]));
        }
      }
    })
    setMapModel(KnnRef.current.getCountByLabel())
  }, [detectedDomain]);

  useEffect(() => {
    console.log(mapModel)
  },[mapModel]);

  return (
    <HomeContainer>
      <HomeHeader>
        <H2><PointVal>{block.height}</PointVal> Block. </H2><ToNext>→→→ </ToNext><CountdownTimer {...block} knnComp={KnnRef} />
        <H2><PointVal>{MyPoint}</PointVal> pt</H2>
      </HomeHeader>
      <KNNDetector callback={detectLabel} ref={KnnRef} />
      <LabelContainer>
        {
          Object.keys(mapModel).map((label:any, i:number) => {
            return (
              <MapLabel key={`mm_${i}`}>{label}: {mapModel[label]}</MapLabel>
            )
          })
        }
      </LabelContainer>
      <DomainContainer>
        {
          fdomain.map((dom:any, i:number) => {
            return (
              <DomainList key={`dl_${i}`}>{dom.placeName}: <span>{dom.heroName}</span></DomainList>
            )
          })
        }
      </DomainContainer>
    </HomeContainer>
  )
};

const PointVal = styled.span`
  font-size: 20px;
`;

const HomeContainer = styled.div`
  padding: 50px 0 0;
  display: flex;
`;

const ToNext = styled.span`
  font-family: canada-type-gibson, sans-serif;
  color: ${color.text.primary};
`;

const HomeHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  font-family: canada-type-gibson, sans-serif;
  background-color: ${color.background.glass};
  backdrop-filter: blur(20px);
  color: ${color.text.primary};
  z-index: 100;
  box-shadow: 0 0 3px ${color.shadow.primary};
  font-size: 16px;
  justify-content: space-around;
  align-items: center;
`;

const LabelContainer = styled.div`
  width: 50%;
  margin: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
`;

const MapLabel = styled.p`
  font-size: 24px;
`;

const DomainContainer = styled.div`
  width: 50%;
  margin: 10px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
`;

const DomainList = styled.p`
  font-size: 24px;
`;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview)