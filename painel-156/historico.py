# -*- coding: utf-8 -*-
"""Historico de semanas do painel 156: formato compacto da semana arquivada (historico/{W}.json) e funcoes de leitura/escrita."""
import base64, datetime, gzip, json, os, re

def J(f): return json.load(open(f, encoding='utf-8'))

def datas_semana(sem):
    fim = [int(x) for x in sem['fim'].split('/')]; f = datetime.date(fim[2], fim[1], fim[0])
    ini = sem['ini'].split('/'); i = datetime.date(f.year, int(ini[1]), int(ini[0]))
    if i > f: i = i.replace(year=f.year - 1)
    return i, f

def eventos_da_semana(eventos, sem):
    """Eventos cujo dia cai dentro da semana (a lista da rodada cobre 30 dias; cada semana guarda so os seus)."""
    i, f = datas_semana(sem); out = []
    for e in eventos or []:
        n = re.findall(r'\d{1,2}', str(e.get('d', '')))
        if len(n) < 2: continue
        d, m = int(n[0]), int(n[-1])
        try: dt = datetime.date(f.year - 1 if m > f.month else f.year, m, d)
        except ValueError: continue
        if i <= dt <= f: out.append({k: e[k] for k in ('d', 't', 'tipo', 'res', 'imp') if k in e})
    return out

def arquivar(meta, resumos, destaques, eventos, exemplos, ex_max=3):
    sem = {k: meta['semana'][k] for k in ('w', 'ini', 'fim', 'pub') if k in meta['semana']}
    dd = {}; ids = []
    for g in ('novos', 'oport', 'agir'):
        dd[g] = []
        for x in destaques.get(g, []):
            y = dict(x); y['ex'] = list(x.get('ex', []))[:ex_max]; ids += y['ex']; dd[g].append(y)
    pool = {i: {'t': exemplos[i]['t'], 'm': exemplos[i]['m']} for i in dict.fromkeys(ids) if i in exemplos}
    return {'semana': sem, 'pulso': meta.get('pulso', ''), 'resumo': (resumos or {}).get('destaques', ''), 'destaques': dd,
            'eventos': eventos_da_semana(eventos, sem), 'exemplos': pool}

def chave_ordem(h):
    d = h['semana']['fim'].split('/'); return (int(d[2]), int(d[1]), int(d[0]))

def carregar(pasta):
    L = []
    if os.path.isdir(pasta):
        for f in os.listdir(pasta):
            if f.endswith('.json'):
                try: h = J(os.path.join(pasta, f))
                except Exception: continue
                if isinstance(h, dict) and h.get('semana', {}).get('w') and h.get('destaques'): L.append(h)
    return sorted(L, key=chave_ordem, reverse=True)

def gravar(pasta, h):
    os.makedirs(pasta, exist_ok=True)
    p = os.path.join(pasta, h['semana']['w'] + '.json'); json.dump(h, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=0); return p

def bloco_b64(semanas):
    raw = json.dumps(semanas, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    return base64.b64encode(gzip.compress(raw, 9, mtime=0)).decode('ascii'), len(raw)

def ler_b64(txt):
    return json.loads(gzip.decompress(base64.b64decode(re.sub(r'\s+', '', txt))).decode('utf-8'))
