// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

export default {
  "Address": "MultiAddress",
  "LookupSource": "MultiAddress",
  "ChannelId": {
    "_enum": {
      "Basic": null,
      "Incentivized": null
    }
  },
  "Message": {
    "data": "Vec<u8>",
    "proof": "Proof"
  },
  "Proof": {
    "blockHash": "H256",
    "txIndex": "u32",
    "data": "(Vec<Vec<u8>>, Vec<Vec<u8>>)"
  },
  "EthereumHeader": {
    "parentHash": "H256",
    "timestamp": "u64",
    "number": "u64",
    "author": "H160",
    "transactionsRoot": "H256",
    "ommersHash": "H256",
    "extraData": "Vec<u8>",
    "stateRoot": "H256",
    "receiptsRoot": "H256",
    "logBloom": "Bloom",
    "gasUsed": "U256",
    "gasLimit": "U256",
    "difficulty": "U256",
    "seal": "Vec<Vec<u8>>"
  },
  "EthashProofData": {
    "dagNodes": "[H512; 2]",
    "proof": "Vec<H128>"
  },
  "Bloom": {
    "_": "[u8; 256]"
  },
  "AssetId": {
    "_enum": {
      "ETH": null,
      "Token": "H160"
    }
  }
};
