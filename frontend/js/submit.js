function createPost() {
  $("#error").empty();

  const title = $("#title").val();
  const content = $("#content").val();

  if (!title) {
    $("#error").text("A title is required");
    return;
  }
  const post = {title, content: content ? content : "", author: USER.name};

  fetch(`${SERVER_URL}/posts`, {
    method: "PUT",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  }).then(res => res.json().then(data => {
    console.log(data);
    if (res.status !== 200) {
      $("#error").text(data.detail);
      return;
    }
    window.location.href = "./index.html?s=new";
  }));
}

$(document).ready(() => {
  if (!USER) {
    window.location.href = "./login.html";
    return;
  }
  $("#submit-button").on("click", () => createPost());
});
