# AgentPay Sentinel

**Testing, monitoring, and reliability infrastructure for autonomous agent payments.**

AgentPay Sentinel is an open-source developer platform for testing, monitoring, and improving the reliability of x402 payment workflows. It helps developers identify payment failures, duplicate transactions, expired authorizations, and spending-policy violations before they affect production systems.

As AI agents become capable of purchasing APIs, accessing paid services, and interacting with other autonomous systems, reliable payment infrastructure becomes increasingly important. AgentPay Sentinel provides tools to simulate payment scenarios, validate payment policies, monitor transaction activity, and maintain auditable payment records.

## The Problem

Autonomous agents increasingly need to make payments without human intervention. However, payment workflows can encounter several problems:

- **Duplicate payments:** Network timeouts and automatic retries can cause the same payment to be submitted multiple times.
- **Authorization failures:** Expired or invalid payment authorizations can interrupt automated workflows.
- **Spending violations:** Agents may exceed predefined transaction or spending limits.
- **Settlement failures:** Payments can become delayed, rejected, or remain in uncertain states.
- **Limited visibility:** Developers often lack the tools to test payment failure scenarios and monitor the reliability of autonomous payment workflows.

These issues make it difficult to deploy AI agents that can make payments safely and consistently.

## The Solution

AgentPay Sentinel provides a centralized environment where developers can test, monitor, and evaluate autonomous payment workflows.

The platform focuses on identifying potential failures before deployment and providing visibility into payment activity after deployment.

### Core Features

- **Payment Simulation:** Simulate x402 payment requests and test different payment scenarios.
- **Failure Testing:** Test network timeouts, expired authorizations, rejected payments, and facilitator failures.
- **Duplicate Detection:** Identify repeated payment attempts and evaluate idempotency handling.
- **Spending Policy Testing:** Define and validate transaction limits, daily budgets, and payment authorization rules.
- **Payment Monitoring:** Track transaction states, settlement activity, and payment failures.
- **Audit Logs and Reports:** Maintain transaction records and generate reports for testing results and payment activity.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, NestJS |
| Database | PostgreSQL |
| Queue and Caching | Redis, BullMQ |
| Payment Protocol | x402 |
| Blockchain Integration | Stellar, Soroban |
| Testing | Vitest |

## Project Structure

AgentPay Sentinel follows a monorepo architecture that separates the application, backend services, and reusable packages while keeping development and integration within a single repository.

```text
agentpay-sentinel/
│
├── apps/
│   ├── web/                    # React developer dashboard
│   └── api/                    # Backend API and services
│
├── packages/
│   ├── testing-engine/          # Payment simulation and testing
│   ├── policy-engine/           # Spending and authorization policies
│   ├── monitoring/              # Payment monitoring and event tracking
│   ├── x402-adapter/            # x402 protocol integration
│   ├── stellar-adapter/         # Stellar network integration
│   ├── chaos-lab/               # Payment failure simulation
│   ├── reporting/               # Test reports and audit utilities
│   └── shared/                  # Shared types and utilities
│
├── contracts/
│   └── soroban/                 # Soroban smart contracts, where needed
│
├── examples/                    # Integration examples
├── docs/                        # Technical documentation
├── tests/                       # Integration and end-to-end tests
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .env.example
├── .gitignore
└── README.md
```

## Stellar Integration

AgentPay Sentinel uses Stellar as its initial blockchain integration, with support for testing and monitoring x402 payment workflows involving Stellar assets and Soroban-based functionality.

The architecture is designed to keep payment testing, policy validation, and monitoring independent of the underlying network, allowing additional x402-compatible networks to be integrated in the future.

## Project Goals

- Improve the reliability of autonomous payment workflows.
- Help developers identify payment vulnerabilities before production.
- Provide better visibility into agent payment activity.
- Make spending-policy validation easier to implement and test.
- Establish reusable developer tools for the x402 ecosystem.
