# AGENTS.md - Instruções para Agentes AI

> Este arquivo 'AGENTS.md' é a fonte de verdade absoluta para agentes de IA

# PA-Desktop

> Personal Agent Desktop

- **🖥️ Modo GUI**: Exibe uma janela moderna com "Hello World"
- **💻 Modo CLI**: Quando executado com `--run`, mostra "PA-Desktop." no console

- Modo `cli` poderá ser usado para atualizações, configurações e usos futuros

```bash
# Executa e mostra "PA-Desktop." no console
./neu-desk-cli-mac_arm64 --run
```

## ⚙️ Configuração Oficial: `padesktop.json`

O `padesktop.json` (raiz do app) é o **arquivo oficial de configuração** da aplicação — toda configuração persistente do usuário deve ser lida/gravada nele via `filesystem.readFile`/`writeFile` (funções `loadConfig`/`saveConfig` em `src/App.tsx`).

```json
{
  "appName": "PA-Desktop",
  "notchX": 512
}
```

- **`appName`**: nome da aplicação exibido na UI e no título da janela. Apesar do nome do projeto ser `PA-Desktop`, o usuário pode alterá-lo para qualquer outro nome.
- **`notchX`**: posição horizontal do notch, persistida automaticamente ao arrastar (ausente = centrado).

## 🏗️ Arquitetura

### Stack Tecnológica
- **Framework Desktop**: Neutralino.js v6.4.0
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: CSS puro com variáveis CSS

### Estrutura de Arquivos Importantes

```
src/
├── main.tsx         # Entry point - detecta modo CLI via NL_ARGS
├── App.tsx          # Componente React principal (GUI)
├── App.css          # Estilos com glassmorphism
└── vite-env.d.ts    # Declarações TypeScript para Neutralino globals

neutralino.config.json  # Configuração do Neutralino
```

### Fluxo de Execução

1. `init()` do Neutralino é chamado
2. Verifica `NL_ARGS` para detectar `--run`

## 🔧 Comandos de Desenvolvimento

```bash
# Desenvolvimento
npm run dev          # Inicia Neutralino + Vite HMR

# Build
npm run build        # Build completo (Vite + Neutralino)
npm run build:vite   # Build apenas frontend

# Preview
npm run preview      # Preview do build Vite
```

## 📝 Convenções de Código

### TypeScript
- Strict mode ativado
- Usar `declare const` para globals do Neutralino
- Tipos definidos em `vite-env.d.ts`

## 🚫 O Que Evitar

1. **Não usar require()** - projeto usa ES modules
2. **Não modificar bin/** - binários gerados pelo Neutralino
3. **Não usar console.log para CLI** - usar `debug.log` ou `os.execCommand`
4. **Não esquecer await** - APIs Neutralino são async

## 🔄 Atualizando o Projeto

### Adicionar Nova Feature GUI
1. Criar componente em `src/`
2. Importar em `App.tsx`
3. Estilizar em `App.css`

### Adicionar Novo Comando CLI
1. Modificar `checkCliMode()` em `main.tsx`
2. Adicionar novo argumento no check de `NL_ARGS`
3. Implementar lógica e chamar `app.exit()`

## 🐛 Debugging

### Modo Desenvolvimento
```bash
# Com inspector habilitado
npm run dev
# Clique direito → Inspect Element
```

### Logs do Neutralino
```bash
# Os logs vão para:
# - Console do navegador (GUI)
# - Terminal via debug.log (CLI)
```

### Verificar Build
```bash
# Após build, testar binário:
./dist/neu-desk-cli/neu-desk-cli-mac_arm64
./dist/neu-desk-cli/neu-desk-cli-mac_arm64 --run
```

## 📦 Deploy

### Distribuição
1. Execute `npm run build`
2. Os binários estão em `dist/neu-desk-cli/`
3. Distribua o binário + `resources.neu`

### Plataformas Suportadas
- macOS: arm64, x64, universal
- Windows: x64
- Linux: x64, arm64, armhf

## 🔗 Referências

- [Neutralino.js Docs](https://neutralino.js.org/docs/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
