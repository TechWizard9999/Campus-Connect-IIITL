import React, { useState } from 'react';

const InputPopup = ({ isOpen, type, onSave }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(inputValue);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="input-popup">
            <div className="popup-content retro-style">
                {type === 'name' && (
                    <>
                        <h2 className="retro-title">Enter Your Name</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                className="retro-input"
                                type="text"
                                placeholder="Your Name"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <button className="retro-button" type="submit">
                                Enter
                            </button>
                        </form>
                    </>
                )}
                {type === 'details' && (
                    <> <div className="details">
                        <h2 className="retro-title">Welcome, Traveler, to the Metaverse Adventure!</h2>
                        <p className="retro-content ">
                            

                            As you step into our immersive 3D multiplayer world, you're embarking on a thrilling journey like no other. Picture yourself as a brave adventurer, equipped with 20 HSR coins, ready to explore uncharted territories, forge new friendships, and embrace the power of blockchain technology.

                            <h4>Your Metaverse Odyssey</h4>

                            Your adventure starts with 20 HSR coins in your pocket. These coins will be your guide as you navigate this vast and enchanting world. Use them wisely to acquire assets, unique characters, and participate in exciting challenges.

                            
                            <h4>Explore & Socialize</h4>


                            Roam freely through mesmerizing landscapes, where every corner holds secrets waiting to be unveiled. Connect with fellow adventurers through text chats or take your interactions to the next level with video chats. Collaboration is key to unlocking new dimensions of fun.

                            <h4>Blockchain Wonders:</h4>

                            The blockchain technology at the heart of our game empowers you with true ownership of your in-game assets. Buy, sell, and trade items securely, knowing that what you earn is yours to cherish and exchange with other travelers.
                            <h4>Craft Your Challenges:</h4>

                            

                            As a true explorer, you can create challenges for fellow players to conquer. From treasure hunts to mind-bending puzzles, let your creativity shine, and reward successful adventurers with HSR coins.

                            <h4>Begin Your Odyssey</h4>

                            With this glimpse into our Metaverse Adventure, it's time to forge your own path. The horizon is boundless, the mysteries countless. Your journey awaits; make friends, leave your mark, and immerse yourself in this dynamic virtual world.

                            Stay connected with our growing community, as we continue to expand the Metaverse with fresh content and features. As a fellow traveler, your voice matters, and your experiences shape our ever-evolving universe.

                            Prepare to be amazed, adventurer. Your odyssey begins now. Explore, conquer, and enjoy every moment in this mesmerizing 3D multiplayer world. May your travels be unforgettable!

                        </p>
                        <button className="retro-button" onClick={onSave}>
                            Enter
                        </button>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InputPopup;
