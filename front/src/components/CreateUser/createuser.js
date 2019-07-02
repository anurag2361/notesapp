import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class CreateUser extends Component {
    constructor() {
        super();
        this.state = {
            name: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // const state = this.state;
        // state[event.target.name] = event.target.value;
        let updatedName = event.target.value;
        this.setState({ name: updatedName });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { name } = this.state;
        axios.post('/user/createuser', { name })
            .then((response) => {
                console.log(this.props);
                this.props.history.push('/' + response.data._id + '/allnotes');
            }).catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { name } = this.state;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <p>Enter your name:</p>
                        <input type="text" id="name" name="name" value={this.state.name} onChange={this.handleChange} title="Full Name" />
                        <input type="submit" value="Submit"></input>
                    </div>
                </form>
            </div>
        )
    }
}

withRouter(CreateUser);
export default CreateUser;