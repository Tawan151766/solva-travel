import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { IsOptional, Length, Min, Max } from 'class-validator';

@Entity('staff_profiles')
export class StaffProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ nullable: true })
  @IsOptional()
  position?: string;

  @Column({ nullable: true, type: 'text' })
  @IsOptional()
  bio?: string;

  @Column('text', { array: true, default: [] })
  specialties: string[];

  @Column('text', { array: true, default: [] })
  languages: string[];

  @Column({ nullable: true })
  @IsOptional()
  yearsOfExperience?: number;

  @Column({ nullable: true })
  @IsOptional()
  education?: string;

  @Column({ nullable: true })
  @IsOptional()
  certifications?: string;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  @Min(0)
  @Max(5)
  rating: number;

  @Column('int', { default: 0 })
  @Min(0)
  totalReviews: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @IsOptional()
  coverImage?: string;

  @Column('text', { array: true, default: [] })
  galleryImages: string[];

  @Column({ nullable: true })
  @IsOptional()
  facebookUrl?: string;

  @Column({ nullable: true })
  @IsOptional()
  instagramUrl?: string;

  @Column({ nullable: true })
  @IsOptional()
  twitterUrl?: string;

  @Column({ nullable: true })
  @IsOptional()
  linkedinUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations - using string references to avoid circular dependencies
  @OneToOne('User', 'staffProfile')
  @JoinColumn({ name: 'userId' })
  user: any;

  @OneToMany('Review', 'staff')
  reviews: any[];

  // Virtual properties
  get averageRating(): number {
    return this.totalReviews > 0 ? this.rating : 0;
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