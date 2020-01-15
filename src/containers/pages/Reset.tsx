import * as React from 'react';
import {Link} from "react-router-dom";
import {domains, model} from "../../constants/api";
import AuthContainer from '../organisms/AuthContainer';

const ResetPage:any = () => {

  const onClickReset = () => {
    domains.doc('CI_ELvKrdqg').update({
      supporters: []
    });
    domains.get()
      .then((snapshot:any)=>{
        snapshot.docs.map((doc:any, i:number) => {
          domains.doc(doc.id).update({
            hero: ""
          })
        })
      })
    model.doc('map').update({
      data: "{dataset:{}, tensors:[]}"
    })
  }



  return (
    <div>
      <h1>Reset page</h1>
      <AuthContainer />
      <button onClick={() => onClickReset()}>ResetAll</button>
      <Link to="/">home</Link>
    </div>
  )
}

export default ResetPage