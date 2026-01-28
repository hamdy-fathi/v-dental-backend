import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GeneralSettings extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Store Information
  @Column({ name: "content", type: "json", nullable: true })
  content: Array<{
    store_name: string;
    store_address: string;
    meta_title: string;
    meta_favicon: string;
    logo: string;
    meta_description: string;
    meta_keywords: string;
    meta_author: string;
    meta_robots: string;
    meta_canonical: string;
    meta_image: string;
    meta_og_title: string;
    meta_og_description: string;
    meta_og_image: string;
    meta_og_url: string;
    meta_og_type: string;
    meta_og_locale: string;
    meta_og_site_name: string;
    language_id: number;
  }>;

  @Column({ nullable: true })
  store_email: string;

  @Column({ nullable: true })
  store_phone: string;

  @Column({ nullable: true })
  blog_image: string;

  // Google Tag Manager
  @Column({ nullable: true })
  gtm_container_id: string;

  @Column({ nullable: true })
  google_analytics_id: string;

  @Column({ nullable: true })
  facebook_pixel_id: string;

  @Column({ nullable: true })
  snapchat_pixel_id: string;

  @Column({ nullable: true })
  init_tiktok_id: string;

  @Column({ nullable: true, default: false })
  gtm_enabled: boolean;

  @Column({ nullable: true, default: false })
  google_analytics_enabled: boolean;

  @Column({ nullable: true, default: false })
  facebook_pixel_enabled: boolean;

  @Column({ nullable: true, default: false })
  snapchat_pixel_enabled: boolean;

  @Column({ nullable: true, default: false })
  init_tiktok_enabled: boolean;

  // Social Media
  @Column({ nullable: true })
  facebook_url: string;

  @Column({ nullable: true })
  instagram_url: string;

  @Column({ nullable: true })
  tiktok_url: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
