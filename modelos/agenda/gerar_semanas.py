"""Gera dados/semanas.json para a agenda: uma entrada por semana (segunda a domingo),
com os dias, o mês e os eventos do Instituto e feriados de eventos.csv.

Uso:
  python gerar_semanas.py 2027 eventos.csv <pasta_trabalho>/dados/semanas.json

eventos.csv (UTF-8, separado por ponto e vírgula), uma linha por evento:
  data;texto;tipo
  2027-01-01;Confraternização Universal;feriado
  2027-02-06;Início das aulas;instituto
tipo: feriado (sai em destaque) ou instituto (evento do IEEB). Datas em AAAA-MM-DD.
"""
import csv
import json
import sys
from datetime import date, timedelta
from pathlib import Path

MESES = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO",
         "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"]
DIAS = ["SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO", "DOMINGO"]


def main():
    ano, arq_eventos, saida = int(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
    eventos = {}
    with open(arq_eventos, encoding="utf-8-sig") as f:
        for linha in csv.DictReader(f, delimiter=";"):
            eventos.setdefault(linha["data"].strip(), []).append(
                {"t": linha["texto"].strip(), "tipo": linha.get("tipo", "instituto").strip() or "instituto"})

    dia = date(ano, 1, 1)
    dia -= timedelta(days=dia.weekday())          # volta para a segunda-feira da 1ª semana
    semanas = []
    while dia <= date(ano, 12, 31):
        dias = []
        for k in range(7):
            d = dia + timedelta(days=k)
            dias.append({"data": d.isoformat(), "dia": d.day, "semana": DIAS[k], "mes": MESES[d.month - 1],
                         "fora_do_ano": d.year != ano, "eventos": eventos.get(d.isoformat(), [])})
        meses = sorted({x["mes"] for x in dias if not x["fora_do_ano"]}, key=MESES.index)
        semanas.append({"numero": len(semanas) + 1, "titulo": " / ".join(meses), "dias": dias})
        dia += timedelta(days=7)

    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(json.dumps({"ano": ano, "semanas": semanas}, ensure_ascii=False, indent=1), encoding="utf-8")
    sem_eventos = sum(1 for d in eventos if not d.startswith(str(ano)))
    print(f"{len(semanas)} semanas em {saida}; {sum(len(v) for v in eventos.values())} eventos lidos"
          + (f" ({sem_eventos} datas fora de {ano}, ignoradas)" if sem_eventos else ""))


if __name__ == "__main__":
    main()
