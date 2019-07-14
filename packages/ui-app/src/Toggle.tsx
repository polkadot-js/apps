// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUICheckbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import styled from 'styled-components';

type Props = BareProps & {
  defaultValue?: boolean,
  label: React.ReactNode,
  onChange?: (isChecked: boolean) => void
};

class Toggle extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, defaultValue, label } = this.props;

    return (
      <div className={className}>
        <SUICheckbox
          defaultChecked={defaultValue}
          onChange={this.onChange}
          toggle
        />
        <label>{label}</label>
      </div>
    );
  }

  private onChange = (event: React.FormEvent<HTMLInputElement>, { checked }: any): void => {
    const { onChange } = this.props;

    onChange && onChange(checked);
  }
}

export default styled(Toggle)`
  > label {
    display: inline-block;
    margin-left: 0.5rem;
  }

  > label,
  > .ui.checkbox {
    vertical-align: middle;
  }

  .ui.checkbox + label {
    color: rgba(78, 78, 78, 0.75);
  }
`;
