# AgentPay Sentinel – Soroban Contracts

**On-chain components for testing and validating Stellar-based agent payment workflows.**

AgentPay Sentinel is an open-source developer infrastructure platform for testing, monitoring, and improving the reliability of autonomous x402 payments. This repository contains the Soroban smart contracts and contract-level testing infrastructure for the platform's Stellar integration.

## Overview

AgentPay Sentinel uses Stellar as its initial blockchain integration. While most payment simulations, monitoring, and policy analysis happen off-chain, some payment rules and records may require on-chain execution.

This repository is intended to provide the Soroban components needed to test and validate those on-chain interactions.

The contracts are not designed to operate as a wallet, payment processor, or general-purpose payment gateway. They support the platform's testing and reliability objectives.

## Planned Responsibilities

The contract layer is intended to support:

- **On-chain Policy Validation:** Explore enforcement of supported spending restrictions for Stellar payment flows.
- **Payment Verification:** Provide contract-level checks for supported payment conditions where execution occurs through a Soroban contract.
- **Payment Records:** Support verifiable on-chain records or events for relevant test scenarios, where needed.
- **Test Scenarios:** Provide contract fixtures for testing authorization failures, invalid inputs, restricted operations, and other edge cases.
- **Event Emission:** Expose relevant events that the backend can monitor and use when tracking supported on-chain activity.

The exact contract interfaces and responsibilities will be finalized alongside the backend's Stellar adapter. Not every x402 payment needs a Soroban contract, and off-chain testing and monitoring will remain in the backend.

## Technology Stack

- Rust
- Soroban SDK
- Stellar network
- Cargo
- Stellar CLI
- Soroban contract testing tools

## Project Structure

```text
agentpay-sentinel-contract/
├── contracts/
│   ├── policy-registry/
│   ├── payment-recorder/
│   └── test-fixtures/
├── tests/
├── scripts/
├── Cargo.toml
├── Cargo.lock
├── .env.example
└── README.md
```

Contract directories represent proposed components. They should only be implemented where they serve a clear requirement in the platform's Stellar integration.

## Getting Started

### Prerequisites

- Rust
- Cargo
- Stellar CLI
- Git

Follow the official Stellar developer documentation to install and configure the required Soroban development tools.

### Clone the Repository

```bash
git clone https://github.com/YOUR-ORG/agentpay-sentinel-contract.git
cd agentpay-sentinel-contract
```

### Build Contracts

```bash
cargo build --target wasm32-unknown-unknown --release
```

### Run Tests

```bash
cargo test
```

Contract-specific build and deployment commands will be documented as the contracts are implemented.

## Backend Integration

The contracts are designed to work with the AgentPay Sentinel backend.

The backend will be responsible for:

- Preparing and submitting supported contract interactions.
- Handling network communication.
- Monitoring contract events.
- Interpreting transaction results.
- Connecting on-chain results to payment test reports.

The contracts will not handle dashboard operations, payment simulation orchestration, or general-purpose monitoring.

Backend repository: `agentpay-sentinel-backend`

## Security Considerations

Security is a core requirement for every on-chain component.

Development will prioritize:

- Explicit authorization checks.
- Input validation.
- Safe handling of contract state.
- Protection against unauthorized operations.
- Tests for invalid and unexpected inputs.
- Clear event and error handling.
- Avoiding unnecessary custody of user funds.

Contracts must be thoroughly tested before deployment to any public network.

## Development Status

This repository is under development. The contract components and interfaces described in this README are proposed design directions, not claims of existing functionality.
