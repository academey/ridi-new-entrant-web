import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { About, Book, Home } from '../pages';

class App extends Component {
    public render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path="/" component={Home}/>
                    {/*<Route path="/books/:id" component={About}/>*/}
                    <Route path="/books" component={Book}/>
                </Switch>
            </div>
        );
    }
}

export default App;
