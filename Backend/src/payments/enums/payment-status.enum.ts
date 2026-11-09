/**
 * Lifecycle status for a simulated/observed payment.
 *
 * The flow intentionally separates a successful HTTP/facilitator response from
 * on-chain settlement (see {@link SettlementStatus}), because a 2xx response is
 * not proof that settlement succeeded.
 */
export enum PaymentStatus {
  PENDING = 'pending',
  INITIATED = 'initiated',
  AUTHORIZED = 'authorized',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DUPLICATE = 'duplicate',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}
