const summaryEvent = {
    FETCH_SUMMARY_REQUEST: 'SUMMARY/FETCH_SUMMARY_REQUEST',
    FETCH_SUMMARY_SUCCESS: 'SUMMARY/FETCH_SUMMARY_SUCCESS'
}

const summaryDispatch = {
    fetchSummaryRequest: () => ({type: summaryEvent.FETCH_SUMMARY_REQUEST}),
    fetchSummarySuccess: ({profileCount, taskCount}) => ({
        type: summaryEvent.FETCH_SUMMARY_SUCCESS,
        profileCount,
        taskCount
    })
}

export {summaryDispatch as default, summaryEvent}
