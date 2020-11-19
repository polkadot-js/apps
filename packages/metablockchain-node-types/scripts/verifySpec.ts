import { dev, MBTestNet } from '../src';
import { WsProvider, ApiPromise } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types';
import { RegistryTypes, OverrideModuleType, OverrideBundleType } from '@polkadot/types/types';

type SpecType = {
  types?: RegistryTypes,
  typesAlias?: Record<string, OverrideModuleType>,
  typesBundle?: OverrideBundleType,
}

const specs: { [name: string]: SpecType } = { 
  'dev': dev,
  'testnet': MBTestNet
}

const urls: { [name: string]: string } = {
  'dev': 'ws://localhost:9944',
  'testnet': 'ws://ec2-52-76-185-53.ap-southeast-1.compute.amazonaws.com:9944'
};

const verify = async (spec: SpecType, url: string, blockNumber?: number) => {
  // connect to chain via provider
  console.log(`Connecting to url: ${url}...`);

  // construct API using provider
  console.log('Constructing API...');
  const registry = new TypeRegistry();
  const api = new ApiPromise({
    provider: new WsProvider(url),
    registry,
    types: spec.types,
  });

  await api.isReady;

  console.log(`Querying hash for block ${blockNumber || 'latest'}...`);
  if (blockNumber) {
    const blockHash = await api.rpc.chain.getBlockHash(blockNumber);
    const version = await api.rpc.state.getRuntimeVersion(blockHash);
    console.log(`Got ${version.specName} spec version: ${version.specVersion}.`);

    console.log('Querying events...');
    const result = await api.query.system.events.at(blockHash);
    console.log(`Got events at block ${blockNumber}: ${JSON.stringify(result.toHuman(), null, 2)}`)
  } else {
    const version = await api.rpc.state.getRuntimeVersion();
    console.log(`Got ${version.specName} spec version: ${version.specVersion}.`);

    console.log('Querying events...');
    const result = await api.query.system.events();
    console.log(`Got latest events: ${JSON.stringify(result.toHuman(), null, 2)}`)
  }
};

// parse args
const args = process.argv.slice(2);
const network = args[0] || 'mainnet';
const spec = specs[network];
const url = urls[network];
const block = args[1];

// kick off function
verify(spec, url, block ? +block : undefined)
.then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
