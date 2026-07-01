# AGENTS.md - Instruções para Agentes AI

Este arquivo contém instruções para agentes de IA que trabalham neste projeto.

## 📋 Visão Geral do Projeto

**Neu Desk CLI** é um aplicativo Neutralino.js com React e TypeScript que opera em dois modos:
1. **Modo GUI**: Janela desktop mostrando "Hello World"
2. **Modo CLI**: Output de console quando executado com `--run`

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

cron/
└── hello-job.ts     # Job TypeScript para cron Linux

neutralino.config.json  # Configuração do Neutralino
```

### Fluxo de Execução

1. `init()` do Neutralino é chamado
2. Verifica `NL_ARGS` para detectar `--run`
3. Se `--run`:
   - Executa `debug.log('hello world')`
   - Chama `app.exit()`
4. Se não `--run`:
   - Renderiza aplicação React
   - Configura handler de `windowClose`

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

### CSS
- Usar variáveis CSS (`:root`)
- Preferir `rem` para tamanhos
- Animações com `@keyframes`
- Tema: gradiente roxo (#667eea → #764ba2)

### Neutralino
- Sempre chamar `init()` antes de usar APIs
- Usar `events.on('windowClose', ...)` para cleanup
- `nativeAllowList` em `neutralino.config.json` define APIs permitidas

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

### Adicionar Novo Cron Job
1. Criar arquivo em `cron/`
2. Seguir padrão de `hello-job.ts`
3. Documentar uso no crontab

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

---

*Última atualização: Janeiro 2026*
