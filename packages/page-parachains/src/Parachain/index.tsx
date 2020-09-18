// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveParachainInfo, DeriveParachainFull } from '@polkadot/api-derive/types';

import React, { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, CardSummary, Columar, Column, Icon, Menu, Popup, Spinner, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall, useModal, useToggle } from '@polkadot/react-hooks';
import { isNull, isUndefined } from '@polkadot/util';

import ParachainInfo from '../ParachainInfo';
import Deregister from './Deregister';
import DispatchQueue from './DispatchQueue';
import Details from './Details';

import { useTranslation } from '../translate';

interface Props {
  basePath: string;
  className?: string;
  isMine?: boolean;
  paraInfoRef: React.MutableRefObject<DeriveParachainInfo | null>;
  sudoKey?: string;
}

function Parachain ({ basePath, className = '', isMine, paraInfoRef, sudoKey }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const history = useHistory();
  const { api } = useApi();
  const { id } = useParams<{ id: string }>();
  const [isMenuOpen, toggleMenu] = useToggle();
  const { isOpen: isDeregisterOpen, onClose: onDeregisterClose, onOpen: onDeregisterOpen } = useModal();
  const parachain = useCall<DeriveParachainFull | null>(api.derive.parachains.info, [id || null]);

  const onDeregister = useCallback(
    () => history.push(basePath),
    [basePath, history]
  );

  if (isUndefined(parachain)) {
    return (
      <Spinner />
    );
  }

  if (!id || isNull(parachain)) {
    return (
      <>
        <article className='error padded'>
          <div>
            <Icon icon='ban' />
            {t(`No parachain with ${id ? `id ${id.toString()}` : 'this id'} exists`)}
          </div>
        </article>
      </>
    );
  }

  if (!paraInfoRef.current) {
    paraInfoRef.current = parachain.info;
  }

  return (
    <div className={className}>
      <SummaryBox>
        <section>
          <ParachainInfo
            info={parachain.info}
            isBig
          >
            {(sudoKey && isMine) && (
              <Popup
                isOpen={isMenuOpen}
                key='settings'
                onClose={toggleMenu}
                trigger={
                  <Button
                    className='menu-button'
                    icon='ellipsis-v'
                    onClick={toggleMenu}
                  />
                }
              >
                <Menu
                  onClick={toggleMenu}
                  text
                  vertical
                >
                  <Menu.Item
                    onClick={(): void => {
                      toggleMenu();
                      onDeregisterOpen();
                    }}
                  >
                    {t<string>('Deregister this parachain')}
                  </Menu.Item>
                </Menu>
              </Popup>
            )}
          </ParachainInfo>
        </section>
        <section>
          <CardSummary label={t<string>('parachain id')}>
            {id.toString()}
          </CardSummary>
          {parachain.pendingSwapId && (
            <CardSummary label={t<string>('pending swap id')}>
              {parachain.pendingSwapId.toString()}
            </CardSummary>
          )}
        </section>
      </SummaryBox>
      <Columar>
        <Column>
          <Details parachain={parachain} />
        </Column>
        <Column>
          <DispatchQueue dispatchQueue={parachain.relayDispatchQueue} />
        </Column>
      </Columar>
      {(sudoKey && isMine) && (
        <Deregister
          id={id}
          info={parachain.info}
          isOpen={isDeregisterOpen}
          onClose={onDeregisterClose}
          onSubmit={onDeregister}
          sudoKey={sudoKey}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Parachain)`
  & {
    .menu-button {
      margin-left: 1.4rem;
    }
  }
`);
