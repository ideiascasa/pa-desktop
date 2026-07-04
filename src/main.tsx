import React from 'react';
import ReactDOM from 'react-dom/client';
import { init, events, app, debug } from '@neutralinojs/lib';
import App from './App';
import './App.css';

// Detecta modo CLI antes de renderizar
declare const NL_ARGS: string[];

// Inicializa Neutralino
init();

// Verifica se está em modo CLI (--run)
const checkCliMode = async () => {
    if (typeof NL_ARGS !== 'undefined' && NL_ARGS.includes('--run')) {
        // Log para debug (vai para arquivo de log e console no Docker)
        await debug.log('PA-Desktop.');
        await app.exit(0);
        return true;
    }
    return false;
};

// Se não for modo CLI, renderiza a aplicação React
checkCliMode().then((isCli) => {
    if (!isCli) {
        // Handler para fechar janela
        events.on('windowClose', () => {
            app.exit();
        });

        ReactDOM.createRoot(document.getElementById('root')!).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
});
