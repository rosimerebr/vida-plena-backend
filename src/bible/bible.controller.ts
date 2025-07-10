import { Controller, Get } from "@nestjs/common";
import { BibleService } from "./bible.service";

@Controller("bible")
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get()
  getAllVerses() {
    return this.bibleService.getAllVerses();
  }

  @Get("random")
  getRandomVerse() {
    const verses = this.bibleService.getAllVerses();
    const randomIndex = Math.floor(Math.random() * verses.length);
    return { verse: verses[randomIndex] };
  }
} 