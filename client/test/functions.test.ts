import { reset, createSha1FromBlob, changeHeader } from "../functions";

describe("reset", () => {
  it("should reset the container, button, and logo", async () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    const logo = document.createElement("img");

    await reset(container, button, logo);

    expect(container.style.justifyContent).toBe("center");
    expect(container.style.alignItems).toBe("center");
    expect(container.style.height).toBe("100vh");
    expect(container.style.marginBottom).toBe("");

    expect(button.style.display).toBe("none");

    expect(logo.style.width).toBe("20%");
  });
});

describe("changeHeader", () => {
  it("should change the header", async () => {
    const container = document.createElement("div");
    const button = document.createElement("button");
    const logo = document.createElement("img");

    await changeHeader(container, button, logo);

    expect(container.style.justifyContent).toBe("flex-start");
    expect(container.style.alignItems).toBe("center");
    expect(container.style.height).toBe("auto");
    expect(container.style.marginBottom).toBe("1.5em");

    expect(logo.style.width).toBe("6%");
  });
});

// Hmm we can polyfill the digest function but that won't be fully testing the functionality
// this test fails due to jsdom env not having the crpyto api as it get undefined on digest

// describe("createSha1FromBlob", () => {
//   it("should create a SHA1 hash from the given blob", async () => {
//     const blob = new Blob(["test"], { type: "text/plain" });
//     const hashState = true;

//     const result = await createSha1FromBlob(blob, hashState);

//     expect(result).toBe(
//       ""
//     );
//   });
// });
