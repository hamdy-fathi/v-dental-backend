// src/categories/category.entity.ts
import { Blog } from "src/blogs/blog.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { CategoryType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from "./sub-categories/sub-category.entity";

@Entity("categories")
export class Category extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "content", type: "json", nullable: true })
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

  @ManyToMany(() => Blog, blog => blog.categories)
  blogs: Blog[];

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => SubCategory, subCategory => subCategory.category)
  subCategories: SubCategory[];

  @ManyToOne(() => User, user => user.id, { onDelete: "SET NULL" })
  createdBy: User;
}
