# Configuração guiada (instruções para o Claude)

A pessoa que pediu isto **não é técnica e não tem conta no GitHub**. Faça você o que der por comando; quando ela precisar clicar em algo, diga exatamente onde, um passo por vez, e espere a resposta. Fale português simples, sem jargão. Ao fim de cada item, diga "✓ pronto" ou o que faltou.

## 1. Baixar o repositório

Na pasta Documentos da pessoa (`$HOME\Documents` ou `$HOME\Documentos`; confira qual existe):

- Com Git disponível: `git clone https://github.com/IEEEB/ieeb-editorial-affinity.git`
- Sem Git: baixe o ZIP e descompacte, em PowerShell:
  ```powershell
  $d = [Environment]::GetFolderPath('MyDocuments')
  Invoke-WebRequest https://github.com/IEEEB/ieeb-editorial-affinity/archive/refs/heads/main.zip -OutFile "$d\ieeb.zip"
  Expand-Archive "$d\ieeb.zip" "$d" -Force; Rename-Item "$d\ieeb-editorial-affinity-main" "ieeb-editorial-affinity"; Remove-Item "$d\ieeb.zip"
  ```
  Se a pasta já existir, pergunte antes de substituir.

O repositório é público e só de leitura: não precisa de login.

## 2. Python e Pillow

- Confira `python --version` (ou `py --version`). Sem Python: `winget install -e --id Python.Python.3.12` e peça para a pessoa aceitar a janela de permissão. Se o winget não existir, guie a pessoa a baixar de https://www.python.org/downloads/ marcando **"Add python.exe to PATH"**.
- Depois: `python -m pip install pillow numpy`.

## 3. Fonte Nunito

- Confira se a Nunito está instalada: procure `Nunito*` em `C:\Windows\Fonts` e em `$env:LOCALAPPDATA\Microsoft\Windows\Fonts`.
- Se faltar, guie a pessoa: abrir https://fonts.google.com/specimen/Nunito → **Get font** → **Download all** → abrir o ZIP → entrar na pasta `static` → selecionar todos os arquivos → botão direito → **Instalar**. Reiniciar o Affinity depois.
- Precisa ter pelo menos Regular, Bold, ExtraBold e Black.

## 4. Conector do Affinity

1. Peça para abrir o Affinity.
2. Peça para ligar o servidor MCP nas Preferências do Affinity (procure "MCP" nas Preferências) e deixar ligadas as permissões de arquivos.
3. Peça para conferir no app Claude: **Configurações → Conectores → Affinity** ligado. Se acabou de ligar, reiniciar o app Claude.
4. Teste: rode `biblioteca/teste-conexao.js` com a ferramenta `execute_script` do Affinity. Deve listar a Área de Trabalho, os documentos abertos e as espessuras da Nunito. Se não houver ferramenta do Affinity nesta sessão, o conector ainda não está ligado: volte ao passo 2.

## 5. Primeira página

Rode `biblioteca/base.js` + `biblioteca/exemplo-pagina-teste.js`, mostre o render (`render_spread`) e explique em duas frases o que aconteceu. Peça para fechar o documento de teste **sem salvar**.

## 6. Fechamento

Diga à pessoa:
- "A partir de agora, abra a aba Code **na pasta `Documentos\ieeb-editorial-affinity`**. É ali que eu sei as regras do IEEB e como usar o Affinity."
- "Para trabalhar numa obra, me diga onde está a pasta dela no OneDrive."
- "Para pegar as novidades, peça: atualize a pasta do repositório."

Resuma o que ficou pronto e o que faltou (se faltou algo, diga quem pode ajudar: o coordenador).
