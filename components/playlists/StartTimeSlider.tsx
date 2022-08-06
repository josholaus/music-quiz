import React from 'react'

interface StartTimeSliderProps {
    setStartTime: (startTime: number) => void
    min: number
    max: number
    value: number
}

export default function StartTimeSlider(props: StartTimeSliderProps) {
    return (
        <div className="flex space-x-2">
            <p>Start time:</p>
            <input
                id="time"
                type="range"
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={(event) => props.setStartTime(parseInt(event.target.value))}
            />
            <label htmlFor="time">{props.value} seconds</label>
        </div>
    )
}
