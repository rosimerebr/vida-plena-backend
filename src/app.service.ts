import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getRandonVers(): string[] {
    return [
      'Conhecereis a verdade e ela te libertara',
      'Eu sou o Caminho a Verdade e a Vida',
      'E Jesus Chorou', 
    ];
  }

}
