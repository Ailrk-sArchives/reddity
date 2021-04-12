let postsCache;

function makeEmptyPost() {
  return $(`
    <div style="padding:12px">
      <p class="empty-post-message">No posts to show!</p>
      <p><a href="./submit.html">Create a new post</a></p>
    </div>
  `)
}

function renderAllPosts(posts) {
  console.log(posts);
  postsCache = posts;
  $("#postlist").empty();

  if (!posts) {
    $("#postlist").append(makeEmptyPost());
    return;
  }

  const search = $("#search").val();
  if (search) {
    posts = posts.filter(
      p => p.title.toLowerCase().includes(search.toLowerCase()));
  }

  if (posts.length === 0) {
    $("#postlist").append(makeEmptyPost());
    return;
  }

  posts.forEach(post => {
    const element = makePost(post);
    $("#postlist").append(element);
  });
}

$(document).ready(() => {
  const url = new URL(window.location.href);
  const s = url.searchParams.get("s");
  const filter = s === "new" ? "new" : "popular";
  loadPosts(filter, renderAllPosts);

  $("#search").on("input", () => renderAllPosts(postsCache));
  $("#submit-search").on("click", () => renderAllPosts(postsCache));
});
