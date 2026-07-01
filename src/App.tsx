import { useCallback, useEffect, useState } from 'react';
import { window as neuWindow } from '@neutralinojs/lib';
import './App.css';

const NOTCH = { width: 320, height: 64 };
const PANEL = { width: 780, height: 580 };

// Redimensiona e reposiciona a janela nativa, mantendo-a centrada no topo
async function layoutWindow(expanded: boolean) {
    const size = expanded ? PANEL : NOTCH;
    try {
        // screen.availWidth vem do webview em pontos (mesma unidade do move),
        // ao contrário de computer.getDisplays(), que retorna pixels físicos no Retina
        const screenWidth = window.screen.availWidth;
        await neuWindow.setAlwaysOnTop(true);
        await neuWindow.setSize({
            width: size.width,
            height: size.height,
            minWidth: size.width,
            minHeight: size.height,
        });
        // o resize no macOS reaplica a decoração da janela; remove de novo
        await neuWindow.setBorderless(true);
        await neuWindow.move(Math.round((screenWidth - size.width) / 2), 0);
    } catch (err) {
        console.error('Falha ao ajustar janela:', err);
    }
}

function App() {
    const [expanded, setExpanded] = useState(false);

    // LED esquerdo: status da aplicação (ativado/desativado no final do boot)
    const [active] = useState(true);

    // LED direito: true enquanto um áudio estiver tocando
    const [processing, setProcessing] = useState(false);

    // teste: liga o processamento por 3 segundos
    const testProcessing = useCallback(() => {
        setProcessing(true);
        window.setTimeout(() => setProcessing(false), 3000);
    }, []);

    useEffect(() => {
        layoutWindow(false);
    }, []);

    const toggle = useCallback((next: boolean) => {
        setExpanded(next);
        layoutWindow(next);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') toggle(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [toggle]);

    return (
        <div className={`notch-app ${expanded ? 'expanded' : ''}`}>
            {/* moldura de vidro → face de carbono */}
            <div
                className="notch-frame"
                onClick={() => toggle(!expanded)}
                role="button"
                aria-expanded={expanded}
            >
                <div className="notch-face carbon">
                    {/* LED esquerdo: status da aplicação */}
                    <span className={`notch-dot status ${active ? 'on' : ''}`} />
                    <span className="notch-title">neu-desk</span>
                    {/* LED direito: pulsa enquanto áudio estiver tocando */}
                    <span className={`notch-dot processing ${processing ? 'on' : ''}`} />
                </div>
            </div>

            {expanded && (
                <div className="panel-frame">
                    <div className="panel-face carbon">
                        <div className="panel-header">
                            <h1>Status da Aplicação</h1>
                            <button
                                className="panel-close"
                                onClick={() => toggle(false)}
                                aria-label="Fechar"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="panel-body">
                            {/* Status geral da aplicação — em breve */}
                            <p className="panel-empty">Nenhum status disponível</p>
                            <button className="demo-button" onClick={testProcessing}>
                                Testar processamento (3s)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
