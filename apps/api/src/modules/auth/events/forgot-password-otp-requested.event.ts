export class ForgotPasswordOtpRequestedEvent {
  constructor(
    readonly email: string,
    readonly otp: string
  ) {}
}
