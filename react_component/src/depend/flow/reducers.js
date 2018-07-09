/**
 * Created by zhaoxi on 2017/12/7.
 */
import {combineReducers} from 'redux';

import modelManager from './ModelManager';

export default function createReducer() {
    return combineReducers({
        ...modelManager.getReducer()
    });
}