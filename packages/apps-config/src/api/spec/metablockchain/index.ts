// custom types used in metablockchain network
import { typesFromDefs } from '../../util';
import * as metablockchainDefinitions from './interfaces/definitions'
console.log('Definitions', metablockchainDefinitions)
const metablockchainTypes = typesFromDefs(metablockchainDefinitions);
console.log(metablockchainTypes)
export default metablockchainTypes