import { Module } from "@nestjs/common";
import { GeneralSettingsModule } from "../../general-settings/settings.module";
import { EmailConfigService } from "./email-config.service";

@Module({
  imports: [GeneralSettingsModule],
  providers: [EmailConfigService],
  exports: [EmailConfigService],
})
export class EmailConfigModule {}
