import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, UserStatus } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { UserService } from "src/users/user.service";
import { GenerateTokensProvider } from "./generate-tokens.provider";

@Injectable()
export class GoogleOAuthProvider {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async validateGoogleUser(profile: any): Promise<any> {
    const { id, emails, name, photos } = profile;

    if (!emails || !emails[0]) {
      throw new UnauthorizedException("Email not provided by Google");
    }

    const email = emails[0].value;
    let user = await this.userService.findByEmail(email);

    if (!user) {
      // Create new user if doesn't exist
      user = await this.createGoogleUser({
        googleId: id,
        email,
        firstName: name?.givenName || "",
        lastName: name?.familyName || "",
        avatar: photos?.[0]?.value || null,
      });
    } else {
      // Update existing user with Google ID if not already set
      if (!user.googleId) {
        await this.userService.updateGoogleId(user.id, id);
      }
    }

    return user;
  }

  private async createGoogleUser(googleData: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  }): Promise<User> {
    const userData = {
      email: googleData.email,
      firstName: googleData.firstName,
      lastName: googleData.lastName,
      avatar: googleData.avatar || null,
      googleId: googleData.googleId,
      role: Role.CUSTOMER, // Default role for Google users
      type: UserStatus.CUSTOMER,
      isActive: true,
      // Generate a random password for Google users (they won't use it)
      password: Math.random().toString(36).slice(-10),
      password_confirmation: Math.random().toString(36).slice(-10), // Same as password for validation
      phoneNumber: "00000000000", // Temporary placeholder, user should update later
      birthOfDate: new Date().toISOString().split("T")[0], // Convert to string format for DTO
      username: googleData.email.split("@")[0], // Generate username from email
      createdBy: null, // Will be set by the service
    };

    return await this.userService.create(userData);
  }

  async generateTokensForGoogleUser(user: User) {
    return await this.generateTokensProvider.generateTokens(user);
  }
}
