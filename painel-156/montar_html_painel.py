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
    ap.add_argument('--snapshot'); ap.add_argument('--max-total',type=int,default=240000); ap.add_argument('--sem-validar',action='store_true'); ap.add_argument('--exemplos-max',type=int,default=5,help='maximo de exemplos por lista no html'); ap.add_argument('--compacto',action='store_true',help='plano B de tamanho: 3 exemplos por lista (use so se a publicacao falhar por tamanho)'); ap.add_argument('--historico',help='pasta com as semanas arquivadas (arquivar_semana.py)'); ap.add_argument('--semanas-historico',type=int,default=3,help='semanas ANTERIORES incluidas (3 + a atual = 4 semanas)'); ap.add_argument('--parcial',action='store_true',help='so para pre-visualizacao: nao exige completude e omite blocos invalidos (a rotina semanal NUNCA usa)')
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
    shell=open(a.shell,encoding='utf-8').read().rstrip()
    blocks=[]
    for k in ('meta','resumos','destaques','vozes','lojasredes','ra','eventos'):
        o=L(k)
        if o is not None and k not in omitir: blocks.append((k,o))
    for pid in PRODS:
        o=L('produto-'+pid)
        if o is not None and 'produto:'+pid not in omitir: blocks.append(('produto:'+pid,o))
    pool=L('exemplos') or {}
    exmax=3 if a.compacto else a.exemplos_max
    # compactacao: mesmo texto = mesmo id, no maximo exmax exemplos por lista e pool so com o que e citado
    canon={}; seen={}
    for i,v in pool.items(): canon[i]=seen.setdefault(v.get('t'),i)
    cortados=[0]
    def isids(o): return isinstance(o,list) and o and all(isinstance(x,str) and x in pool for x in o)
    def walk(o):
        if isids(o):
            r=[]
            for x in o:
                c=canon[x]
                if c not in r: r.append(c)
            if len(r)>exmax: cortados[0]+=len(r)-exmax; r=r[:exmax]
            return r
        if isinstance(o,list): return [walk(x) for x in o]
        if isinstance(o,dict): return {k:walk(v) for k,v in o.items()}
        return o
    blocks=[(k,walk(o)) for k,o in blocks]
    usados=set(); 
    def coleta(o):
        if isids(o): usados.update(o)
        elif isinstance(o,list): [coleta(x) for x in o]
        elif isinstance(o,dict): [coleta(v) for v in o.values()]
    for k,o in blocks: coleta(o)
    novo_pool={i:pool[i] for i in pool if i in usados}
    if pool: blocks.append(('exemplos',novo_pool)); print('exemplos: %d -> %d no pool (%d duplicados juntados, %d acima de %d por lista cortados)'%(len(pool),len(novo_pool),len(pool)-len(set(canon.values())),cortados[0],exmax))
    ordem=['meta','resumos','destaques','vozes','lojasredes','ra','eventos','exemplos']+['produto:'+p for p in PRODS]
    blocks.sort(key=lambda x: ordem.index(x[0]) if x[0] in ordem else 99)
    parts=[shell]+[bloco(k,o) for k,o in blocks]
    base=len('\n'.join(parts).encode('utf-8'))
    if a.snapshot: snap='<div hidden data-px-db>%s</div>'%safe(json.load(open(a.snapshot,encoding='utf-8'))); parts.append(snap); base+=len(snap.encode('utf-8'))+1
    hblock='';
    if a.historico:
        sys.path.insert(0,here); import historico as HI
        cur=(L('meta') or {}).get('semana',{}).get('w'); ant=[h for h in HI.carregar(a.historico) if h['semana']['w']!=cur][:max(a.semanas_historico,0)]
        n=len(ant)
        while n>0:
            b64,raw=HI.bloco_b64(ant[:n]); tam=base+len(b64)+60
            if tam<=a.max_total: break
            n-=1
        if n>0:
            hblock='<div hidden data-px-hist>%s</div>'%b64; parts.append(hblock)
            print('historico: %d de %d semanas anteriores (%s), %d KB bruto -> %d KB no html'%(n,len(ant),', '.join(h['semana']['w'] for h in ant[:n]),raw//1024,len(b64)//1024))
            if n<len(ant): print('AVISO: historico reduzido de %d para %d semanas para caber em %d KB; registre na notificacao'%(len(ant),n,a.max_total//1024))
        else: print('AVISO: sem semanas anteriores no historico (ou nao cabem no teto); o painel mostra so a semana atual (restaure com restaurar_historico.py)')
    nb=sum(1 for k,_ in blocks)
    parts.append('<!--px-fim %s blocos=%d hist=%d-->'%((L('meta') or {}).get('semana',{}).get('w','?'),nb,1 if hblock else 0))
    html='\n'.join(parts)+'\n'
    n=len(html.encode('utf-8'))
    if n>a.max_total:
        tam=sorted(((len(json.dumps(o,ensure_ascii=False,separators=(',',':')).encode()),k) for k,o in blocks),reverse=True)[:5]
        print('html com %d bytes (limite %d). Maiores blocos: %s. Reduza textos, reaproveite exemplos entre blocos ou rode com --compacto.'%(n,a.max_total,', '.join('%s %dKB'%(k,t//1024) for t,k in tam))); sys.exit(1)
    open(a.out,'w',encoding='utf-8').write(html); print('html gerado: %d bytes, %d blocos de IA'%(n,html.count('data-px-ia=')))
if __name__=='__main__': main()
