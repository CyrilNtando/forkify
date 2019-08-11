import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/RecipeView';
import * as ListView from './views/listView';
import * as likeView from './views/likesView';

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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
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

/*****List CONTROLLER */
const controllist = () => {
  //Create new list if none
  if (!state.list) state.list = new List();
  //Add each ingrediant to list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    ListView.renderItem(item);
  });
};
//Handle delete and updateList item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;
  //handle the delete event button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    //Delete from state and UI
    state.list.deleteItem(id);
    //Delete from UI
    ListView.deleteitem(id);
    //handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/*****Like CONTROLLER */
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  if (!state.likes.isLiked(currentID)) {
    //user has not yet liked current recipe
    //Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button
    likeView.toggleLikeBtn(true);
    //Add like to UI List
    likeView.renderLike(newLike);
  } else {
    //user has liked current recipe
    //remove like from state
    state.likes.deleteLike(currentID);
    //toggle the like button
    likeView.toggleLikeBtn(false);
    //Remove like from the UI List
    likeView.deleteLike(currentID);
  }

  likeView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore Liked recipes on page load
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();

  likeView.toggleLikeMenu(state.likes.getNumLikes());
  //render existing likes
  state.likes.likes.forEach(like => likeView.renderLike(like));
});

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
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controllist();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //like controller
    controlLike();
  }
});

/*****List CONTROLLER */
