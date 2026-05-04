# TTS 대체 음성 파일

LG TV처럼 브라우저 TTS가 동작하지 않는 기기에서는 이 폴더의 mp3 파일을 대신 재생합니다.

- 파일 형식: mp3 권장
- 위치: `assets/audio/`
- 파일명: `recording-list.csv`의 `filename`과 정확히 같게 저장
- 기존 TTS가 되는 기기에서는 mp3가 없어도 기존 TTS가 그대로 동작합니다.
- LG TV에서 음성 파일 재생을 강제로 쓰고 싶으면 주소 끝에 `?audio=1`을 붙여 실행하세요.

예: `https://cideryman.github.io/humanright/?audio=1`

## 녹음 목록

전체 목록은 `recording-list.csv`를 보세요. 현재 필요한 문장 수: 236개
