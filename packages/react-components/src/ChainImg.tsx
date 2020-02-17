// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useApi } from '@polkadot/react-hooks';

// the imports here as a bit all-over, non-aphabetical - since we expect this to grow,
// rather organise based on type, grouping chains and nodes as opposed to location

// last-resort fallback, just something empty
import EMPTY from '@polkadot/ui-assets/empty.svg';

// anything fopr a specific chain, most items will probably go in here
import chainKusama from '@polkadot/ui-assets/chains/kusama-128.gif';

// defaults for the node type, assuming we don't have a specific chain
import edgeware from '@polkadot/ui-assets/edgeware-circle.svg';
import polkadot from '@polkadot/ui-assets/polkadot-circle.svg';
import polkadotJs from '@polkadot/ui-assets/polkadot-js.svg';
import substrate from '@polkadot/ui-assets/substrate-hexagon.svg';

// overrides based on the actual matched chain name
const CHAINS: Record<string, any> = {
  Kusama: chainKusama, // old name, the W3F nodes still has these
  'Kusama CC1': chainKusama,
  'Kusama CC2': chainKusama,
  'Kusama CC3': chainKusama
};

// overrides based on the actual software node type
const NODES: Record<string, any> = {
  'edgeware-node': edgeware,
  'edgeware node': edgeware,
  'node-template': substrate,
  'parity-polkadot': polkadot,
  'polkadot-js': polkadotJs,
  'substrate-node': substrate
};

// overrides as specified
const LOGOS: Record<string, any> = {
  empty: EMPTY,
  edgeware,
  alexander: polkadot,
  kusama: chainKusama,
  polkadot,
  substrate,
  westend: polkadot
};

interface Props {
  className?: string;
  logo?: keyof typeof LOGOS;
  onClick?: () => any;
}

function ChainImg ({ className, logo, onClick }: Props): React.ReactElement<Props> {
  const { systemChain, systemName } = useApi();
  const img = useMemo((): any => {
    return LOGOS[logo || ''] || CHAINS[systemChain?.toLowerCase()] || NODES[systemName?.toLowerCase()] || EMPTY;
  }, [logo, systemChain, systemName]);

  return (
    <img
      alt='chain logo'
      className={className}
      onClick={onClick}
      src={img}
    />
  );
}

export default styled(ChainImg)`
  border-radius: 50%;
  box-sizing: border-box;
`;
