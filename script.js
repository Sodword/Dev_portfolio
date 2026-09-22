document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.wave_links');

  if (menuToggle && links) {
    menuToggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('show');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation');
      });
    });
  }

  const portfolioCards = document.querySelectorAll('.portfolio-card:not(.reveal-item)');
  portfolioCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(60px)';
    card.style.transition = 'transform 1.5s ease-out, opacity 1.5s ease-out';
  });

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observerInstance.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 })
    : null;
  portfolioCards.forEach(card => observer ? observer.observe(card) : (card.style.opacity = '1'));

  const heroSection = document.querySelector('.port_hero_section');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => heroSection.classList.toggle('show', entry.isIntersecting));
    }, { threshold: 0.3 });
    heroObserver.observe(heroSection);
  }

  const apiTestButton = document.querySelector('[data-api-test-button]');
  const apiTestResult = document.querySelector('[data-api-test-result]');
  if (apiTestButton && apiTestResult) {
    apiTestButton.addEventListener('click', async () => {
      apiTestButton.disabled = true;
      apiTestResult.className = 'api-test-result';
      apiTestResult.textContent = 'Loading...';

      try {
        const response = await fetch('http://localhost:3000/api/test');
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const data = await response.json();
        apiTestResult.classList.add('api-test-success');
        apiTestResult.textContent = data.message;
      } catch (error) {
        apiTestResult.classList.add('api-test-error');
        apiTestResult.textContent = 'Unable to connect to the API. Please make sure the backend is running.';
      } finally {
        apiTestButton.disabled = false;
      }
    });
  }

  const whatIDo = document.querySelector('.what-i-do');
  if (whatIDo && 'IntersectionObserver' in window) {
    const whatIDoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => whatIDo.classList.toggle('show', entry.isIntersecting));
    }, { threshold: 0.2 });
    whatIDoObserver.observe(whatIDo);
  }

  const recentWorkElements = document.querySelectorAll('.recent-work h2, .recent-work > p, .recent-work .portfolio-card');
  if ('IntersectionObserver' in window) {
    const recentWorkObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('show-animation', entry.isIntersecting));
    }, { threshold: 0.15 });
    recentWorkElements.forEach(element => {
      if (element instanceof Element) recentWorkObserver.observe(element);
    });
  }

  const revealSections = document.querySelectorAll('.reveal-section');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0.15 });
    revealSections.forEach(section => {
      if (section instanceof Element) revealObserver.observe(section);
    });
  } else {
    revealSections.forEach(section => section.classList.add('is-visible'));
  }

  const blogListView = document.querySelector('[data-blog-list-view]');
  const blogArticleView = document.querySelector('[data-blog-article-view]');
  const blogGrid = document.querySelector('[data-blog-grid]');
  const featuredArticle = document.querySelector('[data-featured-article]');

  if (blogListView && blogArticleView && blogGrid && window.blogArticles) {
    const categories = ['All', 'Frontend', 'React', 'JavaScript', 'API', 'Web Development', 'Learning'];
    const searchInput = document.querySelector('#blog-search');
    const emptyState = document.querySelector('[data-blog-empty]');
    const categoryFilters = document.querySelector('[data-category-filters]');
    let selectedCategory = 'All';

    const articleUrl = slug => `blog.html#article/${slug}`;
    const articleMatches = (article, query) => {
      const searchableText = [article.title, article.excerpt, article.category, ...article.tags].join(' ').toLowerCase();
      return searchableText.includes(query);
    };

    const tagMarkup = tags => tags.map(tag => `<span>#${tag}</span>`).join('');
    const metadataMarkup = article => `<span>${article.category}</span><span>${article.date}</span><span>${article.readingTime}</span>`;
    const buttonMarkup = article => `<a class="primary-button" href="${articleUrl(article.slug)}">Read article <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>`;

    const renderFeatured = () => {
      const article = window.blogArticles.find(item => item.featured);
      featuredArticle.innerHTML = `<div class="featured-copy"><span class="section-kicker">Featured article</span><div class="article-meta">${metadataMarkup(article)}</div><h2>${article.title}</h2><p>${article.excerpt}</p>${buttonMarkup(article)}</div><div class="featured-mark" aria-hidden="true"><span>01</span><strong>Build<br>and<br>learn</strong></div>`;
    };

    const renderFilters = () => {
      categoryFilters.innerHTML = categories.map(category => `<button type="button" class="category-filter${category === selectedCategory ? ' is-active' : ''}" data-category="${category}" aria-pressed="${category === selectedCategory}">${category}</button>`).join('');
      categoryFilters.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        renderFilters();
        renderCards();
      }));
    };

    const renderCards = () => {
      const query = (searchInput.value || '').trim().toLowerCase();
      const visibleArticles = window.blogArticles.filter(article => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory || article.tags.includes(selectedCategory);
        return matchesCategory && articleMatches(article, query);
      });
      blogGrid.innerHTML = visibleArticles.map(article => `<article class="blog-card reveal-item"><div class="article-meta">${metadataMarkup(article)}</div><h3>${article.title}</h3><p>${article.excerpt}</p><div class="article-tags">${tagMarkup(article.tags)}</div>${buttonMarkup(article)}</article>`).join('');
      blogGrid.classList.remove('is-rendered');
      window.requestAnimationFrame(() => blogGrid.classList.add('is-rendered'));
      emptyState.hidden = visibleArticles.length > 0;
    };

    const renderArticle = () => {
      const slug = window.location.hash.replace('#article/', '');
      const article = window.blogArticles.find(item => item.slug === slug);
      if (!article) {
        blogListView.hidden = false;
        blogArticleView.hidden = true;
        return;
      }
      blogListView.hidden = true;
      blogArticleView.hidden = false;
      blogArticleView.innerHTML = `<a class="back-link" href="blog.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back to blog</a><div class="article-header"><span class="section-kicker">${article.category}</span><h1>${article.title}</h1><div class="article-meta">${metadataMarkup(article)}</div><div class="article-tags">${tagMarkup(article.tags)}</div></div><div class="article-body"><p class="article-lead">${article.excerpt}</p>${article.sections.map(section => `<section><h2>${section[0]}</h2><p>${section[1]}</p>${section[2] ? `<p>${section[2]}</p>` : ''}${section[0] === 'A small example' && article.code ? `<pre><code>${article.code}</code></pre>` : ''}</section>`).join('')}<a class="primary-button" href="blog.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back to blog</a></div>`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    searchInput.addEventListener('input', renderCards);
    window.addEventListener('hashchange', renderArticle);
    renderFeatured();
    renderFilters();
    renderCards();
    renderArticle();
  }

  const bitsApp = document.querySelector('[data-bits-app]');
  if (bitsApp && window.bitsExperiments) {
    const bitsGrid = bitsApp.querySelector('[data-bits-grid]');
    const bitsDetail = bitsApp.querySelector('[data-bits-detail]');
    const bitsFeatured = bitsApp.querySelector('[data-bits-featured]');
    const bitsFilters = bitsApp.querySelector('[data-bits-filters]');
    const bitsSearch = bitsApp.querySelector('#bits-search');
    const bitsEmpty = bitsApp.querySelector('[data-bits-empty]');
    const bitsCategories = ['All', 'CSS', 'JavaScript', 'React', 'Animation', 'UI', 'API', 'Experiment'];
    let bitsCategory = 'All';

    const bitUrl = slug => `bits.html#bit/${slug}`;
    const bitTags = tags => tags.map(tag => `<span>#${tag}</span>`).join('');
    const bitMeta = bit => `<span>${bit.category}</span><span>${bit.tags.join(' · ')}</span>`;
    const preview = (bit, compact = false) => {
      if (bit.type === 'playground') return `<div class="bit-playground" data-demo-theme="light"><div class="playground-screen"><span class="preview-label">Local playground</span><strong data-playground-message>Make a small change</strong><span data-playground-value>0</span></div><div class="playground-controls"><button type="button" class="demo-button demo-button-pink" data-playground-action="accent">Accent</button><button type="button" class="demo-button demo-button-outline" data-playground-action="increment">Count</button><button type="button" class="demo-button demo-button-dark" data-playground-action="theme">Theme</button></div></div>`;
      if (bit.type === 'buttons') return `<div class="bit-demo-buttons"><button type="button" class="demo-button demo-button-pink">Hover me</button><button type="button" class="demo-button demo-button-outline">Focus me</button></div>`;
      if (bit.type === 'loader') return `<div class="bit-loader-demo" data-loader-state="idle"><span class="loader-ring" aria-hidden="true"></span><strong data-loader-label>Ready for a request</strong><button type="button" class="demo-button demo-button-outline" data-loader-action>Run animation</button></div>`;
      if (bit.type === 'theme') return `<div class="bit-theme-demo" data-demo-theme="light"><div><span class="preview-label">Preview theme</span><strong data-theme-label>Light mode</strong></div><button type="button" class="demo-button demo-button-dark" data-theme-toggle aria-pressed="false"><i class="fa fa-moon-o" aria-hidden="true"></i> Switch theme</button></div>`;
      if (bit.type === 'reveal') return `<div class="bit-reveal-demo"><div class="reveal-note" data-reveal-note>First note</div><div class="reveal-note" data-reveal-note>Second note</div><button type="button" class="demo-button demo-button-outline" data-reveal-action>Reveal notes</button></div>`;
      if (bit.type === 'counter') return `<div class="bit-counter-demo"><span class="counter-value" data-counter-value>0</span><div><button type="button" class="demo-button demo-button-outline" data-counter-action="decrement" aria-label="Decrease counter">−</button><button type="button" class="demo-button demo-button-pink" data-counter-action="increment" aria-label="Increase counter">+</button><button type="button" class="demo-button demo-button-dark" data-counter-action="reset">Reset</button></div></div>`;
      if (bit.type === 'password') return `<div class="bit-password-demo"><label for="password-${bit.slug}">Try a password hint<input id="password-${bit.slug}" type="password" autocomplete="off" data-password-input placeholder="Type privately"></label><div class="strength-track"><span data-strength-bar></span></div><strong data-strength-label>Type to check strength</strong></div>`;
      if (bit.type === 'search') return `<div class="bit-search-demo"><label for="filter-${bit.slug}">Filter topics<input id="filter-${bit.slug}" type="search" data-topic-search placeholder="Try “CSS”"></label><div class="topic-list" data-topic-list><span data-topic="CSS">CSS</span><span data-topic="React">React</span><span data-topic="APIs">APIs</span><span data-topic="Accessibility">Accessibility</span></div><small data-topic-empty hidden>No topic found.</small></div>`;
      if (bit.type === 'modal') return `<div class="bit-modal-demo"><button type="button" class="demo-button demo-button-pink" data-modal-open>Open dialog</button><span>Press Escape or use Close.</span><div class="demo-modal" data-demo-modal hidden role="dialog" aria-modal="true" aria-labelledby="demo-modal-title"><div class="demo-modal-backdrop" data-modal-close></div><div class="demo-modal-panel"><button type="button" class="demo-modal-close" data-modal-close aria-label="Close dialog">&times;</button><span class="section-kicker">Small detail</span><h3 id="demo-modal-title">A focused interruption</h3><p>This dialog has a real close path and returns focus to its trigger.</p><button type="button" class="primary-button" data-modal-close>Close dialog</button></div></div></div>`;
      return `<div class="bit-api-demo"><span class="api-status-dot" aria-hidden="true"></span><div><strong>Connection not configured</strong><p>This Bit is ready for a real endpoint when one is chosen.</p></div><span class="api-state">No request made</span></div>`;
    };

    const cardMarkup = bit => `<article class="bit-card bit-card-interactive reveal-item"><div class="bit-card-preview" data-bit-preview>${preview(bit, true)}</div><div class="bit-card-content"><div class="bit-meta">${bitMeta(bit)}</div><h3>${bit.title}</h3><p>${bit.description}</p><div class="bit-tags">${bitTags(bit.tags)}</div><a class="primary-button" href="${bitUrl(bit.slug)}">View experiment <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a></div></article>`;

    const bindPreview = root => {
      if (!root || root.dataset.bound === 'true') return;
      root.dataset.bound = 'true';
      const counterValue = root.querySelector('[data-counter-value]');
      let count = 0;
      root.querySelectorAll('[data-counter-action]').forEach(button => button.addEventListener('click', () => {
        count = button.dataset.counterAction === 'reset' ? 0 : count + (button.dataset.counterAction === 'increment' ? 1 : -1);
        counterValue.textContent = count;
      }));
      const playgroundValue = root.querySelector('[data-playground-value]');
      let playgroundCount = 0;
      root.querySelectorAll('[data-playground-action]').forEach(button => button.addEventListener('click', () => {
        const action = button.dataset.playgroundAction;
        if (action === 'increment') { playgroundCount += 1; playgroundValue.textContent = playgroundCount; root.querySelector('[data-playground-message]').textContent = 'A state changed'; }
        if (action === 'accent') root.classList.toggle('playground-accent');
        if (action === 'theme') root.dataset.demoTheme = root.dataset.demoTheme === 'dark' ? 'light' : 'dark';
      }));
      const loaderAction = root.querySelector('[data-loader-action]');
      if (loaderAction) loaderAction.addEventListener('click', () => {
        const label = root.querySelector('[data-loader-label]');
        root.dataset.loaderState = 'loading'; label.textContent = 'Working locally...'; loaderAction.disabled = true;
        window.setTimeout(() => { root.dataset.loaderState = 'complete'; label.textContent = 'Complete'; loaderAction.disabled = false; loaderAction.textContent = 'Run again'; }, 900);
      });
      const themeToggle = root.querySelector('[data-theme-toggle]');
      if (themeToggle) themeToggle.addEventListener('click', () => { const dark = root.dataset.demoTheme !== 'dark'; root.dataset.demoTheme = dark ? 'dark' : 'light'; themeToggle.setAttribute('aria-pressed', String(dark)); root.querySelector('[data-theme-label]').textContent = dark ? 'Dark mode' : 'Light mode'; });
      const revealAction = root.querySelector('[data-reveal-action]');
      if (revealAction) revealAction.addEventListener('click', () => { root.classList.add('is-revealed'); revealAction.textContent = 'Notes revealed'; });
      const passwordInput = root.querySelector('[data-password-input]');
      if (passwordInput) passwordInput.addEventListener('input', () => { const value = passwordInput.value; const score = [value.length >= 8, /[A-Z]/.test(value), /[0-9]/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length; const labels = ['Type to check strength', 'Needs more variety', 'Getting stronger', 'Strong hint']; root.querySelector('[data-strength-label]').textContent = labels[score]; root.querySelector('[data-strength-bar]').style.width = `${score * 25}%`; root.querySelector('[data-strength-bar]').dataset.score = score; });
      const topicSearch = root.querySelector('[data-topic-search]');
      if (topicSearch) topicSearch.addEventListener('input', () => { const query = topicSearch.value.toLowerCase(); let matches = 0; root.querySelectorAll('[data-topic]').forEach(topic => { const visible = topic.dataset.topic.toLowerCase().includes(query); topic.hidden = !visible; if (visible) matches += 1; }); root.querySelector('[data-topic-empty]').hidden = matches > 0; });
      const modal = root.querySelector('[data-demo-modal]'); const modalOpen = root.querySelector('[data-modal-open]');
      if (modalOpen && modal) { let lastTrigger; const closeModal = () => { modal.hidden = true; if (lastTrigger) lastTrigger.focus(); }; modalOpen.addEventListener('click', () => { lastTrigger = modalOpen; modal.hidden = false; modal.querySelector('[data-modal-close]').focus(); }); root.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', closeModal)); root.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeModal(); }); }
    };

    const renderBitsFilters = () => {
      bitsFilters.innerHTML = bitsCategories.map(category => `<button type="button" class="bits-filter${category === bitsCategory ? ' is-active' : ''}" data-bits-category="${category}" aria-pressed="${category === bitsCategory}">${category}</button>`).join('');
      bitsFilters.querySelectorAll('[data-bits-category]').forEach(button => button.addEventListener('click', () => { bitsCategory = button.dataset.bitsCategory; renderBitsFilters(); renderBits(); }));
    };
    const renderBits = () => {
      const query = bitsSearch.value.trim().toLowerCase();
      const matches = window.bitsExperiments.filter(bit => (bitsCategory === 'All' || bit.category === bitsCategory || bit.tags.includes(bitsCategory)) && [bit.title, bit.description, bit.category, ...bit.tags].join(' ').toLowerCase().includes(query));
      bitsGrid.innerHTML = matches.map(cardMarkup).join('');
      bitsGrid.classList.remove('is-rendered'); window.requestAnimationFrame(() => bitsGrid.classList.add('is-rendered'));
      bitsGrid.querySelectorAll('[data-bit-preview]').forEach(bindPreview); bitsEmpty.hidden = matches.length > 0;
    };
    const renderBitDetail = () => {
      const slug = window.location.hash.replace('#bit/', ''); const bit = window.bitsExperiments.find(item => item.slug === slug);
      const listSections = bitsApp.querySelectorAll('.bits-hero, .bits-content');
      if (!bit) { listSections.forEach(section => section.hidden = false); bitsDetail.hidden = true; return; }
      listSections.forEach(section => section.hidden = true); bitsDetail.hidden = false;
      bitsDetail.innerHTML = `<a class="back-link" href="bits.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back to Bits</a><div class="bits-detail-header"><span class="section-kicker">${bit.category}</span><h1>${bit.title}</h1><div class="bit-meta">${bitMeta(bit)}</div><div class="bit-tags">${bitTags(bit.tags)}</div></div><div class="bits-detail-layout"><div class="bits-detail-preview">${preview(bit)}</div><div class="bits-detail-copy"><p class="bits-detail-lead">${bit.description}</p><h2>How it works</h2><p>${bit.how}</p><h2>What I learned</h2><p>${bit.learned}</p><h2>Technologies</h2><div class="bit-tags">${bitTags(bit.tags)}</div></div></div><a class="primary-button" href="bits.html"><i class="fa fa-long-arrow-left" aria-hidden="true"></i> Back to Bits</a>`;
      bindPreview(bitsDetail.querySelector('[data-bit-preview]')); window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const featured = window.bitsExperiments[0]; bitsFeatured.innerHTML = `<div class="bits-featured"><div class="bits-featured-copy"><span class="section-kicker">Featured Bit</span><h2>${featured.title}</h2><p>${featured.description}</p><div class="bit-tags">${bitTags(featured.tags)}</div><a class="primary-button" href="${bitUrl(featured.slug)}">View experiment <i class="fa fa-long-arrow-right" aria-hidden="true"></i></a></div><div class="bits-featured-preview" data-bit-preview>${preview(featured)}</div></div>`;
    bitsSearch.addEventListener('input', renderBits); window.addEventListener('hashchange', renderBitDetail); renderBitsFilters(); renderBits(); bindPreview(bitsFeatured.querySelector('[data-bit-preview]')); renderBitDetail();
  }

  const projectFilters = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('[data-project-card]');
  const projectEmptyState = document.querySelector('[data-project-empty]');
  const caseStudy = document.querySelector('[data-case-study]');
  const caseStudyOpenButtons = document.querySelectorAll('[data-case-study-open]');
  const caseStudyCloseButton = document.querySelector('[data-case-study-close]');

  if (projectFilters.length && projectCards.length) {
    const filterTimeouts = new WeakMap();

    projectFilters.forEach(filterButton => {
      filterButton.addEventListener('click', () => {
        const selectedCategory = filterButton.dataset.projectFilter;
        let visibleProjects = 0;

        projectFilters.forEach(button => {
          const isActive = button === filterButton;
          button.classList.toggle('is-active', isActive);
          button.setAttribute('aria-pressed', String(isActive));
        });

        projectCards.forEach(card => {
          const categories = card.dataset.categories.split(' ');
          const shouldShow = selectedCategory === 'all' || categories.includes(selectedCategory);
          const existingTimeout = filterTimeouts.get(card);

          if (existingTimeout) window.clearTimeout(existingTimeout);

          if (shouldShow) {
            card.hidden = false;
            window.requestAnimationFrame(() => card.classList.remove('is-filtered'));
            visibleProjects += 1;
          } else {
            card.classList.add('is-filtered');
            filterTimeouts.set(card, window.setTimeout(() => {
              card.hidden = true;
            }, 300));
          }
        });

        if (projectEmptyState) projectEmptyState.hidden = visibleProjects > 0;
      });
    });
  }

  if (caseStudy && caseStudyOpenButtons.length) {
    const closeCaseStudy = () => {
      caseStudy.classList.remove('is-open');
      window.setTimeout(() => {
        caseStudy.hidden = true;
      }, 300);
    };

    caseStudyOpenButtons.forEach(button => button.addEventListener('click', () => {
      caseStudy.hidden = false;
      window.requestAnimationFrame(() => caseStudy.classList.add('is-open'));
      caseStudy.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));

    if (caseStudyCloseButton) caseStudyCloseButton.addEventListener('click', closeCaseStudy);
  }

  const filterInput = document.querySelector('[data-filter-input]');
  if (filterInput) {
    const filterType = filterInput.dataset.filterInput;
    const filterItems = document.querySelectorAll(`[data-filter-item="${filterType}"]`);
    const emptyState = document.querySelector(`[data-empty-state="${filterType}"]`);
    filterInput.addEventListener('input', () => {
      const query = filterInput.value.trim().toLowerCase();
      let matches = 0;
      filterItems.forEach(item => {
        const isMatch = !query || item.dataset.search.includes(query);
        item.hidden = !isMatch;
        if (isMatch) matches += 1;
      });
      if (emptyState) emptyState.hidden = matches > 0;
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  const formNote = document.querySelector('[data-form-note]');
  const submitButton = document.querySelector('[data-submit-button]');
  const successModal = document.querySelector('[data-success-modal]');
  const successModalCloseButtons = document.querySelectorAll('[data-success-modal-close]');
  let successModalCloseTimeout;

  const closeSuccessModal = () => {
    if (!successModal || successModal.hidden) return;
    successModal.classList.add('is-closing');
    clearTimeout(successModalCloseTimeout);
    successModalCloseTimeout = setTimeout(() => {
      successModal.hidden = true;
      successModal.classList.remove('is-closing');
      document.body.classList.remove('success-modal-open');
    }, 220);
  };

  const openSuccessModal = () => {
    if (!successModal) return;
    clearTimeout(successModalCloseTimeout);
    successModal.hidden = false;
    successModal.classList.remove('is-closing');
    document.body.classList.add('success-modal-open');
    successModal.querySelector('.success-modal-close').focus();
  };

  successModalCloseButtons.forEach(button => button.addEventListener('click', closeSuccessModal));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeSuccessModal();
  });

  if (contactForm && formNote && submitButton) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      formNote.className = 'form-note';
      formNote.textContent = '';
      contactForm.querySelectorAll('[aria-invalid="true"]').forEach(field => field.removeAttribute('aria-invalid'));

      const requiredFields = [...contactForm.querySelectorAll('[required]')];
      const invalidFields = requiredFields.filter(field => !field.value.trim() || (field.type === 'email' && !field.validity.valid));
      if (invalidFields.length) {
        invalidFields.forEach(field => field.setAttribute('aria-invalid', 'true'));
        formNote.classList.add('form-note-error');
        formNote.textContent = 'Please complete the required fields with valid details.';
        invalidFields[0].focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      submitButton.innerHTML = 'Sending... <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>';
      formNote.classList.add('form-note-pending');
      formNote.textContent = 'Sending your message...';

      const contactData = {
        name: contactForm.elements.name.value.trim(),
        email: contactForm.elements.email.value.trim(),
        subject: contactForm.elements.subject.value.trim(),
        message: contactForm.elements.message.value.trim()
      };

      try {
        const response = await fetch('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });
        const responseText = await response.text();
        let data = {};
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          data = {};
        }

        if (!response.ok) {
          throw new Error(data.error || `Request failed with status ${response.status}.`);
        }

        formNote.className = 'form-note form-note-success';
        formNote.textContent = data.message || 'Your message was sent successfully.';
        contactForm.reset();
        openSuccessModal();
      } catch (error) {
        formNote.className = 'form-note form-note-error';
        formNote.textContent = error instanceof TypeError
          ? 'Unable to connect to the API. Please try again later.'
          : error.message;
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.innerHTML = 'Prepare message <i class="fa fa-arrow-right" aria-hidden="true"></i>';
      }
    });
  }
});
