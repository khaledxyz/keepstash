export class EmailVerificationRequestedEvent {
  constructor(
    readonly email: string,
    readonly verificationUrl: string,
    readonly token: string
  ) {}
}
