/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This index.js adds functionality to the website's homepage, adding images
 * to deals, ads, and products.
 */

"use strict";

(function() {
  const IMG_FILE_EXT = ".jpg";
  const PRODUCTS_QUERY_URL = "/best-sellers";

  window.addEventListener("load", init);

  /** Initializes the home page */
  function init() {
    displayProductsOnHome();

    qs(".search-entry").addEventListener("input", changeButton);

    qs(".search-bar").addEventListener("submit", function(event) {
      event.preventDefault();
      searchTerm();
    });
  }

  /** Changes the button depending on its associated textbox's input */
  function changeButton() {
    if (qs(".search-entry").value.trim() !== "") {
      qs(".search-button").disabled = false;
    } else {
      qs(".search-button").disabled = true;
    }
  }

  /** Displays products onto the home page */
  async function displayProductsOnHome() {
    try {
      let res = await fetch(PRODUCTS_QUERY_URL);
      await statusCheck(res);
      res = await res.json();
      addProductsToHome(res);
    } catch (error) {
      handleQueryError();
    }
  }

  /**
   * Adds product cards to the home page
   * @param {JSON} res - JSON file containing information about the products
   */
  function addProductsToHome(res) {
    let productsContainer = id("best-sellers");
    for (let item = 0; item < res.length; item++) {

      let productImg = gen("img");
      productImg.src = "img/products/" + res[item]["image"] + IMG_FILE_EXT;
      productImg.alt = res[item]["item"];

      let productName = gen("h4");
      productName.textContent = res[item]["item"];

      let rating = gen("img");
      rating.src = "img/rating/5star.png";

      let productCard = gen("div");
      productCard.appendChild(productImg);
      productCard.appendChild(productName);
      productCard.appendChild(rating);
      productCard.addEventListener("click", function() {
        sessionStorage.setItem("search", productName.textContent);
        location.assign("products.html");
      });

      productsContainer.appendChild(productCard);
    }
  }

  /** Redirects to the products page with the search results */
  function searchTerm() {
    sessionStorage.setItem("search", qs(".search-entry").value);
    location.assign("products.html");
  }

  /** Adds a message onto the web page about an error fetching data */
  function handleQueryError() {
    let productsContainer = id("best-sellers");
    let errorMessage = gen("p");
    errorMessage.textContent = "Error. Please try again later.";
    errorMessage.classList.add("error");
    productsContainer.appendChild(errorMessage);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns a generated DOM object of type tag.
   * @param {string} tag element tag
   * @returns {object} DOM object created with tag
   */
  function gen(tag) {
    return document.createElement(tag);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the element that matches the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object} DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }
})();