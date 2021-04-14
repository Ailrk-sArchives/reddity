function makeEmptyPost(name) {
  return $(`
    <div class="post-card">
      <p class="empty-post-message">${name} has never submitted a post!</p>
    </div>
  `)
}

function renderUserPosts(posts, author) {
  console.log(posts);
  console.log(USER.avatar);
  $("#postlist").empty();

  if (!posts) {
    $("#postlist").append(makeEmptyPost(author));
  }

  posts = posts.filter(post => post.author === author);
  let score = 0;

  if (posts.length === 0) {
    $("#postlist").append(makeEmptyPost(author));
  }

  posts.forEach(post => {
    const element = makePost(post);
    $("#postlist").append(element);
    score += post.score;
  });

  $("#score").text(`posts: ${posts.length} points: ${score}`);
}

function makeUserEditForm() {
  return $(`
    <p>Change Password</p>
    <input type="password" id="new-password" placeholder="Enter a new password">
    <button id="update-password">Update</button>
    <p>Change Email</p>
    <input type="email" id="new-email" placeholder="Enter a new email">
    <button id="update-email">Update</button>
  `);
}

$(document).ready(() => {
  const url = new URL(window.location.href);
  const u = url.searchParams.get("u");

  fetch(`${SERVER_URL}/avatar/name/${u}`)
    .then(res => res.json())
    .then(avatar => {
      const a = avatar.avatar;
      $(".sidebar").append(`<h3>${u}</h3>`);
      $(".sidebar").append(`<p id="score"></p>`);
      $(".sidebar").append(`<img src="${a ?? USER.avatar}" width="200"></img>`);

      loadPosts("new", (posts) => renderUserPosts(posts, u));
      document.title = `${u} - Reddity`;

      if (USER && USER.name === u) {
        $(".sidebar").append(makeUserEditForm());
      }
    }).catch(e => {
      console.error(e);
    });
});
