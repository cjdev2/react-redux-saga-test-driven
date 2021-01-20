const navigationEvent = {
    FETCH_PAGE_REQUEST: 'NAVIGATION/FETCH_PAGE_REQUEST',
    FETCH_PAGE_SUCCESS: 'NAVIGATION/FETCH_PAGE_SUCCESS',
    REDIRECT: 'NAVIGATION/REDIRECT',
}

const navigationDispatch = {
    fetchPageRequest: () => ({type: navigationEvent.FETCH_PAGE_REQUEST}),
    fetchPageSuccess: page => ({type: navigationEvent.FETCH_PAGE_SUCCESS, page}),
    redirect: uri => ({type: navigationEvent.REDIRECT, uri})
}

export {navigationDispatch as default, navigationEvent}
