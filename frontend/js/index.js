let postsCache;

function renderAllPosts(posts) {
  console.log(posts);
  postsCache = posts;
  $("#postlist").empty();

  const search = $("#search").val();
  if (search) {
    posts = posts.filter(
      p => p.title.toLowerCase().includes(search.toLowerCase()));
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
