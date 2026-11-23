/* ===== Painel 156 · Experiência do Produto · camada de dados =====
   1) Os INDICADORES vêm das queries do Arturito (window.__ARTURITO_DATA__.queries[...]).
   2) As ANÁLISES DE IA vêm dos blocos ocultos <div hidden data-px-ia="..."> do campo html,
      que a rotina semanal reescreve (só html e rationale_md). Nada de IA fica neste JS.
   3) Se as queries ainda não rodaram, usa o snapshot <div hidden data-px-db> (só na 1ª publicação). */
var PXCAT=[
 {id:'pix',name:'Pix',subs:[{id:'pix_in',name:'Pix In'},{id:'pix_wallet',name:'Pix Out Wallet'},{id:'pix_cc',name:'Pix Out CC'}]},
 {id:'cartao',name:'Cartão de crédito',subs:[{id:'cc_g',name:'Garantido'},{id:'cc_c',name:'Concedido'},{id:'cc_i',name:'Investimento'}]},
 {id:'emprestimo',name:'Empréstimo',subs:[{id:'emp_p',name:'Pessoal'},{id:'emp_c',name:'Consignado'}]},
 {id:'t2p',name:'Tap to Pay',subs:[]},{id:'link',name:'Link de Pagamento',subs:[]},{id:'conta',name:'Minha Conta',subs:[]},
 {id:'seguros',name:'Seguros',subs:[{id:'seg_ar',name:'Acidente e Renda'},{id:'seg_emp',name:'Empréstimo'},{id:'seg_pix',name:'Pix e Cartão'}]},{id:'cdb',name:'CDB e investimentos',subs:[]},{id:'transp',name:'Transporte',subs:[]},
 {id:'fraude',name:'Bloqueios e fraude',subs:[{id:'f_cart',name:'Carteira Desativada'},{id:'f_chb',name:'Chargeback Recovery'},{id:'f_conta',name:'Conta Desativada'}]},
 {id:'boletos',name:'Contas e Boletos',subs:[]},{id:'topup',name:'Top Up',subs:[]}];
var PXMETAS={nps:{meta:75,min:55,txt:'Meta 75 pts, mínimo 55'},csat:{meta:80,min:75,txt:'Meta 80%, piso 75%'},rel:{txt:'Sem meta definida'},sup:{txt:'Sem meta: quanto menor, melhor'},loja:{txt:'Sem meta definida'},ra:{txt:'Sem meta definida; quanto menor, melhor'},rede:{txt:'Sem meta definida'}};
var PXVMAP={'pix':'pix','cartao de credito do recargapay':'cartao','emprestimo':'emprestimo','tap to pay':'t2p','link de pagamento':'link','minha conta':'conta','seguros':'seguros','cdb':'cdb','transport':'transp','carteira desativada':'fraude','chargeback recovery':'fraude','conta desativada':'fraude','utilities':'boletos','topup':'topup'};
var PXVSUB={'emprestimo':['emprestimo','emp_p'],'emprestimo consignado':['emprestimo','emp_c'],'carteira desativada':['fraude','f_cart'],'chargeback recovery':['fraude','f_chb'],'conta desativada':['fraude','f_conta']};
var PXNPSSUB={cc_g:['cartao','cc_g'],cc_c:['cartao','cc_c'],cc_i:['cartao','cc_i'],'pix':['pix','pix_wallet'],'pixcc':['pix','pix_cc'],'emprestimo':['emprestimo','emp_p'],'consignado':['emprestimo','emp_c']};
var PXMES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
var PXMESN=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
var PXIAKEYS=['meta','resumos','destaques','vozes','lojasredes','ra','eventos','exemplos'];
function PXrows(n){ var q=(window.__ARTURITO_DATA__&&window.__ARTURITO_DATA__.queries)||{}; var r=q[n]; return Array.isArray(r)?r:[]; }
function PXnum(v){ if(v===null||v===undefined||v==='') return null; var n=Number(v); return isFinite(n)?n:null; }
function PXiso(v){ return String(v==null?'':v).slice(0,10); }
function PXdt(iso){ return new Date(iso+'T00:00:00Z'); }
function PXisoWeek(iso){ var d=PXdt(iso); d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7)); var y0=new Date(Date.UTC(d.getUTCFullYear(),0,1)); return Math.ceil((((d-y0)/86400000)+1)/7); }
function PXdm(iso){ return iso.slice(8,10)+'/'+iso.slice(5,7); }
function PXpct(a,b){ return b?Math.round(a*1000/b)/10:null; }
function PXadd(a,i,v){ if(v==null) return; a[i]=(a[i]==null?0:a[i])+v; }
function PXarr(n){ var a=[]; for(var i=0;i<n;i++) a.push(null); return a; }
function PXperiods(){
  var master=PXrows('Suporte Verticais'), S={dia:{},semana:{},mes:{}};
  master.forEach(function(r){ if(S[r.grao]) S[r.grao][PXiso(r.periodo)]=1; });
  var P={}, lastDia=Object.keys(S.dia).sort().pop()||'';
  P.dia={ini:Object.keys(S.dia).sort()}; P.semana={ini:Object.keys(S.semana).sort()}; P.mes={ini:Object.keys(S.mes).sort()};
  P.dia.lab=P.dia.ini.map(PXdm); P.dia.nome='dia'; P.dia.ant='dia anterior'; P.dia.nota='Últimos '+P.dia.ini.length+' dias; a pesquisa e o atendimento variam muito por dia da semana.';
  P.semana.lab=P.semana.ini.map(function(i){return 'W'+PXisoWeek(i);}); P.semana.sub=P.semana.ini.map(PXdm); P.semana.nome='semana'; P.semana.ant='semana anterior'; P.semana.nota='Últimas '+P.semana.ini.length+' semanas (segunda a domingo).';
  var lastMes=P.mes.ini[P.mes.ini.length-1]||'', parcial=false;
  if(lastMes&&lastDia){ var d=PXdt(lastDia), m=PXdt(lastMes), fim=new Date(Date.UTC(m.getUTCFullYear(),m.getUTCMonth()+1,0)).getUTCDate(); parcial=(d.getUTCFullYear()===m.getUTCFullYear()&&d.getUTCMonth()===m.getUTCMonth()&&d.getUTCDate()<fim); }
  P.mes.lab=P.mes.ini.map(function(i,k){ return PXMES[PXdt(i).getUTCMonth()]+((parcial&&k===P.mes.ini.length-1)?'*':''); });
  P.mes.nome='mês'; P.mes.ant='mês anterior'; P.mes.parcial=parcial;
  P.mes.nota='Últimos '+P.mes.ini.length+' meses'+(parcial?'; '+PXMESN[PXdt(lastMes).getUTCMonth()]+' parcial (até '+PXdm(lastDia)+'), por isso não entra na comparação.':'.');
  P.dadosAte=lastDia; return P;
}
function PXbuild(){
  var P=PXperiods(), N={dia:P.dia.ini.length,semana:P.semana.ini.length,mes:P.mes.ini.length}, X={};
  ['dia','semana','mes'].forEach(function(g){ X[g]={}; P[g].ini.forEach(function(p,i){ X[g][p]=i; }); });
  var DB={atualizado:P.dadosAte,periodos:{dia:P.dia,semana:P.semana,mes:P.mes},metas:PXMETAS,geral:{sup:{},nps:{},rel:{},loja:{},rede:{},ra:{}},produtos:{}};
  PXCAT.forEach(function(c){ DB.produtos[c.id]={sup:{},nps:{},loja:{},rede:{},ra:{},subs:{}}; });
  var emp=function(g){ return {n:PXarr(N[g]),pos:PXarr(N[g]),neg:PXarr(N[g])}; };
  ['semana','mes'].forEach(function(g){ DB.geral.loja[g]=emp(g); DB.geral.rede[g]=emp(g); });
  ['dia','semana','mes'].forEach(function(g){ DB.geral.ra[g]=PXarr(N[g]); }); DB.geral.ra.resol=PXarr(N.semana); DB.geral.ra.resp=PXarr(N.semana); DB.geral.ra.nota=PXarr(N.semana);
  /* suporte humano e CSAT por vertical */
  var raw={}, tot={dia:{h:PXarr(N.dia),cl:PXarr(N.dia),cx:PXarr(N.dia),nc:PXarr(N.dia)},semana:{h:PXarr(N.semana),cl:PXarr(N.semana),cx:PXarr(N.semana),nc:PXarr(N.semana)},mes:{h:PXarr(N.mes),cl:PXarr(N.mes),cx:PXarr(N.mes),nc:PXarr(N.mes)}};
  PXrows('Suporte Verticais').forEach(function(r){
    var g=r.grao, i=X[g]&&X[g][PXiso(r.periodo)]; if(i==null) return; var v=String(r.vertical||'').toLowerCase(), h=PXnum(r.h), b=PXnum(r.bot), cl=PXnum(r.cl), cx=PXnum(r.cx);
    PXadd(tot[g].h,i,h); PXadd(tot[g].cl,i,cl); PXadd(tot[g].cx,i,cx); if(v.indexOf('caso em aberto')===0) PXadd(tot[g].nc,i,h);
    var tg=[]; if(PXVMAP[v]) tg.push([PXVMAP[v],null]); if(PXVSUB[v]) tg.push([PXVSUB[v][0],PXVSUB[v][1]]);
    tg.forEach(function(t){ var key=t[0]+'|'+(t[1]||''); var o=raw[key]=raw[key]||{p:t[0],s:t[1],d:{}}; var a=o.d[g]=o.d[g]||{h:PXarr(N[g]),bot:PXarr(N[g]),cl:PXarr(N[g]),cx:PXarr(N[g])}; PXadd(a.h,i,h); PXadd(a.bot,i,b); PXadd(a.cl,i,cl); PXadd(a.cx,i,cx); });
  });
  /* cartao por tipo (credit_type da conta): suporte humano e bot */
  PXrows('Cartão Tipos').forEach(function(r){ var g=r.grao, i=X[g]&&X[g][PXiso(r.periodo)], sb=String(r.sub); if(i==null||['cc_g','cc_c','cc_i'].indexOf(sb)<0) return;
    var o=raw['cartao|'+sb]=raw['cartao|'+sb]||{p:'cartao',s:sb,d:{}}; var a=o.d[g]=o.d[g]||{h:PXarr(N[g]),bot:PXarr(N[g]),cl:PXarr(N[g]),cx:PXarr(N[g])}; PXadd(a.h,i,PXnum(r.h)); PXadd(a.bot,i,PXnum(r.bot)); });
  /* seguros por subproduto (Hub de Seguros, prestamista e verticais do Zendesk) */
  var SG={};
  PXrows('Seguros Subprodutos').forEach(function(r){ var g=r.grao, i=X[g]&&X[g][PXiso(r.periodo)], sb=String(r.sub); if(i==null||['seg_ar','seg_emp','seg_pix'].indexOf(sb)<0) return;
    var o=raw['seguros|'+sb]=raw['seguros|'+sb]||{p:'seguros',s:sb,d:{}}; var q=o.d[g]=o.d[g]||{h:PXarr(N[g]),bot:PXarr(N[g]),cl:PXarr(N[g]),cx:PXarr(N[g])}; PXadd(q.h,i,PXnum(r.h));
    var z=(SG[sb]=SG[sb]||{})[g]=(SG[sb][g]||{novas:PXarr(N[g]),canc:PXarr(N[g]),arrep:PXarr(N[g]),contatos:PXarr(N[g]),contesta:PXarr(N[g]),cn:PXarr(N[g]),cd:PXarr(N[g])});
    ['novas','canc','arrep','contatos','contesta'].forEach(function(k){ PXadd(z[k],i,PXnum(r[k])); }); PXadd(z.cn,i,PXnum(r.conv_n)); PXadd(z.cd,i,PXnum(r.conv_d)); });
  function supOf(d){ var o={}; Object.keys(d).forEach(function(g){ var a=d[g]; o[g]={h:a.h,bot:a.bot,csat:a.cl.map(function(c,k){ return PXpct(c||0,(c||0)+(a.cx[k]||0)); }),csatN:a.cl.map(function(c,k){ var t=(c||0)+(a.cx[k]||0); return t||null; })}; }); return o; }
  Object.keys(raw).forEach(function(k){ var o=raw[k], s=supOf(o.d), p=DB.produtos[o.p]; if(!p) return; if(o.s){ (p.subs[o.s]=p.subs[o.s]||{}).sup=s; if(o.s==='emp_p'){ p.sup=s; } } else if(o.p!=='emprestimo'){ p.sup=s; } });
  ['dia','semana','mes'].forEach(function(g){ var t=tot[g]; DB.geral.sup[g]={h:t.h,csat:t.cl.map(function(c,k){return PXpct(c||0,(c||0)+(t.cx[k]||0));}),csatN:t.cl.map(function(c,k){var s=(c||0)+(t.cx[k]||0);return s||null;}),naocl:t.nc.map(function(x){return x||0;})}; });
  /* NPS */
  var nps={};
  PXrows('NPS Produtos').concat(PXrows('Cartão Tipos').filter(function(r){ return PXnum(r.n)>0&&['cc_g','cc_c','cc_i'].indexOf(String(r.sub))>=0; }).map(function(r){ return {grao:r.grao,periodo:r.periodo,chave:r.sub,n:r.n,prom:r.prom,det:r.det}; })).forEach(function(r){ var g=r.grao, i=X[g]&&X[g][PXiso(r.periodo)]; if(i==null) return; var k=String(r.chave), o=nps[k]=nps[k]||{}; var a=o[g]=o[g]||{v:PXarr(N[g]),n:PXarr(N[g])}; var n=PXnum(r.n), pr=PXnum(r.prom)||0, dt=PXnum(r.det)||0; a.n[i]=n; a.v[i]=n?Math.round((pr-dt)*100/n):null; });
  DB.geral.nps=nps.geral||{}; DB.geral.rel=nps.rel||{};
  PXCAT.forEach(function(c){ if(nps[c.id]&&c.id!=='pix'&&c.id!=='emprestimo') DB.produtos[c.id].nps=nps[c.id]; });
  if(nps.pix) DB.produtos.pix.nps=nps.pix; if(nps.emprestimo) DB.produtos.emprestimo.nps=nps.emprestimo;
  Object.keys(PXNPSSUB).forEach(function(k){ if(nps[k]){ var t=PXNPSSUB[k], p=DB.produtos[t[0]]; (p.subs[t[1]]=p.subs[t[1]]||{}).nps=nps[k]; } });
  /* lojas e redes (semana e mês) */
  PXrows('Lojas Redes Produtos').forEach(function(r){ var g=r.grao, i=X[g]&&X[g][PXiso(r.periodo)]; if(i==null) return; var dst=(r.src==='loja')?'loja':'rede', k=String(r.produto), n=PXnum(r.n);
    var holder=(k==='geral')?DB.geral:(DB.produtos[k]); if(!holder) return; var o=holder[dst][g]=holder[dst][g]||{n:PXarr(N[g]),pos:PXarr(N[g]),neg:PXarr(N[g])};
    o.n[i]=n; o.pos[i]=PXpct(PXnum(r.pos)||0,n); o.neg[i]=PXpct(PXnum(r.neg)||0,n); });
  /* Reclame Aqui (HugMe) */
  var ra={tot:{}};
  PXrows('Reclame Aqui HugMe').forEach(function(r){ var g=r.grao, i=X[g]&&X[g][PXiso(r.periodo)]; if(i==null) return; var k=String(r.produto), n=PXnum(r.n);
    if(k==='total'){ var o=ra.tot[g]=ra.tot[g]||{n:PXarr(N[g]),res:PXarr(N[g]),rsp:PXarr(N[g]),ns:PXarr(N[g]),nn:PXarr(N[g])}; o.n[i]=n; o.res[i]=PXnum(r.resolvidas); o.rsp[i]=PXnum(r.respondidas); o.ns[i]=PXnum(r.nota_soma); o.nn[i]=PXnum(r.nota_n); }
    else if(DB.produtos[k]){ var a=DB.produtos[k].ra[g]=DB.produtos[k].ra[g]||PXarr(N[g]); a[i]=n; } });
  ['dia','semana','mes'].forEach(function(g){ var o=ra.tot[g]; if(o) DB.geral.ra[g]=o.n; });
  var ts=ra.tot.semana; if(ts){ DB.geral.ra.resol=ts.n.map(function(n,k){return PXpct(ts.res[k]||0,n);}); DB.geral.ra.resp=ts.n.map(function(n,k){return PXpct(ts.rsp[k]||0,n);}); DB.geral.ra.nota=ts.ns.map(function(s,k){ return ts.nn[k]?Math.round(s*10/ts.nn[k])/10:null; }); }
  /* notas dos subprodutos sem série própria */
  var pc=DB.produtos.pix.subs; (pc.pix_in=pc.pix_in||{}).nota='Sem série própria: o suporte humano de Pix é medido no produto. Sem NPS próprio.';
  (pc.pix_wallet=pc.pix_wallet||{}).nota='Suporte humano medido no produto Pix (inclui Pix Out CC, sem vertical própria).'; (pc.pix_cc=pc.pix_cc||{}).nota='Sem vertical própria de suporte; leitura pelo NPS Transacional.';
  Object.keys(SG).forEach(function(sb){ var P=DB.produtos.seguros; P.subs=P.subs||{}; var t=P.subs[sb]=P.subs[sb]||{}, ex=[];
    var mk=function(l,k,kind,worse){ var s={}; Object.keys(SG[sb]).forEach(function(g){ s[g]=SG[sb][g][k]; }); ex.push({l:l,s:s,kind:kind,worse:worse}); };
    mk(sb==='seg_emp'?'Empréstimos com seguro (apólices)':'Apólices novas','novas','rel','x'); mk('Cancelamentos pedidos pelo cliente','canc','rel','up'); mk('Cancelamentos no prazo de arrependimento','arrep','rel','up');
    if(sb==='seg_emp'){ var s={}; Object.keys(SG[sb]).forEach(function(g){ var z=SG[sb][g]; s[g]=z.cn.map(function(n,i){ var d=z.cd[i]; return d?Math.round(n*1000/d)/10:null; }); }); ex.push({l:'Empréstimos elegíveis com seguro',s:s,kind:'pp',worse:'down',pct:true}); }
    else { mk('Contatos sobre o seguro (classificados por modelo)','contatos','rel','up'); mk('Contatos que contestam a contratação','contesta','rel','up'); }
    t.extra=ex; t.nota=(sb==='seg_emp'?'Seguro prestamista do empréstimo (prod.lending.snap_loan_insurance e agg_daily_loan_insurance); suporte humano pelos motivos de seguro da vertical Empréstimo; cancelamentos sem os de quitação antecipada.':'Apólices do Hub de Seguros (prod.checkout.dim_insurance_policy_lifecycle) e contatos de segurados classificados por modelo (prod.checkout.fat_insurance_cx_contact); suporte humano pela vertical do Zendesk.')+' Sem NPS nem CSAT por subproduto.'; });
  ['cc_g','cc_c','cc_i'].forEach(function(k){ (DB.produtos.cartao.subs[k]=DB.produtos.cartao.subs[k]||{}).nota='Tipo do cartão pelo cadastro da conta (Garantido, Concedido ou Investimento). Suporte humano e NPS Transacional por tipo; o CSAT não tem corte por tipo de cartão.'; });
  (DB.produtos.emprestimo.subs.emp_c=DB.produtos.emprestimo.subs.emp_c||{}).nota='Base pequena: leitura direcional.';
  return DB;
}
function PXjson(el){ try{ return JSON.parse(el.textContent); }catch(e){ return undefined; } }
function PXresolve(o,pool){
  if(Array.isArray(o)){ if(o.length&&o.every(function(x){ return typeof x==='string'&&/^e[0-9a-z]{1,4}$/.test(x); })) return o.map(function(i){ return pool[i]; }).filter(Boolean); return o.map(function(x){ return PXresolve(x,pool); }); }
  if(o&&typeof o==='object'){ Object.keys(o).forEach(function(k){ o[k]=PXresolve(o[k],pool); }); }
  return o;
}
function PXia(){
  var out={}, bad=[], prod={};
  [].forEach.call(document.querySelectorAll('[data-px-ia]'),function(el){ var k=el.getAttribute('data-px-ia'), j=PXjson(el); if(j===undefined){ bad.push(k); return; } if(k.indexOf('produto:')===0) prod[k.slice(8)]=j; else out[k]=j; });
  var m=out.meta||{}, miss=PXIAKEYS.filter(function(k){return !out[k]&&bad.indexOf(k)<0;});
  var IA={semana:m.semana||null,pulso:m.pulso||'',atencao:m.atencao||[],resumos:out.resumos||{},destaques:out.destaques||{novos:[],oport:[],agir:[]},vozes:out.vozes||{reclamam:[],pedem:[],elogiam:[]},lojasredes:out.lojasredes||{},ra:out.ra||{texto:'',temas:[]},eventos:Array.isArray(out.eventos)?out.eventos:(out.eventos&&out.eventos.itens)||[],produtos:prod};
  ['novos','oport','agir'].forEach(function(k){ IA.destaques[k]=IA.destaques[k]||[]; }); ['reclamam','pedem','elogiam'].forEach(function(k){ IA.vozes[k]=IA.vozes[k]||[]; }); IA.ra.temas=IA.ra.temas||[];
  IA=PXresolve(IA,out.exemplos||{});
  var faltam=PXCAT.filter(function(c){return !prod[c.id]&&bad.indexOf('produto:'+c.id)<0;}).map(function(c){return 'produto:'+c.id;});
  var NM={exemplos:'exemplos de clientes',meta:'resumo da semana',resumos:'textos de análise',destaques:'destaques',vozes:'o que os clientes dizem',lojasredes:'lojas e redes',ra:'Reclame Aqui',eventos:'movimentos da empresa'};
  PXCAT.forEach(function(c){ NM['produto:'+c.id]=c.name; });
  var nome=function(k){ return NM[k]||k; };
  return {IA:IA,bad:bad.map(nome),miss:miss.concat(faltam).map(nome)};
}
function PXLOAD(){
  var DB=PXbuild(), usouSnap=false, semDados=false, hasRows=PXrows('Suporte Verticais').length>0;
  if(!hasRows){ var snapEl=document.querySelector('[data-px-db]'), snap=snapEl?PXjson(snapEl):undefined; if(snap&&snap.periodos){ DB=snap; usouSnap=true; } else semDados=true; }
  var r=PXia(), IA=r.IA, wl=DB.periodos.semana.lab||[], dw=wl[wl.length-1]||'';
  if(!IA.semana||!IA.semana.w){ IA.semana={w:dw||'—',ini:(DB.periodos.semana.sub||[])[(wl.length||1)-1]||'',fim:'',pub:'',modelo:''}; }
  return {db:DB,ia:IA,catalogo:PXCAT,status:{usouSnapshot:usouSnap,semDados:semDados,iaFaltando:r.miss,iaInvalidos:r.bad,semanaDados:dw,dadosAte:DB.atualizado||''}};
}


