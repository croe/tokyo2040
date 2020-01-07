import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import color from '../../constants/colors';
import Poster from '../atoms/Poster';
import Resource from '../atoms/Resource';
import Heading1 from '../atoms/Heading1';
import Heading2 from '../atoms/Heading2';

const MissionCard = () => {
  return (
    <CardContainer>
      <Poster />
      <Resource />
      <Heading2><ruby>accident<rt>事故予測</rt></ruby></Heading2>
      <Heading1>SHIBUYA</Heading1>
    </CardContainer>
  )
}

const CardContainer = styled.div`
  padding: 20px;
  border: 1px solid ${color.border.primary};
  border-radius: 8px;
  backdrop-filter: blur(3px);
`;

export default MissionCard