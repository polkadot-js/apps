// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input, Toggle } from '@polkadot/react-components';

import Bare from './Bare';
import Struct from './Struct';

import { useTranslation } from '../translate';

interface WrapProps {
  children: React.ReactNode;
  onChange: (isChecked: boolean) => void;
  value: boolean;
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

function IdentityInfo (props: Props): React.ReactElement<Props> {
  const { className, isDisabled, onChange, style } = props;

  const { t } = useTranslation();
  const [hasDisplay, setHasDisplay] = useState(true);
  const [hasEmail, setHasEmail] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [hasLegal, setHasLegal] = useState(false);
  const [hasPgp, setHasPgp] = useState(false);
  const [hasRiot, setHasRiot] = useState(false);
  const [hasWeb, setHasWeb] = useState(false);
  const [valDisplay, setValDisplay] = useState('');
  const [valEmail, setValEmail] = useState('');
  const [valImage, setValImage] = useState('');
  const [valLegal, setValLegal] = useState('');
  const [valPgp, setValPgp] = useState('');
  const [valRiot, setValRiot] = useState('');
  const [valWeb, setValWeb] = useState('');

  useEffect((): void => {
    onChange && onChange({
      value: {
        display: { [hasDisplay ? 'raw' : 'none']: hasDisplay ? valDisplay : null },
        email: { [hasEmail ? 'raw' : 'none']: hasEmail ? valEmail : null },
        image: { [hasImage ? 'raw' : 'none']: hasImage ? valImage : null },
        legal: { [hasLegal ? 'raw' : 'none']: hasLegal ? valLegal : null },
        riot: { [hasRiot ? 'raw' : 'none']: hasRiot ? valRiot : null },
        web: { [hasWeb ? 'raw' : 'none']: hasWeb ? valWeb : null },
        pgpFingerprint: hasPgp ? valPgp : null
      },
      isValid: true
    });
  }, [hasDisplay, hasEmail, hasImage, hasLegal, hasPgp, hasRiot, hasWeb, valDisplay, valEmail, valImage, valLegal, valPgp, valRiot, valWeb]);

  if (isDisabled) {
    return (
      <Struct {...props} />
    );
  }

  return (
    <Bare
      className={className}
      style={style}
    >
      <WrapToggle
        onChange={setHasDisplay}
        value={hasDisplay}
      >
        <Input
          isDisabled={!hasDisplay}
          label={t('display name')}
          onChange={setValDisplay}
          maxLength={32}
          value={hasDisplay ? valDisplay : '<none>'}
        />
      </WrapToggle>
      <WrapToggle
        onChange={setHasLegal}
        value={hasLegal}
      >
        <Input
          isDisabled={!hasLegal}
          label={t('legal name')}
          onChange={setValLegal}
          maxLength={32}
          value={hasLegal ? valLegal : '<none>'}
        />
      </WrapToggle>
      <WrapToggle
        onChange={setHasEmail}
        value={hasEmail}
      >
        <Input
          isDisabled={!hasEmail}
          label={t('email')}
          onChange={setValEmail}
          maxLength={32}
          value={hasEmail ? valEmail : '<none>'}
        />
      </WrapToggle>
      <WrapToggle
        onChange={setHasWeb}
        value={hasWeb}
      >
        <Input
          isDisabled={!hasWeb}
          label={t('web')}
          onChange={setValWeb}
          maxLength={32}
          value={hasWeb ? valWeb : '<none>'}
        />
      </WrapToggle>
      <WrapToggle
        onChange={setHasRiot}
        value={hasRiot}
      >
        <Input
          isDisabled={!hasRiot}
          label={t('riot name')}
          onChange={setValRiot}
          maxLength={32}
          value={hasRiot ? valRiot : '<none>'}
        />
      </WrapToggle>
      <WrapToggle
        onChange={setHasImage}
        value={hasImage}
      >
        <Input
          isDisabled={!hasImage}
          label={t('image')}
          onChange={setValImage}
          maxLength={32}
          value={hasImage ? valImage : '<none>'}
        />
      </WrapToggle>
      <WrapToggle
        onChange={setHasPgp}
        value={hasPgp}
      >
        <Input
          isDisabled={!hasPgp}
          label={t('Pgp')}
          onChange={setValPgp}
          maxLength={42}
          value={hasPgp ? valPgp : '<none>'}
        />
      </WrapToggle>
    </Bare>
  );
}

export default styled(IdentityInfo)`
  .toggle-Wrap {
    position: relative;

    .toggle-Toggle {
      position: absolute;
      right: 3.5rem;
      top: 0.5rem;
    }
  }
`;
