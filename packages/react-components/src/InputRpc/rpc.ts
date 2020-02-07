import polkadotRPC from '@polkadot/jsonrpc';
import ormlRPC from '@orml/jsonrpc';

export default { ...polkadotRPC, ...ormlRPC };
