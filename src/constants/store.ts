import { combineReducers, createStore } from "redux"
import { UserInfo, authReducer } from "../modules/Auth";
import { MissionInfo, missionReducer} from "../modules/Mission";

export type ReduxState = {
  userInfo: UserInfo,
  missionInfo: MissionInfo
}

const store = createStore(
  combineReducers<ReduxState>({
    userInfo: authReducer,
    missionInfo: missionReducer
  })
)

export default store;