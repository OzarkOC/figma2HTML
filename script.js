"use strict";

// export async function fetchData(figmaId, figmaApiKey) {
//   const requestOptions = {
//     method: "GET",
//     headers: {
//       "X-Figma-Token": figmaApiKey,
//     },
//   };

//   try {
//     const response = await fetch(
//       `https://api.figma.com/v1/files/${figmaId}`,
//       requestOptions
//     );

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error("Error during API call:", error);
//     throw error; // Re-throw the error to be caught by the outer try-catch block
//   }
// }
export async function fetchData(figmaId, figmaApiKey) {
  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${figmaId}`,
      {
        method: "GET",
        headers: {
          "X-Figma-Token": figmaApiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error during API call:", error);
    throw error;
  }
}

export function displayFigmaData(figmaData) {
  console.log("Displaying Figma Data");
  document.addEventListener("DOMContentLoaded", async function () {
    try {
      // Further actions can be performed here after the API call is completed
      console.log(figmaData);
      processData(figmaData);
    } catch (error) {
      console.error("Error during API call:", error);
    }
  });
}
let pages;
let frames = [];
function processData(data) {
  const pages = data.document.children;

  // You can still access individual properties like data.document.children
  for (let i = 0; i < pages[0].children.length; i++) {
    if (pages[0].children[i].type === "FRAME") {
      frames.push(pages[0].children[i]);
    }
  }
  makeFrames();
}

function makeFrames() {
  const homeScreen = findFrameByName("[Home]", ...frames);
  if (!homeScreen) return;
  displayScreen(homeScreen, document.body, "div");
  // display scren
}
function displayScreen(screen, append, typ) {
  //   console.log(screen);
  const frame = document.createElement(typ);
  //   let counterAxis, primaryAxis;
  //   const home = (findFrameByName("[Home]"), screen);
  divSettings(frame, screen);
  append.appendChild(frame);
  // Check for Children
  if (screen.children !== 0) {
    const childFrame = frame;
    const content = screen.children;
    if (!content) return;
    for (let i = 0; i < content.length; i++) {
      //   console.log(`object ${i}: ${screen.children.type}`);
      if (content[i].type === "FRAME") {
        displayScreen(content[i], childFrame, "div");
      } else if (content[i].type === "TEXT") {
        const paragraph = document.createElement("p");
        paragraph.textContent = content[i].characters;
        textSettings(paragraph, content[i]);
        frame.appendChild(paragraph);
      } else if (
        content[i].type === "RECTANGLE" &&
        findFrameByName("[btn]", content[i])
      ) {
        displayScreen(content[i], childFrame, "btn");
      } else if (content[i].type === "RECTANGLE") {
        displayScreen(content[i], childFrame, "div");
      }
    }
  }
}

function findFrameByName(searchTerm, ...frames) {
  // Use Array.prototype.find to search for the frame
  //   console.log(frames);
  return frames.find((frame) => endsWith(frame.name, searchTerm));
}
// Helper function to get the gradient direction
function getGradientDirection(gradientHandlePositions) {
  if (gradientHandlePositions.length >= 3) {
    const start = gradientHandlePositions[0];
    const end = gradientHandlePositions[1]; // Use the second handle, ignoring the last one

    // Calculate the angle in radians
    const angleRadians = Math.atan2(end.y - start.y, end.x - start.x);

    // Convert radians to degrees and normalize to the range [0, 360)
    let angleDegrees = (angleRadians * 180) / Math.PI;
    angleDegrees = (angleDegrees + 360) % 360;
    // console.log(`${angleDegrees}deg`);
    return `${angleDegrees}deg`;
  } else {
    console.error("Insufficient handle positions for gradient calculation.");
    return ""; // or any default value
  }
}

// Helper function to get the gradient stops
function getGradientStops(gradientStops) {
  // Constructing the gradient stops string based on received data
  const stopsString = gradientStops
    .map((stop) => getColorString(stop.color) + ` ${stop.position * 100}%`)
    .join(", ");
  return stopsString;
}

// Helper function to get the color string
function getColorString(color) {
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(
    color.g * 255
  )}, ${Math.round(color.b * 255)}, ${color.a})`;
}
function endsWith(name, searchTerm) {
  // Check if the name ends with the specified searchTerm
  return name.endsWith(searchTerm);
}
function stringOnly(str) {
  // Use a regular expression to match content inside square brackets and replace it with an empty string
  return str.replace(/\[.*?\]/g, "");
}
function attribute(str) {
  const match = str.match(/\[(.*?)\]/); // Use a regular expression to match content inside square brackets
  return match ? match[1] : null; // Return the content inside brackets or null if no match
}

