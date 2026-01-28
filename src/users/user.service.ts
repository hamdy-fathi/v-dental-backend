import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LanguageService } from "src/language/language.service";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interfaces/crud-service.interface";
import { ILike, Repository } from "typeorm";
import { UserDto } from "./dtos/create.dto";
import { PatchUserDto } from "./dtos/patch.dto";
import { User } from "./user.entity";
@Injectable()
export class UserService
  extends BaseService<User, UserDto, PatchUserDto>
  implements ICrudService<User, UserDto, PatchUserDto>
{
  constructor(
    apiFeaturesService: APIFeaturesService,
    @InjectRepository(User)
    repository: Repository<User>,
    protected readonly languageService: LanguageService,
  ) {
    super(repository, apiFeaturesService, languageService);
  }

  public async findOneByEmail(email: string) {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(`${email} not found`);
    }
    return user;
  }

  public async searchUsers(query: string) {
    return this.repository.find({
      where: [
        { firstName: ILike(`%${query}%`) },
        { lastName: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }

  public async updatePassword(id: number, hashedPassword: string) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }

    user.password = hashedPassword;
    return await this.repository.save(user);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  public async updateGoogleId(id: number, googleId: string): Promise<void> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }

    user.googleId = googleId;
    await this.repository.save(user);
  }

  public async findByGoogleId(googleId: string): Promise<User | null> {
    return await this.repository.findOne({ where: { googleId } });
  }

  public async updateFacebookId(id: number, facebookId: string): Promise<void> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException(`User with id ${id} not found`);
    }

    user.facebookId = facebookId;
    await this.repository.save(user);
  }

  public async findByFacebookId(facebookId: string): Promise<User | null> {
    return await this.repository.findOne({ where: { facebookId } });
  }
}
