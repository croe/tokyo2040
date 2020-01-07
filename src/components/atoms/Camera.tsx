import styled from 'styled-components';
import camera from './resource/camera.png';

const Camera = styled.span<any>`
  display: block;
  width 30px;
  height: 30px;
  background-image: url(${camera});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

export default Camera;