import {async} from 'regenerator-runtime';
import {API_URL , RES_PER_PAGE , KEY} from './config.js';
import {AJAX} from './helpers';

/**
 * Application state object containing data related to the recipe, search, and bookmarks.
 * @type {Object}
 * @property {Object} recipe - Current recipe data.
 * @property {Object} search - Search related data.
 * @property {string} search.query - Current search query.
 * @property {number} search.page - Current page number in search results.
 * @property {Array} search.results - Array of search results.
 * @property {number} search.resultsPerPage - Number of results per page.
 * @property {Array} bookmarks - Array of bookmarked recipes.
 */
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

/**
 * Create a recipe object with the desired properties from the data.
 * @param {Object} data - The data object containing recipe information.
 * @returns {Object} - A new recipe object with selected properties.
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    source_Url: recipe.source_Url,
    image_url: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cookingTime,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Load recipe data by ID and update the state.
 * @async
 * @param {string} id - The ID of the recipe to load.
 * @returns {Promise<void>}
 */
export const loadRecipe = async (id) => {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Load search results based on the query and update the state.
 * @async
 * @param {string} query - The search query.
 * @returns {Promise<void>}
 */
export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}recipes?search=${query}&?key=${KEY}`);
    state.search.results = data.data.recipe.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Get search results for a specific page.
 * @param {number} [page=state.search.page] - The page number to retrieve.
 * @returns {Array} - An array of search results for the specified page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Update the recipe servings and adjust ingredient quantities.
 * @param {number} newServings - The new number of servings.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    // newQuantity = oldQuantity * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

/**
 * Persist bookmarks to localStorage.
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Add a recipe to bookmarks and persist the data.
 * @param {Object} recipe - The recipe object to bookmark.
 */
export const addBookmark = function (recipe) {
  // Add bookmarks
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

/**
 * Delete a bookmark by ID and update the state.
 * @param {string} id - The ID of the recipe to remove from bookmarks.
 */
export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/**
 * Initialize the application state by loading bookmarks from localStorage.
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/**
 * Upload a new recipe to the server and update the state.
 * @async
 * @param {Object} newRecipe - The new recipe data to upload.
 * @throws Will throw an error if the ingredient format is incorrect.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        (entry) => entry[0].startsWith('ingredient') && entry[1] !== ''
      )
      .map((ing) => {
        const ingArray = ing[1].split(',').map((el) => el.trim());
        if (ingArray.length !== 3)
          throw new Error('Wrong ingredient format.');
        const [quantity, unit, description] = ingArray;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_Url: newRecipe.source_Url,
      image_url: newRecipe.image_url,
      publisher: newRecipe.publisher,
      cookingTime: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};