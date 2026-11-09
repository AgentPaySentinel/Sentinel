/**
 * On-chain settlement status. Distinct from {@link PaymentStatus} because a
 * payment can return HTTP 200 (payment "completed") while settlement is still
 * pending or has failed on-chain.
 */
export enum SettlementStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELAYED = 'delayed',
  FAILED = 'failed',
}
