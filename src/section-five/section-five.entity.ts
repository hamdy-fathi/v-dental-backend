import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionFive extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Doctor image
  @Column({ nullable: true })
  doctor_image: string;

  // About Services array
  @Column("simple-array", { nullable: true })
  about_services: string[];

  // Experience years count
  @Column({ nullable: true })
  experience_years: string;

  // Title
  @Column({ nullable: true })
  title: string;

  // Short description
  @Column({ nullable: true })
  short_description: string;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
