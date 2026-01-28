import { Injectable, OnModuleInit } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { GeneralSettingsService } from "src/general-settings/settings.service";

@Injectable()
export class GoogleOAuthStrategy
  extends PassportStrategy(Strategy, "google")
  implements OnModuleInit
{
  private strategy: Strategy;
  private isConfigured = false;
  private initializationPromise: Promise<void>;

  constructor(private readonly generalSettingsService: GeneralSettingsService) {
    super({
      clientID: "temp-client-id",
      clientSecret: "temp-client-secret",
      callbackURL: "http://localhost:3001/api/auth/google/redirect",
      scope: ["profile", "email"],
    });
    this.initializationPromise = this.initializeStrategy();
  }

  private async initializeStrategy(): Promise<void> {
    try {
      const googleSettings = await this.generalSettingsService.getGoogleOAuthSettings();

      if (
        googleSettings &&
        googleSettings.client_id_google &&
        googleSettings.client_secret_google
      ) {
        // Create new strategy with database settings
        this.strategy = new Strategy(
          {
            clientID: googleSettings.client_id_google,
            clientSecret: googleSettings.client_secret_google,
            callbackURL:
              googleSettings.client_callback_url_google ||
              "http://localhost:3001/api/auth/google/redirect",
            scope: ["profile", "email"],
          },
          this.validate.bind(this),
        );
        this.isConfigured = true;
      }
    } catch (error) {
      console.error("Failed to load Google OAuth settings from database:", error);
    }
  }

  async onModuleInit() {
    await this.initializationPromise;
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, name, photos } = profile;

    const user = {
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0].value,
      accessToken,
    };

    done(null, user);
  }

  authenticate(req: any, options?: any): any {
    if (this.isConfigured && this.strategy) {
      return this.strategy.authenticate(req, options);
    }
    return super.authenticate(req, options);
  }
}
