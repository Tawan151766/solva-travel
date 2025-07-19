import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { IsEmail, IsOptional, Length } from 'class-validator';
// Using lazy imports to avoid circular dependencies

export enum UserRole {
  USER = 'USER',
  STAFF = 'STAFF',
  OPERATOR = 'OPERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 255)
  password: string;

  @Column()
  @Length(2, 50)
  firstName: string;

  @Column()
  @Length(2, 50)
  lastName: string;

  @Column({ nullable: true })
  @IsOptional()
  phone?: string;

  @Column({ nullable: true })
  @IsOptional()
  profileImage?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @IsOptional()
  emailVerificationToken?: string;

  @Column({ nullable: true })
  @IsOptional()
  resetPasswordToken?: string;

  @Column({ nullable: true })
  @IsOptional()
  resetPasswordExpires?: Date;

  @Column({ nullable: true })
  @IsOptional()
  lastLoginAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToOne('StaffProfile', 'user')
  staffProfile?: any;

  @OneToMany('Booking', 'customer')
  bookings: any[];

  @OneToMany('CustomTourRequest', 'customer')
  customTourRequests: any[];

  @OneToMany('Review', 'reviewer')
  reviews: any[];

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Methods
  toJSON() {
    const { password, emailVerificationToken, resetPasswordToken, ...result } = this;
    return result;
  }
}