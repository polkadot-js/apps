// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallFunction } from '@polkadot/types/types';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Dropdown, Input, Modal, TxAccount, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useModal } from '@polkadot/react-hooks';

import { useTranslation } from './translate';
import useAvailableSlashes from './useAvailableSlashes';

interface Option {
  text: string;
  value: number;
}

interface Props {
  className?: string;
  isMember?: boolean;
  members?: string[];
}

export default function Slashing ({ className, isMember, members = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const slashes = useAvailableSlashes();
  const { isOpen, onOpen, onClose } = useModal();
  const [accountId, onChangeAccountId] = useAccountId();

  const [proposal, setProposal] = useState<CallFunction | null>(null);
  const [eras, setEras] = useState<Option[]>([]);
  const [selectedEra, setSelectedEra] = useState(0);
  const onSendRef = useRef<() => void>();

  const threshold = Math.ceil(members.length * 0.5);

  useEffect((): void => {
    if (slashes?.length) {
      setEras(
        slashes.map(([era, slashes]): Option => ({
          text: t('era {{era}}, {{count}} slashes', {
            replace: {
              count: slashes.length,
              era: era.toNumber()
            }
          }),
          value: era.toNumber()
        }))
      );
    } else {
      setEras([]);
    }
  }, [slashes]);

  useEffect((): void => {
    const actioned = selectedEra && slashes?.find(([era]): boolean => era.eqn(selectedEra));

    setProposal((): any =>
      actioned
        ? api.tx.staking.cancelDeferredSlash(actioned[0], actioned[1].map((_, index): number => index))
        : null
    );
  }, [selectedEra, slashes]);

  return (
    <>
      <Button
        icon='cancel'
        isDisabled={!isMember || !members?.length || !slashes.length}
        isPrimary
        label={t('Cancel slashes')}
        onClick={onOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t('Revert pending slashes')}
          onClose={onClose}
        >
          <Modal.Content>
            <TxAccount
              help={t('Select the account you wish to make the proposal with.')}
              label={t('propose from account')}
              onChange={onChangeAccountId}
            />
            {eras.length
              ? (
                <Dropdown
                  defaultValue={eras[0].value}
                  help={t('The unapplied slashed era to cancel.')}
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
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={accountId}
              icon='repeat'
              isDisabled={!threshold || !members.includes(accountId || '') || !proposal}
              isPrimary
              label={t('Revert')}
              onStart={onClose}
              onSendRef={onSendRef}
              params={[threshold, proposal]}
              tx='council.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}
