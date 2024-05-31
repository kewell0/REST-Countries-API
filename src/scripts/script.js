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
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();

  const names = countries[5].name.nativeName;
  const native = Object.values(names);
  console.log(native[0].official, "!!!!!!");
  console.log(countries[5], "countries");

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
                <p>
                    <strong>Population:</strong>
                    ${country.population.toLocaleString()}
                </p>
                <p class="country-region">
                    <strong>Region:</strong>
                    ${country.region}
                </p>
                <p>
                    <strong>Capital:</strong>
                    ${country.capital}
                </p>
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
const showCountryDetails = (country) => {
  const modalBody = modal.querySelector(".modal-body");
  const modalImg = modal.querySelector("img");

  modalImg.src = country.flags.svg;

  // Convert currencies and languages to arrays
  const currencies = country.currencies
    ? Object.entries(country.currencies).map(
        ([key, { name, symbol }]) => `${name} (${symbol})`
      )
    : ["N/A"];
  const languages = country.languages
    ? Object.values(country.languages)
    : ["N/A"];

  // Convert Native name
  const nativeName = Object.values(country.name.nativeName);

  modalBody.innerHTML = `
   <div class="details-top">
      <div><h2>${country.name.official}</h2>
      <p>
          <strong>Native Name:</strong>
          ${nativeName[0].official}
      </p>
   
      <p>
      <strong>Population:</strong>
      ${country.population.toLocaleString()}
      </p>
   
      <p>
      <strong>Region:</strong>
      ${country.region}
      </p>
   
      <p>
      <strong>Sub Region:</strong>
      ${country.subregion}
      </p>
      <p>
      <strong>Capital:</strong>
      ${country.capital}
      </p></div>
    <div><p>
    <strong>Top Level Domain:</strong>
    ${country.tld}
    </p>
    <p>
    <strong>Currency:</strong>
    ${
      country.currencies
        ? Object.values(country.currencies)
            .map((currency) => `${currency.name} (${currency.symbol})`)
            .join(", ")
        : "N/A"
    }
    </p>
    <p>
    <strong>Languages:</strong>
    ${country.languages ? Object.values(country.languages).join(", ") : "N/A"}
    </p>
    </div>
   </div>
   <div class="borders-container">
    <strong>Border Countries:</strong>
    <div id="borders"></div>
   </div>
    `;

  const bordersContainer = modal.querySelector("#borders");

  if (country.borders && country.borders.length > 0) {
    country.borders.forEach(async (border) => {
      const borderCountry = await getCountryByCode(border);
      const button = document.createElement("button");
      button.textContent = borderCountry.name.common;
      button.classList.add("border-button");
      button.addEventListener("click", () => {
        showCountryDetails(borderCountry);
      });
      bordersContainer.appendChild(button);
    });
  } else {
    bordersContainer.innerHTML = "<p>N/A</p>";
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

searchEl.addEventListener("input", (e) => {
  const { value } = e.target;
  const nameOfConttry = document.querySelectorAll(".country-name");

  nameOfConttry.forEach((name) => {
    if (name.innerText.toLowerCase().includes(value.toLowerCase())) {
      name.parentElement.parentElement.style.display = "block";
    } else {
      name.parentElement.parentElement.style.display = "none";
      noResult.style.display = "flex";
    }
  });
});

regionFilters.forEach((nation) => {
  nation.addEventListener("click", () => {
    const result = nation.innerText,
      countryRegion = document.querySelectorAll(".country-region");

    countryRegion.forEach((region) => {
      if (region.innerHTML.includes(result) || result === "All") {
        region.parentElement.parentElement.style.display = "block";
      } else {
        region.parentElement.parentElement.style.display = "none";
      }
    });
  });
});
