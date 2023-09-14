import "./App.css";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { storage } from "./firebase";

function App() {
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrls, setAudioUrls] = useState([]);

  const audioListRef = ref(storage, "audio/"); // Đổi tên thư mục nếu cần

  useEffect(() => {
    // Khởi tạo recorder khi component được mount
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setAudioRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            const blob = new Blob([event.data], { type: "audio/wav" });
            setAudioFile(blob);
          }
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone: ", error);
      });
  }, []);

  const startRecording = () => {
    if (audioRecorder) {
      audioRecorder.start();
    }
  };

  const stopRecordingAndUpload = () => {
    if (audioRecorder && audioRecorder.state === "recording") {
      audioRecorder.stop();
    }
  };

  const uploadAudioFile = () => {
    if (audioFile == null) return;
    const audioFileName = `recording_${Date.now()}.wav`;
    const audioRef = ref(audioListRef, audioFileName);
    const uploadTask = uploadBytesResumable(audioRef, audioFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Đang upload, bạn có thể cập nhật tiến trình tại đây nếu cần
      },
      (error) => {
        // Xử lý lỗi upload nếu có
        console.error("Error uploading audio: ", error);
      },
      () => {
        // Upload hoàn thành, lấy URL của audio
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setAudioUrls((prev) => [...prev, url]);
        });
      }
    );
  };

  useEffect(() => {
    listAll(audioListRef)
      .then((response) => {
        return Promise.all(
          response.items.map((item) => {
            return getDownloadURL(item);
          })
        );
      })
      .then((urls) => {
        setAudioUrls(urls);
      })
      .catch((error) => {
        console.error("Error getting audio URLs: ", error);
      });
  }, []);

  return (
    <div className="App">
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecordingAndUpload}>Stop Recording and Upload</button>
      <button onClick={uploadAudioFile}>Upload Audio</button>
      {audioUrls.map((url, index) => {
        return (
          <div key={index}>
            <audio controls src={url}></audio>
            <p>{url}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
