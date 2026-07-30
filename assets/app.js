const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");

// Add a Formspree endpoint here after creating the form in the Formspree dashboard.
// Example: https://formspree.io/f/your-form-id
const FORMSPREE_ENDPOINT = "";

const setMenu = (open) => {
  if (!header || !menuToggle) return;
  header.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
};

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});

const observer = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll("[data-reveal]").forEach((item) => {
  if (observer) observer.observe(item);
  else item.classList.add("is-visible");
});

const showStatus = (message, isError = false) => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.toggle("is-error", isError);
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));

  if (!form.checkValidity()) {
    form.querySelectorAll(":invalid").forEach((field) => field.setAttribute("aria-invalid", "true"));
    showStatus("Please complete the required fields before sending.", true);
    form.querySelector(":invalid")?.focus();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const data = new FormData(form);

  if (FORMSPREE_ENDPOINT) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      showStatus("Thank you. Your casting brief has been sent—we’ll be in touch.");
    } catch {
      showStatus("We couldn’t send the form. Please email info@afrodizzycasts.co.za.", true);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send casting brief <span aria-hidden="true">↗</span>';
    }
    return;
  }

  const subject = encodeURIComponent(`Casting brief: ${data.get("company") || data.get("name")}`);
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\n` +
    `Company / production: ${data.get("company") || "Not supplied"}\n` +
    `Email: ${data.get("email")}\n` +
    `Talent needed: ${data.get("talent_type")}\n\n` +
    `Project details:\n${data.get("message")}`
  );
  showStatus("Your email app is opening with the completed brief. Please send the prepared message.");
  window.location.href = `mailto:info@afrodizzycasts.co.za?subject=${subject}&body=${body}`;
});
