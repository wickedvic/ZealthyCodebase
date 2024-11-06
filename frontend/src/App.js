import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Admin from './components/Admin';
import DataTable from './components/DataTable';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" exact element={<Onboarding/>} />
                    <Route path="/admin" element={<Admin/>} />
                    <Route path="/data" element={<DataTable/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
