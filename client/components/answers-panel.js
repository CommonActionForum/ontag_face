import React from 'react'
import styled from 'styled-components'

const Row = styled.tr`
  border-bottom: 1px #ccc solid;
`

const Cell = styled.td`
  vertical-align: top;
  padding: 10px;
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

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
            <Row key={ans.id}>
              <Cell key='header-for-answer'>#{ans.id}</Cell>
              {
                ans.annotations.map(a =>
                  <Cell>
                    {
                      <List>
                        {
                          a.map(target =>
                            <li>{target.exact}</li>
                          )
                        }
                      </List>
                    }
                  </Cell>
                )
              }
            </Row>
          )
        }
      </tbody>
    </table>
  )
}
