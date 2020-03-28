import React from 'react'

export default ({ color='currentColor', strokeWidth=2, width='24', height='24' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
)