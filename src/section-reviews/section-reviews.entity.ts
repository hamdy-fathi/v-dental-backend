import { Language } from "src/language/language.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SectionReviews extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Reviews array as JSONB (array of objects with review details)
  @Column("jsonb", { nullable: true })
  reviews: Array<{
    image: string;
    rating: number;
    rating_text: string;
    review_text: string;
    reviewer_name: string;
    reviewer_image: string;
  }>;

  @ManyToOne(() => Language, { onDelete: "CASCADE" })
  language: Language;

  // Is active/visible
  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
