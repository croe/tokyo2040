import React, {useEffect, useState} from 'react';
import moment from 'moment';
import styled from 'styled-components';

const CountdownTimer = (props:any) => {

  const calculateTimeLeft = () => {
    let now:any = moment().format('X')
    let timeLeft:any = 0;
    if (props.timestamp) {
      timeLeft = 120 - (+now - +moment(props.timestamp).format('X'));
    }
    /**
     * 5秒に一度？（処理速度による）AIが自動動作する
     * この時に撮影する写真はボード全体を意識的にとるようにするのか
     */
    if ((timeLeft % 10) === 0){
      if (props.knnComp.current) {
        props.knnComp.current.getClassify();
      }
    }
    if (timeLeft === 119) {
      if (props.knnComp.current) {
        props.knnComp.current.learningMap();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 500);
      }
    }
    return timeLeft
  };

  const [timeLeft, setTimeLeft]:any = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  return (
    <p>Next: <Timer time={timeLeft}>{timeLeft}</Timer> sec.</p>
  );

}

const Timer = styled.span<any>`
  font-size: 20px;
  color: ${props => getTimerStyle(props)};
`;

const getTimerStyle = (props:any) => {
  if (props.time < 10) {
    return 'red';
  } else {
    return 'black';
  }
}


export default CountdownTimer