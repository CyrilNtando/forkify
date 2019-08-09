import { elements } from './base';
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
  const resultArr = Array.from(document.querySelectorAll('.results__link'));
  resultArr.forEach(el => {
    el.classList.remove('results__link--active');
  });
  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

const limitRecipeTitle = (title, limit = 17) => {
  const newTtile = [];
  if (title.length > limit) {
    //@param callback function and accumulator(returned value) of 0
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTtile.push(cur);
      }
      //update accumulator
      return acc + cur.length;
    }, 0);

    return `${newTtile.join(' ')}...`;
  }

  return title;
};
const renderRecipe = recipe => {
  const markUp = ` <li>
    <a class="results__link " href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="{recipe.title">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`;
  elements.searchResList.insertAdjacentHTML('beforeend', markUp);
};

const createButton = (page, type) =>
  `<button class="btn-inline results__btn--${type}" data-goto="${
    type === 'prev' ? page - 1 : page + 1
  }">
  <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
 <svg class="search__icon">
     <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
 </svg>
 
</button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;
  if (page === 1) {
    // show button  go to next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    //show button go to prev and next page
    button = `
    ${createButton(page, 'next')}
    ${createButton(page, 'prev')}`;
  } else if (page === pages && pages > 1) {
    //show  button  go to prev page
    button = createButton(page, 'prev');
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //render result of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  recipes.slice(start, end).forEach(renderRecipe.bind(this));
  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
