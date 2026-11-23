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
    ap.add_argument('--snapshot'); ap.add_argument('--max-total',type=int,default=260000); ap.add_argument('--sem-validar',action='store_true'); ap.add_argument('--historico',help='pasta com as semanas arquivadas (arquivar_semana.py)'); ap.add_argument('--semanas-historico',type=int,default=3,help='semanas ANTERIORES incluidas (3 + a atual = 4 semanas)'); ap.add_argument('--parcial',action='store_true',help='so para pre-visualizacao: nao exige completude e omite blocos invalidos (a rotina semanal NUNCA usa)')
    ap.add_argument('--estrito',action='store_true',help='falha se qualquer bloco for invalido (padrao: omite o bloco invalido e segue)'); a=ap.parse_args()
    here=os.path.dirname(os.path.abspath(__file__))
    omitir=set()
    if not a.sem_validar:
        r=subprocess.run([sys.executable,os.path.join(here,'validar_ia.py'),a.ia]+([] if a.parcial else ['--completo']),capture_output=True,text=True); print(r.stdout.strip())
        if r.returncode!=0:
            if a.estrito or not a.parcial: print('IA incompleta ou invalida: html NAO gerado. Corrija os erros acima (nunca publique um painel parcial).'); sys.exit(1)
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
    if a.historico:
        sys.path.insert(0,here); import historico as HI
        cur=(L('meta') or {}).get('semana',{}).get('w'); ant=[h for h in HI.carregar(a.historico) if h['semana']['w']!=cur][:max(a.semanas_historico,0)]
        if ant:
            b64,raw=HI.bloco_b64(ant); parts.append('<div hidden data-px-hist>%s</div>'%b64)
            print('historico: %d semanas anteriores (%s), %d KB bruto -> %d KB no html'%(len(ant),', '.join(h['semana']['w'] for h in ant),raw//1024,len(b64)//1024))
        else: print('AVISO: sem semanas anteriores em %s; o painel mostra so a semana atual (restaure com extrair_historico.py)'%a.historico)
    if a.snapshot: parts.append('<div hidden data-px-db>%s</div>'%safe(json.load(open(a.snapshot,encoding='utf-8'))))
    html='\n'.join(parts)+'\n'
    n=len(html.encode('utf-8'))
    if n>a.max_total: print('html com %d bytes (limite %d): reduza exemplos e textos.'%(n,a.max_total)); sys.exit(1)
    open(a.out,'w',encoding='utf-8').write(html); print('html gerado: %d bytes, %d blocos de IA'%(n,html.count('data-px-ia=')))
if __name__=='__main__': main()
