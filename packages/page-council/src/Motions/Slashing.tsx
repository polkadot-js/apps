// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useEffect, useMemo, useState } from 'react';

import { getSlashProposalThreshold } from '@polkadot/apps-config';
import { Button, Dropdown, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useAvailableSlashes, useCollectiveInstance, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
}

interface Option {
  text: string;
  value: number;
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function Slashing ({ className = '', isMember, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const slashes = useAvailableSlashes();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposal: null, proposalLength: 0 });
  const [selectedEra, setSelectedEra] = useState(0);
  const modLocation = useCollectiveInstance('council');

  const threshold = Math.ceil((members.length || 0) * getSlashProposalThreshold(api));

  const eras = useMemo(
    () => (slashes || []).map(([era, slashes]): Option => ({
      text: t('era {{era}}, {{count}} slashes', {
        replace: {
          count: slashes.length,
          era: era.toNumber()
        }
      }),
      value: era.toNumber()
    })),
    [slashes, t]
  );

  useEffect((): void => {
    const actioned = selectedEra && slashes?.find(([era]) => era.eqn(selectedEra));
    const proposal = actioned
      ? api.tx.staking.cancelDeferredSlash(actioned[0], actioned[1].map((_, index) => index))
      : null;

    setProposal({
      proposal,
      proposalLength: proposal?.encodedLength || 0
    });
  }, [api, selectedEra, slashes]);

  if (!modLocation || !api.tx.staking) {
    return null;
  }

  return (
    <>
      <Button
        icon='sync'
        isDisabled={!isMember || !slashes.length}
        label={t('Cancel slashes')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          className={className}
          header={t('Revert pending slashes')}
          onClose={toggleVisible}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The council account for the proposal. The selection is filtered by the current members.')}>
              <InputAddress
                filter={members}
                label={t('propose from account')}
                onChange={setAcountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The specific eras on which there are unapplied slashes. For each era a separate proposal is to be made.')}>
              {eras.length
                ? (
                  <Dropdown
                    defaultValue={eras[0].value}
                    label={t('the era to cancel for')}
                    onChange={setSelectedEra}
                    options={eras}
                  />
                )
                : (
                  <Input
                    isDisabled
                    label={t('the era to cancel for')}
                    value={t('no unapplied slashes found')}
                  />
                )
              }
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='sync'
              isDisabled={!threshold || !members.includes(accountId || '') || !proposal}
              label={t('Revert')}
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

export default React.memo(Slashing);
