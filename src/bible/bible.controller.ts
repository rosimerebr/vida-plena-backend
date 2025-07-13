import { Controller, Get } from "@nestjs/common";
import { BibleService } from "./bible.service";

@Controller("bible")
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get()
  getAllVerses() {
    return this.bibleService.getAllVerses();
  }

  @Get("daily")
  getDailyVerse() {
    const dailyVerse = this.bibleService.getDailyVerse();
    return { verse: dailyVerse };
  }

  @Get("random")
  getRandomVerse() {
    // Agora retorna o versículo do dia em vez de um aleatório
    const dailyVerse = this.bibleService.getDailyVerse();
    return { verse: dailyVerse };
  }
} 