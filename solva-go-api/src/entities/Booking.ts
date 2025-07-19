import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsOptional, Length, Min, IsEnum } from 'class-validator';
// Using string references to avoid circular dependencies

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Length(1, 50)
  bookingNumber: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  packageId?: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  customTourRequestId?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  @Min(0)
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @Column('int')
  @Min(1)
  numberOfPeople: number;

  @Column()
  @Length(1, 100)
  customerName: string;

  @Column()
  @Length(1, 100)
  customerEmail: string;

  @Column({ nullable: true })
  @IsOptional()
  customerPhone?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  specialRequests?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  notes?: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  paymentDetails?: {
    method: string;
    transactionId?: string;
    paidAmount: number;
    paidAt?: Date;
  };

  @Column({ nullable: true })
  @IsOptional()
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  cancelledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  confirmedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  completedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('User', 'bookings')
  @JoinColumn({ name: 'customerId' })
  customer: any;

  @ManyToOne('TravelPackage', 'bookings', { nullable: true })
  @JoinColumn({ name: 'packageId' })
  package?: any;

  @ManyToOne('CustomTourRequest', 'bookings', { nullable: true })
  @JoinColumn({ name: 'customTourRequestId' })
  customTourRequest?: any;

  @OneToMany('Review', 'booking')
  reviews: any[];

  // Virtual properties
  get duration(): number {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  get isActive(): boolean {
    return this.status === BookingStatus.CONFIRMED || this.status === BookingStatus.PENDING;
  }

  get canBeCancelled(): boolean {
    const now = new Date();
    const startDate = new Date(this.startDate);
    const daysDifference = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return this.isActive && daysDifference > 7; // Can cancel if more than 7 days before start
  }

  // Methods
  generateBookingNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `BK-${year}${month}${day}-${random}`;
  }

  confirm(): void {
    this.status = BookingStatus.CONFIRMED;
    this.confirmedAt = new Date();
  }

  cancel(reason?: string): void {
    this.status = BookingStatus.CANCELLED;
    this.cancellationReason = reason;
    this.cancelledAt = new Date();
  }

  complete(): void {
    this.status = BookingStatus.COMPLETED;
    this.completedAt = new Date();
  }

  markAsPaid(amount: number, method: string, transactionId?: string): void {
    this.paymentStatus = amount >= this.totalAmount ? PaymentStatus.PAID : PaymentStatus.PARTIAL;
    this.paymentDetails = {
      method,
      transactionId,
      paidAmount: amount,
      paidAt: new Date(),
    };
  }
}