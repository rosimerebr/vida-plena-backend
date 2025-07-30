import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../user/user.service";
import { RecoverPasswordDto } from "./dto/recover-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post("recover-password")
  async recoverPassword(@Body() body: RecoverPasswordDto) {
    return this.authService.recoverPassword(body.email, body.secretAnswer, body.newPassword);
  }
} 