import type { IconName } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
interface Props {
    children: React.ReactNode;
    className?: string;
    icon: IconName;
    isBottom?: boolean;
    isFull?: boolean;
    type: 'error' | 'info';
    isDev?: boolean;
}
declare function BaseOverlay({ children, className, icon, isBottom, isDev, isFull, type }: Props): React.ReactElement<Props> | null;
declare const _default: React.MemoExoticComponent<typeof BaseOverlay>;
export default _default;
