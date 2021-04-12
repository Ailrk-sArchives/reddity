const SERVER_URL = "http://localhost:8080";
const localStorage = window.localStorage;
const USER = JSON.parse(localStorage.getItem("reddity.user"));

function loadPosts(filter, renderPosts) {
  fetch(`${SERVER_URL}/${filter}`)
    .then(res => res.json())
    .then(posts => renderPosts(posts));
}

function updateScore(postId, score, renderPosts) {
  if (!USER) return;
  fetch(`${SERVER_URL}/posts/${postId}/score`, {
    method: "PUT",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score: score })
  }).then(res => res.json()).then(data => {
    console.log(data);
    const url = new URL(window.location.href);
    const s = url.searchParams.get("s");
    loadPosts(s === "new" ? "new" : "popular", renderPosts);

    let votes = JSON.parse(localStorage.getItem("reddity.votes"));
    if (!votes) votes = {};
    if (score < 0) {
      votes[postId] = false;
    } else if (score > 0){
      votes[postId] = true;
    }
    localStorage.setItem("reddity.votes", JSON.stringify(votes));
  });
}

function makePost(post) {
  const votes = JSON.parse(localStorage.getItem("reddity.votes"));
  const voted = votes && votes[post.post_id] ? "voted" : "";

  const arrow = $(`<a class="arrow-icon ${voted}">\u2764</a>`);
  const postCard = $(`<div class="post-card"></div>`);
  const score = $(`<div class="score"></div>`);

  const info = $(`
    <div class="info">
      <span class="post-title"><a href="./post.html?p=${post.post_id}">${post.title}</span>
      <span>by
       <a class="post-author" href="./user.html?u=${post.author}">${post.author}</a>
      </span>
    </div>
  `);

  arrow.on("click", () => {
    const votes = JSON.parse(localStorage.getItem("reddity.votes"));
    if (votes && votes[post.post_id]) {
      updateScore(post.post_id, -1, renderAllPosts);
      return;
    }

    updateScore(post.post_id, +1, renderAllPosts);
  })

  score.append(arrow);
  score.append(`<span>${post.score}</span>`);
  postCard.append(score);
  postCard.append(info);

  return postCard;
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
