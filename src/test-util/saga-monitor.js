import * as R from 'ramda'

const createSagaMonitor = () => {
    let activeSagaEffectIds = []
    const events = []
    const addId = (caption, effectId) => {
        if (!R.includes(effectId, activeSagaEffectIds)) {
            activeSagaEffectIds = R.append(effectId, activeSagaEffectIds)
        }
    }
    const removeId = (caption, effectId) => {
        activeSagaEffectIds = R.filter(activeEffectId => activeEffectId !== effectId, activeSagaEffectIds)
    }
    const rootSagaStarted = ({effectId, saga, args}) => {
        addId('rootSagaStarted', effectId)
    }
    const effectTriggered = ({effectId, parentEffectId, label, effect}) => {
        addId('effectTriggered', effectId)
    }
    const effectResolved = (effectId, result) => {
        removeId('effectResolved', effectId)
    }
    const effectRejected = (effectId, error) => {
        removeId('effectRejected', effectId)
    }
    const effectCancelled = effectId => {
        removeId('effectCancelled', effectId)
    }
    const actionDispatched = (event) => {
        events.push(event)
    }
    const sagaMonitor = {
        rootSagaStarted,
        effectTriggered,
        effectResolved,
        effectRejected,
        effectCancelled,
        actionDispatched
    }
    const getActiveSagaEffectIds = () => activeSagaEffectIds
    const getEvents = () => events
    return {
        sagaMonitor,
        getActiveSagaEffectIds,
        getEvents
    }
}

export default createSagaMonitor
