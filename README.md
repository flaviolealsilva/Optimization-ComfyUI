<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Optimization-ComfyUI

Projeto React + Vite para showcase de performance de IA em iGPU Intel.

## Rodar localmente

Prerequisito: Node.js 20+

1. Instale as dependencias:
   npm install
2. (Opcional) Configure variaveis locais no arquivo .env.local
3. Inicie em modo dev:
   npm run dev

## Publicar no GitHub Pages

O projeto ja esta configurado para deploy automatico via GitHub Actions no GitHub Pages.

1. Suba este codigo para um repositorio no GitHub.
2. Verifique se a branch principal e main ou master.
3. No GitHub, abra Settings > Pages.
4. Em Build and deployment, selecione **Source: GitHub Actions** (nao deixe como "Deploy from a branch").
5. Salve essa configuracao.
6. Faça push na branch principal para disparar o workflow.
7. Acompanhe em Actions o workflow Deploy to GitHub Pages ate concluir.
8. A URL final ficara em Settings > Pages e tambem na aba de deploy do workflow.

## Build de producao

Para gerar build local de producao:

1. npm run build
2. npm run preview
