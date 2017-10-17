import React from 'react'

export default function AnswersPanel ({ answers, tags }) {
  const sortedAnswers = answers
    .map(ans => ({
      id: ans.id,
      annotations: tags.map(tag => ans
        .annotations
        .filter(a => a.tag_id === tag.id)
        .map(a => a.target)
      )
    }))

  return (
    <table>
      <thead>
        <tr>
          <th key='k0'></th>
          {
            tags.map(t => <th key={t.id}>{ t.title }</th>)
          }
        </tr>
      </thead>
      <tbody>
        {
          sortedAnswers.map(ans =>
            <tr key={ans.id}>
              <td key='header-for-answer'>#{ans.id}</td>
              {
                ans.annotations.map(a =>
                  <td>
                    {
                      <ul>
                        {
                          a.map(target =>
                            <li>{target.exact}</li>
                          )
                        }
                      </ul>
                    }
                  </td>
                )
              }
            </tr>
          )
        }
      </tbody>
    </table>
  )
}
