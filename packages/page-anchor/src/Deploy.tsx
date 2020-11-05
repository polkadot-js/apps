import React, { useState, useEffect } from 'react';
import assert from 'assert';
import { dehex } from './hrproof';
import _ from 'lodash';
import { useApi } from '@polkadot/react-hooks';
import ApiPromise from '@polkadot/api/promise';
import { u8aToHex } from '@polkadot/util';
import { blake2b256 } from './hash';
import HexInput from './HexInput';
import { ApiProps } from '@polkadot/react-api/types';
// import TxSigned from '@polkadot/react-signer/TxSigned';
import { Modal } from '@polkadot/react-components';

enum Posted {
  WillCheck,
  Checking,
  Posted,
  NotPosted,
}

// a variant of a sum ADT
type Tagged<Tag, T> = {
  tag: Tag,
  data: T,
}

// construct a tagged type
function tg<Tag, T>(tag: Tag, data: T): Tagged<Tag, T> {
  return { tag, data };
}

// This is a tagged union.
type State =
  Tagged<'NoInput', null> |
  Tagged<'ReceivedInput', {
    anchorPosted: Posted,
    anchorbytes: Uint8Array,
  }>;

const transitions = {
  // received bytes as input
  bytesInput(bs: Uint8Array | null, setState: (_: State) => void) {
    if (bs === null) {
      setState(tg('NoInput', null));
    } else {
      setState(tg('ReceivedInput', {
        anchorPosted: Posted.Checking,
        anchorbytes: bs,
      }));
    }
  },

  // the status of an anchor was received from the chain
  anchorStatus(state: State, isPosted: boolean, setState: (_: State) => void) {
    assert(state.tag !== 'NoInput');
    let { anchorbytes } = state.data;
    const anchorPosted = isPosted ? Posted.Posted : Posted.NotPosted;
    setState(tg('ReceivedInput', { anchorPosted, anchorbytes }));
  },
};

function Deploy(): React.ReactElement {
  const [state, setState] = useState<State>(tg('NoInput', null));
  const apiProps: ApiProps = useApi();

  useEffect(() => {
    if (state.tag === 'NoInput') { return; }
    check(state.data.anchorbytes, apiProps.api)
      .then(exists => transitions.anchorStatus(state, exists, setState));
  }, [state, apiProps]);

  return <div>
    <HexInput
      defaultValue={getPayloadFromSearchParams() || new Uint8Array([])}
      onbytes={bs => transitions.bytesInput(bs, setState)}
    />
    <Modal
      size='large'
      open={false}
    >
      {/* <TxSigned currentItem={currentItem} requestAddress={requestAddress} /> */}
    </Modal>
  </div>;
}

// Check to see if a block was anchored.
// TODO: subscribe to storage instead of just checking once at start
async function check(hash: Uint8Array, nc: ApiPromise): Promise<boolean> {
  let opt: any = await nc.query.anchor.anchors(u8aToHex(await blake2b256(hash)));
  assert(opt.isNone ^ opt.isSome);
  return opt.isSome;
}

function getPayloadFromSearchParams(): Uint8Array | null {
  const params = new URLSearchParams(window.location.search);
  if (params.has('deployRoot')) {
    try {
      return dehex(params.get('deployRoot') as string);
    } catch (_) { }
  }
  return null;
}

export default React.memo(Deploy);
