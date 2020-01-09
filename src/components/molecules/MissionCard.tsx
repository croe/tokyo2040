import React from 'react';
import styled from 'styled-components';
import color from '../../constants/colors';
import Poster from '../atoms/Poster';
import Resource from '../atoms/Resource';
import Heading1 from '../atoms/Heading1';
import Heading2 from '../atoms/Heading2';
import {range} from 'lodash';

const MissionCard = (props:any) => {

  return (
    <CardContainer {...props} >
      <Poster poster={props.poster} />
      <ResourceContainer>
        {
          range(props.costStr).map((num, i) => {
            return ( <Resource type="1" key={`rescon1_${i}`} /> )
          })
        }
        {
          range(props.costInt).map((num, i) => {
            return ( <Resource type="2" key={`rescon2_${i}`} /> )
          })
        }
      </ResourceContainer>
      <Heading2><ruby>{props.alartName}<rt>{props.alartNameSub}</rt></ruby></Heading2>
      <Heading1>{props.placeName}</Heading1>
    </CardContainer>
  )
}

const CardContainer = styled.div`
  margin: 10px 0;
  padding: 20px;
  box-shadow: 0 0 3px ${color.shadow.primary};
  border-radius: 8px;
  backdrop-filter: blur(3px);
  background-color: ${color.background.glass};
  color: ${props => getLevelColor(props)};
`;

const ResourceContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0;
`;

const getLevelColor = (props: any) => {
  switch (props.level) {
    case 1: return color.text.level1;
    case 2: return color.text.level2;
    case 3: return color.text.level3;
  }
};

export default MissionCard