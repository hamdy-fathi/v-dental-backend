import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import { Auth } from "src/shared/decorators/auth.decorator";
import { AuthType } from "src/shared/enum/global-enum";
import { ForgetPasswordDto } from "./dtos/forget-password.dto";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import { RegisterDto } from "./dtos/register.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { SignInDto } from "./dtos/signin.dto";
import { VerifyTokenDto } from "./dtos/verify-token.dto";
import { FacebookAuthGuard } from "./guards/facebook-oauth.guard";
import { GoogleAuthGuard } from "./guards/google-oauth.guard";
import { AuthService } from "./providers/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Auth(AuthType.None)
  public register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @Auth(AuthType.None)
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("refresh-tokens")
  @Auth(AuthType.None)
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post("verify-token")
  @Auth(AuthType.None)
  async verifyToken(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyToken(verifyTokenDto.token);
  }

  @Post("logout")
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new UnauthorizedException("Invalid Token");

    return {
      data: true,
    };
  }

  @Post("forget-password")
  @Auth(AuthType.None)
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    await this.authService.forgetPassword(forgetPasswordDto);
    return {
      message: "If an account with that email exists, a password reset link has been sent.",
    };
  }

  @Post("reset-password")
  @Auth(AuthType.None)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      message: "Password has been successfully reset.",
    };
  }

  @Post("validate-reset-token")
  @Auth(AuthType.None)
  async validateResetToken(@Body() body: { token: string }) {
    const result = await this.authService.validateResetToken(body.token);

    if (!result.valid) {
      throw new BadRequestException("Token is invalid or expired");
    }

    return {
      valid: result.valid,
      user: result.user,
      message: "Token is valid",
    };
  }

  @Get("google/callback")
  @Auth(AuthType.None)
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    try {
      const user = req.user;
      const result = await this.authService.googleOAuthLogin(user);

      // Redirect to frontend with tokens
      const redirectUrl =
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?` +
        `access_token=${result.access_token}&` +
        `refresh_token=${result.refreshToken}&` +
        `user_id=${user.id}`;

      res.redirect(redirectUrl);
    } catch (error) {
      const errorUrl =
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error?` +
        `message=${encodeURIComponent(error.message)}`;
      res.redirect(errorUrl);
    }
  }

  @Get("facebook/callback")
  @Auth(AuthType.None)
  @UseGuards(FacebookAuthGuard)
  async facebookAuthCallback(@Req() req: any, @Res() res: any) {
    try {
      const user = req.user;
      const result = await this.authService.facebookOAuthLogin(user);

      // Redirect to frontend with tokens
      const redirectUrl =
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?` +
        `access_token=${result.access_token}&` +
        `refresh_token=${result.refreshToken}&` +
        `user_id=${user.id}`;

      res.redirect(redirectUrl);
    } catch (error) {
      const errorUrl =
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/error?` +
        `message=${encodeURIComponent(error.message)}`;
      res.redirect(errorUrl);
    }
  }
}
