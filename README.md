# Neu Desk CLI

<div align="center">

![Neu Desk CLI Logo](public/icon.png)

**Aplicativo multi-plataforma com Neutralino + React + TypeScript**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

</div>

---

## 📖 Sobre

Neu Desk CLI é um aplicativo leve e portátil que demonstra a integração do Neutralino.js com React e TypeScript. O aplicativo possui dois modos de operação:

- **🖥️ Modo GUI**: Exibe uma janela moderna com "Hello World"
- **💻 Modo CLI**: Quando executado com `--run`, mostra "hello world" no console

## ✨ Características

- 🚀 **Leve**: ~2MB por binário
- 📦 **Portátil**: Sem dependências externas
- 🌍 **Multi-plataforma**: Windows, macOS e Linux
- ⚡ **Rápido**: Neutralino é mais leve que Electron
- 🎨 **Interface Moderna**: React + CSS com glassmorphism
- 🔧 **CLI Mode**: Perfeito para automação e cron jobs

## 🛠️ Tecnologias

| Tecnologia | Uso |
|------------|-----|
| [Neutralino.js](https://neutralino.js.org/) | Framework desktop nativo |
| [React 18](https://react.dev/) | Interface de usuário |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vitejs.dev/) | Build tool |

## 📦 Estrutura do Projeto

```
neu-desk-cli/
├── src/
│   ├── main.tsx       # Entry point com detecção CLI
│   ├── App.tsx        # Componente React principal
│   ├── App.css        # Estilos modernos
│   └── vite-env.d.ts  # Types do Neutralino
├── cron/
│   └── hello-job.ts   # Job para Linux cron
├── public/
│   └── icon.png       # Ícone do app
├── dist/
│   └── neu-desk-cli/  # Binários compilados
├── neutralino.config.json
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/neu-desk-cli.git
cd neu-desk-cli

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### Build

```bash
# Build completo para todas as plataformas
npm run build

# Os binários serão gerados em dist/neu-desk-cli/
```

## 💻 Uso

### Modo GUI (padrão)

```bash
# macOS
./dist/neu-desk-cli/neu-desk-cli-mac_arm64

# Windows
.\dist\neu-desk-cli\neu-desk-cli-win_x64.exe

# Linux
./dist/neu-desk-cli/neu-desk-cli-linux_x64
```

### Modo CLI

```bash
# Executa e mostra "hello world" no console
./neu-desk-cli-mac_arm64 --run
```

### Cron Jobs (Linux)

```bash
# Edite o crontab
crontab -e

# Adicione uma linha para executar a cada hora:
0 * * * * cd /path/to/neu-desk-cli && npx ts-node cron/hello-job.ts >> /var/log/hello-job.log 2>&1
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run dev:vite` | Inicia apenas o Vite dev server |
| `npm run build` | Build de produção completo |
| `npm run build:vite` | Build apenas do frontend |
| `npm run preview` | Preview do build |

## 🌍 Binários Gerados

Após o build, os seguintes binários são criados:

| Plataforma | Arquivo |
|------------|---------|
| macOS (ARM64) | `neu-desk-cli-mac_arm64` |
| macOS (x64) | `neu-desk-cli-mac_x64` |
| macOS (Universal) | `neu-desk-cli-mac_universal` |
| Windows (x64) | `neu-desk-cli-win_x64.exe` |
| Linux (x64) | `neu-desk-cli-linux_x64` |
| Linux (ARM64) | `neu-desk-cli-linux_arm64` |
| Linux (ARMhf) | `neu-desk-cli-linux_armhf` |

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
Feito com ❤️ usando Neutralino.js
</div>
