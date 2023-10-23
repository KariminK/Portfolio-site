// fetch("https://api.lanyard.rest/v1/users/742024606923227270")
//   .then((e) => e.json())
//   .then((res) => console.log(res));

const statusPhoto = document.querySelector("#statusPhoto");
const statusApp = document.querySelector("#statusApp");
const statusDesc = document.querySelector("#statusDesc");
const statusMsgs = document.querySelectorAll(".statusMsg");
const fetchData = async () => {
  let data = await fetch(
    "https://api.lanyard.rest/v1/users/742024606923227270"
  );
  let json = await data.json();
  if (!json.success) {
    statusPhoto.src = "";
    statusApp.textContent = "Failed to fetch data";
    statusDesc.textContent = "";
    return;
  }
  let activityData = json.data;
  if (activityData.activities.length === 0) {
    statusPhoto.src = "./assets/question-sign.png";
    statusApp.textContent = "Nothing to see there";
    statusMsgs.forEach((e) => (e.textContent = ""));
  }
  if (activityData.spotify != null) {
    statusPhoto.src = activityData.spotify.album_art_url;
    statusApp.textContent = "Listening on spotify: ";
    statusMsgs[0].textContent = `${activityData.spotify.artist}'s`;
    statusMsgs[1].textContent = activityData.spotify.album;
    statusMsgs[2].textContent = activityData.spotify.song;
    return;
  }
  if (
    activityData.activities.length != 0 &&
    activityData.activities[0].name === "Visual Studio Code"
  ) {
    statusPhoto.src = "./assets/vs-code-icon.png";
    statusApp.textContent = activityData.activities[0].name;
    statusMsgs[0].textContent = activityData.activities[0].state;
    statusMsgs[2].textContent = activityData.activities[0].details;
    let timestamp = activityData.activities[0].timestamps?.start;
    const startTime = new Date(timestamp * 1000);
    const now = new Date();
    const duringTime = new Date(now - startTime);
    statusMsgs[1].textContent = `${
      duringTime.getHours() < 10
        ? "0" + duringTime.getHours()
        : duringTime.getHours()
    }:${
      duringTime.getMinutes() < 10
        ? "0" + duringTime.getMinutes()
        : duringTime.getMinutes()
    }:${
      duringTime.getSeconds() < 10
        ? "0" + duringTime.getSeconds()
        : duringTime.getSeconds()
    }`;
  }
};
setInterval(async () => {
  await fetchData();
}, 1000);
