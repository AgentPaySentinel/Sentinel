import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  X402PaymentRequestDto,
  X402PaymentResult,
} from './dto/x402-payment.dto';

/**
 * Adapter for the x402 HTTP payment protocol.
 *
 * Design principle (from the README): use existing x402 protocol implementations
 * rather than rebuilding the protocol. This adapter wraps the HTTP negotiation
 * flow (402 response → payment requirements → facilitator payment → verified
 * retry) so the testing engine can drive x402 workflows without coupling to
 * protocol internals.
 *
 * TODO: replace the raw HTTP flow with an official x402 client SDK when one is
 * available, keeping this service's public contract stable.
 */
@Injectable()
export class X402Adapter {
  private readonly logger = new Logger(X402Adapter.name);
  private readonly http: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.http = axios.create({
      timeout: 15000,
      validateStatus: () => true, // we intentionally inspect 402 responses
    });
  }

  /**
   * Requests a resource and, if the server responds with 402, parses the x402
   * payment requirements. Returns the requirements the caller must satisfy.
   */
  async requestPayment(
    dto: X402PaymentRequestDto,
  ): Promise<X402PaymentResult> {
    const res = await this.http.get(dto.resourceUrl, {
      headers: { Accept: 'application/json' },
    });

    if (res.status === 402 && res.data?.requirements) {
      const requirements = res.data.requirements;
      this.logger.log(
        `x402 payment required for ${dto.resourceUrl}: scheme=${requirements.scheme}`,
      );
      return {
        paymentHeader: '',
        requirements,
        verified: false,
      };
    }

    // No payment required (or already authorised).
    return {
      paymentHeader: '',
      requirements: {
        scheme: 'none',
        network: dto.network ?? 'unknown',
        maxAmountRequired: '0',
        asset: dto.currency,
        payee: '',
        resource: dto.resourceUrl,
        facilitator: '',
      },
      verified: true,
    };
  }

  /**
   * Submits the payment to the facilitator and returns the verification header
   * to attach to the retried request.
   *
   * TODO: integrate the real facilitator client once an x402 SDK is selected.
   */
  async fulfillPayment(
    requirements: X402PaymentResult['requirements'],
    payer: string,
  ): Promise<{ paymentHeader: string; verified: boolean }> {
    const facilitator = requirements.facilitator || this.configService.get<string>('X402_FACILITATOR_URL');
    this.logger.log(
      `Fulfilling x402 payment via facilitator ${facilitator} for ${payer}`,
    );

    // TODO: POST the signed payment to the facilitator and capture the
    // returned `X-PAYMENT` header used to authorise the retried request.
    return { paymentHeader: '', verified: false };
  }

  /**
   * Verifies a facilitator payment confirmation is genuinely settled, not just
   * an HTTP 200. Delegates on-chain verification to the settlement / network
   * adapter rather than trusting the response status.
   */
  async verifyPayment(paymentHeader: string): Promise<boolean> {
    if (!paymentHeader) return false;
    // TODO: parse and verify the facilitator-issued payment proof.
    return false;
  }
}
