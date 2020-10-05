import React, { useState } from "react";
import update from "immutability-helper";
import math from "mathjs";
import "./App.css";
import Button from "@material-ui/core/Button";
import Buttons from "./components/Buttons";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { buttons1, buttons2 } from "./data";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 10,
    border: 10,
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    margin: 5,
  },
  label: {
    textTransform: "lowercase",
  },
  root1: {
    background: "linear-gradient(45deg, #0022ff 30%, #00fff7 90%)",
    borderRadius: 10,
    border: 20,
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    margin: 5,
  },
  label1: {
    textTransform: "capitalize",
  },
  root2: {
    background: "#000000",
    borderRadius: 10,
    border: 20,
    color: "white",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    margin: 5,
  },
});

function App() {
  const classes = useStyles();

  const [state, setState] = useState({ operations: [] }); ///operations state
  const [fl, setFl] = useState(true);
  const [dstate, setDstate] = useState({ operations: [] }); ///display state
  const [count, setCount] = useState(0);
  const [ans, setAns] = useState(0);
  const [equals, setEquals] = useState(false);
  const regexp = /^[0-9\b]+$/;

  const handleAns = (e) => {
    ///for  ANS key

    if (equals) {
      let counter = count;
      counter = counter + 1;

      setCount(counter);
      let an = ans;

      setState({
        operations: [an],
      });
      setDstate({
        operations: ["ans"],
      });
      setEquals(false);
    } else {
      let an = ans;
      const ansOperations = update(state.operations, {
        $push: [an],
      });
      const ansDoperations = update(dstate.operations, {
        $push: ["ans"],
      });
      setState({
        operations: ansOperations,
      });
      setDstate({
        operations: ansDoperations,
      });
    }
  };

  const calculateOperations = () => {
    ////evaluate
    let result = state.operations.join("");
    if (result) {
      try {
        result = math.eval(result);
        result = math.format(result, { precision: 14 });
        setAns(result);
      } catch (error) {
        result = error;
      }
      result = String(result);

      setState({
        operations: [result],
      });
      setDstate({
        operations: [result],
      });
    }
  };

  //handleclick---------------------------------------------------------------
  const handleClick = (e, val, deg, itri) => {
    console.log(e, val, deg, itri);
    const value =
      deg !== undefined
        ? fl
          ? itri === undefined
            ? val + deg
            : deg + val
          : val
        : val;
    const dvalue = val;

    switch (value) {
      case "clear":
        setState({
          operations: [],
        });
        setDstate({
          operations: [],
        });
        setEquals(false);
        break;

      case "equal":
        setEquals(true);
        calculateOperations(); /////
        break;

      case "delete":
        let strs = state.operations;
        strs.pop();
        setState({
          operations: strs,
        });
        let strd = dstate.operations;
        strd.pop();
        setDstate({
          operations: strd,
        });
        setEquals(false);
        break;

      case "%":
        const newOperation = update(state.operations, {
          $push: [value],
        });
        const newDoperation = update(dstate.operations, {
          $push: ["rem"],
        });
        setState({
          operations: newOperation,
        });
        setDstate({
          operations: newDoperation,
        });
        setEquals(false);
        break;
      default:
        if (
          equals &&
          !(
            value === "+" ||
            value === "-" ||
            value === "*" ||
            value === "/" ||
            value === "^" ||
            value === "%" ||
            value === "^2"
          )
        ) {
          setState({
            operations: [value],
          });
          setDstate({
            operations: [dvalue],
          });
          setEquals(false);
        } else {
          const newOperations = update(state.operations, {
            $push: [value],
          });
          const newDoperations = update(dstate.operations, {
            $push: [dvalue],
          });
          setState({
            operations: newOperations,
          });
          setDstate({
            operations: newDoperations,
          });
          setEquals(false);
        }

        break;
    }
  };

  const handleSwitch = (e) => {
    const fg = fl;
    setFl(!fg);
  };

  ////keyboard input
  const handleNum = (e) => {
    let num = e.key;
    if (num === "Enter") {
      handleClick(e, "equal");
    } else if (regexp.test(num)) {
      handleClick(e, num);
    } else {
      ////////////for other keyboard inputs
      const newOperations = update(state.operations, {
        $push: [num],
      });
      const newDoperations = update(dstate.operations, {
        $push: [num],
      });
      setState({
        operations: newOperations,
      });
      setDstate({
        operations: newDoperations,
      });
      setEquals(false);
    }
  };

  const backSpace = (e) => {
    let num = e.key;
    if (num === "Backspace") {
      handleClick(e, "delete");
    }
  };

  const cursorToInp = (e) => {
    document.getElementById("inp").focus();
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="App" onKeyPress={cursorToInp} onKeyDown={cursorToInp}>
      <input
        id="inp"
        className="Display"
        onKeyPress={handleNum}
        onKeyDown={backSpace}
        autoFocus="autofocus"
        type="tel"
        name="cal"
        value={dstate.operations.join("")}
        readOnly
      />

      <Buttons>
        {buttons1.map((item, id) => {
          return (
            <Button
              key={id}
              className={`.Button ${
                (item.classnames === "cl" &&
                  `${classes.root} ${classes.label}`) ||
                (item.classnames === "cala" &&
                  `${classes.root1} ${classes.label1}`) ||
                (item.classnames === "ca" && `${classes.root1}`) ||
                (item.classnames === "cb" && `${classes.root2}`)
              }`}
              color={item.color}
              variant="contained"
              onClick={(e) =>
                item.type === "ans"
                  ? handleAns(e, `${item.type}`)
                  : handleClick(e, `${item.type}`)
              }
            >
              {item.name}
            </Button>
          );
        })}
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={fl} onChange={handleSwitch} name="checkedA" />
            }
            label="Deg"
          />
        </FormGroup>

        {buttons2.map((item, id) => {
          return (
            <Button
              key={id}
              className={`Button ${classes.root} ${classes.label}`}
              variant="contained"
              color="secondary"
              onClick={(e) => handleClick(e, `${item.type1}`, `${item.type2}`)}
            >
              {item.name}
            </Button>
          );
        })}
        <Button
          onClick={(e) => handleClick(e, "factorial(")}
          className={`.Button ${classes.root} ${classes.label}`}
          variant="contained"
          color="secondary"
        >
          fact(
        </Button>

        <Button
          onClick={(e) => handleClick(e, "delete")}
          className={`.Button ${classes.root1}`}
          variant="contained"
          color="secondary"
        >
          DEL
        </Button>
      </Buttons>
    </div>
  );
}

export default App;
