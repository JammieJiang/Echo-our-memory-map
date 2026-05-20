export interface CityEntry {
  zh: string;
  en: string;
}

export const CITY_CATALOG: CityEntry[] = [
  { zh: '北京', en: 'Beijing' },
  { zh: '上海', en: 'Shanghai' },
  { zh: '广州', en: 'Guangzhou' },
  { zh: '深圳', en: 'Shenzhen' },
  { zh: '杭州', en: 'Hangzhou' },
  { zh: '南京', en: 'Nanjing' },
  { zh: '成都', en: 'Chengdu' },
  { zh: '重庆', en: 'Chongqing' },
  { zh: '武汉', en: 'Wuhan' },
  { zh: '西安', en: "Xi'an" },
  { zh: '长沙', en: 'Changsha' },
  { zh: '厦门', en: 'Xiamen' },
  { zh: '青岛', en: 'Qingdao' },
  { zh: '大连', en: 'Dalian' },
  { zh: '天津', en: 'Tianjin' },
  { zh: '苏州', en: 'Suzhou' },
  { zh: '香港', en: 'Hong Kong' },
  { zh: '台北', en: 'Taipei' },
  { zh: '温哥华', en: 'Vancouver' },
  { zh: '多伦多', en: 'Toronto' },
  { zh: '伦敦', en: 'London' },
  { zh: '纽约', en: 'New York' },
  { zh: '洛杉矶', en: 'Los Angeles' },
  { zh: '悉尼', en: 'Sydney' },
  { zh: '东京', en: 'Tokyo' },
  { zh: '首尔', en: 'Seoul' },
  { zh: '新加坡', en: 'Singapore' },
  { zh: '巴黎', en: 'Paris' },
];

export function extractCityZh(placeName: string): string {
  const trimmed = placeName.trim();
  const part = trimmed.split(/[·•|,\-—]/)[0]?.trim() ?? trimmed;
  const found = CITY_CATALOG.find((c) => part.includes(c.zh) || trimmed.includes(c.zh));
  return found?.zh ?? part;
}
