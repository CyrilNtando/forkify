import { elements, renderLoader, clearLoader } from './views/base';
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
    renderLoader(elements.searchRes);
    // 4) Search for recipes
    await state.search.getResults();
    //5)render results on UI
    clearLoader();
    searchView.renderResults(state.search.results);
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
