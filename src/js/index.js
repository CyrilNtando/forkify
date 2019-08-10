import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/RecipeView';

/** *global state of App
 * -Search object
 * -Current rescipe object
 * -Shopping list object
 * -Linked recipes
 * ***/
const state = {};
/*****SEARCH CONTROLLER */
const controlSearch = async e => {
  e.preventDefault();
  //1) Get query from view
  const query = searchView.getInput();
  if (query) {
    //2) New search object and add it to state
    state.search = new Search(query);
    //3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try {
      // 4) Search for recipes
      await state.search.getResults();
      //5)render results on UI
      clearLoader();
      searchView.renderResults(state.search.results);
    } catch (error) {
      alert('Something went Wrong with Search');
      clearLoader();
    }
  }
};
elements.searchForm.addEventListener('submit', controlSearch.bind(this));
elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.results, goToPage);
  }
});

/*****RECIPE CONTROLLER */
const controlRecipe = async () => {
  //Get id from url
  const id = window.location.hash.replace('#', '');
  if (id) {
    //prepare UI fro changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //highlight selected search item
    if (state.search) searchView.highlightSelected(id);
    //Create new recipe object
    state.recipe = new Recipe(id);
    //Get recipe data
    try {
      await state.recipe.getRecipe();
      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();
      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      alert('Erorr processing recipe!');
    }
  }
};
window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
//shorthand
// ['hashchange', 'load'].forEach(event => {
//   window.addEventListener(event, controlRecipe);
// });

//handling recipe button clicks

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //Decrease servings
    if (state.recipe.servings > 1) {
      state.recipe.upadateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase,.btn-increase *')) {
    //increase servings
    state.recipe.upadateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  }
});
