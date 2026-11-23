#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Arquiva a semana da rodada (destaques, eventos da semana e exemplos citados) em <historico>/{W}.json.
Uso: python3 arquivar_semana.py <pasta-ia> <pasta-historico> [--ex 3]
Rode depois de `validar_ia.py --completo` OK e antes de montar o html."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import historico as H
def main():
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    if len(a) < 2: print(__doc__); sys.exit(2)
    ex = int(sys.argv[sys.argv.index('--ex') + 1]) if '--ex' in sys.argv else 3
    ia, pasta = a[0], a[1]; L = lambda n: H.J(os.path.join(ia, n + '.json'))
    h = H.arquivar(L('meta'), L('resumos'), L('destaques'), L('eventos'), L('exemplos'), ex)
    n = sum(len(v) for v in h['destaques'].values())
    if n != 15: print('ERRO: %d destaques (esperado 15)' % n); sys.exit(1)
    p = H.gravar(pasta, h); print('arquivada %s: %d destaques, %d eventos da semana, %d exemplos -> %s (%d bytes)' % (h['semana']['w'], n, len(h['eventos']), len(h['exemplos']), p, os.path.getsize(p)))
if __name__ == '__main__': main()
