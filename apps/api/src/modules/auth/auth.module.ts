import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitter2, EventEmitterModule } from "@nestjs/event-emitter";

import { DatabaseModule } from "@infra/database/database.module";
import { DATABASE_CONNECTION } from "@infra/database/database-connection";

import { NotificationsModule } from "@modules/notifications/notifications.module";

import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

import * as schema from "./auth.schema";
import {
  EmailVerificationRequestedEvent,
  ForgotPasswordOtpRequestedEvent,
} from "./events";

@Module({
  imports: [
    DatabaseModule,
    NotificationsModule,
    EventEmitterModule.forRoot(),
    BetterAuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule, EventEmitterModule],
      useFactory: (
        database: NodePgDatabase,
        configService: ConfigService,
        eventEmitter: EventEmitter2
      ) => ({
        middleware: (req, _res, next) => {
          // TODO: remove later when a fix is in place
          // Fix for Express 5: The /*path pattern sets req.url=/ and req.baseUrl=full_path
          // better-call concatenates baseUrl+url creating a trailing slash that causes 404
          // This middleware restores req.url to the full path before the handler runs
          // thanks to @Brainisthekey
          req.url = req.originalUrl;
          req.baseUrl = "";
          next();
        },
        auth: betterAuth({
          // Basic configuration
          appName: configService.getOrThrow("APP_NAME"),
          basePath: `${configService.get("APP_PREFIX")}/auth`,
          trustedOrigins:
            configService
              .get<string>("ALLOWED_ORIGINS")
              ?.split(",")
              ?.map((origin) => origin.trim())
              ?.filter((origin) => origin.length > 0) || [],

          // Database adapter
          database: drizzleAdapter(database, { provider: "pg", schema }),

          // Advanced settings
          advanced: {
            disableOriginCheck:
              configService.getOrThrow("NODE_ENV") === "development",
          },

          // Authentication methods
          emailAndPassword: {
            enabled: true,
          },

          // User features
          user: {
            changeEmail: {
              enabled: true,
            },
          },

          // Email verification
          emailVerification: {
            sendOnSignUp: true,
            sendVerificationEmail: async ({ user, url, token }) => {
              await eventEmitter.emit(
                "auth.email-verification-requested",
                new EmailVerificationRequestedEvent(user.email, url, token)
              );
            },
          },

          // Plugins
          plugins: [
            emailOTP({
              async sendVerificationOTP({ email, otp, type }) {
                if (type === "forget-password") {
                  await eventEmitter.emit(
                    "auth.forgot-password-otp-requested",
                    new ForgotPasswordOtpRequestedEvent(email, otp)
                  );
                }
              },
            }),
          ],
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService, EventEmitter2],
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
