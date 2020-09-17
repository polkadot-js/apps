// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// General
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

// External
import { Box, Typography, TextField, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Local
import * as ERC20 from './contracts/ERC20.json';
import { REFRESH_INTERVAL_MILLISECONDS } from './config';

// ------------------------------------------
//                  Props
// ------------------------------------------
type Props = {
  web3: Web3,
  contract: Contract,
  defaultAccount: string
}

type LoadERC20TokenProps = {
  web3: Web3,
  onContractInstance: any,
}

type ApproveAndSendProps = {
  defaultAccount: string,
  contract: any,
  contractERC20: any,
}

// ------------------------------------------
//                  Styles
// ------------------------------------------
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
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
//           LoadERC20Token component
// ------------------------------------------
function LoadERC20Token ({ onContractInstance, web3 }: LoadERC20TokenProps): React.ReactElement<Props> {
  const [tokenAddress, setTokenAddress] = useState(String);

  // Fetch ERC20 token contract
  useEffect(() => {
    const fetchTokenContract = async () => {
      const tokenContractInstance = new web3.eth.Contract(ERC20.abi as any, tokenAddress);

      onContractInstance(tokenContractInstance);
    };

    // All valid contract addresses have 42 characters ('0x' + address)
    if (tokenAddress.length == 42) {
      fetchTokenContract();
    }
  }, [web3, tokenAddress]);

  // Render
  return (
    <Box>
      <Typography gutterBottom>
        What&apos;s the ERC20 token&apos;s contract address?
      </Typography>
      <TextField
        InputProps={{
          value: tokenAddress
        }}
        fullWidth={true}
        id='erc-input-token-address'
        margin='normal'
        onChange={(e) => setTokenAddress(e.target.value)}
        placeholder='0xbeddb07...'
        style={{ margin: 5 }}
        variant='outlined'
      />
    </Box>
  );
}

// ------------------------------------------
//           ApproveAndSendERC20 component
// ------------------------------------------
function ApproveAndSendERC20 ({ contract, contractERC20, defaultAccount }: ApproveAndSendProps): React.ReactElement<Props> {
  // Blockchain state from blockchain
  const [allowance, setAllowance] = useState(Number);
  const [balance, setBalance] = useState(Number);

  // User input state
  const [approvalAmount, setApprovalAmount] = useState(Number);
  const [polkadotRecipient, setPolkadotRecipient] = useState(String);
  const [depositAmount, setDepositAmount] = useState(String);

  const fetchChainData = async () => {
    const appAllowance = await contractERC20.methods.allowance(defaultAccount, contract._address).call();

    setAllowance(Number(appAllowance));

    const userBalance = await contractERC20.methods.balanceOf(defaultAccount).call();

    setBalance(userBalance);
  };

  useEffect(() => {
    fetchChainData();
    setInterval(() => { fetchChainData(); }, REFRESH_INTERVAL_MILLISECONDS);
  }, [REFRESH_INTERVAL_MILLISECONDS]);

  // Handlers
  const handleApproveERC20 = async () => {
    // Approve ERC20 token to bank contract
    await contractERC20.methods.approve(contract._address, approvalAmount).send({
      from: defaultAccount
    });
  };

  const handleSendERC20 = async () => {
    const polkadotRecipientBytes = Buffer.from(polkadotRecipient, 'hex');

    // Send ERC20 token to bank contract
    await contract.methods.sendERC20(polkadotRecipientBytes, contractERC20._address, depositAmount).send({
      from: defaultAccount,
      gas: 500000,
      value: 0
    });
  };

  // Render
  return (
    <Box>
      <Box marginTop={'15px'}/>
      <Divider />
      <Box marginTop={'15px'}/>
      <Typography gutterBottom
        variant='h5'>
          1. Approve
      </Typography>
      <Typography gutterBottom>
        How many ERC20 tokens would you like to approve to the ERC20 App?
      </Typography>
      <TextField
        InputProps={{
          value: approvalAmount
        }}
        id='erc-input-approval'
        margin='normal'
        onChange={(e) => setApprovalAmount(Number(e.target.value))}
        placeholder='20'
        style={{ margin: 5 }}
        variant='outlined'
      />
      <Box alignItems='center'
        display='flex'
        justifyContent='space-around'>
        <Box>
          <Typography>
            Current ERC20 token balance: {balance} TEST
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
            onClick={() => handleApproveERC20()}
            variant='outlined'>
            <Typography variant='button'>
                      Approve
            </Typography>
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box marginTop={'15px'}>
        <Typography gutterBottom
          variant='h5'>
            2. Send
        </Typography>
      </Box>
      <Box display='flex'
        flexDirection='column'>
        <Box padding={1}/>
        <Typography gutterBottom>
            What account would you like to fund on Polkadot?
        </Typography>
        <TextField
          InputProps={{
            value: polkadotRecipient
          }}
          id='erc-input-recipient'
          margin='normal'
          onChange={(e) => setPolkadotRecipient(e.target.value)}
          placeholder={'38j4dG5GzsL1bw...'}
          style={{ margin: 5 }}
          variant='outlined'
        />
        <Box padding={1}/>
        <Typography gutterBottom>
            How many ERC20 tokens would you like to deposit
        </Typography>
        <TextField
          InputProps={{
            value: depositAmount
          }}
          id='erc-input-amount'
          margin='normal'
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder='20'
          style={{ margin: 5 }}
          variant='outlined'
        />
        <Box alignItems='center'
          display='flex'
          justifyContent='space-around'>
          <Box>
            <Typography>
            Current ERC20 App allowance: {allowance} TEST
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
              disabled={allowance === 0}
              fullWidth={true}
              onClick={() => handleSendERC20()}
              variant='outlined'>
              <Typography variant='button'>
                Send
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ------------------------------------------
//               AppERC20 component
// ------------------------------------------
function AppERC20 ({ contract, defaultAccount, web3 }: Props): React.ReactElement<Props> {
  const classes = useStyles();

  // ERC20 token contract instance
  const initialContract: any = null;
  const [tokenContract, setTokenContract] = useState(initialContract);

  // Render
  return (
    <Box className={classes.paper}>
      <Box>
        <Typography align='center'
          gutterBottom
          variant='h5'>
            ERC20 App
        </Typography>
        <LoadERC20Token onContractInstance={(e: any) => setTokenContract(e)}
          web3={web3}/>
        { tokenContract &&
          <ApproveAndSendERC20 contract={contract}
            contractERC20={tokenContract}
            defaultAccount={defaultAccount}/>
        }
      </Box>
    </Box>
  );
}

export default styled(AppERC20)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`;
