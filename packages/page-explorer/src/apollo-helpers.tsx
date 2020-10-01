import { useQuery, useSubscription } from 'react-apollo';
import { registry } from '@polkadot/react-api';

export function getSub(query) {
  const { loading, error, data } = useSubscription(query);
  return [data, error, loading];
}

export function getQuery(query) {
  const { loading, error, data } = useQuery(query);
  return [data, error, loading];
}

export function accountToPolkadot(account) {
  const accountId = registry.createType('AccountId', account.account_id);
  return {
    account: accountId,
    // HACK: polkadotjs assertion fails if balance > 0x20000000000000
    free_balance: account.free_balance && Math.min(0x20000000000000 - 1, account.free_balance),
    locked_balance: account.locked_balance && Math.min(0x20000000000000 - 1, account.locked_balance),
    available_balance: account.available_balance && Math.min(0x20000000000000 - 1, account.available_balance),
    produced_blocks: account.produced_blocks,
    nonce: account.nonce,
  };
}

export async function transferToPolkadot(event, api) {
  const args = event.args ? JSON.parse(event.args) : [null, null];
  const number = registry.createType('BlockNumber', event.block_number);
  const from = registry.createType('AccountId', event.signer);
  const to = registry.createType('AccountId', args[0]);
  // const hash = registry.createType('Hash', event.hash);
  const hash = await api.rpc.chain.getBlockHash(number.toNumber());
  const amount = args[1];
  return {
    number,
    from,
    to,
    amount,
    hash,
  };
}

export function blockToPolkadotBlock(block) {
  const author = registry.createType('AccountId', block.block_author);
  const hash = registry.createType('Hash', block.block_hash);
  const parentHash = registry.createType('Hash', block.parent_hash);
  const stateRoot = registry.createType('Hash', block.state_root);
  const extrinsicsRoot = registry.createType('Hash', block.extrinsics_root);
  const number = registry.createType('BlockNumber', block.block_number);
  return {
    hash,
    parentHash,
    number,
    stateRoot,
    extrinsicsRoot,
    author,
    digest: 0,
  };
}

export async function extrinsicToPolkadot(extrinsic, api) {
  const blockNumber = registry.createType('BlockNumber', extrinsic.block_number);
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber.toNumber());
  const indexes = [extrinsic.extrinsic_index];
  return {
    blockHash,
    blockNumber,
    indexes,
    key: `${blockNumber.toNumber()}-${extrinsic.hash}-${indexes.join('.')}`,
    record: {
      phase: extrinsic.phase,
      event: {
        typeDef: [],
        section: extrinsic.section,
        method: extrinsic.method,
        index: extrinsic.extrinsic_index,
        data: [{}]
      },
      topics: []
    }
  };
}

export async function eventToPolkadot(event, api) {
  const blockNumber = registry.createType('BlockNumber', event.block_number);
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber.toNumber());
  // var eveants = await api.query.system.events.at(blockHash);
  // console.log('blockHashevents', eveants)

  const indexes = [event.event_index];
  return {
    blockHash,
    blockNumber,
    indexes,
    key: `${blockNumber.toNumber()}-${blockHash}-${indexes.join('.')}`,
    record: {
      phase: event.phase, // custom type
      event: {
        typeDef: [], // custom type list i think
        section: event.section,
        method: event.method,
        index: event.event_index,// custom type
        data: [JSON.parse(event.data)] // value: metadataEvents.<computed> [Type, registry: TypeRegistry, _Types: Array(1), __private_44_meta: Map(3), __private_45_method: "NewSession", __private_46_section: "session", …]
      },
      topics: []  // custom type in array
    }
  };
}
