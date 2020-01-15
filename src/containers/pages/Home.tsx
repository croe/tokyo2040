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

const Home = (props: any) => {

  const [block, setBlock]:any = useState([]);
  const [fdomain, setDomains]:any = useState([]);
  const [myMissions, setMyMissions]:any = useState([]);
  const [detectedDomain, setDetectedDomain]:any = useState("");
  const [selectedToken, setTokens]:any = useState([]);
  const [MyPoint, setMyPoint]:any = useState(0);
  const [isTxModal, setIsTxModal]:any = useState(false);

  const onClickOpenTxModal = useCallback(()=>{setIsTxModal(true)},[]);
  const onClickCloseTxModal = useCallback(()=>{setIsTxModal(false)},[]);

  const KnnRef:any = useRef();


  // FIXME: ほんとはReduxにしたい
  const detectLabel = (detected:any) => {
    setDetectedDomain(filter(missionsList, (o:any) => o.placeName === detected));
  };

  const handleClickMissionCard = useCallback((mission: any) => {
    Swal.fire({
      title: 'Mission!',
      text: `このミッションに挑戦しますか？`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'はい',
      cancelButtonText: 'いいえ'
    }).then((result:any) => {
      if (result.value) {
        Swal.fire({
          title: 'Mission!',
          text: `${mission.mission}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '成功!',
          cancelButtonText: '失敗..'
        }).then((result:any) => {
          if (result.value) {
            // TODO: 成功した場合、
            const point:any = () => { switch(mission.level) {
              case 1: return 5;
              case 2: return 10;
              case 3: return 20;
            }}
            Swal.fire(
              'Congratulations!',
              `${point()}ポイントを獲得しました`,
              'success'
            );
            const newMyMissions = filter(myMissions, (o:any) => o !== mission);
            setMyMissions(newMyMissions);
            domains.where('placeName', '==', mission.placeName).get()
              .then((snapshot:any) => {
                domains.doc(snapshot.docs[0].id).update({
                  hero: props.userInfo.uid
                })
              });
          }
        })
      }
    })
  }, [myMissions]);

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
  }, [detectedDomain]);

  const toggleTxModal = () => {
    if (isTxModal) {
      onClickCloseTxModal();
    } else {
      onClickOpenTxModal();
    }
  }

  const handleScan = (data:any) => {
    // Token を渡す前の処理（自分が持っていた記録）
    // これは無条件に実績になる。（使われたかどうかは関係なく）
    if (data) {
      domains.doc('CI_ELvKrdqg').get()
        .then((doc:any) => {
          // 現在の最新をとってきて新しい歴史を刻む
          let newHistory:any = doc.data().supporters;
          newHistory.push(props.userInfo.uid);
          domains.doc('CI_ELvKrdqg').update({
            supporters: newHistory
          });
          console.log(newHistory);
          Swal.fire('Recorded!', 'あなたの手助けがブロックチェーンに記録され評価が上昇しました','success');
          onClickCloseTxModal();
        })
    }
  }

  const handleError = (err:any) => {
    console.error(err)
  }

  // TODO: Domainのsuppportersをmapして自分の実績を把握する。

  return (
    <HomeContainer>
      <HomeHeader>
        <H2>{block.height} Block. </H2><ToNext>→→→ </ToNext><CountdownTimer {...block} knnComp={KnnRef} />
        <H2> {MyPoint}pt</H2>
      </HomeHeader>
      <KNNDetector callback={detectLabel} ref={KnnRef} />
      {
        myMissions.map((mis:any, i:number) => {
          return (
            <MissionCard key={`mis_${i}`} {...mis} onClick={() => handleClickMissionCard(mis) } />
          )
        })
      }
      <TxOpenButton onClick={toggleTxModal}><HandIcon /></TxOpenButton>
      <Modal isOpen={isTxModal} style={customStyles2}>
        <ModalContainer>
          <TxCloseButton onClick={onClickCloseTxModal} />
          <QrReader delay={300} onScan={handleScan} onError={handleError} />
        </ModalContainer>
      </Modal>
    </HomeContainer>
  )
};

const customStyles2 = {
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

const HomeContainer = styled.div`
  padding: 50px 0 0;
`

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


const ModalContainer = styled.div`
  position: relative;
  width: 320px;
  padding: 20px;
`;

const TxOpenButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 90px;
  width: 60px;
  height: 60px; 
  border-radius: 50%;
  background-color: ${color.background.glass};
  backdrop-filter: blur(20px);
  color: ${color.text.primary};
  overflow: hidden;
  z-index: 100;
  font-size: 20px;
`;

const TxCloseButton = styled.button`
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

const HandIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 25px;
  background-image: url(${Hand});
  background-size: contain;
  background-repeat: no-repeat;
`;


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)