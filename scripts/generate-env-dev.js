const path = require('path');
const fs = require('fs');

// Carregar .env
require('dotenv').config({
  path: path.resolve(process.cwd(), '.env')
});

// Função para limpar valores
function cleanEnvValue(value) {
  if (!value) return '';
  return String(value).trim().replace(/^["']|["']$/g, '');
}

// Gerar config.json
function generateConfigJson() {
  return {
    apiUrl: cleanEnvValue(process.env.API_URL) || '',
    apiUrlForms: cleanEnvValue(process.env.API_URL_FORMS) || '',
    siteKey: cleanEnvValue(process.env.SITE_KEY) || '',
    secretKey: cleanEnvValue(process.env.SECRET_KEY) || '',
    logoUrl: cleanEnvValue(process.env.LOGO_URL) || 'Logo - RedBalloon.webp',
    environment: cleanEnvValue(process.env.ENVIRONMENT) || 'development',
    cor1: cleanEnvValue(process.env.COR_1) || '#fff',
    cor2: cleanEnvValue(process.env.COR_2) || '#f1f1f1',
    cor3: cleanEnvValue(process.env.COR_3) || '#8E8E8E',
    cor4: cleanEnvValue(process.env.COR_4) || '#4F4ADC',
    cor5: cleanEnvValue(process.env.COR_5) || '#2B2876',
    cor6: cleanEnvValue(process.env.COR_6) || '#058a00',
    cor7: cleanEnvValue(process.env.COR_7) || '#d80505',
    cor8: cleanEnvValue(process.env.COR_8) || '#F47922',
    cor9: cleanEnvValue(process.env.COR_9) || '#484848',
    cor10: cleanEnvValue(process.env.COR_10) || '#d1d1d1',
    cor11: cleanEnvValue(process.env.COR_11) || '#9CB8F6',
    cor14: cleanEnvValue(process.env.COR_14) || '#F5F4F8',
    cor15: cleanEnvValue(process.env.COR_15) || '#DEDEDE',
    cor16: cleanEnvValue(process.env.COR_16) || '#AEAEAE',
    cor17: cleanEnvValue(process.env.COR_17) || '#626262',
    cor19: cleanEnvValue(process.env.COR_19) || '#000000',
    cor20: cleanEnvValue(process.env.COR_20) || '#D9D9D9',
    cor21: cleanEnvValue(process.env.COR_21) || '#323232',
    cor22: cleanEnvValue(process.env.COR_22) || '#DADADA',
    cor23: cleanEnvValue(process.env.COR_23) || '#D7141B',
    cor24: cleanEnvValue(process.env.COR_24) || '#3C3C3C',
    cor25: cleanEnvValue(process.env.COR_25) || '#C52127',
    cor26: cleanEnvValue(process.env.COR_26) || '#606060',
    cor27: cleanEnvValue(process.env.COR_27) || '#BDE6FF',
    cor28: cleanEnvValue(process.env.COR_28) || '#F4F6FF',
    cor29: cleanEnvValue(process.env.COR_29) || '#1B69DC',
    cor39: cleanEnvValue(process.env.COR_39) || '#26C012',
    cor44: cleanEnvValue(process.env.COR_44) || '#1551A9',
    cor45: cleanEnvValue(process.env.COR_45) || '#170C58',
    cor47: cleanEnvValue(process.env.COR_47) || '#d84f00'
  };
}

// Gerar CSS com as cores
function generateConfigCss(config) {
  let css = ':root {\n';
  const usedColors = [1,2,3,4,5,6,7,8,9,10,11,14,15,16,17,19,20,21,22,23,24,25,26,27,28,29,39,44,45,47];
  
  usedColors.forEach(num => {
    const key = `cor${num}`;
    if (config[key]) {
      css += `  --cor-${num}: ${config[key]};\n`;
    }
  });
  
  css += '}\n';
  return css;
}

// Gerar arquivos na pasta public (acessível pelo ng serve)
const publicDir = path.join(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const config = generateConfigJson();

// config.json
const configPath = path.join(publicDir, 'config.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('✅ config.json gerado em:', configPath);

// config.css
const configCss = generateConfigCss(config);
const configCssPath = path.join(publicDir, 'config.css');
fs.writeFileSync(configCssPath, configCss);
console.log('✅ config.css gerado em:', configCssPath);

console.log('\n🎨 Cores e configurações carregadas do .env');
console.log('🚀 Iniciando ng serve...\n');
