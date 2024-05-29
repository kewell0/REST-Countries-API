// Modal
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

async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const countries = await res.json();
  console.log(countries[0], "countries");

  displayCountries(countries);
}

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
                <h3 class="country-name">${country.name.common}</h3>
                <p>
                    <strong>Population:</strong>
                    ${country.population}
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

const showCountryDetails = (country) => {
  const modalBody = modal.querySelector(".modal-body"),
    modalImg = modal.querySelector("img");

  modalImg.src = country.flag;
  modalBody.innerHTML = `
  <h2>${country.name}</h2>
  <p>
     <strong>Native Name:</strong>
      ${country.nativeName}
  </p>

  <p>
  <strong>Population:</strong>
   ${country.population}
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
</p>
<p>
  <strong>Top Level Domain:</strong>
  ${country.topLevelDomain[0]}
</p>
<p>
<strong>Currencies:</strong>
${country.currencies.map((currency) => currency.code)}
</p>
<p>
<strong>Languages:</strong>
${country.languages.map((language) => language.name)}
</p>
  `;
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
