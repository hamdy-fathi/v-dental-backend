import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionDoctors extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Title
  @Column({ nullable: true })
  title: string;

  // Description
  @Column({ nullable: true, type: "text" })
  description: string;

  // Doctors array as JSONB (array of objects with doctor details)
  @Column("jsonb", { nullable: true })
  doctors: Array<{
    name: string;
    short_description: string;
    small_image: string;
    facebook: string;
    instagram: string;
    image_main: string;
  }>;

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
