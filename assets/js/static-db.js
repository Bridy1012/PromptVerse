/* ============================================================
   PromptVerse 静态只读版 · 数据层
   数据来自构建时内嵌的 window.PV_DATA（data/prompts.js）
   ============================================================ */
(function (global) {
  'use strict';

  var raw = global.PV_DATA || { categories: [], prompts: [] };

  var categories = (raw.categories || []).slice().sort(function (a, b) {
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  var prompts = (raw.prompts || []).slice().sort(function (a, b) {
    return String(b.updated_at || '').localeCompare(String(a.updated_at || ''));
  });

  var byId = {};
  var counts = {};
  prompts.forEach(function (p) {
    byId[p.id] = p;
    counts[p.category_id] = (counts[p.category_id] || 0) + 1;
  });

  var catMap = {};
  categories.forEach(function (c) {
    catMap[c.id] = c;
  });

  function categoryById(id) {
    return catMap[id] || null;
  }

  function categoryName(id) {
    var c = catMap[id];
    return c ? c.name : '未分类';
  }

  function haystack(p) {
    return [p.title, p.description, p.content, (p.tags || []).join(' ')]
      .join('\n')
      .toLowerCase();
  }

  function query(opts) {
    opts = opts || {};
    var q = String(opts.q || '').trim().toLowerCase();
    var category = opts.category || '';
    var tags = opts.tags || [];
    var page = Math.max(1, parseInt(opts.page, 10) || 1);
    var perPage = Math.max(1, parseInt(opts.perPage, 10) || 12);

    var items = prompts.filter(function (p) {
      if (category && p.category_id !== category) return false;
      if (tags.length) {
        for (var i = 0; i < tags.length; i++) {
          if ((p.tags || []).indexOf(tags[i]) === -1) return false;
        }
      }
      if (q && haystack(p).indexOf(q) === -1) return false;
      return true;
    });

    var total = items.length;
    var pages = Math.max(1, Math.ceil(total / perPage));
    if (page > pages) page = pages;
    var start = (page - 1) * perPage;
    return { items: items.slice(start, start + perPage), total: total, page: page, pages: pages };
  }

  function tagList() {
    var map = {};
    prompts.forEach(function (p) {
      (p.tags || []).forEach(function (t) {
        map[t] = (map[t] || 0) + 1;
      });
    });
    return Object.keys(map)
      .map(function (name) {
        return { name: name, count: map[name] };
      })
      .sort(function (a, b) {
        return b.count - a.count || a.name.localeCompare(b.name);
      });
  }

  var tags = tagList();

  function stats() {
    return { published: prompts.length, categories: categories.length, tags: tags.length };
  }

  function get(id) {
    return byId[id] || null;
  }

  function related(id, limit) {
    var p = byId[id];
    if (!p) return [];
    return prompts
      .filter(function (x) {
        return x.id !== id && x.category_id === p.category_id;
      })
      .slice(0, limit || 6);
  }

  /* ui.js 的卡片组件需要分类信息，这里提供同名接口 */
  global.DB = { categoryById: categoryById };

  global.PV = global.PV || {};
  global.PV.STORE = {
    categoryById: categoryById,
    categoryName: categoryName,
    categories: function () {
      return categories;
    },
    categoryCounts: function () {
      return counts;
    },
    query: query,
    get: get,
    related: related,
    tags: function () {
      return tags;
    },
    stats: stats
  };
})(window);
