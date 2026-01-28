import { Injectable, Logger } from "@nestjs/common";
import { GeneralSettingsService } from "../../general-settings/settings.service";

@Injectable()
export class EmailConfigService {
  private readonly logger = new Logger(EmailConfigService.name);

  constructor(private readonly settingsService: GeneralSettingsService) {}

  async getEmailConfig() {
    try {
      const settings = await this.settingsService.findAll({});
      if (settings && settings.length > 0) {
        const emailSettings = settings[0];

        // Check if we have the minimum required settings
        if (emailSettings.smtp_host && emailSettings.smtp_username && emailSettings.smtp_password) {
          const config = {
            transport: {
              host: emailSettings.smtp_host,
              port: emailSettings.smtp_port || 587,
              secure: true,
              auth: {
                user: emailSettings.smtp_email,
                pass: emailSettings.smtp_password,
              },
            },
            defaults: {
              from:
                emailSettings.store_email ||
                `noreply@${emailSettings.smtp_host.split(".").slice(-2).join(".")}`,
            },
          };

          // Validate the configuration
          if (this.validateEmailConfig(config)) {
            return config;
          } else {
            this.logger.warn(
              "Invalid email configuration in database, falling back to environment variables",
            );
          }
        } else {
          this.logger.warn(
            "Incomplete email settings in database, falling back to environment variables",
          );
        }
      }

      return {
        transport: {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === "true",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: process.env.EMAIL_FROM || "Azalove <noreply@azalove.com>",
        },
      };
    } catch (error) {
      this.logger.error("Error getting email configuration:", error);
      // Fallback to environment variables if there's an error
      return {
        transport: {
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: process.env.EMAIL_SECURE === "true",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        defaults: {
          from: process.env.EMAIL_FROM || "Azalove <noreply@azalove.com>",
        },
      };
    }
  }

  private validateEmailConfig(config: any): boolean {
    const transport = config.transport;
    const defaults = config.defaults;

    if (
      !transport ||
      !transport.host ||
      !transport.auth ||
      !transport.auth.user ||
      !transport.auth.pass
    ) {
      return false;
    }

    if (!defaults || !defaults.from) {
      return false;
    }

    return true;
  }
}
