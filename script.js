const countriesContainer = document.querySelector(".countries-container");
const filterByRegion = document.querySelector(".filter-by-region");
const searchInput = document.querySelector(".search-container input");
const themeChanger = document.querySelector(".theme-changer");
const paginationContainer = document.querySelector(".pagination");

let allCountriesData = [];
let filteredCountries = [];
let currentPage = 1;
const countriesPerPage = 12;

fetch("https://restcountries.com/v3.1/all")
  .then((res) => res.json())
  .then((data) => {
    allCountriesData = data;
    filteredCountries = data;
    renderCountries();
    setupPagination();
  });

filterByRegion.addEventListener("change", () => {
  fetch(`https://restcountries.com/v3.1/region/${filterByRegion.value}`)
    .then((res) => res.json())
    .then((data) => {
      filteredCountries = data;
      currentPage = 1;
      renderCountries();
      setupPagination();
    });
});

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(value)
  );
  currentPage = 1;
  renderCountries();
  setupPagination();
});

themeChanger.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function renderCountries() {
  countriesContainer.innerHTML = "";
  const start = (currentPage - 1) * countriesPerPage;
  const end = start + countriesPerPage;
  const countriesToShow = filteredCountries.slice(start, end);

  countriesToShow.forEach((country) => {
    const card = document.createElement("a");
    card.classList.add("country-card");
    card.href = `/country.html?name=${country.name.common}`;
    card.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <div class="card-text">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population: </b>${country.population.toLocaleString("en-IN")}</p>
        <p><b>Region: </b>${country.region}</p>
        <p><b>Capital: </b>${country.capital?.[0]}</p>
      </div>
    `;
    countriesContainer.appendChild(card);
  });
}

function setupPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  if (totalPages <= 1) return;

  const createBtn = (
    label,
    page = null,
    disabled = false,
    isActive = false
  ) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    if (isActive) btn.classList.add("active");
    if (disabled) btn.disabled = true;
    if (page) {
      btn.addEventListener("click", () => {
        currentPage = page;
        renderCountries();
        setupPagination();
      });
    }
    paginationContainer.appendChild(btn);
  };

  // Prev Button
  createBtn(
    "« Prev",
    currentPage > 1 ? currentPage - 1 : null,
    currentPage === 1
  );

  // Calculate visible page range
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    startPage = 1;
    endPage = Math.min(totalPages, 5);
  } else if (currentPage >= totalPages - 2) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - 4);
  }

  if (startPage > 1) {
    createBtn("1", 1);
    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      paginationContainer.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    createBtn(i, i, false, i === currentPage);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      paginationContainer.appendChild(dots);
    }
    createBtn(totalPages, totalPages);
  }

  // Next Button
  createBtn(
    "Next »",
    currentPage < totalPages ? currentPage + 1 : null,
    currentPage === totalPages
  );
}
