import { useState, useEffect } from 'react'
import { create, getAll } from './services/diaryService'
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from './types'
import useField from './useField'

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const date = useField('date');
  const visibility = useField('text');
  const weather = useField('text');
  const comment = useField('text');

  useEffect(() => {
    getAll().then(diaries => setDiaries(diaries))
  }, [])

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()

    const diary: NewDiaryEntry = {
      date: date.value,
      visibility: visibility.value as Visibility,
      weather: weather.value as Weather,
      comment: comment.value,
    };

    create(diary).then(newDiary => setDiaries([...diaries, newDiary]))
  }

  return (
    <div>
      <h1>Add new entry</h1>
      <form onSubmit={handleSubmit}>
        <p>date: <input {...date} /></p>
        <p>visibility: <input {...visibility} /></p>
        <p>weather: <input {...weather} /></p>
        <p>comment: <input {...comment} /></p>
        <button type='submit'>create</button>
      </form>
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
