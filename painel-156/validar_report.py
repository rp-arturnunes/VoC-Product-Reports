# -*- coding: utf-8 -*-
"""Valida um report do painel 156 (contrato v1.1): estrutura, limites de tamanho e regras de conteudo.

Uso:  python3 validar_report.py arquivo1.json [arquivo2.json ...]
Sai com codigo 1 se algum report tiver erro. Avisos nao reprovam.
v1.1: aceita `det` (detalhe aprofundado) em motivos[] e em mencoes.cards[]; ver contrato-report-v1.md secao 8.
"""
import json, re, sys

SQUADS = {'geral', 'pix', 'cartao', 'emprestimo', 't2p', 'link', 'account', 'seguros', 'cdb', 'transporte', 'fraude', 'outros'}
TOP = {'squad', 'sub', 'rot', 'periodo', 'meta', 'pub', 'resumo', 'alertas', 'monit', 'ok', 'kpis', 'funil', 'motivos',
       'causas', 'recl', 'mencoes', 'cenario', 'eventos', 'atualiz', 'rodape', 'analise', 'blocos', 'historico', 'historico_t', 'historico_sub'}
MAXN = {'alertas': 4, 'monit': 5, 'ok': 4, 'kpis': 9, 'motivos': 10, 'causas': 5, 'recl': 5, 'eventos': 14}
HARD, ALVO = 56000, 36000          # por report (v1.1: o detalhe `det` aumenta o orcamento)
DET_HARD, DET_ALVO = 7000, 5200    # por `det` (texto em portugues: ~1,1 B por caractere)
CLS = {'up', 'down', 'flat', None}
DET_M = {'res', 'cen', 'dor', 'exp', 'falha', 'causas', 'serie', 'serie_lbl', 'sr', 'ev', 'rel', 'base'}
DET_C = {'sub', 'resumo', 'temas', 'cl', 'ux', 'ev', 'rel', 'sr', 'base'}
DET_MAX = {'dor': 4, 'falha': 4, 'causas': 7, 'ev': 4, 'rel': 5, 'temas': 6, 'cl': 8, 'ux': 3}
TOM = {'neg', 'neu', 'pos', 'mix'}


def chave_de(d):
    return d.get('squad', '') + (('/' + d['sub']) if d.get('sub') else '')


def textos(o, path=''):
    if isinstance(o, str):
        yield path, o
    elif isinstance(o, list):
        for i, x in enumerate(o):
            yield from textos(x, path + '[%d]' % i)
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from textos(v, path + '.' + k)


