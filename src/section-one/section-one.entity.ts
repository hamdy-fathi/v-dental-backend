import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionOne extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Main headline
  @Column({ nullable: true })
  main_headline: string;

  // Sub headline
  @Column({ nullable: true })
  sub_headline: string;

  // Doctor count text
  @Column({ nullable: true })
  doctor_count_text: string;

  // Available doctors array as JSONB (array of objects with doctor details)
  @Column("jsonb", { nullable: true })
  available_doctors_images: Array<{
    name: string;
    short_description: string;
    image: string;
  }>;

  // Available doctors images array
  @Column("simple-array", { nullable: true })
  talk_doctors_images: string[];

  // Main clinic image
  @Column({ nullable: true })
  main_clinic_image: string;

  // Additional clinic images array
  @Column("simple-array", { nullable: true })
  additional_clinic_images: string[];

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
