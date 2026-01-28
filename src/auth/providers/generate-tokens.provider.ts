import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.entity";
import jwtConfig from "../config/jwt.config";
import { ActiveUserData } from "../interfaces/active-user-data.interface";

@Injectable()
export class GenerateTokensProvider {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: "",
        issuer: "",
        secret: this.jwtConfiguration.secret,
      },
    );
  }

  public async generateTokens(user: User) {
    const [access_token, refreshToken] = await Promise.all([
      // Generate Access Token with Email
      this.signToken<Partial<ActiveUserData>>(user.id, null, {
        email: user.email,
        id: user.id,
      }),

      // Generate Refresh token without email
      this.signToken(user.id, null),
    ]);

    return {
      access_token,
      refreshToken,
      token_type: "Bearer",
      user,
    };
  }
}
