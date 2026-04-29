/* ================================================================
   script.js — Abhishek Prasad Portfolio
   Sections: Cursor · Nav · Scroll Reveal · Skills Filter ·
             Form Validation · XML Data Loader · Smooth Nav
   ================================================================ */

/* ─── 1. CUSTOM CURSOR ─── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx - 4 + 'px';
    cursor.style.top  = my - 4 + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // enlarge ring on interactive elements
  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.6)');
    el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
  });
})();


/* ─── 2. NAV — scroll shrink + hamburger ─── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
})();


/* ─── 3. SCROLL-REVEAL ─── */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
})();


/* ─── 4. SKILLS FILTER ─── */
function filterSkills(cat, btn) {
  // update active button
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // show / hide cards
  document.querySelectorAll('.skill-card').forEach(card => {
    const visible = cat === 'all' || card.dataset.cat === cat;
    card.style.display   = visible ? '' : 'none';
    card.style.animation = visible ? 'fadeUp 0.4s ease both' : '';
  });
}


/* ─── 5. CONTACT FORM VALIDATION ─── */
/**
 * Validates a single field and shows/hides its error message.
 * @param {string}   id      – element id
 * @param {string}   errId   – error span id
 * @param {Function} checkFn – value → boolean
 * @returns {boolean}
 */
function validateField(id, errId, checkFn) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok  = checkFn(el.value.trim());
  el.classList.toggle('error', !ok);
  err.style.display = ok ? 'none' : 'block';
  return ok;
}

function submitForm() {
  const v1 = validateField('fname',   'fnameError',   v => v.length > 0);
  const v2 = validateField('email',   'emailError',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
  const v3 = validateField('subject', 'subjectError', v => v.length > 0);
  const v4 = validateField('message', 'messageError', v => v.length >= 20);

  if (v1 && v2 && v3 && v4) {
    document.getElementById('contactForm').style.display  = 'none';
    document.getElementById('formSuccess').style.display  = 'block';
  }
}

// clear error state on input
['fname', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', function () {
    this.classList.remove('error');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.style.display = 'none';
  });
});


/* ─── 6. XML DATA LOADER ─── */
/**
 * Fetches data.xml, parses it, and dynamically populates the DOM.
 * Falls back gracefully — if the file isn't served the static HTML remains.
 */
