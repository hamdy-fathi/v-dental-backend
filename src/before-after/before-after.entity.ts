import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("before_after")
export class BeforeAfter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  before: string;

  @Column({ type: "varchar", length: 255 })
  after: string;

  @Column({ type: "varchar", length: 255 })
  description: string;
}

