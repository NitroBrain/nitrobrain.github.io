window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease-out forwards";
    }
  });
}, observerOptions);

document.querySelectorAll(".card").forEach((card) => {
  observer.observe(card);
});

async function loadFeaturedProjects() {
  const grid = document.getElementById("featured-projects");
  if (!grid) return;

  try {
    const res = await fetch(
      "https://api.github.com/orgs/webbro-software/repos?per_page=100&type=public&sort=updated"
    );
    let repos = await res.json();

    const blacklist = [
      ".github",
      "infra",
      "infrastructure",
      "docs",
      "website",
      "webbro-software.github.io",
    ];
    repos = repos.filter(
      (repo) =>
        !repo.private &&
        !repo.archived &&
        !blacklist.includes(repo.name.toLowerCase()) &&
        !repo.name.startsWith(".")
    );

    if (repos.length === 0) {
      grid.innerHTML = "<p>No public projects to show.</p>";
      return;
    }

    function getProjectEmoji(repo) {
      const name = repo.name.toLowerCase();
      const desc = (repo.description || "").toLowerCase();

      if (name.includes("vim") || name.includes("editor")) return "📝";
      if (name.includes("game") || name.includes("fun")) return "🎮";
      if (name.includes("style") || name.includes("css")) return "🎨";
      if (name.includes("console") || name.includes("logger")) return "🖥️";
      if (
        name.includes("calc") ||
        name.includes("math") ||
        name.includes("gcd")
      )
        return "➗";
      if (name.includes("voice") || name.includes("speech")) return "🎤";
      if (name.includes("translate") || name.includes("lang")) return "🌐";
      if (name.includes("infra") || name.includes("deploy")) return "🛠️";
      if (name.includes("art") || name.includes("sketch")) return "✏️";
      if (name.includes("python")) return "🐍";
      if (name.includes("js") || name.includes("javascript")) return "📜";
      if (name.includes("vscode") || name.includes("extension")) return "🧩";
      if (desc.includes("utility") || desc.includes("tool")) return "🧰";
      return "🌟";
    }

    grid.innerHTML = repos
      .map(
        (repo) => `
      <div class="card">
      <div class="info">
        <h3>${repo.name}</h3>
        <p class="card-description">${repo.description || "No description"}</p>
      </div>
        <a href="${
          repo.html_url
        }" target="_blank" rel="noopener noreferrer" class="card-link">
          <span class="icon-github"></span>
          <span>View Project</span>
          <span class="icon-external"></span>
        </a>
      </div>
    `
      )
      .join("");
  } catch (e) {
    grid.innerHTML = "<p>Failed to load projects from GitHub.</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadFeaturedProjects);
