import { Body, Controller, Post, Put, Req } from "@nestjs/common";
import { BaseController } from "src/shared/base/base.controller";
import { Roles } from "src/shared/decorators/roles.decorator";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { UserDto } from "./dtos/create.dto";
import { PatchUserDto } from "./dtos/patch.dto";
import { UpdatePasswordDto } from "./dtos/update-password.dto";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController
  extends BaseController<User, UserDto, PatchUserDto>
  implements SelectOptions, RelationOptions
{
  constructor(protected readonly service: UserService) {
    super(service);
  }

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      birthOfDate: true,
      type: true,
      role: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }

  @Post("/store")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public create(@Body() create: UserDto, @Req() req: Request) {
    return this.service.create(
      {
        firstName: create.firstName,
        lastName: create.lastName,
        email: create.email,
        username: create.username,
        birthOfDate: create.birthOfDate,
        type: create.type,
        role: create.role,
        phoneNumber: create.phoneNumber,
        password: req["password"],
        createdBy: req["createdBy"],
      } as UserDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public async update(@Body() update: PatchUserDto, @Req() req: Request) {
    const updateData: PatchUserDto = {
      id: update.id,
      firstName: update.firstName,
      lastName: update.lastName,
      email: update.email,
      username: update.username,
      birthOfDate: update.birthOfDate,
      type: update.type,
      role: update.role,
      phoneNumber: update.phoneNumber,
      createdBy: req["createdBy"],
    };
    if (req["password"]) updateData.password = req["password"];

    return await this.service.update(updateData, this.selectOptions(), this.getRelationOptions());
  }

  @Put("/change-status")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public changeStatus(@Body() update: { id: number; isActive: boolean }) {
    return this.service.changeStatus(update.id, update.isActive, "isActive", {
      id: true,
      isActive: true,
    });
  }

  @Put("/update-password")
  @Roles("CEO", "TECH_SUPPORT", "STORE_MANAGER", "SUPER_ADMIN", "CONTENT_MANAGER", "SYSTEM_ADMIN")
  public async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Req() req: Request) {
    return await this.service.updatePassword(updatePasswordDto.id, req["password"]);
  }
}
