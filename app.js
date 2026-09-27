(function () {
  "use strict";

  const grid = document.querySelector("#apps-grid");
  const search = document.querySelector("#app-search");
  const emptyState = document.querySelector("#empty-state");
  const appCount = document.querySelector("#app-count");
  const message = document.querySelector("#card-message");
  const apps = Array.isArray(window.portalApps) ? window.portalApps : [];

  const icons = {
    dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><path d="M14 17.5h7M17.5 14v7"></path></svg>',
    academic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-5 9 5-9 5-9-5Z"></path><path d="M7 11.2V16c2.6 2.4 7.4 2.4 10 0v-4.8M21 9v6"></path></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><circle cx="12" cy="12" r="4.5"></circle><circle cx="12" cy="12" r="1"></circle></svg>',
    users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"></circle><path d="M3.5 19c.6-3 2.4-4.5 5.5-4.5s4.9 1.5 5.5 4.5"></path><path d="M16 5.5a3 3 0 0 1 0 5.8M16.5 14.7c2.1.4 3.4 1.8 4 4.3"></path></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"></rect><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M8 13h3M8 16h3M14 13h2"></path></svg>',
    sparkles: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.3 4.7L18 9l-4.7 1.3L12 15l-1.3-4.7L6 9l4.7-1.3L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15ZM5 14l.6 1.9L7.5 16.5l-1.9.6L5 19l-.6-1.9-1.9-.6 1.9-.6L5 14Z"></path></svg>'
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  }

  function cardTemplate(app, index) {
    const soon = app.status !== "active";
    const title = escapeHtml(app.name);
    const description = escapeHtml(app.description);
    const category = escapeHtml(app.category);
    const icon = icons[app.icon] || icons.dashboard;
    const action = soon
      ? '<button class="coming-link" type="button" data-coming-soon="true">In development</button>'
      : `<a class="launch-link" href="${escapeHtml(app.url)}" target="_blank" rel="noopener noreferrer">Open app <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"></path></svg></a>`;
    return `<article class="app-card${soon ? " is-coming-soon" : ""}" style="animation-delay:${Math.min(index * 55, 300)}ms">
      <div class="card-head">
        <span class="app-icon accent-${escapeHtml(app.accent || "orange")}">${icon}</span>
        <span class="status-badge ${soon ? "status-coming-soon" : "status-active"}">${soon ? "COMING SOON" : "ACTIVE"}</span>
      </div>
      <div class="app-content"><h3>${title}</h3><p>${description}</p></div>
      <div class="card-foot"><span class="category-label">${category}</span>${action}</div>
    </article>`;
  }

  function render(filter = "") {
    const query = filter.trim().toLowerCase();
    const visible = apps.filter((app) => !query || [app.name, app.description, app.category].some((field) => String(field).toLowerCase().includes(query)));
    grid.innerHTML = visible.map(cardTemplate).join("");
    emptyState.hidden = visible.length !== 0;
    appCount.textContent = String(visible.length).padStart(2, "0");
  }

  search.addEventListener("input", (event) => render(event.target.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== search && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      render();
      search.blur();
    }
  });
  grid.addEventListener("click", (event) => {
    if (!event.target.closest("[data-coming-soon]")) return;
    message.textContent = "Dashboard ini sedang dalam pengembangan.";
    message.classList.add("is-visible");
    window.clearTimeout(window.portalMessageTimeout);
    window.portalMessageTimeout = window.setTimeout(() => message.classList.remove("is-visible"), 3300);
  });

  render();
})();
