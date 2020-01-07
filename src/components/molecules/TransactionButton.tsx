import React from 'react';
import styled from 'styled-components';
import color from '../../constants/colors';
import Camera from '../../components/atoms/Camera';

const TransactionButton = (props: any) => {

  return (
    <Button><Camera /></Button>
  )

};

const Button = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${color.background.secondary};
  box-shadow: 0 0 3px ${color.shadow.primary};
`;

export default TransactionButton