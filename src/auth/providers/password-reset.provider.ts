import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes } from "crypto";
import { EmailService } from "src/shared/services/email.service";
import { UserService } from "src/users/user.service";
import { Repository } from "typeorm";
import { PasswordResetToken } from "../entities/password-reset-token.entity";
import { HashingProvider } from "./hashing.provider";

@Injectable()
export class PasswordResetProvider {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly emailService: EmailService,
  ) {}

  async generateResetToken(email: string): Promise<void> {
    // Find user by email
    try {
      const user = await this.userService.findOneByEmail(email);
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const resetToken = this.passwordResetTokenRepository.create({
        token,
        expiresAt,
        user,
      });

      await this.passwordResetTokenRepository.save(resetToken);

      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.firstName || user.username,
        token,
      );
    } catch {
      return;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find the token
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token },
      relations: ["user"],
    });

    if (!resetToken) {
      throw new BadRequestException("Invalid reset token");
    }

    if (resetToken.isUsed) {
      throw new BadRequestException("Reset token has already been used");
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException("Reset token has expired");
    }

    // Hash the new password
    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);

    // Update user password using UserService - get user ID from the token relation
    await this.userService.updatePassword(resetToken.user.id, hashedPassword);

    // Mark token as used
    await this.passwordResetTokenRepository.update(resetToken.id, {
      isUsed: true,
    });
  }

  async validateResetToken(token: string): Promise<{ valid: boolean; user?: any }> {
    const resetToken = await this.passwordResetTokenRepository.findOne({
      where: { token },
      relations: ["user"],
    });

    if (!resetToken) {
      return { valid: false };
    }

    if (resetToken.isUsed) {
      return { valid: false };
    }

    if (resetToken.expiresAt < new Date()) {
      return { valid: false };
    }

    // Return user information (excluding sensitive data)
    const user = {
      id: resetToken.user.id,
      email: resetToken.user.email,
      firstName: resetToken.user.firstName,
      lastName: resetToken.user.lastName,
      username: resetToken.user.username,
    };

    return { valid: true, user };
  }
}
