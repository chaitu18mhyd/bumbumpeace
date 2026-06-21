const { readFileSync } = require('fs');
const { join } = require('path');
const text = readFileSync(join(process.cwd(), 'data', 'cities.ts'), 'utf8');
const match = text.match(/export const COUNTRY_FLAGS: Record<string, string> = \{([\s\S]*?)\};/);
if (!match) {
  throw new Error('COUNTRY_FLAGS block not found');
}
const block = match[1];
const flags = {};
for (const line of block.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//')) continue;
  const m = trimmed.match(/^(?:"([^"]+)"|([^:\s][^:]*?)):\s*"([a-z]{2})",?$/);
  if (m) {
    const key = m[1] || m[2];
    flags[key] = m[3];
  }
}
const countries = [
  'Bangladesh','Indonesia','Cameroon','Federated States of Micronesia','Kiribati','Luxembourg','Czech Republic','Sweden','Uganda','Montenegro','Jordan','Puerto Rico (USA)','Dominican Republic','Ireland','Cambodia','Singapore','Papua New Guinea','San Marino','Sri Lanka','Laos','Brunei','Uzbekistan','Finland','Portugal','Malta','Colombia','Albania','Saudi Arabia','Cuba','Latvia','Cayman Islands (UK)','Northern Mariana Islands (USA)','Kyrgyzstan','Algeria','France','Maldives','Israel','Nauru','Senegal','Ghana','Kenya','Malaysia','Iceland','Zambia','Madagascar','Kuwait','Curaçao (Netherlands)','Bosnia and Herzegovina','Philippines','Tuvalu','United States','Cyprus','Turkey','Nigeria','Rwanda','Zimbabwe','Comoros','China','Saint Lucia','New Caledonia','Armenia','Qatar','Netherlands','Gabon','Paraguay','Australia','Mauritius','Serbia','Libya','Aruba (Netherlands)','Bahrain','Vanuatu','Spain','United Arab Emirates','Georgia','Belgium','British Virgin Islands (UK)','Monaco','Hong Kong SAR (China)','US Virgin Islands (USA)','Taiwan','Bhutan','Solomon Islands','Thailand','Macau SAR (China)','El Salvador','Italy','Uruguay','Oman','Fiji','United Kingdom','Palau','Germany','Canada','South Korea','Barbados','Namibia','Marshall Islands','Argentina','Cook Islands','Azerbaijan','Sint Maarten / Saint-Martin','Slovenia','Egypt','Greece','Bahamas','Guam (USA)','India','Timor-Leste','Chile','French Polynesia','Estonia','Vietnam','South Africa','Suriname','Peru','Kazakhstan','Japan','Denmark','Jamaica','Trinidad and Tobago','Mongolia','Mozambique','Switzerland','Seychelles','Ecuador','New Zealand','Hungary','Côte d\'Ivoire','Norway','Honduras','Botswana','Pakistan','Romania','Austria','Guatemala','Bolivia','Ethiopia','Panama','Lithuania','Bulgaria','Croatia','Tunisia','North Macedonia','Morocco','Myanmar','Nicaragua','Mexico','Nepal','Guyana','Tonga','Tanzania','Poland','Lebanon','Costa Rica','Samoa','Andorra'
];
const missing = countries.filter(c => !Object.prototype.hasOwnProperty.call(flags, c));
console.log('COUNTRY_FLAGS mapped:', Object.keys(flags).length);
console.log('Requested countries:', countries.length);
console.log('Missing:', missing.length);
if (missing.length) {
  console.log('--- Missing countries ---');
  missing.forEach(c => console.log(c));
}
