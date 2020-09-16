// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/keyring/types';

import { u8aToHex, u8aToU8a } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { schnorrkelVerify } from '@polkadot/util-crypto/schnorrkel';

import React, { useCallback, useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { Button, InputAddress, Modal, Password, Input, Extrinsic, TxButton } from '@polkadot/react-components';


import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BalanceFree } from '@polkadot/react-query';

import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
  proposal: object;
  pair: KeyringPair | null;
}

export const DockDIDMethod = 'dock';
export const DockDIDQualifier = `did:${DockDIDMethod}:`;
export const DockDIDByteSize = 32;

/**
 * Check if the given input is hexadecimal or not. Optionally checks for the byte size of the hex. Case-insensitive on hex chars
 * @param {string} value - Hexadecimal value
 * @param {number} [byteSize] - Expected byte size of the input.
 * @return {Boolean} True if hex (with given size) else false
 */
export function isHexWithGivenByteSize(value, byteSize = undefined) {
  const match = value.match(/^0x([0-9a-f]+$)/i);
  if (match && match.length > 1) {
    if (byteSize !== undefined) {
      // If `byteSize` is not a positive integer type, then check will fail
      // 2 hex digits make a byte
      return match[1].length === (2 * byteSize);
    }
    // Don't care about byte size of the match but it must be full byte
    return (match[1].length % 2) === 0;
  }
  return false;
}

/**
 * Check if the given identifier is 32 byte hex
 * @param {string} identifier - The identifier to check.
 * @return {void} Throws exception if invalid identifier
 */
export function validateDockDIDHexIdentifier(identifier) {
  // Byte size of the Dock DID identifier, i.e. the `DockDIDQualifier` is not counted.
  if (!isHexWithGivenByteSize(identifier, DockDIDByteSize)) {
    throw new Error(`DID identifier must be ${DockDIDByteSize} bytes`);
  }
}

/**
 * Gets the hexadecimal value of the given string.
 * @return {string} Returns the hexadecimal representation of the ID.
 */
export function getHexIdentifier(id, qualifier, validate, byteSize) {
  if (id.startsWith(qualifier)) {
    // Fully qualified ID. Remove the qualifier
    const ss58Did = id.slice(qualifier.length);
    try {
      const hex = u8aToHex(decodeAddress(ss58Did));
      // 2 characters for `0x` and 2*byte size of ID
      if (hex.length !== (2 + 2 * byteSize)) {
        throw new Error('Unexpected byte size');
      }
      return hex;
    } catch (e) {
      throw new Error(`Invalid SS58 ID ${id}. ${e}`);
    }
  } else {
    try {
      // Check if hex and of correct size and return the hex value if successful.
      validate(id);
      return id;
    } catch (e) {
      // Cannot parse as hex
      throw new Error(`Invalid hexadecimal ID ${id}. ${e}`);
    }
  }
}

/**
 * Gets the hexadecimal value of the given DID.
 * @param {string} did -  The DID can be passed as fully qualified DID like `dock:did:<SS58 string>` or
 * a 32 byte hex string
 * @return {string} Returns the hexadecimal representation of the DID.
 */
export function getHexIdentifierFromDID(did) {
  return getHexIdentifier(did, DockDIDQualifier, validateDockDIDHexIdentifier, DockDIDByteSize);
}

function getFullyQualifiedDID(did) {
  return `${DockDIDQualifier}${did}`;
}

/**
 * Dumps call into a StateChange::MasterVote and serializes the result.
 * Round number is inferred from current chainstate.
 * @param api
 * @param call - as on-chain type
 * @returns {Promise<()>}
 */
async function asEncodedStateChange(api, call, roundNo) {
  let payload = {
    proposal: [...call.toU8a()],
    round_no: roundNo
  };

  return api.createType('StateChange', { MasterVote: payload }).toU8a();
}

/**
 * Convert a list of [did, signature] pairs to Proof of Master Authorization
 * `did` and `signature` should both be formated as 0x-prefixed hex.
 * @param api
 * @param votes
 * @returns {Promise<()>}
 */
function toPMAuth(api, votes) {
  let dtk_sorted = [...votes];
  dtk_sorted.sort(); // this relies on dids being hex encoded

  let vote_map = new Map();
  for (let [did, key] of dtk_sorted) {
    if (!did || !key) {
      continue;
    }

    vote_map.set(did, { Sr25519: key });
  }

  return api.createType('PMAuth', vote_map);
}

/**
 * Throws descriptive error if the proof of authorization is insufficient.
 * Checks that
 * - all signatures are valid over proposal for current voting round
 * - all dids are members of master
 * - number of votes is sufficient
 * @param api
 * @param proposal - as on-chain type Call
 * @param pmauth - as on-chain type pmauth
 * @returns {Promise<()>}
 */
