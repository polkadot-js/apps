// @flow

declare module 'react-router' {
  declare module.exports: {
    withRouter: (Component: React$ComponentType<*>) => React$StatelessFunctionalComponent<*>;
  }
}
