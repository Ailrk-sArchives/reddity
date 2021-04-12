const SERVER_URL = "http://localhost:8080";
const localStorage = window.localStorage;
const USER = JSON.parse(localStorage.getItem("reddity.user"));

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
  $("#login-profile").attr("href", `./users?u=${user.name}`);
  $("#signup-logout").text("logout");
  $("#signup-logout").attr("href", "./index.html");

  $("#signup-logout").on("click", () => localStorage.removeItem("reddity.user"));
});
