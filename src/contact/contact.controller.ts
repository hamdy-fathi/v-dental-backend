import { Body, Controller, Post, Put } from "@nestjs/common";
import { BaseController } from "src/shared/base/base.controller";
import { Auth } from "src/shared/decorators/auth.decorator";
import { AuthType } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { EmailService } from "src/shared/services/email.service";
import { Contact } from "./contact.entity";
import { ContactsService } from "./contact.service";
import { ContactDto } from "./dtos/create.dto";
import { PatchContactDto } from "./dtos/patch.dto";

@Controller("contact")
export class ContactController
  extends BaseController<Contact, ContactDto, PatchContactDto>
  implements SelectOptions, RelationOptions
{
  constructor(
    protected readonly service: ContactsService,
    private readonly emailService: EmailService,
  ) {
    super(service);
  }

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
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
  @Auth(AuthType.None)
  public async create(@Body() create: ContactDto) {
    const contact = await this.service.create(
      {
        name: create.name,
        email: create.email,
        phone: create.phone,
        subject: create.subject,
        message: create.message,
      },
      this.selectOptions(),
    );

    // Send thank you email
    try {
      await this.emailService.sendContactThankYou(create.email, create.name, create.subject);
    } catch (error) {
      console.error("Failed to send thank you email:", error);
    }

    return contact;
  }

  @Put("/update")
  @Auth(AuthType.None)
  public async update(@Body() update: PatchContactDto) {
    return await this.service.update(
      {
        id: update.id,
        name: update.name,
        email: update.email,
        phone: update.phone,
        subject: update.subject,
        message: update.message,
      },
      this.selectOptions(),
    );
  }
}
