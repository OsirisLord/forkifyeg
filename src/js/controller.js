import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView';
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
    resultsView.render(model.state.search.results)
  } catch (error){
    console.error(error)
  }
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes())
  searchView.addHandlerSearch(controlSearchResults())
}
init()