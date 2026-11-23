#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Restaura painel-156/historico/ a partir do git, sem ninguem precisar mesclar nada.
Cada rodada empurra para uma branch claude/* diferente, entao o historico fica espalhado pelas branches. Este script percorre todas
(da mais recente para a mais antiga), junta os arquivos painel-156/historico/W*.json e, em branches que so tem o html da rodada
(html-painel-156.html), deriva a semana dele. Nunca sobrescreve uma semana que ja existe na pasta.
Uso: python3 painel-156/restaurar_historico.py [pasta-historico] [--prefixo painel-156/historico] [--html html-painel-156.html]"""
import os, re, subprocess, sys, tempfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import historico as H, extrair_historico as X
def git(*a):
    r = subprocess.run(['git'] + list(a), capture_output=True)
    return r.returncode, r.stdout
def main():
    arg = [x for x in sys.argv[1:] if not x.startswith('--')]
    opt = lambda n, d: sys.argv[sys.argv.index(n) + 1] if n in sys.argv else d
    pasta = arg[0] if arg else 'painel-156/historico'; prefixo = opt('--prefixo', 'painel-156/historico'); html = opt('--html', 'html-painel-156.html')
    git('fetch', '--all', '--prune', '--quiet')
    rc, out = git('for-each-ref', '--sort=-committerdate', '--format=%(refname)', 'refs/remotes', 'refs/heads')
    refs = [r for r in out.decode().split() if not r.endswith('/HEAD')]
    tem = {h['semana']['w'] for h in H.carregar(pasta)}; novas = []
    for ref in refs:
        rc, ls = git('ls-tree', '-r', '--name-only', ref, '--', prefixo)
        for p in ls.decode().split('\n'):
            m = re.search(r'/(W\d+)\.json$', p)
            if m and m.group(1) not in tem:
                rc, c = git('show', '%s:%s' % (ref, p))
                try: h = __import__('json').loads(c.decode('utf-8'))
                except Exception: continue
                if h.get('semana', {}).get('w') and h.get('destaques'): H.gravar(pasta, h); tem.add(h['semana']['w']); novas.append('%s (arquivo em %s)' % (h['semana']['w'], ref))
        rc, c = git('show', '%s:%s' % (ref, html))
        if rc == 0 and c:
            with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False, encoding='utf-8') as t: t.write(c.decode('utf-8', 'replace')); tmp = t.name
            for h in X.semanas_do_html(open(tmp, encoding='utf-8').read()):
                w = h['semana']['w']
                if w not in tem: H.gravar(pasta, h); tem.add(w); novas.append('%s (derivada do html em %s)' % (w, ref))
            os.unlink(tmp)
    print('historico restaurado em %s: %d semana(s) nova(s) %s | no total: %s' % (pasta, len(novas), novas, [h['semana']['w'] for h in H.carregar(pasta)]))
if __name__ == '__main__': main()
