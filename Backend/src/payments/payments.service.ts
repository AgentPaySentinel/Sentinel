import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentAttempt } from './entities/payment-attempt.entity';
import { PaymentStatus } from './enums/payment-status.enum';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { AuditService } from '../audit/audit.service';

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  existingPaymentId?: string;
  attemptsForIntent: number;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(PaymentAttempt)
    private readonly attemptRepo: Repository<PaymentAttempt>,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Records a payment and its first attempt. Uses {@link intentId} for
   * idempotency: if a payment already exists for this intent within the project,
   * the new attempt is flagged as a duplicate instead of creating a new payment.
   */
  async record(
    projectId: string,
    dto: RecordPaymentDto,
  ): Promise<{ payment: Payment; attempt: PaymentAttempt; duplicate: DuplicateDetectionResult }> {
    const detection = await this.detectDuplicate(projectId, dto.intentId);

    let payment: Payment;
    if (detection.isDuplicate && detection.existingPaymentId) {
      payment = (await this.paymentRepo.findOne({
        where: { id: detection.existingPaymentId },
      }))!;
      payment.status = PaymentStatus.DUPLICATE;
      await this.paymentRepo.save(payment);
    } else {
      payment = this.paymentRepo.create({
        projectId,
        ...dto,
        status: dto.status ?? PaymentStatus.INITIATED,
      });
      payment = await this.paymentRepo.save(payment);
    }

    const attempt = this.attemptRepo.create({
      paymentId: payment.id,
      intentId: dto.intentId,
      status: payment.status,
      isDuplicate: detection.isDuplicate,
      attemptNumber: detection.attemptsForIntent + 1,
      response: dto.facilitatorResponse,
    });
    const savedAttempt = await this.attemptRepo.save(attempt);

    await this.auditService.logAction('PAYMENT_RECORDED', projectId, payment.id, {
      intentId: dto.intentId,
      isDuplicate: detection.isDuplicate,
    });

    return { payment, attempt: savedAttempt, duplicate: detection };
  }

  /**
   * Detects whether an attempt for the given intent already exists. This is the
   * foundation for duplicate-payment detection and idempotency testing.
   *
   * TODO: extend with time-window heuristics and amount/payee matching so that
   * near-duplicate attempts (same intent, different amount) are surfaced.
   */
  async detectDuplicate(
    projectId: string,
    intentId: string,
  ): Promise<DuplicateDetectionResult> {
    const existing = await this.paymentRepo.findOne({
      where: { projectId, intentId },
    });
    const attemptsForIntent = await this.attemptRepo.count({
      where: { intentId },
    });

    return {
      isDuplicate: !!existing,
      existingPaymentId: existing?.id,
      attemptsForIntent,
    };
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async listByProject(
    projectId: string,
    status?: PaymentStatus,
  ): Promise<Payment[]> {
    const where: any = { projectId };
    if (status) where.status = status;
    return this.paymentRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async listAttempts(paymentId: string): Promise<PaymentAttempt[]> {
    return this.attemptRepo.find({
      where: { paymentId },
      order: { attemptNumber: 'ASC' },
    });
  }

  async updateStatus(
    paymentId: string,
    status: PaymentStatus,
    settledAt?: Date,
  ): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new Error('Payment not found');
    }
    payment.status = status;
    if (settledAt) payment.settledAt = settledAt;
    return this.paymentRepo.save(payment);
  }

  /**
   * Returns payments that are unresolved (not completed, failed, or cancelled)
   * after a configurable threshold — a key input for the monitoring module.
   */
  async findUnresolved(projectId: string): Promise<Payment[]> {
    const unresolved: PaymentStatus[] = [
      PaymentStatus.PENDING,
      PaymentStatus.INITIATED,
      PaymentStatus.AUTHORIZED,
    ];
    return this.paymentRepo
      .createQueryBuilder('payment')
      .where('payment.projectId = :projectId', { projectId })
      .andWhere('payment.status IN (:...statuses)', { statuses: unresolved })
      .orderBy('payment.createdAt', 'ASC')
      .getMany();
  }
}
