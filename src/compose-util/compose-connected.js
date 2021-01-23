import * as R from 'ramda'
import {all, call, takeEvery} from 'redux-saga/effects';
import {connect} from 'react-redux';

const lensPathWithDefault = (lensPath, theDefault) => {
    const theLens = R.lensPath(lensPath)
    const getter = R.pipe(R.view(theLens), R.defaultTo(theDefault))
    const setter = R.set(theLens)
    return R.lens(getter, setter)
}

const appendToArray = (lens, value, state) => {
    const oldArray = R.view(lens, state)
    const newArray = R.concat(oldArray, [value])
    return R.set(lens, newArray, state)
}

const disallowDuplicateKey = key => {
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
    const toEntry = (lens, key) => {
        const value = R.view(lens, state)
        return [key, value]
    }
    const entries = R.mapObjIndexed(toEntry, model)
    const stateFromModel = pairsToObject(R.values(entries))
    const result = R.mergeLeft(stateFromModel, extraState)
    return result
}

const createReducerFromConnected = connectedArray => {
    const reducers = R.map(connected => connected.reducer, connectedArray)
    const newReducer = (state, event) => {
        const accumulateState = (accumulator, reducer) => reducer(accumulator, event)
        const newState = R.reduce(accumulateState, state, reducers)
        return newState
    }
    return newReducer
}

const createReducerFromMap = reducerMap => (state, event) => {
    const reducer = reducerMap[event.type]
    if (reducer) {
        return reducer(state, event)
    } else {
        return state
    }
}

const createSagaFromMap = ({effectMap, handleError}) => environment => function* () {
    const names = Object.keys(effectMap)
    for (const name of names) {
        const successHandler = effectMap[name](environment)
        const errorHandler = handleError(environment)
        const handler = function* (...args) {
            try {
                yield* successHandler(...args)
            } catch (error) {
                yield* errorHandler(error, ...args)
            }
        }

        yield takeEvery(name, handler)
    }
}

const createSagaFromConnected = connectedArray => environment => function* () {
    yield all(R.map(connected => call(connected.saga(environment)), connectedArray))
}

const createMapDispatchToProps = ({dispatch, extraDispatch}) => {
    const merged = R.mergeLeft(dispatch, extraDispatch)
    return merged
}

const createConnected = (
    {
        name,
        model,
        dispatch,
        View,
        reducerMap,
        effectMap,
        handleError,
        componentDependencyMap
    }) => {
    const extraState = componentDependencyMap
    const extraDispatch = {}
    const mapStateToProps = createMapStateToProps({model, extraState})
    const mapDispatchToProps = createMapDispatchToProps({dispatch, extraDispatch})
    const Component = connect(mapStateToProps, mapDispatchToProps)(View)
    const reducer = createReducerFromMap(reducerMap)
    const saga = createSagaFromMap({effectMap, handleError})
    return {
        name,
        Component,
        reducer,
        saga,
        mapStateToProps,
        model
    }
}

export {
    pairsToObject,
    lensPathWithDefault,
    createReducerFromConnected,
    createConnected,
    createSagaFromConnected,
    appendToArray
}
