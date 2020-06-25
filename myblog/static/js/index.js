const like_buttons = document.getElementsByClassName("like-btn");

function getCookie(name) {
  // function to get csrftoken cookie
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function likePost(e) {
  let csrftoken = getCookie("csrftoken");
  post_id = e.target.value;
  fetch("react/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "same-origin",
    body: JSON.stringify({ post_id: post_id, reaction_type: "like" }), // body data type must match "Content-Type" header
  })
    .then((response) => response.json())
    .then((data) => {
      reactions_holder = document.getElementById(
        `reactions-${data["post_id"]}`
      );
      if (data["action"] === "increase") {
        e.target.classList.add("liked");
        reactions_holder.textContent = Number(reactions_holder.textContent) + 1;
      } else if (data["action"] === "decrease") {
        e.target.classList.remove("liked");
        reactions_holder.textContent = Number(reactions_holder.textContent) - 1;
      }
    });
}

for (button of like_buttons) {
  button.addEventListener("click", (e) => likePost(e));
}

let endhover;
let buttonBeingHovered = null;

// hide reaction icons when user leaves button
function hideReactions(e) {
  endhover = setTimeout(() => {
    let icons = document.getElementById("reaction-hidden-" + e.target.value);
    if (icons !== null) {
      icons.style.display = "none";
      buttonBeingHovered = null;
    }
  }, 1000);
}

//
for (button of like_buttons) {
  button.addEventListener("mouseout", (e) => hideReactions(e));
}

// show reaction icons when user hovers on like button

function showReactions(e) {
  let icons = document.getElementById("reaction-hidden-" + e.target.value);
  if (buttonBeingHovered !== null) {
    if (buttonBeingHovered !== icons) {
      buttonBeingHovered.style.display = "none";
    }
  }
  clearTimeout(endhover);

  if (icons !== null) {
    icons.style.display = "flex";
    buttonBeingHovered = icons;
  }
}
// show reaction icons when user hovers on button
for (button of like_buttons) {
  button.addEventListener("mouseover", (e) => showReactions(e));
}

// keep showing icons if user is hovering on any icon
let gifs = document.getElementsByClassName("gif");

for (gif of gifs) {
  gif.addEventListener("mouseover", function () {
    clearTimeout(endhover);
  });
}

// hide icons if user leaves one of gifs
for (gif of gifs) {
  gif.addEventListener("mouseout", function (e) {
    endhover = setTimeout(() => {
      let icons = document.getElementById(
        "reaction-hidden-" + e.target.getAttribute("reactionsId")
      );
      if (icons !== null) {
        icons.style.display = "none";
      }
    }, 1000);
  });
}

// reaction functionality

function reactToPost(e) {
  let csrftoken = getCookie("csrftoken");
  post_id = Number(e.target.getAttribute("reactionsId"));
  fetch("react/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    credentials: "same-origin",
    body: JSON.stringify({
      post_id: post_id,
      reaction_type: e.target.getAttribute("reactionType"),
    }), // body data type must match "Content-Type" header
  })
    .then((response) => response.json())
    .then((data) => {
      reactions_holder = document.getElementById(
        `reactions-${data["post_id"]}`
      );
      const reactionButton = document.getElementById(
        `like-btn-${data["post_id"]}`
      );
      if (data["action"] === "increase") {
        reactionButton.textContent = e.target.getAttribute("reactionType");
        reactions_holder.textContent = Number(reactions_holder.textContent) + 1;
      } else if (data["action"] === "decrease") {
        reactionButton.textContent = "Like";
        reactions_holder.textContent = Number(reactions_holder.textContent) - 1;
      } else if (data["action"] === "none") {
        reactionButton.textContent = e.target.getAttribute("reactionType");
      }
    });
}

for (gif of gifs) {
  gif.addEventListener("click", (e) => reactToPost(e));
}
