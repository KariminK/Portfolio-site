// fetch("https://api.lanyard.rest/v1/users/742024606923227270")
//   .then((e) => e.json())
//   .then((res) => console.log(res));

// const statusPhoto = document.querySelector("#statusPhoto");
// const statusApp = document.querySelector("#statusApp");
// const statusDesc = document.querySelector("#statusDesc");
// const statusMsgs = document.querySelectorAll(".statusMsg");
const whatAmIDoing = document.querySelector(".statuses");
let elements = 0;
class Status {
  constructor(statusPhoto, statusApp, ...statusMessages) {
    this.statusPhotoSrc = statusPhoto;
    this.statusAppTxt = statusApp;
    this.statusMsgs = statusMessages;
  }
  render() {
    // status photo
    const statusPhotoDiv = document.createElement("div");
    statusPhotoDiv.classList.add("statusPhotoDiv");
    const statusPhoto = document.createElement("img");
    statusPhoto.setAttribute("src", this.statusPhotoSrc);
    statusPhotoDiv.appendChild(statusPhoto);

    // status caption
    const captionDiv = document.createElement("div");
    captionDiv.classList.add("caption");
    const statusApp = document.createElement("h3");
    statusApp.classList.add("statusApp");
    statusApp.textContent = this.statusAppTxt;
    captionDiv.appendChild(statusApp);

    // status description
    const statusDescDiv = document.createElement("div");
    statusDescDiv.classList.add("statusDesc");
    this.statusMsgs.forEach((msg) => {
      const statusMsg = document.createElement("p");
      statusMsg.textContent = msg;
      statusMsg.classList.add("statusMsg");
      statusDescDiv.appendChild(statusMsg);
    });
    captionDiv.appendChild(statusDescDiv);

    // status div
    const statusDiv = document.createElement("div");
    statusDiv.classList.add("status");
    statusDiv.appendChild(statusPhotoDiv);
    statusDiv.appendChild(captionDiv);
    whatAmIDoing.appendChild(statusDiv);
  }
}
const fetchData = async () => {
  let data = await fetch(
    "https://api.lanyard.rest/v1/users/742024606923227270"
  );
  let json = await data.json();
  whatAmIDoing.innerHTML = "";
  if (!json.success) {
    // statusPhoto.src = "";
    // statusApp.textContent = "Failed to fetch data";
    // statusDesc.textContent = "";
    return;
  }
  let activityData = json.data;
  const activitiesWithoutSpotify = activityData.activities.filter(
    (e) => e.name != "Spotify"
  );
  console.log(activitiesWithoutSpotify);
  if (activitiesWithoutSpotify.length != 0) {
    activitiesWithoutSpotify.forEach((activity) => {
      let url =
        activity.name === "Visual Studio Code"
          ? "./assets/vs-code-icon.png"
          : "./assets/question-sign.png";
      let timestamp = activity.timestamps?.start;
      const startTime = new Date(timestamp);
      const now = new Date();
      const duringTime = new Date(now - startTime);
      const timeLasted = `${
        duringTime.getHours() < 10
          ? "0" + duringTime.getHours() - 1
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
      const element = new Status(
        url,
        activity.name,
        activity.details,
        activity.state,
        timeLasted
      );
      elements++;
      element.render();
    });
  }
  if (activityData.spotify != null) {
    const element = new Status(
      activityData.spotify.album_art_url,
      "Listening on spotify: ",
      activityData.spotify.artist,
      activityData.spotify.album,
      activityData.spotify.song
    );
    element.render();
    return;
  }
};
setInterval(async () => {
  await fetchData();
}, 1000);
