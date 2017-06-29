import React from 'react'

const Question = ({ title }) => (
  <header className='jumbotron bg-primary text-white'>
    <p>La pregunta del momento</p>
    <h1>{title}</h1>
  </header>
)

export default Question
