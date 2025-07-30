import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "date" })
  dateOfBirth: string;

  @Column({ type: "float" })
  weight: number;

  @Column({ nullable: true })
  secretQuestion: string; // Exemplo: 'Nome da mãe'

  @Column({ nullable: true })
  secretAnswer: string; // Armazene o hash da resposta
}
