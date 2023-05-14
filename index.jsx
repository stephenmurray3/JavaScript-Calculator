import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  
  // MULTIPLY/DIVIDE/ADD BY A MINUS ZERO OR MINUS POINT DOESNT WORK AS PLANNED
  // CANT START WITH A MINUS NUMBER
  
  const [display, setDisplay] = React.useState({
    equation: '',
    answer: '0',
    calculated: false
  });
  
  const styles = {
    fontSize: display.answer.length >= 12 ? "1.5rem" : display.answer.length > 8 ? "2rem" : "2.5rem"
  }
  
  const operations = /[-|+|/|*]/;
  const withoutMinus = /[+|/|*]/;
  let lastNum = display.equation.split(operations).pop();

  function handleNumbers(event) {
    
    if (display.calculated && event.match(/[0-9]/)) {
      setDisplay({
        equation: event,
        answer: event,
        calculated: false
      })
    } 
    else if (event === '0' && lastNum === '0') {
      return
    } 
    else if (event === '0' && (lastNum.includes('.') || display.equation === '-')) {
      setDisplay(prevState => ({
        equation: display.equation + event,
        answer: display.answer + event
      }))
    } 
    else if (event === '0' && (display.equation === '' || lastNum === '')) {
      setDisplay(prevState => ({
        equation: display.equation + event,
        answer: event
      }))
    } 
    else if (event.match(/[1-9]/) && (display.answer === '-' && display.equation[display.equation.length - 2].match(operations))) {
      setDisplay(prevState => ({
        equation: display.equation + event,
        answer: display.answer + event
      }))
    } 
    else if (event.match(/[1-9]/) && lastNum === '') {
      setDisplay({
        equation: display.equation + event,
        answer: event
      })
    } 
    else if (event.match(/[1-9]/) && lastNum === '0') {
      setDisplay(prevState => ({
        equation: display.equation.slice(0, display.equation.length - 1) + event,
        answer: event
      }))
    } 
    else {
      setDisplay(prevState => ({
        equation: display.equation + event,
        answer: display.answer + event
      }))
    }
  }
  
  function handleDecimal(event) {
    if (display.calculated) {
      setDisplay({
        equation: '0' + event,
        answer: '0' + event,
        calculated: false
      })
    } 
    else if (lastNum.includes(event)) {
      return
    } 
    else if (display.equation === '') {
      setDisplay(prevState => ({
        equation: '0' + event,
        answer: '0' + event
      }))
    } 
    else if (display.equation === '-') {
      setDisplay(prevState => ({
        equation: display.equation + '0' + event,
        answer: '-' + '0' + event
      }))
    }
    else if (lastNum === '') {
      setDisplay(prevState => ({
        equation: display.equation + '0' + event,
        answer: '0' + event
      }))
    } 
    else {
      setDisplay(prevState => ({
        equation: display.equation + event,
        answer: display.answer + event
      }))
    }
  }
  
  function handleSymbols(event) {
    if (event === '-' && display.equation === '') {
      setDisplay({
        equation: event,
        answer: event,
      })
    } 
    else if ((display.equation === '-' && event.match(withoutMinus)) || event === '-' && display.equation === '-') {
      return
    } 
    else if (display.equation === '') {
      return
    } 
    else if (display.calculated) {
      setDisplay(prevState =>({
        equation: display.answer + event,
        answer: event,
        calculated: false
      }))
    } 
    else if (event === '-' && (display.equation[display.equation.length - 1].match(operations) && !display.equation[display.equation.length - 2].match(operations))) {
      setDisplay(prevState => ({
        equation: display.equation + event,
        answer: event
      }))
    }
    else if (display.equation.length > 2 && (display.equation[display.equation.length - 2].match(operations) && display.equation[display.equation.length - 1].match(operations))) {
      setDisplay(prevState => ({
        equation: display.equation.slice(0, display.equation.length - 2) + event,
        answer: event
      }))
    }
    else if (event.match(operations) && display.equation[display.equation.length - 1].match(operations)) {
      setDisplay(prevState => ({
        equation: display.equation.slice(0, display.equation.length - 1) + event,
        answer: event
      }))
    } 
    else {
      setDisplay(prevState => ({
        equation: display.equation + event,
        answer: event,
        calculated: false
      })) 
    }
  }
  
  function updateCalc(event) {
    if (event.match(/[0-9]/)) {
      handleNumbers(event)
    } else if (event === '.') {
      handleDecimal(event)
    } else if (event.match(operations)) {
      handleSymbols(event)
    }
  }
  
  function backspace() {
    if (display.equation === '') {
      return
    } else if (display.calculated) {
      setDisplay(prevState => ({
        equation: display.equation.slice(0, display.equation.length - 1),
        answer: '',
        calculated: false
      }))
    } else {
      setDisplay(prevState => ({
        equation: display.equation.slice(0, display.equation.length - 1),
        answer: display.answer.slice(0, display.answer.length - 1),
        calculated: false
      })) 
    }
  }
  
  function clear() {
    setDisplay({
      equation: '',
      answer: '0',
      calculated: false
    })
  }
  
  function calculate() {
    let result = (Math.round(eval(display.equation) * 1000000000) / 1000000000).toString()
    // console.log(typeof result)
    if ((display.equation === '' && display.answer === '0') || display.equation === '-' || display.calculated) {
      return
    } else {
      setDisplay(prevState => ({
        equation: display.equation + '=',
        answer: result,
        calculated: true
      }))
    }
  }
  
  return (
    <div id="calculator">
      <div className="window" >
        <div id="equation" >{display.equation}</div>
        <div id="display" style={styles} >{display.answer}</div>
      </div>
      <div id="keypad">
        <div onClick={clear} className="keys other" id="clear" >AC</div>
        <div onClick={backspace} className="keys other" >C</div>
        <div className="keys other" >%</div>
        <div onClick={() => updateCalc("/")} className="keys operators" id="divide" >{`/`}</div>
        <div onClick={() => updateCalc("7")} className="keys numbers" id="seven" >7</div>
        <div onClick={() => updateCalc("8")} className="keys numbers" id="eight" >8</div>
        <div onClick={() => updateCalc("9")} className="keys numbers" id="nine" >9</div>
        <div onClick={() => updateCalc("*")} className="keys operators" id="multiply" >x</div>
        <div onClick={() => updateCalc("4")} className="keys numbers" id="four" >4</div>
        <div onClick={() => updateCalc("5")} className="keys numbers" id="five" >5</div>
        <div onClick={() => updateCalc("6")} className="keys numbers" id="six" >6</div>
        <div onClick={() => updateCalc("-")} className="keys operators" id="subtract" >-</div>
        <div onClick={() => updateCalc("1")} className="keys numbers" id="one" >1</div>
        <div onClick={() => updateCalc("2")} className="keys numbers" id="two" >2</div>
        <div onClick={() => updateCalc("3")} className="keys numbers" id="three" >3</div>
        <div onClick={() => updateCalc("+")} className="keys operators" id="add" >+</div>
        <div onClick={() => updateCalc("0")} className="keys numbers" id="zero" >0</div>
        <div onClick={() => updateCalc(".")} className="keys numbers" id="decimal" >.</div>
        <div onClick={() => calculate()} className="keys operators" id="equals" >=</div>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);