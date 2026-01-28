import { Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Role, UserStatus } from "src/shared/enum/global-enum";
import { UserService } from "src/users/user.service";
import jwtConfig from "../config/jwt.config";
import { FacebookOAuthCallbackDto } from "../dtos/facebook-oauth.dto";
import { ForgetPasswordDto } from "../dtos/forget-password.dto";
import { GoogleOAuthCallbackDto } from "../dtos/google-oauth.dto";
import { RegisterDto } from "../dtos/register.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { SignInDto } from "../dtos/signin.dto";
import { ActiveUserData } from "../interfaces/active-user-data.interface";
import { FacebookOAuthProvider } from "./facebook-oauth.provider";
import { GenerateTokensProvider } from "./generate-tokens.provider";
import { GoogleOAuthProvider } from "./google-oauth.provider";
import { HashingProvider } from "./hashing.provider";
import { PasswordResetProvider } from "./password-reset.provider";
import { SignInProvider } from "./sign-in.provider";

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,

    /**
     * Inject the signInProvider
     */
    private readonly signInProvider: SignInProvider,

    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly passwordResetProvider: PasswordResetProvider,

    private readonly googleOAuthProvider: GoogleOAuthProvider,

    private readonly facebookOAuthProvider: FacebookOAuthProvider,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException("User with this email already exists");
    }

    const hashedPassword = await this.hashingProvider.hashPassword(registerDto.password);

    const userData = {
      ...registerDto,
      password: hashedPassword,
      role: Role.CUSTOMER,
      phoneNumber: registerDto.phoneNumber.slice(1),
      type: UserStatus.CUSTOMER,
      createdBy: null,
    };

    delete userData.password_confirmation;

    const user = await this.usersService.create(userData);
    return await this.generateTokensProvider.generateTokens(user);
  }

  public async refreshToken(refreshToken: { refreshToken: string }) {
    return await this.signInProvider.refreshToken(refreshToken);
  }

  public async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync<ActiveUserData>(token, {
      secret: this.jwtConfiguration.secret,
      audience: "",
    });

    const user = await this.usersService.findOne(payload.sub, {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      valid: true,
      user,
    };
  }

  public async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    await this.passwordResetProvider.generateResetToken(forgetPasswordDto.email);
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.passwordResetProvider.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  public async validateResetToken(token: string): Promise<{ valid: boolean; user?: any }> {
    return await this.passwordResetProvider.validateResetToken(token);
  }

  public async googleOAuthLogin(googleData: GoogleOAuthCallbackDto) {
    const user = await this.googleOAuthProvider.validateGoogleUser(googleData);
    return await this.googleOAuthProvider.generateTokensForGoogleUser(user);
  }

  public async facebookOAuthLogin(facebookData: FacebookOAuthCallbackDto) {
    const user = await this.facebookOAuthProvider.validateFacebookUser(facebookData);
    return await this.facebookOAuthProvider.generateTokensForFacebookUser(user);
  }
}
