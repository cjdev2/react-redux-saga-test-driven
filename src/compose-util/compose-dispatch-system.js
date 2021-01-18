import * as R from 'ramda'
import {all, call, takeEvery} from "redux-saga/effects";
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

const createMapStateToProps = ({model, extraState}) => state => {
    const toEntry = (property, key) => {
        const value = R.view(property.lens, state)
        return [key, value]
    }
    const entries = R.mapObjIndexed(toEntry, model)
    const stateFromModel = pairsToObject(R.values(entries))
    const result = R.mergeLeft(stateFromModel, extraState)
    return result
}

const createReducerFromDispatchSystems = dispatchSystems => {
    const dispatchSystemToReducerMapPair = dispatchSystem => [dispatchSystem.name, dispatchSystem.reducer]
    const reducerMapPairs = R.map(dispatchSystemToReducerMapPair, dispatchSystems)
    const reducerMap = pairsToObject(reducerMapPairs)
    const reducers = R.map(system => system.reducer, dispatchSystems)
    const newReducer = (state, event) => {
        const accumulateState = (accumulator, reducer) => reducer(accumulator, event)
        const newState = R.reduce(accumulateState, state, reducers)
        return newState
    }
    return newReducer
}

const createSettersFromModel = model => {
    const createSetter = property => R.set(property.lens, property.initialValue)
    const setters = R.map(createSetter, R.values(model))
    return setters
}

const createInitialStateFromDispatchSystems = dispatchSystems => {
    const models = R.map(system => system.model, dispatchSystems)
    const setters = R.chain(createSettersFromModel, models)
    return R.apply(R.pipe, setters)({})
}

const createInitialState = model => {
    const createSetter = property => R.set(property.lens, property.initialValue)
    const setters = R.map(createSetter, R.values(model))
    return R.apply(R.pipe, setters)({})
}

const createReducerFromMap = ({reducerMap, model}) => (state, event) => {
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

const createMapDispatchToProps = ({dispatch, extraDispatch}) => {
    const merged = R.mergeLeft(dispatch, extraDispatch)
    return merged
}

const createDispatchSystem = (
    {
        name,
        model,
        dispatch,
        View,
        reducerMap,
        effectMap,
        extraState = {},
        extraDispatch = {}
    }) => {
    const mapStateToProps = createMapStateToProps({model, extraState})
    const mapDispatchToProps = createMapDispatchToProps({dispatch, extraDispatch})
    const Component = connect(mapStateToProps, mapDispatchToProps)(View)
    const reducer = createReducerFromMap({reducerMap, model})
    const saga = createSagaFromMap(effectMap)
    const initialState = createInitialState(model)
    return {
        name,
        Component,
        reducer,
        saga,
        mapStateToProps,
        model,
        initialState
    }
}

export {
    pairsToObject,
    createReducerFromDispatchSystems,
    createDispatchSystem,
    createSagaFromDispatchSystems,
    createInitialStateFromDispatchSystems
}
