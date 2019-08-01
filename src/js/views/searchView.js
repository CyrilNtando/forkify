import { elements } from './base';
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
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
    <a class="results__link " href="${recipe.recipe_id}">
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

export const renderResults = recipes => {
  recipes.forEach(renderRecipe.bind(this));
};
