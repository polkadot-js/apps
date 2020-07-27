// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import { getThreshold } from './thresholds';
import useAvailableSlashes from './useAvailableSlashes';

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

function Slashing ({ className = '', isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const slashes = useAvailableSlashes();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposal: null, proposalLength: 0 });
  const [eras, setEras] = useState<Option[]>([]);
  const [selectedEra, setSelectedEra] = useState(0);
  const threshold = Math.ceil((members.length || 0) * getThreshold(api));

  useEffect((): void => {
    setEras(
      (slashes || []).map(([era, slashes]): Option => ({
        text: t<string>('era {{era}}, {{count}} slashes', {
          replace: {
            count: slashes.length,
            era: era.toNumber()
          }
        }),
        value: era.toNumber()
      }))
    );
  }, [slashes, t]);

  useEffect((): void => {
    const actioned = selectedEra && slashes && slashes.find(([era]): boolean => era.eqn(selectedEra));
    const proposal = actioned
      ? api.tx.staking.cancelDeferredSlash(actioned[0], actioned[1].map((_, index): number => index))
      : null;

    setProposal({
      proposal,
      proposalLength: proposal?.encodedLength || 0
    });
  }, [api, selectedEra, slashes]);

  return (
    <>
      <Button
        icon='sync'
        isDisabled={!isMember || !slashes.length}
        label={t<string>('Cancel slashes')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          className={className}
          header={t<string>('Revert pending slashes')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t<string>('Select the account you wish to make the proposal with.')}
                  label={t<string>('propose from account')}
                  onChange={setAcountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The council account for the proposal. The selection is filtered by the current members.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                {eras.length
                  ? (
                    <Dropdown
                      defaultValue={eras[0].value}
                      help={t<string>('The unapplied slashed era to cancel.')}
                      label={t<string>('the era to cancel for')}
                      onChange={setSelectedEra}
                      options={eras}
                    />
                  )
                  : (
                    <Input
                      isDisabled
                      label={t<string>('the era to cancel for')}
                      value={t<string>('no unapplied slashes found')}
                    />
                  )
                }
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The specific eras on which there are unapplied slashes. For each era a separate proposal is to be made.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              icon='sync'
              isDisabled={!threshold || !members.includes(accountId || '') || !proposal}
              label={t<string>('Revert')}
              onStart={toggleVisible}
              params={
                api.tx.council.propose.meta.args.length === 3
                  ? [threshold, proposal, proposalLength]
                  : [threshold, proposal]
              }
              tx='council.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Slashing);
