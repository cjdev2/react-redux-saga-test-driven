# Sample Program Demonstrating React, Redux, and Sagas

## How to run

First make sure you have [webdb](https://gitlab.cj.dev/training/webdb) running, then read the "Scripts" section.

## Scripts

- `./scripts/prepare.sh`
  - One time initialization
- `./scripts/sample-data.sh`
  - Create sample data for [webdb](https://gitlab.cj.dev/training/webdb)
- `./scripts/run.sh`
  - Run application
- `./scripts/test.sh`
  - Run the tests
- `./scripts/coverage.sh`
  - Test coverage report

## Design Goals

- Easy to compose
- Easy to test
- Easy for parts to interact with each other without knowledge of implementation details

## Requirements

- [ ] Profiles
  - [ ] Display all profiles
  - [ ] Add a profile
  - [ ] Remove a profile
  - [ ] Navigate to tasks associated with a particular profile
- [ ] Tasks
  - [ ] Display all tasks for a particular profile
  - [ ] Add a task
  - [ ] Mark a task as complete
  - [ ] Clear all completed tasks
  - [ ] Navigate to profiles
- [ ] Summary
  - [ ] Display the total number of profiles
  - [ ] Display the total number of tasks
  - [ ] Be visible on every page
  - [ ] Immediately update as the underlying data changes
- [ ] Navigation
  - [ ] Profiles and Tasks are displayed on different pages
  - [ ] Bookmarked pages should work
  - [ ] Back button should work

## Intent
You should know how write a front end application that handles all of the following in a testable way
- presentation
- state
- side effects
- multiple pages
- back button
- an event in one component triggering a state change in another, without coupling those components together

This is a fully test driven example project that shows one way of accomplishing this.


## How this project was created
```bash
npx create-react-app react-redux-saga-test-driven
cd react-redux-saga-test-driven/
npm install ramda
npm install redux
npm install react-redux
npm install redux-saga
npm install history
npm install http-proxy-middleware
```

## Proxy setup
Create file `src/setupProxy.js`, with the following contents

```javascript
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    const options = {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
            '^/proxy/': '/',
        }
    };
    app.use(
        '/proxy/',
        createProxyMiddleware(options)
    );
};
```

The idea here is to be specific about which http paths should render something from the source directory vs. a proxy to elsewhere.
This helps prevent urls from conflicting in case a path to a proxied resource happens to match a path to a resource in the src directory.
The source code adds the 'proxy' prefix indicating this is a request that should be proxied,
but when proxying out externally, the proxy middleware rewrites the url, removing the proxy prefix.

## Css reset
Add the file [reset.css](http://meyerweb.com/eric/tools/css/reset/),
and import it from index.js `import './reset.css'`

The idea here is to preserve a consistent presentation in spite of different browser css defaults,
and be more explicit and intentional about what css styles are applied

## Technology Stack
- [React](https://reactjs.org/)
- [Ramda](https://ramdajs.com/)
- [React Router](https://reactrouter.com/)
  - [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [history](https://github.com/ReactTraining/history/)
- [Jest](https://jestjs.io/)
  - [expect api](https://jestjs.io/docs/en/expect)
- [Testing Library](https://testing-library.com)
  - [queries](https://testing-library.com/docs/dom-testing-library/api-queries)
- http-proxy-middleware
  - https://github.com/chimurai/http-proxy-middleware
  - https://www.npmjs.com/package/http-proxy-middleware

## Middleware for monitoring
```js
const monitor = store => next => action => {
  console.log('monitor', {store, next, action})
  let result = next(action)
  console.log('monitor', {result})
  return result
}
```