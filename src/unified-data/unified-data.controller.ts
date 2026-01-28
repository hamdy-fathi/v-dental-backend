import { Controller, Get } from "@nestjs/common";
import { Auth } from "../shared/decorators/auth.decorator";
import { AuthType } from "../shared/enum/global-enum";
import { UnifiedDataService } from "./unified-data.service";

@Controller("unified-data")
export class UnifiedDataController {
  constructor(private readonly unifiedDataService: UnifiedDataService) {}

  @Get("data")
  @Auth(AuthType.None)
  async getAllSectionsData() {
    return await this.unifiedDataService.getAllSectionsData();
  }
}
