#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valida os blocos de IA do painel 156 (ia/*.json) antes de montar o html.
Uso: python3 validar_ia.py <pasta-ia>   (saida 0 = ok, 1 = erro; avisos nao bloqueiam)"""
import json,os,re,sys
PRODS=['pix','cartao','emprestimo','t2p','link','conta','seguros','cdb','transp','fraude','boletos','topup']
SITU=['Resolvido','Parcialmente resolvido','Em andamento','Em acompanhamento','Em apuração','Sem solução registrada','Sem registro','Não resolvido','Estável']
EMOJI='💸💳🤝📲🔗👤🛡📈🚌🔒🧾📱'
LIM={'pulso':500,'resumo':700,'t':110,'m':120,'x':260,'s':180,'det':600,'ex_t':720,'texto':700}
erros=[];avisos=[];POOL={}
def E(m): erros.append(m)
def A(m): avisos.append(m)
def txt_ok(path,s,limite=None):
    if not isinstance(s,str): E(f'{path}: precisa ser texto'); return
    if limite and len(s)>limite: E(f'{path}: {len(s)} caracteres (limite {limite})')
    if re.search(r'\bS(3\d|4\d|5[0-3])\b',s): E(f'{path}: use "W46" e nao "S46"')
    if re.search(r'\bN[12]\b',s): E(f'{path}: use "Suporte humano" e nao N1/N2')
    if any(c in s for c in EMOJI): E(f'{path}: nao escreva emoji; o painel acrescenta ao nome do produto')
    if re.search(r'\d{3}\.\d{3}\.\d{3}-\d{2}|\b\d{11}\b',s): E(f'{path}: possivel CPF')
    if re.search(r'[\w.+-]+@[\w-]+\.[\w.]+',s): E(f'{path}: possivel e-mail')
    if re.search(r'\(?\d{2}\)?\s?9?\d{4}-?\d{4}',s) and not re.search(r'R\$',s): A(f'{path}: possivel telefone')
    if re.search(r'lidas? na íntegra|conversas lidas',s,re.I): E(f'{path}: nao informe a quantidade de conversas lidas')
    if re.search(r'recargapay',s,re.I) and re.search(r'\b(a|da|na|pela)\s+RecargaPay\b',s): A(f'{path}: use "o RecargaPay" (masculino)')
    if re.search(r'a[cç][aã]o sugerida|recomenda-se|recomendamos|sugerimos|deve-se|precisa-se|\bpriorizar\b',s,re.I): A(f'{path}: evite sugerir acoes; indique a oportunidade e verifique se foi resolvida')
def serie(path,s,obrig=False):
    if s is None:
        if obrig: E(f'{path}: serie obrigatoria')
        return
    if not isinstance(s,dict) or not isinstance(s.get('v'),list) or len(s['v'])!=10: E(f'{path}: serie precisa de v com 10 numeros'); return
    if not all(x is None or isinstance(x,(int,float)) for x in s['v']): E(f'{path}: serie so aceita numeros')
    txt_ok(path+'.l',s.get('l'),100)
def IMGOK(u):
    u=str(u or '').strip()
    return bool(re.match(r'^[A-Za-z0-9_-]{25,}$',u) or re.search(r'drive\.google\.com/.*[A-Za-z0-9_-]{25,}',u) or re.match(r'^https://(lh3\.googleusercontent\.com|cnt\.recarga\.com)/',u))
def resolve(L):
    out=[]
    for x in (L or []):
        if isinstance(x,str):
            if x in POOL: out.append(POOL[x])
            else: E(f'exemplo {x}: id inexistente em exemplos.json')
        else: out.append(x)
    return out
def exemplos(path,L,maxn=6,minn=0,aviso=None):
    if L is None: L=[]
    if not isinstance(L,list): E(f'{path}: lista'); return 0
    if len(L)>maxn: E(f'{path}: ate {maxn} exemplos')
    R=resolve(L)
    for i,x in enumerate(R):
        if not isinstance(x,dict) or not x.get('t') or not x.get('m'): E(f'{path}[{i}]: precisa de t (trecho) e m (canal, id e data)'); continue
        txt_ok(f'{path}[{i}].t',x['t'],LIM['ex_t'])
        if not re.search(r'\d{1,2}/\d{2}',x['m']): E(f'{path}[{i}].m: informe a data (dd/mm)')
    if minn and len(R)<minn: A(f'{path}: {len(R)} exemplos (o ideal sao {minn}); '+(aviso or 'confirme se o volume da semana e baixo'))
    return len(R)
def card(path,x):
    for k in ('t','m','x','sl','s'):
        if k not in x: E(f'{path}.{k}: obrigatorio')
    txt_ok(path+'.t',x.get('t'),LIM['t']); txt_ok(path+'.m',x.get('m'),LIM['m']); txt_ok(path+'.x',x.get('x'),LIM['x']); txt_ok(path+'.s',x.get('s'),LIM['s'])
    if x.get('sl') not in SITU: E(f'{path}.sl: use uma de {SITU}')
    if x.get('p') is not None and x.get('p') not in PRODS: E(f'{path}.p: produto invalido')
    if x.get('ps') is not None:
        if not isinstance(x['ps'],list) or any(i not in PRODS for i in x['ps']): E(f'{path}.ps: lista de produtos validos (produtos correlacionados no mesmo destaque)')
    if not x.get('det'): A(f'{path}: sem det; o card abre so com resumo e situacao')
    if x.get('img') is not None and not IMGOK(x['img']): E(f'{path}.img: use o id ou o link de uma imagem da pasta do Drive (ou https://lh3.googleusercontent.com/d/<id>=w400)')
    if 'det' in x: txt_ok(path+'.det',x['det'],LIM['det'])
    serie(path+'.serie',x.get('serie')); serie(path+'.serie2',x.get('serie2')); exemplos(path+'.ex',x.get('ex'),6,5,'destaque deve ter pelo menos 5 exemplos reais com data')
def ler(d,n,obrig=True):
    p=os.path.join(d,n+'.json')
    if not os.path.exists(p):
        (E if obrig else A)(f'{n}.json ausente'); return None
    try: return json.load(open(p,encoding='utf-8'))
    except Exception as e: E(f'{n}.json invalido: {e}'); return None
def main(d):
    pool=ler(d,'exemplos')
    if pool:
        for k,v in pool.items():
            if not re.match(r'^e[0-9a-z]{1,4}$',k): E(f'exemplos.{k}: id invalido')
            elif not isinstance(v,dict) or not v.get('t') or not v.get('m'): E(f'exemplos.{k}: precisa de t e m')
            else:
                POOL[k]=v
                txt_ok(f'exemplos.{k}.t',v['t'],LIM['ex_t'])
                if not re.search(r'\d{1,2}/\d{2}',v['m']): E(f'exemplos.{k}.m: informe a data (dd/mm)')
    m=ler(d,'meta')
    if m and m.get('imagens'):
        for k,u in m['imagens'].items():
            if not IMGOK(u): E(f'meta.imagens.{k}: use o id ou o link de uma imagem da pasta do Drive')
    if m:
        s=m.get('semana') or {}
        if not re.match(r'^W\d{2}$',str(s.get('w',''))): E('meta.semana.w: formato W46')
        for k in ('ini','fim','pub'):
            if not re.match(r'^\d{2}/\d{2}(/\d{4})?$',str(s.get(k,''))): E(f'meta.semana.{k}: formato dd/mm/aaaa')
        txt_ok('meta.pulso',m.get('pulso'),LIM['pulso'])
        if not isinstance(m.get('atencao',[]),list): E('meta.atencao: lista')
    r=ler(d,'resumos')
    if r:
        for k in ('produtos','destaques','radar','indicadores','vozes','lojasredes','movimentos'):
            if k not in r: E(f'resumos.{k}: obrigatorio')
            else: txt_ok(f'resumos.{k}',r[k],LIM['resumo'])
    de=ler(d,'destaques')
    if de:
        rk=[x.get('rank') for g in ('novos','oport','agir') for x in de.get(g,[])]; n=len(rk)
        if n and any(not isinstance(r,int) for r in rk): A('destaques: defina rank (inteiro, 1 = maior impacto e urgencia) em todos os cards; sem ele o painel usa uma ordem de reserva')
        elif n and (sorted(rk)!=list(range(1,n+1))): A(f'destaques: rank deve ser unico de 1 a {n}')
        if n>15: A(f'destaques: {n} itens; o painel mostra 5 cards e 10 temas em alta (ate 15)')
        cob=set(i for g in ('novos','oport','agir') for x in de.get(g,[]) for i in ([x.get('p')]+list(x.get('ps') or [])) if i)
        regf=os.path.join(os.path.dirname(os.path.abspath(__file__)),'registro-painel.json')
        if os.path.exists(regf):
            for c in json.load(open(regf,encoding='utf-8')).get('canais',[]):
                ids=c.get('painel')
                if ids and not (set(ids)&cob): E(f'destaques: o squad do canal {c["canal"]} ({", ".join(ids)}) nao tem nenhum cenario; todo squad precisa de pelo menos 1 destaque (use p e, para produtos correlacionados, ps)')
        else: A('registro-painel.json nao encontrado ao lado do validador: cobertura por squad nao conferida')
        for i in PRODS:
            if i not in cob: A(f'destaques: o produto {i} nao aparece em nenhum destaque')
        for g in ('novos','oport','agir'):
            L=de.get(g,[])
            if len(L)>8: E(f'destaques.{g}: ate 8 itens')
            for i,x in enumerate(L): card(f'destaques.{g}[{i}]',x)
    v=ler(d,'vozes')
    if v:
        for g in ('reclamam','pedem','elogiam'):
            for i,x in enumerate(v.get(g,[])):
                for k in ('t','d','p'):
                    if k not in x: E(f'vozes.{g}[{i}].{k}: obrigatorio')
                txt_ok(f'vozes.{g}[{i}].t',x.get('t'),LIM['t']); txt_ok(f'vozes.{g}[{i}].d',x.get('d'),240)
                if x.get('p') not in PRODS: E(f'vozes.{g}[{i}].p: produto invalido')
                if x.get('img') is not None and not IMGOK(x['img']): E(f'vozes.{g}[{i}].img: use o id ou o link de uma imagem da pasta do Drive')
                if 'det' in x: txt_ok(f'vozes.{g}[{i}].det',x['det'],LIM['det'])
                serie(f'vozes.{g}[{i}].serie',x.get('serie')); exemplos(f'vozes.{g}[{i}].ex',x.get('ex'),6,5)
    lr=ler(d,'lojasredes')
    if lr:
        txt_ok('lojasredes.texto',lr.get('texto'),LIM['texto']); 
        for c in ('loja','rede'):
            o=lr.get(c) or {}
            for i,t in enumerate(o.get('temas',[])): txt_ok(f'lojasredes.{c}.temas[{i}].t',t.get('t'),100); txt_ok(f'lojasredes.{c}.temas[{i}].x',t.get('x',''),300)
            for k in ('neg','pos','falsopos'): exemplos(f'lojasredes.{c}.{k}',o.get(k),6)
    ra=ler(d,'ra')
    if ra:
        txt_ok('ra.texto',ra.get('texto'),LIM['texto'])
        for i,t in enumerate(ra.get('temas',[])):
            txt_ok(f'ra.temas[{i}].t',t.get('t'),100); serie(f'ra.temas[{i}]',{'v':t.get('v'),'l':'x'},True); exemplos(f'ra.temas[{i}].ex',t.get('ex'),3)
            if 'det' in t: txt_ok(f'ra.temas[{i}].det',t['det'],LIM['det'])
    ev=ler(d,'eventos')
    if ev is not None:
        L=ev if isinstance(ev,list) else ev.get('itens',[])
        if len(L)>20: E('eventos: ate 20 itens (ultimos 30 dias)')
        for i,e in enumerate(L):
            for k in ('d','t','tipo','res','imp'):
                if k not in e: E(f'eventos[{i}].{k}: obrigatorio')
            txt_ok(f'eventos[{i}].t',e.get('t'),140); txt_ok(f'eventos[{i}].res',e.get('res'),220)
            for j,im in enumerate(e.get('imp',[])):
                if not (isinstance(im,list) and len(im)==3): E(f'eventos[{i}].imp[{j}]: [canal, nivel, texto]'); continue
                if im[1] not in ('Crítico','Atenção','Em linha','Sem efeito'): E(f'eventos[{i}].imp[{j}]: nivel invalido')
            for k,lim in (('analise',440),('marca',300),('pred',300)): txt_ok(f'eventos[{i}].{k}',e.get(k,''),lim)
    for pid in PRODS:
        p=ler(d,'produto-'+pid)
        if not p: continue
        a=p.get('analise') or {}
        for k,t in (p.get('jornada') or {}).items(): txt_ok(f'{pid}.jornada.{k}',t,300)
        for sid,sb in (p.get('subs') or {}).items():
            if not isinstance(sb,dict): E(f'{pid}.subs.{sid}: objeto'); continue
            sa=sb.get('analise') or {}
            for k in ('clientes','mudou'):
                if k in sa: txt_ok(f'{pid}.subs.{sid}.analise.{k}',sa[k],650)
            for j,t in enumerate(sa.get('atencao',[])): txt_ok(f'{pid}.subs.{sid}.analise.atencao[{j}]',t,260)
            for j,t in enumerate(sb.get('temas',[])): txt_ok(f'{pid}.subs.{sid}.temas[{j}].t',t.get('t'),100); txt_ok(f'{pid}.subs.{sid}.temas[{j}].x',t.get('x',''),300)
            for c,L in (sb.get('exemplos') or {}).items(): exemplos(f'{pid}.subs.{sid}.exemplos.{c}',L,6)
        pf=re.split(r'(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ"“])',(a.get('clientes') or a.get('mudou') or ''))[0]
        if len(pf)>330: A(f'{pid}.analise.clientes: a primeira frase tem {len(pf)} caracteres e aparece no card do produto; deixe-a com ate ~300')
        txt_ok(f'{pid}.analise.clientes',a.get('clientes'),650); txt_ok(f'{pid}.analise.mudou',a.get('mudou'),550)
        for i,x in enumerate(a.get('atencao',[])): txt_ok(f'{pid}.analise.atencao[{i}]',x,220)
        mo=p.get('motivos',[])
        if len(mo)>4: E(f'{pid}.motivos: ate 4')
        for i,x in enumerate(mo):
            for k in ('t','n','ant','var'):
                if k not in x: E(f'{pid}.motivos[{i}].{k}: obrigatorio')
            dd=x.get('det')
            if dd:
                for k in ('res','exp'): txt_ok(f'{pid}.motivos[{i}].det.{k}',dd.get(k,''),320)
                for j,t in enumerate(dd.get('dor',[])): txt_ok(f'{pid}.motivos[{i}].det.dor[{j}]',t,260)
                exemplos(f'{pid}.motivos[{i}].det.ex',dd.get('ex'),6,5,'motivo de contato deve ter pelo menos 5 exemplos reais com data (ou justifique o volume baixo)')
            if not dd: exemplos(f'{pid}.motivos[{i}].ex',x.get('ex'),6,5)
        mc=p.get('mencoes') or {}
        txt_ok(f'{pid}.mencoes.texto',mc.get('texto',''),750); exemplos(f'{pid}.mencoes.ra',mc.get('ra'),3)
        for c,L in (p.get('exemplos') or {}).items(): exemplos(f'{pid}.exemplos.{c}',L,3)
    return not erros
if __name__=='__main__':
    d=sys.argv[1] if len(sys.argv)>1 else 'ia'
    ok=main(d)
    for a in avisos: print('AVISO',a)
    for e in erros: print('ERRO ',e)
    print('OK' if ok else f'{len(erros)} erro(s)'); sys.exit(0 if ok else 1)
