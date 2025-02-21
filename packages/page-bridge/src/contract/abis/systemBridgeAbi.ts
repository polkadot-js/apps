export const SystemBridgeAbi = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "inputs": [{"internalType": "address", "name": "target", "type": "address"}],
  "name": "AddressEmptyCode",
  "type": "error"
}, {
  "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
  "name": "AddressInsufficientBalance",
  "type": "error"
}, {
  "inputs": [{"internalType": "address", "name": "implementation", "type": "address"}],
  "name": "ERC1967InvalidImplementation",
  "type": "error"
}, {"inputs": [], "name": "ERC1967NonPayable", "type": "error"}, {
  "inputs": [],
  "name": "EnforcedPause",
  "type": "error"
}, {"inputs": [], "name": "ExpectedPause", "type": "error"}, {
  "inputs": [],
  "name": "FailedInnerCall",
  "type": "error"
}, {"inputs": [], "name": "InvalidInitialization", "type": "error"}, {
  "inputs": [],
  "name": "NotInitializing",
  "type": "error"
}, {
  "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
  "name": "OwnableInvalidOwner",
  "type": "error"
}, {
  "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
  "name": "OwnableUnauthorizedAccount",
  "type": "error"
}, {
  "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
  "name": "SafeERC20FailedOperation",
  "type": "error"
}, {"inputs": [], "name": "UUPSUnauthorizedCallContext", "type": "error"}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "slot",
    "type": "bytes32"
  }], "name": "UUPSUnsupportedProxiableUUID", "type": "error"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "uint32", "name": "assetId", "type": "uint32"}, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "reversedTxId",
    "type": "bytes32"
  }, {"indexed": false, "internalType": "address", "name": "account", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }, {"indexed": false, "internalType": "uint256", "name": "blockNumber", "type": "uint256"}],
  "name": "DepositFromBitcoin",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "uint64", "name": "nonce", "type": "uint64"}, {
    "indexed": false,
    "internalType": "bool",
    "name": "isGas",
    "type": "bool"
  }, {"indexed": false, "internalType": "bytes32", "name": "from", "type": "bytes32"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"indexed": false, "internalType": "address", "name": "to", "type": "address"}, {
    "indexed": false,
    "internalType": "uint32",
    "name": "blockNumber",
    "type": "uint32"
  }],
  "name": "DepositFromWasm",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "uint64", "name": "version", "type": "uint64"}],
  "name": "Initialized",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {
    "indexed": true,
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
  "name": "Paused",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "components": [{
      "internalType": "address",
      "name": "token",
      "type": "address"
    }, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {
      "internalType": "uint256",
      "name": "fee",
      "type": "uint256"
    }, {"internalType": "string", "name": "feeType", "type": "string"}, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "estimateReceiveAmount", "type": "uint256"}, {
      "internalType": "bool",
      "name": "isGas",
      "type": "bool"
    }, {"internalType": "uint256", "name": "coldAmount", "type": "uint256"}, {
      "internalType": "uint256",
      "name": "wasmAmount",
      "type": "uint256"
    }, {"internalType": "string", "name": "result", "type": "string"}],
    "indexed": false,
    "internalType": "struct PrepaidGasFeeInfo",
    "name": "info",
    "type": "tuple"
  }],
  "name": "PrepaidGasFee",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
  "name": "Unpaused",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "implementation", "type": "address"}],
  "name": "Upgraded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "sender", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"indexed": false, "internalType": "uint256", "name": "withdrawId", "type": "uint256"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "FeeWith18Decimals",
    "type": "uint256"
  }, {"indexed": false, "internalType": "string", "name": "receiver", "type": "string"}],
  "name": "WithdrawGas",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "from", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"indexed": false, "internalType": "bytes32", "name": "to", "type": "bytes32"}],
  "name": "WithdrawGov",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "sender", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"indexed": false, "internalType": "uint256", "name": "withdrawId", "type": "uint256"}],
  "name": "WithdrawLightning",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "sender", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"indexed": false, "internalType": "uint256", "name": "withdrawId", "type": "uint256"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "FeeWith18Decimals",
    "type": "uint256"
  }, {"indexed": false, "internalType": "address", "name": "token", "type": "address"}, {
    "indexed": false,
    "internalType": "string",
    "name": "receiver",
    "type": "string"
  }],
  "name": "WithdrawOther",
  "type": "event"
}, {"stateMutability": "payable", "type": "fallback"}, {
  "inputs": [],
  "name": "UPGRADE_INTERFACE_VERSION",
  "outputs": [{"internalType": "string", "name": "", "type": "string"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "btcDust",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [],
  "name": "cold",
  "outputs": [{"internalType": "address", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "currentBitcoinFees",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }, {"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint32", "name": "assetId", "type": "uint32"}, {
    "internalType": "bytes32",
    "name": "reversedTxId",
    "type": "bytes32"
  }, {"internalType": "address", "name": "account", "type": "address"}, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "depositFromBitcoin",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "bool", "name": "isGas", "type": "bool"}, {
    "internalType": "bytes32",
    "name": "from",
    "type": "bytes32"
  }, {"internalType": "uint256", "name": "value", "type": "uint256"}, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {"internalType": "uint32", "name": "blockNumber", "type": "uint32"}],
  "name": "depositFromWasm",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "depositNonce",
  "outputs": [{"internalType": "uint64", "name": "", "type": "uint64"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "gasDecimalsOnBitcoin",
  "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "gasFactor",
  "outputs": [{
    "components": [{"internalType": "uint64", "name": "mul", "type": "uint64"}, {
      "internalType": "uint64",
      "name": "div",
      "type": "uint64"
    }], "internalType": "struct GasFactor", "name": "", "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
  "name": "gasGuarder",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "gasTypeHash",
  "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "components": [{
      "internalType": "uint8",
      "name": "gasDecimalsOnBitcoin",
      "type": "uint8"
    }, {"internalType": "address", "name": "cold", "type": "address"}, {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }, {"internalType": "uint64", "name": "gasFactorMul", "type": "uint64"}, {
      "internalType": "uint64",
      "name": "gasFactorDiv",
      "type": "uint64"
    }, {"internalType": "uint64", "name": "withdrawNonce", "type": "uint64"}, {
      "internalType": "uint64",
      "name": "depositNonce",
      "type": "uint64"
    }, {"internalType": "uint64", "name": "wasmWithdrawNonce", "type": "uint64"}, {
      "internalType": "uint64",
      "name": "wasmDepositNonce",
      "type": "uint64"
    }, {"internalType": "string", "name": "gasType", "type": "string"}],
    "internalType": "struct InitialParameters",
    "name": "_init",
    "type": "tuple"
  }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [],
  "name": "owner",
  "outputs": [{"internalType": "address", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
}, {"inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function"}, {
  "inputs": [],
  "name": "paused",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "token", "type": "address"}, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "prepaidGasFee",
  "outputs": [{
    "components": [{
      "internalType": "address",
      "name": "token",
      "type": "address"
    }, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {
      "internalType": "uint256",
      "name": "fee",
      "type": "uint256"
    }, {"internalType": "string", "name": "feeType", "type": "string"}, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "estimateReceiveAmount", "type": "uint256"}, {
      "internalType": "bool",
      "name": "isGas",
      "type": "bool"
    }, {"internalType": "uint256", "name": "coldAmount", "type": "uint256"}, {
      "internalType": "uint256",
      "name": "wasmAmount",
      "type": "uint256"
    }, {"internalType": "string", "name": "result", "type": "string"}],
    "internalType": "struct PrepaidGasFeeInfo",
    "name": "",
    "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint64", "name": "nonce", "type": "uint64"}],
  "name": "recordsV3ByNonce",
  "outputs": [{
    "components": [{
      "internalType": "uint32",
      "name": "assetId",
      "type": "uint32"
    }, {"internalType": "uint64", "name": "nonce", "type": "uint64"}, {
      "internalType": "bytes32",
      "name": "txId",
      "type": "bytes32"
    }, {"internalType": "address", "name": "account", "type": "address"}, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "blockNumber", "type": "uint256"}],
    "internalType": "struct DepositRecordV3",
    "name": "",
    "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "bytes32", "name": "txid", "type": "bytes32"}],
  "name": "recordsV3ByTxId",
  "outputs": [{
    "components": [{
      "internalType": "uint32",
      "name": "assetId",
      "type": "uint32"
    }, {"internalType": "uint64", "name": "nonce", "type": "uint64"}, {
      "internalType": "bytes32",
      "name": "txId",
      "type": "bytes32"
    }, {"internalType": "address", "name": "account", "type": "address"}, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "blockNumber", "type": "uint256"}],
    "internalType": "struct DepositRecordV3",
    "name": "",
    "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint64", "name": "nonce", "type": "uint64"}],
  "name": "recordsWasm",
  "outputs": [{
    "components": [{"internalType": "uint64", "name": "nonce", "type": "uint64"}, {
      "internalType": "bool",
      "name": "isGas",
      "type": "bool"
    }, {"internalType": "bytes32", "name": "from", "type": "bytes32"}, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }, {"internalType": "address", "name": "to", "type": "address"}, {
      "internalType": "uint32",
      "name": "blockNumber",
      "type": "uint32"
    }], "internalType": "struct WasmDepositRecord", "name": "", "type": "tuple"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "string", "name": "", "type": "string"}],
  "name": "reinitialize",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "newCold", "type": "address"}],
  "name": "setCold",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint64", "name": "newMul", "type": "uint64"}, {
    "internalType": "uint64",
    "name": "newDiv",
    "type": "uint64"
  }], "name": "setGasFactor", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "guarder", "type": "address"}, {
    "internalType": "bool",
    "name": "flag",
    "type": "bool"
  }], "name": "setGasGuarder", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "unpause",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "newImplementation", "type": "address"}, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }], "name": "upgradeToAndCall", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
  "inputs": [],
  "name": "version",
  "outputs": [{"internalType": "string", "name": "", "type": "string"}],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [],
  "name": "wasmDepositNonce",
  "outputs": [{"internalType": "uint64", "name": "", "type": "uint64"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "wasmWithdrawNonce",
  "outputs": [{"internalType": "uint64", "name": "", "type": "uint64"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "value", "type": "uint256"}, {
    "internalType": "bytes32",
    "name": "substratePubkey",
    "type": "bytes32"
  }], "name": "withdrawGov", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [],
  "name": "withdrawNonce",
  "outputs": [{"internalType": "uint64", "name": "", "type": "uint64"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "token", "type": "address"}, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {"internalType": "string", "name": "btcAddr", "type": "string"}],
  "name": "withdrawToBitcoin",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {
    "internalType": "string",
    "name": "lightningInvoice",
    "type": "string"
  }], "name": "withdrawToLightning", "outputs": [], "stateMutability": "payable", "type": "function"
}, {"stateMutability": "payable", "type": "receive"}]
