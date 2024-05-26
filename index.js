const express = require("express");
// fs 모듈 : 파일 시스템에 접근하는 모듈
const fs = require("fs");
// path 모듈 : 파일 경로를 다루는 모듈
const path = require("path");

const app = express();

const PORT = 4000;

app.get("/", (req, res) => {
  res.json({ message: "server check" });
});

app.get("/sum", (req, res) => {
  // path.join() : 여러 개의 경로를 조합하여 하나의 경로로 만들어주는 메서드
  // __dirname : 현재 파일(index.js)이 위치한 디렉토리 경로
  const filePath = path.join(__dirname, "./data/user.json");
  // fs.readFile() : 파일을 비동기적으로 읽어오는 메서드 (파일 읽기 작업이 백그라운드에서 진행됨)
  // 비동기 작업을 콜백으로 처리 (비동기도 동기처럼 - 읽기 작업이 완료되면 콜백 함수를 실행)
  // "utf8" : 파일을 읽어올 때 인코딩 방식을 지정 (인코딩 방식을 지정하지 않으면 Buffer 객체로 반환)
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("에러 발생", err);
      return res.status(500).json({ error: "서버 에러" });
    }

    try {
      // JSON.parse() : JSON 형식의 문자열을 JavaScript 객체로 변환
      const users = JSON.parse(data);
      // reduce() : 배열의 각 요소에 대해 주어진 콜백 함수를 실행하고 하나의 결과값을 반환
      // || 0 : user.post_count 값이 없을 경우 0으로 초기화 (속성이 없는 경우(undefined) 에러 방지)
      const totalPostCount = users.reduce((sum, user) => sum + (user.post_count || 0), 0);
      res.status(200).json({ sum: totalPostCount });
    } catch (err) {
      console.error("에러 발생", err);
      res.status(500).json({ error: "서버 에러" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버 실행 중`);
});
