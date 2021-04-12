function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error)
  });
};

function createUser() {
  $("#error").empty();

  const username = $("#username").val();
  const password = $("#password").val();
  const email = $("#email").val();
  const avatar = document.getElementById("avatar-select").files[0];

  const user = { username, password, email };
  console.log(user);

  if (!validateUser(user)) {
    return;
  }

  fileToBase64(avatar).then(avatar64 => {
    console.log(avatar64);
    fetch(`${SERVER_URL}/signup`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name: username, password, email}),
    }).then(res => res.json())
      .then(data => {
        if (data.msg && data.msg === "error") {
          $("#error").text(data.detail);
          return;
        }
        console.log(data);
        localStorage.setItem('reddity.user', JSON.stringify({name: username, password}));
        window.location.href = "./index.html";
      });
  });
}

function validateUser(user) {
  if (!user.email) {
    $("#error").text("Email cannot be empty");
    return false;
  }
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
  console.log("hello")
  $("#submit-button").on("click", () => createUser());
});
