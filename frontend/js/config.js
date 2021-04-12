const SERVER_URL = "http://localhost:8080";
const localStorage = window.localStorage;
const USER = JSON.parse(localStorage.getItem("reddity.user"));

function loadPosts(filter, renderPosts) {
  fetch(`${SERVER_URL}/${filter}`)
    .then(res => res.json())
    .then(posts => renderPosts(posts));
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

$(document).ready(() => {
  const user = USER;
  if (!user) {
    return;
  }
  console.log(user);

  $(".profile-links").prepend(`
    <a href="./submit.html">create</a>
  `);

  $("#login-profile").text(user.name);
  $("#login-profile").attr("href", `./user.html?u=${user.name}`);
  $("#signup-logout").text("logout");
  $("#signup-logout").attr("href", "./index.html");

  $("#signup-logout").on("click", () => localStorage.removeItem("reddity.user"));
});
