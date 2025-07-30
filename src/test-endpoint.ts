import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import * as bcrypt from "bcrypt";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User],
  synchronize: false,
});

async function testChangePassword() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully!");

    const userRepository = AppDataSource.getRepository(User);
    
    // Buscar o usuário
    const user = await userRepository.findOneBy({ id: 9 });
    
    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log(`Found user: ${user.fullName} (${user.email})`);

    // Testar a senha atual
    const currentPassword = "senha123";
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(`Current password match: ${passwordMatch ? "✅" : "❌"}`);

    // Testar nova senha
    const newPassword = "nova123";
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log(`New password hashed: ${hashedNewPassword.substring(0, 20)}...`);

    // Atualizar a senha
    user.password = hashedNewPassword;
    await userRepository.save(user);
    console.log("✅ Password updated successfully!");

    // Testar a nova senha
    const newPasswordMatch = await bcrypt.compare(newPassword, user.password);
    console.log(`New password match: ${newPasswordMatch ? "✅" : "❌"}`);

    await AppDataSource.destroy();
    console.log("✅ Connection closed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testChangePassword(); 