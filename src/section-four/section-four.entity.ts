import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionFour extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Main headline
  @Column({ nullable: true })
  main_headline: string;

  // Main description
  @Column({ nullable: true, type: "text" })
  main_description: string;

  // Right section images (4 separate images)
  @Column({ nullable: true })
  right_section_image_1: string;

  @Column({ nullable: true })
  right_section_image_2: string;

  @Column({ nullable: true })
  right_section_image_3: string;

  @Column({ nullable: true })
  right_section_image_4: string;

  // Features array as JSONB (array of objects with title, description, image)
  @Column("jsonb", { nullable: true })
  features: Array<{
    title: string;
    description: string;
    image: string;
  }>;

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
