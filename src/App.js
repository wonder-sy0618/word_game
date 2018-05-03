import React, { Component } from 'react';
import queryString from "query-string"
import './App.css';

import questions from "./questions"

const Configure = {
    itemScore : 10,
    resultTimeout : 1500,
};

const Scoreboard = (props) => (
  <div className="Scoreboard" >
    答题：{props.index}/{props.question.length}
    &nbsp;&nbsp;
    得分：{props.score}
  </div>
);

const Stage = (props) => (
  <div className="Stage" >
    <img src={props.question[props.index].image} alt="The image is not found!" />
  </div>
);

const WordOption = (props) => {
  let that = this;
  let options = [];
  props.question[props.index].options
    .forEach(opt => options.push(
      <li
        key={"option_"+opt}
        onClick={props.onSelectQuestionOption}
        style={{
          color : (props.resultTimeoutHandler && opt == props.question[props.index].answer  ? "#ff6262" : "")
        }}
      >{opt}</li>
    ))
  return (
    <div className="WordOption" >
      <h3>左边黑板上画的是什么？</h3>
      <ul className="Options" >
        {options}
      </ul>
    </div>
  )
};


class App extends Component {
  constructor(props) {
    super(props);
    var rand = (min, max) => {return Math.floor(Math.random()*(max-min)+min);};
    this.state = {
        unit : queryString.parse(window.location.search).unit ? queryString.parse(window.location.search).unit : Object.keys(questions)[rand(0, Object.keys(questions).length)],
        index : 0,
        score : 0,
        questionRight : false,
        resultTimeoutHandler : undefined,
    };
  }
  componentDidMount() {
    this.setState({
      question : questions[this.state.unit]
    })
  }
  render() {
    let that = this;
    if (!this.state.question) {
      return <div></div>
    } else {
      let gameBox = (
          <div className="GameBox" >
            <Scoreboard {...this.state} ></Scoreboard>
            <div className="GamePanel" >
              <Stage {...this.state} ></Stage>
              <WordOption
                {...this.state}
                onSelectQuestionOption={((e) => {
                    if (that.state.resultTimeoutHandler) {
                      return false;
                    }
                    let opt = e.target.innerHTML;
                    let nextHandler = () => {
                      that.setState({
                        index : that.state.index + 1,
                        resultTimeoutHandler : undefined
                      })
                    };
                    if (that.state.question[that.state.index].answer == opt) {
                      that.setState({
                        score : that.state.score + Configure.itemScore,
                        questionRight : true,
                        resultTimeoutHandler : window.setTimeout(nextHandler, Configure.resultTimeout)
                      })
                    } else {
                      that.setState({
                        questionRight : false,
                        resultTimeoutHandler : window.setTimeout(nextHandler, Configure.resultTimeout)
                      })
                    }

                }).bind(this)}
              ></WordOption>
              <img className="QuestionResult"
                src={that.state.questionRight ? require("./res/theme/right.png") : require("./res/theme/wrong.png") }
                style={{display : (that.state.resultTimeoutHandler ? "block" : "none") }}
              ></img>
            </div>
          </div>
      );
      let resultBox = (
          <div className="GameBox" >
            <div className="GameResult" >
              答题结果：<br/><br/>
              答题：{that.state.question.length}<br/>
              正确：{that.state.score / Configure.itemScore}<br/>
              总分：{that.state.score}<br/><br/>
              <a href="#" onClick={(() => {window.location.href = window.location.href;}).bind(this)} >再来一次</a>
            </div>
          </div>
      );
      return (
        <div className="App" style={{height: window.innerHeight}} >
          <div className="AppInner" >
            {this.state.index < this.state.question.length ? gameBox : resultBox }
          </div>
        </div>
      );
    }
  }
}

export default App;
