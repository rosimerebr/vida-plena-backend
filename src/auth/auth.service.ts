import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      // Não retorna a senha
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, fullName: user.fullName },
    };
  }

  async recoverPassword(email: string, secretAnswer: string, newPassword: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Se o usuário não tem resposta secreta configurada, usar resposta padrão
    if (!user.secretAnswer) {
      // Para usuários existentes, aceitar "default" como resposta temporária
      if (secretAnswer === "default") {
        // Hash da nova senha
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        // Atualizar a senha
        await this.userService.updatePassword(user.id, hashedNewPassword);

        return { 
          message: "Password recovered successfully. Please update your security question in your profile." 
        };
      } else {
        throw new BadRequestException("Incorrect security answer. Try 'default' for existing users.");
      }
    }

    const isAnswerCorrect = await bcrypt.compare(secretAnswer, user.secretAnswer);
    if (!isAnswerCorrect) {
      throw new BadRequestException("Incorrect security answer");
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualizar a senha
    await this.userService.updatePassword(user.id, hashedNewPassword);

    return { message: "Password recovered successfully" };
  }
} 