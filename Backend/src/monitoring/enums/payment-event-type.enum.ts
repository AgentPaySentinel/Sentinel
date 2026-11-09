/**
 * Event types emitted to the payment monitoring stream. These are the signals
 * the monitoring module uses to detect failed, delayed, duplicate, and
 * unresolved transactions.
 */
export enum PaymentEventType {
  PAYMENT_RECORDED = 'payment_recorded',
  PAYMENT_INITIATED = 'payment_initiated',
  PAYMENT_AUTHORIZED = 'payment_authorized',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  DUPLICATE_ATTEMPT = 'duplicate_attempt',
  POLICY_VIOLATION = 'policy_violation',
  SETTLEMENT_CONFIRMED = 'settlement_confirmed',
  SETTLEMENT_DELAYED = 'settlement_delayed',
  SETTLEMENT_FAILED = 'settlement_failed',
  ALERT = 'alert',
}

export enum EventSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}
