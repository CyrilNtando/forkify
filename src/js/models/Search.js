import axios from 'axios';
class Search {
  constructor(query) {
    this.query = query;
    this.results;
  }
  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const apiKey = '80e3864a8951a55460126e3153e927b4';
    try {
      const res = await axios(
        `${proxy}http://food2fork.com/api/search?key=${apiKey}&q=${this.query}`
      );
      this.results = res.data.recipes;
      return this.results;
    } catch (error) {
      alert(error);
    }
  }
}

export default Search;
