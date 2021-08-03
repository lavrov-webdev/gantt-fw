import React, { createRef } from "react";
import Draggable from "react-draggable";
import "./App.css";
import getRichWorks from "./functions/getRichWorks";
import works from "./data";

function App() {
  const dataToDraw = getRichWorks(works);
  let dateMarks = [];
  for (let i = 0; i < dataToDraw.totalTime; i++) {
    dateMarks.push(<div data-index={i + 1} className="date-mark"></div>);
  }
  const itemRef = createRef();

  console.log(itemRef);
  return (
    <div className="wrapper">
      <div className="date-marks-wrapper">{dateMarks}</div>
      <div className="items">
        {dataToDraw.works.map((w) => (
          <div className="item-wrapper">
            <div
              className="item-access"
              style={{
                width: `${
                  ((w.lateFinish - w.earlyStart) / dataToDraw.totalTime) * 100
                }%`,
                left: `${(w.earlyStart / dataToDraw.totalTime) * 100}%`,
              }}
            ></div>
            <Draggable
              axis="x"
              bounds={{
                left: 0,
                right:
                  ((w.lateFinish - w.earlyStart - w.time) /
                    dataToDraw.totalTime) *
                  2000,
              }}
            >
              <div
                style={{
                  width: `${(w.time / dataToDraw.totalTime) * 100}%`,
                  left: `${(w.earlyStart / dataToDraw.totalTime) * 100}%`,
                }}
                className={`item ${w.inCritical ? "in-critical" : ""} handle`}
              >
                <span>{w.name}</span>
              </div>
            </Draggable>
          </div>
        ))}
      </div>
      <div className="test"></div>
    </div>
  );
}

export default App;
