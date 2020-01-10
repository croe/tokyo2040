import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import MissionCard from '../../components/molecules/MissionCard';
import {missions} from "../../constants/api";
const QrReader = require('react-qr-reader');

const Mission: any = (props: any) => {

  const [mission, setMissions]:any = useState([]);

  useEffect(() => {
    const missionsObserver: any = missions.onSnapshot((snapshot) => {
      const docs:any = snapshot.docs.map((doc, i) => doc.data())
      setMissions(docs);
    });
    return missionsObserver;
  },[]);

  const handleClickMissionCard = (mission: any) => {
    console.log(mission);
    // 信用度（実績）によって受けられるミッションが変化。これは明示的リセットでも良いし、時間経過リセットでも良い
    // 受けられる・受けられない（活性・非活性）
  }

  const handleScan = (data:any) => {
    if (data) {
    console.log(data);
    }
  }

  const handleError = (err:any) => {
    console.error(err)
  }

  return (
    <>
      <Link to="/">home</Link>
      <h1>Mission page</h1>
      {
        mission.map((mis: any, i: number) => {
          return (
            <MissionCard key={`mis_${i}`} {...mis} onClick={() => handleClickMissionCard(mis)} />
          )
        })
      }
    </>
  );

}

export default Mission