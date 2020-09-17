// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { Box, Typography, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3,
  contract: Contract,
  defaultAccount: string
}

// ------------------------------------------
//                  Styles
// ------------------------------------------
const useStyles = makeStyles((theme) => ({
  modal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

// ------------------------------------------
//               AppETH component
// ------------------------------------------
function AppETH ({ contract, defaultAccount, web3 }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  // State
  const [balance, setBalance] = useState(String);
  const [fetchBalance, setFetchBalance] = useState(Boolean);

  const [polkadotRecipient, setPolkadotRecipient] = useState(String);
  const [depositAmount, setDepositAmount] = useState(String);

  // Handlers
  const handleSendETH = () => {
    const execute = async (rawRecipient: string, amount: string) => {
      const recipientBytes = Buffer.from(rawRecipient, 'hex');

      await contract.methods.sendETH(recipientBytes).send({
        from: defaultAccount,
        gas: 500000,
        value: web3.utils.toWei(amount, 'ether')
      });

      await sleep(5000);
      getBalance();
    };

    execute(polkadotRecipient, depositAmount);
  };

  const getBalance = () => {
    const execute = async () => {
      const currBalance = await web3.eth.getBalance(defaultAccount.toString());

      setBalance(web3.utils.fromWei(currBalance, 'ether'));
    };

    execute();
  };

  // Sleep is a wait function
  function sleep (ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // On load
  if (!fetchBalance) {
    getBalance();
    setFetchBalance(true);
  }

  getBalance();

  // Render
  return (
    <Box>
      <Box className={classes.paper}
        display='flex'
        flexDirection='column'>
        <Typography align='center'
          gutterBottom
          variant='h5'>
            ETH App
        </Typography>
        <Box padding={1}/>
        <Typography gutterBottom>
            What account would you like to fund on Polkadot?
        </Typography>
        <TextField
          InputProps={{
            value: polkadotRecipient
          }}
          id='eth-input-recipient'
          margin='normal'
          onChange={(e) => setPolkadotRecipient(e.target.value)}
          placeholder={'38j4dG5GzsL1bw...'}
          style={{ margin: 5 }}
          variant='outlined'
        />
        <Box padding={1}/>
        <Typography gutterBottom>
            How much ETH would you like to deposit
        </Typography>
        <TextField
          InputProps={{
            value: depositAmount
          }}
          id='eth-input-amount'
          margin='normal'
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder='0.00 ETH'
          style={{ margin: 5 }}
          variant='outlined'
        />
        <Box alignItems='center'
          display='flex'
          justifyContent='space-around'>
          <Box>
            <Typography>
            Current balance: {balance} ETH
            </Typography>
          </Box>
          <Box alignItems='center'
            display='flex'
            height='100px'
            paddingBottom={1}
            paddingTop={2}
            width='300px'>
            <Button
              color='primary'
              fullWidth={true}
              onClick={() => handleSendETH()}
              variant='outlined'>
              <Typography variant='button'>
                      Send ETH
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(styled(AppETH)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`);
