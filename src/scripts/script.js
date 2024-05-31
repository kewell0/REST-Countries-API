const countriesEl = document.getElementById("countries"),
  toggleBtn = document.getElementById("toggle"),
  filterBtn = document.getElementById("filter"),
  regionFilters = filterBtn.querySelectorAll("li"),
  searchEl = document.getElementById("search"),
  modal = document.getElementById("modal"),
  closeBtn = document.getElementById("close"),
  noResult = document.getElementById("noresult"),
  loader = document.getElementById("card-loader");

noResult.style.display = "none";

// toggle theme - dark & light
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

getCountries();

// fetch all countries
async function getCountries() {
  loader.style.display = "block";
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  loader.style.display = "none";
  displayCountries(countries);
}

// fetch Countries by Code
const getCountryByCode = async (code) => {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
  const country = await res.json();
  return country[0];
};

const displayCountries = (countries) => {
  loader.style.display = "none";
  countriesEl.innerHTML = "";

  countries.forEach((country) => {
    const countryEl = document.createElement("div");
    countryEl.classList.add("card");

    countryEl.innerHTML = `
      <div>
        <img src="${country.flags.svg}" alt="${country.flags.alt}" />
      </div>
      <div class="card-body">
        <h3 class="country-name">${country.name.official}</h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p class="country-region"><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
      </div>
    `;

    countryEl.addEventListener("click", () => {
      modal.style.display = "flex";
      showCountryDetails(country);
    });

    countriesEl.appendChild(countryEl);
  });
};

// country detail
const showCountryDetails = async (country) => {
  const modalBody = modal.querySelector(".modal-body");
  const modalImg = modal.querySelector("img");

  modalImg.src = country.flags.svg;

  const nativeName = country.name.nativeName
    ? Object.values(country.name.nativeName)[0].official
    : "N/A";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map(({ name, symbol }) => `${name} (${symbol})`)
        .join(", ")
    : "N/A";
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  modalBody.innerHTML = `
   <div class="details-top">
      <div>
        <h2>${country.name.official}</h2>
        <p><strong>Native Name:</strong> ${nativeName}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Sub Region:</strong> ${country.subregion}</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
      </div>
      <div>
        <p><strong>Top Level Domain:</strong> ${country.tld}</p>
        <p><strong>Currency:</strong> ${currencies}</p>
        <p><strong>Languages:</strong> ${languages}</p>
      </div>
   </div>
   <div class="border-countries">
      <strong style="white-space: nowrap; margin-left: 6px">Border Countries:</strong>
      <div id="borders"></div>
   </div>
  `;

  const bordersContainer = modal.querySelector("#borders");

  if (country.borders && country.borders.length > 0) {
    bordersContainer.innerHTML = `<p style="margin-left: 6px">loading...!</p>`;
    const borderCountries = await Promise.all(
      country.borders.map((border) => getCountryByCode(border))
    );
    bordersContainer.innerHTML = "";
    borderCountries.forEach((borderCountry) => {
      const button = document.createElement("button");
      button.textContent = borderCountry.name.common;
      button.classList.add("border-button");
      button.addEventListener("click", () => {
        showCountryDetails(borderCountry);
      });
      bordersContainer.appendChild(button);
    });
  } else {
    bordersContainer.innerHTML = `<p style="margin-left: 4px">None</p>`;
  }
};

// close the modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// show and hide the filters (li tags)
filterBtn.addEventListener("click", () => {
  filterBtn.classList.toggle("open");
});

// search functionality
searchEl.addEventListener("input", (e) => {
  const { value } = e.target;
  const countryNames = document.querySelectorAll(".country-name");
  let found = false;

  countryNames.forEach((name) => {
    if (name.innerText.toLowerCase().includes(value.toLowerCase())) {
      name.parentElement.parentElement.style.display = "block";
      found = true;
    } else {
      name.parentElement.parentElement.style.display = "none";
    }
  });

  noResult.style.display = found ? "none" : "flex";
});

// region filter functionality
regionFilters.forEach((regionFilter) => {
  regionFilter.addEventListener("click", () => {
    const region = regionFilter.innerText;
    const countryRegions = document.querySelectorAll(".country-region");
    let found = false;

    countryRegions.forEach((regionEl) => {
      if (regionEl.innerHTML.includes(region) || region === "All") {
        regionEl.parentElement.parentElement.style.display = "block";
        found = true;
      } else {
        regionEl.parentElement.parentElement.style.display = "none";
      }
    });

    noResult.style.display = found ? "none" : "flex";
  });
});
