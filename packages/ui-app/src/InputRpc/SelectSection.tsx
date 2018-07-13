// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Interfaces, Interface$Sections } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../InputExtrinsic/types';
import { I18nProps } from '../types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue?: Interface$Sections,
  isError?: boolean,
  label?: string,
  onChange: (value: Interface$Sections) => void,
  options: DropdownOptions,
  value: SectionItem<Interfaces>,
  withLabel?: boolean
};

class SelectSection extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isError, label, onChange, options, style, t, value: { section }, withLabel } = this.props;

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Sections', className)}
        defaultValue={defaultValue}
        isError={isError}
        label={label || t('input.rpc.section', {
          defaultValue: 'rpc area'
        })}
        onChange={onChange}
        options={options}
        style={style}
        value={section}
        withLabel={withLabel}
      />
    );
  }
}

export default translate(SelectSection);
