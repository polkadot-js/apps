import { SystemBridgeAbi } from './abis/systemBridgeAbi.js'
import { Erc20Abi } from './abis/erc20Abi.js'

const SYSTEM_BRIDGE_ADDRESSES: Record<number, string> = {
  11501: '0xa778e765402B2E3df8029B43011C9b8149767536',
  11503: '',
  11504: '0xe922a087ca192ffdaa32ecb6a3ad3320bffdd83b',
}

const BEVM_ADDRESSES: Record<number, string> = {
  11501: '0xdCa01E9c0f6E7B3a8dF8297176ab4C94be89B6BB',
  11503: '',
  11504: '0x974bEA4Fe275b58f006dB50d9Eb06Fc68E972e1e'
}

export { SystemBridgeAbi, Erc20Abi, SYSTEM_BRIDGE_ADDRESSES, BEVM_ADDRESSES }
