import { Option } from '../types';

import { isPlasm } from './type';

type ChainName = 'plasmTestV1' | 'plasmTestV2';

interface ChainData {
  chainDisplay: string;
  logo: 'plasm' | 'substrate';
  type: string;
}

type ProviderName = 'stake';

interface PoviderData {
  providerDisplay: string;
  nodes: Partial<Record<ChainName, string>>;
}

// we use this to give an ordering to the chains available
const ORDER_CHAINS: ChainName[] = ['plasmTestV1', 'plasmTestV2'];

// we use this to order the providers inside the chains
const ORDER_PROVIDERS: ProviderName[] = ['stake'];

// some suplementary info on a per-chain basis
const CHAIN_INFO: Record<ChainName, ChainData> = {
  plasmTestV2: {
    chainDisplay: 'Plasm Testnet v2',
    logo: 'plasm',
    type: 'Plasm Testnet version2'
  },
  plasmTestV1: {
    chainDisplay: 'Plasm Testnet v1',
    logo: 'plasm',
    type: 'Plasm Testnet version1'
  }
};

const HOSTS: String[] = ['testnet.plasmnet.io'];

// the actual providers with all  the nodes they provide
const PROVIDERS: Record<ProviderName, PoviderData> = ORDER_PROVIDERS.reduce((map: any, p, i) => {
  map[p] = {
    providerDisplay: 'Stake technologies Host',
    nodes: {
      plasmTestV2: 'wss://' + HOSTS[i],
    }
  };
  return map;
}, {});

export const ENDPOINT_DEFAULT = isPlasm
  ? PROVIDERS.stake.nodes.plasmTestV2
  : 'ws://127.0.0.1:9944/';

export const ENDPOINTS: Option[] = ORDER_CHAINS.reduce((endpoints: Option[], chainName): Option[] => {
  const { chainDisplay, logo, type } = CHAIN_INFO[chainName];

  return ORDER_PROVIDERS.reduce((endpoints: Option[], providerName): Option[] => {
    const { providerDisplay, nodes } = PROVIDERS[providerName];
    const wssUrl = nodes[chainName];

    if (wssUrl) {
      endpoints.push({
        info: logo,
        text: `${chainDisplay} (${type}, hosted by ${providerDisplay})`,
        value: wssUrl
      });
    }

    return endpoints;
  }, endpoints);
}, []);

// add a local node right at the end
ENDPOINTS.push({
  info: 'local',
  text: 'Local Node (Own, 127.0.0.1:9944)',
  value: 'ws://127.0.0.1:9944/'
});
