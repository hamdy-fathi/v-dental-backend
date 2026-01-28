import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionThree extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Main headline
  @Column({ nullable: true })
  main_headline: string;

  // Description text
  @Column({ nullable: true, type: "text" })
  description: string;

  // Services images array
  @Column("simple-array", { nullable: true })
  services_images: string[];

  // Service before image
  @Column({ nullable: true })
  service_image_before: string;

  // Service after image
  @Column({ nullable: true })
  service_image_after: string;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
