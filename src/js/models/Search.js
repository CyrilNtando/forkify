import axios from 'axios';
import { key, proxy } from '../config';
class Search {
  constructor(query) {
    this.query = query;
    this.results;
  }
  async getResults() {
    try {
      const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.results = res.data.recipes;
      return this.results;
    } catch (error) {
      alert(error);
    }
  }
}

export default Search;
