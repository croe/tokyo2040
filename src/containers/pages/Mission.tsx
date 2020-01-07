import React,{useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import MissionCard from '../../components/molecules/MissionCard';
import {missions} from "../../constants/api";
const QrReader = require('react-qr-reader');

const Mission: any = () => {

  const [mission, setMissions]:any = useState([]);

  useEffect(() => {
    const missionsObserver: any = missions.onSnapshot((snapshot) => {
      const docs:any = snapshot.docs.map((doc, i) => doc.data())
      setMissions(docs);
    });
    return missionsObserver;
  },[]);

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
            <MissionCard key={`mis_${i}`} {...mis} />
          )
        })
      }
      <QrReader delay={300} onScan={handleScan} onError={handleError}/>
    </>
  );

}

export default Mission