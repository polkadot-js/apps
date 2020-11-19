import { RegistryTypes } from '@polkadot/types/types';
import muiDefinitions from '../interfaces/definitions';

const muiTypes = Object
    .values({default: muiDefinitions})
    .reduce((res, { types }) => ({ ...res, ...types }), {});

const types: RegistryTypes = {
...muiTypes,
};
console.log('test', muiDefinitions, types)
export default { types }