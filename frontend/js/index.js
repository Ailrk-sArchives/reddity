function loadPosts(filter) {
  fetch(`${SERVER_URL}/${filter}`)
    .then(res => res.json())
    .then(posts => renderAllPosts(posts));
}

function makePost(post) {
  return $(`
    <div class="post-card">
      <div class="score">
        <a class="arrow-icon">\u2764</a>
        <span>${post.score}</span>
      </div>
      <div class="info">
        <span class="post-title"><a href="./post.html?p=${post.post_id}">${post.title}</span>
        <span>by
         <a class="post-author" href="./user.html?u=${post.author}">${post.author}</a>
        </span>
      </div>
    </div>
  `);
}

function renderAllPosts(posts) {
  console.log(posts);
  $("#postlist").empty();

  posts.forEach(post => {
    const element = makePost(post);
    $("#postlist").append(element);
  });
}

$(document).ready(() => {
  const url = new URL(window.location.href);
  const s = url.searchParams.get("s");
  loadPosts(s === "new" ? "new" : "popular");
});
