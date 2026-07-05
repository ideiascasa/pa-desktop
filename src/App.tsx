import { useCallback, useEffect, useRef, useState } from 'react';
import { filesystem, window as neuWindow } from '@neutralinojs/lib';
import './App.css';

const NOTCH = { width: 320, height: 64 };
const PANEL = { width: 780, height: 580 };

const CONFIG_FILE = 'padesktop.json';

// nome padrão da aplicação; o usuário pode trocar via "appName" no padesktop.json
const DEFAULT_APP_NAME = 'PA-Desktop';

// posição horizontal do notch (persistida em padesktop.json); null = centrado
let notchX: number | null = null;
let appName = DEFAULT_APP_NAME;

async function loadConfig() {
    try {
        const raw = await filesystem.readFile(CONFIG_FILE);
        const cfg = JSON.parse(raw);
        if (typeof cfg.notchX === 'number') notchX = cfg.notchX;
        if (typeof cfg.appName === 'string' && cfg.appName.trim()) appName = cfg.appName.trim();
    } catch {
        // sem config ainda: usa o padrão (centrado)
    }
}

async function saveConfig() {
    try {
        await filesystem.writeFile(CONFIG_FILE, JSON.stringify({ appName, notchX }, null, 2));
    } catch (err) {
        console.error('Falha ao salvar config:', err);
    }
}

function clampX(x: number, width: number) {
    return Math.min(Math.max(x, 0), Math.max(0, window.screen.availWidth - width));
}

// Y fixo: o app vive sempre no topo da tela (Windows, Linux ou macOS);
const TOP_Y = 0;

// Redimensiona e reposiciona a janela nativa no topo da tela
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
        const centered = Math.round((screenWidth - size.width) / 2);
        // notch usa a posição salva; painel abre centrado no notch
        const notchLeft = notchX ?? Math.round((screenWidth - NOTCH.width) / 2);
        const x = expanded
            ? clampX(notchLeft + Math.round((NOTCH.width - PANEL.width) / 2), PANEL.width)
            : clampX(notchLeft, NOTCH.width);
        await neuWindow.move(expanded && notchX === null ? centered : x, TOP_Y);
    } catch (err) {
        console.error('Falha ao ajustar janela:', err);
    }
}

