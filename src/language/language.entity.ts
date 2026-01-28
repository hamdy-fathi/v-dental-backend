import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Language extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Language name
  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
