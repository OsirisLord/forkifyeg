import {async} from 'regenerator-runtime';
import {API_URL , RES_PER_PAGE} from './config.js';
import {getJSON} from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async (id) => {
  try {
    const data = await getJSON(`${API_URL}${id}`);
  const {recipe} = data.data
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    source_Url: recipe.source_Url,
    image_url: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cookingTime,
    ingredients: recipe.ingredients
  };
  if (state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;
  else state.recipe.bookmarked = false;

  } catch (error) {
    console.error(error)
  }
}

export const loadSearchResults = async(query) => {
  try {
    state.search.query = query
    const data = await getJSON(`${API_URL}recipes?search=${query}`);
    state.search.results = data.data.recipe.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      }
    })
    state.search.page = 1;
  } catch (error){
    console.error(error)
    throw error
  }
}

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start,end)
}

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQuantity = oldQuantity * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings
  })
  state.recipe.servings = newServings;
}

export const addBookmark = function(recipe) {
  // Add bookmarks
  state.bookmarks.push(recipe)
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
}

export const deleteBookmark = function(id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id)
  state.bookmarks.splice(index, 1)
  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false
}