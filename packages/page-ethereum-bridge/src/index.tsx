// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// global app props
import { AppProps as Props } from '@polkadot/react-components/types';

// external imports
import React from 'react';
import Web3 from 'web3';

// local imports and components
import Bridge from './Bridge';

type MyWindow = (typeof window) & {
  ethereum: any;
  web3: Web3;
}

function BridgeApp ({ className }: Props): React.ReactElement<Props> {

  const ethEnabled = () => {
    let locWindow = (window as MyWindow);
    if (locWindow.ethereum) {
      locWindow.web3 = new Web3(locWindow.ethereum);
      locWindow.ethereum.enable();
      return true;
    }
    return false;
  }

  if (!ethEnabled()) {
    alert("Please install MetaMask to use this application!");
    return(<div><p>Please install MetaMask to use this application!</p></div>)
  }

  return (
      <main className={className}>
        <Bridge web3={(window as MyWindow).web3}/>
      </main>
  );
}

export default BridgeApp;
