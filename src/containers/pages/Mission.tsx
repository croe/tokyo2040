import * as React from 'react';
import {Link} from "react-router-dom";
import MissionCard from '../../components/molecules/MissionCard';

const Mission:any = () => (
  <>
    <h1>Mission page</h1>
    <MissionCard />
    <Link to="/">home</Link>
  </>
);

export default Mission