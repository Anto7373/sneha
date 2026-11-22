// Uses the visitor's local calendar date and time.
const birthday = new Date(2026, 10, 28, 0, 0, 0);

const elements = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

const revealButton = document.querySelector("#revealButton");
const unlockMessage = document.querySelector("#unlockMessage");
const letter = document.querySelector("#letter");
const memories = document.querySelector("#memories");

function isBirthdayToday() {
  const now = new Date();

  return (
    now.getFullYear() === birthday.getFullYear() &&
    now.getMonth() === birthday.getMonth() &&
    now.getDate() === birthday.getDate()
  );
}

function updateCountdown() {
  const now = new Date();
  const difference = Math.max(0, birthday.getTime() - now.getTime());
  const totalSeconds = Math.floor(difference / 1000);

  elements.days.textContent = String(
    Math.floor(totalSeconds / 86400)
  ).padStart(3, "0");

  elements.hours.textContent = String(
    Math.floor((totalSeconds % 86400) / 3600)
  ).padStart(2, "0");

  elements.minutes.textContent = String(
    Math.floor((totalSeconds % 3600) / 60)
  ).padStart(2, "0");

  elements.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");

  updateLetterAccess();
}

function updateLetterAccess() {
  const isOpenDay = isBirthdayToday();

  revealButton.disabled = !isOpenDay;

  if (isOpenDay) {
    unlockMessage.textContent = "It's your day, Sneha — your letter is ready ♡";
    if (letter.hidden) {
      revealButton.textContent = "Open Your Birthday Letter";
    }
  } else if (new Date() < birthday) {
    unlockMessage.textContent = "This letter unlocks on November 28, 2026 ♡";
    revealButton.textContent = "Your Birthday Letter Is Waiting";
    letter.hidden = true;
    memories.hidden = true;
    letter.classList.remove("visible");
    letter.setAttribute("aria-hidden", "true");
  } else {
    unlockMessage.textContent = "The birthday letter has closed for now ♡";
    revealButton.textContent = "Your Birthday Letter Is Waiting";
    letter.hidden = true;
    memories.hidden = true;
    letter.classList.remove("visible");
    letter.setAttribute("aria-hidden", "true");
  }
}

function sendHearts() {
  const symbols = ["♡", "♥", "✧"];

  for (let index = 0; index < 18; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = symbols[index % symbols.length];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${14 + Math.random() * 20}px`;
    heart.style.animationDelay = `${Math.random() * 700}ms`;

    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

function revealMemoriesOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

revealButton.addEventListener("click", () => {
  // Check again when clicked, so the letter can't be opened outside the date.
  if (!isBirthdayToday()) {
    updateLetterAccess();
    return;
  }

  letter.hidden = false;
  memories.hidden = false;
  letter.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    letter.classList.add("visible");
    revealMemoriesOnScroll();
    letter.scrollIntoView({ behavior: "smooth", block: "center" });
    sendHearts();
  });

  revealButton.textContent = "A Letter From The Heart ♡";

  // Reveal memories section after the letter opens
  memories.classList.add("visible");
  revealMemoriesOnScroll();
});

updateCountdown();
setInterval(updateCountdown, 1000);