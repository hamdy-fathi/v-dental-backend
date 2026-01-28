import { Body, Controller, Post } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, Role } from "src/shared/enum/global-enum";
import { EmailService } from "./email.service";

@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("/test-config")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async testEmailConfig(@Body() body: { testEmail: string }) {
    try {
      const result = await this.emailService.testEmailConfiguration(body.testEmail);
      return {
        success: result,
        message: result
          ? "Test email sent successfully! Check your inbox."
          : "Failed to send test email. Please check your SMTP configuration.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error testing email configuration: " + error.message,
      };
    }
  }

  @Post("/get-config")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async getEmailConfig() {
    try {
      const config = await this.emailService.getEmailConfiguration();
      return {
        success: true,
        data: config,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting email configuration: " + error.message,
      };
    }
  }
}
