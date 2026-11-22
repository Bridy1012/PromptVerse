/* ============================================================
   PromptVerse · 通用 UI 组件（无框架、可直接 DOM 使用）
   ============================================================ */
(function (global) {
  'use strict';
  var PV = (global.PV = global.PV || {});

  /* ------------------------ 图标 ------------------------ */
  var ICONS = {
    logo: '<path d="M12 2.7l8.2 4.7v9.2L12 21.3l-8.2-4.7V7.4L12 2.7z"/><path d="M12 2.7v6.8M12 9.5l8.2 4.7M12 9.5L3.8 14.2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2.6"/><path d="M5.5 15H4.6A1.6 1.6 0 013 13.4V4.6A1.6 1.6 0 014.6 3h8.8A1.6 1.6 0 0115 4.6v.9"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    refresh: '<path d="M20.5 12a8.5 8.5 0 11-2.9-6.4"/><path d="M20.5 3.5V9h-5.5"/>',
    more: '<circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>',
    pen: '<path d="M12 20h9"/><path d="M16.6 3.4a2.1 2.1 0 013 3L7.1 18.9 3 20l1.1-4.1L16.6 3.4z"/>',
    code: '<path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.6"/><path d="M8.5 7V5.4A1.4 1.4 0 019.9 4h4.2a1.4 1.4 0 011.4 1.4V7"/><path d="M3 12h18"/>',
    book: '<path d="M4 5.4A2.4 2.4 0 016.4 3H20v15.2H6.4A2.4 2.4 0 004 20.6V5.4z"/><path d="M4 18.2a2.4 2.4 0 012.4-2.4H20"/>',
    palette: '<path d="M12 21a9 9 0 110-18c4.6 0 8.2 3 8.2 6.6 0 2.5-1.9 4.4-4.4 4.4h-1.5a1.9 1.9 0 00-1.3 3.3A1.8 1.8 0 0112 21z"/><circle cx="7.6" cy="10.4" r="1"/><circle cx="10.2" cy="7.2" r="1"/><circle cx="14.6" cy="7.7" r="1"/>',
    megaphone: '<path d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1z"/><path d="M14 8.6a5 5 0 010 6.8"/><path d="M17 5.6a9 9 0 010 12.8"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>',
    arrowRight: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
    chevronRight: '<path d="M9 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    upload: '<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"/>',
    download: '<path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/>',
    logout: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    trash: '<path d="M4 7h16"/><path d="M9.5 7V5.4A1.4 1.4 0 0110.9 4h2.2a1.4 1.4 0 011.4 1.4V7"/><path d="M6 7l.9 13a1 1 0 001 1h8.2a1 1 0 001-1L18 7"/>',
    edit: '<path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    close: '<path d="M18 6L6 18M6 6l12 12"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2.6"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16.4" r="0.7" fill="currentColor" stroke="none"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r="0.7" fill="currentColor" stroke="none"/>',
    sparkles: '<path d="M11 3l1.5 4.1L16.6 8.6l-4.1 1.5L11 14.2 9.5 10.1 5.4 8.6l4.1-1.5L11 3z"/><path d="M18 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/>',
    eye: '<path d="M2.2 12S5.8 5.6 12 5.6 21.8 12 21.8 12 18.2 18.4 12 18.4 2.2 12 2.2 12z"/><circle cx="12" cy="12" r="2.6"/>',
    file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"/><path d="M14 3v5h5"/>',
    folder: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>',
    message: '<path d="M21 12a8 8 0 01-8 8H8l-4 3v-5.4A8 8 0 0113 4a8 8 0 018 8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    shield: '<path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6l7-3z"/>',
    tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L3 13V3h10l7.6 7.6a2 2 0 010 2.8z"/><circle cx="7.6" cy="7.6" r="1.4"/>'
  };

  function icon(name, className) {
    var body = ICONS[name] || ICONS.file;
    return (
      '<svg' +
      (className ? ' class="' + className + '"' : '') +
      ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      body +
      '</svg>'
    );
  }

  /* ------------------------ 文本转义（防 XSS） ------------------------ */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso, withTime) {
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    function p(n) {
      return n < 10 ? '0' + n : String(n);
    }
    var date = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    return withTime ? date + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) : date;
  }

  /* ------------------------ Toast ------------------------ */
  function toast(message, type) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'success');
    el.innerHTML = icon(type === 'error' ? 'alert' : type === 'info' ? 'info' : 'check') + '<span>' + esc(message) + '</span>';
    root.appendChild(el);
    setTimeout(function () {
      el.classList.add('leaving');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 220);
    }, 2400);
  }

  /* ------------------------ 二次确认框 ------------------------ */
  function confirmDialog(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var root = document.getElementById('modal-root');
      var mask = document.createElement('div');
      mask.className = 'modal-mask';
      mask.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true">' +
        '<h3>' + esc(opts.title || '确认操作') + '</h3>' +
        '<p>' + esc(opts.message || '') + '</p>' +
        '<div class="modal-actions">' +
        '<button class="btn btn-ghost" data-modal="cancel">' + esc(opts.cancelText || '取消') + '</button>' +
        '<button class="btn ' + (opts.danger ? 'btn-danger-solid' : 'btn-primary') + '" data-modal="ok">' + esc(opts.okText || '确认') + '</button>' +
        '</div></div>';
      root.appendChild(mask);

      function close(result) {
        if (mask.parentNode) mask.parentNode.removeChild(mask);
        document.removeEventListener('keydown', onKey);
        resolve(result);
      }
      function onKey(e) {
        if (e.key === 'Escape') close(false);
      }
      mask.addEventListener('click', function (e) {
        if (e.target === mask) close(false);
        var action = e.target.getAttribute && e.target.getAttribute('data-modal');
        if (action === 'cancel') close(false);
        if (action === 'ok') close(true);
      });
      document.addEventListener('keydown', onKey);
      var okBtn = mask.querySelector('[data-modal="ok"]');
      if (okBtn) okBtn.focus();
    });
  }

  /* ------------------------ 复制 ------------------------ */
  function copyText(text) {
    return new Promise(function (resolve, reject) {
      if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(resolve, function () {
          fallbackCopy(text) ? resolve() : reject(new Error('copy failed'));
        });
        return;
      }
      fallbackCopy(text) ? resolve() : reject(new Error('copy failed'));
    });
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', 'readonly');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------ Prompt 卡片 ------------------------ */
  var TONES = ['', 'tone-2', 'tone-3', 'tone-4', 'tone-5', 'tone-6'];

  /* 服务端模式下分类以 /api/categories 为准；本地模式由 STORE 回退到本地库 */
  function findCategory(categoryId) {
    var cat = null;
    if (window.PV && PV.STORE && typeof PV.STORE.categoryById === 'function') {
      cat = PV.STORE.categoryById(categoryId);
    }
    return cat || DB.categoryById(categoryId);
  }

  function categoryTone(categoryId) {
    var cat = findCategory(categoryId);
    var idx = cat && cat.sort_order ? cat.sort_order - 1 : 0;
    return TONES[((idx % TONES.length) + TONES.length) % TONES.length];
  }

  function promptCard(p) {
    var cat = findCategory(p.category_id);
    var iconName = (cat && cat.icon) || 'file';
    var catName = cat ? cat.name : '未分类';

    return (
      '<article class="p-card">' +
        '<div class="p-card-top">' +
          '<h3><a href="#/prompt/' + encodeURIComponent(p.id) + '">' + esc(p.title) + '</a></h3>' +
          '<span class="p-icon ' + categoryTone(p.category_id) + '">' + icon(iconName) + '</span>' +
        '</div>' +
        '<div class="p-meta">' +
          '<a class="chip cat" href="#/category?category=' + encodeURIComponent(p.category_id) + '" style="text-decoration:none">' + icon(iconName) + esc(catName) + '</a>' +
        '</div>' +
        '<p class="p-desc">' + esc(p.description || '暂无简介') + '</p>' +
        '<div class="p-card-foot">' +
          '<a class="link-more" href="#/prompt/' + encodeURIComponent(p.id) + '">查看详情</a>' +
          '<button type="button" class="copy-link" data-copy-text="' + esc(p.content) + '" data-copy-style="link">' +
            icon('copy') + '<span>复制</span>' +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

  /* ------------------------ 分页 ------------------------ */
  function pagination(page, pages, hrefForPage) {
    if (pages <= 1) return '';
    var html = '<nav class="pagination" aria-label="分页">';
    html +=
      '<button class="page-btn" data-page="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + ' aria-label="上一页">' +
      icon('chevronLeft') + '</button>';

    var list = [];
    for (var i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) list.push(i);
      else if (list[list.length - 1] !== '…') list.push('…');
    }
    list.forEach(function (item) {
      if (item === '…') {
        html += '<span class="page-ellipsis">…</span>';
      } else {
        html +=
          '<button class="page-btn' + (item === page ? ' active' : '') + '" data-page="' + item + '"' +
          (item === page ? ' aria-current="page"' : '') + '>' + item + '</button>';
      }
    });

    html +=
      '<button class="page-btn" data-page="' + (page + 1) + '"' + (page >= pages ? ' disabled' : '') + ' aria-label="下一页">' +
      icon('chevronRight') + '</button>';
    html += '</nav>';
    return html;
  }

  /* ------------------------ 空状态 ------------------------ */
  function emptyState(title, desc, actionHtml) {
    return (
      '<div class="empty-state">' +
      '<div class="empty-icon">' + icon('search') + '</div>' +
      '<h3>' + esc(title) + '</h3>' +
      '<p>' + esc(desc) + '</p>' +
      (actionHtml || '') +
      '</div>'
    );
  }

  PV.UI = {
    icon: icon,
    esc: esc,
    toast: toast,
    confirm: confirmDialog,
    copyText: copyText,
    promptCard: promptCard,
    pagination: pagination,
    emptyState: emptyState,
    formatDate: formatDate,
    categoryTone: categoryTone
  };
})(window);
