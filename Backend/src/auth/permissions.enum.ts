export enum Permission {
  // Audit / queue operations (existing)
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  REQUEUE_JOBS = 'requeue_jobs',
  REGISTER_WEBHOOKS = 'register_webhooks',
  MODERATE_CONTENT = 'moderate_content',

  // AgentPay Sentinel domain
  MANAGE_PROJECTS = 'manage_projects',
  MANAGE_PAYMENTS = 'manage_payments',
  RUN_TESTS = 'run_tests',
  MANAGE_CHAOS = 'manage_chaos',
  MANAGE_POLICIES = 'manage_policies',
  VIEW_MONITORING = 'view_monitoring',
  MANAGE_SETTLEMENT = 'manage_settlement',
  VIEW_REPORTS = 'view_reports',
  MANAGE_ADAPTERS = 'manage_adapters',
}