var D=PXLOAD();
(function(){
var $=function(s){return document.querySelector(s);};
var EMO=[[/(Pix Out CC|Pix Out Wallet|Pix Out|Pix In|Pix)(?![\wÀ-ú])/g,'💸'],[/(Cartão de crédito|Cartão Empreendedor|Cartão)(?![\wÀ-ú])/g,'💳'],[/(Empréstimo|Consignado)(?![\wÀ-ú])/g,'🤝'],[/(Tap to Pay)/g,'📲'],[/(Link de Pagamento)/g,'🔗'],[/(Minha Conta)/g,'👤'],[/(Seguros|Seguro Acidente e Renda)(?![\wÀ-ú])/g,'🛡️'],[/(CDB)(?![\wÀ-ú])/g,'📈'],[/(Transporte)(?![\wÀ-ú])/g,'🚌'],[/(Bloqueios e fraude|Carteira Desativada|Chargeback Recovery|Conta Desativada|Bloqueios)(?![\wÀ-ú])/g,'🔒'],[/(Contas e Boletos)/g,'🧾'],[/(Top Up)(?![\wÀ-ú])/g,'📱']];
function emo(t){ EMO.forEach(function(e){ t=t.replace(e[0],function(m,p,off,str){ var pre=str.slice(Math.max(0,off-3),off); if(/[A-Za-zÀ-ú0-9_]$/.test(pre)) return m; if(/[\uD800-\uDFFF\u2600-\u27BF\uFE0F]\s?$/.test(pre)) return m; return e[1]+' '+m; }); }); return t; }
function esc(s){return emo(String(s==null?'':s)).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function fN(v,d){ if(v==null||!isFinite(v)) return '—'; return Number(v).toLocaleString('pt-BR',{minimumFractionDigits:d||0,maximumFractionDigits:d||0}); }
function mean(a){ a=(a||[]).filter(function(x){return x!=null&&isFinite(x);}); return a.length?a.reduce(function(s,x){return s+x;},0)/a.length:null; }
function sents(t){ return String(t||'').replace(/([.!?])\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ"“])/g,'$1\u0001').split('\u0001').map(function(x){return x.trim();}).filter(Boolean); }
var DB=D.db, IA=D.ia, CAT=D.catalogo, per='semana';
function wL(){ var l=DB.periodos.semana.lab; return l[l.length-1]||''; } function wP(){ var l=DB.periodos.semana.lab; return l[l.length-2]||''; } function wF(){ return DB.periodos.semana.lab[0]||''; }
var ART={dia:{d:'do dia',um:'um dia',ult:'do último dia'},semana:{d:'da semana',um:'uma semana',ult:'da semana atual'},mes:{d:'do mês',um:'um mês',ult:'do último mês fechado'}};
function P(){ return DB.periodos[per]; }
function cat(id){ for(var i=0;i<CAT.length;i++) if(CAT[i].id===id) return CAT[i]; return null; }
function dbp(id){ return DB.produtos[id]||{}; }
/* indice do periodo atual e do anterior: no mes, novembro e parcial e fica de fora da comparacao */
function idx(a){ var n=(a||[]).length; if(per==='mes'&&DB.periodos.mes.parcial) return [n-2,n-3]; return [n-1,n-2]; }
function cmp(a,kind){ /* kind: 'rel' variacao %, 'pts', 'pp' */
  var ix=idx(a), c=a?a[ix[0]]:null, p=a?a[ix[1]]:null;
  if(c==null||p==null) return {c:c,p:p,d:null,txt:'sem comparação'};
  var d=kind==='rel'?(p?(c-p)*100/p:null):c-p;
  if(d==null) return {c:c,p:p,d:null,txt:'sem comparação'};
  var u=kind==='rel'?'%':(kind==='pp'?' pp':' pts'), dec=kind==='rel'?0:1;
  return {c:c,p:p,d:d,txt:(Math.abs(d)<0.05?'= ':(d>0?'▲ ':'▼ '))+fN(Math.abs(d),dec)+u};
}
function cls(d,worse){ if(worse==='x'||d==null||Math.abs(d)<0.05) return 'eq'; return (worse==='up'?d>0:d<0)?'up':'dn'; }

/* -------- topo e pulso -------- */
var S=IA.semana;
$('#wk').innerHTML='<b>'+esc(S.w)+'</b>'+esc(S.ini)+'–'+esc(S.fim);
$('#when').innerHTML='Semana '+esc(S.w)+' ('+esc(S.ini)+' a '+esc(S.fim)+'), publicada em '+esc(S.pub)+' <span class="src ia">Análise IA</span>';
var ss=sents(IA.pulso); $('#headline').textContent=ss[0]||''; $('#lead').textContent=ss.slice(1).join(' ');

/* -------- exemplos e tendencias -------- */
function exHtml(L,cls){ return (L||[]).map(function(q){ return '<div class="ex '+(cls||'')+'">“'+esc(q.t)+'”<span>'+esc(q.m||'')+'</span></div>'; }).join(''); }
function serTrend(sr){ if(!sr||!sr.v) return ''; var a=sr.v, c=a[a.length-1], p=a[a.length-2]; if(c==null||p==null) return ''; var d=sr.u==='pts'?c-p:(p?(c-p)*100/p:null); if(d==null) return ''; if(sr.u!=='pts'&&p<20&&c>=p*3) return '<span class="trend">de '+fN(p)+' para '+fN(c)+' na semana</span>'; return '<span class="trend">'+(d>0?'▲ ':(d<0?'▼ ':''))+fN(Math.abs(d),0)+(sr.u==='pts'?' pts':'%')+' na semana</span>'; }
function IAsum(key,auto){ var t=(IA.resumos||{})[key]; return (t?'<p><span class="lbl">Análise da '+esc(IA.semana.w)+'</span>'+esc(t)+'</p>':'')+(auto?'<p class="qt"><span class="lbl">Variação no período selecionado ('+esc(P().nome)+')</span>'+auto+'</p>':''); }
function openTema(it,cap){
  st={p:null,sub:null,tab:null,ev:null}; var P=nwProds(it), G=NWG[it._g]||{k:cap||'',tone:'info'}, sub=it.x||it.d||'';
  $('#ptitle').textContent=it.t; $('#psubs').innerHTML=''; $('#ptabs').innerHTML='';
  var b='<div class="nw-img nw-hero tone-'+G.tone+'">'+nwPh(it)+'<span class="nw-fig">'+(it.m?'<span class="nw-m">'+esc(it.m)+'</span>':'')+'<span class="nw-kick tone-'+G.tone+'">'+esc(G.k)+'</span></span></div>';
  b+='<div class="box"><span class="src ia">Análise IA</span> '+P.map(function(p){ return '<button type="button" class="ptag" data-goto="'+p.id+'">'+esc(p.name)+'</button> '; }).join('')+(sub?'<p class="nw-sub">'+esc(sub)+'</p>':'')+(it.sl?stHtml(it):'')+'</div>';
  if(it.det) b+='<h4>Análise</h4><div class="box"><ul class="b">'+sents(it.det).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  [it.serie,it.serie2].forEach(function(sr){ if(!sr) return; var lab=DB.periodos.semana.lab; b+='<h4>'+esc(sr.l)+' <span class="src db">Databricks</span></h4><div class="box chart">'+serTrend(sr)+chart(sr.v,lab,{type:sr.u==='pts'?'line':'bar',fmt:function(v){return fN(v);},h:180,alt:sr.l})+'<p class="foot">Últimas '+lab.length+' semanas ('+lab[0]+' a '+lab[lab.length-1]+').</p></div>'; });
  if(it.ex&&it.ex.length) b+='<h4>Exemplos da semana</h4><div class="box">'+exHtml(it.ex)+'</div>';
  if(P.length) b+='<p style="margin:14px 0 0">'+P.map(function(p){ return '<button type="button" class="more" style="padding:0" data-goto="'+p.id+'">Abrir '+esc(p.name)+' ›</button>'; }).join(' &nbsp;·&nbsp; ')+'</p>';
  $('#pbody').innerHTML=b; $('#pbody').scrollTop=0; nwFix($('#pbody')); openPanel();
}

var TEMAS={};
/* -------- destaques -------- */
function stCls(l){ l=String(l||''); if(/^(Resolvido|Estável)/i.test(l)) return 'ok'; if(/andamento|acompanhamento|apuração|Parcial/i.test(l)) return 'go'; if(/^Não resolvido/i.test(l)) return 'no'; return 'mid'; }
function stHtml(x){ return x.sl?'<div class="a"><span class="stt '+stCls(x.sl)+'">'+esc(x.sl)+'</span>'+esc(x.s||'')+'</div>':''; }
$('#dsum').innerHTML=IAsum('destaques');
$('#vsum').innerHTML=IAsum('vozes');
$('#msum').innerHTML=IAsum('movimentos');
function raw(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

/* -------- destaques no formato de portal de noticias -------- */
var NWG={agir:{k:'Atenção imediata',tone:'bad'},novos:{k:'Tema novo',tone:'info'},oport:{k:'Oportunidade',tone:'good'},vreclamam:{k:'Reclamam',tone:'bad'},vpedem:{k:'Pedem',tone:'warn'},velogiam:{k:'Elogiam',tone:'good'},ra:{k:'Reclame Aqui',tone:'warn'}};
var NWIMG={"_": "https://lh3.googleusercontent.com/d/1IHaWUCXxrBrtsxgcBlxTh5JaSoGbOMMs=w400", "pix": "https://lh3.googleusercontent.com/d/1LbV6FWjIDl06HSLiGWgTx_oczTbVOr39=w400", "cartao": "https://lh3.googleusercontent.com/d/1G9fI1L4EvwIVDgHTJSDeq-o_rf70eFQd=w400", "emprestimo": "https://lh3.googleusercontent.com/d/1d07zoUjKi3hOieTLWr5O1z8c9IY02Pjh=w400", "t2p": "https://lh3.googleusercontent.com/d/1PxAFlj6fbSoZSzzMmjd1xIzIYhoO3AxA=w400", "link": "https://lh3.googleusercontent.com/d/1coBm8idviYCCIZLG7IFJ1D5T7MfL0omP=w400", "conta": "https://lh3.googleusercontent.com/d/1PiVbmBTFM1AreGRzBT_vKiV5Tw1HSDDS=w400", "seguros": "https://lh3.googleusercontent.com/d/1YAh50j2jrGFmpOc033oHpKAbtB6biDKu=w400", "cdb": "https://lh3.googleusercontent.com/d/1FaWpztB4nKO6EQkegcTUCwPwPIL10EyN=w400", "transp": "https://lh3.googleusercontent.com/d/1IE8ZGjG0ajqNglRXvokaMvLvKnbceVEs=w400", "fraude": "https://lh3.googleusercontent.com/d/17gN8pInhyH3YPvOGwFAfm993U1mxXG63=w400", "boletos": "https://lh3.googleusercontent.com/d/1yXTaRiMbjXzEWGWFyTaeDAW5rkmZgrXp=w400", "topup": "https://lh3.googleusercontent.com/d/1LU1E91gcAthQ3K4Irt5BEDTf-aZgTwr_=w400"};
var NWEMO={pix:'💸',cartao:'💳',emprestimo:'🤝',t2p:'📲',link:'🔗',conta:'👤',seguros:'🛡️',cdb:'📈',transp:'🚌',fraude:'🔒',boletos:'🧾',topup:'📱'};
function nwImgOk(u){ if(typeof u!=='string') return null; u=u.trim(); if(/^[A-Za-z0-9_-]{25,}$/.test(u)) return 'https://lh3.googleusercontent.com/d/'+u+'=w400'; var m=u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|thumbnail\?id=|uc\?(?:export=view&)?id=)([A-Za-z0-9_-]{25,})/); if(m) return 'https://lh3.googleusercontent.com/d/'+m[1]+'=w400'; if(/^https:\/\/(lh3\.googleusercontent\.com|cnt\.recarga\.com)\//.test(u)) return u; return null; }
function nwUrl(it){ var u=nwImgOk(it&&it.img); if(u) return u; var mi=(IA.meta&&IA.meta.imagens)||{}, p=it&&it.p; return (p&&nwImgOk(mi[p]))||(p&&NWIMG[p])||nwImgOk(mi._)||NWIMG._; }
function nwPh(it){ return '<span class="nw-ph" data-e="'+((it&&it.p&&NWEMO[it.p])||'📌')+'"><img src="'+nwUrl(it)+'" alt="" loading="lazy"></span>'; }
function nwFix(root){ [].forEach.call((root||document).querySelectorAll('.nw-ph img,.nw-th img'),function(im){ var fail=function(){ var m=(im.getAttribute('src')||'').match(/lh3\.googleusercontent\.com\/d\/([A-Za-z0-9_-]+)/); if(m&&!im.getAttribute('data-alt')){ im.setAttribute('data-alt','1'); im.src='https://drive.google.com/thumbnail?id='+m[1]+'&sz=w400'; return; } var ph=im.parentNode; if(ph) ph.innerHTML='<span class="nw-em">'+(ph.getAttribute('data-e')||'📌')+'</span>'; }; im.addEventListener('error',fail); if(im.complete&&im.naturalWidth===0) fail(); }); }

var NW_MAIN=5;
function nwEm(x){ return (x&&x.p&&NWEMO[x.p])||'📌'; }
function nwScore(o){ var x=o.x, g={agir:0,novos:1,oport:2}[o.g], sc={'Não resolvido':0,'Sem solução registrada':1,'Sem registro':2,'Em acompanhamento':3,'Parcialmente resolvido':4,'Em andamento':5,'Em apuração':5,'Estável':8,'Resolvido':9}[x.sl];
  return (typeof x.rank==='number'&&isFinite(x.rank))?x.rank:100+g*20+(sc==null?5:sc)*2+o.i/100; }
function nwList(){ var L=[]; ['agir','novos','oport'].forEach(function(g){ (IA.destaques[g]||[]).forEach(function(x,i){ L.push({g:g,i:i,x:x}); }); }); L.sort(function(a,b){ return nwScore(a)-nwScore(b); }); return L; }
function nwProds(x){ var ids=[x&&x.p].concat((x&&x.ps)||[]), o=[]; ids.forEach(function(i){ if(i&&NWEMO[i]&&o.indexOf(i)<0) o.push(i); }); return o.map(function(i){ return cat(i); }).filter(Boolean); }
function nwAbre(x){ return !!(x.det||x.ex||x.serie||x.s); }
function nwCard(o,lead){
  var x=o.x, G=NWG[o.g], P=nwProds(x), abre=nwAbre(x);
  var fig=(x.m?'<span class="nw-m">'+esc(x.m)+'</span>':'')+(x.serie?'<span class="nw-chart">'+chart(x.serie.v,DB.periodos.semana.lab,{type:x.serie.u==='pts'?'line':'bar',fmt:function(v){return fN(v);},w:lead?460:300,h:lead?84:86,alt:x.serie.l})+'</span>':'');
  return '<div class="nw'+(lead?' lead':'')+'"'+(abre?' data-tema="'+o.g+'|'+o.i+'" role="button" tabindex="0" aria-label="Abrir análise: '+raw(x.t)+'"':'')+'><span class="nw-img tone-'+G.tone+'">'+nwPh(x)+'<span class="nw-fig">'+fig+'</span></span><span class="nw-tx"><span class="nw-kick tone-'+G.tone+'">'+esc(G.k)+(P.length?' · '+P.map(function(p){ return '<span class="nw-prod" data-open="'+p.id+'">'+esc(p.name)+'</span>'; }).join(' + '):'')+'</span><h3>'+esc(x.t)+'</h3><p>'+esc(x.x)+'</p>'+(x.sl?'<span class="nw-st"><span class="stt '+stCls(x.sl)+'">'+esc(x.sl)+'</span></span>':'')+(abre?'<span class="nw-more">Abrir análise completa ›</span>':'')+'</span></div>';
}
function nwRow(o,pos){
  var x=o.x, G=NWG[o.g], abre=nwAbre(x), P=nwProds(x);
  return '<div class="nw-li"'+(abre?' data-tema="'+o.g+'|'+o.i+'" role="button" tabindex="0" aria-label="Abrir análise: '+raw(x.t)+'"':'')+'><span class="nw-n tone-'+G.tone+'">'+pos+'</span><span class="nw-th tone-'+G.tone+'" data-e="'+nwEm(x)+'"><img src="'+nwUrl(x)+'" alt="" loading="lazy"></span><span class="nw-lt"><b>'+esc(x.t)+'</b><span class="nw-ls"><span class="nw-kick tone-'+G.tone+'">'+esc(G.k)+'</span>'+(P.length?' · '+P.map(function(p){ return esc(p.name); }).join(' + '):'')+(x.m?' · '+esc(x.m):'')+'</span></span></div>';
}
function drawDest(){
  var L=nwList();
  if(!L.length){ $('#dest').innerHTML='<div class="note">Os destaques da semana ainda não foram publicados.</div>'; return; }
  var main=L.slice(0,NW_MAIN), rest=L.slice(NW_MAIN);
  $('#dest').innerHTML='<div class="nw-main"><h3 class="nw-h">Principais da semana <small>maior impacto e urgência</small></h3><div class="nw-grid">'+main.map(function(o,k){ return nwCard(o,k===0); }).join('')+'</div></div>'+
    (rest.length?'<aside class="nw-hot"><h3 class="nw-h">Temas em alta</h3><p class="nw-hs">De menor impacto ou urgência, mas importantes de acompanhar.</p><div class="nw-list">'+rest.map(function(o,k){ return nwRow(o,k+1); }).join('')+'</div></aside>':'');
  nwFix($('#dest'));
}
drawDest();
/* -------- historico de semanas: bloco compactado (gzip + base64) lido sob demanda, sem peso no codigo -------- */
var NWH=null, NWHW=null, NWH0=null;
function IAcur(){ return NWH0||IA.destaques; }
function nwhEv(h){ var L=h.eventos||[]; if(!L.length) return '<div class="nw-hev"><h3 class="nw-h">Movimentos da semana</h3><p class="sub">Nenhum movimento da empresa foi registrado nessa semana.</p></div>';
  return '<div class="nw-hev"><h3 class="nw-h">Movimentos da semana <small>'+L.length+(L.length===1?' registro':' registros')+'</small></h3><ul>'+L.map(function(e){ return '<li><b>'+esc(e.d)+'</b> <span class="nw-hevt">'+esc(e.tipo||'')+'</span> '+esc(e.t)+(e.res?'<span>'+esc(e.res)+'</span>':'')+'</li>'; }).join('')+'</ul></div>'; }
function nwhBar(){
  var host=$('#dest'); if(!host||!NWH||!NWH.length) return;
  var bar=$('#dwk'); if(!bar){ bar=document.createElement('div'); bar.id='dwk'; bar.className='nw-hbar'; host.parentNode.insertBefore(bar,host); }
  var cur=(IA.semana&&IA.semana.w)||'Atual';
  bar.innerHTML='<b>Semana</b>'+NWH.slice().reverse().map(function(h){ return '<button type="button" data-hw="'+esc(h.semana.w)+'" aria-pressed="'+(NWHW&&NWHW.semana.w===h.semana.w?'true':'false')+'">'+esc(h.semana.w)+'</button>'; }).join('')+'<button type="button" data-hw="" aria-pressed="'+(NWHW?'false':'true')+'">'+esc(cur)+' (atual)</button>'+(NWHW?'<span class="nw-hnote">Análise arquivada de '+esc(NWHW.semana.ini)+' a '+esc(NWHW.semana.fim)+'. Os indicadores do painel seguem a semana atual.</span>':'');
  var ev=$('#dhev'); if(!ev){ ev=document.createElement('div'); ev.id='dhev'; host.parentNode.insertBefore(ev,host.nextSibling); }
  ev.innerHTML=NWHW?nwhEv(NWHW):'';
}
function nwhSel(w){
  if(!w){ if(NWH0){ IA.destaques=NWH0; NWH0=null; } NWHW=null; $('#dsum').innerHTML=IAsum('destaques'); }
  else { var h=NWH.filter(function(x){ return x.semana.w===w; })[0]; if(!h) return; if(!NWH0) NWH0=IA.destaques; IA.destaques=h._d; NWHW=h; $('#dsum').innerHTML=h.resumo?'<p><span class="lbl">Análise da '+esc(h.semana.w)+'</span>'+esc(h.resumo)+'</p>':''; }
  nwhBar(); drawDest();
}
function nwhLoad(){
  var el=document.querySelector('[data-px-hist]'); if(!el||typeof DecompressionStream==='undefined'||typeof Response==='undefined'||typeof Blob==='undefined') return;
  try{
    var bin=atob(el.textContent.replace(/\s+/g,'')), u=new Uint8Array(bin.length); for(var i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text().then(function(t){
      var L=JSON.parse(t); if(!Array.isArray(L)||!L.length) return;
      L.forEach(function(h){ var d=h.destaques||{}; ['novos','oport','agir'].forEach(function(k){ d[k]=d[k]||[]; }); h._d=PXresolve(d,h.exemplos||{}); });
      NWH=L; nwhBar();
    }).catch(function(){});
  }catch(e){}
}
document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('[data-hw]'); if(b) nwhSel(b.getAttribute('data-hw')); });
nwhLoad();

/* -------- radar -------- */
var MET=[
 {id:'sup',l:'Suporte humano',get:function(e){return e.sup&&e.sup[per]&&e.sup[per].h;},worse:'up',kind:'rel',fmt:function(v){return fN(v);}},
 {id:'nps',l:'NPS Transacional',get:function(e){return e.nps&&e.nps[per]&&e.nps[per].v;},n:function(e){return e.nps&&e.nps[per]&&e.nps[per].n;},min:20,worse:'down',kind:'pts',fmt:function(v){return fN(v);}},
 {id:'csat',l:'CSAT do suporte',get:function(e){return e.sup&&e.sup[per]&&e.sup[per].csat;},n:function(e){return e.sup&&e.sup[per]&&e.sup[per].csatN;},min:10,worse:'down',kind:'pp',fmt:function(v){return fN(v,0)+'%';}},
 {id:'loja',l:'Lojas: % positivas',get:function(e){return e.loja&&e.loja[per]&&e.loja[per].pos;},n:function(e){return e.loja&&e.loja[per]&&e.loja[per].n;},min:5,worse:'down',kind:'pp',fmt:function(v){return fN(v,0)+'%';},only:['semana','mes']},
 {id:'rede',l:'Redes: % positivas',get:function(e){return e.rede&&e.rede[per]&&e.rede[per].pos;},n:function(e){return e.rede&&e.rede[per]&&e.rede[per].n;},min:5,worse:'down',kind:'pp',fmt:function(v){return fN(v,0)+'%';},only:['semana','mes']},
 {id:'ra',l:'Reclame Aqui',ra:true,get:function(e){return e.ra&&e.ra[per];},worse:'up',kind:'rel',fmt:function(v){return fN(v);}}
];
var cur='sup';
function heat(v,base,m){
  if(v==null||base==null) return null;
  var r=m.id==='sup'?(v-base)/Math.max(1,base)*2.2:(v-base)/(m.id==='nps'?20:15);
  if(m.worse==='down') r=-r; r=Math.max(-1,Math.min(1,r));
  if(r>0.08) return 'rgba(255,122,26,'+(0.18+0.72*r).toFixed(2)+')';
  if(r<-0.08) return 'rgba(57,169,240,'+(0.15+0.55*(-r)).toFixed(2)+')';
  return '#eef2f8';
}
function colOf(dl){
  var m=/(\d{1,2})\/(\d{2})\s*$/.exec(String(dl||'')); if(!m) return -1;
  var yr=Number(String((IA.semana&&IA.semana.fim)||'').slice(-4))||new Date().getFullYear();
  var d=Date.UTC(yr,Number(m[2])-1,Number(m[1])), P0=P(), ini=P0.ini||[], i;
  if(per==='dia') return P0.lab.indexOf((m[1].length<2?'0':'')+m[1]+'/'+m[2]);
  for(i=0;i<ini.length;i++){ var a=new Date(ini[i]+'T00:00:00Z'), a0=a.getTime();
    if(per==='semana'){ if(d>=a0&&d<a0+7*86400000) return i; } else { if(new Date(d).getUTCFullYear()===a.getUTCFullYear()&&new Date(d).getUTCMonth()===a.getUTCMonth()) return i; } }
  return -1;
}

function drawRadar(){
  var m=MET.filter(function(x){return x.id===cur;})[0];
  if(m.only&&m.only.indexOf(per)<0){ cur='sup'; m=MET[0]; }
  var lab=P().lab, n=lab.length, g='', i, ci=idx(lab)[0];
  $('#grid').style.gridTemplateColumns='minmax(150px,1.3fr) repeat('+n+',minmax('+(n>10?30:36)+'px,1fr)) minmax(96px,.9fr)';
  g+='<div></div>'; for(i=0;i<n;i++) g+='<div class="hd'+(i===ci?' cur':'')+'"><b>'+esc(lab[i])+'</b>'+esc(P().sub?P().sub[i]:'')+'</div>'; g+='<div class="hd">'+esc(per==='mes'?'Último mês fechado':(per==='dia'?'Último dia':'Semana atual'))+'</div>';
  g+='<div class="hd" style="text-align:left;padding-left:8px">Movimentos</div><div class="pins" style="grid-column:2/'+(n+2)+'">';
  var by={}; IA.eventos.forEach(function(e,k){ var c=colOf(e.d); if(c<0) return; (by[c]=by[c]||[]).push(k); });
  Object.keys(by).forEach(function(c){ var ks=by[c], hot=ks.some(function(k){ return (IA.eventos[k].imp||[]).some(function(x){return x[1]==='Crítico';}); });
    g+='<button type="button" class="pin'+(hot?' hot':'')+'" style="left:'+((Number(c)+0.5)*100/n)+'%" data-ev="'+ks[0]+'" data-tip="'+esc(ks.map(function(k){return IA.eventos[k].d+': '+IA.eventos[k].t;}).join(' | '))+'" aria-label="'+ks.length+' movimentos">'+ks.length+'</button>'; });
  g+='</div><div></div>';
  var ROWS=CAT.concat([{id:null,name:'Total RecargaPay',subs:[],total:true}]);
  ROWS.forEach(function(c){ if(c.total) g+='<div class="rsep"></div>';
    var e=c.id?dbp(c.id):DB.geral, a=m.get(e), base=a?mean((per==='mes'&&DB.periodos.mes.parcial)?a.slice(0,n-1):a):null, nn=m.n?m.n(e):null;
    g+='<button type="button" class="rlab'+(c.total?' tot':'')+'"'+(c.id?' data-open="'+c.id+'"':' disabled')+'>'+esc(c.name)+(c.subs.length?' <small>'+c.subs.length+' sub</small>':'')+'</button>';
    for(i=0;i<n;i++){
      var v=a?a[i]:null, small=nn&&nn[i]!=null&&nn[i]<m.min, col=(v==null||small)?null:heat(v,base,m);
      var txt=v==null?'':(m.id==='sup'&&v>=1000?fN(v/1000,1)+'k':(m.id==='sup'?fN(v):fN(v,0)));
      g+='<button type="button" class="cell'+(col?'':' na')+(i===ci?' cur':'')+(c.total?' tot':'')+'"'+(c.id?' data-open="'+c.id+'"':'')+' data-tip="'+esc(c.name+', '+lab[i]+': '+(v==null?'sem dado':m.fmt(v)+(nn&&nn[i]!=null?' (base '+fN(nn[i])+')':'')+(small?', base pequena':'')))+'" style="'+(col?'background:'+col:'')+'">'+txt+'</button>';
    }
    var k=cmp(a,m.kind);
    g+='<div class="rval'+(c.total?' tot':'')+'"><b>'+(k.c==null?'—':m.fmt(k.c))+'</b><span class="'+cls(k.d,m.worse)+'">'+esc(k.txt)+'</span></div>';
  });
  if(m.ra) g+='<div class="foot" style="grid-column:1/-1">Reclame Aqui pela base HugMe, na data da reclamação. O produto vem da vertical da HugMe e, quando a reclamação ainda não foi classificada, do texto da reclamação.</div>';
  $('#grid').innerHTML=g; $('#rsum').innerHTML=IAsum('radar',radarSum(m));
  $('#rsub').textContent='Cada linha é um produto e cada coluna, '+ART[per].um+'. A cor compara cada coluna com a média do próprio produto no período exibido; os marcadores no topo são movimentos da empresa. '+P().nota;
  $('#rfoot').textContent='Laranja: pior que a média do produto; azul: melhor. Hachurado: sem dado ou base pequena. A coluna da direita compara com '+(per==='semana'?'a ':'o ')+P().ant+'. A linha Total mostra o indicador geral do RecargaPay'+(m.id==='sup'?' (no suporte humano inclui tickets sem classificação e verticais fora dos 12 produtos, então não é a soma das linhas)':'')+'.';
  [].forEach.call(document.querySelectorAll('#rctl .chip'),function(b){ var mm=MET.filter(function(x){return x.id===b.getAttribute('data-m');})[0]; b.disabled=!!(mm.only&&mm.only.indexOf(per)<0); b.title=b.disabled?'Disponível nas visões por semana e por mês (volume diário pequeno demais)':''; b.setAttribute('aria-pressed',mm.id===cur); });
}
$('#rctl').innerHTML=MET.map(function(m){return '<button type="button" class="chip" data-m="'+m.id+'" aria-pressed="'+(m.id===cur)+'">'+esc(m.l)+'</button>';}).join('')+'<span class="legend">melhor <span class="bar"></span> pior</span>';
$('#rctl').addEventListener('click',function(e){ var b=e.target.closest('button[data-m]'); if(!b||b.disabled) return; cur=b.getAttribute('data-m'); drawRadar(); });

/* -------- textos de analise do periodo -------- */
function art(){ return per==='semana'?'a ':'o '; }
function fmtD(k,kind){ if(k.d==null) return 'sem comparação'; var u=kind==='rel'?'%':(kind==='pp'?' pp':' pts'); return (k.d>0?'+':(k.d<0?'−':''))+fN(Math.abs(k.d),kind==='rel'?0:1)+u; }
function radarSum(m){

  var L=[]; CAT.forEach(function(c){ var e=dbp(c.id), a=m.get(e); if(!a) return; var nn=m.n?m.n(e):null, ix=idx(a); if(nn&&nn[ix[0]]!=null&&nn[ix[0]]<m.min) return; var k=cmp(a,m.kind); if(k.d==null) return; if(m.kind==='rel'&&(k.p==null||k.p<10)) return; L.push({n:c.name,k:k,bad:(m.worse==='up'?k.d:-k.d)}); });
  if(!L.length) return 'Sem dados suficientes para '+esc(m.l)+' neste período.';
  L.sort(function(a,b){return b.bad-a.bad;});
  var pior=L.filter(function(x){return x.bad>0;}).slice(0,3), melhor=L.filter(function(x){return x.bad<0;}).slice(-3).reverse();
  var t='<b>'+esc(m.l)+'</b> contra '+art()+esc(P().ant)+': ';
  t+=pior.length?'pioram '+pior.map(function(x){return '<b>'+esc(x.n)+'</b> ('+esc(fmtD(x.k,m.kind))+')';}).join(', '):'nenhum produto piora';
  t+='; '+(melhor.length?'melhoram '+melhor.map(function(x){return '<b>'+esc(x.n)+'</b> ('+esc(fmtD(x.k,m.kind))+')';}).join(', '):'nenhum produto melhora')+'.';
  return t;
}
function kpiSum(){
  var G=DB.geral, M=DB.metas, n=cmp(G.nps[per]&&G.nps[per].v,'pts'), r=cmp(G.rel[per]&&G.rel[per].v,'pts'), c=cmp(G.sup[per]&&G.sup[per].csat,'pp'), h=cmp(G.sup[per]&&G.sup[per].h,'rel');
  var t='';
  if(n.c!=null) t+='<b>NPS Transacional</b> em '+fN(n.c)+' ('+esc(fmtD(n,'pts'))+'), '+(n.c>=M.nps.meta?'na meta':(n.c>=M.nps.min?fN(M.nps.meta-n.c)+' pts abaixo da meta e acima do mínimo':'abaixo do mínimo de '+M.nps.min))+'. ';
  if(r.c!=null) t+='<b>NPS Relacional</b> em '+fN(r.c)+' ('+esc(fmtD(r,'pts'))+'). ';
  if(c.c!=null) t+='<b>CSAT</b> em '+fN(c.c,1)+'% ('+esc(fmtD(c,'pp'))+'), '+(c.c>=M.csat.meta?'na meta':(c.c>=M.csat.min?'acima do piso e abaixo da meta':'abaixo do piso de '+M.csat.min+'%'))+'. ';
  if(h.c!=null) t+='<b>Suporte humano</b> '+(h.d==null?'sem comparação':(h.d>0?'sobe ':'cai ')+fN(Math.abs(h.d),0)+'%')+' contra '+art()+esc(P().ant)+'.';
  if(per==='mes') t+=' Novembro está parcial e não entra na comparação.';
  return t;
}
function prodSum(){
  var crit=[],at=[], up=[], dn=[];
  CAT.forEach(function(c){ var e=dbp(c.id), s0=status(e); if(s0[0]==='c') crit.push(c.name); if(s0[0]==='a') at.push(c.name);
    var k=cmp(e.sup&&e.sup[per]&&e.sup[per].h,'rel'); if(k.d!=null){ if(k.d>=10) up.push([c.name,k.d]); if(k.d<=-10) dn.push([c.name,k.d]); } });
  up.sort(function(a,b){return b[1]-a[1];}); dn.sort(function(a,b){return a[1]-b[1];});
  var t='<b>'+crit.length+' produto'+(crit.length===1?'':'s')+' em situação crítica</b>'+(crit.length?' ('+esc(crit.join(', '))+')':'')+' e '+at.length+' em atenção na última semana. ';
  t+='No suporte humano, contra '+art()+esc(P().ant)+', '+(up.length?'sobem '+up.slice(0,3).map(function(x){return '<b>'+esc(x[0])+'</b> (+'+fN(x[1],0)+'%)';}).join(', '):'nenhum produto sobe mais de 10%')+'; '+(dn.length?'caem '+dn.slice(0,3).map(function(x){return '<b>'+esc(x[0])+'</b> (−'+fN(Math.abs(x[1]),0)+'%)';}).join(', '):'nenhum cai mais de 10%')+'.';
  return t;
}
/* -------- graficos com rotulos e metas -------- */
function chart(a,lab,o){
  o=o||{}; var v=(a||[]).map(function(x){return x==null?null:Number(x);}), n=v.length; if(!n) return '';
  var W=o.w||640, H=o.h||170, L=10, R=10, T=22, B=24, nz=v.filter(function(x){return x!=null;}); if(!nz.length) return '';
  var lines=[]; if(o.meta!=null) lines.push(o.meta); if(o.min!=null) lines.push(o.min);
  var mn=o.type==='bar'?0:Math.min.apply(null,nz.concat(lines)), mx=Math.max.apply(null,nz.concat(lines)), sp=(mx-mn)||1; if(o.type!=='bar'){ mn-=sp*.12; mx+=sp*.12; sp=mx-mn; }
  var step=(W-L-R)/n, ci=o.cur!=null?o.cur:n-1;
  function x(i){return L+step*i+step/2;} function y(t){return T+(H-T-B)*(1-(t-mn)/sp);}
  var g='';
  lines.forEach(function(t,k){ g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y(t).toFixed(1)+'" y2="'+y(t).toFixed(1)+'" stroke="'+(k===0?'#11865A':'#D93B3B')+'" stroke-dasharray="5 4" stroke-width="1.5"/><text x="'+(W-R)+'" y="'+(y(t)-4).toFixed(1)+'" text-anchor="end" font-size="11" fill="'+(k===0?'#11865A':'#D93B3B')+'" font-weight="600">'+esc((k===0?(o.metaL||'Meta '):(o.minL||'Mínimo '))+fN(t))+'</text>'; });
  if(o.type==='bar'){
    var bw=Math.min(40,step*.62);
    v.forEach(function(t,i){ if(t==null) return; var yy=y(t); g+='<rect x="'+(x(i)-bw/2).toFixed(1)+'" y="'+yy.toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+Math.max(1,(H-B)-yy).toFixed(1)+'" rx="3" fill="'+(i===ci?'#0B2265':'#B9D7F4')+'"/><text x="'+x(i).toFixed(1)+'" y="'+(yy-5).toFixed(1)+'" text-anchor="middle" font-size="11" font-weight="600" fill="#0F1C3F">'+esc(o.fmt?o.fmt(t):fN(t))+'</text>'; });
  } else {
    var pts=[]; v.forEach(function(t,i){ if(t!=null) pts.push([x(i),y(t),t,i]); });
    g+='<polyline points="'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ')+'" fill="none" stroke="#1E6FD9" stroke-width="2.4"/>';
    pts.forEach(function(p){ var c=p[3]===ci; g+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(c?5:3.5)+'" fill="'+(c?'#FF7A1A':'#1E6FD9')+'"/><text x="'+p[0].toFixed(1)+'" y="'+(p[1]-9).toFixed(1)+'" text-anchor="middle" font-size="11" font-weight="'+(c?700:600)+'" fill="#0F1C3F" stroke="#fff" stroke-width="3" paint-order="stroke">'+esc(o.fmt?o.fmt(p[2]):fN(p[2]))+'</text>'; });
  }
  (lab||[]).forEach(function(l,i){ if(n>12&&i%2!==(n-1)%2) return; g+='<text x="'+x(i).toFixed(1)+'" y="'+(H-6)+'" text-anchor="middle" font-size="11" fill="#56678A">'+esc(l)+'</text>'; });
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="'+esc(o.alt||'gráfico')+'">'+g+'</svg>';
}

/* -------- indicadores gerais -------- */
function kpiBox(l,a,o){
  var k=cmp(a,o.kind), lab=P().lab;
  return '<div class="kpi"'+(o.key?' data-kpi="'+o.key+'" role="button" tabindex="0" aria-label="Abrir detalhe de '+esc(l)+'"':'')+'><div class="l"><span>'+esc(l)+'</span></div><div class="v">'+(k.c==null?'—':o.fmt(k.c))+'</div><div class="d"><span class="'+cls(k.d,o.worse)+'">'+esc(k.txt)+'</span> vs '+esc(P().ant)+(k.p!=null?' ('+o.fmt(k.p)+')':'')+'</div><div class="g">'+esc(o.goal)+'</div>'+chart(a,lab,{type:o.type,fmt:o.cfmt||o.fmt,meta:o.meta,min:o.min,cur:idx(a)[0],w:(per==='dia'?420:320),h:150,alt:l,metaL:'Meta ',minL:(l.indexOf('CSAT')>=0?'Piso ':'Mín. ')})+(o.key?'<span class="more2">Ver detalhe ›</span>':'')+'</div>';
}
var KDEF={};
function kdefs(){
  var G=DB.geral, M=DB.metas;
  KDEF={
   nps:{l:'NPS Transacional',a:G.nps[per]&&G.nps[per].v,n:G.nps[per]&&G.nps[per].n,o:{key:'nps',kind:'pts',worse:'down',fmt:function(v){return fN(v);},goal:M.nps.txt,meta:M.nps.meta,min:M.nps.min},prod:function(e){return e.nps&&e.nps[per]&&e.nps[per].v;},pn:function(e){return e.nps&&e.nps[per]&&e.nps[per].n;},nl:'Respostas'},
   rel:{l:'NPS Relacional',a:G.rel[per]&&G.rel[per].v,n:G.rel[per]&&G.rel[per].n,o:{key:'rel',kind:'pts',worse:'down',fmt:function(v){return fN(v);},goal:M.rel.txt+'; todas as respostas'},nl:'Respostas'},
   csat:{l:'CSAT do suporte',a:G.sup[per]&&G.sup[per].csat,n:G.sup[per]&&G.sup[per].csatN,o:{key:'csat',kind:'pp',worse:'down',fmt:function(v){return fN(v,1)+'%';},cfmt:function(v){return fN(v,0);},goal:M.csat.txt,meta:M.csat.meta,min:M.csat.min},prod:function(e){return e.sup&&e.sup[per]&&e.sup[per].csat;},pn:function(e){return e.sup&&e.sup[per]&&e.sup[per].csatN;},nl:'Avaliações'},
   sup:{l:'Suporte humano',a:G.sup[per]&&G.sup[per].h,n:G.sup[per]&&G.sup[per].naocl,o:{key:'sup',kind:'rel',worse:'up',type:'bar',fmt:function(v){return fN(v);},cfmt:function(v){return v>=1000?fN(v/1000,1)+'k':fN(v);},goal:M.sup.txt+'; inclui tickets sem classificação'},prod:function(e){return e.sup&&e.sup[per]&&e.sup[per].h;},nl:'Sem classificação'},
   loja:{l:'Lojas de apps: % positivas',a:G.loja[per]&&G.loja[per].pos,n:G.loja[per]&&G.loja[per].n,o:{key:'loja',kind:'pp',worse:'down',fmt:function(v){return fN(v,0)+'%';},goal:'% de avaliações 4–5★; '+M.loja.txt},prod:function(e){return e.loja&&e.loja[per]&&e.loja[per].pos;},pn:function(e){return e.loja&&e.loja[per]&&e.loja[per].n;},nl:'Avaliações'}
  };
  if(per==='dia') delete KDEF.loja;
}
function openKpi(key){
  kdefs(); var K=KDEF[key]; if(!K) return; var o=K.o, lab=P().lab, k=cmp(K.a,o.kind);
  st={p:null,sub:null,tab:null,ev:null};
  $('#ptitle').textContent=K.l; $('#psubs').innerHTML=''; $('#ptabs').innerHTML='';
  var b='<div class="box"><div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><span style="font-family:var(--fc);font-size:46px;font-weight:600;line-height:1">'+(k.c==null?'—':o.fmt(k.c))+'</span><span class="'+cls(k.d,o.worse)+'" style="font-weight:700">'+esc(k.txt)+' vs '+esc(P().ant)+(k.p!=null?' ('+o.fmt(k.p)+')':'')+'</span><span class="src db">Databricks</span></div><div class="foot" style="margin-top:4px">'+esc(o.goal)+'. '+esc(P().nota)+'</div></div>';
  b+='<div class="sum">'+IAsum('indicadores',kpiSum())+'</div>';
  b+='<h4>Evolução por '+esc(P().nome)+'</h4><div class="box chart">'+chart(K.a,lab,{type:o.type,fmt:o.cfmt||o.fmt,meta:o.meta,min:o.min,cur:idx(K.a)[0],w:(per==='dia'?900:760),h:290,alt:K.l,minL:(key==='csat'?'Piso ':'Mínimo ')})+'</div>';
  if(K.n&&K.n.some(function(x){return x!=null;})) b+='<h4>'+esc(K.nl)+' por '+esc(P().nome)+'</h4><div class="box chart">'+chart(K.n,lab,{type:'bar',fmt:function(v){return v>=1000?fN(v/1000,1)+'k':fN(v);},cur:idx(K.n)[0],w:(per==='dia'?900:760),h:200,alt:K.nl})+'</div>';
  var cols=[[K.l,K.a,o.fmt,o.kind,o.worse]]; if(K.n) cols.push([K.nl,K.n,function(v){return fN(v);},'rel','x']);
  b+='<h4>Tabela do período</h4><div class="box">'+wkTable(cols,lab)+'</div>';
  if(K.prod){
    var R=[]; CAT.forEach(function(c){ var e=dbp(c.id), a=K.prod(e); if(!a) return; var kk=cmp(a,o.kind), nn=K.pn?K.pn(e):null, ix=idx(a); R.push({c:c,k:kk,n:nn?nn[ix[0]]:null,a:a}); });
    R.sort(function(x,y){ var dx=x.k.d==null?-1e9:(o.worse==='up'?x.k.d:-x.k.d), dy=y.k.d==null?-1e9:(o.worse==='up'?y.k.d:-y.k.d); return dy-dx; });
    b+='<h4>Por produto <span class="src db">Databricks</span></h4><p class="foot" style="margin:0 0 6px">Ordenado do que mais piorou para o que mais melhorou contra '+(per==='semana'?'a ':'o ')+esc(P().ant)+'. Clique no produto para abrir o detalhe.</p><div class="box"><div class="tbl"><table class="wk"><tr><th>Produto</th><th>'+esc(ART[per].ult.replace(/^d[oa] /,''))+'</th><th>Variação</th>'+(K.pn?'<th>Base</th>':'')+'<th style="text-align:left">Tendência</th></tr>'+R.map(function(r){ return '<tr><td><button type="button" class="more" style="padding:0" data-goto="'+r.c.id+'">'+esc(r.c.name)+'</button></td><td>'+(r.k.c==null?'—':o.fmt(r.k.c))+'</td><td><span class="'+cls(r.k.d,o.worse)+'">'+esc(r.k.d==null?'—':fmtD(r.k,o.kind))+'</span></td>'+(K.pn?'<td>'+fN(r.n)+'</td>':'')+'<td style="text-align:left;width:190px">'+chart(r.a,null,{type:o.type,fmt:o.cfmt||o.fmt,w:260,h:60,alt:r.c.name})+'</td></tr>'; }).join('')+'</table></div></div>';
  }
  var evs=(IA.eventos||[]).slice(0,4); if(evs.length) b+='<h4>Movimentos recentes <span class="src ia">Análise IA</span></h4><div class="box"><ul class="b">'+evs.map(function(e){return '<li><b>'+esc(e.d)+'</b>: '+esc(e.t)+'</li>';}).join('')+'</ul></div>';
  $('#pbody').innerHTML=b; $('#pbody').scrollTop=0; openPanel();
}
function drawKpis(){
  var G=DB.geral, M=DB.metas;
  var h=''; kdefs();
  h+=kpiBox('NPS Transacional',G.nps[per]&&G.nps[per].v,{key:'nps',kind:'pts',worse:'down',fmt:function(v){return fN(v);},goal:M.nps.txt,meta:M.nps.meta,min:M.nps.min});
  h+=kpiBox('NPS Relacional',G.rel[per]&&G.rel[per].v,{key:'rel',kind:'pts',worse:'down',fmt:function(v){return fN(v);},goal:M.rel.txt+'; todas as respostas'});
  h+=kpiBox('CSAT do suporte',G.sup[per]&&G.sup[per].csat,{key:'csat',kind:'pp',worse:'down',fmt:function(v){return fN(v,1)+'%';},cfmt:function(v){return fN(v,0);},goal:M.csat.txt,meta:M.csat.meta,min:M.csat.min});
  h+=kpiBox('Suporte humano',G.sup[per]&&G.sup[per].h,{key:'sup',kind:'rel',worse:'up',type:'bar',fmt:function(v){return fN(v);},cfmt:function(v){return v>=1000?fN(v/1000,1)+'k':fN(v);},goal:M.sup.txt+'; inclui tickets sem classificação'});
  if(per!=='dia') h+=kpiBox('Lojas de apps',G.loja[per].pos,{key:'loja',kind:'pp',worse:'down',fmt:function(v){return fN(v,0)+'%';},goal:'% de avaliações 4–5★; '+M.loja.txt});
  $('#kpis').innerHTML=h; $('#ksum').innerHTML=IAsum('indicadores',kpiSum());
  $('#ksub').textContent=P().nota+' Cada card mostra o valor '+ART[per].ult+', a variação contra '+(per==='semana'?'a ':'o ')+P().ant+' e a meta.';
}

/* -------- vozes e movimentos -------- */
var VZ=[['reclamam','Reclamam','var(--red)'],['pedem','Pedem','var(--orange)'],['elogiam','Elogiam','var(--green)']];
$('#voices').innerHTML=VZ.map(function(v){ return '<div class="voice"><h3><i style="background:'+v[2]+'"></i>'+v[1]+'</h3><ol>'+(IA.vozes[v[0]]||[]).map(function(x){ var p=cat(x.p); return '<li><button type="button" data-tema="v'+v[0]+'|'+(IA.vozes[v[0]].indexOf(x))+'"><b>'+esc(x.t)+serTrend(x.serie)+'</b><span class="d">'+esc(x.d)+'</span>'+(p?'<span class="ptag">'+esc(p.name)+'</span>':'')+'<span class="d" style="color:var(--blue);font-weight:700">Ver tendência e exemplos ›</span></button></li>'; }).join('')+'</ol></div>'; }).join('');
function impHtml(imp){ return '<div class="imp">'+(imp||[]).map(function(i){ var c=i[1]==='Crítico'?'c':(i[1]==='Atenção'?'a':(i[1]==='Em linha'?'o':'')); return '<span class="'+c+'">'+esc(i[0])+': '+esc(i[2])+'</span>'; }).join('')+'</div>'; }
/* -------- movimentos dos ultimos 30 dias -------- */
function evDate(d){ var m=String(d||'').match(/(\d{1,2})(?:\s*[–-]\s*\d{1,2})?\/(\d{1,2})/); if(!m) return null; var now=new Date(), y=now.getFullYear(), dt=new Date(y,Number(m[2])-1,Number(m[1])); if(dt-now>40*864e5) dt=new Date(y-1,Number(m[2])-1,Number(m[1])); return dt; }
function drawTL30(){
  var hoje=new Date(); hoje.setHours(0,0,0,0); var ini=new Date(hoje-30*864e5), f=function(d){ return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2); };
  var L=IA.eventos.map(function(e,k){ return {e:e,k:k,dt:evDate(e.d)}; }), V=L.filter(function(o){ return o.dt&&o.dt>=ini&&o.dt<=hoje; });
  var todos=!V.length; if(todos) V=L;
  V.sort(function(a,b){ return (b.dt||0)-(a.dt||0); });
  var axis='';
  if(!todos){ for(var i=0;i<=30;i+=5){ var dd=new Date(ini.getTime()+i*864e5); axis+='<span class="t30-tk" style="left:'+(i*100/30)+'%">'+f(dd)+'</span>'; }
    axis+=V.map(function(o){ var hot=(o.e.imp||[]).some(function(x){return x[1]==='Crítico';}), at=(o.e.imp||[]).some(function(x){return x[1]==='Atenção';}); var x=(o.dt-ini)*100/(30*864e5);
      return '<button type="button" class="t30-dot'+(hot?' hot':(at?' at':''))+'" style="left:'+Math.max(0,Math.min(100,x))+'%" data-ev="'+o.k+'" data-tip="'+esc(o.e.d+': '+o.e.t)+'" aria-label="'+esc(o.e.d+': '+o.e.t)+'"></button>'; }).join(''); }
  $('#tl30').innerHTML='<div class="t30-h"><b>'+(todos?'Movimentos mapeados':'Movimentos dos últimos 30 dias')+'</b><span>'+(todos?'Nenhum movimento nos últimos 30 dias; mostrando os mapeados.':f(ini)+' a '+f(hoje)+' · '+V.length+' movimento'+(V.length===1?'':'s'))+'</span></div>'+(todos?'':'<div class="t30-ax">'+axis+'</div><div class="t30-leg"><span><i class="hot"></i>efeito crítico</span><span><i class="at"></i>atenção</span><span><i></i>sem efeito ou ainda não medido</span></div>');
  $('#tl').innerHTML=V.map(function(o){ var e=o.e, k=o.k, hot=(e.imp||[]).some(function(x){return x[1]==='Crítico';}); return '<div class="ev'+(hot?' hot':'')+'"><button type="button" data-ev="'+k+'"><div class="d">'+esc(e.d)+'<small>'+esc(e.tipo||'')+'</small></div><div><div class="t">'+esc(e.t)+'</div><div class="r">'+esc(e.res||'')+'</div>'+impHtml(e.imp)+'</div></button></div>'; }).join('');
}
drawTL30();

/* -------- lojas e redes -------- */
function drawLR(){
  var LR=IA.lojasredes||{}, G=DB.geral, lab=DB.periodos.semana.lab;
  $('#lrsum').innerHTML='<p><span class="lbl">Análise da '+esc(IA.semana.w)+'</span>'+esc(LR.texto||'')+'</p>';
  function temas(L){ return (L||[]).slice(0,5).map(function(x){ return '<div class="tema '+esc(x.tom||'')+'"><b>'+esc(x.t)+'</b><small>'+fN(x.n)+' menções</small>'+(x.x?'<p>'+esc(x.x)+'</p>':'')+'</div>'; }).join(''); }
  var L=G.loja.semana, R=G.rede.semana, lk=cmp(L.avg,'pts'), ln=cmp(L.neg,'pp'), rk=cmp(R.n,'rel'), rn=cmp(R.neg,'pp');
  var lv=cmp(L.n,'rel'), lp=cmp(L.pos,'pp');
  var h='<div><h3>Lojas de apps</h3><div class="foot" style="margin:0 0 6px">'+fN(lv.c)+' avaliações com comentário ('+esc(fmtD(lv,'rel'))+' vs '+wP()+') · '+fN(lp.c,0)+'% positivas, notas 4–5 ('+esc(fmtD(lp,'pp'))+')</div>'+
    chart(L.n,lab,{type:'bar',fmt:function(v){return fN(v);},w:520,h:150,alt:'Avaliações por semana'})+chart(L.pos,lab,{fmt:function(v){return fN(v,0)+'%';},w:520,h:140,alt:'% de avaliações positivas'})+'<p class="foot">Barras: avaliações com comentário. Linha: % de avaliações positivas (notas 4–5).</p>'+
    '<h4 style="font-family:var(--fc);font-size:19px;margin:14px 0 6px">Temas da semana</h4>'+temas(LR.loja&&LR.loja.temas)+
    '<h4 style="font-family:var(--fc);font-size:19px;margin:14px 0 6px">Exemplos de avaliações negativas</h4>'+exHtml(LR.loja&&LR.loja.neg,'neg')+
    '<h4 style="font-family:var(--fc);font-size:19px;margin:14px 0 6px">Exemplos de avaliações positivas</h4>'+exHtml(LR.loja&&LR.loja.pos,'pos')+'</div>';
  h+='<div><h3>Redes sociais</h3><div class="foot" style="margin:0 0 6px">'+fN(rk.c)+' interações ('+esc(fmtD(rk,'rel'))+' vs '+wP()+') · '+fN(rn.c,0)+'% negativas ('+esc(fmtD(rn,'pp'))+')</div>'+
    chart(R.n,lab,{type:'bar',fmt:function(v){return fN(v);},w:520,h:150,alt:'Interações nas redes'})+chart(R.neg,lab,{fmt:function(v){return fN(v,0)+'%';},w:520,h:140,alt:'% de interações negativas'})+'<p class="foot">Barras: interações. Linha: % negativas segundo o Buzzmonitor.</p>'+
    (LR.aviso?'<div class="warnbox">'+esc(LR.aviso)+'</div>':'')+
    '<h4 style="font-family:var(--fc);font-size:19px;margin:14px 0 6px">Temas da semana</h4>'+temas(LR.rede&&LR.rede.temas)+
    '<h4 style="font-family:var(--fc);font-size:19px;margin:14px 0 6px">Exemplos de menções negativas</h4>'+exHtml(LR.rede&&LR.rede.neg,'neg')+
    '<h4 style="font-family:var(--fc);font-size:19px;margin:14px 0 6px">Classificados como positivos, mas são reclamações</h4>'+exHtml(LR.rede&&LR.rede.falsopos,'warn')+'</div>';
  var RA=IA.ra||{}, GR=G.ra, rk2=cmp(GR.semana,'rel');
  h+='<div style="grid-column:1/-1"><h3>Reclame Aqui</h3>'+(RA.texto?'<div class="sum"><p><span class="lbl">Análise da '+esc(IA.semana.w)+'</span>'+esc(RA.texto)+'</p></div>':'')+
   '<div class="lr" style="grid-template-columns:1fr 1fr;gap:16px;padding:0"><div style="padding:0">'+'<div class="foot" style="margin:0 0 6px">'+fN(rk2.c)+' reclamações na '+wL()+' ('+esc(fmtD(rk2,'rel'))+' vs '+wP()+')</div>'+chart(GR.semana,lab,{type:'bar',fmt:function(v){return fN(v);},w:520,h:150,alt:'Reclamações por semana'})+'</div><div style="padding:0"><div class="foot" style="margin:0 0 6px">% marcadas como resolvidas pelo cliente e nota média da avaliação (0–10)</div>'+chart(GR.resol,lab,{fmt:function(v){return fN(v,0)+'%';},w:520,h:120,alt:'% resolvidas'})+chart(GR.nota,lab,{fmt:function(v){return fN(v,1);},w:520,h:110,alt:'Nota média'})+'<p class="foot">A '+wL()+' tem menos resolvidas porque as reclamações recentes ainda estão em tratamento.</p></div></div>'+
   '<h4 style="font-family:var(--fc);font-size:19px;margin:16px 0 6px">Temas do Reclame Aqui</h4><div class="tbl"><table class="wk"><tr><th>Tema</th><th>'+wL()+'</th><th>vs '+wP()+'</th><th style="text-align:left">Últimas 10 semanas</th><th></th></tr>'+(RA.temas||[]).map(function(t,i){ var k=cmp(t.v,'rel'); return '<tr data-ratema="'+i+'"><td style="text-align:left"><b>'+esc(t.t)+'</b></td><td>'+fN(k.c)+'</td><td><span class="'+cls(k.d,'up')+'">'+esc(fmtD(k,'rel'))+'</span></td><td style="text-align:left;width:220px">'+chart(t.v,null,{type:'bar',fmt:function(v){return fN(v);},w:300,h:80,alt:t.t})+'</td><td><button type="button" class="more" data-ratema="'+i+'">Ver ›</button></td></tr>'; }).join('')+'</table></div>'+(RA.aviso?'<p class="foot">'+esc(RA.aviso)+'</p>':'')+'</div>';
  var tr='';
  CAT.forEach(function(c){ var e=dbp(c.id), Lw=e.loja&&e.loja[per==='dia'?'semana':per], Rw=e.rede&&e.rede[per==='dia'?'semana':per], A=(e.ra||{})[per==='dia'?'semana':per];
    function cell(o,isLoja){ if(!o) return '<td>—</td>'; var k=cmp(o.n,'rel'), kn=cmp(isLoja?o.pos:o.neg,'pp'); return '<td>'+fN(k.c)+' <span class="eq" style="font-size:12px">'+esc(k.d==null?'':fmtD(k,'rel'))+'</span>'+(kn.c!=null?'<br><small style="color:var(--muted)">'+fN(kn.c,0)+'% '+(isLoja?'positivas':'negativas')+'</small>':'')+'</td>'; }
    var kra=A?cmp(A,'rel'):null;
    tr+='<tr><td><button type="button" class="more" style="padding:0" data-open="'+c.id+'" data-tab="temas">'+esc(c.name)+'</button></td>'+cell(Lw,true)+cell(Rw,false)+'<td>'+(kra&&kra.c!=null?fN(kra.c)+' <span class="'+cls(kra.d,'up')+'" style="font-size:12px">'+esc(kra.d==null?'':fmtD(kra,'rel'))+'</span>':'—')+'</td></tr>'; });
  h+='<div style="grid-column:1/-1"><h3>Menções por produto</h3><p class="foot" style="margin:0 0 8px">'+(per==='dia'?'Por dia o volume é pequeno demais; a tabela mostra a semana. ':'')+'Lojas e redes: '+esc(per==='mes'?'último mês fechado':'última semana')+' e variação. Reclame Aqui: reclamações na base HugMe no mesmo período. Clique no produto para ver a análise e os exemplos.</p><div class="tbl"><table class="wk"><tr><th>Produto</th><th>Lojas de apps</th><th>Redes sociais</th><th>Reclame Aqui</th></tr>'+tr+'</table></div></div>';
  $('#lr').innerHTML=h;
}
safe(drawLR);
/* -------- produtos -------- */
function L1(a){ return a&&a.length?a[a.length-1]:null; }
function B4(a){ if(!a||a.length<2) return null; var n=a.length; return mean(a.slice(Math.max(0,n-5),n-1)); }
function status(e){
  var s=e.sup&&e.sup.semana&&e.sup.semana.h, n=e.nps&&e.nps.semana&&e.nps.semana.v, c=e.sup&&e.sup.semana&&e.sup.semana.csat;
  var bs=B4(s), bn=B4(n), sd=(s&&bs!=null)?(L1(s)-bs)/Math.max(1,bs):0, nd=(n&&bn!=null&&L1(n)!=null)?L1(n)-bn:0, cs=c?L1(c):null, nl=n?L1(n):null;
  if(sd>0.25||nd<=-8||(nl!=null&&nl<55)) return ['c','Crítico']; if(sd>0.1||nd<=-4||(cs!=null&&cs<75)) return ['a','Atenção']; return ['o','Em linha'];
}

function pnews(id){ var a=(IA.produtos[id]||{}).analise||{}, t=sents(a.clientes)[0]||sents(a.mudou)[0]||''; return t?'<span class="pn"><span class="pn-l">Notícia da '+esc((IA.semana&&IA.semana.w)||'semana')+'</span><span class="pn-t">'+esc(t)+'</span></span>':''; }
function drawProds(){
  $('#prods').innerHTML=CAT.map(function(c){ var e=dbp(c.id), st=status(e), s=e.sup&&e.sup[per], n=e.nps&&e.nps[per];
    var ks=cmp(s&&s.h,'rel'), kn=cmp(n&&n.v,'pts'), kc=cmp(s&&s.csat,'pp');
    function cell(lbl,k,fmt,worse){ return '<div>'+lbl+'<b>'+(k.c==null?'—':fmt(k.c))+'</b><small class="'+cls(k.d,worse)+'">'+esc(k.d==null?'':k.txt)+'</small></div>'; }
    return '<button type="button" class="prod" data-open="'+c.id+'"><div class="n">'+esc(c.name)+'<span class="flag '+st[0]+'" title="Situação na última semana">'+st[1]+'</span></div>'+(c.subs.length?'<div class="s">'+c.subs.map(function(x){return '<span>'+esc(x.name)+'</span>';}).join('')+'</div>':'')+
     '<div class="m">'+cell('Suporte humano',ks,function(v){return fN(v);},'up')+cell('NPS',kn,function(v){return fN(v);},'down')+cell('CSAT',kc,function(v){return fN(v,0)+'%';},'down')+'</div>'+pnews(c.id)+'</button>'; }).join('');
  $('#psum').innerHTML=IAsum('produtos',prodSum());
  $('#psub').textContent='Valores '+ART[per].ult+' e variação contra '+(per==='semana'?'a ':'o ')+P().ant+'. A situação usa a semana. Abra um produto para ver subprodutos, motivos de contato, temas e movimentos.';
}

/* -------- painel lateral -------- */
var panel=$('#panel'), scrim=$('#scrim'), st={p:null,sub:null,tab:'resumo',ev:null}, lastFocus=null;
function openPanel(){ if(!panel.classList.contains('on')){ lastFocus=document.activeElement; panel.classList.add('on'); scrim.classList.add('on'); setTimeout(function(){ $('#pclose').focus(); },60); } }
function closePanel(){ panel.classList.remove('on'); scrim.classList.remove('on'); st.p=null; st.ev=null; if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
$('#pclose').addEventListener('click',function(e){ e.stopPropagation(); closePanel(); });
scrim.addEventListener('click',closePanel);
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&panel.classList.contains('on')) closePanel(); if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-kpi],.dcard[data-tema],.nw[data-tema],.nw-li[data-tema]')){ e.preventDefault(); e.target.click(); } });
function wkTable(cols,lab){
  var ci=idx(lab)[0], h='<div class="tbl"><table class="wk"><tr><th>'+esc(P().nome.charAt(0).toUpperCase()+P().nome.slice(1))+'</th>';
  cols.forEach(function(c){ h+='<th>'+esc(c[0])+'</th><th>Var.</th>'; }); h+='</tr>';
  for(var i=0;i<lab.length;i++){ h+='<tr'+(i===ci?' class="cur"':'')+'><td>'+esc(lab[i])+(P().sub?' ('+esc(P().sub[i])+')':'')+'</td>'+cols.map(function(c){ var v=c[1]?c[1][i]:null, p=(c[1]&&i>0)?c[1][i-1]:null, d='—';
      if(v!=null&&p!=null){ var dd=c[3]==='rel'?(p?(v-p)*100/p:null):v-p; if(dd!=null) d='<span class="'+cls(dd,c[4])+'">'+(dd>0?'+':(dd<0?'−':''))+fN(Math.abs(dd),c[3]==='rel'?0:1)+(c[3]==='rel'?'%':(c[3]==='pp'?' pp':''))+'</span>'; }
      return '<td>'+(v==null?'—':c[2](v))+'</td><td>'+d+'</td>'; }).join('')+'</tr>'; }
  return h+'</table></div>';
}
function chartBox(l,a,o){
  var k=cmp(a,o.kind);
  return '<div class="box chart"><div class="l"><span>'+esc(l)+'</span><span class="src db">Databricks</span></div><div class="v">'+(k.c==null?'—':o.fmt(k.c))+' <span class="'+cls(k.d,o.worse)+'" style="font-size:15px;font-family:var(--f)">'+esc(k.txt)+' vs '+esc(P().ant)+'</span></div><div class="g">'+esc(o.goal||'')+'</div>'+chart(a,P().lab,{type:o.type,fmt:o.cfmt||o.fmt,meta:o.meta,min:o.min,cur:idx(a)[0],w:(per==='dia'?720:560),h:180,alt:l,minL:(l.indexOf('CSAT')>=0?'Piso ':'Mínimo ')})+'</div>';
}
function tabInd(e){
  var M=DB.metas, s=e.sup&&e.sup[per], n=e.nps&&e.nps[per], h='', cols=[];
  h+='<div class="note">Visão por '+esc(P().nome)+'. '+esc(P().nota)+(e.nota?' '+esc(e.nota):'')+'</div>';
  var parts=[], ks=cmp(s&&s.h,'rel'), kc=cmp(s&&s.csat,'pp'), kn=cmp(n&&n.v,'pts');
  if(ks.c!=null) parts.push('<b>Suporte humano</b> '+(ks.d==null?'sem comparação':(ks.d>0?'sobe ':'cai ')+fN(Math.abs(ks.d),0)+'%'));
  if(kc.c!=null) parts.push('<b>CSAT</b> em '+fN(kc.c,1)+'% ('+esc(fmtD(kc,'pp'))+'), '+(kc.c>=M.csat.meta?'na meta':(kc.c>=M.csat.min?'abaixo da meta e acima do piso':'abaixo do piso de 75%')));
  if(kn.c!=null) parts.push('<b>NPS</b> em '+fN(kn.c)+' ('+esc(fmtD(kn,'pts'))+'), '+(kn.c>=M.nps.meta?'na meta':(kn.c>=M.nps.min?fN(M.nps.meta-kn.c)+' pts abaixo da meta':'abaixo do mínimo de 55')));
  if(parts.length) h+='<div class="sum">Contra '+art()+esc(P().ant)+': '+parts.join('; ')+'.</div>';
  if(s&&s.h){ h+=chartBox('Suporte humano',s.h,{kind:'rel',worse:'up',type:'bar',fmt:function(v){return fN(v);},goal:M.sup.txt}); cols.push(['Suporte humano',s.h,function(v){return fN(v);},'rel','up']); }
  if(s&&s.csat&&s.csat.some(function(v){return v!=null;})){ h+=chartBox('CSAT do suporte',s.csat,{kind:'pp',worse:'down',fmt:function(v){return fN(v,1)+'%';},cfmt:function(v){return fN(v,0);},goal:M.csat.txt,meta:M.csat.meta,min:M.csat.min}); cols.push(['CSAT',s.csat,function(v){return fN(v,1)+'%';},'pp','down']); }
  if(n&&n.v){ h+=chartBox('NPS Transacional (todas as respostas)',n.v,{kind:'pts',worse:'down',fmt:function(v){return fN(v);},goal:M.nps.txt,meta:M.nps.meta,min:M.nps.min}); cols.push(['NPS',n.v,function(v){return fN(v);},'pts','down']); cols.push(['Respostas',n.n,function(v){return fN(v);},'rel','x']); }
  (e.extra||[]).forEach(function(x){ var v=x.s&&x.s[per]; if(!v||!v.some(function(n){return n!=null&&n!==0;})) return; var f=x.pct?function(n){return fN(n,1)+'%';}:function(n){return fN(n);}; h+=chartBox(x.l,v,{kind:x.kind,worse:x.worse,type:'bar',fmt:f,goal:''}); cols.push([x.l,v,f,x.kind,x.worse]); });
  if(per==='semana'&&e.loja&&e.loja.semana){ h+=chartBox('Lojas: % positivas',e.loja.semana.pos,{kind:'pp',worse:'down',fmt:function(v){return fN(v,0)+'%';},goal:'Avaliações 4–5★; '+M.loja.txt}); cols.push(['Lojas % pos.',e.loja.semana.pos,function(v){return fN(v,0)+'%';},'pp','down']); }
  if(!cols.length) return h+'<div class="note">Este recorte ainda não tem série própria na visão por '+esc(P().nome)+'.</div>';
  h+='<h4>Tabela do período</h4><div class="box">'+wkTable(cols,P().lab)+'</div>';
  return h;
}
function tabResumo(a,isSub){
  var h=isSub?'<div class="note">A análise semanal é do produto; a aba Indicadores mostra o subproduto quando há dado.</div>':'';
  h+='<h4>O que os clientes dizem <span class="src ia">Análise IA</span></h4><div class="box"><ul class="b">'+sents(a.clientes).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  h+='<h4>O que mudou na semana</h4><div class="box"><ul class="b">'+sents(a.mudou).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  if(a.atencao&&a.atencao.length) h+='<h4>Com o que se preocupar</h4><div class="box" style="border-left:4px solid var(--orange)"><ul class="b">'+a.atencao.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  return h;
}
function tabDest(id,a){
  var G=[['novos','Temas novos','var(--sky)'],['oport','Oportunidades','var(--green)'],['agir','Atenção imediata','var(--red)']], h='', any=false;
  G.forEach(function(g){ var L=(IAcur()[g[0]]||[]).filter(function(x){return x.p===id||(x.ps||[]).indexOf(id)>=0;}); if(!L.length) return; any=true;
    h+='<h4><i style="width:12px;height:12px;border-radius:3px;display:inline-block;background:'+g[2]+'"></i>'+g[1]+' <span class="src ia">Análise IA</span></h4>'+L.map(function(x){ return '<div class="box"><b>'+esc(x.t)+'</b><div><span style="display:inline-block;margin:6px 0;font-size:13px;font-weight:700;background:#eef2f8;border-radius:6px;padding:2px 8px">'+esc(x.m)+'</span></div><p style="margin:0">'+esc(x.x)+'</p>'+stHtml(x)+'</div>'; }).join(''); });
  var alta=(a.motivos||[]).filter(function(m){ var v=parseFloat(String(m.var||'').replace('−','-').replace('%','')); return m.n>=30&&v>=40; });
  if(alta.length){ any=true; h+='<h4>Motivos de contato em alta na semana <span class="src db">Databricks</span></h4><div class="box"><ul class="b">'+alta.map(function(m){ return '<li><b>'+esc(m.t)+'</b>: '+fN(m.n)+' contatos ('+esc(m.var)+' contra '+fN(m.ant)+')</li>'; }).join('')+'</ul></div>'; }
  if(a.analise&&a.analise.atencao&&a.analise.atencao.length){ any=true; h+='<h4>Pontos de atenção do produto <span class="src ia">Análise IA</span></h4><div class="box" style="border-left:4px solid var(--orange)"><ul class="b">'+a.analise.atencao.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'; }
  return any?h:'<div class="note">Sem destaques para este produto na semana.</div>';
}
function tabMot(m){
  if(!m.length) return '<div class="note">Sem motivos de contato com volume relevante.</div>';
  var mx=Math.max.apply(null,m.map(function(x){return x.n;}));
  return '<h4>Por que os clientes procuram o suporte <span class="src db">Databricks</span> <span class="src ia">Análise IA</span></h4><p class="sub" style="margin:0 0 8px">Motivos da semana com variação contra a semana anterior. Clique em um motivo para ver as reclamações, dúvidas e problemas lidos nas transcrições.</p><div class="box">'+m.map(function(x,i){ var d=x.det, up=/^\+/.test(x.var||'');
    var det=d?('<div class="mdet" id="md'+i+'"><h5>Resumo</h5><p>'+esc(d.res)+'</p>'+(d.dor&&d.dor.length?'<h5>Principais reclamações, dúvidas e problemas</h5><ul class="b">'+d.dor.map(function(t){return '<li>'+esc(String(t).replace(/<\/?b>/g,''))+'</li>';}).join('')+'</ul>':'')+(d.exp?'<h5>O que o cliente espera</h5><p>'+esc(d.exp)+'</p>':'')+(d.falha&&d.falha.length?'<h5>Onde o processo falha</h5><ul class="b">'+d.falha.map(function(f){return '<li><b>'+esc(f[0])+':</b> '+esc(f[1])+'</li>';}).join('')+'</ul>':'')+(d.ex&&d.ex.length?'<h5>Exemplos de tickets</h5>'+exHtml(d.ex):'')+'<p class="foot">Análise feita sobre as conversas do motivo na semana.</p>'+'</div>')
      :'<div class="mdet" id="md'+i+'">'+(x.ex&&x.ex.length?'<h5>Exemplos de tickets</h5>'+exHtml(x.ex):'<p class="foot">Este motivo ainda não tem leitura de transcrições nesta semana.</p>')+'</div>';
    return '<div class="mot"><button type="button" aria-expanded="false" aria-controls="md'+i+'"><span>'+esc(x.t)+'</span><b>'+fN(x.n)+'</b><span class="'+(up?'up':'dn')+'" style="text-align:right;font-size:13px">'+esc(x.var||'')+' <small style="color:var(--muted)">('+fN(x.ant)+')</small></span><span class="chev" aria-hidden="true">›</span></button><div class="bar"><i style="width:'+(x.n*100/mx).toFixed(1)+'%"></i></div>'+det+'</div>'; }).join('')+'</div>';
}
function tabMenc(id,a){
  var e=dbp(id), M=a.mencoes||{}, rows=[];
  function row(l,arr,tom,lbl,worse){ var k=cmp(arr,'rel'), kn=tom?cmp(tom,'pp'):null; if(k.c==null) return; rows.push('<tr><td>'+esc(l)+'</td><td>'+fN(k.c)+'</td><td><span class="eq">'+esc(k.d==null?'—':fmtD(k,'rel'))+'</span></td><td>'+(kn&&kn.c!=null?fN(kn.c,0)+'% '+lbl+' <span class="'+cls(kn.d,worse)+'">('+esc(fmtD(kn,'pp'))+')</span>':'—')+'</td></tr>'); }
  if(e.nps&&e.nps[per]) row('NPS Transacional (respostas)',e.nps[per].n,null);
  if(e.loja&&e.loja[per]) row('Lojas de apps',e.loja[per].n,e.loja[per].pos,'positivas','down');
  if(e.rede&&e.rede[per]) row('Redes sociais',e.rede[per].n,e.rede[per].neg,'negativas','up');
  if(e.ra&&e.ra[per]) row('Reclame Aqui',e.ra[per],null);
  var h='<h4>Menções nos canais <span class="src db">Databricks</span> <span class="src ia">Análise IA</span></h4>';
  if(M.texto) h+='<div class="sum"><p><span class="lbl">Análise da '+esc(IA.semana.w)+'</span>'+esc(M.texto)+'</p></div>';
  if(rows.length) h+='<div class="box"><div class="tbl"><table class="wk"><tr><th>Canal</th><th>Menções '+({dia:'no dia',semana:'na semana',mes:'no mês'})[per]+'</th><th>Variação</th><th>Tom</th></tr>'+rows.join('')+'</table></div><p class="foot">Lojas e redes identificam o produto pelo texto do comentário; o Reclame Aqui usa a vertical da HugMe e, sem ela, o texto da reclamação.</p></div>';
  if(M.ra&&M.ra.length) h+='<h4>Exemplos do Reclame Aqui</h4><div class="box">'+exHtml(M.ra,'neg')+'</div>';
  return h;
}
function tabTemas(t,ex){
  var by={}; t.forEach(function(x){ (by[x.canal]=by[x.canal]||[]).push(x); });
  Object.keys(ex||{}).forEach(function(c){ if(ex[c]&&ex[c].length&&!by[c]) by[c]=[]; });
  if(!Object.keys(by).length) return '<div class="note">Sem comentários suficientes nesta semana.</div>';
  return Object.keys(by).map(function(c){ return '<h4>'+esc(c)+' <span class="src ia">Análise IA</span></h4><div class="box">'+by[c].map(function(x){ return '<div class="tema '+esc(x.tom||'')+'"><b>'+esc(x.t)+'</b><small>'+fN(x.n)+' menções</small>'+(x.x?'<p>'+esc(x.x)+'</p>':'')+'</div>'; }).join('')+((ex&&ex[c]&&ex[c].length)?'<h5 style="font-size:13.5px;color:var(--navy);margin:12px 0 4px">Exemplos da semana</h5>'+exHtml(ex[c],'neg'):'')+'</div>'; }).join('');
}
function tabMov(e){
  if(!e.length) return '<div class="note">Sem movimentos registrados.</div>';
  return '<div class="tl">'+e.map(function(x){ return '<div class="ev'+(/pico|incidente/i.test(x.tag||'')?' hot':'')+'"><div class="evb"><div class="d">'+esc(x.d)+'<small>'+esc(x.tag||'')+'</small></div><div class="r" style="color:var(--ink);font-size:14px">'+esc(x.t)+'</div></div></div>'; }).join('')+'</div>';
}

/* -------- jornada do cliente por produto (queries "Jornada Produtos" e "Jornada Exemplos") -------- */
var AT=['atendimento','Atendimento e suporte','🎧'];
var JET={
 cartao:[['contratacao','Contratação e aprovação','📝'],['ativacao','Recebimento e ativação','📦'],['limite','Limite','📈'],['uso','Uso e compras','🛍️'],['fatura','Fatura e pagamento','🧾'],['beneficios','Benefícios','🎁'],['custos','Custos e tarifas','💸'],AT,['seguranca','Segurança e fraude','🛡️'],['decisao','Decisão de uso','⚖️'],['encerramento','Encerramento','🚪']],
 pix:[['chave','Chave e cadastro','🔑'],['envio','Envio e pagamento','📤'],['recebimento','Recebimento','📥'],['rapidez','Rapidez','⚡'],['falhas','Erros e instabilidade','⚠️'],['limite','Limite','📈'],['cartao','Pix com cartão','💳'],['custos','Custos e tarifas','💸'],['seguranca','Segurança e devolução','🛡️'],AT],
 emprestimo:[['oferta','Oferta e simulação','🔎'],['contratacao','Contratação','✍️'],['recebimento','Recebimento do dinheiro','💰'],['parcelas','Parcelas e pagamento','🗓️'],['juros','Juros e custos','💸'],['limite','Limite e nova oferta','📈'],['cartao','Cartão e fatura','💳'],['cobranca','Cobrança e atraso','📣'],AT],
 t2p:[['ativacao','Ativação','🔓'],['venda','Venda por aproximação','📲'],['recebimento','Recebimento','💰'],['taxas','Taxas','💸'],['limite','Limite no cartão','💳'],['resgate','Resgate e transferência','🔁'],AT],
 link:[['criar','Criação do link','🔗'],['pagamento','Pagamento do cliente','💳'],['recebimento','Recebimento','💰'],['taxas','Taxas','💸'],['cancelamento','Cancelamento e estorno','↩️'],AT],
 conta:[['abertura','Abertura e cadastro','📝'],['validacao','Validação de identidade','🤳'],['acesso','Acesso e senha','🔑'],['app','Uso do app','📱'],['dados','Atualização de dados','✏️'],['seguranca','Segurança','🛡️'],['encerramento','Encerramento','🚪'],AT],
 seguros:[['oferta','Oferta e adesão','📝'],['cobranca','Cobrança','💸'],['cobertura','Cobertura e acionamento','🛡️'],['cancelamento','Cancelamento e estorno','↩️'],AT],
 cdb:[['aplicacao','Aplicação','📥'],['rendimento','Rendimento','📈'],['resgate','Resgate','💰'],['cartao','Garantia do cartão','💳'],['acompanhamento','Acompanhamento','🔍'],AT],
 transp:[['cadastro','Cadastro do bilhete','🎫'],['recarga','Recarga','🔄'],['confirmacao','Crédito no bilhete','✅'],['pagamento','Pagamento','💳'],['praticidade','Praticidade','⚡'],['estorno','Estorno','↩️'],AT],
 fraude:[['bloqueio','Bloqueio','🔒'],['motivo','Motivo e aviso','💬'],['prazo','Prazo e liberação','⏳'],['analise','Análise e documentos','📄'],['contestacao','Contestação','⚖️'],['encerramento','Encerramento','🚪'],AT],
 boletos:[['pagamento','Pagamento de contas','🧾'],['cashback','Cashback','🎁'],['renda','Renda com boletos','💼'],['taxas','Taxas','💸'],['compensacao','Comprovante e compensação','✅'],AT],
 topup:[['recarga','Recarga','📱'],['pagamento','Pagamento','💳'],['credito','Crédito no celular','✅'],['bonus','Bônus e cashback','🎁'],AT]
};
var JOR=null, JEX=null, JSEL={};
function jorLoad(){
  if(JOR) return JOR; JOR={}; JEX={};
  PXrows('Jornada Produtos').forEach(function(r){ var p=r.produto, e=r.etapa, k=r.periodo==='atual'?'a':'b'; JOR[p]=JOR[p]||{}; JOR[p][e]=JOR[p][e]||{}; JOR[p][e][k]={n:Number(r.n)||0,pos:Number(r.pos)||0}; });
  PXrows('Jornada Exemplos').forEach(function(r){ JEX[r.produto]=JEX[r.produto]||{}; (JEX[r.produto][r.etapa]=JEX[r.produto][r.etapa]||[]).push(r); });
  return JOR;
}
function jorPct(d){ return d&&d.n?d.pos*100/d.n:null; }
function jorCol(p){ if(p==null) return {bg:'#eef2f8',fg:'#6b7890'}; var h=Math.round(Math.max(0,Math.min(1,(p-25)/55))*130); return {bg:'hsl('+h+',78%,88%)',fg:'hsl('+h+',62%,30%)'}; }
function jorDias(){ var f=function(d){ return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2); }, h=new Date(); h.setHours(0,0,0,0); return f(new Date(h-30*864e5))+' a '+f(new Date(h-864e5)); }
function tabJor(p){
  var J=jorLoad()[p], ET=JET[p]||[], c=cat(p);
  if(!J||!J._total||!J._total.a) return '<div class="note">A jornada aparece quando as queries “Jornada Produtos” e “Jornada Exemplos” rodarem no Arturito.</div>';
  var T=J._total.a, tp=jorPct(T), mx=null, mv=-1;
  ET.forEach(function(s){ var d=(J[s[0]]||{}).a; if(d&&d.n>mv){ mv=d.n; mx=s[0]; } });
  if(!JSEL[p]||!(J[JSEL[p]]||JSEL[p]==='_sem')) JSEL[p]=mx;
  var ok=ET.map(function(s){ var d=(J[s[0]]||{}).a; return d&&d.n>=10?{s:s,p:jorPct(d)}:null; }).filter(Boolean).sort(function(x,y){return y.p-x.p;});
  var b='<div class="jr"><div class="jr-h"><b>Jornada do cliente em '+esc(c.name)+' · como está a experiência em cada etapa</b>'+
    '<p>Comentários de NPS Transacional, NPS Relacional e lojas de apps dos últimos 30 dias ('+jorDias()+'). A cor mostra a % de feedbacks positivos; um mesmo comentário pode estar em mais de uma etapa. Clique em uma etapa para ver a análise e os comentários.</p>'+
    '<div class="jr-kp"><span><b>'+fN(T.n)+'</b> feedbacks</span><span><b>'+(tp==null?'—':fN(tp,0)+'%')+'</b> positivos</span>'+(ok.length>1?'<span>Melhor etapa: <b>'+raw(ok[0].s[1])+'</b> ('+fN(ok[0].p,0)+'%)</span><span>Pior etapa: <b>'+raw(ok[ok.length-1].s[1])+'</b> ('+fN(ok[ok.length-1].p,0)+'%)</span>':'')+'</div>'+
    (T.n<30?'<div class="note">Poucos comentários citam este produto nos últimos 30 dias ('+fN(T.n)+'). Leia a jornada como indicação.</div>':'')+'</div>';
  b+='<div class="jr-wrap"><div class="jr-strip" role="list">'+ET.map(function(s,i){
      var d=(J[s[0]]||{}).a||{n:0,pos:0}, pp=jorPct(d), cc=jorCol(d.n>=5?pp:null), sh=T.n?d.n*100/T.n:0;
      return '<button type="button" role="listitem" class="jr-st'+(JSEL[p]===s[0]?' on':'')+'" data-jor="'+p+'|'+s[0]+'" style="--bg:'+cc.bg+';--fg:'+cc.fg+'" aria-pressed="'+(JSEL[p]===s[0])+'">'+(s[0]===mx?'<span class="jr-max">Maior volume</span>':'')+
        '<span class="jr-chev'+(i===0?' first':'')+'"><span class="jr-ic" aria-hidden="true">'+s[2]+'</span></span><span class="jr-num">'+(i+1)+'</span><span class="jr-nm">'+esc(s[1])+'</span>'+
        '<span class="jr-v">'+fN(d.n)+'</span><span class="jr-sh">'+fN(sh,0)+'% do total</span><span class="jr-pp">'+(d.n>=5&&pp!=null?fN(pp,0)+'%<small>positivos</small>':(d.n?'base<small>pequena</small>':'sem<small>feedbacks</small>'))+'</span></button>';
    }).join('');
  var S=(J._sem||{}).a||{n:0,pos:0};
  b+='<button type="button" class="jr-st jr-sem'+(JSEL[p]==='_sem'?' on':'')+'" data-jor="'+p+'|_sem"><span class="jr-chev"><span class="jr-ic" aria-hidden="true">❔</span></span><span class="jr-num">·</span><span class="jr-nm">Sem etapa identificada</span><span class="jr-v">'+fN(S.n)+'</span><span class="jr-sh">'+fN(T.n?S.n*100/T.n:0,0)+'% do total</span><span class="jr-pp">'+(S.n>=5?fN(jorPct(S),0)+'%<small>positivos</small>':'')+'</span></button></div></div>';
  b+='<div class="jr-leg"><span>Menos positivos</span><i></i><span>Mais positivos</span><small>Cinza: menos de 5 feedbacks na etapa.</small></div>';
  b+='<div class="jr-det" id="jr-det">'+jorDet(p,JSEL[p])+'</div>';
  return b;
}
function jorDet(p,e){
  var J=jorLoad()[p]||{}, T=(J._total||{}).a||{n:0,pos:0}, Tb=(J._total||{}).b, ET=JET[p]||[], s=ET.filter(function(x){return x[0]===e;})[0], d=(J[e]||{}).a||{n:0,pos:0}, pr=(J[e]||{}).b;
  if(e==='_sem') return '<h4>Sem etapa identificada</h4><div class="box"><p style="margin:0">'+fN(d.n)+' comentários ('+fN(T.n?d.n*100/T.n:0,0)+'% do total) não citam nenhuma etapa: em geral são avaliações curtas (“ótimo”, “prático”, “ruim”). Eles entram no total e na % positiva do produto.</p></div>';
  if(!s) return '';
  var pp=jorPct(d), tp=jorPct(T), t=fN(d.n)+' feedbacks citam '+s[1].toLowerCase()+' nos últimos 30 dias ('+fN(T.n?d.n*100/T.n:0,0)+'% dos '+fN(T.n)+' do produto).';
  if(d.n>=5&&pp!=null&&tp!=null){ var df=pp-tp; t+=' '+fN(pp,0)+'% são positivos, '+(Math.abs(df)<1?'em linha com':fN(Math.abs(df),0)+' pp '+(df>0?'acima':'abaixo')+' d')+'a média do produto ('+fN(tp,0)+'%).'; }
  if(pr&&pr.n>=5&&d.n>=5){ var vn=(d.n-pr.n)*100/pr.n, vp=pp-jorPct(pr); t+=' Contra os 30 dias anteriores, o volume '+(Math.abs(vn)<1?'fica estável':(vn>0?'sobe ':'cai ')+fN(Math.abs(vn),0)+'%')+' e a parcela positiva '+(Math.abs(vp)<1?'se mantém':(vp>0?'sobe ':'cai ')+fN(Math.abs(vp),1)+' pp')+'.'; }
  if(d.n<10) t+=' Base pequena: leia como indicação.';
  var ia=((IA.produtos[p]||{}).jornada||{})[e];
  var L=((JEX||{})[p]||{})[e]||[], m=function(r){ return {t:r.texto,m:r.fonte+' · '+(r.fonte==='Loja de apps'?'usuário ':'usuário ')+r.u+' · '+r.data+' · nota '+r.nota}; };
  var pos=L.filter(function(r){return String(r.pos)==='1';}).map(m), neg=L.filter(function(r){return String(r.pos)!=='1';}).map(m);
  return '<h4>'+raw(s[2]+' '+s[1])+' <span class="src db">Databricks</span></h4><div class="box"><p style="margin:0">'+raw(t)+'</p></div>'+
    (ia?'<div class="box"><span class="src ia">Análise IA</span> '+esc(ia)+'</div>':'')+
    (neg.length||pos.length?'<div class="jr-ex"><div><h5>O que criticam</h5>'+(neg.length?exHtml(neg):'<p class="foot">Sem críticas com texto nesta etapa.</p>')+'</div><div><h5>O que elogiam</h5>'+(pos.length?exHtml(pos):'<p class="foot">Sem elogios com texto nesta etapa.</p>')+'</div></div>':'<p class="foot">Sem comentários com texto para mostrar nesta etapa.</p>');
}
document.addEventListener('click',function(ev){ var b=ev.target.closest('[data-jor]'); if(!b) return; var k=b.getAttribute('data-jor').split('|'); JSEL[k[0]]=k[1];
  [].forEach.call(document.querySelectorAll('.jr-st'),function(x){ var on=x.getAttribute('data-jor')===k[0]+'|'+k[1]; x.classList.toggle('on',on); x.setAttribute('aria-pressed',on); });
  var dd=document.getElementById('jr-det'); if(dd) dd.innerHTML=jorDet(k[0],k[1]); });
var TABS=[['dest','Destaques'],['jor','Jornada'],['resumo','Resumo'],['ind','Indicadores'],['mot','Motivos de contato'],['temas','O que dizem'],['mov','Movimentos']];
function renderProduct(){
  var c=cat(st.p), e=dbp(st.p), a=IA.produtos[st.p]||{analise:{},motivos:[],temas:[],eventos:[]};
  var sub=st.sub?c.subs.filter(function(s){return s.id===st.sub;})[0]:null, se=sub?((e.subs||{})[sub.id]||{}):e;
  var asb=sub&&a.subs&&a.subs[sub.id]; if(asb) a=Object.assign({},a,asb);
  $('#ptitle').textContent=c.name+(sub?' · '+sub.name:'');
  $('#psubs').innerHTML=c.subs.length?('<button type="button" data-sub="" aria-pressed="'+(!sub)+'">Todos</button>'+c.subs.map(function(s){return '<button type="button" data-sub="'+s.id+'" aria-pressed="'+(!!sub&&sub.id===s.id)+'">'+raw(s.name)+'</button>';}).join('')):'';
  $('#ptabs').innerHTML=TABS.map(function(t){return '<button type="button" role="tab" data-tab="'+t[0]+'" aria-selected="'+(t[0]===st.tab)+'">'+t[1]+'</button>';}).join('');
  var b='';
  if(st.tab==='dest') b=tabDest(st.p,a);
  if(st.tab==='jor') b=tabJor(st.p);
    if(st.tab==='resumo') b=tabResumo(a.analise||{},!!sub&&!asb);
  if(st.tab==='ind') b=tabInd(se);
  if(st.tab==='mot') b=tabMot(a.motivos||[]);
  if(st.tab==='temas') b=tabMenc(st.p,a)+tabTemas(a.temas||[],a.exemplos||{});
  if(st.tab==='mov') b=tabMov(a.eventos||[]);
  $('#pbody').innerHTML=b; $('#pbody').scrollTop=0;
}
function openProduct(id,tab){ if(!cat(id)) return; st={p:id,sub:null,tab:tab||'dest',ev:null}; renderProduct(); openPanel(); }
function openEvent(k){
  var e=IA.eventos[k]; if(!e) return; st={p:null,sub:null,tab:null,ev:k};
  $('#ptitle').textContent=e.t; $('#psubs').innerHTML=''; $('#ptabs').innerHTML='';
  var b='<div class="box"><b style="font-family:var(--fc);font-size:20px">'+esc(e.d)+'</b> '+esc(e.tipo||'')+' <span class="src ia">Análise IA</span><p style="margin:6px 0 0">'+esc(e.res||'')+'</p></div>';
  b+='<h4>Efeito nos canais</h4><div class="box"><div class="tbl"><table class="wk"><tr><th>Canal</th><th style="text-align:left">O que mudou</th><th>Leitura</th></tr>'+(e.imp||[]).map(function(i){ return '<tr><td><b>'+esc(i[0])+'</b></td><td style="text-align:left">'+esc(i[2])+'</td><td><span class="flag '+(i[1]==='Crítico'?'c':(i[1]==='Atenção'?'a':'o'))+'">'+esc(i[1])+'</span></td></tr>'; }).join('')+'</table></div></div>';
  if(e.analise) b+='<h4>Análise</h4><div class="box"><ul class="b">'+sents(e.analise).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  if(e.marca) b+='<h4>Impacto para o RecargaPay</h4><div class="box"><ul class="b">'+sents(e.marca).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  if(e.pred) b+='<h4>O que esperar</h4><div class="box" style="border-left:4px solid var(--yellow)"><ul class="b">'+sents(e.pred).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  $('#pbody').innerHTML=b; $('#pbody').scrollTop=0; openPanel();
}
panel.addEventListener('click',function(e){
  var t=e.target.closest('button[data-tab]'); if(t&&st.p){ st.tab=t.getAttribute('data-tab'); renderProduct(); return; }
  var s=e.target.closest('button[data-sub]'); if(s&&st.p){ st.sub=s.getAttribute('data-sub')||null; if(st.sub&&(st.tab==='resumo'||st.tab==='dest')) st.tab='ind'; renderProduct(); return; }
  var gt=e.target.closest('[data-goto]'); if(gt){ openProduct(gt.getAttribute('data-goto')); return; }
  var m=e.target.closest('.mot>button'); if(m){ var w=m.parentNode, o=!w.classList.contains('open'); w.classList.toggle('open',o); m.setAttribute('aria-expanded',o); }
});
document.addEventListener('click',function(e){
  if(panel.contains(e.target)) return;
  var kp=e.target.closest('[data-kpi]'); if(kp){ openKpi(kp.getAttribute('data-kpi')); return; }
  var o0=e.target.closest('[data-open]'), tm0=e.target.closest('[data-tema],[data-ratema]'); if(o0&&tm0&&tm0.contains(o0)){ openProduct(o0.getAttribute('data-open'),o0.getAttribute('data-tab')||null); return; }
  var rt=e.target.closest('[data-ratema]'); if(rt){ var T=(IA.ra.temas||[])[Number(rt.getAttribute('data-ratema'))]; if(T) openTema({_g:'ra',t:'Reclame Aqui: '+T.t,p:T.p,det:T.det,serie:{l:'Reclamações do tema por semana (HugMe)',v:T.v},ex:T.ex}); return; }
  var tm=e.target.closest('[data-tema]'); if(tm){ var pr=tm.getAttribute('data-tema').split('|'), g=pr[0], i=Number(pr[1]); var it=g.charAt(0)==='v'&&IA.vozes[g.slice(1)]?IA.vozes[g.slice(1)][i]:(IA.destaques[g]||[])[i]; if(it){ it._g=g; openTema(it); } return; }
  var o=e.target.closest('[data-open]'); if(o){ openProduct(o.getAttribute('data-open'),o.getAttribute('data-tab')||null); return; }
  var v=e.target.closest('[data-ev]'); if(v){ openEvent(Number(v.getAttribute('data-ev'))); }
});
var tip=$('#tip');
document.addEventListener('mousemove',function(e){ var t=e.target.closest&&e.target.closest('[data-tip]'); if(!t){ tip.style.opacity=0; return; } tip.textContent=t.getAttribute('data-tip'); tip.style.left=Math.min(window.innerWidth-290,e.clientX+12)+'px'; tip.style.top=(e.clientY+14)+'px'; tip.style.opacity=1; });
/* -------- periodo -------- */
function safe(f){ try{ f(); }catch(e){ if(window.console&&console.warn) console.warn('painel 156:',f.name,e); } }
function drawAll(){ safe(drawRadar); safe(drawKpis); safe(drawProds); safe(drawLR); if(st.p&&st.tab==='ind') safe(renderProduct); }
$('#per').addEventListener('click',function(e){ var b=e.target.closest('button[data-per]'); if(!b) return; per=b.getAttribute('data-per'); [].forEach.call(document.querySelectorAll('#per button'),function(x){x.setAttribute('aria-pressed',x===b);}); drawAll(); });
drawAll();
var links=[].slice.call(document.querySelectorAll('.nav a'));
var lockNav=0;
function setNav(id){ links.forEach(function(a){ a.classList.toggle('on',a.getAttribute('href')==='#'+id); }); }
links.forEach(function(a){ a.addEventListener('click',function(ev){ ev.preventDefault(); var id=a.getAttribute('href').slice(1), t=document.getElementById(id); setNav(id); lockNav=Date.now()+1200; if(t){ try{ t.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){ t.scrollIntoView(); } } }); });
var obs=new IntersectionObserver(function(es){ if(Date.now()<lockNav) return; es.forEach(function(en){ if(en.isIntersecting) setNav(en.target.id); }); },{rootMargin:'-70px 0px -70% 0px'});
['pulso','produtos','destaques','radar','indicadores','vozes','lojasredes','movimentos','dados'].forEach(function(id){ obs.observe(document.getElementById(id)); });

/* -------- aviso de dados e analise -------- */
function fmtDMY(iso){ return iso&&iso.length>=10?iso.slice(8,10)+'/'+iso.slice(5,7)+'/'+iso.slice(0,4):''; }
function drawBanner(){
  var s=D.status, el=$('#px-banner'), m=[];
  if(!el) return;
  if(s.semDados) m.push('<b>Aguardando a primeira carga de dados.</b> Os indicadores aparecem depois da próxima atualização diária do painel.');
  if(s.usouSnapshot) m.push('Indicadores de um <b>snapshot até '+fmtDMY(s.dadosAte)+'</b>. A carga diária assume sozinha assim que as queries rodarem.');
  var w=IA.semana&&IA.semana.w;
  if(w&&s.semanaDados&&w!==s.semanaDados) m.push('Análises de IA da <b>'+esc(w)+'</b>; indicadores até a <b>'+esc(s.semanaDados)+'</b>. As análises são atualizadas toda segunda-feira.');
  var lst=s.iaInvalidos.concat(s.iaFaltando);
  if(lst.length>=20) m.push('As análises de IA ainda não foram publicadas. Os indicadores abaixo já estão atualizados.');
  else if(lst.length) m.push('Parte da análise de IA está indisponível nesta carga ('+esc(lst.join(', '))+'). Os indicadores não são afetados.');
  el.innerHTML=m.map(function(x){ return '<p>'+x+'</p>'; }).join(''); el.hidden=!m.length;
}
drawBanner();
/* -------- rotas dos links da rotina: ...&r={chave}/rep -------- */
var ROUTE={'account':'conta','conta':'conta','cartao':'cartao','cartao/garantido':['cartao','cc_g'],'cartao/concedido':['cartao','cc_c'],'cartao/investimento':['cartao','cc_i'],'fraude':'fraude','fraude/conta desativada':['fraude','f_conta'],'fraude/carteira desativada':['fraude','f_cart'],'fraude/chargeback recovery':['fraude','f_chb'],'cdb':'cdb','outros/cashback e rendimento':'cdb','outros/movimentações financeiras':'conta','transporte':'transp','outros/utilities':'boletos','outros/topup':'topup','pix':'pix','pix/cartao':['pix','pix_cc'],'pix/out':['pix','pix_wallet'],'pix/wallet':['pix','pix_wallet'],'pix/in':['pix','pix_in'],'emprestimo':'emprestimo','emprestimo/pessoal':['emprestimo','emp_p'],'emprestimo/consignado':['emprestimo','emp_c'],'t2p':'t2p','link':'link','seguros':'seguros'};
function readRoute(){
  var srcs=[]; try{ srcs.push(document.referrer||''); }catch(e){} srcs.push(location.search||''); srcs.push(location.hash||'');
  for(var i=0;i<srcs.length;i++){ var m=/[?&#]r=([^&#]*)/.exec(srcs[i]); if(m){ try{ return decodeURIComponent(m[1]); }catch(e){ return m[1]; } } }
  return '';
}
function applyRoute(){
  var segs=readRoute().toLowerCase().split('/').filter(function(x){ return x!==''&&['rep','ind','mot','dia','semana','mes'].indexOf(x)<0; });
  if(!segs.length) return;
  var t=ROUTE[segs.slice(0,2).join('/')]; if(t===undefined) t=ROUTE[segs[0]]; if(!t) return;
  var pid=Array.isArray(t)?t[0]:t, sid=Array.isArray(t)?t[1]:null;
  openProduct(pid); if(sid&&st.p){ st.sub=sid; st.tab='ind'; renderProduct(); }
}
try{ applyRoute(); }catch(e){}
})();
