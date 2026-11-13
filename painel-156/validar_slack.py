#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Valida os reports do Slack ANTES do envio (Fase 4C, v3.21).

Uso: python3 validar_slack.py --registro registro-painel.json --saida slack-saida [--canais slug1,slug2]
Um arquivo {slug}.json por canal:
  {"canal": "#x", "tipo": "produto|geral|executivo", "principal": "texto",
   "threads": [{"produto": "Pix", "chave": "pix", "texto": "...", "link_painel": false}]}   # canais de produto; link_painel=true so se o report do produto nao foi publicado
   "threads": [{"secao": "Resumo geral", "texto": "..."}, ...]            # geral e executivo
Sai com codigo 1 se houver erro."""
import argparse, json, os, re, sys
from urllib.parse import unquote

LIM_PRINCIPAL, LIM_THREAD = 3000, 3500
LINK = re.compile(r'<(https?://[^|>\s]+)\|([^>]+)>')
URL_CRUA = re.compile(r'https?://[^\s<>|]+')
EMOJI = re.compile(r'[\U0001F300-\U0001FAFF\u2600-\u27BF]')
CONTATOS = re.compile(r'\b\d[\d.]*\s+(contatos|tickets|atendimentos|chamados)\b', re.I)

def validar(reg, pasta, so=None):
    E, A = [], []
    base = reg['url_base']; l141 = reg['link_experiencia_recargapay']
    canais = reg['canais']
    if so: canais = [c for c in canais if c['slug'] in so]
    arquivos = {f[:-5] for f in os.listdir(pasta) if f.endswith('.json')}
    esperados = {c['slug'] for c in canais}
    for extra in sorted(arquivos - esperados - ({c['slug'] for c in reg['canais']} if so else set())):
        E.append(f'{extra}.json: canal que nao existe no registro (um report por canal, sem reports extras)')
    for c in canais:
        slug, tipo = c['slug'], c['tipo']
        f = os.path.join(pasta, slug + '.json')
        if not os.path.exists(f): E.append(f'{slug}: falta o report do canal {c["canal"]}'); continue
        try: d = json.load(open(f, encoding='utf-8'))
        except Exception as e: E.append(f'{slug}: JSON invalido ({e})'); continue
        if d.get('canal') != c['canal']: E.append(f'{slug}: "canal" deve ser {c["canal"]}')
        if d.get('tipo') != tipo: E.append(f'{slug}: "tipo" deve ser {tipo}')
        P = d.get('principal') or ''; T = d.get('threads') or []
        textos = [('principal', P)] + [(f'thread {i+1}', (t or {}).get('texto', '')) for i, t in enumerate(T)]
        # ---- estrutura
        if not P.startswith(':bar_chart: Report VoC — '): E.append(f'{slug}: o principal deve comecar com ":bar_chart: Report VoC — "')
        elif not re.match(r':bar_chart: Report VoC — .+ · Semana \d{2} · \d{2}/\d{2}–\d{2}/\d{2}/\d{4}', P.split('\n')[0]): E.append(f'{slug}: titulo fora do formato "{reg["regras_slack"]["formato_principal"]}"')
        if len(P.split('\n')) < 3: E.append(f'{slug}: o principal precisa de titulo, manchete e linha fina')
        elif not re.match(r'\*\*.+\*\*$', P.split('\n')[1].strip()): E.append(f'{slug}: a 2a linha do principal deve ser a manchete em **negrito**')
        if tipo == 'produto':
            esp = c['produtos']
            if len(T) != len(esp): E.append(f'{slug}: {len(T)} respostas na thread; o canal tem {len(esp)} produto(s), uma resposta por produto')
            for i, p in enumerate(esp):
                if i >= len(T): break
                t = T[i]; tx = t.get('texto', '')
                if t.get('chave') != p['chave'] or t.get('produto') != p['nome']: E.append(f'{slug}: resposta {i+1} deve ser de {p["nome"]} ({p["chave"]}), na ordem do registro')
                if not tx.startswith(f'**{p["nome"]}**'): E.append(f'{slug}: resposta {i+1} deve comecar com **{p["nome"]}**')
                if '**Resumo:**' not in tx: E.append(f'{slug}/{p["nome"]}: falta **Resumo:**')
                if '**Destaques da semana:**' not in tx and '**Menções:**' not in tx: A.append(f'{slug}/{p["nome"]}: sem destaques nem mencoes (confirme que nao houve)')
                ls = LINK.findall(tx)
                if len(ls) != 1: E.append(f'{slug}/{p["nome"]}: a resposta deve ter exatamente 1 link (o do report do produto); tem {len(ls)}')
                elif t.get('link_painel'):
                    if ls[0][0] != base: E.append(f'{slug}/{p["nome"]}: com link_painel o link deve ser o do painel geral {base}')
                elif unquote(ls[0][0]) != f'{base}&r={p["chave"]}/rep': E.append(f'{slug}/{p["nome"]}: link do report deve ser {base}&r={p["chave"]}/rep')
                elif not tx.rstrip().endswith('>'): E.append(f'{slug}/{p["nome"]}: a resposta termina com o link')
            ls = LINK.findall(P)
            if len(ls) > 1 or (ls and ls[0][0] != l141): E.append(f'{slug}: o principal so pode ter o link Experiência RecargaPay ({l141})')
            lista = ', '.join(p['nome'] for p in esp)
            if len(esp) > 1 and not all(p['nome'] in P for p in esp): E.append(f'{slug}: o principal deve citar os produtos do canal ({lista})')
        else:
            if [t.get('secao') for t in T] != c['threads']: E.append(f'{slug}: as respostas devem ser, nesta ordem: {c["threads"]}')
            todos = [(n, tx) for n, tx in textos]
            ls = [l for _, tx in todos for l in LINK.findall(tx)]
            if len(ls) != 1: E.append(f'{slug}: o report executivo/geral leva apenas 1 link, o do painel; encontrei {len(ls)}')
            elif ls[0][0] != base: E.append(f'{slug}: o unico link deve ser o do painel {base} (sem &r=, sem painel 141)')
            elif not LINK.findall(P): E.append(f'{slug}: o link do painel vai na mensagem principal')
            for n, tx in todos:
                if CONTATOS.search(tx): E.append(f'{slug}/{n}: texto executivo sem valores de contatos ou tickets (so variacoes): "{CONTATOS.search(tx).group(0)}"')
        # ---- regras gerais de texto
        for n, tx in textos:
            if not tx.strip(): E.append(f'{slug}/{n}: texto vazio'); continue
            lim = LIM_PRINCIPAL if n == 'principal' else LIM_THREAD
            if len(tx) > lim: E.append(f'{slug}/{n}: {len(tx)} caracteres (limite {lim})')
            if '&amp;' in tx: E.append(f'{slug}/{n}: use & simples, nunca &amp;')
            if re.search(r'\braf\b', tx, re.I): E.append(f'{slug}/{n}: o RAF saiu do pipeline: remova qualquer texto de RAF')
            if re.search(r'\bS\d{2}\b', tx): E.append(f'{slug}/{n}: use W46, nunca S46')
            if re.search(r'\bN[12]\b', tx): E.append(f'{slug}/{n}: use "Suporte humano", nunca N1/N2')
            if re.search(r'\b(a|da|na|à|pela|desta) RecargaPay\b', tx): E.append(f'{slug}/{n}: escreva "o RecargaPay" (masculino)')
            if re.search(r'(?<!\*)\*(?!\*)[^*\n]+\*(?!\*)', tx): E.append(f'{slug}/{n}: negrito com **dois asteriscos**; um asterisco vira italico')
            if re.search(r'sem men[cç][õo]es|nenhuma men[cç]ão|\bN/D\b|sem destaques', tx, re.I): E.append(f'{slug}/{n}: nao escreva "sem mencoes" nem placeholder: omita a secao')
            sem_link = LINK.sub('', tx)
            if URL_CRUA.search(sem_link): E.append(f'{slug}/{n}: link sem hiperlink; use <url|rotulo>')
            for l in LINK.findall(tx):
                if not l[0].startswith('https://optimus.recargapay.com/PHP/dashboard_view.php?id='): E.append(f'{slug}/{n}: link fora do painel: {l[0][:60]}')
            if EMOJI.search(tx): E.append(f'{slug}/{n}: sem emoji (so o :bar_chart: do titulo)')
            if n != 'principal' and ':bar_chart:' in tx: E.append(f'{slug}/{n}: o titulo so vai na mensagem principal')
    return E, A

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--registro', required=True); ap.add_argument('--saida', required=True); ap.add_argument('--canais')
    a = ap.parse_args()
    reg = json.load(open(a.registro, encoding='utf-8'))
    E, A = validar(reg, a.saida, set(a.canais.split(',')) if a.canais else None)
    for x in A: print('AVISO', x)
    for x in E: print('ERRO ', x)
    print('OK' if not E else f'{len(E)} erro(s)')
    sys.exit(1 if E else 0)

if __name__ == '__main__': main()
