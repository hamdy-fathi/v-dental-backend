import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionReviewsController } from "./section-reviews.controller";
import { SectionReviews } from "./section-reviews.entity";
import { SectionReviewsService } from "./section-reviews.service";

@Module({
  imports: [TypeOrmModule.forFeature([SectionReviews])],
  controllers: [SectionReviewsController],
  providers: [SectionReviewsService],
  exports: [SectionReviewsService],
})
export class SectionReviewsModule {}
