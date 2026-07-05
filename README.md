# PA-Desktop

> Personal Agent Desktop

- **🖥️ Modo GUI**: Exibe uma janela moderna com "Hello World"
- **💻 Modo CLI**: Quando executado com `--run`, mostra "PA-Desktop." no console

- Modo `cli` poderá ser usado para atualizações, configurações e usos futuros

```bash
# Executa e mostra "PA-Desktop." no console
./neu-desk-cli-mac_arm64 --run
```

## ⚙️ Configuração (`padesktop.json`)

O `padesktop.json` é o **arquivo oficial de configuração** da aplicação, criado/atualizado automaticamente na raiz do app. O usuário pode editá-lo livremente:

```json
{
  "appName": "PA-Desktop",
  "notchX": 512
}
```

- **`appName`**: nome exibido pela aplicação — pode ser alterado para qualquer outro nome (o padrão é `PA-Desktop`)
- **`notchX`**: posição horizontal do notch no topo da tela, salva automaticamente ao arrastá-lo (ausente = centrado)