function App() {
    const [expanded, setExpanded] = useState(false);

    // LED esquerdo: status da aplicação (ativado/desativado no final do boot)
    const [active, setActive] = useState(true);

    // LED direito: true enquanto um áudio estiver tocando
    const [processing, setProcessing] = useState(false);

    // estados de erro: LED correspondente pisca vermelho
    const [statusError, setStatusError] = useState(false);
    const [processingError, setProcessingError] = useState(false);

    // drag horizontal do notch: distingue clique de arrasto por um limiar
    const drag = useRef<{ startScreenX: number; startWinX: number; moved: boolean } | null>(null);

    // teste: liga o processamento por 3 segundos
    const testProcessing = useCallback(() => {
        setProcessing(true);
        window.setTimeout(() => setProcessing(false), 3000);
    }, []);

    // teste: desativa o status por 3 segundos (LED esquerdo cinza → verde de volta)
    const testStatus = useCallback(() => {
        setActive(false);
        window.setTimeout(() => setActive(true), 3000);
    }, []);

    // teste: erro no status por 3 segundos (LED esquerdo pisca vermelho)
    const testStatusError = useCallback(() => {
        setStatusError(true);
        window.setTimeout(() => setStatusError(false), 3000);
    }, []);

    // teste: erro no processamento por 3 segundos (LED direito pisca vermelho)
    const testProcessingError = useCallback(() => {
        setProcessingError(true);
        window.setTimeout(() => setProcessingError(false), 3000);
    }, []);

    const [title, setTitle] = useState(DEFAULT_APP_NAME);

    useEffect(() => {
        loadConfig().then(() => {
            setTitle(appName);
            void layoutWindow(false);
            neuWindow.setTitle(appName).catch(() => {});
        });
    }, []);

    const toggle = useCallback((next: boolean) => {
        setExpanded(next);
        if (next) {
            // expandindo: cresce a janela já; o painel aparece dentro dela
            void layoutWindow(next);
        } else {
            // fechando: espera o React desmontar o painel e o webview repintar
            // antes de encolher a janela — senão sobra "rebarba" do painel
            requestAnimationFrame(() =>
                requestAnimationFrame(() => void layoutWindow(false)),
            );
        }
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') toggle(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [toggle]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (expanded) return; // painel aberto: clique/arrasto só fecha (onPointerUp/Move)
        e.currentTarget.setPointerCapture(e.pointerId); // segue o arrasto fora da face
        // não usa getPosition(): no Retina ele retorna pixels físicos (2x),
        // incompatível com move(), que trabalha em pontos — rastreamos nós mesmos
        const startWinX = notchX ?? Math.round((window.screen.availWidth - NOTCH.width) / 2);
        drag.current = { startScreenX: e.screenX, startWinX, moved: false };
    }, [expanded]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        // painel aberto: arrastar fecha o painel e o drag continua no notch
        if (expanded && e.buttons === 1) {
            toggle(false);
            e.currentTarget.setPointerCapture(e.pointerId);
            const startWinX = notchX ?? Math.round((window.screen.availWidth - NOTCH.width) / 2);
            drag.current = { startScreenX: e.screenX, startWinX, moved: true };
            return;
        }
        const d = drag.current;
        if (!d) return;
        const delta = e.screenX - d.startScreenX;
        if (!d.moved && Math.abs(delta) < 4) return; // limiar anti-clique
        d.moved = true;
        // move só no eixo X; o Y é sempre re-fixado no topo, mesmo que o SO
        // (tiling, snap etc.) tente puxar a janela para outro lugar
        neuWindow.move(clampX(d.startWinX + delta, NOTCH.width), TOP_Y).catch(() => {});
    }, [expanded, toggle]);

    const onPointerUp = useCallback(async (e: React.PointerEvent) => {
        const d = drag.current;
        drag.current = null;
        if (!d) {
            // painel aberto: clique no notch fecha (não há drag nesse modo)
            if (expanded) toggle(false);
            return;
        }
        if (d.moved) {
            // fim do arrasto: fixa o X final e joga o Y de volta ao topo;
            // reaplica o tamanho caso o SO tenha redimensionado no caminho
            notchX = clampX(d.startWinX + (e.screenX - d.startScreenX), NOTCH.width);
            await saveConfig();
            await layoutWindow(false);
        } else {
            toggle(!expanded); // foi um clique, não arrasto
        }
    }, [expanded, toggle]);

    return (
        <div className={`notch-app ${expanded ? 'expanded' : ''}`}>
            {/* moldura de vidro → face de carbono */}
            <div
                className="notch-frame"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                role="button"
                aria-expanded={expanded}
            >
                <div className="notch-face carbon">
                    {/* dot-esquerdo: status — verde ok, laranja desativado, vermelho erro */}
                    <span className={`notch-dot dot-esquerdo ${statusError ? 'vermelho' : active ? 'verde' : 'laranja'}`} />
                    {/* dot-direito: processamento — verde repouso, laranja processando, vermelho erro */}
                    <span className={`notch-dot dot-direito ${processingError ? 'vermelho' : processing ? 'laranja' : 'verde'}`} />
                </div>
            </div>

            {expanded && (
                <div className="panel-frame">
                    <div className="panel-face carbon">
                        <div className="panel-header">
                            <h1>{title}</h1>
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
                            <button className="demo-button" onClick={testStatus}>
                                Testar status (3s)
                            </button>
                            <button className="demo-button" onClick={testProcessing}>
                                Testar processamento (3s)
                            </button>
                            <button className="demo-button" onClick={testStatusError}>
                                Testar erro de status (3s)
                            </button>
                            <button className="demo-button" onClick={testProcessingError}>
                                Testar erro de processamento (3s)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
