const root = document.body.dataset.root || ".";
const themeKey = "yanbin-site-theme";

try {
  if (localStorage.getItem(themeKey) === "dark") document.documentElement.dataset.theme = "dark";
} catch (_) { /* Local file previews may not allow storage. */ }

function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === "dark";
  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    button.title = dark ? "Switch to light mode" : "Switch to dark mode";
  });
}

document.querySelectorAll(".theme-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem(themeKey, dark ? "light" : "dark"); } catch (_) {}
    updateThemeLabel();
  });
});
updateThemeLabel();

document.querySelectorAll(".year").forEach((year) => { year.textContent = new Date().getFullYear(); });

function followProjectBookmark() {
  const project = document.querySelector(".project-card:target .project-more");
  if (project) location.replace(project.href);
}
followProjectBookmark();
window.addEventListener("hashchange", followProjectBookmark);

const pages = [
  { title: "about", description: "Biography and research interests", path: "/index.html" },
  { title: "projects", description: "Selected robotics projects", path: "/projects/index.html" },
  { title: "competition", description: "VEX U World Championship and robot control", path: "/competition/index.html" },
  { title: "CV", description: "Curriculum vitae PDF", path: "/cv/index.html" },
  { title: "Safe reinforcement learning", description: "Autonomous racing and safety filtering", path: "/projects/safe-rl.html" },
  { title: "SafePi · Collision-aware pick and place", description: "Frozen π0.5, RGB-D grasp planning, and safety filtering in simulation", path: "/projects/safepi.html" },
  { title: "Humanoid motion imitation", description: "Unitree G1 motion learning", path: "/projects/humanoid.html" },
  { title: "Robotic grasping", description: "Language-guided grasp planning", path: "/projects/grasping.html" },
  { title: "Autonomous sweeping robot", description: "STM32 and RDK X5 mobile robotics", path: "/projects/sweeper.html" },
  { title: "Self-balancing robot", description: "FOC and cascaded control", path: "/projects/balancing.html" },
  { title: "Mobile manipulation", description: "Robot-arm kinematics and mobile control", path: "/projects/mobile-manipulation.html" },
  { title: "VEX U robotics", description: "Competition robot, autonomous routes, and color sorting", path: "/competition/index.html" },
];

const dialog = document.createElement("dialog");
dialog.className = "search-dialog";
dialog.setAttribute("aria-label", "Search site");
dialog.innerHTML = '<input class="search-box" type="search" placeholder="Search pages and projects" aria-label="Search pages and projects"><div class="search-results"></div>';
document.body.append(dialog);

const input = dialog.querySelector(".search-box");
const results = dialog.querySelector(".search-results");
function renderSearch() {
  const query = input.value.trim().toLowerCase();
  const matches = pages.filter((page) => `${page.title} ${page.description}`.toLowerCase().includes(query));
  results.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "No matches.";
    results.append(empty);
    return;
  }
  for (const page of matches) {
    const link = document.createElement("a");
    link.href = `${root}${page.path}`;
    link.textContent = page.title;
    const detail = document.createElement("small");
    detail.textContent = page.description;
    link.append(detail);
    results.append(link);
  }
}

function openSearch() {
  input.value = "";
  renderSearch();
  dialog.showModal();
  input.focus();
}

document.querySelectorAll(".search-trigger").forEach((button) => button.addEventListener("click", openSearch));
input.addEventListener("input", renderSearch);
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (!dialog.open) openSearch();
  }
});
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
