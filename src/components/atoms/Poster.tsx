import styled from 'styled-components';
import illust1 from './poster/illust1.svg';

const Poster = styled.span`
  display: block;
  width 100%;
  height: 200px;
  background-image: url(${illust1});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
`;

export default Poster;