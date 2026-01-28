import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { EmailConfigModule } from "./email-config.module";
import { EmailConfigService } from "./email-config.service";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";

@Module({
  imports: [
    EmailConfigModule,
    MailerModule.forRootAsync({
      imports: [EmailConfigModule],
      useFactory: async (emailConfigService: EmailConfigService) => {
        try {
          const config = await emailConfigService.getEmailConfig();

          if (
            !config.transport.host ||
            !config.transport.auth?.user ||
            !config.transport.auth?.pass
          ) {
            throw new Error("Invalid email configuration: missing required SMTP settings");
          }

          return {
            transport: {
              host: config.transport.host,
              port: config.transport.port,
              secure: config.transport.secure,
              auth: {
                user: config.transport.auth.user,
                pass: config.transport.auth.pass,
              },
            },
            defaults: {
              from: config.defaults.from,
            },
          };
        } catch (error) {
          console.error("Failed to initialize email configuration:", error);
          // Return a minimal configuration that will fail gracefully
          return {
            transport: {
              host: "localhost",
              port: 25,
              secure: false,
              auth: {
                user: "noreply",
                pass: "nopass",
              },
            },
            defaults: {
              from: "noreply@localhost",
            },
          };
        }
      },
      inject: [EmailConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
