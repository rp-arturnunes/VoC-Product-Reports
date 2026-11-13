#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Monta o campo html do painel 156 = shell.html + blocos ocultos de IA (+ snapshot opcional).
Uso: python3 montar_html_painel.py --ia ia --shell shell.html --out html-painel-156.html [--snapshot snapshot-db.json] [--max-total 230000]
A rotina semanal envia ao Arturito SOMENTE este html (e o rationale_md)."""
import argparse,json,os,sys,subprocess
PRODS=['pix','cartao','emprestimo','t2p','link','conta','seguros','cdb','transp','fraude','boletos','topup']
def safe(o):
    s=json.dumps(o,ensure_ascii=False,separators=(',',':'))
    return s.replace('&','\\u0026').replace('<','\\u003c').replace('>','\\u003e').replace('\u2028','\\u2028').replace('\u2029','\\u2029')
def bloco(k,o): return '<div hidden data-px-ia="%s">%s</div>'%(k,safe(o))
def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--ia',default='ia'); ap.add_argument('--shell',default='shell.html'); ap.add_argument('--out',default='html-painel-156.html')
    ap.add_argument('--snapshot'); ap.add_argument('--max-total',type=int,default=185000); ap.add_argument('--sem-validar',action='store_true')
    ap.add_argument('--estrito',action='store_true',help='falha se qualquer bloco for invalido (padrao: omite o bloco invalido e segue)'); a=ap.parse_args()
    here=os.path.dirname(os.path.abspath(__file__))
    omitir=set()
    if not a.sem_validar:
        r=subprocess.run([sys.executable,os.path.join(here,'validar_ia.py'),a.ia],capture_output=True,text=True); print(r.stdout.strip())
        if r.returncode!=0:
            if a.estrito: print('IA invalida: html NAO gerado.'); sys.exit(1)
            for ln in r.stdout.splitlines():
                if not ln.startswith('ERRO'): continue
                m=ln[5:].strip(); k=m.split(':')[0]
                b=None
                for n in ('meta','resumos','destaques','vozes','lojasredes','ra','eventos','exemplos'):
                    if k.startswith(n+'.') or k.startswith(n+'['): b=n
                if b is None:
                    pid=k.split('.')[0]
                    if pid in PRODS: b='produto:'+pid
                    elif k.endswith('.json ausente') or 'invalido' in m: b=m.split('.json')[0].replace('produto-','produto:')
                if b: omitir.add(b)
            print('blocos omitidos (o painel mostra "indisponivel" so nessas partes):',sorted(omitir) or 'nenhum identificado')
    def L(n):
        p=os.path.join(a.ia,n+'.json')
        try: return json.load(open(p,encoding='utf-8'))
        except Exception: return None
    parts=[open(a.shell,encoding='utf-8').read().rstrip()]
    for k in ('meta','resumos','destaques','vozes','lojasredes','ra','eventos','exemplos'):
        o=L(k)
        if o is not None and k not in omitir: parts.append(bloco(k,o))
    for pid in PRODS:
        o=L('produto-'+pid)
        if o is not None and 'produto:'+pid not in omitir: parts.append(bloco('produto:'+pid,o))
    if a.snapshot: parts.append('<div hidden data-px-db>%s</div>'%safe(json.load(open(a.snapshot,encoding='utf-8'))))
    html='\n'.join(parts)+'\n'
    n=len(html.encode('utf-8'))
    if n>a.max_total: print('html com %d bytes (limite %d): reduza exemplos e textos.'%(n,a.max_total)); sys.exit(1)
    open(a.out,'w',encoding='utf-8').write(html); print('html gerado: %d bytes, %d blocos de IA'%(n,html.count('data-px-ia=')))
if __name__=='__main__': main()
