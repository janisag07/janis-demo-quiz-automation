/* ── QuizFlow — Marketing Quiz Automation App ── */

(function () {
  'use strict';

  // ── Clock ──
  function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ── Navigation ──
  const topbarNav = document.getElementById('topbar-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => topbarNav.classList.toggle('open'));
  }

  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.getElementById('view-' + btn.dataset.view).classList.add('active');
      topbarNav.classList.remove('open');
    });
  });

  // ── Helpers ──
  function fmt(n) { return n.toLocaleString(); }
  function pct(a, b) { return ((a / b) * 100).toFixed(1); }

  function segColor(name) {
    const seg = SEGMENTS.find(s => s.name === name);
    return seg ? seg.color : '#6b7280';
  }

  function scoreClass(score) {
    if (score >= 75) return 'score-high';
    if (score >= 40) return 'score-med';
    return 'score-low';
  }

  function scoreBarColor(score) {
    if (score >= 75) return 'var(--success)';
    if (score >= 40) return 'var(--warning)';
    return 'var(--p4)';
  }

  // ══════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════

  // 7-Day Chart
  function renderChart() {
    const container = document.getElementById('chart-area');
    const maxVal = Math.max(...DAILY_STATS.map(d => d.starts));
    container.innerHTML = DAILY_STATS.map(day => {
      const hS = (day.starts / maxVal * 180);
      const hC = (day.completions / maxVal * 180);
      const hL = (day.leads / maxVal * 180);
      return `
        <div class="chart-day">
          <div class="chart-bars">
            <div class="chart-bar" style="height:${hS}px;background:#a855f7">
              <div class="chart-tooltip">${fmt(day.starts)} starts</div>
            </div>
            <div class="chart-bar" style="height:${hC}px;background:#3b82f6">
              <div class="chart-tooltip">${fmt(day.completions)} completions</div>
            </div>
            <div class="chart-bar" style="height:${hL}px;background:#22c55e">
              <div class="chart-tooltip">${fmt(day.leads)} leads</div>
            </div>
          </div>
          <span class="chart-label">${day.date}</span>
        </div>`;
    }).join('');
  }

  // Segment Distribution
  function renderSegments() {
    const container = document.getElementById('segment-bars');
    const maxCount = Math.max(...SEGMENTS.map(s => s.count));
    container.innerHTML = SEGMENTS.map(s => `
      <div class="seg-row">
        <span class="seg-label" title="${s.name}">${s.name}</span>
        <div class="seg-track">
          <div class="seg-fill" style="width:${(s.count / maxCount * 100)}%;background:${s.color}"></div>
        </div>
        <span class="seg-count">${fmt(s.count)}</span>
      </div>
    `).join('');
  }

  // CRM Sync Log
  function renderSyncLog() {
    const container = document.getElementById('sync-log');
    container.innerHTML = CRM_SYNC_LOG.map(log => `
      <li class="sync-item">
        <span class="sync-time">${log.time}</span>
        <span class="sync-name">${log.lead}</span>
        <span class="sync-status sync-${log.status}">${log.status}</span>
        <span class="sync-detail" title="${log.details}">${log.details}</span>
      </li>
    `).join('');
  }

  // ══════════════════════════════════════════════
  // FUNNELS VIEW
  // ══════════════════════════════════════════════

  function renderFunnels(filter) {
    const container = document.getElementById('funnels-grid');
    const filtered = filter === 'all' ? QUIZZES : QUIZZES.filter(q => q.status === filter);
    container.innerHTML = filtered.map(q => {
      const compRate = pct(q.completions, q.starts);
      return `
        <div class="funnel-card ${q.status === 'paused' ? 'paused' : ''}" data-quiz-id="${q.id}">
          <div class="funnel-top">
            <span class="funnel-name">${q.name}</span>
            <span class="funnel-status funnel-${q.status}">${q.status}</span>
          </div>
          <div class="funnel-stats">
            <div class="funnel-stat">
              <span class="funnel-stat-label">Starts</span>
              <span class="funnel-stat-value">${fmt(q.starts)}</span>
            </div>
            <div class="funnel-stat">
              <span class="funnel-stat-label">Completions</span>
              <span class="funnel-stat-value">${fmt(q.completions)}</span>
            </div>
            <div class="funnel-stat">
              <span class="funnel-stat-label">Leads</span>
              <span class="funnel-stat-value">${fmt(q.leads)}</span>
            </div>
          </div>
          <div class="funnel-bar-wrap">
            <div class="funnel-bar-label">
              <span>Completion rate</span>
              <span>${compRate}%</span>
            </div>
            <div class="funnel-bar-track">
              <div class="funnel-bar-fill" style="width:${compRate}%"></div>
            </div>
          </div>
          <div class="funnel-meta">
            <span>${q.steps} questions</span>
            <span>Avg score: ${q.avgScore}</span>
            <span>Top: ${q.topSegment}</span>
          </div>
        </div>`;
    }).join('');

    // Click handlers
    container.querySelectorAll('.funnel-card').forEach(card => {
      card.addEventListener('click', () => openDrawer(card.dataset.quizId));
    });
  }

  // Funnel filter pills
  document.querySelectorAll('[data-funnel-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('[data-funnel-filter]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderFunnels(pill.dataset.funnelFilter);
    });
  });

  // Drawer
  function openDrawer(quizId) {
    const quiz = QUIZZES.find(q => q.id === quizId);
    if (!quiz) return;
    document.getElementById('drawer-title').textContent = quiz.name;
    const body = document.getElementById('drawer-body');

    const compRate = pct(quiz.completions, quiz.starts);
    const leadRate = pct(quiz.leads, quiz.completions);

    body.innerHTML = `
      <div class="drawer-section">
        <h4>Funnel Metrics</h4>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
          <div class="funnel-stat"><span class="funnel-stat-label">Starts</span><span class="funnel-stat-value">${fmt(quiz.starts)}</span></div>
          <div class="funnel-stat"><span class="funnel-stat-label">Completions</span><span class="funnel-stat-value">${fmt(quiz.completions)}</span></div>
          <div class="funnel-stat"><span class="funnel-stat-label">Completion Rate</span><span class="funnel-stat-value">${compRate}%</span></div>
          <div class="funnel-stat"><span class="funnel-stat-label">Lead Capture</span><span class="funnel-stat-value">${leadRate}%</span></div>
          <div class="funnel-stat"><span class="funnel-stat-label">Avg Score</span><span class="funnel-stat-value" style="color:var(--accent)">${quiz.avgScore}</span></div>
          <div class="funnel-stat"><span class="funnel-stat-label">Top Segment</span><span class="funnel-stat-value" style="font-size:14px">${quiz.topSegment}</span></div>
        </div>
      </div>
      <div class="drawer-section">
        <h4>Questions & Scoring Weights</h4>
        ${quiz.questions.map((q, i) => `
          <div class="question-card">
            <div class="question-num">Q${i + 1}</div>
            <div class="question-text">${q.q}</div>
            <div class="question-options">
              ${q.options.map((opt, j) => `
                <span class="option-tag">${opt}<span class="option-weight">+${q.weights[j]}</span></span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="drawer-section">
        <h4>Segmentation Rules</h4>
        ${SEGMENTS.map(s => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12px;">
            <span class="segment-tag" style="background:${s.color}22;color:${s.color}">${s.name}</span>
            <span style="color:var(--text-dim)">${s.criteria}</span>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('funnel-drawer').classList.add('open');
  }

  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);
  function closeDrawer() {
    document.getElementById('funnel-drawer').classList.remove('open');
  }

  // ══════════════════════════════════════════════
  // LEADS VIEW
  // ══════════════════════════════════════════════

  function renderLeads(filter, search) {
    const tbody = document.getElementById('leads-tbody');
    let data = LEADS;
    if (filter && filter !== 'all') {
      data = data.filter(l => l.segment === filter);
    }
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(l => l.name.toLowerCase().includes(s) || l.company.toLowerCase().includes(s) || l.email.toLowerCase().includes(s));
    }

    tbody.innerHTML = data.map(l => `
      <tr data-lead-id="${l.id}">
        <td>
          <div class="lead-name">${l.name}</div>
          <div class="lead-company">${l.company}</div>
        </td>
        <td><span class="lead-quiz" title="${l.quiz}">${l.quiz}</span></td>
        <td><span class="score-badge ${scoreClass(l.score)}">${l.score}</span></td>
        <td><span class="segment-tag" style="background:${segColor(l.segment)}22;color:${segColor(l.segment)}">${l.segment}</span></td>
        <td><span class="crm-badge crm-${l.crmSync}">${l.crmSync}</span></td>
        <td><span class="email-status">${l.emailStatus}</span></td>
        <td><span class="completed-time">${l.completedAt}</span></td>
      </tr>
    `).join('');

    // Click handlers
    tbody.querySelectorAll('tr').forEach(tr => {
      tr.addEventListener('click', () => openLeadModal(tr.dataset.leadId));
    });
  }

  // Segment filter pills (dynamic)
  function buildSegmentFilters() {
    const container = document.querySelector('[data-seg-filter]').parentElement;
    const allPill = container.querySelector('[data-seg-filter="all"]');
    container.innerHTML = '';
    container.appendChild(allPill);
    SEGMENTS.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'pill';
      btn.dataset.segFilter = s.name;
      btn.textContent = s.name;
      container.appendChild(btn);
    });

    container.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        container.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        renderLeads(pill.dataset.segFilter, document.getElementById('lead-search').value);
      });
    });
  }

  // Search
  document.getElementById('lead-search').addEventListener('input', function () {
    const activeFilter = document.querySelector('[data-seg-filter].active');
    renderLeads(activeFilter ? activeFilter.dataset.segFilter : 'all', this.value);
  });

  // Lead Modal
  function openLeadModal(leadId) {
    const lead = LEADS.find(l => l.id === leadId);
    if (!lead) return;
    const quiz = QUIZZES.find(q => q.name === lead.quiz);
    const panel = document.getElementById('lead-modal-panel');

    let answersHtml = '';
    if (quiz && lead.answers) {
      answersHtml = quiz.questions.map((q, i) => {
        const ansIdx = lead.answers[i] || 0;
        return `
          <div class="answer-row">
            <span class="answer-q">${q.q}</span>
            <span class="answer-a">${q.options[ansIdx]}</span>
            <span class="answer-pts">+${q.weights[ansIdx]} pts</span>
          </div>`;
      }).join('');
    }

    panel.innerHTML = `
      <div class="modal-top">
        <h3>${lead.name}</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <div class="modal-row">
        <div class="modal-field">
          <span class="modal-field-label">Email</span>
          <span class="modal-field-value">${lead.email}</span>
        </div>
        <div class="modal-field">
          <span class="modal-field-label">Company</span>
          <span class="modal-field-value">${lead.company}</span>
        </div>
      </div>
      <div class="modal-row">
        <div class="modal-field">
          <span class="modal-field-label">Segment</span>
          <span class="modal-field-value">
            <span class="segment-tag" style="background:${segColor(lead.segment)}22;color:${segColor(lead.segment)}">${lead.segment}</span>
          </span>
        </div>
        <div class="modal-field">
          <span class="modal-field-label">CRM</span>
          <span class="modal-field-value">
            <span class="crm-badge crm-${lead.crmSync}">${lead.crmSync}</span>
            ${lead.crmId ? `<span style="font-size:11px;color:var(--text-dim);margin-left:6px">${lead.crmId}</span>` : ''}
          </span>
        </div>
      </div>

      <div class="score-bar-wrap">
        <div class="score-bar-header">
          <span>Lead Score</span>
          <span style="font-weight:700;color:${scoreBarColor(lead.score)}">${lead.score} / 100</span>
        </div>
        <div class="score-bar-track">
          <div class="score-bar-fill" style="width:${lead.score}%;background:${scoreBarColor(lead.score)}"></div>
        </div>
      </div>

      <div class="modal-row">
        <div class="modal-field">
          <span class="modal-field-label">Email Sequence</span>
          <span class="modal-field-value">${lead.emailStatus}</span>
        </div>
        <div class="modal-field">
          <span class="modal-field-label">Completed</span>
          <span class="modal-field-value" style="font-size:13px">${lead.completedAt}</span>
        </div>
      </div>

      ${answersHtml ? `
        <div class="modal-section">
          <h4>Quiz Answers &mdash; ${lead.quiz}</h4>
          ${answersHtml}
        </div>
      ` : ''}
    `;

    document.getElementById('lead-modal').classList.add('open');
    document.getElementById('modal-close-btn').addEventListener('click', closeLeadModal);
  }

  function closeLeadModal() {
    document.getElementById('lead-modal').classList.remove('open');
  }
  document.getElementById('lead-modal').addEventListener('click', function (e) {
    if (e.target === this) closeLeadModal();
  });

  // ══════════════════════════════════════════════
  // AUTOMATION VIEW
  // ══════════════════════════════════════════════

  function renderRules() {
    const container = document.getElementById('rules-list');
    document.getElementById('rules-count').textContent = `${AUTOMATION_RULES.length} rules`;

    container.innerHTML = AUTOMATION_RULES.map(r => `
      <div class="rule-card rule-${r.status}">
        <div class="rule-icon">${r.status === 'active' ? '&#9889;' : '&#9208;'}</div>
        <div class="rule-body">
          <div class="rule-trigger">${r.trigger}</div>
          <div class="rule-action">${r.action}</div>
          <div class="rule-meta">
            <span class="rule-fires">${fmt(r.fires)} fires</span>
            <span>${r.status}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderSequences() {
    const container = document.getElementById('sequences-list');
    container.innerHTML = EMAIL_SEQUENCES.map(seq => {
      const openRate = pct(seq.opened, seq.enrolled);
      const clickRate = pct(seq.clicked, seq.enrolled);
      const convRate = pct(seq.converted, seq.enrolled);

      // Funnel proportions
      const total = seq.enrolled;
      const wO = (seq.opened / total * 100);
      const wC = (seq.clicked / total * 100);
      const wV = (seq.converted / total * 100);
      const wR = 100 - wO; // remainder not opened

      return `
        <div class="seq-card">
          <div class="seq-top">
            <span class="seq-name">${seq.name}</span>
            <span class="seq-segment" style="background:${segColor(seq.segment)}22;color:${segColor(seq.segment)}">${seq.segment}</span>
          </div>
          <div class="seq-metrics">
            <div class="seq-metric">
              <span class="seq-metric-label">Enrolled</span>
              <span class="seq-metric-value">${fmt(seq.enrolled)}</span>
            </div>
            <div class="seq-metric">
              <span class="seq-metric-label">Open Rate</span>
              <span class="seq-metric-value">${openRate}%</span>
            </div>
            <div class="seq-metric">
              <span class="seq-metric-label">Click Rate</span>
              <span class="seq-metric-value">${clickRate}%</span>
            </div>
            <div class="seq-metric">
              <span class="seq-metric-label">Converted</span>
              <span class="seq-metric-value" style="color:var(--success)">${convRate}%</span>
            </div>
          </div>
          <div class="seq-funnel-bar">
            <div class="seq-funnel-part" style="width:${wV}%;background:var(--success)"></div>
            <div class="seq-funnel-part" style="width:${wC - wV}%;background:var(--info)"></div>
            <div class="seq-funnel-part" style="width:${wO - wC}%;background:var(--accent)"></div>
            <div class="seq-funnel-part" style="width:${wR}%;background:var(--surface2)"></div>
          </div>
        </div>`;
    }).join('');
  }

  function renderScoringMatrix() {
    const container = document.getElementById('scoring-grid');
    container.innerHTML = QUIZZES.filter(q => q.status === 'active').map(quiz => {
      const maxScore = quiz.questions.reduce((sum, q) => sum + Math.max(...q.weights), 0);
      return `
        <div class="scoring-quiz">
          <div class="scoring-quiz-name">${quiz.name}</div>
          <div style="font-size:11px;color:var(--text-dim);margin-bottom:10px">Max possible: ${maxScore} pts &middot; ${quiz.questions.length} questions</div>
          <div class="scoring-row">
            <span class="scoring-range">80-100</span>
            <span class="scoring-arrow">&rarr;</span>
            <span class="scoring-segment-tag" style="background:${segColor('High-Intent Buyer')}22;color:${segColor('High-Intent Buyer')}">High-Intent Buyer</span>
          </div>
          <div class="scoring-row">
            <span class="scoring-range">50-79</span>
            <span class="scoring-arrow">&rarr;</span>
            <span class="scoring-segment-tag" style="background:${segColor('Growth-Stage')}22;color:${segColor('Growth-Stage')}">Growth-Stage</span>
          </div>
          <div class="scoring-row">
            <span class="scoring-range">30-49</span>
            <span class="scoring-arrow">&rarr;</span>
            <span class="scoring-segment-tag" style="background:${segColor('Mid-Market')}22;color:${segColor('Mid-Market')}">Mid-Market</span>
          </div>
          <div class="scoring-row">
            <span class="scoring-range">0-29</span>
            <span class="scoring-arrow">&rarr;</span>
            <span class="scoring-segment-tag" style="background:${segColor('Beginner')}22;color:${segColor('Beginner')}">Beginner</span>
          </div>
        </div>`;
    }).join('');
  }

  // ══════════════════════════════════════════════
  // LIVE SIMULATION
  // ══════════════════════════════════════════════

  let totalLeads = 13450;
  let todayLeads = 407;

  function simulateLive() {
    // Randomly bump a lead count
    const idx = Math.floor(Math.random() * DAILY_STATS.length);
    DAILY_STATS[DAILY_STATS.length - 1].starts += Math.floor(Math.random() * 3);
    DAILY_STATS[DAILY_STATS.length - 1].completions += Math.floor(Math.random() * 2);
    DAILY_STATS[DAILY_STATS.length - 1].leads += Math.floor(Math.random() * 2);

    totalLeads += Math.floor(Math.random() * 3);
    todayLeads += Math.floor(Math.random() * 2);

    document.getElementById('kpi-leads').textContent = fmt(totalLeads);
    document.querySelector('#kpi-leads').closest('.kpi-card').querySelector('.kpi-delta').textContent = `+${todayLeads} today`;

    // Refresh chart if on dashboard
    if (document.getElementById('view-dashboard').classList.contains('active')) {
      renderChart();
    }
  }

  setInterval(simulateLive, 5000);

  // ══════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════

  renderChart();
  renderSegments();
  renderSyncLog();
  renderFunnels('all');
  buildSegmentFilters();
  renderLeads('all', '');
  renderRules();
  renderSequences();
  renderScoringMatrix();

})();
