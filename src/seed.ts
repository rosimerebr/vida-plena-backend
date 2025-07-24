import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";
import { Habit } from "./report/entities/habit.entity";
import { HabitLog } from "./report/entities/habit-log.entity";

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
  entities: [User, Habit, HabitLog],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const userRepository = AppDataSource.getRepository(User);
  const habitRepository = AppDataSource.getRepository(Habit);

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
      console.log(`User ${data.fullName} inserted!`);
    } else {
      console.log(`User ${data.fullName} already exists.`);
    }
  }

  // Seed dos hábitos
  const habits = [
    { name: "Sunlight", description: "Sun exposure" },
    { name: "Water", description: "Proper hydration" },
    { name: "Air", description: "Clean air and breathing" },
    { name: "Healthy Food", description: "Healthy eating" },
    { name: "Exercise", description: "Physical exercise" },
    { name: "Temperance", description: "Temperance and balance" },
    { name: "Rest", description: "Rest and sleep" },
    { name: "Trust in God", description: "Trust in God" },
  ];

  for (const data of habits) {
    const exists = await habitRepository.findOneBy({ name: data.name });
    if (!exists) {
      const habit = habitRepository.create(data);
      await habitRepository.save(habit);
      console.log(`Habit ${data.name} inserted!`);
    } else {
      console.log(`Habit ${data.name} already exists.`);
    }
  }

  await AppDataSource.destroy();
}

seed()
  .then(() => console.log("Initial charge complete!"))
  .catch(console.error); 