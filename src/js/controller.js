import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView.js';
import { state } from './model.js';
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice[1]
    if (!id) return;
    recipeView.renderSpinner()
    // 0) Update results view to mark the selected result
    resultsView.update(model.getSearchResultsPage())
    // 1) Loading recipe
    await model.loadRecipe(id)
    // 2) Rendering recipe
    recipeView.render(model.state.recipe)
  }
  catch (error) {
    alert(error);
    recipeView.renderError()
  }
}
controlRecipes()

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    // 1) Get search query
    const query = searchView.getQuery()
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResults(query)
    // 3) Render results
    resultsView.render(model.getSearchResultsPage())
    // 4) Render pagination buttons
    paginationView.render(model.state.search)
  } catch (error){
    console.error(error)
  }
}

const controlPagination = function(gotoPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage))
  // 2) Render new pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function() {
  // Update the recipe servings
  model.updateServings()
  // Update the recipe view
  recipeView.update(model.state.recipe)
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
}
init()