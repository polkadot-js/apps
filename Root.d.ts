import type { KeyringStore } from '@polkadot/ui-keyring/types';
import React from 'react';
interface Props {
    isElectron: boolean;
    store?: KeyringStore;
}
declare function Root({ isElectron, store }: Props): React.ReactElement<Props>;
declare const _default: React.MemoExoticComponent<typeof Root>;
export default _default;
