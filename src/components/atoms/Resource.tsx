import styled from 'styled-components';
import icon1 from './resource/icon1.svg';
import icon2 from './resource/icon2.svg';

const Resource = styled.span<any>`
  display: block;
  width 50px;
  height: 50px;
  background-image: url(${props => getType(props)});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
`;

const getType = (props: any) => {
  switch (props.type) {
    case "1": return icon1;
    case "2": return icon2;
  }
}

export default Resource;