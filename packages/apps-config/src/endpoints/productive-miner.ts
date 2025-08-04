import type { EndpointOption } from '@polkadot/apps-config/types';

export const PRODUCTIVE_MINER_TESTNET: EndpointOption = {
  info: 'productive-miner-testnet',
  text: 'ProductiveMiner TestNet',
  providers: {
    'ProductiveMiner': 'ws://54.173.40.119:9944'
  },
  ui: {
    color: '#E6007A',
    logo: 'productive-miner-testnet.svg'
  }
};

export const PRODUCTIVE_MINER_TESTNET_HTTP: EndpointOption = {
  info: 'productive-miner-testnet-http',
  text: 'ProductiveMiner TestNet (HTTP)',
  providers: {
    'ProductiveMiner': 'http://54.173.40.119:9933'
  },
  ui: {
    color: '#E6007A',
    logo: 'productive-miner-testnet.svg'
  }
}; 