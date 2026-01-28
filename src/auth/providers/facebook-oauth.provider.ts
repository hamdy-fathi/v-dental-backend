import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role, UserStatus } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { UserService } from "src/users/user.service";
import { GenerateTokensProvider } from "./generate-tokens.provider";

@Injectable()
export class FacebookOAuthProvider {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  async validateFacebookUser(profile: any): Promise<any> {
    const { id, emails, name, photos } = profile;

    if (!emails || !emails[0]) {
      throw new UnauthorizedException("Email not provided by Facebook");
    }

    const email = emails[0].value;
    let user = await this.userService.findByEmail(email);

    if (!user) {
      // Create new user if doesn't exist
      user = await this.createFacebookUser({
        facebookId: id,
        email,
        firstName: name?.givenName || "",
        lastName: name?.familyName || "",
        avatar: photos?.[0]?.value || null,
      });
    } else {
      // Update existing user with Facebook ID if not already set
      if (!user.facebookId) {
        await this.userService.updateFacebookId(user.id, id);
      }
    }

    return user;
  }

  private async createFacebookUser(facebookData: {
    facebookId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  }): Promise<User> {
    const userData = {
      email: facebookData.email,
      firstName: facebookData.firstName,
      lastName: facebookData.lastName,
      avatar: facebookData.avatar || null,
      facebookId: facebookData.facebookId,
      role: Role.CUSTOMER, // Default role for Facebook users
      type: UserStatus.CUSTOMER,
      isActive: true,
      // Generate a random password for Facebook users (they won't use it)
      password: Math.random().toString(36).slice(-10),
      password_confirmation: Math.random().toString(36).slice(-10), // Same as password for validation
      phoneNumber: "00000000000", // Temporary placeholder, user should update later
      birthOfDate: new Date().toISOString().split("T")[0], // Convert to string format for DTO
      username: facebookData.email.split("@")[0], // Generate username from email
      createdBy: null, // Will be set by the service
    };

    return await this.userService.create(userData);
  }

  async generateTokensForFacebookUser(user: User) {
    return await this.generateTokensProvider.generateTokens(user);
  }
}
