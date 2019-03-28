import React from 'react'
import { BareProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../props';
import MyActionList from './MyActionList';

type Props = BareProps & ComponentProps;

export default class Actions extends React.PureComponent<Props> {
    render () {
        return <MyActionList {...this.props} />
    }
}
