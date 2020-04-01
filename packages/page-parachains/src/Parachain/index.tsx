// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainInfo, DeriveParachainFull } from '@polkadot/api-derive/types';
import { ComponentProps } from '../types';

import React from 'react';
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

interface Props extends ComponentProps {
  basePath: string;
  paraInfoRef: React.MutableRefObject<DeriveParachainInfo | null>;
}

function Parachain ({ basePath, className, isMine, paraInfoRef, sudoKey }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const history = useHistory();
  const { api } = useApi();
  const { id } = useParams();
  const [isMenuOpen, toggleMenu] = useToggle();
  const { isOpen: isDeregisterOpen, onClose: onDeregisterClose, onOpen: onDeregisterOpen } = useModal();
  const parachain = useCall<DeriveParachainFull | null>(api.derive.parachains.info as any, [id || null]);

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
            <Icon name='ban' />
            {t(`No parachain with ${id ? `id ${id.toString()}` : 'this id'} exists`)}
          </div>
        </article>
      </>
    );
  }

  if (!paraInfoRef.current) {
    paraInfoRef.current = parachain.info;
  }

  const onDeregister = (): void => {
    history.push(basePath);
  };

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
                key='settings'
                onClose={toggleMenu}
                open={isMenuOpen}
                position='bottom right'
                trigger={
                  <Button
                    className='menu-button'
                    icon='setting'
                    isPrimary
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
                    {t('Deregister this parachain')}
                  </Menu.Item>
                </Menu>
              </Popup>
            )}
          </ParachainInfo>
        </section>
        <section>
          <CardSummary label={t('parachain id')}>
            {id.toString()}
          </CardSummary>
          {parachain.pendingSwapId && (
            <CardSummary label={t('pending swap id')}>
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
