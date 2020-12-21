import { useQuery, useSubscription } from 'react-apollo';

export function getSub(query) {
  const { loading, error, data } = useSubscription(query);
  return [data, error, loading];
}

export function getQuery(query) {
  const { loading, error, data } = useQuery(query);
  return [data, error, loading];
}

// XXX: Why is this called `toPolkadot`?
export function accountToPolkadot(account, api) {
  const accountId = api.createType('AccountId', account.account_id);
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

// XXX: Why is this called `toPolkadot`?
export async function transferToPolkadot(event, api) {
  const args = event.args ? JSON.parse(event.args) : [null, null];
  const number = api.createType('BlockNumber', event.block_number);
  const from = api.createType('AccountId', event.signer);
  const to = api.createType('AccountId', args[0]);
  // const hash = api.createType('Hash', event.hash);
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

export function blockToPolkadotBlock(block, api) {
  const author = api.createType('AccountId', block.block_author);
  const hash = api.createType('Hash', block.block_hash);
  const parentHash = api.createType('Hash', block.parent_hash);
  const stateRoot = api.createType('Hash', block.state_root);
  const extrinsicsRoot = api.createType('Hash', block.extrinsics_root);
  const number = api.createType('BlockNumber', block.block_number);
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
  const blockNumber = api.createType('BlockNumber', extrinsic.block_number);
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber.toNumber());
  const indexes = [extrinsic.extrinsic_index];
  const args = JSON.parse(extrinsic.args);

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
        data: args
      },
      topics: []
    }
  };
}

export async function eventToPolkadot(event, api) {
  const blockNumber = api.createType('BlockNumber', event.block_number);
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
