import { reset, createSha1FromBlob, changeHeader } from "./functions";
const ws = new WebSocket("ws://localhost:8081");

const container = document.getElementsByClassName("root-container")[0];
const logo = document.getElementsByClassName("logo")[0];
const imageContainer = document.getElementById("images-container");
const button = document.getElementById("hash");

const objectStorage: Record<string, HTMLImageElement> = {};

let headerChanged = false;
let hashState = false;

// Cannot really move this to functions.ts as it's coupled with hashState global state
function configureButton() {
  if (button && button instanceof HTMLElement) {
    button.style.display = "inline-block";
    button.addEventListener("click", () => {
      hashState = !hashState;

      if (hashState) {
        button.innerText = "Hash On";
      } else {
        button.innerText = "Hash Off";
      }
    });
  }
}

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  const { id, image }: { id: Number; image: string } = data;
  let blob = new Blob();
  let messageToSever: { id: Number; hash: string | null } = {
    id,
    hash: null,
  };
  let img = document.createElement("img");

  fetch(image)
    .then((res) => res.blob())
    .then((blobLocal) => {
      img.src = URL.createObjectURL(blobLocal);
      blob = blobLocal;
    })
    .then(() => {
      if (!headerChanged) {
        changeHeader(container, button, logo);
        configureButton();

        headerChanged = true;
      }
    })
    .then(async () => {
      if (!objectStorage[id.toString()]) {
        imageContainer?.appendChild(img);
        objectStorage[id.toString()] = img;
      }

      const hash = await createSha1FromBlob(blob, hashState);
      if (!hash.length) {
        messageToSever.hash = null;
      } else {
        messageToSever.hash = hash;
      }

      ws.send(JSON.stringify(messageToSever));
    });

  console.log("Received message with length:", event.data.length);
});

ws.addEventListener("open", () => {
  console.log("Connected from WebSocket server");
});

ws.addEventListener("close", () => {
  reset(container, button, logo);
  console.log("Disconnected from WebSocket server");
});

ws.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});
