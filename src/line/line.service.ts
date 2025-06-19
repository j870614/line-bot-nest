import { Injectable } from '@nestjs/common';
import { Client } from '@line/bot-sdk';
import axios from 'axios';
import { DateTime } from 'luxon';

@Injectable()
export class LineService {
  private client: Client;

  constructor() {
    const channelAccessToken = process.env.LINE_ACCESS_TOKEN;
    const channelSecret = process.env.LINE_CHANNEL_SECRET;

    if (!channelAccessToken || !channelSecret) {
      throw new Error('LINE credentials not set in environment variables');
    }

    this.client = new Client({
      channelAccessToken,
      channelSecret,
    });
  }

  async handleEvent(event: any) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMsg = event.message.text.trim();

      if (userMsg === '查看今日太陽時間') {
        try {
          const location = '宜蘭縣';
          const lat = 24.75;
          const lng = 121.75;

          const response = await axios.get('https://api.sunrise-sunset.org/json', {
            params: {
              lat,
              lng,
              date: 'today',
              formatted: 0, // 回傳 ISO 格式（UTC）
            },
          });

          const results = response.data.results;

          const sunrise = this.convertToTaiwanTime(results.civil_twilight_begin); // 民用曙光始
          const transit = this.convertToTaiwanTime(results.solar_noon);           // 太陽過中天
          const sunset = this.convertToTaiwanTime(results.civil_twilight_end);    // 民用暮光終

          const replyText = `📍 ${location} 今日太陽時間（台灣時區）：
🌅 明相出：約 ${sunrise}
🔆 過中天：約 ${transit}
🌇 暮光終：約 ${sunset}`;

          await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text: replyText,
          });
        } catch (err) {
          console.error('🌞 查詢失敗', err);
          await this.client.replyMessage(event.replyToken, {
            type: 'text',
            text: '資料查詢失敗，請稍後再試 ☀️',
          });
        }
      } else {
        await this.client.replyMessage(event.replyToken, {
          type: 'text',
          text: `你說的是：「${userMsg}」`,
        });
      }
    }
  }

  private convertToTaiwanTime(utcString: string): string {
    const taiwanTime = DateTime.fromISO(utcString, { zone: 'utc' })
      .setZone('Asia/Taipei');
    return taiwanTime.toFormat('HH:mm');
  }
}
