import React, { useState } from 'react';


function Sidebar() { // Change the component name to Sidebar
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="App">
            <div className={`menu-container ${isMenuOpen ? 'open' : ''}`}>
                <div className="menu-arrow" onClick={toggleMenu}>
                    {isMenuOpen ? '◀' : '▶'}
                </div>
                <div className="menu">
                    <ul>
                        <li>Menu Item 1</li>
                        <li>Menu Item 2</li>
                        <li>Menu Item 3</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar; // Update the export statement to export Sidebar
