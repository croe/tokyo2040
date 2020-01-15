import * as React from 'react'
import actionCreatorFactory from 'typescript-fsa'
import {ReduxState} from '../constants/store'
import {AuthActions} from "../containers/organisms/AuthContainer";
import {reducerWithInitialState} from "typescript-fsa-reducers";

// action
const actionCreator = actionCreatorFactory();

export const missionActions = {
  set: actionCreator<MissionInfo>('mission/set'),
};

// reducer
export interface MissionInfo {
  missions?: any
}

const initialState:MissionInfo = {}

export const missionReducer = reducerWithInitialState<MissionInfo>(initialState)
  .case(missionActions.set, ({}, amount) => {
    return Object.assign({}, amount);
  })