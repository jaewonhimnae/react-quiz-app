import React, { Component } from 'react';
import { Input, Button, Progress, Divider } from "antd";
import { level1 } from '../datas';
import { Link } from 'react-router-dom';
import { AudioOutlined } from '@ant-design/icons'

class Level1 extends Component {

    state = {
        value: "",
        timeOut: false,
        round: 0,
        timer: 10,
        randomTense: "",
        wrongAnswer: "",
        wrongAnswers: []
    }


    componentDidMount() {
        this.randomTense()
        this.startTimeOut()
    }

    startTimeOut = () => {
        this.timeout = setTimeout(() => {
            this.setState({ timeOut: true })
        }, 10000)


        this.interval = setInterval(() => {
            this.setState({ timer: this.state.timer - 1 })
        }, 1000)
    }


    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval)
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
        clearInterval(this.interval)
    }


    randomTense = async () => {
        let TenseArray = ['simple', 'past']
        //We need to get one tense between simple and past randomly 
        let randomTense = await TenseArray[Math.floor(Math.random() * TenseArray.length)]
        this.setState({ randomTense: randomTense })
    }

    handleRestart = () => {
        //1. set state  timer : 0
        this.setState({ timer: 10, timeOut: false, wrongAnswer: "" })

        //2. trigger startTimeOut again 
        this.startTimeOut();
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.timeOut) return alert("Please click restart button to keep doing it");

        if (!this.state.value.trim()) return alert("Please Type something first!")

        this.setState({ value: "", wrongAnswer: "" })

        //we need to check if our answer is right or not  
        this.checkMatched()

    }

    checkMatched = () => {

        //we need to check whether our answer was right or not 
        //know Tense for the question 
        (this.state.randomTense === 'simple' ? level1[this.state.round].simple : level1[this.state.round].past)
            === this.state.value ?
            //true 
            this.setState({ round: this.state.round + 1, timer: 10, wrongAnswer: "" }, () => {

                this.randomTense()
                //stop the setTimeout and start new setTimeout,  not for setInterval 
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.setState({ timeOut: true })
                }, 10000)
            })
            :
            //false
            this.setState({
                wrongAnswer: this.state.randomTense === 'simple' ? `${level1[this.state.round].simple}`
                    : `${level1[this.state.round].past}`
            }, () => {
                this.setState({
                    round: this.state.round + 1, timer: 10,
                    wrongAnswers: this.state.wrongAnswers.concat(level1[this.state.round].voca)
                })
                this.randomTense()
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.setState({ timeOut: true })
                }, 10000)
            })
    }

    handleRedirect = () => {
        setTimeout(() => {
            window.location.reload();
        }, 10);
    }

    handleAudio = (event) => {
        event.preventDefault();
        var elm = event.target;
        var audio = document.getElementById('audio');
        var source = document.getElementById('audioSource');
        source.src = elm.getAttribute('data-value')
        audio.load(); //call this to just preload the audio without playing 
        audio.play(); //call this to play the song right away
    }

    render() {
        return (
            <div style={{ padding: '1rem', border: '1px solid grey', borderRadius: '4px', maxWidth: 400, margin: '3rem auto' }}>

                {this.state.round < level1.length ?
                    <>
                        <h1>Vocaburary Game</h1>

                        <Progress percent={this.state.round / level1.length * 100} status="active" />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h2>LEVEL 1</h2>
                            <h2>{this.state.round}/{level1.length}</h2>
                        </div>

                        <span style={{ marginBottom: 0, color: 'grey' }}>Infinitive</span>
                        <h2>{level1[this.state.round].voca}</h2>

                        <div style={{ fontSize: '1rem' }}>
                            Answer the voca`s <span style={{ color: 'red' }}>
                                {this.state.randomTense === 'simple' ? 'simple past' : 'past participle'}
                            </span>
                        </div>


                        <form style={{ padding: '1rem 0' }} onSubmit={this.handleSubmit}>
                            <div style={{ display: 'flex' }}>
                                <Input
                                    name="value"
                                    onChange={this.handleChange}
                                    value={this.state.value}
                                    id="voca"
                                    type="text"
                                />

                                <Button
                                    className
                                    type="submit"
                                    onClick={this.handleSubmit}
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>

                        {/* Timer */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button className={`${this.state.timer <= 8 && 'disabled'}`}>5</Button>
                            <Button className={`${this.state.timer <= 6 && 'disabled'}`}>4</Button>
                            <Button className={`${this.state.timer <= 4 && 'disabled'}`}>3</Button>
                            <Button className={`${this.state.timer <= 2 && 'disabled'}`}>2</Button>
                            <Button className={`${this.state.timer <= 0 && 'disabled'}`}>1</Button>
                            <Button
                                onClick={this.handleRestart}
                                style={{ display: this.state.timeOut ? 'block' : 'none' }}
                            >
                                Click to Restart!
                            </Button>
                        </div>


                        {/* Results */}

                        {this.state.wrongAnswer && (
                            <React.Fragment>
                                <Divider />
                                <h3>Wrong! Correct answer: </h3>
                                <div>
                                    <li style={{ display: 'block' }}>
                                        <p
                                            onClick={this.handleAudio}
                                            data-value={level1[this.state.round - 1] ? level1[this.state.round - 1].mp3 : level1[this.state.round].mp3}
                                        >
                                            <AudioOutlined />   {this.state.wrongAnswer}
                                        </p>
                                    </li>

                                    <audio id="audio" controls style={{ display: 'none' }}>
                                        <source id="audioSource"></source>
                                        Your browser does not support the audio format.
                                    </audio>

                                </div>
                            </React.Fragment>
                        )}
                    </>
                    :
                    <>
                        <h1>Reviews the wrong answers</h1>
                        {this.state.wrongAnswers.map((answer, index) => (
                            <div key={index}>
                                <ul>
                                    <li>
                                        {answer}
                                    </li>

                                </ul>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <Button onClick={this.handleRedirect}>Retry</Button>
                            <Button><Link to="/test2" >Level2</Link></Button>
                        </div>
                    </>
                }
            </div>
        )
    }

}

export default Level1;