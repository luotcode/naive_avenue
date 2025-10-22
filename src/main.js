import { mountLandingPage } from "./pages/landingpage.js";

let currentPage = null;

function init() {
  const canvas = document.getElementById("scene");

  if (currentPage) {
    currentPage.dispose();
    currentPage = null;
  }

  currentPage = mountLandingPage(canvas);
}

window.addEventListener("DOMContentLoaded", init);
