// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

import { Box } from '@material-ui/core';

// Local imports
import { APP_ETH_CONTRACT_ADDRESS, APP_ERC20_CONTRACT_ADDRESS } from './config';
import AppEthereum from './AppETH';
import AppERC20 from './AppERC20';

/* tslint:disable */
// import * as BankContract from "./contracts/Bank.json";
import * as ETHApp from './contracts/ETHApp.json';
import * as ERC20App from './contracts/ERC20App.json';
/* tslint:enable */

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3
}

// ------------------------------------------
//               Bank component
// ------------------------------------------
function Bridge ({ web3 }: Props): React.ReactElement<Props> {
  // State
  const initialContract: any = null;
  const [appETHContract, setAppETHContract] = useState(initialContract);
  const [appERC20Contract, setAppERC20Contract] = useState(initialContract);
  const [defaultAccount, setDefaultAccount] = useState(String);

  // Effects
  useEffect(() => {
    const fetchAccounts = async () => {
      const accs = await web3.eth.getAccounts();
      const defaultAcc = accs[0];

      web3.eth.defaultAccount = defaultAcc;
      setDefaultAccount(defaultAcc);
    };

    fetchAccounts();
  }, []);

  // Fetch contracts
  useEffect(() => {
    const fetchAppEthereumContract = async () => {
      const appETHContractInstance = new web3.eth.Contract(ETHApp.abi as any, APP_ETH_CONTRACT_ADDRESS);

      setAppETHContract(appETHContractInstance);
    };

    const fetchAppERC20Contract = async () => {
      const appERC20ContractInstance = new web3.eth.Contract(ERC20App.abi as any, APP_ERC20_CONTRACT_ADDRESS);

      setAppERC20Contract(appERC20ContractInstance);
    };

    fetchAppEthereumContract();
    fetchAppERC20Contract();
  }, [web3]);

  // Render
  return (
    <Box>
      <AppEthereum contract={appETHContract}
        defaultAccount={defaultAccount}
        web3={web3}/>
      <AppERC20 contract={appERC20Contract}
        defaultAccount={defaultAccount}
        web3={web3}/>
    </Box>
  );
}

// export default React.memo(styled(Bridge)`
export default styled(Bridge)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`;
