import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  StellarPaymentDto,
  StellarTransactionStatus,
} from './dto/stellar-payment.dto';

/**
 * Adapter for the Stellar network.
 *
 * Key design principle (from the README): never treat a successful HTTP
 * response as proof of successful blockchain settlement. Settlement status is
 * therefore read directly from the network (Horizon) and cross-checked against
 * the transaction hash, not inferred from a 2xx response.
 *
 * TODO: use the @stellar/stellar-sdk + Soroban client for signing, submission,
 * and Soroban contract interactions. The scaffold uses Horizon REST endpoints
 * for read-only verification to keep the surface stable.
 */
@Injectable()
export class StellarAdapter {
  private readonly logger = new Logger(StellarAdapter.name);
  private readonly http: AxiosInstance;
  private readonly horizonUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.horizonUrl =
      this.configService.get<string>('HORIZON_URL') ||
      'https://horizon-testnet.stellar.org';
    this.http = axios.create({
      baseURL: this.horizonUrl,
      timeout: 20000,
      validateStatus: () => true,
    });
  }

  /**
   * Submits a signed transaction envelope to the network.
   *
   * TODO: accept a pre-signed envelope (signing happens on the contract/service
   * side, never in the adapter) and submit via `/transactions`.
   */
  async submitPayment(
    signedEnvelope: string,
  ): Promise<StellarTransactionStatus> {
    this.logger.log(`Submitting transaction to ${this.horizonUrl}`);
    const res = await this.http.post('/transactions', `tx=${encodeURIComponent(signedEnvelope)}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (res.status >= 200 && res.status < 300 && res.data?.hash) {
      return {
        txHash: res.data.hash,
        ledger: res.data.ledger,
        successful: res.data.successful !== false,
        confirmed: false,
        createdAt: res.data.created_at,
      };
    }

    throw new Error(`Stellar submission failed: ${res.status} ${JSON.stringify(res.data)}`);
  }

  /**
   * Reads the on-chain transaction status directly from the network. This is the
   * source of truth for settlement — independent of any facilitator HTTP status.
   */
  async getTransactionStatus(txHash: string): Promise<StellarTransactionStatus> {
    const res = await this.http.get(`/transactions/${txHash}`);
    if (res.status === 404) {
      return {
        txHash,
        ledger: 0,
        successful: false,
        confirmed: false,
      };
    }
    if (res.status >= 200 && res.status < 300) {
      const successful = res.data.successful !== false;
      const confirmed = res.data.ledger !== undefined && res.data.ledger > 0;
      return {
        txHash,
        ledger: res.data.ledger ?? 0,
        successful,
        confirmed,
        createdAt: res.data.created_at,
      };
    }

    throw new Error(
      `Unable to read Stellar transaction ${txHash}: ${res.status}`,
    );
  }

  /**
   * Verifies a transaction is genuinely settled on-chain. Confirms the
   * transaction exists, is successful, and is included in a finalized ledger.
   */
  async verifySettlement(txHash: string): Promise<boolean> {
    const status = await this.getTransactionStatus(txHash);
    return status.successful && status.confirmed;
  }

  /**
   * Placeholder for Soroban contract invocation. Interactions with on-chain
   * components (per the README) will go through here.
   *
   * TODO: integrate the Soroban client for contract method invocation.
   */
  async invokeContract(
    contractId: string,
    method: string,
    args: any[],
  ): Promise<unknown> {
    this.logger.log(
      `invokeContract(${contractId}.${method}) — Soroban integration pending`,
    );
    throw new Error('Soroban contract invocation not yet implemented');
  }
}
