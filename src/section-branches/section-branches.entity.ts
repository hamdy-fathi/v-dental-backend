import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionBranches extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Branches array as JSONB (array of objects with branch details)
  @Column("jsonb", { nullable: true })
  branches: Array<{
    iframe: string;
    working_hours: string;
    address: string;
  }>;

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
