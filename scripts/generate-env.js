const path = require('path');
const fs = require('fs');
const express = require('express');

// Tenta carregar .env local (desenvolvimento)
try {
  require('dotenv').config({
    path: path.resolve(process.cwd(), '.env')
  });
} catch (e) {
  // Ignorar erro - variáveis virão do EasyPanel
}

// Função para limpar valores
function cleanEnvValue(value) {
  if (!value) return '';
  return String(value).trim().replace(/^["']|["']$/g, '');
}

// Gerar config.json dinamicamente
function generateConfigJson() {
  // Debug: mostrar todas as variáveis de ambiente
  console.log('\n🔍 DEBUG - Variáveis de Ambiente Lidas:');
  console.log('   API_URL (process.env):', process.env.API_URL);
  console.log('   SITE_KEY (process.env):', process.env.SITE_KEY);
  console.log('   LOGO_URL (process.env):', process.env.LOGO_URL);
  console.log('   COR_4 (process.env):', process.env.COR_4);
  console.log('   COR_5 (process.env):', process.env.COR_5);
  
  const config = {
    apiUrl: cleanEnvValue(process.env.API_URL) || '',
    apiUrlForms: cleanEnvValue(process.env.API_URL_FORMS) || '',
    siteKey: cleanEnvValue(process.env.SITE_KEY) || '',
    secretKey: cleanEnvValue(process.env.SECRET_KEY) || '',
    logoUrl: cleanEnvValue(process.env.LOGO_URL) || 'Logo - RedBalloon.webp',
    environment: cleanEnvValue(process.env.ENVIRONMENT) || 'production',
    // Cores usadas no sistema (30 cores)
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


  console.log('\n📋 Configurações Finais:');
  console.log('   API_URL:', config.apiUrl || '(vazio)');
  console.log('   SITE_KEY:', config.siteKey || '(vazio)');
  console.log('   LOGO_URL:', config.logoUrl || '(vazio)');
  console.log('   COR_4 (config):', config.cor4);
  console.log('   COR_5 (config):', config.cor5);
  console.log('   ENVIRONMENT:', config.environment);
  console.log('');

  return config;
}

// Gerar CSS dinâmico com as cores
function generateConfigCss(config) {
  let css = ':root {\n';
  // Apenas as cores que existem no config
  const coresUsadas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 39, 44, 45, 47];
  for (const i of coresUsadas) {
    const key = `cor${i}`;
    if (config[key]) {
      css += `  --cor-${i}: ${config[key]};\n`;
    }
  }
  css += '}\n';
  return css;
}

// Iniciar servidor
function startServer() {
  // O Angular com builder 'application' gera em dist/frontend-red-balloon/browser/browser
  const distRoot = path.join(__dirname, '../dist/frontend-red-balloon/browser');
  const browserDir = path.join(distRoot, 'browser');

  if (!fs.existsSync(browserDir)) {
    console.error('❌ Erro: Diretório dist/frontend-red-balloon/browser/browser não encontrado!');
    console.error('Execute primeiro: npm run build');
    process.exit(1);
  }

  // Gerar config.json e config.css diretamente no browserDir para servir como /config.*
  const config = generateConfigJson();
  const configPath = path.join(browserDir, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ config.json gerado em:', configPath);

  const configCss = generateConfigCss(config);
  const configCssPath = path.join(browserDir, 'config.css');
  fs.writeFileSync(configCssPath, configCss);
  console.log('✅ config.css gerado em:', configCssPath);

  const app = express();
  const PORT = process.env.PORT || 8080;

  // Servir estáticos do diretório browser onde estão os arquivos buildados
  app.use(express.static(browserDir));

  // Fallback para SPA: responder com o index.html (Express 5 usa nova sintaxe)
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(browserDir, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log('⚡ Pressione Ctrl+C para parar\n');
  });
}

startServer();