async function assertValidAuth(api, proposal, pmauth, membership, roundNo) {
  if (!membership) {
    throw `No membership info from chain`;
  }

  // * - all signatures are valid over proposal for current voting round
  const encoded_state_change = await asEncodedStateChange(api, proposal, roundNo);
  for (let [did, sig] of pmauth) {
    const idStr = typeof did === 'string' ? did : u8aToHex(did);
    const hexId = getHexIdentifierFromDID(idStr);

    // If given DID was in hex, encode to SS58 and then construct fully qualified DID else the DID was already fully qualified
    const id = (idStr === hexId) ? getFullyQualifiedDID(encodeAddress(hexId)) : did;

    if (!(u8aToHex(did) === hexId || did === id)) {
      throw `DID invalid:\nQualified: ${id}\nHex: ${hexId}`;
    }

    let did_doc = await api.query.didModule.dids(u8aToU8a(hexId));
    if (!did_doc.isSome) {
      throw `DID document doesnt exist:\nQualified: ${id}\nHex: ${hexId}`;
    }

    let pk = did_doc.unwrap()[0].public_key;
    if (!pk.isSr25519) {
      throw `This script only supports sr25519. The public key registered for ${did} is not sr25519.`;
    }

    let srpk = pk.asSr25519.value;
    let srsig = sig.asSr25519.value;
    let ver = schnorrkelVerify(encoded_state_change, srsig, srpk);
    if (!ver) {
      throw `Signature invalid:\n` +
      `  payload: ${u8aToHex(encoded_state_change)}\n` +
      `  did:     ${did}\n` +
      `  public:  ${srpk}\n` +
      `  sig:     ${srsig}`;
    }
  }

  // * - all dids are members of master
  for (let [did, _sig] of pmauth) {
    let is_member = [...membership.members].some(member => u8aToHex(member) === u8aToHex(did));
    if (!is_member) {
      throw `${did} is not a member of master`;
    }
  }

  // * - number of votes is sufficient
  let vote_count = [...pmauth].length;
  if (membership.vote_requirement > vote_count) {
    throw `Not enough votes. ${membership.vote_requirement} required. ${vote_count} provided.`;
  }
}

function SignatureDIDs ({ onClose, proposal, pair }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [address, setAddress] = useState('');
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [pairCount, setPairCount] = useState(1);
  const [membership, setMembership] = useState(null);
  const [didSignaturePairs, setDidSignaturePairs] = useState([]);

  const { apiDefaultTxSudo } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  const _onExtrinsicChange = useCallback(
    (method?: SubmittableExtrinsic<'promise'>) => setExtrinsic(() => method || null),
    []
  );

  const _setMasterReqs = async () => {
    const members = await api.query.master.members();
    const membersList = Array.from(members.members);
    const curLen = didSignaturePairs.length;
    const reqCount = Math.max(membersList.length, parseInt(members.vote_requirement));
    for (let i = curLen; i < reqCount; i++) {
      didSignaturePairs.push([u8aToHex(membersList[i]), '']);
    }

    setMembership(members);
    setPairCount(didSignaturePairs.length);
  };

  useEffect((): void => {
    if (!membership) {
      _setMasterReqs();
    }
  }, [membership, proposal]);

  useEffect((): void => {
    setAddress(pair?.address || '');
  }, [pair?.address]);

  const doAuthStuff = async () => {
    setUnlockError(null);

    if (!membership || !proposal) {
      return;
    }

    let call;
    try {
      call = api.createType('Call', proposal);
    } catch (error) {
      setUnlockError(`${error.message || error}`);
      setExtrinsic(() => null);
      return;
    }

    const roundNo = await api.query.master.round();

    // verify votes are valid and sufficient before submitting
    let pmauth;
    try {
      pmauth = toPMAuth(api, didSignaturePairs);
      await assertValidAuth(api, call, pmauth, membership, roundNo.toNumber());
    } catch (error) {
      setUnlockError(`${error.message || error}`);
      setExtrinsic(() => null);
      return;
    }

    // combine signatures and encoded call into a single "execute" extrinsic
    const extrinsic = api.tx.master.execute(call, pmauth);
    setExtrinsic(() => extrinsic);
  };

  const _onAddDIDPair = useCallback(
    (): void => {
      didSignaturePairs.push(['', '']);
      setDidSignaturePairs(didSignaturePairs);
      setPairCount(didSignaturePairs.length);
    },
    [didSignaturePairs]
  );

  if (!pair) {
    return null;
  }

  return (
    <Modal
      className='toolbox--Unlock'
      header={t<string>('execute proposal')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              label={t<string>('using the selected account')}
              labelExtra={
                <BalanceFree
                  label={<label>{t<string>('free balance')}</label>}
                  params={address}
                />
              }
              onChange={setAccountId}
              type='account'
              value={address}
            />

          </Modal.Column>
          <Modal.Column>
            <p>{t<string>(`This account will used to pay for and submit the proposal. It requires at least ${membership ? membership.vote_requirement : 0} master member DID/signature pairs to execute successfully.`)}</p>
          </Modal.Column>
        </Modal.Columns>

        <Button.Group>
          <Button
            icon='plus'
            label={t<string>('Add DID/Signature pair')}
            onClick={_onAddDIDPair}
          />
        </Button.Group>

        {didSignaturePairs.map((didSigPair, index) => {
          return (
            <Modal.Columns key={index}>
              <Modal.Column>
                <Input
                  help={t<string>('The master member\'s vote signature.')}
                  isError={!!unlockError}
                  label={t<string>('signature')}
                  onChange={(value) => {
                    didSigPair[1] = value;
                    setDidSignaturePairs([...didSignaturePairs]);
                    doAuthStuff();
                  }}
                  value={didSigPair[1]}
                />
              </Modal.Column>
              <Modal.Column>
                <Input
                  autoFocus
                  help={t<string>('The master member\'s associated DID.')}
                  isError={!!unlockError}
                  label={t<string>('DID')}
                  onChange={(value) => {
                    didSigPair[0] = value;
                    setDidSignaturePairs([...didSignaturePairs]);
                    doAuthStuff();
                  }}
                  value={didSigPair[0]}
                />
              </Modal.Column>
            </Modal.Columns>
          );
        })}

        <div className='extrinsics--Selection'>
          <Extrinsic
            defaultValue={api.tx.master.execute}
            label={t<string>('submit the following extrinsic')}
            isDisabled={true}
          />
          {unlockError && (
            <article className='error'>{unlockError}</article>
          )}
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={extrinsic}
          icon='sign-in-alt'
          isDisabled={!extrinsic || !accountId || unlockError}
          isPrimary={false}
          label={t<string>('Submit Transaction')}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SignatureDIDs);
