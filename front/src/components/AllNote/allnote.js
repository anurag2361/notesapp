import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class AllNote extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            postText: '',
            postArray: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const id = window.location.pathname.split("/")[1];
        let pArray = [];
        axios.get("/user/" + id + "/allnotes").then(response => {
            console.log(response);
            for (let i = 0; i < response.data.length; i++) {
                pArray.push(response.data[i]);
            }
            this.setState({ postArray: pArray });
        }).catch(err => {
            console.log(err);
        });
    }

    handleChange(event) {
        const state = this.state;
        state[event.target.name] = event.target.value;
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();
        const { title, postText } = this.state;
        const id = window.location.pathname.split("/")[1];
        axios.post("/user/" + id + "/createnote", { title, postText })
            .then(response => {
                console.log(response);
                window.location.reload();
            }).catch(error => {
                console.log(error);
            });
    }

    render() {
        const { title, postText } = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <p>Enter title</p>
                    <input type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange} />
                    <p>Enter Post text</p>
                    <input type="text" id="postText" name="postText" value={this.state.postText} onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form>
                <ul>
                    {this.state.postArray.map((item, index) => {
                        return <li key={index}>{item.title}</li>;
                    })}
                </ul>
            </div>
        )
    }

}

withRouter(AllNote);
export default AllNote;