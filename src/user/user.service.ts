import { Injectable, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { ChangePasswordDto } from "./dto/change-password.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Verifica se o e-mail já existe
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException("E-mail já cadastrado");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    let hashedSecretAnswer = null;
    if (createUserDto.secretAnswer) {
      hashedSecretAnswer = await bcrypt.hash(createUserDto.secretAnswer, 10);
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      secretQuestion: createUserDto.secretQuestion || "What is your mother's name?",
      secretAnswer: hashedSecretAnswer || undefined,
    });

    const savedUser = await this.userRepository.save(user);

    // Remove a senha do retorno
    const { password, ...result } = savedUser;
    return result;
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    console.log("changePassword called with:", { userId, dto });
    
    const user = await this.userRepository.findOneBy({ id: userId });
    console.log("User found:", user ? "yes" : "no");
    
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const passwordMatch = await bcrypt.compare(dto.oldPassword, user.password);
    console.log("Password match:", passwordMatch);
    
    if (!passwordMatch) {
      throw new Error("Senha antiga incorreta");
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = newHashedPassword;
    await this.userRepository.save(user);

    return { message: "Senha alterada com sucesso" };
  }

  async updatePassword(userId: number, hashedPassword: string) {
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
