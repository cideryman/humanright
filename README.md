# 내가 골라요 - 인권 활동판

발달장애인이 함께 모여 **선택하기, 생활 안전 판단하기, 나를 지키는 말과 함께하는 말**을 연습할 수 있는 정적 웹 활동판입니다.

스마트폰 앱 설치 없이 브라우저에서 실행할 수 있고, PWA를 지원해 모바일 홈 화면에 추가할 수 있습니다.

## 주요 기능

- 내가 골라요: 음식, 옷, 자리, 활동을 단계별로 선택
- 생활 안전: 실생활 상황을 보고 적절한 대처 선택
- 소통 연습: 싫어요, 도와주세요, 기다릴게요, 미안해요, 잘했어요 등 표현 연습
- 그림 카드: 발달장애인이 이해하기 쉬운 큰 이미지 중심 구성
- 읽어주기: 브라우저 음성 합성 기능 활용
- 음성 대체 파일: TTS가 동작하지 않는 기기를 위한 MP3 안내 음성 지원
- 관찰 기록: 선택, 표현, 도움 요청, 존중 연습 횟수 기록
- PWA: 홈 화면 추가 및 기본 캐시 지원

## 실행 방법

이 프로젝트는 빌드 과정이 없는 순수 정적 웹앱입니다.

```text
index.html
styles.css
script.js
manifest.json
service-worker.js
assets/
icons/
```

브라우저에서 `index.html`을 열어 사용할 수 있습니다.

PWA와 서비스 워커를 제대로 테스트하려면 로컬 서버 또는 GitHub Pages 같은 HTTPS 환경에서 실행하는 것을 권장합니다.

## 음성 안내와 라이선스

이 앱은 기본적으로 브라우저의 음성 합성 기능을 사용합니다. 일부 TV 브라우저처럼 TTS가 동작하지 않는 기기를 위해 `assets/audio/` 폴더에 MP3 대체 음성 파일을 함께 제공합니다.

- MP3 대체 음성은 Windows 한국어 TTS 음성인 `Microsoft Heami Desktop(ko-KR)`로 생성했습니다.
- `Microsoft Heami Desktop` 및 관련 음성 합성 엔진의 권리는 Microsoft에 있습니다.
- 본 저장소는 비상업적 교육 및 공익 목적 사용을 전제로 합니다.
- 이 저장소의 MP3 파일은 본 인권교육 활동판 내 접근성 보조 목적으로만 사용됩니다.
- 본 음성 파일의 사용 가능 범위는 Microsoft Windows 및 해당 TTS 기능의 사용 조건을 따릅니다.
- MP3 파일을 별도로 추출하여 다른 서비스, 상품, 콘텐츠에 재사용하거나 재배포하려면 관련 사용 조건을 별도로 확인해야 합니다.
- 외부 기관에서 재배포하거나 상업적으로 활용할 경우, 직접 녹음한 음성 또는 사용 조건이 명확한 TTS 음성으로 교체할 것을 권장합니다.
- 본 저장소의 음성 파일 사용으로 발생하는 문제에 대한 책임은 사용자에게 있습니다.

참고: Microsoft는 Windows에서 사용할 수 있는 한국어 TTS 음성으로 Heami를 안내하고 있습니다. Azure Speech TTS와 Windows 내장 TTS는 사용 조건이 다를 수 있으므로, 동일한 기준을 적용하지 않습니다.

- Microsoft 지원: [지원되는 언어 및 음성](https://support.microsoft.com/ko-kr/windows/%EB%B6%80%EB%A1%9D-a-%EC%A7%80%EC%9B%90%EB%90%98%EB%8A%94-%EC%96%B8%EC%96%B4-%EB%B0%8F-%EC%9D%8C%EC%84%B1-4486e345-7730-53da-fcfe-55cc64300f01)
- Microsoft Learn: [Text to speech overview](https://learn.microsoft.com/en-us/azure/ai-services/Speech-Service/text-to-speech)

## GitHub Pages 배포

정적 파일만으로 동작하므로 GitHub Pages에 바로 배포할 수 있습니다.

1. GitHub 저장소의 Settings로 이동
2. Pages 메뉴 선택
3. Source를 `Deploy from a branch`로 설정
4. Branch를 `main`, folder를 `/root`로 설정
5. 저장 후 배포 URL에서 확인

## 사용 시 유의사항

- 점수 경쟁보다 자기 표현과 참여 경험을 중심으로 사용합니다.
- 말, 손짓, 표정, 카드 선택을 모두 의사표현으로 인정합니다.
- 위험 상황은 구체적 피해 묘사보다 안전한 대처 문장으로 마무리합니다.
- 현장 이용자 특성에 따라 진행자가 문장을 더 쉽게 풀어 설명해 주세요.

## 릴리즈

- `v1.0.0`: 초기 공개 버전
