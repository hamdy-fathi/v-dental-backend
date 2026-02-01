import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BeforeAfter } from "./before-after.entity";
import { CreateBeforeAfterDto, UpdateBeforeAfterDto } from "./dto/before-after.dto";

@Injectable()
export class BeforeAfterService {
  constructor(
    @InjectRepository(BeforeAfter)
    private readonly beforeAfterRepository: Repository<BeforeAfter>,
  ) {}

  async getPairs() {
    return this.beforeAfterRepository.find({
      select: ["before", "after", "description"],
      order: { id: "ASC" },
    });
  }

  async getAll() {
    return this.beforeAfterRepository.find({
      order: { id: "ASC" },
    });
  }

  async createPair(createDto: CreateBeforeAfterDto) {
    const entity = this.beforeAfterRepository.create(createDto);
    return this.beforeAfterRepository.save(entity);
  }

  async updatePair(updateDto: UpdateBeforeAfterDto) {
    const { id, ...payload } = updateDto;
    await this.beforeAfterRepository.update(id, payload);
    return this.beforeAfterRepository.findOne({ where: { id } });
  }

  async deletePair(id: number) {
    await this.beforeAfterRepository.delete(id);
    return { deleted: true, id };
  }
}

