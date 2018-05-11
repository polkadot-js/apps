// @flow

declare module 'store' {
  declare module.exports: {
    each: (fn: (value: any, key: string) => void) => void,
    get: (key: string) => any,
    remove: (key: string) => any,
    set: (key: string, value: any) => void,
  }
}
