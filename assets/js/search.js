(() => {

  let posts = [];

  fetch('/search.json')
    .then(response => response.json())
    .then(data => {

      posts = data;

      const topicList = document.getElementById('topic-list');

      if (topicList) {

        const categories = [
          ...new Set(
            posts.flatMap(post => post.categories || [])
          )
        ].sort();

        topicList.innerHTML = categories
          .map(category =>
            `<a class="tag" href="?q=${encodeURIComponent(category)}">
              ${category}
            </a>`
          )
          .join('');
      }

    });

  const input = document.getElementById('search');
  const results = document.getElementById('search-results');

  function search(query) {

    if (!results) return;

    query = query.trim().toLowerCase();

    if (!query) {
      results.classList.remove('open');
      return;
    }

    const matches = posts
      .filter(post =>
        (
          post.title +
          ' ' +
          post.excerpt +
          ' ' +
          (post.categories || []).join(' ')
        )
        .toLowerCase()
        .includes(query)
      )
      .slice(0, 8);

    if (matches.length) {

      results.innerHTML = matches
        .map(post => `
          <a href="${post.url}">
            <b>${post.title}</b>
            <small>${post.date}</small>
          </a>
        `)
        .join('');

    } else {

      results.innerHTML =
        '<div class="no-results">No articles found.</div>';

    }

    results.classList.add('open');
  }

  input?.addEventListener('input', event => {
    search(event.target.value);
  });

  const query =
    new URLSearchParams(window.location.search).get('q');

  if (query && input) {
    input.value = query;
    search(query);
  }

})();
