function loginUser() {
  $("#error").empty();

  const username = $("#username").val();
  const password = $("#password").val();

  const user = {username, password};
  if (!validateUser(user)) {
    return;
  }
  console.log(user);

  fetch(`${SERVER_URL}/login/${username}`, {
    method: "POST",
    mode: "cors",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name: username, password}),
  }).then(res => res.json().then(data => {
    console.log(data);
    if (res.status !== 200 || data.msg && data.msg === "error" || data.msg) {
      $("#error").text(data.detail);
      return;
    }
    console.log(data.avatar);
    localStorage.setItem('reddity.user', JSON.stringify({
      name: username,
      password,
      email: data.email,
      avatar: data.avatar
    }));
    window.location.href = "./index.html";
  }));
}

function validateUser(user) {
  if (!user.username) {
    $("#error").text("Username cannot be empty");
    return false;
  }
  if (!user.password) {
    $("#error").text("Password cannot be empty");
    return false;
  }
  return true;
}

$(document).ready(() => {
  $("#submit-button").on("click", () => loginUser());
});
