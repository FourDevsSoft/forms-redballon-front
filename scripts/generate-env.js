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
  // console.log('\n🔍 DEBUG - Variáveis de Ambiente Lidas:');
  // console.log('   API_URL (process.env):', process.env.API_URL);
  // console.log('   SITE_KEY (process.env):', process.env.SITE_KEY);
  // console.log('   LOGO_URL (process.env):', process.env.LOGO_URL);
  // console.log('   COR_4 (process.env):', process.env.COR_4);
  // console.log('   COR_5 (process.env):', process.env.COR_5);
  
  const config = {
    apiUrl: cleanEnvValue(process.env.API_URL) || 'localhost:4500',
    apiUrlForms: cleanEnvValue(process.env.API_URL_FORMS) || '',
    siteKey: cleanEnvValue(process.env.SITE_KEY) || '6LdLG4grAAAAAAoH5jvawTvnd4sVSNK3ZSOIsBaL',
    secretKey: cleanEnvValue(process.env.SECRET_KEY) || '',
    logoUrl: cleanEnvValue(process.env.LOGO_URL) || 'Logo - RedBalloon.webp',
    environment: cleanEnvValue(process.env.ENVIRONMENT) || 'production'
  };

  // Adicionar todas as cores (COR_1 até COR_50)
  for (let i = 1; i <= 50; i++) {
    const envKey = `COR_${i}`;
    const configKey = `cor${i}`;
    if (process.env[envKey]) {
      config[configKey] = cleanEnvValue(process.env[envKey]);
    }
  }


  // console.log('\n📋 Configurações Finais:');
  // console.log('   API_URL:', config.apiUrl || '(vazio)');
  // console.log('   SITE_KEY:', config.siteKey || '(vazio)');
  // console.log('   LOGO_URL:', config.logoUrl || '(vazio)');
  // console.log('   COR_4 (config):', config.cor4);
  // console.log('   COR_5 (config):', config.cor5);
  // console.log('   ENVIRONMENT:', config.environment);
  // console.log('');

  return config;
}

// Gerar CSS dinâmico com as cores
function generateConfigCss(config) {
  let css = ':root {\n';
  // Iterar por todas as cores possíveis (1-50)
  for (let i = 1; i <= 50; i++) {
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

  // if (!fs.existsSync(browserDir)) {
  //   console.error('❌ Erro: Diretório dist/frontend-red-balloon/browser/browser não encontrado!');
  //   console.error('Execute primeiro: npm run build');
  //   process.exit(1);
  // }

  // Gerar config.json e config.css diretamente no browserDir para servir como /config.*
  const config = generateConfigJson();
  const configPath = path.join(browserDir, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  //console.log('✅ config.json gerado em:', configPath);

  const configCss = generateConfigCss(config);
  const configCssPath = path.join(browserDir, 'config.css');
  fs.writeFileSync(configCssPath, configCss);
  //console.log('✅ config.css gerado em:', configCssPath);

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
    //console.log('⚡ Pressione Ctrl+C para parar\n');
  });
}

startServer();
