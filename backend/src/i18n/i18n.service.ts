import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

type Messages = Record<string, string>;

@Injectable()
export class I18nService {
  private readonly locales: Map<string, Messages> = new Map();
  private readonly defaultLocale = 'vi';

  constructor() {
    this.loadLocale('vi');
    this.loadLocale('en');
  }

  private loadLocale(locale: string): void {
    const basePath = join(__dirname, 'locales', locale);
    const files = ['auth', 'project', 'annotation', 'email', 'validation'];
    const messages: Messages = {};

    for (const file of files) {
      const filePath = join(basePath, `${file}.json`);

      if (existsSync(filePath)) {
        try {
          const content = JSON.parse(readFileSync(filePath, 'utf-8'));
          Object.assign(messages, content);
        } catch {
        }
      }
    }

    this.locales.set(locale, messages);
  }

  t(key: string, locale?: string, params?: Record<string, string>): string {
    const lang = locale ?? this.defaultLocale;
    const messages = this.locales.get(lang) ?? this.locales.get(this.defaultLocale)!;
    let message = messages[key] ?? key;

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        message = message.replace(`{${k}}`, v);
      }
    }

    return message;
  }
}
