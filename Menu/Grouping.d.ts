import type { Group } from './types.js';
import React from 'react';
interface Props extends Group {
    className?: string;
    isActive: boolean;
}
declare function Grouping({ className, isActive, name, routes }: Props): React.ReactElement<Props>;
declare const _default: React.MemoExoticComponent<typeof Grouping>;
export default _default;
