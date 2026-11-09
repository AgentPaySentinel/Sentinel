# AgentPay Sentinel – Frontend

**The developer dashboard for testing, monitoring, and securing autonomous x402 payments.**

AgentPay Sentinel is an open-source developer infrastructure platform designed to improve the reliability and security of autonomous agent payments. This repository contains the frontend application, providing developers with a central interface for creating payment tests, simulating failure scenarios, monitoring payment activity, and reviewing test results.

## Overview

As AI agents increasingly interact with APIs and paid services, developers need better ways to understand and control how those agents spend money. AgentPay Sentinel provides a dashboard for testing payment workflows before deployment and observing their behaviour during operation.

The frontend communicates with the AgentPay Sentinel backend through its API. It does not directly execute payment simulations or enforce backend security policies.

## Planned Features

- **Dashboard:** View payment activity, test summaries, system status, and important events.
- **Payment Testing:** Configure and launch x402 payment simulations.
- **Chaos Lab:** Run controlled failure scenarios, including duplicate submissions, expired authorizations, facilitator failures, and settlement timeouts.
- **Spending Policies:** Configure and inspect spending limits and authorization rules.
- **Payment Monitoring:** View payment lifecycle events and identify failed, delayed, or potentially duplicated transactions.
- **Reports and Audit Logs:** Review test results, payment histories, and generated reports.
- **Network Visibility:** View supported network integrations, beginning with Stellar.

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- REST API integration

Additional libraries will be selected as the application develops.

## Project Structure

```text
Frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

The structure may evolve as new dashboard features are introduced.

## Getting Started

### Prerequisites

- Node.js (LTS)
- npm
- Git

### Installation

```bash
git clone https://github.com/YOUR-ORG/agentpay-sentinel-frontend.git
cd agentpay-sentinel-frontend
npm install
```

### Environment Variables

Create a `.env` file using `.env.example` as a reference.

Example:

```env
VITE_API_URL=http://localhost:3000/api
```

### Run the Development Server

```bash
npm run dev
```

The frontend will be available at the local URL displayed by Vite.

### Build for Production

```bash
npm run build
```

## Backend Integration

The frontend relies on the AgentPay Sentinel backend for:

- User and project data.
- Payment simulation requests.
- Test execution results.
- Spending policy configuration.
- Payment monitoring events.
- Reports and audit logs.

Repository: `agentpay-sentinel-backend`

## Development Status

This project is in early development. The folder structure is scaffolded; application code will be added incrementally as features are implemented.