function rgbToInt(value) {
  return Math.ceil(value * 255);
}
function textSettings(text, data) {
  text.id = data.name;
  const { r: txtR, g: txtG, b: txtB, a: txtA } = data.fills[0].color;
  const fill = `rgba(${rgbToInt(txtR)},${rgbToInt(txtG)},${rgbToInt(
    txtB
  )},${rgbToInt(txtA)})`;
  text.style.color = fill;
  if (data.style.fontFamily) text.style.fontFamily = data.style.fontFamily;
  if (data.style.fontSize) text.style.fontSize = `${data.style.fontSize}px`;
  if (data.style.fontWeight) text.style.fontWeight = `${data.style.fontWeight}`;
  if (data.style.letterSpaing)
    text.style.letterSpaing = `${data.style.letterSpaing}px`;
  if (data.style.lineHeight)
    text.style.lineHeight = `${data.style.lineHeight}px`;
  if (data.style.textAlignHorizontal)
    text.style.textAlign = `${data.style.textAlignHorizontal}`;
  if (data.style.textAlignVertical)
    text.style.verticalAlign = `${data.style.textAlignVertical}`;
}

function divSettings(frame, screen) {
  //   if (home !== null) {
  //     frame.id = attribute(screen.name);
  //     console.log(`Here`);
  //   } else frame.id = screen.name;
  frame.id = stringOnly(screen.name);
  frame.style.width = `${screen.absoluteBoundingBox.width}px`;
  frame.style.height = `${screen.absoluteBoundingBox.height}px`;
  // FILL COLORS
  if (screen.fills.length) {
    const [...fills] = screen.fills;
    fills.forEach((fil) => {
      if (fil.type === "SOLID") {
        // console.log(fil);
        const { r: backR, g: backG, b: backB, a: backA } = fil.color;
        const bg = `rgba(${rgbToInt(backR)}, ${rgbToInt(backG)}, ${rgbToInt(
          backB
        )}, ${backA})`;
        frame.style.backgroundColor = bg;
      }
      if (fil.type === "GRADIENT_LINEAR") {
        // console.log(fil);
        const handlePositions = fil.gradientHandlePositions;
        const gradientStops = fil.gradientStops;
        // console.log(handlePositions);
        const linearGradient = `linear-gradient(${getGradientDirection(
          handlePositions
        )}, ${getGradientStops(gradientStops)})`;
        frame.style.background = linearGradient;
      }
      // if (fil.type === "SOLID"){
      //     console.log(fil);
      // }
    });
  }
  if (screen.layoutMode) {
    frame.style.display = "flex";
    if (screen.itemSpacing) {
      frame.style.gap = `${screen.itemSpacing}px`;
    }
    if (screen.layoutMode === "VERTICAL") {
      frame.style.flexDirection = "column";
      if (screen.counterAxisAlignItems) {
        switch (screen.counterAxisAlignItems) {
          case "MAX":
            frame.style.alignItems = "end";
            break;
          default:
            frame.style.alignItems = screen.counterAxisAlignItems;
        }
        if (screen.primaryAxisAlignItems) {
          frame.style.justifyContent = "space-between";
        }
      }
    } else {
      frame.style.justifyContent = screen.counterAxisAlignItems;
      if (screen.primaryAxisAlignItems) {
        switch (screen.primaryAxisAlignItems) {
          case "SPACE_BETWEEN":
            frame.style.alignContent = "space-between";
            break;
          default:
            frame.style.alignContent = screen.primaryAxisAlignItems;
            break;
        }
      }
    }
  }
  // Corner Radius
  frame.style.borderRadius = screen.cornerRadius
    ? `${screen.cornerRadius}px`
    : "";
  // PADDING
  frame.style.paddingLeft = screen.paddingLeft ? `${screen.paddingLeft}px` : "";
  frame.style.paddingBottom = screen.paddingBottom
    ? `${screen.paddingBottom}px`
    : "";
  frame.style.paddingTop = screen.paddingTop ? `${screen.paddingTop}px` : "";
  frame.style.paddingRight = screen.paddingRight
    ? `${screen.paddingRight}px`
    : "";
  //EFFECTS
  if (screen.effects.length) {
    const [...effect] = screen.effects;
    effect.forEach((ef) => {
      //   console.log(ef);
      if (ef.type === "DROP_SHADOW" && ef.visible === true) {
        const { r: dropR, g: dropG, b: dropB, a: dropA } = ef.color;
        const dropShadowColor = `rgba(${rgbToInt(dropR)}, ${rgbToInt(
          dropG
        )}, ${rgbToInt(dropB)}, ${dropA})`;
        frame.style.filter = `drop-shadow(${ef.offset.x}px ${ef.offset.y}px ${ef.radius}px ${dropShadowColor})`;
      }
      if (ef.type === "BACKGROUND_BLUR" && ef.visible === true) {
        frame.style.filter = `blur(${ef.radius}px)`;
      }
    });
  }
  // CREATE BUTTON EVENT LISTNER
  //   if (screen.endsWith("[btn]")){
  //     frame.addEventListener('click',()){

  //     }
  //   }
}
