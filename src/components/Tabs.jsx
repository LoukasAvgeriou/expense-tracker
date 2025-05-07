import { useState } from "react";
import "../styles/Tabs.css";

export default function Tabs({ tabs }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <div className="tabs-header">
                {tabs.map((tab, index) => (
                    <button
                        className={`tab-button ${activeIndex === index ? "active" : ""}`}
                        key={index}
                        onClick={() => setActiveIndex(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-card">{tabs[activeIndex].content}</div>
        </div >
    );
}
