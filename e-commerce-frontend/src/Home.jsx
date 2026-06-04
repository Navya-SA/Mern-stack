import './Home.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from "./Navbar";
function Home({username}) {
    const [listText, setListText] = useState('Users List');
    return (
        <div className="home-page">
            <Navbar />
        <div className="bck-home">
            
                <h1 className="home-title">Welcome Home {username}</h1>
                <p className="home-text">This is the home page of the Online Shopping Store.</p>
                <div className="home-menu-container">
                        <nav className="home-nav-wrapper">
                                <ul className="home-nav">
                                        <li><Link to="/profile">Profile Settings</Link></li>
                                        <li><Link to="/product">Product List</Link></li>
                                        
                                </ul>
                        </nav>
                </div>
        </div>

        </div>
    )
}

export default Home
