/**
 * Joselyn Do (AB) & Keith Nguyen (AA)
 * May 5th, 2024
 * Section AA: Kevin Wu
 * Section AB: Elias & Quinton
 *
 * This cart.js adds functionality to the user's shopping cart page, allowing users
 * to check out and purchase all their items at once.
 */

"use strict";

(function() {
  const LOG_IN_ENDPOINT = "[log in endpoint]";

  window.addEventListener("load", init);

  /**
   * Initializes the log in page
   */
  function init() {
    getCart();
    id("clear").addEventListener("click", clearCart);
    id("checkout").addEventListener("click", function() {
      let username = window.localStorage.getItem("user");
      let cart = window.localStorage.getItem("cart");
      checkOut(username, cart);
    });
  }

  /**
   * Makes a fetch to update transactions and process the sale
   * @param {Array} cart Contains a list of items in current cart
   */
  async function checkOut(username, cart) {
    let body = new FormData();
    let loggedIn = window.localStorage.getItem("loggedIn");

    if (loggedIn && username && cart) {
      body.append("username", username);
      body.append("cart", cart);

      try {
        let response = await fetch("/buy", {method: "POST", body: body});
        await statusCheck(response);
        let result = await response.text();
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Bad");
    }
  }

  /**
   * Makes a POST fetch to retrieve details on user's cart
   */
  async function getCart() {
    let body = new FormData();
    let cart = window.localStorage.getItem("cart");
    let loggedIn = window.localStorage.getItem("loggedIn");

    if (loggedIn && cart) {
      id("checkout").classList.remove("hidden");
      id("clear").classList.remove("hidden");

      body.append("cart", cart);
      try {
        let response = await fetch("/cart", {method: "POST", body: body});
        await statusCheck(response);
        let result = await response.json();
        populateCart(result);
      } catch (error) {
        console.error(error);
      }
    } else {
      clearCart();
      id("checkout").classList.add("hidden");
      id("clear").classList.add("hidden");
    }
  }

  /**
   * Generates DOM elements representing the user's cart.
   * @param {Object} items Details of each product
   */
  function populateCart(items) {
    let cart = id("cart-container");
    for (let i = 0; i < items.length; i++) {
      let productCard = gen("section");
      productCard.classList.add("card");

      let product = gen("div");
      let productName = gen("h4");
      productName.textContent = items[i]["item"];
      let productImg = gen("img");
      productImg.src = "img/products/" + items[i]["image"] + ".jpg";
      let productPrice = gen("p");
      productPrice.textContent = "$" + items[i]["price"];
      product.appendChild(productName);
      product.appendChild(productImg);
      product.appendChild(productPrice);

      let productDescription = gen("div");
      let productDescriptionP = gen("p");
      productDescriptionP.textContent = items[i]["description"];
      productDescription.appendChild(productDescriptionP);

      productCard.appendChild(product);
      productCard.appendChild(productDescription);
      cart.appendChild(productCard);
    }
  }

  /**
   * Clears the user's stored cart
   */
  function clearCart() {
    id("cart-container").innerHTML = "";
    window.localStorage.setItem("cart", "");

    let inform = gen("p");
    inform.textContent = "There is nothing in your cart!";
    id("cart-container").appendChild(inform);
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

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }
})();