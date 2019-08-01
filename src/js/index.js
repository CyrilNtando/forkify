import { elements } from './views/base';
import Search from './models/Search';
import * as searchView from './views/searchView';

/** *global state of App
 * -Search object
 * -Current rescipe object
 * -Shopping list object
 * -Linked recipes
 * ***/
const state = {};
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
    // 4) Search for recipes
    await state.search.getResults();
    //5)render results on UI
    searchView.renderResults(state.search.results);
  }
};
elements.searchForm.addEventListener('submit', controlSearch.bind(this));
