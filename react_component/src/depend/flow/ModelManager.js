/**
 * Created by zhaoxi on 2017/12/6.
 */

const MODELS = {};
const REDUCER = {};

// reducer
const createReducer = model => (state = model.state, action) => {
    const {reducers, namespace} = model;

    // const type = action.type.slice(namespace.length + 1,);
    // if (action.type.startsWith(`${namespace}/`) && reducers.hasOwnProperty(type)) {
    //     return reducers[type](state, action);
    // } else {
    //     return state;
    // }
    if (!action.hasOwnProperty("type")) {
        return state;
    }
    if (action.type.indexOf("/") < 0) {
        return state;
    }
    const tmp = action.type.split("/");
    const type = tmp[1];
    if (tmp[0] === namespace && reducers.hasOwnProperty(type)) {
        return reducers[type](state, action);
    } else {
        return state;
    }
};

const asyncTaskMiddleware = ({dispatch}) => next => action => {
    const tmp = action.type.split("/");
    if (Array.isArray(tmp) && tmp.length === 2) {
        const namespace = tmp[0];
        const asyncTask = tmp[1];
        //若action对应的是model中的asyncTasks的方法，调用该方法
        if (
            MODELS.hasOwnProperty(namespace) &&
            MODELS[namespace].asyncTasks.hasOwnProperty(asyncTask)
        ) {
            MODELS[namespace].asyncTasks[asyncTask]({dispatch}, action);
        }
    }
    return next(action);
};

function addModel(model) {
    MODELS[model.namespace] = model;
}

function addReducer(model) {
    REDUCER[model.namespace] = createReducer(model);
}

function useModel(model) {
    addModel(model);
    addReducer(model);
}

function getReducer() {
    return REDUCER;
}

function getAsyncTaskMiddleware() {
    return asyncTaskMiddleware;
}

export default {
    useModel,
    getReducer,
    getAsyncTaskMiddleware
};
