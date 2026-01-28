// src/categories/category.entity.ts
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { CategoryType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category.entity";

@Entity()
export class SubCategory extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "content", type: "json" })
  content: Array<{
    name: string;
    description: string;
    language_id: number;
  }>;

  @Column("varchar", { nullable: true, unique: true })
  slug: string;

  @Column({
    type: "enum",
    enum: CategoryType,
    default: CategoryType.PRODUCT,
    name: "category_type",
  })
  categoryType: CategoryType;

  @ManyToOne(() => Category, category => category.subCategories, { onDelete: "CASCADE" })
  category: Category;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => User, user => user.id, { onDelete: "SET NULL" })
  createdBy: User;
}
