import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from './entities/policy.entity';
import { PolicyType } from './enums/policy-type.enum';
import { CreatePolicyDto } from './dto/create-policy.dto';

export interface PaymentLike {
  intentId: string;
  amount: string;
  currency?: string;
  network?: string;
  payer?: string;
  payee?: string;
}

export interface PolicyViolation {
  policyId: string;
  policyName: string;
  type: PolicyType;
  reason: string;
}

export interface ValidationResult {
  valid: boolean;
  violations: PolicyViolation[];
  evaluated: number;
}

/**
 * The policy engine. It manages policies and validates planned payments
 * against them (spending limits, transaction restrictions, authorization
 * rules). Validation never throws — it returns a structured result so callers
 * (the testing engine) can decide whether to block or record the violation.
 */
@Injectable()
export class PolicyEngineService {
  private readonly logger = new Logger(PolicyEngineService.name);

  constructor(
    @InjectRepository(Policy)
    private readonly policyRepo: Repository<Policy>,
  ) {}

  async createPolicy(
    projectId: string,
    dto: CreatePolicyDto,
  ): Promise<Policy> {
    const policy = this.policyRepo.create({ ...dto, projectId });
    return this.policyRepo.save(policy);
  }

  async listPolicies(projectId: string): Promise<Policy[]> {
    return this.policyRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } });
  }

  async getPolicy(id: string): Promise<Policy> {
    const policy = await this.policyRepo.findOne({ where: { id } });
    if (!policy) {
      throw new NotFoundException('Policy not found');
    }
    return policy;
  }

  async updatePolicy(
    id: string,
    patch: Partial<Pick<Policy, 'name' | 'description' | 'rules' | 'enabled' | 'enforce'>>,
  ): Promise<Policy> {
    const policy = await this.getPolicy(id);
    Object.assign(policy, patch);
    return this.policyRepo.save(policy);
  }

  async deletePolicy(id: string): Promise<void> {
    await this.policyRepo.delete(id);
  }

  /**
   * Validates a planned payment against all enabled policies for a project.
   */
  async validatePayment(
    projectId: string,
    payment: PaymentLike,
  ): Promise<ValidationResult> {
    const policies = await this.policyRepo.find({
      where: { projectId, enabled: true },
    });

    const violations: PolicyViolation[] = [];
    for (const policy of policies) {
      const violation = this.evaluatePolicy(policy, payment);
      if (violation) violations.push(violation);
    }

    return {
      valid: violations.length === 0,
      violations,
      evaluated: policies.length,
    };
  }

  /**
   * Evaluates a single policy against a payment. Returns a violation descriptor
   * when the policy is breached, otherwise null.
   *
   * TODO: implement per-type evaluators and a rolling spend ledger (backed by
   * the payments module / Redis) for time-windowed spending limits.
   */
  private evaluatePolicy(
    policy: Policy,
    payment: PaymentLike,
  ): PolicyViolation | null {
    switch (policy.type) {
      case PolicyType.SPENDING_LIMIT: {
        const maxAmount = Number(policy.rules?.maxAmount ?? 0);
        const amount = Number(payment.amount ?? 0);
        if (maxAmount > 0 && amount > maxAmount) {
          return {
            policyId: policy.id,
            policyName: policy.name,
            type: policy.type,
            reason: `Amount ${amount} exceeds spending limit ${maxAmount}`,
          };
        }
        return null;
      }
      case PolicyType.TRANSACTION_RESTRICTION: {
        const blockedNetworks: string[] = policy.rules?.blockedNetworks ?? [];
        if (blockedNetworks.includes(payment.network ?? '')) {
          return {
            policyId: policy.id,
            policyName: policy.name,
            type: policy.type,
            reason: `Network ${payment.network} is restricted`,
          };
        }
        return null;
      }
      case PolicyType.AUTHORIZATION_RULE: {
        const requiredPayer = policy.rules?.requiredPayer;
        if (requiredPayer && payment.payer && payment.payer !== requiredPayer) {
          return {
            policyId: policy.id,
            policyName: policy.name,
            type: policy.type,
            reason: 'Payer does not match the authorization rule',
          };
        }
        return null;
      }
      default:
        return null;
    }
  }
}
