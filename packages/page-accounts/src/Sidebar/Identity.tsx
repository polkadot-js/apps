// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressIdentity } from '@polkadot/react-hooks/types';

import React from 'react';
import { AddressMini, AvatarItem, Icon, IconLink, Tag } from '@polkadot/react-components';
import { useApi, useRegistrars, useToggle } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';
import RegistrarJudgement from './RegistrarJudgement';

interface Props {
  address: string;
  identity?: AddressIdentity;
}

function Identity ({ address, identity }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isRegistrar, registrars } = useRegistrars();
  const [isJudgementOpen, toggleIsJudgementOpen] = useToggle();

  if (!identity || !identity.isExistent || !api.query.identity?.identityOf) {
    return null;
  }

  return (
    <section>
      <div className='ui--AddressMenu-section ui--AddressMenu-identity'>
        <div className='ui--AddressMenu-sectionHeader'>
          <div>
            <Icon icon='address-card' />
            &nbsp;
            {t<string>('identity')}
          </div>
          <Tag
            color={
              identity.isGood
                ? 'green'
                : identity.isBad
                  ? 'red'
                  : 'yellow'
            }
            isTag={false}
            label={
              <>
                <b>{identity.judgements.length}&nbsp;</b>
                {
                  identity.judgements.length
                    ? (identity.isGood
                      ? (identity.isKnownGood ? t<string>('Known good') : t<string>('Reasonable'))
                      : (identity.isErroneous ? t<string>('Erroneous') : t<string>('Low quality'))
                    )
                    : t<string>('No judgments')
                }
              </>
            }
            size='tiny'
          />
        </div>
        <div>
          <AvatarItem
            icon={
              // This won't work - images are IPFS hashes
              // identity.image
              //   ? <img src={identity.image} />
              //   : <i className='icon user ui--AddressMenu-identityIcon' />
              //
              <Icon
                className='ui--AddressMenu-identityIcon'
                icon='user'
              />
            }
            subtitle={identity.legal}
            title={identity.display}
          />
          <div className='ui--AddressMenu-identityTable'>
            {identity.parent && (
              <div className='tr parent'>
                <div className='th'>{t<string>('parent')}</div>
                <div className='td'>
                  <AddressMini
                    className='parent'
                    isPadded={false}
                    value={identity.parent}
                  />
                </div>
              </div>
            )}
            {identity.email && (
              <div className='tr'>
                <div className='th'>{t<string>('email')}</div>
                <div className='td'>
                  {isHex(identity.email)
                    ? identity.email
                    : (
                      <a
                        href={`mailto:${identity.email as string}`}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {identity.email}
                      </a>
                    )}
                </div>
              </div>
            )}
            {identity.web && (
              <div className='tr'>
                <div className='th'>{t<string>('website')}</div>
                <div className='td'>
                  {isHex(identity.web)
                    ? identity.web
                    : (
                      <a
                        href={(identity.web as string).replace(/^(https?:\/\/)?/g, 'https://')}
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {identity.web}
                      </a>
                    )}
                </div>
              </div>
            )}
            {identity.twitter && (
              <div className='tr'>
                <div className='th'>{t<string>('twitter')}</div>
                <div className='td'>
                  {isHex(identity.twitter)
                    ? identity.twitter
                    : (
                      <a
                        href={
                          (identity.twitter as string).startsWith('https://twitter.com/')
                            ? (identity.twitter as string)
                            : `https://twitter.com/${identity.twitter as string}`
                        }
                        rel='noopener noreferrer'
                        target='_blank'
                      >
                        {identity.twitter}
                      </a>
                    )}
                </div>
              </div>
            )}
            {identity.riot && (
              <div className='tr'>
                <div className='th'>{t<string>('riot')}</div>
                <div className='td'>
                  {identity.riot}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isRegistrar && (
        <div className='ui--AddressMenu-section'>
          <div className='ui--AddressMenu-actions'>
            <ul>
              <li>
                <IconLink
                  icon='address-card'
                  label={t<string>('Add identity judgment')}
                  onClick={toggleIsJudgementOpen}
                />
              </li>
            </ul>
          </div>
        </div>
      )}
      {isJudgementOpen && isRegistrar && (
        <RegistrarJudgement
          address={address}
          key='modal-judgement'
          registrars={registrars}
          toggleJudgement={toggleIsJudgementOpen}
        />
      )}
    </section>
  );
}

export default React.memo(Identity);
