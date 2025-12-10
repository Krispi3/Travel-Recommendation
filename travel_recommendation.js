// travel_recommendation.js

const API_URL = "travel_recommendation_api.json";

let travelData = null;

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadTravelData();

  const searchBtn = document.getElementById("search-btn");
  const clearBtn = document.getElementById("clear-btn");

  // ✅ Results are shown ONLY when Search button is clicked
  if (searchBtn) searchBtn.addEventListener("click", handleSearch);
  if (clearBtn) clearBtn.addEventListener("click", handleClear);
});

// Fetch JSON data
async function loadTravelData() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // ✅ Check output in console as required by the instructions
    console.log("Travel data loaded:", data);

    travelData = data;
  } catch (error) {
    console.error("Error fetching travel data:", error);
  }
}

// Handle Search click
function handleSearch(event) {
  event.preventDefault();

  const input = document.getElementById("search-input");
  if (!input) return;

  // ✅ Convert everything the user types to lowercase
  //    This accepts "BEACH", "Beach", "bEaCh", etc.
  const keyword = input.value.trim().toLowerCase();

  if (!keyword) {
    renderResults([]);
    return;
  }

  const results = searchRecommendations(keyword);
  renderResults(results);
}

// Handle Clear click
function handleClear(event) {
  event.preventDefault();

  const input = document.getElementById("search-input");
  if (input) input.value = "";

  renderResults([]);
}

// Main search logic
function searchRecommendations(keyword) {
    if (!travelData) return [];
  
    const results = [];
  
    // normalize keyword like "Beach", "BEACH" -> "beach"
    const k = keyword.toLowerCase();
  
    // ---------------- BEACH / BEACHES ----------------
    if (k === "beach" || k === "beaches") {
      if (Array.isArray(travelData.beaches)) {
        travelData.beaches.forEach(beach => {
          results.push({
            name: beach.name,
            description: beach.description,
            imageUrl: beach.imageUrl,
            tag: "Beach"
          });
        });
      }
      return results; // we’re done for beach search
    }
  
    // ---------------- TEMPLE / TEMPLES ----------------
    if (k === "temple" || k === "temples") {
      if (Array.isArray(travelData.temples)) {
        travelData.temples.forEach(temple => {
          results.push({
            name: temple.name,
            description: temple.description,
            imageUrl: temple.imageUrl,
            tag: "Temple"
          });
        });
      }
      return results; // done for temple search
    }
  
    // ---------------- COUNTRIES (Japan, Brazil, Australia, or "country") ----------------
    // If user types a specific country name -> show its cities.
    // If user types "country" -> show cities from ALL countries.
    if (Array.isArray(travelData.countries)) {
      travelData.countries.forEach(country => {
        const countryName = (country.name || "").toLowerCase();
  
        const countryMatches =
          k === "country" ||          // generic keyword "country"
          countryName.includes(k);    // "japan", "brazil", "australia"
  
        if (countryMatches && Array.isArray(country.cities)) {
          country.cities.forEach(city => {
            results.push({
              name: city.name,
              description: city.description,
              imageUrl: city.imageUrl,
              tag: country.name
            });
          });
        }
      });
    }
  
    return results;
  }
  

// Show recommendations as cards on the page
function renderResults(results) {
    const container = document.getElementById("results-container");
    if (!container) return;
  
    // No results -> hide popup
    if (!results || results.length === 0) {
      container.style.display = "none";
      container.innerHTML = "";
      return;
    }
  
    // Show overlay
    container.style.display = "flex";
    container.innerHTML = "";
  
    // Create modal wrapper
    const modal = document.createElement("div");
    modal.className = "results-modal";
  
    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "results-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => {
      container.style.display = "none";
      container.innerHTML = "";
    });
  
    // List wrapper for cards
    const list = document.createElement("div");
    list.className = "results-list";
  
    // Build each result card
    results.forEach(item => {
      const card = document.createElement("div");
      card.className = "result-card";
  
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="result-image" />
        <div class="result-info">
          <h3>${item.name}</h3>
          ${item.tag ? `<p class="result-tag">${item.tag}</p>` : ""}
          <p>${item.description || ""}</p>
        </div>
      `;
  
      list.appendChild(card);
    });
  
    modal.appendChild(closeBtn);
    modal.appendChild(list);
    container.appendChild(modal);
  }
  
