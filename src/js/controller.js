import 'core-js/stable'
import 'regenerator-runtime/runtime'
import * as model from './model.js'
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe');


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

const init = function () {
  recipeView.addHandlerRender(controlRecipes())
}
init()