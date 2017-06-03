import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML (locations) {
  return locations.map((location) => {
    return `
    <a href="/location/${location.slug}" class="search__result">
      <strong>${location.name}</strong>
    </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function () {
    // if there is no value, quit it!
    if (!this.value) {
      //
      searchResults.style.display = 'none';
      return; // stop!
    }
    // show the search results!
    searchResults.style.display = 'block';

    axios
      .get(`/api/v1/search?q=${this.value}`)
      .then((res) => {
        if (res.data.length) {
          // sanitize the data before changing the HTML to prevent xss attacks
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
          return;
        }
        // tell them nothing came back
        // sanitize the data before changing the HTML to prevent xss attacks
        searchResults.innerHTML = dompurify.sanitize(
          `<div class="search__result">No results found for <span class="hl"><strong> ${this.value} </strong></span>found!</div>`);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  searchInput.on('keyup', (e) => {
    // if they aren't pressing up, down or enter, who cares!
    if (![40, 38, 13].includes(e.keyCode)) {
      return; // ignore it
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    if (e.keyCode === 40 && current) {
      // console.log('Down arrow, highlighted choice');
      // console.log(current);
      next = current.nextElementSibling || items[0];
    } else if (e.keyCode === 40) { // results first come back here
      // console.log('Initial load only (should be)');
      // console.log(current);
      next = items[0];
    } else if (e.keyCode === 38 && current) {
      // console.log('Up arrow, highlighted choice!');
      // console.log(current);
      next = current.previousElementSibling || items[items.length - 1];
    } else if (e.keyCode === 38) {
      // console.log('Up arrow');
      // console.log(current);
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {
      // console.log('Changing pages!');
      // console.log(current);
      window.location = current.href;
      return;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
    // console.log('DO SOMETHING!');
  });
}

export default typeAhead;
