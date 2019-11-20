import { Option } from '../types';

import { isPlasm } from './type';

type ChainName = 'plasmTest';

interface ChainData {
  chainDisplay: string;
  logo: 'plasm' | 'substrate';
  type: string;
}

type ProviderName = 'stake_1' | 'stake_2' | 'stake_3' | 'stake_4';

interface PoviderData {
  providerDisplay: string;
  nodes: Partial<Record<ChainName, string>>;
}

// we use this to give an ordering to the chains available
const ORDER_CHAINS: ChainName[] = ['plasmTest'];

// we use this to order the providers inside the chains
const ORDER_PROVIDERS: ProviderName[] = ['stake_1', 'stake_2', 'stake_3', 'stake_4'];

// some suplementary info on a per-chain basis
const CHAIN_INFO: Record<ChainName, ChainData> = {
  plasmTest: {
    chainDisplay: 'Plasm Testnet v1',
    logo: 'plasm',
    type: 'Plasm Testnet'
  }
};

const HOSTS: String[] = ['3.114.90.94:443', '3.114.81.104:443', '3.115.175.152:443', '54.64.145.3:443'];

// the actual providers with all  the nodes they provide
const PROVIDERS: Record<ProviderName, PoviderData> = ORDER_PROVIDERS.reduce((map: any, p, i) => {
  map[p] = {
    providerDisplay: 'Stake technologies node' + (i+1),
    nodes: {
      plasmTest: 'ws://' + HOSTS[i]
    }
  };
  return map;
}, {});

export const ENDPOINT_DEFAULT = isPlasm
  ? PROVIDERS.stake_1.nodes.plasmTest
  : PROVIDERS.stake_2.nodes.plasmTest;

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
