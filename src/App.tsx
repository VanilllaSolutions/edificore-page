
import { useState, useEffect, useCallback } from "react";

/* ============================================================
   CONFIGURAÇÃO — edite aqui os dados da empresa (usados nas páginas)
   Itens entre [colchetes] são placeholders: preencha antes de publicar.
   Deixe whatsapp vazio ("") para esconder o canal.
   ============================================================ */
const CONFIG = {
  empresa: "Vanilla Solutions",
  razaoSocial: "[Razão social]",
  cnpj: "[CNPJ]",
  emailContato: "contato@edificore.com.br",
  emailSuporte: "suporte@edificore.com.br",
  emailPrivacidade: "privacidade@edificore.com.br",
  whatsapp: "",                 // somente dígitos com DDI. Ex.: 5551999999999
  whatsappLabel: "",            // Ex.: (51) 99999-9999
  horario: "Segunda a sexta, em horário comercial",
  prazoContato: "24 horas",
  prazoSuporte: "1 dia útil",
  foro: "[Comarca/UF]",
  atualizadoEm: "[data da publicação]",
  mostrarAvisoRevisao: true,    // avisa nas páginas jurídicas que o texto ainda precisa de revisão
};

/* ============================================================
   CSS (escopado em .eh)
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap');

.eh { --primary:#D35400; --primary-dark:#b84a00; --accent:#FAD7A0; --secondary:#E67E22; --dark:#1C2433;
  --bg:#F4F6F8; --surface:#fff; --border:#E8ECF0; --text:#1a1a1a; --text-2:#555; --text-3:#999;
  --green:#1e8449; --yellow:#b7950b; --red:#c0392b; --blue:#1a6fa0;
  font-family:'Inter',sans-serif; background:var(--surface); color:var(--text); overflow-x:hidden; -webkit-text-size-adjust:100%; }
.eh *, .eh *::before, .eh *::after { box-sizing:border-box; margin:0; padding:0; }
.eh section { scroll-margin-top:64px; }
.eh a { color:inherit; }
.eh .container { max-width:1100px; margin:0 auto; padding:0 24px; }

/* NAV */
.eh .site-nav { position:fixed; top:0; left:0; right:0; z-index:100; background:rgba(28,36,51,.97); backdrop-filter:blur(12px); border-bottom:1px solid rgba(255,255,255,.06); }
.eh .nav-inner { max-width:1100px; margin:0 auto; padding:0 24px; height:64px; display:flex; align-items:center; justify-content:space-between; position:relative; }
.eh .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; cursor:pointer; background:none; border:none; }
.eh .brand { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; }
.eh .brand span:first-child { color:var(--primary); }
.eh .brand span:last-child { color:var(--secondary); }
.eh .nav-links { display:flex; align-items:center; gap:26px; }
.eh .nav-links a { font-size:13px; font-weight:500; color:rgba(255,255,255,.65); text-decoration:none; cursor:pointer; }
.eh .nav-links a:hover { color:#fff; }
.eh .nav-links a.nav-cta { padding:8px 20px; background:var(--primary); color:#fff; border-radius:8px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; }
.eh .nav-links a.nav-cta:hover { background:var(--primary-dark); }
.eh .nav-toggle { display:none; width:44px; height:44px; background:none; border:none; cursor:pointer; flex-direction:column; align-items:center; justify-content:center; gap:5px; margin-right:-10px; }
.eh .nav-toggle span { width:22px; height:2px; background:#fff; border-radius:2px; transition:transform .2s, opacity .2s; }
.eh .nav-toggle.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.eh .nav-toggle.open span:nth-child(2) { opacity:0; }
.eh .nav-toggle.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

/* HERO */
.eh .hero { background:var(--dark); padding:130px 0 90px; position:relative; overflow:hidden; }
.eh .hero-deco-1 { position:absolute; width:600px; height:600px; border-radius:50%; background:var(--primary); opacity:.07; top:-200px; right:-150px; }
.eh .hero-deco-2 { position:absolute; width:400px; height:400px; border-radius:50%; background:var(--secondary); opacity:.05; bottom:-100px; left:-100px; }
.eh .hero-top { text-align:center; max-width:720px; margin:0 auto 56px; position:relative; z-index:1; }
.eh .hero-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(211,84,0,.15); border:1px solid rgba(211,84,0,.3); color:var(--accent); padding:6px 14px; border-radius:20px; font-size:12px; font-weight:600; margin-bottom:20px; font-family:'Plus Jakarta Sans',sans-serif; }
.eh .hero-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:52px; font-weight:800; color:#fff; line-height:1.12; margin-bottom:18px; }
.eh .hero-title span { color:var(--primary); }
.eh .hero-desc { font-size:16px; color:rgba(255,255,255,.55); line-height:1.75; margin-bottom:32px; }
.eh .hero-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.eh .btn-hero { padding:14px 28px; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; border:none; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; transition:all .15s; min-height:46px; }
.eh .btn-hero-primary { background:var(--primary); color:#fff; }
.eh .btn-hero-primary:hover { background:var(--primary-dark); transform:translateY(-1px); box-shadow:0 8px 24px rgba(211,84,0,.3); }
.eh .btn-hero-outline { background:none; border:1.5px solid rgba(255,255,255,.2); color:rgba(255,255,255,.8); }
.eh .btn-hero-outline:hover { border-color:rgba(255,255,255,.5); color:#fff; }
.eh .hero-shot-wrap { max-width:940px; margin:0 auto; position:relative; z-index:1; }
.eh .hero-shot-wrap .browser { box-shadow:0 30px 80px rgba(0,0,0,.45); }
.eh .float-badge { position:absolute; background:#fff; border-radius:10px; padding:8px 12px; box-shadow:0 8px 24px rgba(0,0,0,.25); display:flex; align-items:center; gap:8px; font-size:11px; font-weight:600; color:var(--text); animation:ehFloat 3s ease-in-out infinite; z-index:3; }
.eh .fb-1 { top:-14px; right:-18px; }
.eh .fb-2 { bottom:40px; left:-22px; animation-delay:1.5s; }
@keyframes ehFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

/* BROWSER + SHOTS */
.eh .browser { background:#fff; border-radius:14px; overflow:hidden; border:1px solid rgba(0,0,0,.08); }
.eh .browser-bar { background:#eef0f3; padding:9px 14px; display:flex; align-items:center; gap:12px; border-bottom:1px solid #e0e3e8; }
.eh .b-dots { display:flex; gap:6px; }
.eh .b-dot { width:9px; height:9px; border-radius:50%; display:block; }
.eh .b-url { flex:1; max-width:360px; margin:0 auto; background:#fff; border-radius:6px; padding:4px 12px; font-size:10px; color:var(--text-3); text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.eh .shot { display:flex; height:380px; background:var(--bg); text-align:left; }
.eh .s-side { width:150px; background:var(--dark); padding:12px 8px; flex-shrink:0; display:flex; flex-direction:column; gap:2px; }
.eh .s-logo { display:flex; align-items:center; gap:6px; padding:2px 6px 12px; font-size:12px; }
.eh .s-nav { display:flex; align-items:center; gap:7px; padding:6px 8px; border-radius:6px; font-size:10px; color:#8a9ab5; font-weight:500; }
.eh .s-nav.on { background:rgba(211,84,0,.18); color:var(--secondary); }
.eh .s-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
.eh .s-top { height:36px; background:#fff; border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; flex-shrink:0; }
.eh .s-body { padding:12px 14px; display:flex; flex-direction:column; gap:10px; overflow:hidden; }
.eh .s-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
.eh .s-kpi { background:#fff; border:1px solid var(--border); border-radius:8px; padding:8px 10px; }
.eh .s-kpi b { font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; display:block; line-height:1.1; }
.eh .s-kpi small { font-size:8.5px; color:var(--text-3); }
.eh .s-card { background:#fff; border:1px solid var(--border); border-radius:8px; padding:10px 12px; }
.eh .s-card h4 { font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; margin-bottom:8px; }
.eh .s-two { display:grid; grid-template-columns:1.3fr 1fr; gap:10px; }
.eh .s-obra { display:flex; align-items:center; gap:8px; margin-bottom:7px; font-size:9.5px; }
.eh .s-obra .nm { flex:1; font-weight:600; }
.eh .s-bar { width:80px; height:5px; background:#eee; border-radius:3px; overflow:hidden; }
.eh .s-bar i { display:block; height:100%; border-radius:3px; }
.eh .s-chart { display:flex; align-items:flex-end; gap:7px; height:78px; }
.eh .s-chart i { flex:1; border-radius:3px 3px 0 0; background:var(--accent); display:block; }
.eh .s-chart i.hi { background:var(--primary); }
.eh .pill { display:inline-block; padding:1px 7px; border-radius:10px; font-size:8.5px; font-weight:700; white-space:nowrap; }
.eh .p-g { background:#e8f8f0; color:var(--green); } .eh .p-y { background:#fef9e7; color:var(--yellow); }
.eh .p-o { background:#fef0e6; color:var(--primary); } .eh .p-r { background:#fdecea; color:var(--red); }
.eh .p-b { background:#eaf3fb; color:var(--blue); }
.eh .t-row { display:flex; align-items:center; gap:7px; padding:6px 8px; border-radius:6px; font-size:10px; }
.eh .t-row.root { font-weight:700; background:#fafbfc; }
.eh .t-row.sel { background:#fef0e6; }
.eh .t-row .n { flex:1; min-width:0; }
.eh .t-kids { margin-left:18px; border-left:2px solid var(--border); padding-left:8px; }
.eh .s-scroll { overflow-x:auto; }
.eh .s-table { width:100%; border-collapse:collapse; font-size:9.5px; min-width:360px; }
.eh .s-table th { text-align:left; font-size:8px; text-transform:uppercase; letter-spacing:.05em; color:var(--text-3); padding:6px 8px; background:#fafbfc; border-bottom:1px solid var(--border); white-space:nowrap; }
.eh .s-table td { padding:7px 8px; border-bottom:1px solid var(--border); white-space:nowrap; }
.eh .pdf-wrap { flex:1; background:#e4e7ec; display:flex; align-items:flex-start; justify-content:center; padding:14px; overflow:hidden; }
.eh .pdf-page { width:330px; max-width:100%; background:#fff; box-shadow:0 6px 20px rgba(0,0,0,.15); border-radius:3px; overflow:hidden; }
.eh .pdf-h { background:var(--primary); color:#fff; padding:12px 14px; }
.eh .pdf-h b { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; display:block; }
.eh .pdf-h small { font-size:8px; opacity:.8; }
.eh .pdf-sum { display:grid; grid-template-columns:repeat(3,1fr); background:#f8f4f1; border-bottom:2px solid var(--primary); padding:8px 14px; }
.eh .pdf-sum b { font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; color:var(--primary); display:block; }
.eh .pdf-sum small { font-size:7px; color:#888; }
.eh .pdf-body { padding:10px 14px; }
.eh .pdf-line { display:flex; justify-content:space-between; gap:8px; font-size:8px; padding:4px 0; border-bottom:1px solid #f0f0f0; }

/* SECTIONS */
.eh .section-tag { display:inline-block; background:#fef0e6; color:var(--primary); font-size:11px; font-weight:700; padding:4px 12px; border-radius:20px; text-transform:uppercase; letter-spacing:.08em; margin-bottom:14px; font-family:'Plus Jakarta Sans',sans-serif; }
.eh .section-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:36px; font-weight:800; line-height:1.2; margin-bottom:14px; }
.eh .section-desc { font-size:15px; color:var(--text-2); line-height:1.7; max-width:520px; }

.eh .showcase { padding:100px 0; background:var(--bg); }
.eh .showcase-head { text-align:center; margin-bottom:36px; }
.eh .showcase-head .section-desc { margin:0 auto; }
.eh .sc-tabs { display:flex; justify-content:center; gap:6px; margin-bottom:28px; flex-wrap:wrap; }
.eh .sc-tab { padding:10px 18px; min-height:42px; border-radius:22px; border:1.5px solid var(--border); background:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:12.5px; font-weight:700; color:var(--text-2); cursor:pointer; transition:all .15s; white-space:nowrap; }
.eh .sc-tab:hover { border-color:var(--primary); color:var(--primary); }
.eh .sc-tab.active { background:var(--primary); border-color:var(--primary); color:#fff; }
.eh .sc-stage { max-width:920px; margin:0 auto; }
.eh .sc-stage .browser { box-shadow:0 24px 60px rgba(28,36,51,.18); }
.eh .sc-caption { text-align:center; margin-top:20px; font-size:14px; color:var(--text-2); line-height:1.5; }
.eh .sc-caption strong { color:var(--text); font-family:'Plus Jakarta Sans',sans-serif; }

.eh .feat-row { padding:90px 0; }
.eh .feat-row.alt { background:var(--bg); }
.eh .feat-grid { display:grid; grid-template-columns:1fr 1.15fr; gap:56px; align-items:center; }
.eh .feat-grid.rev { grid-template-columns:1.15fr 1fr; }
.eh .feat-list { list-style:none; margin-top:22px; display:flex; flex-direction:column; gap:10px; }
.eh .feat-list li { display:flex; gap:10px; font-size:14px; color:var(--text-2); line-height:1.5; }
.eh .feat-list li::before { content:'✓'; width:20px; height:20px; border-radius:50%; background:#e8f8f0; color:var(--green); font-size:11px; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
.eh .feat-grid .browser { box-shadow:0 20px 50px rgba(28,36,51,.15); }
.eh .feat-grid .shot { height:340px; }

.eh .features { padding:100px 0; background:var(--surface); }
.eh .features-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:48px; }
.eh .feat-card { background:var(--bg); border:1px solid var(--border); border-radius:16px; padding:26px; transition:all .2s; }
.eh .feat-card:hover { border-color:var(--primary); box-shadow:0 8px 32px rgba(211,84,0,.08); transform:translateY(-3px); background:#fff; }
.eh .feat-icon { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:21px; margin-bottom:14px; flex-shrink:0; }
.eh .feat-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; margin-bottom:7px; }
.eh .feat-desc { font-size:13px; color:var(--text-2); line-height:1.6; }

.eh .how { padding:100px 0; background:var(--bg); }
.eh .steps { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin-top:52px; position:relative; }
.eh .steps::before { content:''; position:absolute; top:28px; left:10%; right:10%; height:2px; background:linear-gradient(90deg,var(--primary),var(--secondary)); opacity:.2; }
.eh .step { text-align:center; position:relative; z-index:1; }
.eh .step-num { width:56px; height:56px; border-radius:50%; background:var(--primary); color:#fff; font-family:'Plus Jakarta Sans',sans-serif; font-size:20px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 4px 16px rgba(211,84,0,.3); }
.eh .step-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; margin-bottom:8px; }
.eh .step-desc { font-size:13px; color:var(--text-2); line-height:1.6; }

.eh .modules { padding:100px 0; background:var(--dark); }
.eh .modules .section-title { color:#fff; }
.eh .modules .section-desc { color:rgba(255,255,255,.5); }
.eh .modules-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:44px; }
.eh .mod-item { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px; transition:all .15s; }
.eh .mod-item:hover { background:rgba(211,84,0,.1); border-color:rgba(211,84,0,.3); }
.eh .mod-icon { font-size:20px; }
.eh .mod-name { font-size:13px; font-weight:600; color:#fff; }
.eh .mod-sub { font-size:11px; color:rgba(255,255,255,.35); margin-top:1px; }

/* FORM */
.eh .form-section { padding:100px 0; background:var(--surface); }
.eh .form-inner { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:start; }
.eh .form-left { position:sticky; top:100px; }
.eh .form-promise { display:flex; flex-direction:column; gap:14px; margin-top:30px; }
.eh .fp-item { display:flex; gap:12px; }
.eh .fp-icon { width:32px; height:32px; border-radius:8px; background:#fef0e6; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
.eh .fp-item strong { display:block; font-size:13px; margin-bottom:2px; }
.eh .fp-item span { font-size:12px; color:var(--text-2); line-height:1.5; }
.eh .form-card { border:1.5px solid var(--border); border-radius:20px; padding:34px; box-shadow:0 8px 40px rgba(0,0,0,.07); background:#fff; }
.eh .form-card-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:20px; font-weight:800; margin-bottom:6px; }
.eh .form-card-sub { font-size:13px; color:var(--text-2); margin-bottom:24px; }
.eh .fgrid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px; }
.eh .fg2 { display:flex; flex-direction:column; gap:5px; }
.eh .fg2.span2 { grid-column:span 2; }
.eh .fl2 { font-size:12px; font-weight:600; color:var(--text-2); }
.eh .fi2 { padding:10px 13px; border:1.5px solid var(--border); border-radius:9px; font-size:13px; font-family:'Inter',sans-serif; background:#fafafa; outline:none; width:100%; color:var(--text); }
.eh .fi2:focus { border-color:var(--primary); background:#fff; box-shadow:0 0 0 3px rgba(211,84,0,.08); }
.eh .fi2.err { border-color:var(--red); background:#fff8f8; }
.eh .fe { font-size:11px; color:var(--red); }
.eh textarea.fi2 { resize:vertical; min-height:90px; }
.eh .btn-submit { width:100%; padding:14px; min-height:48px; background:var(--primary); color:#fff; border:none; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:800; cursor:pointer; }
.eh .btn-submit:hover { background:var(--primary-dark); }
.eh .btn-submit:disabled { opacity:.7; cursor:wait; }
.eh .form-note { font-size:11px; color:var(--text-3); text-align:center; margin-top:12px; }
.eh .form-success { text-align:center; padding:40px 20px; border:1.5px solid var(--border); border-radius:20px; }
.eh .form-success-icon { width:72px; height:72px; border-radius:50%; background:#e8f8f0; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 20px; }
.eh .form-success h3 { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; font-weight:800; margin-bottom:10px; }
.eh .form-success p { font-size:13px; color:var(--text-2); line-height:1.6; }

/* FOOTER */
.eh .site-footer { background:var(--dark); padding:56px 0 28px; }
.eh .footer-inner { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:48px; margin-bottom:44px; }
.eh .footer-logo { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.eh .footer-tagline { font-size:13px; color:rgba(255,255,255,.4); line-height:1.6; max-width:240px; }
.eh .footer-col-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; font-weight:700; color:rgba(255,255,255,.5); text-transform:uppercase; letter-spacing:.08em; margin-bottom:16px; }
.eh .footer-link { display:block; font-size:13px; color:rgba(255,255,255,.45); text-decoration:none; margin-bottom:10px; cursor:pointer; }
.eh .footer-link:hover { color:#fff; }
.eh .footer-bottom { display:flex; justify-content:space-between; padding-top:24px; border-top:1px solid rgba(255,255,255,.07); font-size:12px; color:rgba(255,255,255,.25); }
.eh .footer-bottom em { font-style:normal; color:var(--primary); }

.eh .mobile-cta { display:none; }

/* ===== PÁGINAS INTERNAS ===== */
.eh .page-hero { background:var(--dark); padding:118px 0 52px; position:relative; overflow:hidden; }
.eh .page-hero::after { content:''; position:absolute; width:420px; height:420px; border-radius:50%; background:var(--primary); opacity:.07; top:-160px; right:-120px; }
.eh .page-hero .container { position:relative; z-index:1; }
.eh .crumb { font-size:12px; color:rgba(255,255,255,.45); margin-bottom:18px; display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
.eh .crumb button { background:none; border:none; color:rgba(255,255,255,.65); cursor:pointer; font:inherit; }
.eh .crumb button:hover { color:#fff; }
.eh .page-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:40px; font-weight:800; color:#fff; line-height:1.15; margin-bottom:12px; max-width:760px; }
.eh .page-sub { font-size:16px; color:rgba(255,255,255,.55); line-height:1.7; max-width:640px; }
.eh .page-body { padding-top:56px; padding-bottom:90px; }
.eh .block { margin-bottom:56px; }
.eh .block-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:24px; font-weight:800; margin-bottom:14px; line-height:1.25; }
.eh .block-text { font-size:15px; color:var(--text-2); line-height:1.8; max-width:760px; margin-bottom:12px; }
.eh .cards-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-top:20px; }
.eh .cards-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:20px; }
.eh .split-2 { display:grid; grid-template-columns:1fr 1.25fr; gap:48px; align-items:start; }
.eh .channels { display:flex; flex-direction:column; gap:14px; }
.eh .channel { display:flex; gap:14px; align-items:flex-start; background:var(--bg); border:1px solid var(--border); border-radius:14px; padding:18px; }
.eh .ch-link { display:inline-block; margin-top:8px; font-size:13px; font-weight:700; color:var(--primary); text-decoration:none; word-break:break-all; }
.eh .ch-link:hover { text-decoration:underline; }
.eh .btn-line { display:inline-flex; align-items:center; justify-content:center; min-height:46px; padding:12px 22px; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:700; cursor:pointer; text-decoration:none; background:var(--primary); color:#fff; border:none; }
.eh .btn-line:hover { background:var(--primary-dark); }
.eh .btn-line.ghost { background:none; color:var(--text); border:1.5px solid var(--border); }
.eh .btn-line.ghost:hover { border-color:var(--primary); color:var(--primary); }
.eh .btn-row { display:flex; gap:10px; flex-wrap:wrap; margin-top:16px; }
.eh .cta-band { background:linear-gradient(135deg,var(--dark),#243047); border-radius:20px; padding:40px; display:flex; align-items:center; justify-content:space-between; gap:24px; }
.eh .cta-band h3 { font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; font-weight:800; color:#fff; margin-bottom:6px; }
.eh .cta-band p { font-size:14px; color:rgba(255,255,255,.55); line-height:1.6; }
.eh .cta-band .btn-row { margin-top:0; flex-shrink:0; }
.eh .cta-band .btn-line.ghost { color:#fff; border-color:rgba(255,255,255,.25); }
.eh .cta-band .btn-line.ghost:hover { border-color:#fff; color:#fff; }

.eh .faq { display:flex; flex-direction:column; gap:10px; max-width:820px; margin-top:18px; }
.eh .faq-item { border:1.5px solid var(--border); border-radius:12px; background:#fff; overflow:hidden; }
.eh .faq-item.open { border-color:var(--accent); }
.eh .faq-q { width:100%; display:flex; align-items:center; justify-content:space-between; gap:12px; text-align:left; background:none; border:none; padding:16px 18px; min-height:52px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:700; color:var(--text); cursor:pointer; }
.eh .faq-ic { width:26px; height:26px; border-radius:50%; background:var(--bg); display:flex; align-items:center; justify-content:center; font-size:16px; color:var(--primary); flex-shrink:0; }
.eh .faq-a { padding:0 18px 18px; font-size:14px; color:var(--text-2); line-height:1.75; }

.eh .notice { background:#fef9e7; border:1px solid #f0d060; color:#8a6d0b; border-radius:12px; padding:14px 16px; font-size:13px; line-height:1.6; max-width:760px; margin-bottom:28px; }
.eh .prose { max-width:760px; }
.eh .prose h2 { font-family:'Plus Jakarta Sans',sans-serif; font-size:19px; font-weight:800; margin:34px 0 10px; line-height:1.3; }
.eh .prose p { font-size:14.5px; color:var(--text-2); line-height:1.8; margin-bottom:10px; }
.eh .prose ul { padding-left:22px; list-style:disc; margin:6px 0 12px; }
.eh .prose li { font-size:14.5px; color:var(--text-2); line-height:1.8; margin-bottom:4px; }
.eh .meta-line { font-size:12.5px; color:var(--text-3); margin-bottom:4px; }

/* TABLET / MOBILE */
@media (max-width:860px) {
  .eh .container, .eh .nav-inner { padding-left:18px; padding-right:18px; }
  .eh .nav-toggle { display:flex; }
  .eh .nav-links { display:none; position:absolute; top:64px; left:0; right:0; flex-direction:column; align-items:stretch; gap:0; background:var(--dark); border-bottom:1px solid rgba(255,255,255,.08); padding:8px 18px 18px; }
  .eh .nav-links.open { display:flex; }
  .eh .nav-links a { font-size:15px; padding:14px 4px; border-bottom:1px solid rgba(255,255,255,.06); }
  .eh .nav-links a.nav-cta { margin-top:12px; text-align:center; border-bottom:none; padding:14px; font-size:14px; }

  .eh .hero { padding:96px 0 52px; }
  .eh .hero-top { margin-bottom:34px; }
  .eh .hero-title { font-size:34px; }
  .eh .hero-desc { font-size:15px; margin-bottom:26px; }
  .eh .hero-actions { flex-direction:column; }
  .eh .btn-hero { width:100%; min-height:50px; }
  .eh .float-badge { display:none; }

  .eh .showcase, .eh .features, .eh .how, .eh .modules, .eh .form-section { padding:64px 0; }
  .eh .feat-row { padding:52px 0; }
  .eh .section-title { font-size:27px; }
  .eh .section-desc { font-size:14px; max-width:none; }
  .eh .showcase-head { margin-bottom:24px; }

  .eh .sc-tabs { flex-wrap:nowrap; overflow-x:auto; justify-content:flex-start; margin:0 -18px 20px; padding:0 18px 4px; scrollbar-width:none; scroll-snap-type:x proximity; }
  .eh .sc-tabs::-webkit-scrollbar { display:none; }
  .eh .sc-tab { flex-shrink:0; scroll-snap-align:start; }

  .eh .s-side { display:none; }
  .eh .shot, .eh .feat-grid .shot { height:auto; max-height:330px; }
  .eh .s-body { padding:10px; }
  .eh .s-two { grid-template-columns:1fr; }
  .eh .s-bar { width:56px; }
  .eh .b-url { font-size:9px; }

  .eh .feat-grid, .eh .feat-grid.rev { grid-template-columns:1fr; gap:28px; }
  .eh .feat-grid.rev > div:first-child { order:2; }
  .eh .features-grid { grid-template-columns:1fr; gap:14px; margin-top:32px; }
  .eh .feat-card { padding:20px; }

  .eh .steps { grid-template-columns:1fr; gap:24px; margin-top:36px; }
  .eh .steps::before { display:none; }
  .eh .step { display:flex; gap:16px; text-align:left; align-items:flex-start; }
  .eh .step-num { width:44px; height:44px; font-size:17px; margin:0; flex-shrink:0; }

  .eh .modules-grid { grid-template-columns:1fr 1fr; gap:10px; margin-top:30px; }
  .eh .mod-item { padding:12px; gap:10px; }
  .eh .mod-sub { display:none; }

  .eh .form-inner { grid-template-columns:1fr; gap:36px; }
  .eh .form-left { position:static; }
  .eh .form-card { padding:22px 18px; border-radius:16px; }
  .eh .fgrid2 { grid-template-columns:1fr; }
  .eh .fg2.span2 { grid-column:auto; }
  .eh .fi2 { font-size:16px; padding:12px 14px; min-height:46px; }

  .eh .site-footer { padding:44px 0 96px; }
  .eh .footer-inner { grid-template-columns:1fr 1fr; gap:28px; margin-bottom:32px; }
  .eh .footer-inner > div:first-child { grid-column:span 2; }
  .eh .footer-bottom { flex-direction:column; gap:8px; text-align:center; }

  .eh .mobile-cta { display:block; position:fixed; left:0; right:0; bottom:0; z-index:90; padding:10px 14px calc(10px + env(safe-area-inset-bottom)); background:rgba(28,36,51,.97); border-top:1px solid rgba(255,255,255,.08); transform:translateY(110%); transition:transform .25s; }
  .eh .mobile-cta.show { transform:translateY(0); }
  .eh .mobile-cta button { width:100%; display:flex; align-items:center; justify-content:center; min-height:48px; background:var(--primary); color:#fff; border:none; border-radius:10px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:800; cursor:pointer; }

  .eh .page-hero { padding:96px 0 36px; }
  .eh .page-title { font-size:28px; }
  .eh .page-sub { font-size:14.5px; }
  .eh .page-body { padding-top:36px; padding-bottom:64px; }
  .eh .block { margin-bottom:44px; }
  .eh .block-title { font-size:21px; }
  .eh .cards-2, .eh .cards-3 { grid-template-columns:1fr; }
  .eh .split-2 { grid-template-columns:1fr; gap:32px; }
  .eh .cta-band { flex-direction:column; align-items:stretch; padding:26px 20px; border-radius:16px; }
  .eh .cta-band .btn-row { flex-direction:column; }
  .eh .btn-line { width:100%; }
  .eh .prose h2 { font-size:17.5px; }
}
@media (max-width:560px) {
  .eh .hero-title { font-size:30px; }
  .eh .s-kpis { grid-template-columns:1fr 1fr; }
  .eh .footer-inner { grid-template-columns:1fr; }
  .eh .footer-inner > div:first-child { grid-column:auto; }
}
@media (prefers-reduced-motion:reduce) {
  .eh .float-badge { animation:none; }
  .eh * { transition:none !important; }
}

body {
  margin: 0;
}
`;

/* ============================================================
   DADOS DA HOME
   ============================================================ */
const NAV_LINKS = [
  { id: "showcase", label: "O sistema" },
  { id: "features", label: "Funcionalidades" },
  { id: "modules", label: "Módulos" },
  { id: "how", label: "Como funciona" },
];

const SIDE_ITEMS = [
  ["🏠", "Início"], ["🏗️", "Obras"], ["🌳", "Etapas"], ["📦", "Lançamentos"],
  ["🏠", "Unidades"], ["👷", "Funcionários"], ["📊", "Relatórios"],
];

const ETAPAS = [
  { n: "1. Fundação", p: "100%", c: "p-g", sel: true, kids: [["1.1 Locação da obra", "100%", "p-g"], ["1.2 Escavação", "100%", "p-g"], ["1.3 Concretagem", "100%", "p-g"]] },
  { n: "2. Estrutura", p: "100%", c: "p-g" },
  { n: "3. Alvenaria", p: "65%", c: "p-y", kids: [["3.1 Paredes externas", "80%", "p-y"], ["3.2 Paredes internas", "45%", "p-y"]] },
  { n: "4. Instalações Elétricas", p: "20%", c: "p-o" },
  { n: "5. Acabamento", p: "0%", c: "p-b" },
];

const LANCAMENTOS = [
  ["08/01", "Cimento CP-II", "Fundação", "R$ 8.400", "Pago", "p-g"],
  ["10/01", "Areia grossa", "Fundação", "R$ 5.400", "Pago", "p-g"],
  ["05/02", "Aço CA-50", "Estrutura", "R$ 36.000", "Pago", "p-g"],
  ["20/02", "Concreto usinado", "Estrutura", "R$ 48.000", "Pago", "p-g"],
  ["08/04", "Fio elétrico 2,5mm", "Instalações", "R$ 18.000", "Pago", "p-g"],
  ["28/04", "Quadro elétrico", "Instalações", "R$ 22.400", "Em aberto", "p-y"],
];

const FEATURES = [
  { icon: "🌳", bg: "#fef0e6", title: "Etapas em árvore", desc: "Organize as etapas da obra em hierarquia com sub-etapas, posição, progresso e status." },
  { icon: "📦", bg: "#eaf3fb", title: "Controle de lançamentos", desc: "Registre materiais por obra e etapa, com fornecedor, quantidade, valor e forma de pagamento." },
  { icon: "💰", bg: "#e8f8f0", title: "Gestão financeira", desc: "Orçamento previsto vs realizado, entradas de unidades vendidas e comissões de corretores." },
  { icon: "👷", bg: "#fef9e7", title: "Equipe e ponto", desc: "Cadastre funcionários, registre horas por obra e etapa e controle os pagamentos." },
  { icon: "🏠", bg: "#f5eef8", title: "Vendas e unidades", desc: "Gerencie unidades, compradores e corretores. Veja o que foi recebido e o que está em aberto." },
  { icon: "📎", bg: "#fdecea", title: "Anexos nos registros", desc: "Notas fiscais, comprovantes e fotos anexados direto no lançamento, na obra ou na etapa." },
];

const STEPS = [
  { t: "Solicite o acesso", d: "Preencha o formulário. Entramos em contato em até 24h para conversar sobre sua necessidade." },
  { t: "Configure sua empresa", d: "Cadastre obras, equipes, fornecedores e a estrutura de etapas." },
  { t: "Lance e acompanhe", d: "Registre materiais, horas e vendas e acompanhe o progresso em tempo real." },
  { t: "Gere relatórios", d: "Exporte relatórios profissionais em PDF ou Excel." },
];

const MODULES = [
  ["🏗️", "Obras", "Empreendimentos"], ["🌳", "Etapas", "Árvore hierárquica"], ["🌍", "Terrenos", "Lotes e matrículas"],
  ["📦", "Materiais", "Catálogo e estoque"], ["💰", "Lançamentos", "Entradas por obra"], ["🏠", "Unidades", "Imóveis à venda"],
  ["👷", "Funcionários", "Equipe de obra"], ["🕐", "Ponto", "Horas trabalhadas"], ["💳", "Pagamentos", "Folha de equipe"],
  ["🚚", "Fornecedores", "Parceiros"], ["🤝", "Corretores", "Vendas e comissões"], ["👤", "Compradores", "Clientes"],
  ["📅", "Agenda", "Prazos e eventos"], ["📊", "Relatórios", "PDF e Excel"],
];

const PROMISES = [
  ["🚀", "Onboarding personalizado", "Configuramos o sistema junto com você."],
  ["🔒", "Seus dados são seus", "Dados isolados por empresa, com sigilo total."],
  ["🛠️", "Suporte direto", "Atendimento humano, falando com quem desenvolveu."],
  ["💬", "Sua opinião molda o sistema", "Sugestões são bem-vindas e avaliadas com prioridade."],
];

/* ============================================================
   META POR PÁGINA (título da aba + descrição)
   ============================================================ */
const PAGE_META = {
  home: { title: "EdifiCore — Gestão de obras do início ao fim", desc: "EdifiCore: sistema de gestão para construtoras. Controle obras, etapas, materiais, equipes, vendas e finanças em um só lugar." },
  sobre: { title: "Sobre — EdifiCore", desc: "Conheça o EdifiCore, o sistema de gestão de obras que reúne etapas, materiais, equipe, vendas e finanças em um só lugar." },
  contato: { title: "Contato — EdifiCore", desc: "Fale com a equipe do EdifiCore: dúvidas, propostas e solicitação de acesso." },
  suporte: { title: "Suporte — EdifiCore", desc: "Central de suporte do EdifiCore: como abrir um chamado e respostas para as dúvidas mais comuns." },
  privacidade: { title: "Política de Privacidade — EdifiCore", desc: "Como o EdifiCore trata dados pessoais, conforme a LGPD." },
  termos: { title: "Termos de Uso — EdifiCore", desc: "Condições de uso do sistema EdifiCore." },
};

const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><polygon points="24,1 46,12 46,36 24,47 2,36 2,12" fill="#D35400"/><rect x="13" y="13" width="22" height="4" rx="2" fill="white"/><rect x="13" y="22" width="16" height="4" rx="2" fill="#FAD7A0"/><rect x="13" y="31" width="22" height="4" rx="2" fill="white"/><rect x="13" y="13" width="4" height="22" rx="2" fill="white"/></svg>`;

function useDocumentHead(page) {
  useEffect(() => {
    const meta = PAGE_META[page] || PAGE_META.home;
    document.title = meta.title;

    const upsert = (selector, tag, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) { el = document.createElement(tag); document.head.appendChild(el); }
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    };
    upsert('link[rel="icon"]', "link", { rel: "icon", type: "image/svg+xml", href: `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}` });
    upsert('meta[name="description"]', "meta", { name: "description", content: meta.desc });
    upsert('meta[name="theme-color"]', "meta", { name: "theme-color", content: "#1C2433" });
  }, [page]);
}

/* ============================================================
   COMPONENTES BÁSICOS
   ============================================================ */
const LogoMark = ({ size = 32 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <polygon points="24,1 46,12 46,36 24,47 2,36 2,12" fill="#D35400" />
    <rect x="13" y="13" width="22" height="4" rx="2" fill="white" />
    <rect x="13" y="22" width="16" height="4" rx="2" fill="#FAD7A0" />
    <rect x="13" y="31" width="22" height="4" rx="2" fill="white" />
    <rect x="13" y="13" width="4" height="22" rx="2" fill="white" />
  </svg>
);

const Brand = ({ size = 18 }) => (
  <div className="brand" style={{ fontSize: size }}><span>Edifi</span><span>Core</span></div>
);

const Pill = ({ c, children }) => <span className={`pill ${c}`}>{children}</span>;

/* Campo de formulário — definido FORA dos formulários (evita perder o foco a cada tecla) */
function Field({ label, error, span2, children }) {
  return (
    <div className={`fg2 ${span2 ? "span2" : ""}`}>
      <label className="fl2">{label}</label>
      {children}
      {error && <span className="fe">{error}</span>}
    </div>
  );
}

/* Hook de formulário compartilhado (solicitação de acesso e contato) */
/* TODO: trocar por envio real (fetch POST para o seu backend). Stub para a landing funcionar sozinha. */
async function submitLead(kind, data) {
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true, kind, data };
}

function useLeadForm(initial, validateFn, kind) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const bind = (name) => ({
    value: values[name],
    onChange: (e) => {
      const v = e.target.value;
      setValues((s) => ({ ...s, [name]: v }));
      setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
    },
  });

  const submit = async () => {
    const e = validateFn(values);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStatus("sending");
    try {
      const res = await submitLead(kind, values);
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return { values, errors, status, bind, submit };
}

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/* ============================================================
   MOCKUPS DO SISTEMA (troque por <img> com prints reais quando tiver)
   ============================================================ */
function BrowserFrame({ url, children }) {
  return (
    <div className="browser">
      <div className="browser-bar">
        <div className="b-dots">
          <span className="b-dot" style={{ background: "#ff5f57" }} />
          <span className="b-dot" style={{ background: "#febc2e" }} />
          <span className="b-dot" style={{ background: "#28c840" }} />
        </div>
        <div className="b-url">🔒 {url}</div>
      </div>
      {children}
    </div>
  );
}

function SideNav({ active }) {
  return (
    <div className="s-side">
      <div className="s-logo"><LogoMark size={16} /><Brand size={12} /></div>
      {SIDE_ITEMS.map(([icon, label]) => (
        <div key={label} className={`s-nav ${label === active ? "on" : ""}`}><span>{icon}</span>{label}</div>
      ))}
    </div>
  );
}

function ShotDash() {
  const obras = [
    ["Parque das Flores", "Em andamento", "p-y", 42, "#D35400"],
    ["Edifício Comercial", "Atrasada", "p-r", 78, "#E67E22"],
    ["Galpão Industrial", "Em andamento", "p-y", 8, "#D35400"],
    ["Vila Nova", "Concluída", "p-g", 100, "#1e8449"],
  ];
  const bars = [30, 48, 66, 82, 58, 100];
  return (
    <BrowserFrame url="app.edificore.com.br/inicio">
      <div className="shot">
        <SideNav active="Início" />
        <div className="s-main">
          <div className="s-top">Início</div>
          <div className="s-body">
            <div className="s-kpis">
              <div className="s-kpi"><b style={{ color: "#D35400" }}>3</b><small>Obras em andamento</small></div>
              <div className="s-kpi"><b>R$ 2,4M</b><small>Valor total previsto</small></div>
              <div className="s-kpi"><b style={{ color: "#1e8449" }}>14</b><small>Funcionários ativos</small></div>
              <div className="s-kpi"><b style={{ color: "#c0392b" }}>2</b><small>Obras com atraso</small></div>
            </div>
            <div className="s-two">
              <div className="s-card">
                <h4>Obras em andamento</h4>
                {obras.map(([nome, status, c, pct, cor]) => (
                  <div className="s-obra" key={nome}>
                    <span className="nm">{nome}</span><Pill c={c}>{status}</Pill>
                    <div className="s-bar"><i style={{ width: `${pct}%`, background: cor }} /></div>
                  </div>
                ))}
              </div>
              <div className="s-card">
                <h4>Gastos por mês</h4>
                <div className="s-chart">
                  {bars.map((h, i) => <i key={i} className={i === bars.length - 1 ? "hi" : ""} style={{ height: `${h}%` }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function TreeRow({ n, p, c, root, sel }) {
  return (
    <div className={`t-row ${root ? "root" : ""} ${sel ? "sel" : ""}`}>
      <span>{root ? "🏗️" : "📌"}</span><span className="n">{n}</span><Pill c={c}>{p}</Pill>
    </div>
  );
}

function ShotEtapas() {
  return (
    <BrowserFrame url="app.edificore.com.br/etapas">
      <div className="shot">
        <SideNav active="Etapas" />
        <div className="s-main">
          <div className="s-top">Etapas <span style={{ fontWeight: 400, color: "#999", marginLeft: 6, fontSize: 10 }}>/ Parque das Flores</span></div>
          <div className="s-body">
            <div className="s-card">
              {ETAPAS.map((e) => (
                <div key={e.n}>
                  <TreeRow n={e.n} p={e.p} c={e.c} root sel={e.sel} />
                  {e.kids && (
                    <div className="t-kids">
                      {e.kids.map(([n, p, c]) => <TreeRow key={n} n={n} p={p} c={c} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ShotLanc() {
  return (
    <BrowserFrame url="app.edificore.com.br/lancamentos">
      <div className="shot">
        <SideNav active="Lançamentos" />
        <div className="s-main">
          <div className="s-top">Lançamentos de Materiais</div>
          <div className="s-body">
            <div className="s-kpis">
              <div className="s-kpi"><b>87</b><small>Lançamentos</small></div>
              <div className="s-kpi"><b>R$ 357K</b><small>Valor total</small></div>
              <div className="s-kpi"><b style={{ color: "#1e8449" }}>R$ 312K</b><small>Pago</small></div>
              <div className="s-kpi"><b style={{ color: "#c0392b" }}>R$ 44K</b><small>Em aberto</small></div>
            </div>
            <div className="s-card s-scroll" style={{ padding: 0 }}>
              <table className="s-table">
                <thead><tr><th>Data</th><th>Descrição</th><th>Etapa</th><th>Valor</th><th>Status</th></tr></thead>
                <tbody>
                  {LANCAMENTOS.map(([d, n, e, v, s, c]) => (
                    <tr key={d + n}><td>{d}</td><td><b>{n}</b></td><td>{e}</td><td><b>{v}</b></td><td><Pill c={c}>{s}</Pill></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ShotPdf() {
  const linhas = [
    ["Residencial Parque das Flores", "R$ 357.000"], ["Edifício Comercial Centro", "R$ 936.000"],
    ["Galpão Industrial Norte", "R$ 38.400"], ["Condomínio Vila Nova", "R$ 320.000"],
  ];
  return (
    <BrowserFrame url="app.edificore.com.br/relatorios">
      <div className="shot">
        <SideNav active="Relatórios" />
        <div className="pdf-wrap">
          <div className="pdf-page">
            <div className="pdf-h"><b>Gastos por Obra</b><small>Construtora Silva &amp; Filhos · Jan–Abr 2026</small></div>
            <div className="pdf-sum">
              <div><b>4</b><small>Obras</small></div><div><b>R$ 2,8M</b><small>Previsto</small></div><div><b>55%</b><small>Utilizado</small></div>
            </div>
            <div className="pdf-body">
              {linhas.map(([a, b]) => <div className="pdf-line" key={a}><span>{a}</span><b>{b}</b></div>)}
              <div className="s-chart" style={{ height: 60, marginTop: 10 }}>
                <i style={{ height: "45%" }} /><i className="hi" style={{ height: "100%" }} /><i style={{ height: "12%" }} /><i style={{ height: "40%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

const SHOTS = {
  dash:   { label: "📊 Dashboard",     Comp: ShotDash,   caption: <><strong>Dashboard</strong> — o estado de todas as obras em poucos segundos.</> },
  etapas: { label: "🌳 Etapas",        Comp: ShotEtapas, caption: <><strong>Etapas em árvore</strong> — progresso e status de cada fase da obra.</> },
  lanc:   { label: "📦 Lançamentos",   Comp: ShotLanc,   caption: <><strong>Lançamentos</strong> — materiais por obra, etapa e fornecedor.</> },
  pdf:    { label: "📄 Relatório PDF", Comp: ShotPdf,    caption: <><strong>Relatórios</strong> — documentos profissionais prontos para exportar.</> },
};

/* ============================================================
   NAV / FOOTER / CTA MOBILE
   ============================================================ */
function Navbar({ onGo }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (id) => { setOpen(false); onGo(id); };

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => go("hero")} aria-label="Ir para o início">
          <LogoMark /><Brand />
        </button>
        <button
          className={`nav-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
        <div className={`nav-links ${open ? "open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => { e.preventDefault(); go(l.id); }}>{l.label}</a>
          ))}
          <a href="#form" className="nav-cta" onClick={(e) => { e.preventDefault(); go("form"); }}>Solicitar acesso</a>
        </div>
      </div>
    </nav>
  );
}

function Footer({ onGo, onPage }) {
  const section = (id, label) => (
    <a className="footer-link" href={`#${id}`} onClick={(e) => { e.preventDefault(); onGo(id); }}>{label}</a>
  );
  const page = (p, label) => (
    <a className="footer-link" href={`#${p}`} onClick={(e) => { e.preventDefault(); onPage(p); }}>{label}</a>
  );
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-logo"><LogoMark size={28} /><Brand size={16} /></div>
            <div className="footer-tagline">Gestão de obras do início ao fim. Do terreno à entrega, tudo em um lugar.</div>
          </div>
          <div>
            <div className="footer-col-title">Sistema</div>
            {section("showcase", "O sistema")}{section("features", "Funcionalidades")}{section("modules", "Módulos")}{section("form", "Solicitar acesso")}
          </div>
          <div>
            <div className="footer-col-title">Empresa</div>
            {page("sobre", "Sobre")}{page("contato", "Contato")}{page("suporte", "Suporte")}
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            {page("privacidade", "Privacidade")}{page("termos", "Termos de uso")}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 edificore. Todos os direitos reservados.</span>
          <span>Desenvolvido pela <em>{CONFIG.empresa}</em></span>
        </div>
      </div>
    </footer>
  );
}

function MobileCta({ onGo }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const form = document.getElementById("form");
    const o1 = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0.05 });
    const o2 = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.1 });
    if (hero) o1.observe(hero);
    if (form) o2.observe(form);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  return (
    <div className={`mobile-cta ${!heroVisible && !formVisible ? "show" : ""}`}>
      <button onClick={() => onGo("form")}>Solicitar acesso →</button>
    </div>
  );
}

/* ============================================================
   HOME
   ============================================================ */
function Hero({ onGo }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-deco-1" /><div className="hero-deco-2" />
      <div className="container">
        <div className="hero-top">
          <div className="hero-badge">🏗️ Gestão de obras inteligente</div>
          <h1 className="hero-title">Sua obra,<br />sob <span>controle.</span></h1>
          <p className="hero-desc">EdifiCore é o sistema completo de gestão para construtoras. Controle obras, etapas, materiais, equipes, vendas e finanças em um só lugar — do terreno à entrega.</p>
          <div className="hero-actions">
            <button className="btn-hero btn-hero-primary" onClick={() => onGo("form")}>Solicitar acesso →</button>
            <button className="btn-hero btn-hero-outline" onClick={() => onGo("showcase")}>Ver o sistema por dentro</button>
          </div>
        </div>
        <div className="hero-shot-wrap">
          <ShotDash />
          <div className="float-badge fb-1">✅ Etapa concluída · <strong style={{ color: "var(--green)" }}>Fundação</strong></div>
          <div className="float-badge fb-2">📦 Novo lançamento · <strong style={{ color: "var(--primary)" }}>R$ 8.400</strong></div>
        </div>
      </div>
    </section>
  );
}

function Showcase() {
  const [active, setActive] = useState("dash");
  const { Comp, caption } = SHOTS[active];

  return (
    <section className="showcase" id="showcase">
      <div className="container">
        <div className="showcase-head">
          <div className="section-tag">Veja por dentro</div>
          <h2 className="section-title">Conheça o EdifiCore na prática</h2>
          <p className="section-desc">Uma interface limpa, pensada para quem vive a obra todo dia — sem planilhas e sem complicação.</p>
        </div>
        <div className="sc-tabs" role="tablist">
          {Object.entries(SHOTS).map(([key, s]) => (
            <button
              key={key}
              role="tab"
              aria-selected={active === key}
              className={`sc-tab ${active === key ? "active" : ""}`}
              onClick={(e) => { setActive(key); e.currentTarget.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="sc-stage"><Comp /></div>
        <div className="sc-caption">{caption}</div>
      </div>
    </section>
  );
}

function FeatureRow({ tag, title, desc, bullets, shot, reverse = false, alt = false }) {
  const text = (
    <div>
      <div className="section-tag">{tag}</div>
      <h2 className="section-title">{title}</h2>
      <p className="section-desc">{desc}</p>
      <ul className="feat-list">{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
    </div>
  );
  return (
    <section className={`feat-row ${alt ? "alt" : ""}`}>
      <div className="container">
        <div className={`feat-grid ${reverse ? "rev" : ""}`}>
          {reverse ? <>{shot}{text}</> : <>{text}{shot}</>}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-tag">Funcionalidades</div>
        <h2 className="section-title">Tudo que sua construtora precisa</h2>
        <p className="section-desc">Do lançamento de materiais à venda das unidades — toda a gestão em um sistema simples e poderoso.</p>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="container">
        <div style={{ textAlign: "center" }}>
          <div className="section-tag">Como funciona</div>
          <h2 className="section-title">Do cadastro à gestão completa</h2>
          <p className="section-desc" style={{ margin: "0 auto" }}>Em poucos passos sua construtora já está operando no EdifiCore.</p>
        </div>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s.t}>
              <div className="step-num">{i + 1}</div>
              <div><div className="step-title">{s.t}</div><div className="step-desc">{s.d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modules() {
  return (
    <section className="modules" id="modules">
      <div className="container">
        <div className="section-tag" style={{ background: "rgba(211,84,0,.15)", color: "var(--accent)" }}>Módulos</div>
        <h2 className="section-title">Módulos integrados</h2>
        <p className="section-desc">Cada módulo conectado ao outro — dados que fluem de uma ponta à outra do seu processo construtivo.</p>
        <div className="modules-grid">
          {MODULES.map(([icon, name, sub]) => (
            <div className="mod-item" key={name}>
              <span className="mod-icon">{icon}</span>
              <div><div className="mod-name">{name}</div><div className="mod-sub">{sub}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const ACCESS_EMPTY = { nome: "", empresa: "", email: "", whatsapp: "", cidade: "", obras: "1 obra", controle: "Planilha Excel", equipe: "1 a 5", mensagem: "" };

function validateAccess(v) {
  const e = {};
  if (v.nome.trim().length < 3) e.nome = "Informe seu nome.";
  if (v.empresa.trim().length < 2) e.empresa = "Informe a empresa.";
  if (!isEmail(v.email)) e.email = "E-mail inválido.";
  if (v.whatsapp.replace(/\D/g, "").length < 10) e.whatsapp = "Informe DDD + número.";
  return e;
}

function RequestForm() {
  const { errors, status, bind, submit } = useLeadForm(ACCESS_EMPTY, validateAccess, "acesso");

  return (
    <section className="form-section" id="form">
      <div className="container">
        <div className="form-inner">
          <div className="form-left">
            <div className="section-tag">Solicitar acesso</div>
            <h2 className="section-title" style={{ fontSize: 32 }}>Comece a usar o EdifiCore</h2>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.7 }}>
              Preencha o formulário e nossa equipe entra em contato em até 24 horas para entender sua operação e configurar o sistema do jeito certo para você.
            </p>
            <div className="form-promise">
              {PROMISES.map(([icon, t, d]) => (
                <div className="fp-item" key={t}>
                  <div className="fp-icon">{icon}</div>
                  <div><strong>{t}</strong><span>{d}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {status === "done" ? (
              <div className="form-success">
                <div className="form-success-icon">✅</div>
                <h3>Solicitação enviada!</h3>
                <p>Recebemos seu contato e nossa equipe vai falar com você em até <strong>24 horas</strong> pelo WhatsApp ou e-mail informado.</p>
              </div>
            ) : (
              <div className="form-card">
                <div className="form-card-title">Solicite seu acesso</div>
                <div className="form-card-sub">Sem compromisso — conversamos primeiro antes de qualquer coisa.</div>

                <div className="fgrid2">
                  <Field label="Nome completo *" error={errors.nome}>
                    <input className={`fi2 ${errors.nome ? "err" : ""}`} placeholder="Seu nome" autoComplete="name" {...bind("nome")} />
                  </Field>
                  <Field label="Empresa / Construtora *" error={errors.empresa}>
                    <input className={`fi2 ${errors.empresa ? "err" : ""}`} placeholder="Nome da empresa" autoComplete="organization" {...bind("empresa")} />
                  </Field>
                  <Field label="E-mail *" error={errors.email}>
                    <input className={`fi2 ${errors.email ? "err" : ""}`} type="email" inputMode="email" placeholder="seu@email.com" autoComplete="email" {...bind("email")} />
                  </Field>
                  <Field label="WhatsApp *" error={errors.whatsapp}>
                    <input className={`fi2 ${errors.whatsapp ? "err" : ""}`} type="tel" inputMode="tel" placeholder="(00) 99999-9999" autoComplete="tel" {...bind("whatsapp")} />
                  </Field>
                  <Field label="Cidade / Estado">
                    <input className="fi2" placeholder="Ex: Lajeado/RS" {...bind("cidade")} />
                  </Field>
                  <Field label="Obras ativas">
                    <select className="fi2" {...bind("obras")}>
                      <option>1 obra</option><option>2 a 5 obras</option><option>6 a 10 obras</option><option>Mais de 10</option>
                    </select>
                  </Field>
                  <Field label="Como controla hoje?">
                    <select className="fi2" {...bind("controle")}>
                      <option>Planilha Excel</option><option>Papel / caderno</option><option>Outro sistema</option><option>Sem controle formal</option>
                    </select>
                  </Field>
                  <Field label="Funcionários">
                    <select className="fi2" {...bind("equipe")}>
                      <option>1 a 5</option><option>6 a 20</option><option>21 a 50</option><option>Mais de 50</option>
                    </select>
                  </Field>
                  <Field label="O que você mais precisa controlar?" span2>
                    <textarea className="fi2" placeholder="Conte um pouco sobre sua operação..." {...bind("mensagem")} />
                  </Field>
                </div>

                {status === "error" && (
                  <p className="fe" style={{ marginBottom: 12, textAlign: "center" }}>Não foi possível enviar agora. Tente novamente em instantes.</p>
                )}
                <button className="btn-submit" onClick={submit} disabled={status === "sending"}>
                  {status === "sending" ? "Enviando..." : "Quero solicitar acesso →"}
                </button>
                <div className="form-note">🔒 Seus dados são confidenciais. Não compartilhamos com terceiros.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({ onGo }) {
  return (
    <>
      <Hero onGo={onGo} />
      <Showcase />
      <FeatureRow
        tag="Etapas da obra"
        title="Cada etapa organizada em árvore"
        desc="Divida a obra em etapas e sub-etapas, acompanhe o progresso de cada uma e saiba na hora o que está em dia e o que está atrasado."
        bullets={["Etapas e sub-etapas com quantos níveis precisar", "Progresso e status visíveis em cada nó", "Painel de detalhe ao clicar em qualquer etapa"]}
        shot={<ShotEtapas />}
      />
      <FeatureRow
        alt
        reverse
        tag="Relatórios"
        title="Relatórios prontos para enviar"
        desc="Gastos por obra, pagamento de funcionários, vendas e progresso — tudo com a logo da sua empresa, em PDF ou Excel."
        bullets={["Previsto vs realizado por obra", "Filtros por período, obra, etapa e fornecedor", "Documento profissional para clientes e contador"]}
        shot={<ShotPdf />}
      />
      <Features />
      <HowItWorks />
      <Modules />
      <RequestForm />
    </>
  );
}

/* ============================================================
   PÁGINAS INTERNAS — estrutura comum
   ============================================================ */
function PageHero({ crumb, title, subtitle, onPage }) {
  return (
    <header className="page-hero">
      <div className="container">
        <div className="crumb">
          <button onClick={() => onPage("home")}>Início</button><span>/</span><span>{crumb}</span>
        </div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
    </header>
  );
}

function Channel({ icon, bg, title, text, href, cta }) {
  const external = href && href.startsWith("http");
  return (
    <div className="channel">
      <div className="feat-icon" style={{ background: bg, marginBottom: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="feat-title" style={{ marginBottom: 2 }}>{title}</div>
        <div className="feat-desc">{text}</div>
        {href && (
          <a className="ch-link" href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{cta}</a>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SOBRE
   ============================================================ */
const VALORES = [
  ["🧭", "#fef0e6", "Simples de usar", "Interface pensada para o dia a dia de quem está na obra e no escritório, sem exigir treinamento longo."],
  ["🔒", "#e8f8f0", "Dados só da sua empresa", "As informações são separadas por empresa, com controle de acesso por perfil de usuário."],
  ["🤝", "#eaf3fb", "Atendimento direto", "Você fala com quem desenvolve o sistema, sem robôs no meio do caminho."],
  ["🌱", "#f5eef8", "Evolui com quem usa", "Sugestões dos clientes entram no planejamento e são avaliadas com prioridade."],
];

function SobrePage({ onPage, onGo }) {
  return (
    <>
      <PageHero
        crumb="Sobre"
        onPage={onPage}
        title="Gestão de obra sem depender de planilha"
        subtitle="O EdifiCore reúne, em um só lugar, o que costuma ficar espalhado entre planilhas, cadernos e mensagens: obras, etapas, materiais, equipe, vendas e finanças."
      />
      <div className="container page-body">
        <div className="block">
          <h2 className="block-title">Por que o EdifiCore existe</h2>
          <p className="block-text">
            Em construtoras pequenas e médias, a informação da obra costuma estar em muitos lugares ao mesmo tempo: uma planilha para os gastos, outra para a equipe, anotações em papel e conversas de WhatsApp com fornecedores.
          </p>
          <p className="block-text">
            O resultado é retrabalho, números que não batem e pouca visão de quanto a obra realmente está custando. O EdifiCore conecta esses dados do terreno à entrega, para que você saiba, a qualquer momento, em que ponto cada obra está.
          </p>
        </div>

        <div className="block">
          <h2 className="block-title">O que nos guia</h2>
          <div className="cards-2">
            {VALORES.map(([icon, bg, t, d]) => (
              <div className="feat-card" key={t}>
                <div className="feat-icon" style={{ background: bg }}>{icon}</div>
                <div className="feat-title">{t}</div>
                <div className="feat-desc">{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="block">
          <h2 className="block-title">Quem está por trás</h2>
          <p className="block-text">
            O EdifiCore é desenvolvido e mantido pela <strong>{CONFIG.empresa}</strong>, empresa de tecnologia que desenvolve software de gestão. O produto evolui a partir do uso real: o que os clientes pedem e o que a rotina da obra mostra que falta.
          </p>
        </div>

        <div className="cta-band">
          <div>
            <h3>Quer ver se faz sentido para a sua construtora?</h3>
            <p>Conte um pouco sobre a sua operação e conversamos sem compromisso.</p>
          </div>
          <div className="btn-row">
            <button className="btn-line" onClick={() => onGo("form")}>Solicitar acesso</button>
            <button className="btn-line ghost" onClick={() => onPage("contato")}>Falar com a equipe</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   CONTATO
   ============================================================ */
const ASSUNTOS = ["Quero conhecer o sistema", "Planos e valores", "Parceria", "Imprensa", "Outro assunto"];
const CONTACT_EMPTY = { nome: "", email: "", empresa: "", assunto: ASSUNTOS[0], mensagem: "" };

function validateContact(v) {
  const e = {};
  if (v.nome.trim().length < 3) e.nome = "Informe seu nome.";
  if (!isEmail(v.email)) e.email = "E-mail inválido.";
  if (v.mensagem.trim().length < 10) e.mensagem = "Escreva ao menos algumas palavras.";
  return e;
}

function ContactForm() {
  const { errors, status, bind, submit } = useLeadForm(CONTACT_EMPTY, validateContact, "contato");

  if (status === "done") {
    return (
      <div className="form-success">
        <div className="form-success-icon">✅</div>
        <h3>Mensagem enviada!</h3>
        <p>Obrigado pelo contato. Respondemos em até <strong>{CONFIG.prazoContato}</strong> pelo e-mail informado.</p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="form-card-title">Envie uma mensagem</div>
      <div className="form-card-sub">Preencha os campos e retornamos em até {CONFIG.prazoContato}.</div>
      <div className="fgrid2">
        <Field label="Nome *" error={errors.nome}>
          <input className={`fi2 ${errors.nome ? "err" : ""}`} placeholder="Seu nome" autoComplete="name" {...bind("nome")} />
        </Field>
        <Field label="E-mail *" error={errors.email}>
          <input className={`fi2 ${errors.email ? "err" : ""}`} type="email" inputMode="email" placeholder="seu@email.com" autoComplete="email" {...bind("email")} />
        </Field>
        <Field label="Empresa">
          <input className="fi2" placeholder="Nome da empresa" autoComplete="organization" {...bind("empresa")} />
        </Field>
        <Field label="Assunto">
          <select className="fi2" {...bind("assunto")}>{ASSUNTOS.map((a) => <option key={a}>{a}</option>)}</select>
        </Field>
        <Field label="Mensagem *" error={errors.mensagem} span2>
          <textarea className={`fi2 ${errors.mensagem ? "err" : ""}`} placeholder="Como podemos ajudar?" {...bind("mensagem")} />
        </Field>
      </div>
      {status === "error" && (
        <p className="fe" style={{ marginBottom: 12, textAlign: "center" }}>Não foi possível enviar agora. Tente novamente em instantes.</p>
      )}
      <button className="btn-submit" onClick={submit} disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : "Enviar mensagem →"}
      </button>
      <div className="form-note">🔒 Usamos seus dados apenas para responder ao contato. Veja a Política de Privacidade.</div>
    </div>
  );
}

function ContatoPage({ onPage }) {
  return (
    <>
      <PageHero
        crumb="Contato"
        onPage={onPage}
        title="Fale com a equipe"
        subtitle={`Dúvidas, propostas ou interesse em conhecer o sistema? Respondemos em até ${CONFIG.prazoContato}.`}
      />
      <div className="container page-body">
        <div className="split-2">
          <div className="channels">
            <Channel icon="✉️" bg="#eaf3fb" title="E-mail" text="Para dúvidas gerais, propostas e parcerias." href={`mailto:${CONFIG.emailContato}`} cta={CONFIG.emailContato} />
            {CONFIG.whatsapp && (
              <Channel icon="💬" bg="#e8f8f0" title="WhatsApp" text="Atendimento rápido para quem quer conhecer o sistema." href={`https://wa.me/${CONFIG.whatsapp}`} cta={CONFIG.whatsappLabel || "Abrir conversa"} />
            )}
            <Channel icon="🕘" bg="#fef9e7" title="Horário de atendimento" text={CONFIG.horario} />
            <div className="channel" style={{ background: "#fef0e6", borderColor: "var(--accent)" }}>
              <div className="feat-icon" style={{ background: "#fff", marginBottom: 0 }}>🛠️</div>
              <div style={{ flex: 1 }}>
                <div className="feat-title" style={{ marginBottom: 2 }}>Já é cliente?</div>
                <div className="feat-desc">Para problemas no sistema, use a página de Suporte: lá você encontra as respostas mais comuns e como abrir um chamado.</div>
                <button className="ch-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => onPage("suporte")}>Ir para o Suporte →</button>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </>
  );
}

/* ============================================================
   SUPORTE
   ============================================================ */
const FAQ = [
  { q: "Esqueci minha senha. O que faço?", a: "Peça ao administrador da sua empresa para redefinir a sua senha. Se você é o administrador, fale com o suporte informando o seu login e o e-mail cadastrado." },
  { q: "Minha sessão expirou. Perdi o que estava fazendo?", a: "Por segurança, a sessão é encerrada depois de um período sem atividade. Basta entrar novamente. O que já estava salvo é mantido; formulários abertos e não salvos podem precisar ser preenchidos de novo." },
  { q: "Aparece que o registro está em uso por outro usuário. E agora?", a: "Para evitar que duas pessoas alterem o mesmo registro ao mesmo tempo, o sistema bloqueia a edição enquanto alguém está com ele aberto. Aguarde essa pessoa salvar ou fechar o formulário. Se ela já saiu e o bloqueio persistiu, peça ao administrador da empresa ou ao suporte para liberar o registro." },
  { q: "Como gero um relatório em PDF ou Excel?", a: "Abra Relatórios, escolha o tipo, ajuste os filtros (período, obra, etapa, fornecedor) e confira a prévia. Depois é só exportar. Se o botão de exportar não aparece para você, o administrador da empresa pode ter restringido essa permissão ao seu perfil." },
  { q: "Não vejo um módulo no menu. Por quê?", a: "Os módulos disponíveis variam conforme a configuração de cada empresa e o perfil do usuário. Se você precisa de um módulo que não aparece, fale com o administrador da sua empresa ou com o suporte." },
  { q: "Atingi o limite de obras, usuários ou lançamentos. O que fazer?", a: "Os limites são definidos por empresa. Entre em contato com o suporte para avaliarmos o ajuste conforme a sua necessidade." },
  { q: "Apareceu uma página de erro. O que informo ao suporte?", a: "Anote o código de referência exibido na tela (quando houver), o horário e o que você estava fazendo, e envie junto com um print. Isso acelera muito o diagnóstico." },
  { q: "Como adiciono novos usuários?", a: "O administrador da empresa cadastra e gerencia os usuários, com o respectivo perfil de acesso, no módulo de Usuários." },
  { q: "Posso exportar todos os meus dados?", a: "Sim. Solicite pelo suporte e disponibilizamos a exportação dos dados da sua empresa." },
];

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((it, i) => (
        <div className={`faq-item ${open === i ? "open" : ""}`} key={it.q}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{it.q}</span><span className="faq-ic">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <div className="faq-a">{it.a}</div>}
        </div>
      ))}
    </div>
  );
}

function SuportePage({ onPage }) {
  const assunto = encodeURIComponent("Suporte EdifiCore — [descreva o problema]");
  return (
    <>
      <PageHero
        crumb="Suporte"
        onPage={onPage}
        title="Central de suporte"
        subtitle="Ajuda para quem já usa o EdifiCore: respostas rápidas e o caminho para abrir um chamado."
      />
      <div className="container page-body">
        <div className="block">
          <h2 className="block-title">Como abrir um chamado</h2>
          <div className="cards-3">
            <div className="feat-card">
              <div className="feat-icon" style={{ background: "#fef0e6" }}>📝</div>
              <div className="feat-title">1. Reúna as informações</div>
              <div className="feat-desc">Nome da empresa, seu login, a tela onde aconteceu, o horário, o que você esperava e o que aconteceu. Um print ajuda muito.</div>
            </div>
            <div className="feat-card">
              <div className="feat-icon" style={{ background: "#eaf3fb" }}>📨</div>
              <div className="feat-title">2. Envie pelo canal</div>
              <div className="feat-desc">Mande por e-mail{CONFIG.whatsapp ? " ou WhatsApp" : ""}. Se a tela mostrou um código de referência de erro, inclua na mensagem.</div>
            </div>
            <div className="feat-card">
              <div className="feat-icon" style={{ background: "#e8f8f0" }}>✅</div>
              <div className="feat-title">3. Acompanhe a resposta</div>
              <div className="feat-desc">Respondemos em até {CONFIG.prazoSuporte}. Casos que impedem o uso do sistema têm prioridade.</div>
            </div>
          </div>
          <div className="btn-row">
            <a className="btn-line" href={`mailto:${CONFIG.emailSuporte}?subject=${assunto}`}>✉️ Enviar e-mail ao suporte</a>
            {CONFIG.whatsapp && (
              <a className="btn-line ghost" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noreferrer">💬 Falar no WhatsApp</a>
            )}
          </div>
          <p className="block-text" style={{ marginTop: 14, fontSize: 13, color: "var(--text-3)" }}>
            {CONFIG.horario}. E-mail: {CONFIG.emailSuporte}
          </p>
        </div>

        <div className="block">
          <h2 className="block-title">Perguntas frequentes</h2>
          <Faq items={FAQ} />
        </div>

        <div className="cta-band">
          <div>
            <h3>Não encontrou o que procurava?</h3>
            <p>Fale com a nossa equipe e vamos ajudar a resolver.</p>
          </div>
          <div className="btn-row">
            <button className="btn-line" onClick={() => onPage("contato")}>Ir para Contato</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   PÁGINAS JURÍDICAS (Privacidade e Termos)
   Texto-base para revisão por assessoria jurídica antes de publicar.
   ============================================================ */
function LegalPage({ crumb, title, subtitle, sections, onPage }) {
  return (
    <>
      <PageHero crumb={crumb} onPage={onPage} title={title} subtitle={subtitle} />
      <div className="container page-body">
        {CONFIG.mostrarAvisoRevisao && (
          <div className="notice">
            <strong>Texto-base em revisão.</strong> Este documento é um modelo e deve ser revisado por assessoria jurídica, com os itens entre [colchetes] preenchidos, antes da publicação. Para ocultar este aviso, defina <code>mostrarAvisoRevisao: false</code> em CONFIG.
          </div>
        )}
        <div className="prose">
          <p className="meta-line">Última atualização: {CONFIG.atualizadoEm}</p>
          {sections.map((s) => (
            <div key={s.h}>
              <h2>{s.h}</h2>
              {s.p && s.p.map((t, i) => <p key={i}>{t}</p>)}
              {s.ul && <ul>{s.ul.map((t, i) => <li key={i}>{t}</li>)}</ul>}
              {s.after && s.after.map((t, i) => <p key={`a${i}`}>{t}</p>)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const PRIVACIDADE = [
  { h: "1. Quem somos", p: [
    `Esta Política explica como o EdifiCore trata dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD). O EdifiCore é operado por ${CONFIG.empresa} (${CONFIG.razaoSocial}, CNPJ ${CONFIG.cnpj}).`,
    `Encarregado pelo tratamento de dados pessoais: ${CONFIG.empresa}, contato em ${CONFIG.emailPrivacidade}.`,
  ] },
  { h: "2. Dados que coletamos", p: ["Coletamos apenas o necessário para as finalidades descritas abaixo:"], ul: [
    "Dados de contato e de solicitação de acesso, informados nos formulários do site: nome, empresa, e-mail, telefone/WhatsApp, cidade, porte da operação (número de obras e funcionários), forma atual de controle e mensagem.",
    "Dados de conta de quem usa o sistema: nome, login, e-mail, perfil de acesso e empresa à qual o usuário pertence.",
    "Registros de acesso e auditoria: data e hora, endereço IP e ações realizadas no sistema, para segurança e rastreabilidade.",
    "Dados técnicos de navegação neste site, como endereço IP e tipo de navegador, tratados pelos provedores de infraestrutura.",
  ] },
  { h: "3. Nossos papéis: controlador e operador", p: [
    "Para os dados de contato e de conta descritos acima, atuamos como controladores.",
    "Para os dados que as empresas clientes inserem no sistema (por exemplo, informações de funcionários, fornecedores, compradores e corretores), a empresa cliente é a controladora e a nossa atuação é a de operadora: tratamos esses dados conforme as instruções do cliente e o contrato. Pedidos de titulares sobre esses dados devem ser dirigidos primeiro à empresa cliente.",
  ] },
  { h: "4. Para que usamos os dados e em que bases legais", ul: [
    "Responder contatos e conduzir a negociação do acesso ao sistema: procedimentos preliminares relacionados a contrato, a pedido do titular, e consentimento quando aplicável.",
    "Prestar o serviço contratado, manter contas de usuário e dar suporte: execução de contrato.",
    "Garantir a segurança, prevenir fraudes e manter registros de auditoria: legítimo interesse e cumprimento de obrigação legal ou regulatória, conforme o caso.",
    "Cumprir obrigações legais e exercer direitos em processos: cumprimento de obrigação legal e exercício regular de direitos.",
    "Enviar comunicações sobre o serviço, como avisos de manutenção: execução de contrato e legítimo interesse.",
  ] },
  { h: "5. Compartilhamento", p: [
    "Não vendemos dados pessoais. Podemos compartilhá-los com prestadores que nos ajudam a operar o serviço (hospedagem e infraestrutura, envio de e-mail), sempre com a finalidade limitada ao serviço, e com autoridades quando houver obrigação legal ou ordem competente.",
    "Este site carrega fontes tipográficas do Google Fonts. Ao fazer isso, o seu navegador pode enviar o endereço IP aos servidores do Google.",
  ] },
  { h: "6. Cookies", p: [
    "Este site institucional não utiliza cookies de publicidade ou de rastreamento [revisar caso ferramentas de análise sejam adicionadas]. O sistema EdifiCore utiliza cookies de sessão estritamente necessários para manter você autenticado.",
  ] },
  { h: "7. Por quanto tempo guardamos os dados", p: [
    "Mantemos os dados pelo tempo necessário para cumprir as finalidades acima, o contrato e prazos legais. Contatos que não resultarem em contratação são mantidos por [prazo]. Registros de auditoria são mantidos por [prazo]. Após o encerramento do contrato, os dados da empresa cliente ficam disponíveis para exportação por [prazo] e, depois disso, são eliminados, salvo obrigação legal de guarda.",
  ] },
  { h: "8. Segurança", p: [
    "Adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda e alteração, como conexão criptografada (HTTPS), controle de acesso por perfil, separação dos dados por empresa, registros de auditoria e rotinas de backup. Nenhum sistema é totalmente imune a incidentes; em caso de incidente com risco relevante, comunicaremos os envolvidos e a ANPD nos termos da lei.",
  ] },
  { h: "9. Seus direitos", p: ["Nos termos do art. 18 da LGPD, o titular pode solicitar:"], ul: [
    "confirmação da existência de tratamento e acesso aos dados;",
    "correção de dados incompletos, inexatos ou desatualizados;",
    "anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade;",
    "portabilidade dos dados, quando aplicável;",
    "informação sobre com quem os dados foram compartilhados;",
    "revogação do consentimento e eliminação dos dados tratados com base nele;",
    "oposição a tratamento realizado com fundamento em hipótese de dispensa de consentimento, em caso de descumprimento da lei.",
  ], after: [
    `Para exercer seus direitos, escreva para ${CONFIG.emailPrivacidade}. Podemos pedir informações para confirmar a sua identidade. Se você tiver uma reclamação, também pode procurar a Autoridade Nacional de Proteção de Dados (ANPD).`,
  ] },
  { h: "10. Transferência internacional", p: [
    "Caso algum prestador de serviço armazene ou processe dados fora do Brasil, a transferência será feita com as garantias exigidas pela LGPD [revisar conforme os provedores utilizados].",
  ] },
  { h: "11. Crianças e adolescentes", p: [
    "O EdifiCore é destinado a empresas e profissionais. Não coletamos intencionalmente dados de crianças e adolescentes.",
  ] },
  { h: "12. Alterações desta Política", p: [
    "Podemos atualizar esta Política periodicamente. A data da última atualização aparece no topo da página; mudanças relevantes serão comunicadas pelos canais adequados.",
  ] },
  { h: "13. Contato", p: [`Dúvidas sobre esta Política: ${CONFIG.emailPrivacidade}.`] },
];

const TERMOS = [
  { h: "1. Aceitação e objeto", p: [
    `Estes Termos de Uso regulam o acesso e a utilização do sistema EdifiCore (o “Sistema”), software de gestão para construtoras fornecido por ${CONFIG.empresa} (${CONFIG.razaoSocial}, CNPJ ${CONFIG.cnpj}). Ao utilizar o Sistema, a empresa contratante e seus usuários declaram ter lido e aceito estes Termos e a Política de Privacidade.`,
  ] },
  { h: "2. Definições", ul: [
    "Cliente: a empresa que contrata o Sistema.",
    "Usuário: a pessoa autorizada pelo Cliente a acessar o Sistema.",
    "Administrador: Usuário com poderes de gestão da conta do Cliente, como cadastro de usuários e configurações da empresa.",
    "Plano: o conjunto de módulos, limites e condições comerciais contratado pelo Cliente.",
  ] },
  { h: "3. Contratação e acesso", p: [
    "O acesso ao Sistema é concedido após solicitação e alinhamento comercial com a nossa equipe. Plano, valores, vigência e demais condições comerciais são definidos em proposta ou contrato específico, que prevalece sobre estes Termos em caso de conflito.",
  ] },
  { h: "4. Conta, credenciais e responsabilidades do Cliente", ul: [
    "O Cliente é responsável pelos Usuários que cadastrar e pelas atividades realizadas em sua conta.",
    "Cada Usuário deve manter suas credenciais em sigilo e não as compartilhar. Suspeita de uso indevido deve ser comunicada imediatamente.",
    "O Cliente deve manter os dados cadastrais e a lista de Usuários atualizados, desativando quem não deve mais ter acesso.",
  ] },
  { h: "5. Uso permitido", p: ["É vedado ao Cliente e aos Usuários:"], ul: [
    "utilizar o Sistema para fins ilícitos ou que violem direitos de terceiros;",
    "tentar acessar dados de outras empresas, contornar controles de segurança, limites do Plano ou mecanismos de bloqueio;",
    "realizar engenharia reversa, copiar, revender ou sublicenciar o Sistema sem autorização;",
    "sobrecarregar a infraestrutura de forma abusiva ou inserir conteúdo malicioso.",
  ] },
  { h: "6. Planos, módulos e limites", p: [
    "Cada Plano pode incluir módulos e limites próprios, como número de obras, usuários, lançamentos, relatórios e armazenamento. Módulos e limites podem ser ajustados por acordo entre as partes.",
  ] },
  { h: "7. Dados do Cliente", p: [
    "Os dados inseridos no Sistema pertencem ao Cliente. Tratamos esses dados para prestar o serviço, conforme a Política de Privacidade e o contrato.",
    "O Cliente declara ter legitimidade e base legal para inserir no Sistema os dados que informar, inclusive dados pessoais de funcionários, compradores, corretores e fornecedores, e é responsável por atender aos titulares quando atuar como controlador. O Cliente pode solicitar a exportação dos seus dados a qualquer momento pelo suporte.",
  ] },
  { h: "8. Propriedade intelectual", p: [
    `O Sistema, incluindo código, design, marca, textos e documentação, é de titularidade de ${CONFIG.empresa}. É concedida ao Cliente uma licença de uso limitada, não exclusiva e intransferível, válida durante a vigência do contrato. Nada nestes Termos transfere ao Cliente direitos de propriedade sobre o Sistema.`,
  ] },
  { h: "9. Disponibilidade e suporte", p: [
    "Empregamos esforços razoáveis para manter o Sistema disponível, mas não garantimos funcionamento ininterrupto, salvo nível de serviço expressamente contratado. Manutenções programadas serão avisadas com antecedência sempre que possível. O suporte é prestado pelos canais divulgados no site.",
  ] },
  { h: "10. Pagamento", p: [
    "Os valores, a periodicidade e as formas de pagamento seguem o que foi contratado. O atraso pode resultar em suspensão do acesso após aviso prévio e período de carência definidos em contrato.",
  ] },
  { h: "11. Suspensão e encerramento", p: [
    "O acesso pode ser suspenso em caso de inadimplência ou violação destes Termos. O Cliente pode encerrar o contrato conforme as condições contratadas. Encerrado o contrato, os dados do Cliente ficam disponíveis para exportação por [prazo] e, depois, são eliminados, salvo obrigação legal de guarda.",
  ] },
  { h: "12. Limitação de responsabilidade", p: [
    "O Sistema é uma ferramenta de apoio à gestão. A conferência das informações lançadas (valores, prazos, quantidades, documentos) e o cumprimento de obrigações fiscais, contábeis, trabalhistas e técnicas continuam sendo responsabilidade do Cliente.",
    "Na medida permitida pela lei, a responsabilidade de " + CONFIG.empresa + " por danos decorrentes do uso do Sistema fica limitada ao valor pago pelo Cliente nos [12] meses anteriores ao evento, não respondendo por lucros cessantes ou danos indiretos [revisar com assessoria jurídica].",
  ] },
  { h: "13. Alterações destes Termos", p: [
    "Podemos atualizar estes Termos. Mudanças relevantes serão comunicadas com antecedência razoável. O uso continuado do Sistema após a vigência da nova versão indica concordância.",
  ] },
  { h: "14. Lei aplicável e foro", p: [
    `Estes Termos são regidos pelas leis do Brasil. Fica eleito o foro da comarca de ${CONFIG.foro} para dirimir controvérsias, ressalvadas as hipóteses em que a lei determine foro diverso.`,
  ] },
  { h: "15. Contato", p: [`Dúvidas sobre estes Termos: ${CONFIG.emailContato}.`] },
];

/* ============================================================
   APP
   ============================================================ */
export default function EdifiCoreLanding() {
  const [page, setPage] = useState("home");
  const [pending, setPending] = useState(null);
  useDocumentHead(page);

  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* Vai para uma seção da home (se estiver em outra página, volta para a home e rola depois) */
  const goSection = useCallback((id) => {
    if (page === "home") scrollToId(id);
    else { setPending(id); setPage("home"); }
  }, [page, scrollToId]);

  const goPage = useCallback((p) => { setPending(null); setPage(p); }, []);

  useEffect(() => {
    if (pending) {
      const t = setTimeout(() => { scrollToId(pending); setPending(null); }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="eh">
      <style>{CSS}</style>

      <Navbar onGo={goSection} />

      {page === "home" && <HomePage onGo={goSection} />}
      {page === "sobre" && <SobrePage onPage={goPage} onGo={goSection} />}
      {page === "contato" && <ContatoPage onPage={goPage} />}
      {page === "suporte" && <SuportePage onPage={goPage} />}
      {page === "privacidade" && (
        <LegalPage crumb="Privacidade" title="Política de Privacidade" subtitle="Como o EdifiCore trata dados pessoais, conforme a LGPD." sections={PRIVACIDADE} onPage={goPage} />
      )}
      {page === "termos" && (
        <LegalPage crumb="Termos de uso" title="Termos de Uso" subtitle="Condições para o uso do sistema EdifiCore." sections={TERMOS} onPage={goPage} />
      )}

      <Footer onGo={goSection} onPage={goPage} />
      {page === "home" && <MobileCta onGo={goSection} />}
    </div>
  );
}
