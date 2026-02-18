// Mirror loan amount and term from left panel to right panel in real-time
document.getElementById("loanAmount").addEventListener("input", function () {
  document.getElementById("zenoLoanDisplay").value = this.value ? `R ${parseFloat(this.value).toLocaleString("en-ZA")}` : "";
});

document.getElementById("loanTerm").addEventListener("input", function () {
  document.getElementById("zenoTermDisplay").value = this.value ? `${this.value} months` : "";
});

// Format currency
function fmt(val) {
  return "R " + val.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

document.getElementById("compareBtn").addEventListener("click", function () {
  const currentRate = parseFloat(document.getElementById("currentRate").value);
  const zenoRate = parseFloat(document.getElementById("zenoRate").value);
  const loanAmount = parseFloat(document.getElementById("loanAmount").value);
  const loanTerm = parseFloat(document.getElementById("loanTerm").value);

  if (isNaN(currentRate) || isNaN(zenoRate) || isNaN(loanAmount) || isNaN(loanTerm)) {
    alert("Please fill in all fields before comparing.");
    return;
  }

  // Calculations
  const currentMonthly = (loanAmount / 1000) * currentRate;
  const currentTotal = currentMonthly * loanTerm;
  const zenoMonthly = (loanAmount / 1000) * zenoRate;
  const zenoTotal = zenoMonthly * loanTerm;
  const saveMonthly = currentMonthly - zenoMonthly;
  const saveTotal = currentTotal - zenoTotal;

  const phase1 = document.getElementById("phase1");
  const phase2 = document.getElementById("phase2");
  const results = document.getElementById("results");

  // Hide results
  phase1.classList.add("hidden");
  phase2.classList.add("hidden");
  results.classList.add("hidden");
  results.classList.remove("show");

  // ── PHASE 1: Loading bar ──────────────────────────────────
  const oldBar = document.getElementById("loadingBar");
  const newBar = oldBar.cloneNode(true);
  oldBar.parentNode.replaceChild(newBar, oldBar);
  phase1.classList.remove("hidden");

  // ── PHASE 2: Spinner ─────────────────────────────────────
  setTimeout(() => {
    phase1.classList.add("hidden");

    const arc = document.getElementById("spinnerArc");
    const check = document.getElementById("spinnerCheck");
    arc.parentNode.replaceChild(arc.cloneNode(true), arc);
    check.parentNode.replaceChild(check.cloneNode(true), check);

    phase2.classList.remove("hidden");
  }, 1300);

  // ── PHASE 3: Results reveal ───────────────────────────────
  setTimeout(() => {
    phase2.classList.add("hidden");

    // Populate result cards
    document.getElementById("currentMonthly").textContent = fmt(currentMonthly) + " /month";
    document.getElementById("zenoMonthly").textContent = fmt(zenoMonthly) + " /month";

    // Savings banner
    document.getElementById("savingsMonthly").textContent = fmt(Math.abs(saveMonthly));
    document.getElementById("savingsTotal").textContent = fmt(Math.abs(saveTotal));

    const banner = document.getElementById("savingsBanner");
    const savingsTitle = banner.querySelector(".savings-title");
    const savingsAmounts = banner.querySelector(".savings-amounts");

    if (saveMonthly > 0) {
      savingsTitle.textContent = "You could save with Zenowethu";
      banner.style.background = "linear-gradient(135deg, #1d4777 0%, #2a6099 100%)";
      savingsAmounts.style.display = "";
    } else if (saveMonthly < 0) {
      savingsTitle.textContent = "✔ You're already on a great rate!";
      banner.style.background = "linear-gradient(135deg, #2e7d32 0%, #43a047 100%)";
      savingsAmounts.style.display = "none";
    } else {
      savingsTitle.textContent = "Your rate matches Zenowethu's";
      banner.style.background = "linear-gradient(135deg, #1d4777 0%, #2a6099 100%)";
      savingsAmounts.style.display = "none";
    }

    results.classList.remove("hidden");
    void results.offsetWidth;
    results.classList.add("show");
  }, 2800);
});
