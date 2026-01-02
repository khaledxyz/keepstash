import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { DatabaseModule } from "@infra/database/database.module";
import { DATABASE_CONNECTION } from "@infra/database/database-connection";

import { AuthModule as BetterAuthModule } from "@thallesp/nestjs-better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

import * as schema from "./auth.schema";

@Module({
  imports: [
    DatabaseModule,
    BetterAuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
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
          appName: configService.getOrThrow("APP_NAME"),
          basePath: `${configService.get("APP_PREFIX")}/auth`,
          trustedOrigins:
            configService
              .get<string>("ALLOWED_ORIGINS")
              ?.split(",")
              ?.map((origin) => origin.trim())
              ?.filter((origin) => origin.length > 0) || [],
          database: drizzleAdapter(database, { provider: "pg", schema }),
          advanced: {
            disableOriginCheck:
              configService.getOrThrow("NODE_ENV") === "development",
          },
          plugins: [
            emailOTP({
              // biome-ignore lint/suspicious/useAwait: <TODO: handle email submit>
              async sendVerificationOTP({ email, otp, type }) {
                console.log(email, type, otp);
              },
            }),
          ],
          emailAndPassword: {
            enabled: true,
          },

          user: {
            changeEmail: {
              enabled: true,
            },
          },
          emailVerification: {
            // Required to send the verification email
            // biome-ignore lint/suspicious/useAwait: <TODO: handle email submit>
            sendVerificationEmail: async ({ user, url, token }) => {
              console.log(user, url, token);
            },
          },
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
