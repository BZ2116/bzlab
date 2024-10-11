import React from 'react';
import './styles/style.css';
import Navbar from './components/Navbar';
import About from './components/About';
import Education from './components/Education';
import Research from './components/Research';
import Competitions from './components/Competitions';
const App = () => {
    return (
        <div>
            <Navbar />
            <About />
            <Education />
            <Research />
            <Competitions />
        </div>
    );
};

export default App;
