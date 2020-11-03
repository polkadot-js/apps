import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import {DefinitionRpcSub, DefinitionRpcParam, DefinitionTypeType} from '@cennznet/types';
import {DefinitionRpcExt} from '@polkadot/types/types';
import cennznetBare from '@cennznet/api/rpc';

let cennznetRpc:{[index: string]:any} = cennznetBare;
const newJsonrpc: Record<string, Record<string, DefinitionRpcExt>> = {};
Object
    .keys(cennznetRpc)
    .forEach((section): void => {
        newJsonrpc[section] = {};

        Object.entries(cennznetRpc[section])
            .forEach(([method, def]): void => {
                const isSubscription = !!(def as DefinitionRpcSub).pubsub;
                newJsonrpc[section][method] = ({
                    ...def as {description: string,params: DefinitionRpcParam[],type: DefinitionTypeType} ,
                    isSubscription,
                    jsonrpc: `${section}_${method}`,
                    method,
                    section
                });
            });
    });
const cennznetJsonRpc = Object.assign({}, jsonrpc, newJsonrpc);

export default cennznetJsonRpc;
