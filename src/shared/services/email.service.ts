import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { EmailConfigService } from "./email-config.service";

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailConfigService: EmailConfigService,
  ) {}

  async sendContactThankYou(email: string, name: string, subject: string): Promise<void> {
    const htmlContent = this.generateThankYouTemplate(name, subject);
    const emailConfig = await this.emailConfigService.getEmailConfig();

    await this.mailerService.sendMail({
      to: email,
      subject: "Thank You for Contacting Azalove",
      html: htmlContent,
      from: emailConfig.defaults.from,
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<void> {
    const htmlContent = this.generatePasswordResetTemplate(name, token);
    const emailConfig = await this.emailConfigService.getEmailConfig();

    await this.mailerService.sendMail({
      to: email,
      subject: "Reset Your Azalove Password",
      html: htmlContent,
      from: emailConfig.defaults.from,
    });
  }

  async sendOrderConfirmationEmail(
    email: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    try {
      const emailConfig = await this.emailConfigService.getEmailConfig();

      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: htmlContent,
        from: emailConfig.defaults.from,
      });
    } catch (error) {
      console.error("EmailService sendOrderConfirmationEmail error:", {
        message: error.message,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        hostname: error.hostname,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getEmailConfiguration() {
    return await this.emailConfigService.getEmailConfig();
  }

  async testEmailConfiguration(testEmail: string): Promise<boolean> {
    try {
      const emailConfig = await this.emailConfigService.getEmailConfig();

      await this.mailerService.sendMail({
        to: testEmail,
        subject: "Email Configuration Test - Azalove",
        html: `
          <h2>Email Configuration Test</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p><strong>SMTP Host:</strong> ${emailConfig.transport.host}</p>
          <p><strong>SMTP Port:</strong> ${emailConfig.transport.port}</p>
          <p><strong>From Email:</strong> ${emailConfig.defaults.from}</p>
          <p>If you receive this email, your email configuration is working properly!</p>
        `,
        from: emailConfig.defaults.from,
      });

      return true;
    } catch (error) {
      console.error("Email configuration test failed:", error);
      return false;
    }
  }

  private generateThankYouTemplate(name: string, subject: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Azalove</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #fef7f8 0%, #f4f4f4 100%);
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(177, 42, 73, 0.1);
                border: 1px solid rgba(177, 42, 73, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                margin-bottom: 20px;
            }
            .logo svg {
                width: 80px;
                height: 80px;
            }
            .brand-name {
                color: #b12a49;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
                font-family: 'Georgia', serif;
            }
            .divider {
                border: 0;
                height: 3px;
                background: linear-gradient(to right, #b12a49, #3d2545);
                margin: 20px 0;
                border-radius: 2px;
            }
            .content {
                margin-bottom: 30px;
            }
            .highlight {
                background: linear-gradient(135deg, #fef7f8 0%, #ffeef1 100%);
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                border-left: 4px solid #b12a49;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ffeef1;
                color: #666;
                font-size: 12px;
            }
            .cta {
                background: linear-gradient(135deg, #b12a49 0%, #8a1f3a 100%);
                color: white;
                padding: 14px 28px;
                border-radius: 25px;
                text-decoration: none;
                display: inline-block;
                margin: 15px 0;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(177, 42, 73, 0.3);
            }
            .heart-icon {
                color: #b12a49;
                font-size: 18px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" data-name="Layer 2" viewBox="0 0 327.54 315.62">
                        <defs>
                            <style>
                                .cls-1 { fill: #3d2545; }
                                .cls-2 { fill: #b12a49; }
                            </style>
                        </defs>
                        <g id="Layer_1-2" data-name="Layer 1">
                            <g>
                                <g>
                                    <path class="cls-2" d="M279.75,199.65l-60.01,60.01-6.62,6.62-49.34,49.34-49.56-49.56.4-.2c1.15-.59,2.32-1.22,3.47-1.87,15.44-8.8,27.79-22.3,38.69-34.21,3.65-3.99,7.1-7.76,10.38-11.04l50.25-50.3c11.12-11.13,20.47-18.11,32.66-18.5.36-.01.67-.02.95-.02h.04c.12,0,.24,0,.35,0,10.48,0,20.39,3.97,27.91,11.18.15.15.31.3.46.45,10.58,10.46,10.48,27.59-.04,38.1Z"/>
                                    <path class="cls-2" d="M317.51,130.25c0,2.1-.09,4.2-.25,6.27-2.18-2.67-4.53-5.21-7.05-7.63-15.87-15.21-36.74-23.59-58.79-23.59h-.7c-.65,0-1.31.02-2.06.04-13.08.42-25.11,3.91-36.78,10.67-8.47,4.91-16.5,11.35-26.03,20.9l-50.25,50.3c-3.98,3.98-7.92,8.29-11.74,12.46-9.1,9.95-18.51,20.23-27.87,25.57-.53.3-1.06.59-1.58.85-.05.02-.1.05-.15.07-7.95,3.99-17.56,2.39-23.85-3.9l-34.5-34.5-3.5-3.5c-1.48-1.48-2.89-3.01-4.23-4.59-5.28-6.19-9.48-13.13-12.55-20.69-1.37-3.37-2.49-6.82-3.36-10.32-.99-3.98-1.65-8.03-1.98-12.14-.17-2.09-.26-4.18-.26-6.29,0-9.92,1.88-19.59,5.6-28.74,3.85-9.49,9.49-17.99,16.78-25.28,7.29-7.29,15.79-12.93,25.28-16.78,9.16-3.71,18.82-5.6,28.74-5.6s19.59,1.88,28.74,5.6c9.49,3.84,17.99,9.49,25.28,16.78l23.31,23.31,23.31-23.31c7.29-7.29,15.79-12.93,25.28-16.78,9.16-3.71,18.82-5.6,28.74-5.6s19.59,1.88,28.74,5.6c9.49,3.84,17.99,9.49,25.28,16.78,7.29,7.29,12.93,15.79,16.78,25.28,3.71,9.16,5.59,18.83,5.6,28.74Z"/>
                                    <path class="cls-1" d="M327.54,190.09c.03,20.25-7.9,39.26-22.34,53.51-14.1,13.92-33.02,21.99-53.3,22.74-.68.03-1.37.04-2.07.04-9.58,0-20.18-2.38-30.1-6.72l21.36-21.36c3.45.75,6.79,1.1,9.81.99,27.84-1.03,49.61-22.62,49.57-49.15-.02-13.51-5.38-26.07-15.08-35.37-9.27-8.89-21.49-13.73-34.41-13.62h-.03c-.35,0-.73,0-1.17.02-15.03.48-26.3,8.77-38.58,21.07l-50.25,50.3c-3.42,3.42-6.93,7.26-10.65,11.32-10.46,11.43-22.31,24.39-36.56,32.51-1.02.58-2.06,1.14-3.1,1.67-10.7,5.44-22.63,8.31-34.51,8.31-10.27,0-20.25-2.02-29.64-5.99-9.07-3.83-17.21-9.32-24.2-16.31-6.99-6.99-12.48-15.13-16.31-24.2-3.97-9.39-5.99-19.37-5.99-29.64s2.12-20.79,6.29-30.4c1.7-3.9,3.7-7.62,5.99-11.14.87,3.5,1.99,6.94,3.36,10.32,3.07,7.56,7.27,14.5,12.55,20.69-.74,3.42-1.12,6.94-1.12,10.53,0,27.05,22.01,49.07,49.07,49.07,7.63,0,15.32-1.86,22.24-5.37.65-.33,1.3-.68,1.95-1.05,10.55-6.01,20.44-16.82,30-27.26,3.75-4.1,7.63-8.34,11.47-12.18l50.25-50.3c8.97-8.98,16.44-15,24.23-19.51,10.38-6.01,21.06-9.12,32.66-9.49.66-.02,1.26-.03,1.83-.03.21,0,.43,0,.64,0,19.78,0,38.48,7.5,52.72,21.15,7.31,7.01,13.06,15.25,17.1,24.52,4.18,9.59,6.3,19.8,6.32,30.35Z"/>
                                </g>
                                <path class="cls-1" d="M118.5,51.25c17.41,6.08,32.53,22.96,45.27,35.78,13.98-14.3,30.19-31.9,49.96-37.51L164.21,0l-49.74,49.74c1.35.47,2.7.97,4.03,1.51Z"/>
                            </g>
                        </g>
                    </svg>
                </div>
                <div class="brand-name">Azalove</div>
                <h1 style="color: #b12a49; margin: 0; font-family: 'Georgia', serif;">Thank You for Reaching Out!</h1>
            </div>
            
            <hr class="divider">
            
            <div class="content">
                <p>Dear <strong>${name}</strong>,</p>
                
                <p>We're so grateful you've chosen to connect with us! <span class="heart-icon">💕</span> Your message has been received with love and will be carefully reviewed by our caring team.</p>
                
                <div class="highlight">
                    <p><strong>Your inquiry about:</strong> "${subject}"</p>
                    <p>has been lovingly received and will be handled with the attention it deserves.</p>
                </div>
                
                <p>We promise to get back to you as soon as possible, typically within 24-48 hours during business days. Your patience means the world to us!</p>
                
                <p>If you have any urgent questions or need immediate assistance, please don't hesitate to reach out. We're here for you! <span class="heart-icon">💝</span></p>
                
                <p>Thank you for trusting us and for being part of our Azalove family!</p>
                
                <p>With love and gratitude,<br>
                <strong>The Azalove Team</strong> <span class="heart-icon">💖</span></p>
            </div>
            
            <div class="footer">
                <p>This is an automated email sent with love. Please do not reply to this email address.</p>
                <p>© 2024 Azalove. All rights reserved. Made with <span class="heart-icon">❤️</span></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generatePasswordResetTemplate(name: string, token: string): string {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Azalove Password</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #fef7f8 0%, #f4f4f4 100%);
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(177, 42, 73, 0.1);
                border: 1px solid rgba(177, 42, 73, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                margin-bottom: 20px;
            }
            .logo svg {
                width: 80px;
                height: 80px;
            }
            .brand-name {
                color: #b12a49;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
                font-family: 'Georgia', serif;
            }
            .divider {
                border: 0;
                height: 3px;
                background: linear-gradient(to right, #b12a49, #3d2545);
                margin: 20px 0;
                border-radius: 2px;
            }
            .content {
                margin-bottom: 30px;
            }
            .highlight {
                background: linear-gradient(135deg, #fef7f8 0%, #ffeef1 100%);
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                border-left: 4px solid #b12a49;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ffeef1;
                color: #666;
                font-size: 12px;
            }
            .cta {
                background: linear-gradient(135deg, #b12a49 0%, #8a1f3a 100%);
                color: white;
                padding: 14px 28px;
                border-radius: 25px;
                text-decoration: none;
                display: inline-block;
                margin: 15px 0;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(177, 42, 73, 0.3);
            }
            .warning {
                background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
            }
            .heart-icon {
                color: #b12a49;
                font-size: 18px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" data-name="Layer 2" viewBox="0 0 327.54 315.62">
                        <defs>
                            <style>
                                .cls-1 { fill: #3d2545; }
                                .cls-2 { fill: #b12a49; }
                            </style>
                        </defs>
                        <g id="Layer_1-2" data-name="Layer 1">
                            <g>
                                <g>
                                    <path class="cls-2" d="M279.75,199.65l-60.01,60.01-6.62,6.62-49.34,49.34-49.56-49.56.4-.2c1.15-.59,2.32-1.22,3.47-1.87,15.44-8.8,27.79-22.3,38.69-34.21,3.65-3.99,7.1-7.76,10.38-11.04l50.25-50.3c11.12-11.13,20.47-18.11,32.66-18.5.36-.01.67-.02.95-.02h.04c.12,0,.24,0,.35,0,10.48,0,20.39,3.97,27.91,11.18.15.15.31.3.46.45,10.58,10.46,10.48,27.59-.04,38.1Z"/>
                                    <path class="cls-2" d="M317.51,130.25c0,2.1-.09,4.2-.25,6.27-2.18-2.67-4.53-5.21-7.05-7.63-15.87-15.21-36.74-23.59-58.79-23.59h-.7c-.65,0-1.31.02-2.06.04-13.08.42-25.11,3.91-36.78,10.67-8.47,4.91-16.5,11.35-26.03,20.9l-50.25,50.3c-3.98,3.98-7.92,8.29-11.74,12.46-9.1,9.95-18.51,20.23-27.87,25.57-.53.3-1.06.59-1.58.85-.05.02-.1.05-.15.07-7.95,3.99-17.56,2.39-23.85-3.9l-34.5-34.5-3.5-3.5c-1.48-1.48-2.89-3.01-4.23-4.59-5.28-6.19-9.48-13.13-12.55-20.69-1.37-3.37-2.49-6.82-3.36-10.32-.99-3.98-1.65-8.03-1.98-12.14-.17-2.09-.26-4.18-.26-6.29,0-9.92,1.88-19.59,5.6-28.74,3.85-9.49,9.49-17.99,16.78-25.28,7.29-7.29,15.79-12.93,25.28-16.78,9.16-3.71,18.82-5.6,28.74-5.6s19.59,1.88,28.74,5.6c9.49,3.84,17.99,9.49,25.28,16.78l23.31,23.31,23.31-23.31c7.29-7.29,15.79-12.93,25.28-16.78,9.16-3.71,18.82-5.6,28.74-5.6s19.59,1.88,28.74,5.6c9.49,3.84,17.99,9.49,25.28,16.78,7.29,7.29,12.93,15.79,16.78,25.28,3.71,9.16,5.59,18.83,5.6,28.74Z"/>
                                    <path class="cls-1" d="M327.54,190.09c.03,20.25-7.9,39.26-22.34,53.51-14.1,13.92-33.02,21.99-53.3,22.74-.68.03-1.37.04-2.07.04-9.58,0-20.18-2.38-30.1-6.72l21.36-21.36c3.45.75,6.79,1.1,9.81.99,27.84-1.03,49.61-22.62,49.57-49.15-.02-13.51-5.38-26.07-15.08-35.37-9.27-8.89-21.49-13.73-34.41-13.62h-.03c-.35,0-.73,0-1.17.02-15.03.48-26.3,8.77-38.58,21.07l-50.25,50.3c-3.42,3.42-6.93,7.26-10.65,11.32-10.46,11.43-22.31,24.39-36.56,32.51-1.02.58-2.06,1.14-3.1,1.67-10.7,5.44-22.63,8.31-34.51,8.31-10.27,0-20.25-2.02-29.64-5.99-9.07-3.83-17.21-9.32-24.2-16.31-6.99-6.99-12.48-15.13-16.31-24.2-3.97-9.39-5.99-19.37-5.99-29.64s2.12-20.79,6.29-30.4c1.7-3.9,3.7-7.62,5.99-11.14.87,3.5,1.99,6.94,3.36,10.32,3.07,7.56,7.27,14.5,12.55,20.69-.74,3.42-1.12,6.94-1.12,10.53,0,27.05,22.01,49.07,49.07,49.07,7.63,0,15.32-1.86,22.24-5.37.65-.33,1.3-.68,1.95-1.05,10.55-6.01,20.44-16.82,30-27.26,3.75-4.1,7.63-8.34,11.47-12.18l50.25-50.3c8.97-8.98,16.44-15,24.23-19.51,10.38-6.01,21.06-9.12,32.66-9.49.66-.02,1.26-.03,1.83-.03.21,0,.43,0,.64,0,19.78,0,38.48,7.5,52.72,21.15,7.31,7.01,13.06,15.25,17.1,24.52,4.18,9.59,6.3,19.8,6.32,30.35Z"/>
                                </g>
                                <path class="cls-1" d="M118.5,51.25c17.41,6.08,32.53,22.96,45.27,35.78,13.98-14.3,30.19-31.9,49.96-37.51L164.21,0l-49.74,49.74c1.35.47,2.7.97,4.03,1.51Z"/>
                            </g>
                        </g>
                    </svg>
                </div>
                <div class="brand-name">Azalove</div>
                <h1 style="color: #b12a49; margin: 0; font-family: 'Georgia', serif;">Reset Your Password</h1>
            </div>
            
            <hr class="divider">
            
            <div class="content">
                <p>Dear <strong>${name}</strong>,</p>
                
                <p>We received a request to reset your password for your Azalove account. <span class="heart-icon">💕</span></p>
                
                <div class="highlight">
                    <p><strong>To reset your password, click the button below:</strong></p>
                    <a href="${resetLink}" class="cta">Reset Password</a>
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #b12a49;">${resetLink}</p>
                
                <div class="warning">
                    <p><strong>Important Security Information:</strong></p>
                    <ul>
                        <li>This link will expire in 1 hour for your security</li>
                        <li>If you didn't request this password reset, please ignore this email</li>
                        <li>Your password will remain unchanged until you click the link above</li>
                    </ul>
                </div>
                
                <p>If you have any questions or need assistance, please contact our support team. We're here to help! <span class="heart-icon">💝</span></p>
                
                <p>With love and care,<br>
                <strong>The Azalove Team</strong> <span class="heart-icon">💖</span></p>
            </div>
            
            <div class="footer">
                <p>This is an automated email sent with love. Please do not reply to this email address.</p>
                <p>© 2024 Azalove. All rights reserved. Made with <span class="heart-icon">❤️</span></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
