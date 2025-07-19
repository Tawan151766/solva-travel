import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsOptional, Length, Min, Max } from 'class-validator';
// Using string references to avoid circular dependencies

@Entity('travel_packages')
export class TravelPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(3, 200)
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  @Length(3, 200)
  title?: string;

  @Column('text')
  description: string;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  overview?: string;

  @Column('text', { array: true, default: [] })
  highlights: string[];

  @Column('jsonb', { nullable: true })
  @IsOptional()
  itinerary?: any;

  @Column('decimal', { precision: 10, scale: 2 })
  @Min(0)
  price: number;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  priceDetails?: any;

  @Column('int')
  @Min(1)
  duration: number;

  @Column({ nullable: true })
  @IsOptional()
  durationText?: string;

  @Column('int')
  @Min(1)
  maxCapacity: number;

  @Column()
  location: string;

  @Column({ nullable: true })
  @IsOptional()
  destination?: string;

  @Column({ nullable: true })
  @IsOptional()
  category?: string;

  @Column({ nullable: true })
  @IsOptional()
  difficulty?: string;

  @Column('text', { array: true, default: [] })
  includes: string[];

  @Column('text', { array: true, default: [] })
  excludes: string[];

  @Column('jsonb', { nullable: true })
  @IsOptional()
  accommodation?: any;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column({ nullable: true })
  @IsOptional()
  imageUrl?: string;

  @Column('text', { array: true, default: [] })
  galleryImages: string[];

  @Column({ default: false })
  isRecommended: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  @Min(0)
  @Max(5)
  rating: number;

  @Column('int', { default: 0 })
  @Min(0)
  totalReviews: number;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  @IsOptional()
  seoTitle?: string;

  @Column({ nullable: true })
  @IsOptional()
  seoDescription?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany('Booking', 'package')
  bookings: any[];

  @OneToMany('Review', 'package')
  reviews: any[];

  // Virtual properties
  get averageRating(): number {
    return this.totalReviews > 0 ? this.rating : 0;
  }

  get isAvailable(): boolean {
    return this.isActive;
  }

  // Methods
  updateRating(newRating: number, isNewReview: boolean = true) {
    if (isNewReview) {
      const totalRating = this.rating * this.totalReviews + newRating;
      this.totalReviews += 1;
      this.rating = totalRating / this.totalReviews;
    }
  }
}