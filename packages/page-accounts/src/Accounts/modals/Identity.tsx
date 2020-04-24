// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Registration } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { getAddressMeta } from '@polkadot/react-components/util';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Data, Option } from '@polkadot/types';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

interface WrapProps {
  children: React.ReactNode;
  onChange: (isChecked: boolean) => void;
  value: boolean;
}

function setData (data: Data, setActive: null | ((isActive: boolean) => void), setVal: (val: string) => void): void {
  if (data.isRaw) {
    setActive && setActive(true);
    setVal(u8aToString(data.asRaw.toU8a(true)));
  }
}

function WrapToggle ({ children, onChange, value }: WrapProps): React.ReactElement<WrapProps> {
  const { t } = useTranslation();

  return (
    <div className='toggle-Wrap'>
      {children}
      <Toggle
        className='toggle-Toggle'
        label={
          value
            ? t('include value')
            : t('exclude value')
        }
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

function Identity ({ address, className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const identityOpt = useCall<Option<Registration>>(api.query.identity.identityOf, [address]);
  const [info, setInfo] = useState<any>({});
  const [hasEmail, setHasEmail] = useState(false);
  // const [hasImg, setHasImg] = useState(false);
  const [hasLegal, setHasLegal] = useState(false);
  // const [hasPgp, setHasPgp] = useState(false);
  const [hasRiot, setHasRiot] = useState(false);
  const [hasTwitter, setHasTwitter] = useState(false);
  const [hasWeb, setHasWeb] = useState(false);
  const [valDisplay, setValDisplay] = useState(getAddressMeta(address).name || '');
  const [valEmail, setValEmail] = useState('');
  // const [{ errImg, valImg }, setValImg] = useState<{ errImg: boolean; valImg: string }>({ errImg: true, valImg: '' });
  const [valLegal, setValLegal] = useState('');
  // const [{ errPgp, valPgp }, setValPgp] = useState<{ errPgp: boolean; valPgp: string }>({ errPgp: true, valPgp: '' });
  const [valRiot, setValRiot] = useState('');
  const [valTwitter, setValTwitter] = useState('');
  const [valWeb, setValWeb] = useState('');

  useEffect((): void => {
    if (identityOpt?.isSome) {
      const { info } = identityOpt.unwrap();

      setData(info.display, null, setValDisplay);
      setData(info.email, setHasEmail, setValEmail);
      setData(info.legal, setHasLegal, setValLegal);
      setData(info.riot, setHasRiot, setValRiot);
      setData(info.twitter, setHasTwitter, setValTwitter);
      setData(info.web, setHasWeb, setValWeb);
    }
  }, [identityOpt]);

  useEffect((): void => {
    setInfo({
      display: { [valDisplay ? 'raw' : 'none']: valDisplay || null },
      email: { [hasEmail ? 'raw' : 'none']: hasEmail ? valEmail : null },
      legal: { [hasLegal ? 'raw' : 'none']: hasLegal ? valLegal : null },
      riot: { [hasRiot ? 'raw' : 'none']: hasRiot ? valRiot : null },
      twitter: { [hasTwitter ? 'raw' : 'none']: hasTwitter ? valTwitter : null },
      web: { [hasWeb ? 'raw' : 'none']: hasWeb ? valWeb : null }
      // image: { [hasImg ? 'sha256' : 'none']: hasImg ? valImg : null },
      // pgpFingerprint: hasPgp ? valPgp : null
    });
    //  errImg, errPgp, hasImg, hasPgp, valImg, valPgp,
  }, [hasEmail, hasLegal, hasRiot, hasTwitter, hasWeb, valDisplay, valEmail, valLegal, valRiot, valTwitter, valWeb]);

  return (
    <Modal
      className={className}
      header={t('Register identity')}
    >
      <Modal.Content>
        <Input
          autoFocus
          help={t('The name that will be displayed in your accounts list.')}
          label={t('display name')}
          maxLength={32}
          onChange={setValDisplay}
          value={valDisplay}
        />
        <WrapToggle
          onChange={setHasLegal}
          value={hasLegal}
        >
          <Input
            help={t('The legal name for this identity.')}
            isDisabled={!hasLegal}
            label={t('legal name')}
            maxLength={32}
            onChange={setValLegal}
            value={hasLegal ? valLegal : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasEmail}
          value={hasEmail}
        >
          <Input
            help={t('The email address associated with this identity.')}
            isDisabled={!hasEmail}
            label={t('email')}
            maxLength={32}
            onChange={setValEmail}
            value={hasEmail ? valEmail : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasWeb}
          value={hasWeb}
        >
          <Input
            help={t('An URL that is linked to this identity.')}
            isDisabled={!hasWeb}
            label={t('web')}
            maxLength={32}
            onChange={setValWeb}
            value={hasWeb ? valWeb : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasTwitter}
          value={hasTwitter}
        >
          <Input
            help={t('The twitter name for this identity.')}
            isDisabled={!hasTwitter}
            label={t('twitter')}
            onChange={setValTwitter}
            value={hasTwitter ? valTwitter : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasRiot}
          value={hasRiot}
        >
          <Input
            help={t('a riot name linked to this identity')}
            isDisabled={!hasRiot}
            label={t('riot name')}
            maxLength={32}
            onChange={setValRiot}
            value={hasRiot ? valRiot : '<none>'}
          />
        </WrapToggle>
        {/* <WrapToggle
          onChange={setHasImg}
          value={hasImg}
        >
          <Input
            isDisabled={!hasImg}
            isError={hasImg && errImg}
            label={t('sha2 image hash')}
            onChange={_onChangeImg}
            placeholder={t('0x...')}
            maxLength={66}
            value={hasImg ? valImg : '<none>'}
          />
        </WrapToggle>
        <WrapToggle
          onChange={setHasPgp}
          value={hasPgp}
        >
          <Input
            isDisabled={!hasPgp}
            isError={hasPgp && errPgp}
            label={t('pgp hash')}
            onChange={_onChangePgp}
            placeholder={t('0x...')}
            maxLength={42}
            value={hasPgp ? valPgp : '<none>'}
          />
        </WrapToggle> */}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={address}
          icon='send'
          isPrimary
          label={t('Set Identity')}
          onStart={onClose}
          params={[info]}
          tx='identity.setIdentity'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default styled(Identity)`
  .toggle-Wrap {
    position: relative;

    .toggle-Toggle {
      position: absolute;
      right: 3.5rem;
      top: 0.5rem;
    }
  }
`;
