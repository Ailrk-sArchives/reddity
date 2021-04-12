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
  loadPosts(s === "new" ? "new" : "popular", renderAllPosts);
});
