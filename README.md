# Sample Program Demonstrating React, Redux, and Sagas

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
## Scripts

- prepare.sh
    - One time initialization
- run.sh
    - Run application
- coverage.sh
    - Test coverage report

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

## Other resources
- https://redux-saga.js.org/docs/api/
- http://cef62.github.io/redux-saga/docs/advanced/UsingRunSaga.html
- https://scastiel.dev/posts/2019-08-03-lost-redux-saga-reimplement-them/

## Middleware for monitoring
```js
const monitor = store => next => action => {
  console.log('monitor', {store, next, action})
  let result = next(action)
  console.log('monitor', {result})
  return result
}
```