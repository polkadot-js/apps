// @flow

declare module 'sodium' {
  declare module.exports: {
    Key: {
      Sign: {
        fromSeed (seed: Buffer): {
          getPublicKey (): {
            baseBuffer: Buffer
          }
        }
      }
    }
  }
}
