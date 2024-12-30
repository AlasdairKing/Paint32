"use strict";

var brushColour = "black";

const PAINT_MODE_PAINTBRUSH = "paintbrush";
const PAINT_MODE_ERASER = "erase";
const PAINT_MODE_FILL = "fill";
const PAINT_MODE_DROPPER = "dropper";

const CANVAS_WIDTH = 32;
const CANVAS_HEIGHT = 32;

var mode = PAINT_MODE_PAINTBRUSH;

function Mode(what) {
  mode = what;
}

function LoadCanvas() {
  var table = document.getElementById("canvas");
  var i, j;
  var tr;
  var td;

  for (i = 0; i < CANVAS_WIDTH; i += 1) {
    tr = document.createElement("tr");
    for (j = 0; j < CANVAS_HEIGHT; j += 1) {
      td = document.createElement("td");
      td.id = i + "," + j;
      td.innerHTML = "&nbsp;";
      /*td.onclick = function(e) {
				console.log(e.srcElement);
				var id = e.srcElement.id;
				var td = document.getElementById(id);
				td.style.backgroundColor = brushColour;
			};*/
      td.className = "pixel";
      td.onpointermove = function (e) {
        console.log("pointermove " + e.srcElement.id);
        console.log("coord" + e.clientX);
        var td = document.elementFromPoint(e.clientX, e.clientY);
        if (td.className === "pixel") {
          if (e.buttons === 1) {
            switch (mode) {
              case PAINT_MODE_PAINTBRUSH:
                td.style.backgroundColor = brushColour;
                td.style.opacity = "100";
                break;
              case PAINT_MODE_ERASER:
                td.style.backgroundColor = "";
                //e.srcElement.style.opacity = "0";
                break;
            }
          }
        }
      };
      td.onclick = function (e) {
        //console.log(e.buttons);
        if (e.buttons !== 0) {
          return;
        }

        switch (mode) {
          case PAINT_MODE_FILL:
            Fill(e.srcElement);
            break;
          case PAINT_MODE_PAINTBRUSH:
            e.srcElement.style.backgroundColor = brushColour;
            e.srcElement.style.opacity = "100";
            break;
          case PAINT_MODE_ERASER:
            e.srcElement.style.backgroundColor = brushColour;
            break;
          case PAINT_MODE_DROPPER:
            brushColour = e.srcElement.style.backgroundColor;
            document.getElementById("paintcolor").style.backgroundColor =
              brushColour;
            console.log("Dropper: " & brushColour);
            Mode(PAINT_MODE_PAINTBRUSH);
            document.getElementById("paintbrushtool").checked = true;
            break;
        }
      };
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function SetColour(td) {
  brushColour = td.style.backgroundColor;
  if (mode === "erase") {
    document.getElementById("paintbrushtool").checked = true;
    Mode("paintbrush");
  }
  document.getElementById("paintcolor").style.backgroundColor = brushColour;
}

function New() {
  var table = document.getElementById("canvas");
  while (table.childElementCount > 0) {
    table.removeChild(table.childNodes[0]);
  }
  LoadCanvas();
}

function Save() {
  var canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  var ctx = canvas.getContext("2d");
  var i, j, colour;
  for (i = 0; i < CANVAS_WIDTH; i += 1) {
    for (j = 0; j < CANVAS_HEIGHT; j += 1) {
      colour = document.getElementById(i + "," + j).style.backgroundColor;
      if (colour !== "") {
        console.log(colour);
        ctx.fillStyle = colour;
        ctx.fillRect(j, i, 1, 1);
      }
    }
  }
  var image = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.href = image;
  link.download = document.getElementById("picturename").value + ".png";
  link.click();
}

// We know nothing about this square.
const NOT_CHECKED_YET = 0;
// When we are done, this will be filled. We also have to work out its neighbours.
const FILL_THIS_NOT_CHECKED_YET = 1;
// When we are done, this will be filled. We have worked out its neighbours.
const FILL_THIS_AND_CHECKED = 2;
// When we are done, this will not be filled. We have worked out its neighbours.
const DO_NOT_FILL_THIS_AND_CHECKED = 3;

function Fill(td) {
  // The colour we are filling.
  var targetColour = td.style.backgroundColor;
  //console.log("target colour: [" + targetColour + "]");

  // Create new fill status array.
  var tdsToCheck = [];
  for (i = 0; i < CANVAS_WIDTH; i += 1) {
    tdsToCheck.push([]);
    for (j = 0; j < CANVAS_HEIGHT; j += 1) {
      tdsToCheck[i].push(NOT_CHECKED_YET);
    }
  }

  // Note that td should be filled.
  var i = td.id.split(",")[0];
  var j = td.id.split(",")[1];
  tdsToCheck[i][j] = FILL_THIS_NOT_CHECKED_YET;

  // Now do a "bubblesort"
  var filled = true;
  while (filled) {
    filled = false;
    for (i = 0; i < CANVAS_WIDTH; i += 1) {
      for (j = 0; j < CANVAS_HEIGHT; j += 1) {
        if (tdsToCheck[i][j] === FILL_THIS_NOT_CHECKED_YET) {
          //console.log("Checking " + i + "," + j + " currently [" + document.getElementById((i) + "," + j).style.backgroundColor + "]");
          // Don't check this cell again.
          tdsToCheck[i][j] === FILL_THIS_AND_CHECKED;
          // This one is filled. Check neighbours.
          if (i > 0) {
            //console.log("Checking " + (i-1) + "," + j);
            if (tdsToCheck[i - 1][j] === NOT_CHECKED_YET) {
              if (
                document.getElementById(i - 1 + "," + j).style
                  .backgroundColor === targetColour
              ) {
                // Fill it!
                tdsToCheck[i - 1][j] = FILL_THIS_NOT_CHECKED_YET;
                filled = true;
              } else {
                // Nope, note done.
                tdsToCheck[i - 1][j] = DO_NOT_FILL_THIS_AND_CHECKED;
              }
            }
          }
          if (j > 0) {
            if (tdsToCheck[i][j - 1] === NOT_CHECKED_YET) {
              if (
                document.getElementById(i + "," + (j - 1)).style
                  .backgroundColor === targetColour
              ) {
                // Fill it!
                tdsToCheck[i][j - 1] = FILL_THIS_NOT_CHECKED_YET;
                filled = true;
              } else {
                // Nope, note done.
                tdsToCheck[i][j - 1] = DO_NOT_FILL_THIS_AND_CHECKED;
              }
            }
          }
          if (i < CANVAS_WIDTH - 1) {
            if (tdsToCheck[i + 1][j] === NOT_CHECKED_YET) {
              if (
                document.getElementById(i + 1 + "," + j).style
                  .backgroundColor === targetColour
              ) {
                // Fill it!
                tdsToCheck[i + 1][j] = FILL_THIS_NOT_CHECKED_YET;
                filled = true;
              } else {
                // Nope, note done.
                tdsToCheck[i + 1][j] = DO_NOT_FILL_THIS_AND_CHECKED;
              }
            }
          }
          if (j < CANVAS_HEIGHT - 1) {
            if (tdsToCheck[i][j + 1] === NOT_CHECKED_YET) {
              if (
                document.getElementById(i + "," + (j + 1)).style
                  .backgroundColor === targetColour
              ) {
                // Fill it!
                tdsToCheck[i][j + 1] = FILL_THIS_NOT_CHECKED_YET;
                filled = true;
              } else {
                // Nope, note done.
                tdsToCheck[i][j + 1] = DO_NOT_FILL_THIS_AND_CHECKED;
              }
            }
          }
        }
      }
    }
  }
  // Now fill
  for (i = 0; i < CANVAS_WIDTH; i += 1) {
    for (j = 0; j < CANVAS_HEIGHT; j += 1) {
      if (tdsToCheck[i][j] === 1) {
        console.log("Filling " + i + "," + j);
        console.log(
          "  was " + document.getElementById(i + "," + j).style.backgroundColor
        );
        document.getElementById(i + "," + j).style.backgroundColor =
          brushColour;
        document.getElementById(i + "," + j).style.opacity = "100";
        console.log(
          "  now " + document.getElementById(i + "," + j).style.backgroundColor
        );
      }
    }
  }
}

function CheckPictureName(e) {
  //console.log(e.value);
  document.getElementById("savebutton").disabled = e.value.length === 0;
}
