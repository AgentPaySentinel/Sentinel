/**
 * Categories of policies the policy engine can evaluate. Each maps to a
 * concrete validation strategy implemented in {@link PolicyEngineService}.
 */
export enum PolicyType {
  SPENDING_LIMIT = 'spending_limit',
  TRANSACTION_RESTRICTION = 'transaction_restriction',
  AUTHORIZATION_RULE = 'authorization_rule',
  RATE_LIMIT = 'rate_limit',
}
