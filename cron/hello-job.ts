#!/usr/bin/env npx ts-node
/**
 * Exemplo de job para Linux cron
 * 
 * Instalação:
 * 1. Compile o TypeScript: npx tsc cron/hello-job.ts --outDir cron/dist
 * 2. Ou execute diretamente: npx ts-node cron/hello-job.ts
 * 
 * Uso no crontab (edite com: crontab -e):
 * 
 * # Executar a cada hora
 * 0 * * * * cd /path/to/neu-desk-cli && npx ts-node cron/hello-job.ts >> /var/log/hello-job.log 2>&1
 * 
 * # Executar a cada 5 minutos
 * */5 * * * * cd / path / to / neu - desk - cli && npx ts - node cron / hello - job.ts >> /var/log / hello - job.log 2 >& 1
    * 
 * # Executar todo dia às 8h
    * 0 8 * * * cd / path / to / neu - desk - cli && npx ts - node cron / hello - job.ts >> /var/log / hello - job.log 2 >& 1
        * /

interface JobResult {
    timestamp: string;
    message: string;
    success: boolean;
}

function runJob(): JobResult {
    const timestamp = new Date().toISOString();
    const message = 'hello world from cron job';

    console.log(`[${timestamp}] ${message}`);

    // Adicione sua lógica de job aqui
    // Exemplos:
    // - Sincronização de dados
    // - Backup de arquivos
    // - Envio de notificações
    // - Limpeza de cache
    // - Geração de relatórios

    return {
        timestamp,
        message,
        success: true
    };
}

// Executa o job
const result = runJob();

// Exit code 0 indica sucesso para o cron
process.exit(result.success ? 0 : 1);
