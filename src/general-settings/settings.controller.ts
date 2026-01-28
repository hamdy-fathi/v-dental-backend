import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req } from "@nestjs/common";
import { Auth } from "src/shared/decorators/auth.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { AuthType, Role } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { CreateGeneralSettingsDto } from "./dto/create-settings.dto";
import { UpdateGeneralSettingsDto } from "./dto/update-settings-packages.dto";
import { GeneralSettingsService } from "./settings.service";

@Controller("general-settings")
export class GeneralSettingsController implements SelectOptions, RelationOptions {
  constructor(private readonly service: GeneralSettingsService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      content: true,
      store_email: true,
      store_phone: true,
      blog_image: true,
      gtm_container_id: true,
      google_analytics_id: true,
      facebook_pixel_id: true,
      snapchat_pixel_id: true,
      init_tiktok_id: true,
      gtm_enabled: true,
      google_analytics_enabled: true,
      facebook_pixel_enabled: true,
      snapchat_pixel_enabled: true,
      init_tiktok_enabled: true,
      facebook_url: true,
      instagram_url: true,
      tiktok_url: true,
      created_at: true,
      updated_at: true,
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

  @Get("/front")
  @Auth(AuthType.None)
  async getGeneralSettings() {
    return await this.service.getGeneralSettings();
  }

  @Post("/index")
  @HttpCode(200)
  @Auth(AuthType.None)
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/show")
  @HttpCode(200)
  async findOne(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/store")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async create(@Body() create: CreateGeneralSettingsDto, @Req() req: Request) {
    return await this.service.create(
      {
        content: create.content,
        store_email: create.store_email,
        store_phone: create.store_phone,
        blog_image: create.blog_image,
        gtm_container_id: create.gtm_container_id,
        google_analytics_id: create.google_analytics_id,
        facebook_pixel_id: create.facebook_pixel_id,
        snapchat_pixel_id: create.snapchat_pixel_id,
        init_tiktok_id: create.init_tiktok_id,
        gtm_enabled: create.gtm_enabled,
        google_analytics_enabled: create.google_analytics_enabled,
        facebook_pixel_enabled: create.facebook_pixel_enabled,
        snapchat_pixel_enabled: create.snapchat_pixel_enabled,
        init_tiktok_enabled: create.init_tiktok_enabled,
        facebook_url: create.facebook_url,
        instagram_url: create.instagram_url,
        tiktok_url: create.tiktok_url,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async update(@Body() update: UpdateGeneralSettingsDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        content: update.content,
        store_email: update.store_email,
        store_phone: update.store_phone,
        blog_image: update.blog_image,
        gtm_container_id: update.gtm_container_id,
        google_analytics_id: update.google_analytics_id,
        facebook_pixel_id: update.facebook_pixel_id,
        snapchat_pixel_id: update.snapchat_pixel_id,
        init_tiktok_id: update.init_tiktok_id,
        gtm_enabled: update.gtm_enabled,
        google_analytics_enabled: update.google_analytics_enabled,
        facebook_pixel_enabled: update.facebook_pixel_enabled,
        snapchat_pixel_enabled: update.snapchat_pixel_enabled,
        init_tiktok_enabled: update.init_tiktok_enabled,
        facebook_url: update.facebook_url,
        instagram_url: update.instagram_url,
        tiktok_url: update.tiktok_url,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Post("/get-google-oauth-config")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async getGoogleOAuthConfig() {
    try {
      const googleSettings = await this.service.getGoogleOAuthSettings();
      return {
        success: true,
        data: googleSettings,
        message: googleSettings
          ? "Google OAuth configuration loaded successfully"
          : "No Google OAuth configuration found",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error getting Google OAuth configuration: " + error.message,
      };
    }
  }

  @Post("/test-google-oauth-config")
  @Auth(AuthType.Bearer)
  @Roles(Role.SUPER_ADMIN, Role.SYSTEM_ADMIN, Role.CONTENT_MANAGER)
  async testGoogleOAuthConfig() {
    try {
      const googleSettings = await this.service.getGoogleOAuthSettings();

      if (!googleSettings) {
        return {
          success: false,
          message: "No Google OAuth configuration found",
        };
      }

      // Validate required fields
      const requiredFields = ["client_id_google", "client_secret_google"];
      const missingFields = requiredFields.filter(field => !googleSettings[field]);

      if (missingFields.length > 0) {
        return {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          data: googleSettings,
        };
      }

      // Check if callback URL is configured
      if (!googleSettings.client_callback_url_google) {
        return {
          success: true,
          message:
            "Google OAuth configuration is valid but callback URL is not configured (will use default)",
          data: googleSettings,
          warning: "Callback URL not configured",
        };
      }

      return {
        success: true,
        message: "Google OAuth configuration is valid and complete",
        data: googleSettings,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error testing Google OAuth configuration: " + error.message,
      };
    }
  }
}