def num(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def val_det(p, det, tipo, e, w):
    """tipo: 'mot' (motivo de contato) ou 'card' (card de mencoes)."""
    if not isinstance(det, dict):
        e.append('%s: det deve ser um objeto' % p); return
    ok = DET_M if tipo == 'mot' else DET_C
    for k in det:
        if k not in ok:
            e.append('%s.%s: chave desconhecida em det' % (p, k))
    n = len(json.dumps(det, ensure_ascii=False, separators=(',', ':')).encode())
    if n > DET_HARD:
        e.append('%s: det com %d B acima do limite duro (%d B)' % (p, n, DET_HARD))
    elif n > DET_ALVO:
        w.append('%s: det com %d B acima do alvo (%d B)' % (p, n, DET_ALVO))
    for k, m in DET_MAX.items():
        if k in det and k in ok and len(det[k] or []) > m:
            e.append('%s.%s: %d itens (max. %d)' % (p, k, len(det[k]), m))
    s = det.get('serie')
    if s is not None and not (isinstance(s, list) and 2 <= len(s) <= 8 and all(num(v) for v in s)):
        e.append('%s.serie deve ter 2-8 numeros' % p)
    for i, x in enumerate(det.get('ev') or []):
        if not x.get('d') or not x.get('t'):
            e.append('%s.ev[%d]: d e t sao obrigatorios' % (p, i))
        if not x.get('f'):
            w.append('%s.ev[%d]: sem fonte (f): informe o canal ou o report' % (p, i))
    for i, x in enumerate(det.get('rel') or []):
        if not x.get('t'):
            e.append('%s.rel[%d].t e obrigatorio' % (p, i))
        elif len(x['t']) > 260:
            e.append('%s.rel[%d].t > 260 caracteres (use um trecho curto)' % (p, i))
        if not x.get('m'):
            w.append('%s.rel[%d]: sem origem (m): ticket e canal' % (p, i))
    for i, x in enumerate(det.get('falha') or []):
        if not x.get('o') or not x.get('t'):
            e.append('%s.falha[%d]: o e t sao obrigatorios' % (p, i))
    for k in ('temas', 'ux'):
        for i, x in enumerate(det.get(k) or []):
            if not x.get('t'):
                e.append('%s.%s[%d].t e obrigatorio' % (p, k, i))
            if x.get('tom') is not None and x['tom'] not in TOM:
                e.append('%s.%s[%d].tom deve ser neg, neu, pos ou mix' % (p, k, i))
    for i, x in enumerate(det.get('cl') or []):
        if not x.get('c'):
            e.append('%s.cl[%d].c e obrigatorio' % (p, i))
    for i, x in enumerate(det.get('causas') or []):
        if not (isinstance(x, list) and len(x) == 2 and num(x[1])):
            e.append('%s.causas[%d] deve ser [nome, numero]' % (p, i))
    b = det.get('base')
    if tipo == 'mot':
        if isinstance(b, dict) and b.get('lidos') == 0 and 'sem leitura' in str(b.get('met', '')):
            pass   # motivo so com serie de contatos (ex.: Pix In), sem leitura de conversas
        elif not isinstance(b, dict) or not num(b.get('lidos')) or b.get('lidos', 0) < 1:
            e.append('%s.base.lidos (transcricoes completas lidas, >= 1) e obrigatorio' % p)
        elif num(b.get('total')) and b['lidos'] < min(5, b['total']):
            w.append('%s.base: so %d transcricoes lidas (minimo recomendado: 5)' % (p, b['lidos']))
        if isinstance(b, dict) and not b.get('met'):
            w.append('%s.base.met: descreva a amostra' % p)
        for k in ('cen', 'dor', 'exp', 'falha', 'rel'):
            if not det.get(k):
                w.append('%s: det sem %s' % (p, k))
    elif not (isinstance(b, dict) and b.get('met')):
        w.append('%s.base.met: descreva como as mencoes foram lidas' % p)
    if len(det.get('cen', '')) > 900:
        e.append('%s.cen > 900 caracteres' % p)
    if len(det.get('res', '')) > 360:
        e.append('%s.res > 360 caracteres' % p)


def validar(d):
    e, w = [], []
    n = len(json.dumps(d, ensure_ascii=False, separators=(',', ':')).encode())
    hard, alvo = (150000, 130000) if d.get('squad') == 'geral' else (HARD, ALVO)   # a Visao geral consolida todas as squads
    if n > hard:
        e.append('tamanho %d B acima do limite duro (%d B)' % (n, hard))
    elif n > alvo:
        w.append('tamanho %d B acima do alvo (%d B); considere enxugar' % (n, alvo))
    for k in d:
        if k not in TOP:
            e.append('chave desconhecida: ' + k)
    if d.get('squad') not in SQUADS:
        e.append('squad invalida: %r (use %s)' % (d.get('squad'), ', '.join(sorted(SQUADS))))
    for k in ('rot', 'periodo', 'pub', 'resumo'):
        if not d.get(k):
            e.append('campo obrigatorio ausente: ' + k)
    if d.get('pub') and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', d['pub']):
        e.append('pub deve ser AAAA-MM-DD')
    a = d.get('analise')
    if a is not None:
        if not isinstance(a, dict) or not (a.get('clientes') and a.get('mudou') and a.get('atencao')):
            e.append('analise deve ter clientes, mudou e atencao')
        else:
            if len(a['clientes']) > 1100: e.append('analise.clientes > 1100 caracteres')
            if len(a['mudou']) > 800: e.append('analise.mudou > 800 caracteres')
            if len(a['atencao']) > 4: e.append('analise.atencao > 4 itens')
            for x in a['atencao']:
                if len(x) > 300: e.append('analise.atencao: item > 300 caracteres')
    for k, m in MAXN.items():
        if len(d.get(k) or []) > m:
            e.append('%s: %d itens (max. %d)' % (k, len(d[k]), m))
    if len(d.get('resumo', '')) > 520:
        e.append('resumo > 520 caracteres')
    for i, a in enumerate(d.get('alertas') or []):
        for k in ('t', 'v', 'n'):
            if not a.get(k):
                e.append('alertas[%d].%s e obrigatorio' % (i, k))
    for i, x in enumerate(d.get('motivos') or []):
        if x.get('det') is not None:
            val_det('motivos[%d].det' % i, x['det'], 'mot', e, w)
            if num(x.get('n')) and x['n'] < 15:
                w.append('motivos[%d]: det em motivo com poucos contatos (%d < 15)' % (i, x['n']))
    for i, r in enumerate(d.get('recl') or []):
        if len(r.get('temas', [])) > 6:
            e.append('recl[%d].temas > 6' % i)
        for k in ('exp', 'cor', 'ex'):
            if len(r.get(k, [])) > 3:
                e.append('recl[%d].%s > 3' % (i, k))
        for j, c in enumerate(r.get('cor', [])):
            if '[[' not in c and 'sem evento' not in c.lower():
                w.append('recl[%d].cor[%d]: correlacao sem fonte [[...]]' % (i, j))
    mc = d.get('mencoes') or {}
    if len(mc.get('cards', [])) > 4:
        e.append('mencoes.cards > 4')
    for i, c in enumerate(mc.get('cards') or []):
        if c.get('det') is not None:
            val_det('mencoes.cards[%d].det' % i, c['det'], 'card', e, w)
    if len(mc.get('trechos', [])) > 3:
        e.append('mencoes.trechos > 3')
    for i, x in enumerate(d.get('kpis') or []):
        s = x.get('serie') or []
        if s and not (3 <= len(s) <= 12 and all(isinstance(v, (int, float)) for v in s)):
            e.append('kpis[%d].serie deve ter 3-12 numeros' % i)
        if x.get('cls') not in CLS:
            e.append('kpis[%d].cls deve ser up, down ou flat' % i)
    fu = d.get('funil') or {}
    if fu.get('partes'):
        soma = sum(p.get('p', 0) for p in fu['partes'])
        if abs(soma - 100) > 1.5:
            w.append('funil.partes: percentuais somam %.1f (esperado ~100)' % soma)
    c = d.get('cenario')
    if c:
        for i, x in enumerate(c.get('serie') or []):
            if not (isinstance(x, list) and len(x) >= 2 and num(x[1])):
                e.append('cenario.serie[%d]: o valor (2o item) deve ser um numero' % i)
        b = c.get('base')
        if b is not None and not num(b) and not (isinstance(b, str) and len(b) <= 120):
            e.append('cenario.base deve ser numero ou texto curto (ate 120 caracteres)')
        elif isinstance(b, str) and len(b) > 80:
            w.append('cenario.base: texto com %d caracteres (>80)' % len(b))
        marc = c.get('marc') or {}
        if not isinstance(marc, dict):
            e.append('cenario.marc deve ser um objeto {rotulo: texto curto}')
        else:
            for k, v in marc.items():
                if not isinstance(v, str) or len(v) > 120:
                    e.append('cenario.marc[%r]: texto de ate 120 caracteres' % k)
                elif len(v) > 80:
                    w.append('cenario.marc[%r]: texto com %d caracteres (>80)' % (k, len(v)))
    lk = (d.get('atualiz') or {}).get('link')
    if lk and not str(lk.get('u', '')).startswith('https://'):
        e.append('atualiz.link.u deve ser https://')
    for i, ev in enumerate(d.get('eventos') or []):
        if not ev.get('d') or not ev.get('tag') or not ev.get('txt'):
            e.append('eventos[%d]: d, tag e txt sao obrigatorios' % i)
    for p, t in textos(d):
        if p.endswith('link.u'):
            continue
        if len(t) > 360 and not (p.endswith('resumo') or p.endswith('.cen')):
            w.append('%s: texto com %d caracteres (>360)' % (p, len(t)))
        if re.search(r'<(?!/?b>)', t):
            e.append('%s: HTML nao permitido (so <b>)' % p)
        if re.search(r'[\w.+-]+@[\w-]+\.[\w.]+', t):
            e.append('%s: possivel e-mail (PII)' % p)
        if re.search(r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b', t):
            e.append('%s: possivel CPF (PII)' % p)
        if re.search(r'\(?\b\d{2}\)?\s?9?\d{4}-\d{4}\b', t):
            e.append('%s: possivel telefone (PII)' % p)
        if re.search(r'\b\d{9,}\b', t):
            w.append('%s: sequencia longa de digitos (ID/conta?)' % p)
        if re.search(r'rascunho|nota de valida[cç][aã]o|validamos|reconfirmamos|conforme o rascunho|revis(ao|ão|ado) do time|(squad|time) comentou|skill (ausente|indispon)|modo degradado|integra[cç][aã]o de fallback|gateway', t, re.I):
            e.append('%s: menciona processo interno de validacao/ferramenta' % p)
        if re.search(r'prod\.|dim_|fat_|agg_|flg_|::', t):
            w.append('%s: possivel nome de tabela/tag interna' % p)
        if re.search(r'\b(causou|provocou|foi causad[oa])\b', t, re.I) and '[[' not in t:
            w.append('%s: afirma causalidade sem fonte [[...]]' % p)
        if re.search(r'Conversation with|autor=|Dashboard:', t):
            e.append('%s: trecho de transcricao bruta (remova linhas de sistema e nomes)' % p)
    return {'erros': e, 'avisos': w, 'bytes': n}


if __name__ == '__main__':
    falhou = False
    for f in sys.argv[1:]:
        r = validar(json.load(open(f, encoding='utf-8')))
        print(f, r['bytes'], 'B')
        for m in r['erros']:
            print('  ERRO ', m)
        for m in r['avisos']:
            print('  aviso', m)
        falhou = falhou or bool(r['erros'])
    sys.exit(1 if falhou else 0)
