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

export enum CustomTourStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  QUOTED = 'QUOTED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TourType {
  CULTURAL = 'CULTURAL',
  ADVENTURE = 'ADVENTURE',
  NATURE = 'NATURE',
  HISTORICAL = 'HISTORICAL',
  WELLNESS = 'WELLNESS',
  LUXURY = 'LUXURY',
  FAMILY = 'FAMILY',
  ROMANTIC = 'ROMANTIC',
  BUSINESS = 'BUSINESS',
  OTHER = 'OTHER',
}

@Entity('custom_tour_requests')
export class CustomTourRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Length(1, 50)
  trackingNumber: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  assignedStaffId?: string;

  @Column()
  @Length(1, 200)
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TourType,
    default: TourType.OTHER,
  })
  @IsEnum(TourType)
  tourType: TourType;

  @Column('text', { array: true })
  destinations: string[];

  @Column({ type: 'date' })
  preferredStartDate: Date;

  @Column({ type: 'date' })
  preferredEndDate: Date;

  @Column('int')
  @Min(1)
  numberOfPeople: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  @IsOptional()
  @Min(0)
  estimatedBudget?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  @IsOptional()
  @Min(0)
  quotedPrice?: number;

  @Column({
    type: 'enum',
    enum: CustomTourStatus,
    default: CustomTourStatus.PENDING,
  })
  @IsEnum(CustomTourStatus)
  status: CustomTourStatus;

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

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  accommodationPreferences?: {
    type: string; // hotel, resort, guesthouse, etc.
    rating: number;
    budget: number;
    specialRequests?: string;
  };

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  transportationPreferences?: {
    type: string; // flight, bus, car, etc.
    class: string;
    specialRequests?: string;
  };

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  dietaryRequirements?: {
    vegetarian: boolean;
    vegan: boolean;
    halal: boolean;
    kosher: boolean;
    allergies: string[];
    other?: string;
  };

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  proposedItinerary?: {
    [key: string]: {
      day: number;
      title: string;
      activities: string[];
      accommodation?: string;
      meals: string[];
      transportation?: string;
    };
  };

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  staffNotes?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  customerFeedback?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  quotedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  confirmedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  cancelledAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('User', 'customTourRequests')
  @JoinColumn({ name: 'customerId' })
  customer: any;

  @ManyToOne('StaffProfile', { nullable: true })
  @JoinColumn({ name: 'assignedStaffId' })
  assignedStaff?: any;

  @OneToMany('Booking', 'customTourRequest')
  bookings: any[];

  // Virtual properties
  get duration(): number {
    const start = new Date(this.preferredStartDate);
    const end = new Date(this.preferredEndDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  get isActive(): boolean {
    return ![CustomTourStatus.COMPLETED, CustomTourStatus.CANCELLED].includes(this.status);
  }

  get hasQuote(): boolean {
    return this.quotedPrice !== null && this.quotedPrice > 0;
  }

  // Methods
  generateTrackingNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `CTR-${year}${month}${day}-${random}`;
  }

  assignStaff(staffId: string): void {
    this.assignedStaffId = staffId;
    if (this.status === CustomTourStatus.PENDING) {
      this.status = CustomTourStatus.IN_PROGRESS;
    }
  }

  provideQuote(price: number, itinerary?: any): void {
    this.quotedPrice = price;
    this.status = CustomTourStatus.QUOTED;
    this.quotedAt = new Date();
    
    if (itinerary) {
      this.proposedItinerary = itinerary;
    }
  }

  confirm(): void {
    this.status = CustomTourStatus.CONFIRMED;
    this.confirmedAt = new Date();
  }

  complete(): void {
    this.status = CustomTourStatus.COMPLETED;
    this.completedAt = new Date();
  }

  cancel(): void {
    this.status = CustomTourStatus.CANCELLED;
    this.cancelledAt = new Date();
  }
}