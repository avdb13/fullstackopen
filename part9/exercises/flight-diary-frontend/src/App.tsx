import { useState, useEffect } from 'react'
import { getAll } from './services/diaryService'
import { DiaryEntry } from './types'

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    getAll().then(diaries => setDiaries(diaries))
  }, [])

  if (diaries.length === 0) {
    return <div>loading ...</div>
  }
  console.log(diaries)

  return (
    <div>
      <h1>Diary entries</h1>
      <ul>
        {diaries.map(diary => (
          <li key={diary.id}>
            <h2>{diary.date}</h2>
            <p>comment: {diary.comment}</p>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
