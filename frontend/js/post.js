let collapsed = {};
let postCache = {};

function loadPost(id) {
  fetch(`${SERVER_URL}/posts/${id}`)
    .then(res => res.json())
    .then(post => renderPost(post));
}

function submitReply(body, author, postId, parentId) {
  const reply = { body, author }

  const uri = parentId ? "/" + parentId : "";
  console.log(uri);
  fetch(`${SERVER_URL}/posts/${postId}${uri}`, {
    method: 'PUT',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reply)

  }).then(res => res.json())
    .then(data => {
      console.log(data);
      loadPost(postId);
    });
}

function renderReplies(replyParent, replies) {
  for (const reply of replies) {
    const child = makeReply(reply);
    replyParent.append(child);
    if (reply.replies && !collapsed[reply.reply_id]) {
      renderReplies(child, reply.replies)
    }
  }
}

function renderPost(post) {
  console.log(post);
  postCache = post;

  $("#post-header").empty();
  $("#comment-submit").empty();
  $("#replies").empty();

  $("#post-header").append(makePostHeader(post));

  if (USER) {
    $("#comment-submit").append(makeReplyBox(post.post_id, null))
  }

  const replies = post.replies.filter(r => r.root_reply_id === null);
  renderReplies($("#replies"), replies);

  if (post.title) {
    let history = JSON.parse(localStorage.getItem("reddity.history"));
    if (!history) {
      history = [];
    }

    history = history.filter(p => p.post_id !== post.post_id);
    history.unshift({ post_id: post.post_id, title: post.title });
    if (history.length > 3) {
      history.pop();
    }
    localStorage.setItem("reddity.history", JSON.stringify(history));
  }
}

function makePostHeader(post) {
  if (!post.title) {
    return $(`<h1>404 could not find post</h1>`);
  }
  return $(`
    <div>
      <h1>${post.title}</h1>
      <div class="content-box">
        <p>${post.content}</p>
      </div>
      <p class="byline">by ${post.author} at ${post.created_at}</p>
    </div>
  `);
}

function makeReply(reply) {
  const result = $(`
    <div class="reply reply-content" id="reply_${reply.reply_id}">
      <span class="byline">by
       <a href="./user.html?u=${reply.author}">${reply.author}</a>
       at ${reply.created_at}</span>
      <p class="reply-body">${reply.body}</p>
    </div>
  `);
  const span = $(`<span class="actions"></span>`);

  if (USER) {
    const btn = $(`<button id="btn_${reply.reply_id}">Reply</button>`);

    btn.on("click", () => {
      $("#nested-box").remove();
      (makeReplyBox(reply.post_id, reply.reply_id)).insertAfter(btn);
    });

    span.append(btn);
  }

  if (reply.replies && reply.replies.length > 0) {
    const val = collapsed[reply.reply_id] ? true : false;
    const text = !val ? "Collapse" : "Uncollapse";
    const collapseBtn = $(`<button id="col_${reply.reply_id}">${text}</button>`);
    collapseBtn.on("click", () => {
      collapsed[reply.reply_id] = !val;
      renderPost(postCache);
    });
    span.append(collapseBtn);
  }
  result.append(span);

  return result;
}

function makeReplyBox(postId, parentId) {
  const boxId = parentId ? "nested-box" : "toplevel-box";
  const box = $(`<div class="reply-box" id="${boxId}"></div>`);
  const area = $(`
    <textarea id="${boxId}-content" placeholder="Speak your mind..."></textarea>
  `);
  const btn = $(`<button id="${boxId}-btn">Submit Reply</button>`);
  const span = $(`<span class="actions"></span>`);
  span.append(btn);

  box.append(area);
  box.append(span);

  btn.on("click", () => {
    if (USER) {
      const body = area.val();
      console.log(body);
      submitReply(body, USER.name, postId, parentId)
    }
  })
  return box;
}

$(document).ready(() => {
  const url = new URL(window.location.href);
  const p = url.searchParams.get("p");

  if (!p) {
    $("#post-header").append("<h1>404 could not find post</h1>");
    return;
  }
  loadPost(p);
});
