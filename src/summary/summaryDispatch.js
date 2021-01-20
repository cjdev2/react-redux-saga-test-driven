const summaryEvent = {
    FETCH_SUMMARY_REQUEST: 'SUMMARY/FETCH_SUMMARY_REQUEST',
    FETCH_SUMMARY_SUCCESS: 'SUMMARY/FETCH_SUMMARY_SUCCESS',
    ADD_ERROR: 'SUMMARY/ADD_ERROR'
}

const summaryDispatch = {
    fetchSummaryRequest: () => ({type: summaryEvent.FETCH_SUMMARY_REQUEST}),
    fetchSummarySuccess: ({profileCount, taskCount}) => ({
        type: summaryEvent.FETCH_SUMMARY_SUCCESS,
        profileCount,
        taskCount
    }),
    addError: error => ({type: summaryEvent.ADD_ERROR, error})
}

export {summaryDispatch as default, summaryEvent}