(function loadXMLData() {

  fetch('data.xml')
    .then(res => {
      if (!res.ok) throw new Error('XML not found');
      return res.text();
    })
    .then(text => {
      const parser = new DOMParser();
      const xml    = parser.parseFromString(text, 'text/xml');

      populateSkills(xml);
      populateProjects(xml);
      populateExperience(xml);
      populateCertifications(xml);
      populateEducation(xml);
      populateLanguages(xml);
      populateContactInfo(xml);
    })
    .catch(() => {
      // silent fallback — static HTML is already rendered
      console.info('data.xml not loaded via fetch; static HTML is in use.');
    });


  /* helpers */
  function getText(node, tag) {
    const el = node.querySelector(tag);
    return el ? el.textContent.trim() : '';
  }

  function githubSVG() {
    return `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
      0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7
      c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998
      .108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22
      -.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405
      1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176
      .765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
      0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297
      c0-6.627-5.373-12-12-12"/>
    </svg>`;
  }

  /* 6a. Skills */
  function populateSkills(xml) {
    const grid = document.getElementById('skillsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    xml.querySelectorAll('skill').forEach(s => {
      const name = getText(s, 'name');
      const icon = getText(s, 'icon');
      const cat  = s.getAttribute('category') || 'tools';
      grid.insertAdjacentHTML('beforeend', `
        <div class="skill-card" data-cat="${cat}">
          <div class="skill-icon">${icon}</div>
          <div class="skill-name">${name}</div>
          <div class="skill-cat">${cat}</div>
        </div>`);
    });
  }

  /* 6b. Projects */
  function populateProjects(xml) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    xml.querySelectorAll('project').forEach(p => {
      const title = getText(p, 'title');
      const desc  = getText(p, 'description');
      const icon  = getText(p, 'icon');
      const tags  = Array.from(p.querySelectorAll('tag')).map(t => {
        const type = t.getAttribute('type') || 'cyan';
        const cls  = type === 'purple' ? 'tag purple' : type === 'green' ? 'tag green' : 'tag';
        return `<span class="${cls}">${t.textContent.trim()}</span>`;
      }).join('');

      grid.insertAdjacentHTML('beforeend', `
        <div class="project-card">
          <div class="project-header">
            <div class="project-icon">${icon}</div>
            <div class="project-links">
              <a href="https://github.com/abhishek-3917" target="_blank" class="project-link">${githubSVG()}</a>
            </div>
          </div>
          <div class="project-body">
            <div class="project-title">${title}</div>
            <p class="project-desc">${desc}</p>
            <div class="project-tags">${tags}</div>
          </div>
        </div>`);
    });
  }

  /* 6c. Experience */
  function populateExperience(xml) {
    const container = document.getElementById('expContainer');
    if (!container) return;
    container.innerHTML = '';
    xml.querySelectorAll('job').forEach(job => {
      const company  = getText(job, 'company');
      const location = getText(job, 'location');
      const role     = getText(job, 'role');
      const period   = getText(job, 'period');
      const points   = Array.from(job.querySelectorAll('point'))
        .map(pt => `<li>${pt.textContent.trim()}</li>`).join('');

      container.insertAdjacentHTML('beforeend', `
        <div class="exp-item">
          <div class="exp-top">
            <div>
              <div class="exp-company">${company} · ${location}</div>
              <div class="exp-role">${role}</div>
            </div>
            <div class="exp-date">${period}</div>
          </div>
          <ul class="exp-desc">${points}</ul>
        </div>`);
    });
  }

  /* 6d. Certifications */
  function populateCertifications(xml) {
    const container = document.getElementById('certsContainer');
    if (!container) return;
    container.innerHTML = '';
    xml.querySelectorAll('cert').forEach(c => {
      const icon   = getText(c, 'icon');
      const type   = getText(c, 'type');
      const name   = getText(c, 'name');
      const issuer = getText(c, 'issuer');
      container.insertAdjacentHTML('beforeend', `
        <div class="cert-card">
          <div class="cert-icon ${type}">${icon}</div>
          <div>
            <div class="cert-name">${name}</div>
            <div class="cert-issuer">${issuer}</div>
          </div>
        </div>`);
    });
  }

  /* 6e. Education */
  function populateEducation(xml) {
    const list = document.getElementById('eduList');
    if (!list) return;
    list.innerHTML = '';
    xml.querySelectorAll('institution').forEach(inst => {
      const degree   = getText(inst, 'degree');
      const school   = getText(inst, 'school');
      const year     = getText(inst, 'year');
      const location = getText(inst, 'location');
      list.insertAdjacentHTML('beforeend', `
        <li class="edu-item">
          <div class="edu-degree">${degree}</div>
          <div class="edu-school">${school}</div>
          <div class="edu-year">${year} · ${location}</div>
        </li>`);
    });
  }

  /* 6f. Languages */
  function populateLanguages(xml) {
    const row = document.getElementById('langRow');
    if (!row) return;
    row.innerHTML = '';
    xml.querySelectorAll('language').forEach(l => {
      const flag  = getText(l, 'flag');
      const name  = getText(l, 'name');
      const level = getText(l, 'level');
      row.insertAdjacentHTML('beforeend', `
        <div class="lang-item">
          <span class="lang-flag">${flag}</span>
          <div>
            <div class="lang-name">${name}</div>
            <div class="lang-level">${level}</div>
          </div>
        </div>`);
    });
  }

  /* 6g. Contact info */
  function populateContactInfo(xml) {
    const p = xml.querySelector('personal');
    if (!p) return;
    const emailEl  = document.getElementById('contactEmail');
    const phoneEl  = document.getElementById('contactPhone');
    const liEl     = document.getElementById('contactLinkedin');
    const ghEl     = document.getElementById('contactGithub');
    const locEl    = document.getElementById('contactLocation');

    if (emailEl)  { emailEl.href = `mailto:${getText(p,'email')}`;   emailEl.querySelector('.contact-value').textContent  = getText(p,'email');   }
    if (phoneEl)  { phoneEl.href = `tel:${getText(p,'phone')}`;       phoneEl.querySelector('.contact-value').textContent  = getText(p,'phone');   }
    if (liEl)     { liEl.href    = getText(p,'linkedin');              liEl.querySelector('.contact-value').textContent     = getText(p,'linkedin').replace('https://',''); }
    if (ghEl)     { ghEl.href    = getText(p,'github');                ghEl.querySelector('.contact-value').textContent     = getText(p,'github').replace('https://','');  }
    if (locEl)    { locEl.querySelector('.contact-value').textContent = getText(p,'location'); }
  }

})();


/* ─── 7. SMOOTH SCROLL for nav links ─── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('navLinks')?.classList.remove('open');
    });
  });
})();
