import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);

  const users = [
    {
      fullName: "Maria da Silva",
      email: "maria.silva@email.com",
      password: "senha123",
      dateOfBirth: "1990-05-10",
      weight: 65.5,
    },
    {
      fullName: "João Souza",
      email: "joao.souza@email.com",
      password: "senha456",
      dateOfBirth: "1985-11-23",
      weight: 80.2,
    },
    {
      fullName: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      password: "senha789",
      dateOfBirth: "2000-01-15",
      weight: 55.0,
    },
  ];

  for (const data of users) {
    const exists = await userRepository.findOneBy({ email: data.email });
    if (!exists) {
      const user = userRepository.create(data);
      await userRepository.save(user);
      console.log(`Usuário ${data.fullName} inserido!`);
    } else {
      console.log(`Usuário ${data.fullName} já existe.`);
    }
  }

  await AppDataSource.destroy();
}

seed()
  .then(() => console.log("Carga inicial concluída!"))
  .catch(console.error); 