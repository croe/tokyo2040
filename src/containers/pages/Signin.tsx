import * as React from 'react';
import {Link} from "react-router-dom";
import AuthContainer from '../organisms/AuthContainer';

const Signin:any = () => (
  <div>
    <h1>Sign page</h1>
    <AuthContainer />
    <Link to="/">home</Link>
  </div>
)

export default Signin