// Copyright 2017-2023 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { HexString } from '@polkadot/util/types';

import React, { useCallback, useEffect, useState } from 'react';

import usePreimage from '@polkadot/app-preimages/usePreimage';
import { getProposalThreshold } from '@polkadot/apps-config';
import { Button, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance, usePreimage, useToggle } from '@polkadot/react-hooks';
import { isFunction, isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
}

interface HashState {
  hash?: HexString | null;
  isHashValid: boolean;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function ProposeExternal ({ className = '', isMember, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [{ hash, isHashValid }, setHash] = useState<HashState>({ isHashValid: false });
  const modLocation = useCollectiveInstance('council');
  const preimage = usePreimage(hash);

  const threshold = Math.min(members.length, Math.ceil((members.length || 0) * getProposalThreshold(api)));

  const _onChangeHash = useCallback(
    (hash?: string): void =>
      setHash({ hash: hash as HexString, isHashValid: isHex(hash, 256) }),
    []
  );

  useEffect((): void => {
    if (isHashValid && hash) {
      const proposal = isFunction(api.tx.preimage?.notePreimage) && !isFunction(api.tx.democracy?.notePreimage)
        ? preimage && api.tx.democracy.externalProposeMajority({
          Lookup: {
            hash: preimage.proposalHash,
            len: preimage.proposalLength
          }
        })
        : api.tx.democracy.externalProposeMajority(hash);

      if (proposal) {
        return setProposal({
          proposal,
          proposalLength: proposal.encodedLength || 0
        });
      }
    }

    setProposal({
      proposal: null,
      proposalLength: 0
    });
  }, [api, hash, isHashValid, preimage]);

  if (!modLocation) {
    return null;
  }

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t<string>('Propose external')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          className={className}
          header={t<string>('Propose external (majority)')}
          onClose={toggleVisible}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The council account for the proposal. The selection is filtered by the current members.')}>
              <InputAddress
                filter={members}
                label={t<string>('propose from account')}
                onChange={setAcountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The hash of the proposal image, either already submitted or valid for the specific call.')}>
              <Input
                autoFocus
                isError={!isHashValid}
                label={t<string>('preimage hash')}
                onChange={_onChangeHash}
                value={hash}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!threshold || !members.includes(accountId || '') || !proposal}
              label={t<string>('Propose')}
              onStart={toggleVisible}
              params={
                api.tx[modLocation].propose.meta.args.length === 3
                  ? [threshold, proposal, proposalLength]
                  : [threshold, proposal]
              }
              tx={api.tx[modLocation].propose}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(ProposeExternal);
