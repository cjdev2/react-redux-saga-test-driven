import * as R from 'ramda'
import {all, call, takeEvery} from "redux-saga/effects";
import {combineReducers} from "redux";
import {connect} from "react-redux";

const disallowDuplicateKey = (key, left, right) => {
    throw Error(`duplicate key '${key}'`)
}

const pairToObject = R.apply(R.objOf)

const mergeTwoObjectsNoDuplicateKey = (left, right) => {
    return R.mergeDeepWithKey(disallowDuplicateKey, left, right)
}

const pairsToObject = pairArray => {
    const objects = R.map(pairToObject, pairArray)
    const initialValue = {}
    return R.reduce(mergeTwoObjectsNoDuplicateKey, initialValue, objects)
}

const createMapStateToProps = ({name, model}) => state => {
    const toEntry = (property, key) => {
        const value = R.view(property.lens, state[name])
        return [key, value]
    }
    const entries = R.mapObjIndexed(toEntry, model)
    const result = pairsToObject(R.values(entries))
    return result
}

const createReducerFromDispatchSystems = dispatchSystems => {
    const dispatchSystemToReducerMapPair = dispatchSystem => [dispatchSystem.name, dispatchSystem.reducer]
    const reducerMapPairs = R.map(dispatchSystemToReducerMapPair, dispatchSystems)
    const reducerMap = pairsToObject(reducerMapPairs)
    return combineReducers(reducerMap)
}

const createInitialState = model => {
    const createSetter = property => R.set(property.lens, property.initialValue)
    const setters = R.map(createSetter, R.values(model))
    return R.apply(R.pipe, setters)({})
}

const createReducerFromMap = ({reducerMap, model}) => (state = createInitialState(model), event) => {
    const reducer = reducerMap[event.type]
    if (reducer) {
        return reducer(state, event)
    } else {
        return state
    }
}

const createSagaFromMap = effectMap => environment => function* () {
    const names = Object.keys(effectMap)
    for (const name of names) {
        const handler = effectMap[name](environment)
        yield takeEvery(name, handler)
    }
}

const createSagaFromDispatchSystems = dispatchSystems => environment => function* () {
    yield all(R.map(dispatchSystem => call(dispatchSystem.saga(environment)), dispatchSystems))
}

const createDispatchSystem = (
    {
        name,
        model,
        dispatch,
        View,
        reducerMap,
        effectMap
    }) => {
    const mapStateToProps = createMapStateToProps({name, model})
    const Component = connect(mapStateToProps, dispatch)(View)
    const reducer = createReducerFromMap({reducerMap, model})
    const saga = createSagaFromMap(effectMap)
    return {
        name,
        Component,
        reducer,
        saga,
        mapStateToProps
    }
}

export {
    pairsToObject,
    createReducerFromDispatchSystems,
    createDispatchSystem,
    createSagaFromDispatchSystems
}
