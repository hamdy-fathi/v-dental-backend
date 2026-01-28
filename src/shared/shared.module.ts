import { Global, Module } from "@nestjs/common";
import { EmailModule } from "./services/email.module";

@Global()
@Module({
  imports: [EmailModule],
  exports: [EmailModule],
})
export class SharedModule {}
