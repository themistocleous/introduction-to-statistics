// src/themeSwitcher.js

import React, { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            className="px-4 py-2 rounded"
            onClick={toggleTheme}
        >
            {theme === 'light' ? '🌘' : '🌔'}
        </button>
    );
};

export default ThemeSwitcher;