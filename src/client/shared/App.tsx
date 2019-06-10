import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { AboutPage, BookPage, HomePage } from '../pages';

class App extends Component {
    public render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path="/" component={HomePage}/>
                    <Route path="/authors" component={BookPage}/>
                    {/*<Route path="/books/:id" component={About}/>*/}
                    <Route path="/books" component={BookPage}/>
                </Switch>
            </div>
        );
    }
}

export default App;
