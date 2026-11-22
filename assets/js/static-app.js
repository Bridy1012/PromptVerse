/* ============================================================
   PromptVerse 静态只读版 · 路由与页面渲染（无后台、无写操作）
   ============================================================ */
(function (global) {
  'use strict';

  var PV = global.PV;
  var UI = PV.UI;
  var STORE = PV.STORE;
  var icon = UI.icon;
  var esc = UI.esc;

  var app = document.getElementById('app');
  var current = { path: '/', query: {} };

  function parseHash() {
    var h = global.location.hash.replace(/^#/, '');
    if (!h) h = '/';
    var qi = h.indexOf('?');
    var path = qi >= 0 ? h.slice(0, qi) : h;
    var qs = qi >= 0 ? h.slice(qi + 1) : '';
    var query = {};
    qs.split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('=');
      var k = i >= 0 ? pair.slice(0, i) : pair;
      var v = i >= 0 ? pair.slice(i + 1) : '';
      try {
        query[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
      } catch (e) {
        query[k] = v;
      }
    });
    if (path.length > 1 && path.charAt(path.length - 1) === '/') path = path.slice(0, -1);
    return { path: path, query: query };
  }

  function go(path) {
    global.location.hash = '#' + path;
  }

  function replaceHash(path) {
    try {
      global.history.replaceState(null, '', '#' + path);
    } catch (e) {
      global.location.hash = '#' + path;
    }
    current = parseHash();
  }

  function buildQuery(params) {
    var parts = [];
    Object.keys(params).forEach(function (k) {
      var v = params[k];
      if (v == null || v === '' || v === false) return;
      if (Array.isArray(v)) {
        if (!v.length) return;
        v = v.join(',');
      }
      parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return parts.length ? '?' + parts.join('&') : '';
  }

  function categoryPath(params) {
    return '/category' + buildQuery(params || {});
  }

  function setMeta(title, description) {
    document.title = title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }

  function readCategoryQuery() {
    var tags = String(current.query.tags || '')
      .split(',')
      .map(function (t) {
        return t.trim();
      })
      .filter(Boolean);
    return {
      q: current.query.q || '',
      category: current.query.category || '',
      tags: tags,
      page: parseInt(current.query.page, 10) || 1
    };
  }

  /* ------------------------ 公共布局 ------------------------ */
  function siteHeader(active) {
    return (
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="#/">' + icon('logo') + '<span>PromptVerse</span></a>' +
      '<nav class="nav">' +
      '<a href="#/" class="' + (active === 'home' ? 'active' : '') + '">发现</a>' +
      '<a href="#/category" class="' + (active === 'category' ? 'active' : '') + '">分类</a>' +
      '</nav>' +
      '<span class="chip" style="margin-left:12px">只读镜像</span>' +
      '</div></header>'
    );
  }

  function siteFooter() {
    var meta = global.PV_DATA || {};
    return (
      '<footer class="site-footer"><div class="container footer-inner">' +
      '<div class="footer-brand">' + icon('logo') + '<span>PromptVerse</span></div>' +
      '<p class="footer-note">只读镜像 · 内容由管理员整理，仅供学习交流使用。' +
      (meta.generated_at ? '数据快照：' + esc(String(meta.generated_at).slice(0, 10)) : '') +
      '</p>' +
      '<div class="footer-links"><a href="#/">发现</a><a href="#/category">分类</a></div>' +
      '</div></footer>'
    );
  }

  /* ------------------------ 首页 ------------------------ */
  var demoRecent = [];
  var demoCurrent = null;

  function pickDemo() {
    var pool = STORE.query({ perPage: 1000 }).items;
    if (!pool.length) return null;
    var candidates = pool.filter(function (p) {
      return p.id !== (demoCurrent && demoCurrent.id) && demoRecent.indexOf(p.id) === -1;
    });
    if (!candidates.length) {
      demoRecent = [];
      candidates = pool.filter(function (p) {
        return !demoCurrent || p.id !== demoCurrent.id;
      });
    }
    if (!candidates.length) candidates = pool;
    var pick = candidates[Math.floor(Math.random() * candidates.length)];
    demoCurrent = pick;
    demoRecent.push(pick.id);
    while (demoRecent.length > 6) demoRecent.shift();
    return pick;
  }

  function demoCard() {
    var p = pickDemo();
    var text = p ? p.content : '';
    return (
      '<div class="demo-card">' +
      '<div class="demo-head">' +
      '<h3>示例 Prompt <span>' + (p ? '来自「' + esc(p.title) + '」' : '可直接复制使用') + '</span></h3>' +
      '<div class="demo-tools">' +
      '<button type="button" class="icon-btn" data-copy-text="' + esc(text) + '" title="复制" aria-label="复制示例">' + icon('copy') + '</button>' +
      '<button type="button" class="icon-btn" data-demo-refresh title="换一个" aria-label="换一个示例">' + icon('refresh') + '</button>' +
      '</div></div>' +
      '<div class="demo-body" data-demo-body>' + esc(text) + '</div>' +
      '<div class="demo-foot">' +
      '<button type="button" class="btn btn-primary" data-copy-text="' + esc(text) + '">' + icon('copy') + '复制</button>' +
      '<span class="demo-copied" data-demo-copied>未复制</span>' +
      '</div></div>'
    );
  }

  function renderHome() {
    setMeta('PromptVerse ｜ 把好用的 AI 指令集中管理', 'PromptVerse 收录优质 AI 提示词，支持分类、标签检索与一键复制。');
    var stats = STORE.stats();
    var latest = STORE.query({ perPage: 6 }).items;
    var cats = STORE.categories();
    var counts = STORE.categoryCounts();

    app.innerHTML =
      siteHeader('home') +
      '<main class="container">' +
      '<section class="hero">' +
      '<div class="hero-copy">' +
      '<h1 class="hero-title">PromptVerse</h1>' +
      '<p class="hero-sub">把好用的 AI 指令集中管理，随时检索和复用</p>' +
      '<p class="hero-note">支持分类、标签与一键复制</p>' +
      '<form class="search-form" id="home-search" role="search">' +
      icon('search', 'search-icon') +
      '<input id="home-q" type="search" placeholder="输入关键词查找 Prompt" autocomplete="off" aria-label="搜索 Prompt" />' +
      '<button class="btn btn-primary" type="submit">搜索</button>' +
      '</form>' +
      '<div class="hero-stats">' +
      '<div class="hero-stat"><b>' + stats.published + '</b><span>收录 Prompt</span></div>' +
      '<div class="hero-stat"><b>' + stats.categories + '</b><span>内容分类</span></div>' +
      '<div class="hero-stat"><b>' + stats.tags + '</b><span>可用标签</span></div>' +
      '</div>' +
      '</div>' +
      '<div class="hero-visual">' + demoCard() + '</div>' +
      '</section>' +

      '<section class="section">' +
      '<div class="section-head"><div><h2>最近更新</h2><p>持续整理可直接复用的高质量指令</p></div>' +
      '<a href="#/category">浏览全部 →</a></div>' +
      '<div class="card-grid">' + latest.map(UI.promptCard).join('') + '</div>' +
      '</section>' +

      '<section class="section" style="margin-top:34px">' +
      '<div class="section-head"><div><h2>分类速览</h2><p>点击分类查看该分类下的全部 Prompt</p></div>' +
      '<a href="#/category">全部分类 →</a></div>' +
      '<div class="tag-filters">' +
      cats
        .map(function (c) {
          return '<button type="button" class="tag-btn" data-goto="' + esc(categoryPath({ category: c.id })) + '">' +
            esc(c.name) + ' · ' + (counts[c.id] || 0) + '</button>';
        })
        .join('') +
      '</div>' +
      '</section>' +
      '</main>' +
      siteFooter();

    var form = document.getElementById('home-search');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = document.getElementById('home-q').value.trim();
        go(categoryPath({ q: q }));
      });
    }
  }

  /* ------------------------ 分类 / 搜索 ------------------------ */
  function renderCategoryResults(res, st) {
    if (!res.items.length) {
      return UI.emptyState('没有找到匹配的 Prompt', '换个关键词，或减少标签筛选后再试一次。',
        '<button type="button" class="btn btn-primary btn-sm" data-clear-all>清除筛选条件</button>');
    }
    return (
      '<div class="card-grid">' + res.items.map(UI.promptCard).join('') + '</div>' +
      UI.pagination(res.page, res.pages)
    );
  }

  function categoryQuery() {
    var st = readCategoryQuery();
    var res = STORE.query({ q: st.q, category: st.category, tags: st.tags, page: st.page, perPage: 12 });
    return { st: st, res: res };
  }

  function refreshResults() {
    var pair = categoryQuery();
    var box = document.getElementById('category-results');
    if (box) box.innerHTML = renderCategoryResults(pair.res, pair.st);
    var total = document.getElementById('result-total');
    if (total) total.textContent = pair.res.total;
  }

  function renderCategory() {
    var pair = categoryQuery();
    var st = pair.st;
    var res = pair.res;
    var cats = STORE.categories();
    var counts = STORE.categoryCounts();
    var totalPublished = 0;
    Object.keys(counts).forEach(function (k) {
      totalPublished += counts[k];
    });
    var tags = STORE.tags().slice(0, 16);
    var catName = st.category ? STORE.categoryName(st.category) : '';

    setMeta(
      (catName ? catName + ' 分类' : '全部分类') + ' ｜ PromptVerse',
      '按分类与标签筛选 PromptVerse 中的 AI 提示词' + (catName ? '，当前分类：' + catName : '') + '。'
    );

    var sidebar =
      '<aside class="sidebar">' +
      '<h2>内容分类</h2>' +
      '<button type="button" class="side-item ' + (!st.category ? 'active' : '') + '" data-cat="">' +
      icon('layers') + '<span class="label">全部</span><span class="count">' + totalPublished + '</span></button>' +
      cats
        .map(function (c) {
          return (
            '<button type="button" class="side-item ' + (st.category === c.id ? 'active' : '') + '" data-cat="' + esc(c.id) + '">' +
            icon(c.icon || 'grid') + '<span class="label">' + esc(c.name) + '</span><span class="count">' + (counts[c.id] || 0) + '</span></button>'
          );
        })
        .join('') +
      '</aside>';

    var tagBar = tags.length
      ? '<div class="filter-row"><span class="filter-label">标签</span><div class="tag-filters">' +
        tags
          .map(function (t) {
            var on = st.tags.indexOf(t.name) !== -1;
            return '<button type="button" class="tag-btn ' + (on ? 'active' : '') + '" data-tag="' + esc(t.name) + '">' +
              esc(t.name) + ' · ' + t.count + '</button>';
          })
          .join('') +
        '</div></div>'
      : '';

    var content =
      '<div class="filter-bar">' +
      '<div class="filter-row">' +
      '<label class="search-inline">' + icon('search') +
      '<input id="cat-q" type="search" placeholder="搜索标题、简介、正文或标签" value="' + esc(st.q) + '" autocomplete="off" />' +
      '</label>' +
      (st.tags.length
        ? '<button type="button" class="btn btn-quiet btn-sm" data-clear-tags>清除标签 ' + icon('close') + '</button>'
        : '') +
      '</div>' +
      tagBar +
      '</div>' +
      '<div class="result-bar">' +
      '<p>共 <b id="result-total">' + res.total + '</b> 条结果' +
      (st.tags.length ? '，已选标签：' + esc(st.tags.join(' / ')) : '') + '</p>' +
      (st.q || st.category || st.tags.length ? '<button type="button" class="clear" data-clear-all>清除全部筛选</button>' : '') +
      '</div>' +
      '<div id="category-results">' + renderCategoryResults(res, st) + '</div>';

    app.innerHTML =
      siteHeader('category') +
      '<main class="container">' +
      '<div class="page-head"><h1>' + (catName ? esc(catName) : '探索全部 Prompt') + '</h1>' +
      '<p>' + (catName
        ? '当前分类下共 ' + (counts[st.category] || 0) + ' 条已发布 Prompt'
        : '按分类与标签组合筛选，快速定位可复用的 AI 指令') + '</p></div>' +
      '<div class="catalog-layout">' + sidebar + '<section>' + content + '</section></div>' +
      '</main>' +
      siteFooter();

    var input = document.getElementById('cat-q');
    var timer = null;
    if (input) {
      input.addEventListener('input', function () {
        clearTimeout(timer);
        var value = input.value;
        timer = setTimeout(function () {
          var params = readCategoryQuery();
          params.q = value.trim();
          params.page = 1;
          replaceHash(categoryPath(params));
          refreshResults();
        }, 260);
      });
    }
  }

  /* ------------------------ 详情 ------------------------ */
  function renderDetail(id) {
    var p = STORE.get(id);
    if (!p) {
      renderNotFound('这条 Prompt 不在当前快照中，可能已下架或链接有误。');
      return;
    }
    var cat = STORE.categoryById(p.category_id);
    var catName = cat ? cat.name : '未分类';
    var related = STORE.related(id, 6);
    var tagChips = (p.tags || [])
      .map(function (t) {
        return '<a class="chip cat" style="text-decoration:none" href="' + categoryPath({ category: p.category_id, tags: t }) + '">' + esc(t) + '</a>';
      })
      .join(' ');

    setMeta(p.title + ' ｜ PromptVerse', p.description || ('PromptVerse 收录的 Prompt：' + p.title));

    app.innerHTML =
      siteHeader('') +
      '<main class="container detail-wrap">' +
      '<nav class="breadcrumb">' +
      '<a href="#/">首页</a>' + icon('chevronRight') +
      '<a href="#/category">分类</a>' + icon('chevronRight') +
      '<a href="' + categoryPath({ category: p.category_id }) + '">' + esc(catName) + '</a>' + icon('chevronRight') +
      '<span>' + esc(p.title) + '</span>' +
      '</nav>' +
      '<div class="detail-layout">' +
      '<div class="detail-main">' +
      '<div class="detail-head">' +
      '<h1>' + esc(p.title) + '</h1>' +
      '<div class="detail-meta">' +
      '<a class="chip cat" href="' + categoryPath({ category: p.category_id }) + '" style="text-decoration:none">' +
      icon((cat && cat.icon) || 'grid') + esc(catName) + '</a>' +
      '<span class="chip model">' + icon('clock') + '更新于 ' + UI.formatDate(p.updated_at) + '</span>' +
      '</div>' +
      (p.description ? '<p class="detail-desc">' + esc(p.description) + '</p>' : '') +
      '</div>' +
      '<section class="prompt-block">' +
      '<div class="prompt-block-head">' +
      '<h2>Prompt 正文</h2>' +
      '<button type="button" class="btn btn-primary btn-sm" data-copy-text="' + esc(p.content) + '">' + icon('copy') + '复制</button>' +
      '</div>' +
      '<pre class="prompt-code">' + esc(p.content) + '</pre>' +
      '</section>' +
      (related.length
        ? '<section class="related"><h2>同分类推荐</h2><div class="card-grid">' + related.map(UI.promptCard).join('') + '</div></section>'
        : '') +
      '</div>' +
      '<aside class="detail-aside">' +
      '<div class="aside-card">' +
      '<h3>使用信息</h3>' +
      '<div class="aside-rows">' +
      '<div class="aside-row"><span class="k">分类</span><span class="v">' + esc(catName) + '</span></div>' +
      '<div class="aside-row"><span class="k">标签</span><span class="v aside-tags">' + (tagChips || '<span style="color:var(--muted-2)">暂无</span>') + '</span></div>' +
      '<div class="aside-row"><span class="k">更新时间</span><span class="v">' + UI.formatDate(p.updated_at) + '</span></div>' +
      '</div>' +
      '</div>' +
      '<div class="aside-card">' +
      '<h3>复制小贴士</h3>' +
      '<p class="aside-tip">复制后直接粘贴到任意 AI 对话窗口，替换其中的 {占位内容} 即可使用。本页为只读镜像，内容由管理员整理。</p>' +
      '</div>' +
      '</aside>' +
      '</div>' +
      '</main>' +
      siteFooter();
  }

  /* ------------------------ 404 ------------------------ */
  function renderNotFound(message) {
    setMeta('页面不存在 ｜ PromptVerse', '你访问的页面不存在，返回首页继续浏览 PromptVerse。');
    app.innerHTML =
      siteHeader('') +
      '<main class="container"><div class="notfound"><div class="notfound-inner">' +
      '<div class="notfound-code">404</div>' +
      '<h1>页面不存在</h1>' +
      '<p>' + esc(message || '链接可能已失效，或内容已在最新快照中移除。') + '</p>' +
      '<div class="notfound-actions">' +
      '<a class="btn btn-primary" href="#/">返回首页</a>' +
      '<a class="btn btn-ghost" href="#/category">浏览分类</a>' +
      '</div></div></div></main>' +
      siteFooter();
  }

  /* ------------------------ 路由与全局交互 ------------------------ */
  function render() {
    current = parseHash();
    var path = current.path;
    var m;
    if (path === '/' || path === '') {
      renderHome();
    } else if (path === '/category') {
      renderCategory();
    } else if ((m = /^\/prompt\/(.+)$/.exec(path))) {
      renderDetail(decodeURIComponent(m[1]));
    } else {
      renderNotFound();
    }
    global.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var t = e.target;

    var copyBtn = t.closest && t.closest('[data-copy-text]');
    if (copyBtn) {
      e.preventDefault();
      UI.copyText(copyBtn.getAttribute('data-copy-text')).then(function () {
        UI.toast('已复制到剪贴板');
        if (copyBtn.classList.contains('btn') || copyBtn.classList.contains('copy-link')) {
          var original = copyBtn.innerHTML;
          copyBtn.classList.add('is-copied');
          copyBtn.innerHTML = icon('check') + '<span>已复制</span>';
          setTimeout(function () {
            copyBtn.classList.remove('is-copied');
            copyBtn.innerHTML = original;
          }, 1800);
        }
        var badge = document.querySelector('[data-demo-copied]');
        if (badge && copyBtn.closest('.demo-card')) {
          badge.textContent = '已复制';
          badge.classList.add('is-on');
          setTimeout(function () {
            badge.textContent = '未复制';
            badge.classList.remove('is-on');
          }, 1800);
        }
      }).catch(function () {
        UI.toast('复制失败，请手动选择文本', 'error');
      });
      return;
    }

    var refresh = t.closest && t.closest('[data-demo-refresh]');
    if (refresh) {
      var p = pickDemo();
      if (!p) return;
      var body = document.querySelector('[data-demo-body]');
      if (body) {
        body.textContent = p.content;
        body.scrollTop = 0;
      }
      var card = document.querySelector('.demo-card');
      if (card) {
        Array.prototype.forEach.call(card.querySelectorAll('[data-copy-text]'), function (el) {
          el.setAttribute('data-copy-text', p.content);
        });
        var source = card.querySelector('.demo-head h3 span');
        if (source) source.textContent = '来自「' + p.title + '」';
      }
      return;
    }

    var goto = t.closest && t.closest('[data-goto]');
    if (goto) {
      go(goto.getAttribute('data-goto'));
      return;
    }

    var side = t.closest && t.closest('[data-cat]');
    if (side) {
      var params = readCategoryQuery();
      params.category = side.getAttribute('data-cat');
      params.page = 1;
      go(categoryPath(params));
      return;
    }

    var tagBtn = t.closest && t.closest('[data-tag]');
    if (tagBtn) {
      var tag = tagBtn.getAttribute('data-tag');
      var st = readCategoryQuery();
      var idx = st.tags.indexOf(tag);
      if (idx >= 0) st.tags.splice(idx, 1);
      else st.tags.push(tag);
      go(categoryPath({ q: st.q, category: st.category, tags: st.tags, page: 1 }));
      return;
    }

    var clearTags = t.closest && t.closest('[data-clear-tags]');
    if (clearTags) {
      var s1 = readCategoryQuery();
      go(categoryPath({ q: s1.q, category: s1.category, page: 1 }));
      return;
    }

    var clearAll = t.closest && t.closest('[data-clear-all]');
    if (clearAll) {
      go('/category');
      return;
    }

    var pageBtn = t.closest && t.closest('.page-btn[data-page]');
    if (pageBtn && !pageBtn.disabled) {
      var s2 = readCategoryQuery();
      s2.page = parseInt(pageBtn.getAttribute('data-page'), 10) || 1;
      go(categoryPath(s2));
    }
  });

  global.addEventListener('hashchange', render);
  render();
})(window);
