# TTS 대체 음성 파일

LG 스탠바이미처럼 브라우저 TTS가 동작하지 않는 기기에서는 이 폴더의 MP3 파일을 대신 재생합니다.

- 파일 형식: MP3
- 위치: `assets/audio/`
- 파일명: `recording-list.csv`의 `filename` 값과 정확히 같아야 합니다.
- 전체 파일 수: 245개
- 생성 음성: `Microsoft Heami Desktop` 한국어 음성(`ko-KR`)
- 생성 속도: Windows SAPI `Rate = -1`로, 기본 TTS보다 조금 차분한 속도입니다.

주소 끝에 `?audio=1`을 붙이면 브라우저 TTS 대신 MP3 음성 파일을 강제로 사용합니다.

예시:

`https://cideryman.github.io/humanright/?audio=1`

## 생성 메모

처음에는 로컬에 설치된 Kokoro TTS도 확인했지만, 현재 사용한 Kokoro 0.9.4에는 한국어 전용 음성 파이프라인이 없어 한글 발음이 부정확했습니다. 발달장애인 이용자가 듣고 바로 이해해야 하는 교육 자료이므로, 최종 파일은 Windows의 한국어 음성 `Microsoft Heami Desktop`으로 생성했습니다.

## 녹음 목록

전체 문장과 파일명은 `recording-list.csv`를 확인하세요.
