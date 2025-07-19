import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsOptional, Length, Min, Max, IsEnum } from 'class-validator';
// Using string references to avoid circular dependencies

export enum ReviewType {
  SERVICE = 'SERVICE',
  GUIDE = 'GUIDE',
  OVERALL = 'OVERALL',
  BOOKING = 'BOOKING',
  PACKAGE = 'PACKAGE',
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reviewerId: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  packageId?: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  staffId?: string;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  bookingId?: string;

  @Column({
    type: 'enum',
    enum: ReviewType,
    default: ReviewType.OVERALL,
  })
  @IsEnum(ReviewType)
  type: ReviewType;

  @Column('int')
  @Min(1)
  @Max(5)
  rating: number;

  @Column({ nullable: true })
  @IsOptional()
  @Length(1, 200)
  title?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  comment?: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  isRecommended: boolean;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  ratings?: {
    service?: number;
    value?: number;
    cleanliness?: number;
    location?: number;
    communication?: number;
    accuracy?: number;
  };

  @Column({ nullable: true })
  @IsOptional()
  @Length(1, 100)
  reviewerName?: string;

  @Column({ nullable: true })
  @IsOptional()
  reviewerLocation?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  staffResponse?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  staffResponseAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  staffResponderId?: string;

  @Column('int', { default: 0 })
  @Min(0)
  helpfulCount: number;

  @Column('int', { default: 0 })
  @Min(0)
  reportCount: number;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('User', 'reviews')
  @JoinColumn({ name: 'reviewerId' })
  reviewer: any;

  @ManyToOne('TravelPackage', 'reviews', { nullable: true })
  @JoinColumn({ name: 'packageId' })
  package?: any;

  @ManyToOne('StaffProfile', 'reviews', { nullable: true })
  @JoinColumn({ name: 'staffId' })
  staff?: any;

  @ManyToOne('Booking', 'reviews', { nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking?: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'staffResponderId' })
  staffResponder?: any;

  // Virtual properties
  get averageRating(): number {
    if (!this.ratings) return this.rating;
    
    const ratingsArray = Object.values(this.ratings).filter(r => r !== undefined && r !== null);
    if (ratingsArray.length === 0) return this.rating;
    
    return ratingsArray.reduce((sum, rating) => sum + rating, 0) / ratingsArray.length;
  }

  get isRecent(): boolean {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.createdAt > thirtyDaysAgo;
  }

  get hasImages(): boolean {
    return this.images && this.images.length > 0;
  }

  // Methods
  markAsHelpful(): void {
    this.helpfulCount += 1;
  }

  report(): void {
    this.reportCount += 1;
  }

  addStaffResponse(response: string, staffId: string): void {
    this.staffResponse = response;
    this.staffResponseAt = new Date();
    this.staffResponderId = staffId;
  }

  verify(): void {
    this.isVerified = true;
  }

  feature(): void {
    this.isFeatured = true;
  }

  hide(): void {
    this.isPublic = false;
  }

  show(): void {
    this.isPublic = true;
  }
}