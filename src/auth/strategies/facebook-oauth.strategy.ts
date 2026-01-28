import { Injectable, OnModuleInit } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-facebook";
import { GeneralSettingsService } from "src/general-settings/settings.service";

@Injectable()
export class FacebookOAuthStrategy
  extends PassportStrategy(Strategy, "facebook")
  implements OnModuleInit
{
  private strategy: Strategy;
  private isConfigured = false;
  private initializationPromise: Promise<void>;

  constructor(private readonly generalSettingsService: GeneralSettingsService) {
    super({
      clientID: "temp-client-id",
      clientSecret: "temp-client-secret",
      callbackURL: "http://localhost:3001/api/auth/facebook/redirect",
      scope: ["email", "public_profile"],
      profileFields: ["id", "emails", "name", "photos"],
    });
    this.initializationPromise = this.initializeStrategy();
  }

  private async initializeStrategy(): Promise<void> {
    try {
      const facebookSettings = await this.generalSettingsService.getFacebookOAuthSettings();

      if (
        facebookSettings &&
        facebookSettings.client_id_facebook &&
        facebookSettings.client_secret_facebook
      ) {
        // Create new strategy with database settings
        this.strategy = new Strategy(
          {
            clientID: facebookSettings.client_id_facebook,
            clientSecret: facebookSettings.client_secret_facebook,
            callbackURL:
              facebookSettings.client_callback_url_facebook ||
              "http://localhost:3001/api/auth/facebook/redirect",
            scope: ["email", "public_profile"],
            profileFields: ["id", "emails", "name", "photos"],
          },
          this.validate.bind(this),
        );
        this.isConfigured = true;
      }
    } catch (error) {
      console.error("Failed to load Facebook OAuth settings from database:", error);
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
      facebookId: id,
      email: emails?.[0]?.value || null,
      firstName: name?.givenName || "",
      lastName: name?.familyName || "",
      avatar: photos?.[0]?.value || null,
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
