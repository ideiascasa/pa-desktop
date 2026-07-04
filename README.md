# PA-Desktop

> Personal Agent Desktop

- **🖥️ Modo GUI**: Exibe uma janela moderna com "Hello World"
- **💻 Modo CLI**: Quando executado com `--run`, mostra "hello world" no console

- Modo `cli` poderá ser usado para atualizações, configurações e usos futuros

```bash
# Executa e mostra "hello world" no console
./neu-desk-cli-mac_arm64 --run
```

### Cron Jobs (Linux) (doc)

```bash
# Edite o crontab
crontab -e

# Adicione uma linha para executar a cada hora:
0 * * * * cd /path/to/neu-desk-cli && npx ts-node cron/hello-job.ts >> /var/log/hello-job.log 2>&1
```
