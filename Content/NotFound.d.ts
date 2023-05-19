import type { RouteProps } from '@polkadot/apps-routing/types';
import React from 'react';
interface Props extends RouteProps {
    missingApis?: (string | string[])[];
}
declare function NotFound({ basePath, missingApis }: Props): React.ReactElement;
declare const _default: React.MemoExoticComponent<typeof NotFound>;
export default _default;
