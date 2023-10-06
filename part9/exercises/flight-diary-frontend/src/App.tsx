import { useState, useEffect } from "react";
import { create, getAll } from "./services/diaryService";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import useField from "./useField";
import axios from "axios";

const Notification = ({ message }: { message: string }) => (
  <h2 style={{ color: "red" }}>{message}</h2>
);

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [notification, setNotification] = useState<string>("");

  const visibilities = Object.values(Visibility).map(v => v.toString())
  const weathers = Object.values(Weather).map(v => v.toString())

  const [date, resetDate] = useField("date");
  const [comment, resetComment] = useField("text");
  const [visibility, setVisibility] = useState(visibilities[0]);
  const [weather, setWeather] = useState(weathers[0]);

  useEffect(() => {
    getAll().then((diaries) => setDiaries(diaries));
  }, []);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const diary: NewDiaryEntry = {
      date: date.value,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment: comment.value,
    };

    create(diary)
      .then((newDiary) => {
        setDiaries([...diaries, newDiary]);
        resetDate()
        resetComment()
        setVisibility(visibilities[0])
        setWeather(weathers[0])
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          setNotification(e.response?.data);
        }
      });
  };

  return (
    <div>
      <Notification message={notification} />
      <h1>Add new entry</h1>
      <form onSubmit={handleSubmit}>
        <p>
          date: <input {...date} />
        </p>
        <p>
          visibility: {visibilities.map(v => (
            <><input type="radio" name="visibility" checked={v === visibility} onChange={() => setVisibility(v)} />{v}</>
          ))}
        </p>
        <p>
          weather: {weathers.map(v => (
            <><input type="radio" name="weather" checked={v === weather} onChange={() => setWeather(v)} />{v}</>
          ))}
        </p>
        <p>
          comment: <input {...comment} />
        </p>
        <button type="submit">create</button>
      </form>
      <h1>Diary entries</h1>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            <h2>{diary.date}</h2>
            <p>comment: {diary.comment}</p>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
