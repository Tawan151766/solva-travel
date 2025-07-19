import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsOptional, Length, IsEnum } from 'class-validator';
// Using string references to avoid circular dependencies

export enum GalleryCategory {
  BEACH = 'BEACH',
  MOUNTAIN = 'MOUNTAIN',
  CITY = 'CITY',
  FOREST = 'FOREST',
  DESERT = 'DESERT',
  CULTURAL = 'CULTURAL',
  ADVENTURE = 'ADVENTURE',
  LUXURY = 'LUXURY',
  WILDLIFE = 'WILDLIFE',
  FOOD = 'FOOD',
  ACCOMMODATION = 'ACCOMMODATION',
  TRANSPORTATION = 'TRANSPORTATION',
  OTHER = 'OTHER',
}

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Length(1, 200)
  title: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description?: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  @IsOptional()
  thumbnailUrl?: string;

  @Column({
    type: 'enum',
    enum: GalleryCategory,
    default: GalleryCategory.OTHER,
  })
  @IsEnum(GalleryCategory)
  category: GalleryCategory;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  @IsOptional()
  location?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  @IsOptional()
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  @IsOptional()
  longitude?: number;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  uploadedById?: string;

  @Column({ nullable: true })
  @IsOptional()
  photographer?: string;

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  dateTaken?: Date;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column('int', { default: 0 })
  viewCount: number;

  @Column('int', { default: 0 })
  likeCount: number;

  @Column('int', { default: 0 })
  downloadCount: number;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  metadata?: {
    width?: number;
    height?: number;
    fileSize?: number;
    format?: string;
    camera?: string;
    lens?: string;
    settings?: {
      iso?: number;
      aperture?: string;
      shutterSpeed?: string;
      focalLength?: string;
    };
  };

  @Column({ nullable: true })
  @IsOptional()
  altText?: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  caption?: string;

  @Column({ default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy?: any;

  // Virtual properties
  get aspectRatio(): number | null {
    if (this.metadata?.width && this.metadata?.height) {
      return this.metadata.width / this.metadata.height;
    }
    return null;
  }

  get isLandscape(): boolean {
    const ratio = this.aspectRatio;
    return ratio !== null && ratio > 1;
  }

  get isPortrait(): boolean {
    const ratio = this.aspectRatio;
    return ratio !== null && ratio < 1;
  }

  get isSquare(): boolean {
    const ratio = this.aspectRatio;
    return ratio !== null && Math.abs(ratio - 1) < 0.1;
  }

  get fileExtension(): string {
    return this.imageUrl.split('.').pop()?.toLowerCase() || '';
  }

  // Methods
  incrementView(): void {
    this.viewCount += 1;
  }

  incrementLike(): void {
    this.likeCount += 1;
  }

  decrementLike(): void {
    if (this.likeCount > 0) {
      this.likeCount -= 1;
    }
  }

  incrementDownload(): void {
    this.downloadCount += 1;
  }

  feature(): void {
    this.isFeatured = true;
  }

  unfeature(): void {
    this.isFeatured = false;
  }

  hide(): void {
    this.isPublic = false;
  }

  show(): void {
    this.isPublic = true;
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag.toLowerCase())) {
      this.tags.push(tag.toLowerCase());
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag.toLowerCase());
  }

  updateLocation(location: string, lat?: number, lng?: number): void {
    this.location = location;
    if (lat !== undefined) this.latitude = lat;
    if (lng !== undefined) this.longitude = lng;
  }
}