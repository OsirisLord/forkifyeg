import {async} from 'regenerator-runtime';
export const state = {
  recipe: {},
};

export const loadRecipe = async (id) => {
  const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
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
  }
}