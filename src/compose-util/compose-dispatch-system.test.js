import '@testing-library/jest-dom/extend-expect'
import {createDispatchSystem, createReducerFromDispatchSystems, pairsToObject} from "./compose-dispatch-system";
import * as R from 'ramda'
import {put} from "redux-saga/effects";
import createDispatchSystemTester from "../test-util/dispatchSystemTester";

test('pairs to object', () => {
    // given
    const pairs = [['a', 1], ['b', 2]]

    // when
    const object = pairsToObject(pairs)

    // then
    expect(object).toEqual({a: 1, b: 2})
})

test('pairs to object disallows duplicates', () => {
    // given
    const pairs = [['a', 1], ['a', 2]]

    // then
    expect(() => pairsToObject(pairs)).toThrow("duplicate key 'a'")
})

test('create reducer', () => {
    const valueLens = R.lensPath(['value'])
    const reducerA = (state = {}, event) => {
        if (event.type === 'a-event') {
            return R.set(valueLens, event.value, state)
        } else {
            return state
        }
    }
    const reducerB = (state = {}, event) => {
        if (event.type === 'b-event') {
            return R.set(valueLens, event.value, state)
        } else {
            return state
        }
    }
    const dispatchSystemA = {
        name: 'a',
        reducer: reducerA
    }
    const dispatchSystemB = {
        name: 'b',
        reducer: reducerB
    }
    const dispatchSystems = [dispatchSystemA, dispatchSystemB]
    const reducer = createReducerFromDispatchSystems(dispatchSystems)
    expect(reducer({}, {type: 'a-event', value: 123})).toEqual({a: {value: 123}, b: {}})
    expect(reducer({}, {type: 'b-event', value: 456})).toEqual({a: {}, b: {value: 456}})
})

// test('create dispatch system',async  () => {
//     const name = 'foo'
//     const model = {
//         value: {
//             lens: R.lensPath(['value']),
//             initialValue: ''
//         }
//     }
//     const dispatch = {
//         request: () => ({type: 'request'}),
//         response: value => ({type: 'response', value})
//     }
//     const View = (props) => {
//         console.log("View.props", props)
//         return <div>Hello, {props.value}!</div>
//     }
//     const success = (state, event) => R.set(model.value.lens, event.value, state)
//     const reducerMap = {
//         response: success
//     }
//     const request = environment => function* () {
//         const value = yield environment.fetchText('/value')
//         yield put({type: 'response', value})
//     }
//     const effectMap = {
//         request,
//     }
//     const system = createDispatchSystem({
//         name,
//         model,
//         dispatch,
//         View,
//         reducerMap,
//         effectMap
//     })
//     const fetchResponses = [{uri:'/value',response:'world'}]
//     const tester = createDispatchSystemTester({system, fetchResponses})
//     await tester.dispatch(dispatch.request())
//     console.log({state:tester.store.getState()})
//     console.log({events:tester.events})
//     tester.renderLatest().debug()
// })
