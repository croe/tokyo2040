import React, {useEffect, useState} from 'react';
import moment from 'moment';

const CountdownTimer = (props:any) => {

  const calculateTimeLeft = () => {
    let now:any = moment().format('X')
    let timeLeft:any = 0;
    if (props.timestamp) {
      timeLeft = 60 - (+now - +moment(props.timestamp).format('X'));
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
    <div>
      <h2>With React Hooks!</h2>
      {timeLeft}
    </div>
  );

}

export default CountdownTimer