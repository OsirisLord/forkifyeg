import {async} from 'regenerator-runtime';
import {API_URL} from './config.js';
import {getJSON} from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  }
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
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cookingTime,
    ingredients: recipe.ingredients
  };
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
  } catch (error){
    console.error(error)
    throw error
  }
}