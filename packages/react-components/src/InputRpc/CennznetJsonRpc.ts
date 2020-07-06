import defaultJsonRpc from '@polkadot/jsonrpc';
import createMethod from '@polkadot/jsonrpc/create/method';
import createParam from '@polkadot/jsonrpc/create/param';
import cennznetBare from '@cennznet/api/rpc';

const userRpc = Object.entries(cennznetBare).reduce((user, [sectionName, methods]) => {
  // @ts-ignore
  user[sectionName] = {
    // @ts-ignore
    methods: methods.reduce((section, def) => {
      const {
        description = 'User defined',
        name,
        params,
        type
      } = def;
      section[name] = createMethod(sectionName, name, {
        description,
        params: params.map(({
                              // @ts-ignore
                              isOptional,
                              // @ts-ignore
                              name,
                              // @ts-ignore
                              type
                            }) => createParam(name, type, {
          isOptional
        })),
        type: type
      });
      return section;
    }, {})
  }
  return user;
}, {}); // decorate the sections with base and user methods

const cennznetJsonRpc = Object.assign({}, defaultJsonRpc, userRpc);

export default cennznetJsonRpc;
