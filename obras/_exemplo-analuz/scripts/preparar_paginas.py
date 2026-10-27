"""Prepara as páginas do Analuz (21x24 cm) com 3 mm de sangria: 216 x 246 mm.

Uso: python -I preparar_paginas.py <pasta_ilustracoes> <pasta_canva> <pasta_destino>

- Ilustrações da equipe (nomes "Folha N · p. A–B.png" ou "Folha N · p. A.png"):
  a dupla é escalada para 246 mm de altura e cortada na lombada, centrada;
  cada página leva 3 mm da vizinha como sangria do lado da lombada.
  A página simples (1:1) é escalada para 246 mm de altura e cortada no centro.
- Páginas exportadas do Canva sem texto (210x240 mm, 300 dpi): a sangria é
  feita espelhando 3 mm de cada borda, para o conteúdo não mudar de lugar.
- "Folha 10" não entra: o Canva usa página de colorir e página de desenhar no lugar.
"""
import os
import re
import sys

from PIL import Image, ImageOps

SANGRIA, LARG, ALT = 3, 210, 240
LADO_L, LADO_A = LARG + 2 * SANGRIA, ALT + 2 * SANGRIA  # 216 x 246 mm

# Duas versões da folha 5: a do Canva é a da janela com quatro vidros, "(2)".
IGNORAR = ("Folha 10", "Folha 5 · p. 8–9.png")

CANVA = {"creditos": "p00", "p18-colorir": "p18", "p19-desenhe": "p19",
         "p20-labirinto": "p20", "p21-musica": "p21", "capa": "capa", "contracapa": "contracapa"}
# As páginas 1-17 também saem do Canva: o enquadramento (e algumas imagens) da equipe
# no Canva diferem dos arquivos da pasta. Quando existem, substituem o corte das ilustrações.
CANVA.update({f"p{n:02d}": f"p{n:02d}" for n in range(1, 18)})


def salvar(img, destino, nome):
    dpi = img.width / LADO_L * 25.4
    img.save(os.path.join(destino, f"{nome}.jpg"), quality=95, dpi=(dpi, dpi), subsampling=0)
    print(f"{nome}.jpg  {img.width}x{img.height}  {dpi:.0f} dpi")


def ilustracoes(origem, destino):
    for nome in sorted(os.listdir(origem)):
        if not nome.lower().endswith((".png", ".jpg", ".jpeg")) or nome.startswith(IGNORAR):
            continue
        pags = [int(n) for n in re.findall(r"\d+", nome.split("p.", 1)[1].replace("4x", ""))][:2]
        img = Image.open(os.path.join(origem, nome)).convert("RGB")
        px_mm = img.height / LADO_A
        lado = round(LADO_L * px_mm)
        if len(pags) == 1:
            x0 = round((img.width - lado) / 2)
            salvar(img.crop((x0, 0, x0 + lado, img.height)), destino, f"p{pags[0]:02d}")
            continue
        meio = img.width / 2
        for n, x0 in ((pags[0], meio - (LARG + SANGRIA) * px_mm), (pags[1], meio - SANGRIA * px_mm)):
            x0 = round(x0)
            salvar(img.crop((x0, 0, x0 + lado, img.height)), destino, f"p{n:02d}")


def canva(origem, destino):
    for base, nome in CANVA.items():
        caminho = os.path.join(origem, base + ".png")
        if not os.path.exists(caminho):
            continue
        img = Image.open(caminho).convert("RGB")
        b = round(SANGRIA * img.width / LARG)
        larg, alt = img.width + 2 * b, img.height + 2 * b
        tela = Image.new("RGB", (larg, alt))
        tela.paste(img, (b, b))
        # espelha as faixas de borda (lados, depois topo e base já com cantos)
        tela.paste(ImageOps.mirror(img.crop((0, 0, b, img.height))), (0, b))
        tela.paste(ImageOps.mirror(img.crop((img.width - b, 0, img.width, img.height))), (b + img.width, b))
        tela.paste(ImageOps.flip(tela.crop((0, b, larg, 2 * b))), (0, 0))
        tela.paste(ImageOps.flip(tela.crop((0, alt - 2 * b, larg, alt - b))), (0, alt - b))
        salvar(tela, destino, nome)


if __name__ == "__main__":
    origem, origem_canva, destino = sys.argv[1:4]
    os.makedirs(destino, exist_ok=True)
    ilustracoes(origem, destino)
    canva(origem_canva, destino)
