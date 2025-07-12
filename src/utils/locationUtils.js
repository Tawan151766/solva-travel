// Location data and utilities for country and city selection

export const COUNTRIES_CITIES = {
  "ไทย": [
    "กรุงเทพฯ",
    "เชียงใหม่", 
    "ภูเก็ต",
    "พัทยา",
    "เกาะสมุย",
    "เกาะช้าง",
    "หัวหิน",
    "กระบี่",
    "เชียงราย",
    "อุดรธานี",
    "ขอนแก่น",
    "นครราชสีมา"
  ],
  "เวียดนาม": [
    "โฮจิมินห์ซิตี้",
    "ฮานอย",
    "ดานัง",
    "ฮอยอัน",
    "นาตรัง",
    "ฮาลองเบย์",
    "ดาลัด",
    "ห้วยเซา",
    "เก่าล้าว",
    "มุยเน่",
    "ฟานเทียต",
    "กานโต"
  ],
  "ออสเตรเลีย": [
    "ซิดนีย์",
    "เมลเบิร์น",
    "บริสเบน",
    "เพิร์ธ",
    "แอดิเลด",
    "แคนเบอร์รา",
    "โกลด์โคสต์",
    "ไคนส์",
    "ดาร์วิน",
    "ฮอบาร์ต",
    "อลิซสปริงส์",
    "ทาสมาเนีย"
  ]
};

/**
 * Get cities by country
 * @param {string} country - Country name
 * @returns {string[]} Array of cities
 */
export const getCitiesByCountry = (country) => {
  return COUNTRIES_CITIES[country] || [];
};

/**
 * Get all countries
 * @returns {string[]} Array of countries
 */
export const getAllCountries = () => {
  return Object.keys(COUNTRIES_CITIES);
};

/**
 * Check if country exists
 * @param {string} country - Country name
 * @returns {boolean} True if country exists
 */
export const isValidCountry = (country) => {
  return country in COUNTRIES_CITIES;
};

/**
 * Check if city exists in country
 * @param {string} country - Country name
 * @param {string} city - City name
 * @returns {boolean} True if city exists in country
 */
export const isValidCityInCountry = (country, city) => {
  const cities = getCitiesByCountry(country);
  return cities.includes(city);
};

/**
 * Get formatted location string
 * @param {string} country - Country name
 * @param {string} city - City name
 * @returns {string} Formatted location string
 */
export const getFormattedLocation = (country, city) => {
  if (country && city) {
    return `${city}, ${country}`;
  }
  return country || city || '';
};
