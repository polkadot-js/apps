// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Extrinsics, Extrinsic$Sections } from '@polkadot/extrinsics/types';
import { I18nProps } from '../types';
import { DropdownOptions, SectionVisibilityAll } from '../util/types';

import React from 'react';

import extrinsics from '@polkadot/extrinsics';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  onChange: (value: SectionItem<Extrinsics>) => void,
  options: DropdownOptions,
  type: SectionVisibilityAll,
  value: SectionItem<Extrinsics>,
  withLabel?: boolean
};

// ({ className, isError, label = '', onChange, options, style, t, type, value: { name, section }, withLabel }: Props) {
class SelectMethod extends React.PureComponent<Props> {

  render () {
    const { className, isError, label = '', onChange, options, style, t, type, value: { name, section }, withLabel } = this.props;

    if (!options.length) {
      return null;
    }

    const transform = (name: Extrinsic$Sections): SectionItem<Extrinsics> =>
      extrinsics[section][type][name];

    return (
        <Dropdown
          className={classes('ui--DropdownLinked-Items', className)}
          isError={isError}
          label={label || t('input.extrinsic.method', {
            defaultValue: 'with the extrinsic'
          })}
          onChange={onChange}
          options={options}
          style={style}
          transform={transform}
          value={name}
          withLabel={withLabel}
        />
    );
  }
}

export default translate(SelectMethod);
