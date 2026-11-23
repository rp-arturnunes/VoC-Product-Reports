#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recupera o historico a partir de um html ja publicado: grava as semanas do bloco data-px-hist e arquiva a semana corrente do html.
Uso: python3 extrair_historico.py <html-publicado> <pasta-historico> [--ex 3]
Serve para restaurar historico/ quando a rotina comeca sem ele (ex.: clone novo do repositorio)."""
import html as _h, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import historico as H
def main():
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    if len(a) < 2: print(__doc__); sys.exit(2)
    ex = int(sys.argv[sys.argv.index('--ex') + 1]) if '--ex' in sys.argv else 3
    t = open(a[0], encoding='utf-8').read(); n = 0
    m = re.search(r'<div hidden data-px-hist>(.*?)</div>', t, re.S)
    if m:
        for h in H.ler_b64(m.group(1)): H.gravar(a[1], h); n += 1
    B = {k: json.loads(_h.unescape(v)) for k, v in re.findall(r'<div hidden data-px-ia="([^":]+)">(.*?)</div>', t, re.S) if k in ('meta', 'resumos', 'destaques', 'eventos', 'exemplos')}
    if all(k in B for k in ('meta', 'destaques', 'exemplos')):
        h = H.arquivar(B['meta'], B.get('resumos', {}), B['destaques'], B.get('eventos', []), B['exemplos'], ex)
        if h['semana'].get('w'): H.gravar(a[1], h); n += 1; print('semana corrente do html arquivada:', h['semana']['w'])
    print('%d semana(s) gravada(s) em %s | no historico: %s' % (n, a[1], [x['semana']['w'] for x in H.carregar(a[1])]))
if __name__ == '__main__': main()
