"""Prepara as artes de um livro para o Affinity.

- Confere a resolução no tamanho final (com sangria) e avisa o que está abaixo de 300 dpi.
- Se a arte não tiver sangria, cria 3 mm espelhando a borda (--criar-sangria).
- Salva em JPG de alta qualidade, com o nome da página, na pasta de saída.

Uso:
  python preparar_imagens.py <pasta_entrada> <pasta_saida> --largura 210 --altura 210 [--criar-sangria]

A pasta de saída deve ficar dentro da pasta de trabalho na Área de Trabalho (…/<obra>/imagens),
porque o Affinity da Microsoft Store só lê a Área de Trabalho.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageOps

SANGRIA_MM = 3
MIN_DPI = 300


def espelhar_borda(img, px):
    """Cria uma moldura de px pixels espelhando a própria borda da imagem."""
    w, h = img.size
    nova = Image.new(img.mode, (w + 2 * px, h + 2 * px))
    nova.paste(img, (px, px))
    nova.paste(ImageOps.mirror(img.crop((0, 0, px, h))), (0, px))
    nova.paste(ImageOps.mirror(img.crop((w - px, 0, w, h))), (w + px, px))
    topo = nova.crop((0, px, w + 2 * px, 2 * px))
    nova.paste(ImageOps.flip(topo), (0, 0))
    base = nova.crop((0, h, w + 2 * px, h + px))
    nova.paste(ImageOps.flip(base), (0, h + px))
    return nova


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("saida")
    ap.add_argument("--largura", type=float, required=True, help="largura do corte em mm")
    ap.add_argument("--altura", type=float, required=True, help="altura do corte em mm")
    ap.add_argument("--criar-sangria", action="store_true")
    a = ap.parse_args()

    saida = Path(a.saida)
    saida.mkdir(parents=True, exist_ok=True)
    larg_total = (a.largura + 2 * SANGRIA_MM) / 25.4  # polegadas, com sangria
    baixas = []
    for arq in sorted(Path(a.entrada).iterdir()):
        if arq.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"):
            continue
        img = Image.open(arq).convert("RGB")
        if a.criar_sangria:
            px = round(img.width * SANGRIA_MM / a.largura)
            img = espelhar_borda(img, px)
        dpi = img.width / larg_total
        img.save(saida / (arq.stem + ".jpg"), quality=95, dpi=(round(dpi), round(dpi)))
        marca = "" if round(dpi) >= MIN_DPI else "  <-- abaixo de 300 dpi: ampliar antes da gráfica"
        if marca:
            baixas.append(arq.name)
        print(f"{arq.name}: {img.width}x{img.height} px, {dpi:.0f} dpi{marca}")
    print(f"\n{len(baixas)} imagem(ns) abaixo de {MIN_DPI} dpi." if baixas else "\nTodas com 300 dpi ou mais.")


if __name__ == "__main__":
    main()
