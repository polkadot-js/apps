// TODO: Move this to chopsticks-core

import { setStorage, setup } from '@acala-network/chopsticks-core'
import { ApiPromise } from "@polkadot/api";

export const ChopsticksApiPromise = async (api: ApiPromise, apiUrl: string): Promise<ApiPromise> => {
  console.log('init ChopsticksApiPromise');

  // FIXME: WARNING in /node_modules/typeorm/browser/driver/react-native/ReactNativeDriver.js
  // see: https://github.com/typeorm/typeorm/issues/2158

  // TODO: chopsticks need to support light provider (light://)
  const chain = await setup({
    endpoint: apiUrl,
    mockSignatureHost: true,
    db: 'cache',
  })

  await setStorage(chain, {
    System: {
      Account: [
        [
          ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'],
          {
            providers: 1,
            data: {
              free: '1000000000000000000',
            },
          },
        ],
      ],
    },
  })

  // use Proxy to trap only parts of the ApiPromise
  const apiProxy = new Proxy(api, {
    get: function(target, prop, receiver) {
      console.log('get', prop);
      return Reflect.get(target, prop, receiver);
    },
    set: function(target, prop, value, receiver) {
      console.log('set', prop);
      return Reflect.set(target, prop, value, receiver);
    }
  });

  return apiProxy;
}

export default ChopsticksApiPromise;