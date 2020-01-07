import styled from 'styled-components';
import illust1 from './poster/illust1.svg';
import illust2 from './poster/illust2.svg';
import illust3 from './poster/illust3.svg';
import illust4 from './poster/illust4.svg';
import illust5 from './poster/illust5.svg';
import illust6 from './poster/illust6.svg';
import illust7 from './poster/illust7.svg';
import illust8 from './poster/illust8.svg';
import illust9 from './poster/illust9.svg';
import illust10 from './poster/illust10.svg';
import illust11 from './poster/illust11.svg';
import illust12 from './poster/illust12.svg';
import illust13 from './poster/illust13.svg';
import illust14 from './poster/illust14.svg';
import illust15 from './poster/illust15.svg';
import illust16 from './poster/illust16.svg';
import illust17 from './poster/illust17.svg';
import illust18 from './poster/illust18.svg';
import illust19 from './poster/illust19.svg';
import illust20 from './poster/illust20.svg';
import illust21 from './poster/illust21.svg';
import illust22 from './poster/illust22.svg';
import illust23 from './poster/illust23.svg';
import illust24 from './poster/illust24.svg';

const Poster = styled.span<any>`
  display: block;
  width 100%;
  height: 200px;
  background-image: url(${props => getImage(props)});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
`;

const getImage = (props:any) => {
  switch (props.poster) {
    case 1: return illust1;
    case 2: return illust2;
    case 3 : return illust3 ;
    case 4 : return illust4 ;
    case 5 : return illust5 ;
    case 6 : return illust6 ;
    case 7 : return illust7 ;
    case 8 : return illust8 ;
    case 9 : return illust9 ;
    case 10: return illust10;
    case 11: return illust11;
    case 12: return illust12;
    case 13: return illust13;
    case 14: return illust14;
    case 15: return illust15;
    case 16: return illust16;
    case 17: return illust17;
    case 18: return illust18;
    case 19: return illust19;
    case 20: return illust20;
    case 21: return illust21;
    case 22: return illust22;
    case 23: return illust23;
    case 24: return illust24;
  }
}

export default Poster;