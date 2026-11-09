/**
 * The categories of failures the chaos lab can reproduce. These map directly to
 * the real-world payment failures AgentPay Sentinel is designed to test.
 */
export enum FailureType {
  TIMEOUT = 'timeout',
  FACILITATOR_OUTAGE = 'facilitator_outage',
  EXPIRED_AUTHORIZATION = 'expired_authorization',
  INTERRUPTED_RESPONSE = 'interrupted_response',
  DUPLICATE_PAYMENT = 'duplicate_payment',
  SETTLEMENT_DELAY = 'settlement_delay',
  INVALID_RESPONSE = 'invalid_response',
}
