import { QueueTxStatus } from './types';

export const STATUS_COMPLETE: QueueTxStatus[] = [
  // status from subscription
  'finalitytimeout', 'finalized', 'inblock', 'usurped', 'dropped', 'invalid', 'retracted',
  // normal completion
  'cancelled', 'error', 'sent'
];
