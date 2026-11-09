# AgentPay Sentinel – Backend

**The core API and reliability engine for autonomous x402 payments.**

AgentPay Sentinel is an open-source developer infrastructure platform for testing, monitoring, and improving the reliability of autonomous agent payments. This repository contains the backend services responsible for payment simulation, policy validation, failure detection, monitoring, and report generation.

## Overview

Autonomous agents can make payments to access APIs and other digital services through protocols such as x402. However, payment workflows can fail in ways that are difficult to detect, reproduce, and investigate.

Examples include duplicate payment attempts after network timeouts, invalid or expired authorizations, spending-limit violations, facilitator failures, and delayed settlement.

AgentPay Sentinel provides backend infrastructure that allows developers to test these scenarios in a controlled environment and monitor payment behaviour.

## Planned Features

- **Payment Simulation:** Create and execute simulated x402 payment workflows.
- **Failure Injection:** Reproduce failures such as timeouts, facilitator outages, expired authorizations, and interrupted responses.
- **Duplicate Payment Detection:** Identify repeated payment attempts and test idempotency behaviour.
- **Policy Engine:** Validate spending limits, transaction restrictions, and authorization rules.
- **Payment Monitoring:** Track payment events and identify failed, delayed, or unresolved transactions.
- **Settlement Tracking:** Monitor supported payment lifecycle and settlement events.
- **Audit Logging:** Maintain records of test executions, policy decisions, and payment events.
- **Report Generation:** Produce structured reports that help developers understand system reliability.
- **Network Adapters:** Integrate with x402-compatible payment infrastructure and supported blockchain networks, beginning with Stellar.

## Architecture

The backend is designed around independent services so that the testing engine, policy engine, monitoring system, and network integrations can evolve without becoming tightly coupled.

The testing engine should remain independent of the dashboard. This allows future integrations with a CLI, SDK, or CI/CD pipeline.

## Technology Stack

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- Redis
- BullMQ
- x402 SDK integrations
- Stellar SDK and Soroban integrations
- Swagger / OpenAPI
- Vitest

The final dependencies and versions will be documented as implementation progresses.

## Project Structure

```text
agentpay-sentinel-backend/
├── src/
│   ├── auth/
│   ├── users/
│   ├── projects/
│   ├── payments/
│   ├── testing-engine/
│   ├── chaos-lab/
│   ├── policy-engine/
│   ├── monitoring/
│   ├── settlement/
│   ├── audit/
│   ├── reports/
│   ├── adapters/
│   │   ├── x402/
│   │   └── stellar/
│   ├── database/
│   ├── queue/
│   ├── common/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

The exact module boundaries may change as the system is implemented.

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm
- PostgreSQL
- Redis
- Git

### Installation

```bash
git clone https://github.com/YOUR-ORG/agentpay-sentinel-backend.git
cd agentpay-sentinel-backend
npm install
```

### Environment Variables

Create a `.env` file using `.env.example` as a reference.

Example:

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/agentpay_sentinel
REDIS_HOST=localhost
REDIS_PORT=6379
```

Additional environment variables will be required for network integrations and other services.

### Run the Development Server

```bash
npm run start:dev
```

### Run Tests

```bash
npm run test
```

### API Documentation

The backend is planned to expose API documentation through Swagger/OpenAPI.

Once configured, the documentation will be available at the API's Swagger endpoint during local development.

## Repository Integration

The backend connects the platform's main components:

- **Frontend:** Provides dashboard data and receives test configurations.
- **Testing Engine:** Executes payment simulations and reliability tests.
- **Policy Engine:** Evaluates spending and authorization rules.
- **Chaos Lab:** Injects controlled failures into test scenarios.
- **Network Adapters:** Connects to x402 infrastructure and supported blockchain networks.
- **Soroban Contracts:** Interacts with on-chain components when required.

Repository: `agentpay-sentinel-frontend`

Contract repository: `agentpay-sentinel-contract`

## Design Principles

- Keep payment testing independent of the user interface.
- Use existing x402 protocol implementations rather than unnecessarily rebuilding the protocol.
- Separate network-specific logic through adapters.
- Make failure scenarios reproducible.
- Maintain clear audit trails for important operations.
- Avoid treating a successful HTTP response as proof of successful blockchain settlement.
- Keep sensitive credentials and signing operations secure.

## Development Status

AgentPay Sentinel is under development. The features described here represent planned functionality and are subject to change.

## Contributing

Contributions are welcome. Areas of interest include backend development, testing infrastructure, protocol integrations, monitoring, security, documentation, and performance improvements.


## License

To be determined.
