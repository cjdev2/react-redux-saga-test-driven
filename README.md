# Sample Program Demonstrating React, Redux, and Sagas

## How to run

First make sure you have [webdb](https://github.com/cjdev/webdb) running, then read the "Scripts" section.

## Scripts

- `./scripts/prepare.sh`
  - One time initialization
- `./scripts/sample-data.sh`
  - Create sample data for [webdb](https://github.com/cjdev/webdb)
- `./scripts/run.sh`
  - Run application
- `./scripts/test.sh`
  - Run the tests
- `./scripts/coverage.sh`
  - Test coverage report

## Testing Examples

Higher level testing

- [Test everything connected at the domain level, using the real view, reducer, and saga](/src/task/taskConnected.test.js)

Lower level testing

- [Test view only, through state received and functions invoked](/src/task/Task.test.js)
- [Test side effects only, through saga handlers](/src/task/taskEffects.test.js)
- [Test state transformation only, through data model (lenses) and reducers](/src/task/taskState.test.js)

## Experiment here

[React, Redux, and Saga prototype application](https://github.com/cjdev/react-redux-saga-prototype)

This is a single-file implementation of this same application without the tests, error handling, and dependency
inversion. It is useful for experimenting.

## Design Goals

- Easy to compose
- Easy to test
- Easy for components to interact with each other without knowledge of implementation details

## Design highlights

- Each component manages its own ecosystem of
  - state, via lenses and reducers
  - view, via a react component that ONLY interacts with the state and dispatch methods injected into it
    - in particular, there is no locally managed state, no interaction with a context, no lifecycle methods, and no
      hooks
  - effects, via redux sagas
    - all side effects are abstracted by an "environment", injected through currying
  - dispatch, which describes a contract for component interaction
  - connected, which forms each component into the same shape so that it may be composed into the top level
- The top level composes the components together and only knows a few minor things about them
  - the top level knows which components might need to render which other components
  - the top level is the only place aware of the entire list of components
  - the top level knows which event of fire first
- Components can only communicate with each other by sending messages declared in their "dispatch" file
- Navigation not treated any differently, it is treated as any other component
- All non-determinism is isolated to the "environment" file
- Testing can be done at the component level, or at the detail level
  - All tests here are at the component level
  - The user interface "rendered" portion is all that really needs to be tested
  - The "effectiveState" and "reduxEvents" are useful for debugging, or optional regression tests
  - Regression tests will make your tests more brittle, but will allow you to detect mistakes in implementation that
    don't affect the observable behavior
  - The "effectiveState" and "reduxEvents" regression tests are left in here as documentation, in a real-world app you
    would use them sparingly
  - The component level tests do take a bit of setup, another valid style is to only have one or two component level
    tests and rely more heavily on lower level tests
- By convention, I prefix every lens path and event type constant with the directory. As these occupy a global
  namespace (for state model and event dispatch respectively), this convention prevents collisions.
- Except for "dispatch", files in each component directory can be merged together or pulled apart as you like. You
  should not mix dispatch with anything else, as is serves as the contract for components to communicate with each
  other. The smaller the surface area of the contract, the easier the code is to maintain, so the shape of events and
  perhaps some global constants are the only things that should exist in "dispatch". An example where global constants
  is needed is the regular expression uri pattern that matches each component. The component needs to know about the
  shape of its uri pattern when it needs to pull data out of it. The navigator needs to know about the shape of the uri
  pattern in order to render the appropriate component based on the uri.
- A single top level component is in charge of composition, and inverts the dependency on components that need to be
  rendered inside other components. In this manner, the tests can stub out inner components and focus on testing the
  composing component.

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
- [Redux](https://redux.js.org/)
- [Redux Saga](https://redux-saga.js.org/)
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
