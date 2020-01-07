import styled from 'styled-components';
import icon1 from './resource/icon1.svg';
import icon2 from './resource/icon2.svg';

const Resource = styled.span`
  display: block;
  width 50px;
  height: 50px;
  background-image: url(${icon1});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
`;

export default Resource;