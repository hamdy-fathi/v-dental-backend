import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionTwo extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Main headline
  @Column({ nullable: true })
  main_headline: string;

  // Description text
  @Column({ nullable: true, type: "text" })
  description: string;

  // Main clinic image
  @Column({ nullable: true })
  main_clinic_image: string;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
