// @flow

declare module 'semver' {
  declare module.exports: {
    gt: (a: string, b: string) => boolean,
    lt: (a: string, b: string) => boolean
  }
}
