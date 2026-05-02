const stage = document.querySelector("#stage");
const focusWord = document.querySelector("#focusWord");
const feedback = document.createElement("div");
const celebration = document.querySelector("#celebration");
const expressionModal = document.querySelector("#expressionModal");
const logModal = document.querySelector("#logModal");
const logList = document.querySelector("#logList");
const facilitator = document.querySelector(".facilitator");
const acceptExpressionButton = document.querySelector("#acceptExpression");
const prevCardButton = document.querySelector("#prevCard");
const nextCardButton = document.querySelector("#nextCard");
feedback.className = "feedback";

const counts = {
  choice: 0,
  expression: 0,
  help: 0,
  respect: 0,
  practice: 0,
};

const state = {
  activity: "home",
  mode: "story",
  index: 0,
  bellTaps: 0,
  choiceCategory: null,
  choiceSubcategory: null,
  choiceFlow: null,
  choiceSelections: {},
  scoredAnswers: {
    safety: {},
    shield: {},
    helpPractice: {},
  },
  safetyAnswer: null,
};

const records = [];
let interactionLocked = false;
let autoAdvanceTimer = null;

function lockInteraction(duration = 600) {
  interactionLocked = true;
  stage.classList.add("is-locked");
  window.setTimeout(() => {
    interactionLocked = false;
    stage.classList.remove("is-locked");
  }, duration);
}

const choiceCategories = [
  {
    key: "food",
    title: "음식",
    text: "먹고 싶은 것을 골라요",
    options: [
      { key: "bibimbap", title: "비빔밥", speak: "비빔밥을 골랐어요." },
      { key: "ramen", title: "라면", speak: "라면을 골랐어요." },
      { key: "udon", title: "우동", speak: "우동을 골랐어요." },
      { key: "kimbap", title: "김밥", speak: "김밥을 골랐어요." },
      { key: "friedRice", title: "볶음밥", speak: "볶음밥을 골랐어요." },
      { key: "curryRice", title: "카레라이스", speak: "카레라이스를 골랐어요." },
      { key: "porkCutlet", title: "돈가스", speak: "돈가스를 골랐어요." },
      { key: "soupRice", title: "국밥", speak: "국밥을 골랐어요." },
    ],
  },
  {
    key: "clothes",
    title: "옷",
    text: "옷의 디자인을 골라요",
    options: [
      {
        key: "tshirt",
        title: "반팔 티",
        speak: "반팔 티 디자인을 골라요.",
        options: [
          { key: "tshirtGreen", title: "초록 반팔", speak: "초록 반팔 티를 골랐어요." },
          { key: "tshirtBlue", title: "파란 반팔", speak: "파란 반팔 티를 골랐어요." },
          { key: "tshirtStripe", title: "줄무늬 반팔", speak: "줄무늬 반팔 티를 골랐어요." },
          { key: "tshirtStar", title: "별무늬 반팔", speak: "별무늬 반팔 티를 골랐어요." },
        ],
      },
      {
        key: "jumper",
        title: "잠바",
        speak: "잠바 디자인을 골라요.",
        options: [
          { key: "jumperBlue", title: "파란 잠바", speak: "파란 잠바를 골랐어요." },
          { key: "jumperZip", title: "지퍼 잠바", speak: "지퍼 잠바를 골랐어요." },
          { key: "jumperPocket", title: "주머니 잠바", speak: "주머니 잠바를 골랐어요." },
          { key: "jumperWarm", title: "따뜻한 잠바", speak: "따뜻한 잠바를 골랐어요." },
        ],
      },
      {
        key: "tracksuit",
        title: "츄리닝",
        speak: "츄리닝 디자인을 골라요.",
        options: [
          { key: "tracksuitGreen", title: "초록 츄리닝", speak: "초록 츄리닝을 골랐어요." },
          { key: "tracksuitBlue", title: "파란 츄리닝", speak: "파란 츄리닝을 골랐어요." },
          { key: "tracksuitLine", title: "줄무늬 츄리닝", speak: "줄무늬 츄리닝을 골랐어요." },
          { key: "tracksuitSet", title: "상하의 세트", speak: "상하의 세트를 골랐어요." },
        ],
      },
      {
        key: "vest",
        title: "조끼",
        speak: "조끼 디자인을 골라요.",
        options: [
          { key: "vestBlue", title: "파란 조끼", speak: "파란 조끼를 골랐어요." },
          { key: "vestPocket", title: "주머니 조끼", speak: "주머니 조끼를 골랐어요." },
          { key: "vestWarm", title: "따뜻한 조끼", speak: "따뜻한 조끼를 골랐어요." },
          { key: "vestZip", title: "지퍼 조끼", speak: "지퍼 조끼를 골랐어요." },
        ],
      },
      {
        key: "hoodie",
        title: "후드티",
        speak: "후드티 디자인을 골라요.",
        options: [
          { key: "hoodieGreen", title: "초록 후드티", speak: "초록 후드티를 골랐어요." },
          { key: "hoodieBlue", title: "파란 후드티", speak: "파란 후드티를 골랐어요." },
          { key: "hoodiePocket", title: "주머니 후드티", speak: "주머니 후드티를 골랐어요." },
          { key: "hoodieLine", title: "끈 있는 후드티", speak: "끈 있는 후드티를 골랐어요." },
        ],
      },
      {
        key: "pants",
        title: "바지",
        speak: "바지 디자인을 골라요.",
        options: [
          { key: "jeans", title: "청바지", speak: "청바지를 골랐어요." },
          { key: "shorts", title: "반바지", speak: "반바지를 골랐어요." },
          { key: "cargoPants", title: "카고바지", speak: "카고바지를 골랐어요." },
          { key: "slacks", title: "정장바지", speak: "정장바지를 골랐어요." },
        ],
      },
    ],
  },
  {
    key: "seat",
    title: "자리",
    text: "앉고 싶은 곳을 골라요",
    options: [
      { key: "chair", title: "의자", speak: "의자를 골랐어요." },
      { key: "sofa", title: "소파", speak: "소파를 골랐어요." },
      { key: "mat", title: "매트", speak: "매트를 골랐어요." },
      { key: "desk", title: "책상 자리", speak: "책상 자리를 골랐어요." },
      { key: "seatAlone", title: "혼자 앉을래요", speak: "혼자 앉을래요." },
      { key: "seatFriend", title: "친구와 앉을래요", speak: "친구와 앉을래요." },
      { key: "seatWindow", title: "창가에 앉을래요", speak: "창가에 앉을래요." },
      { key: "seatHelper", title: "선생님 가까이 앉을래요", speak: "선생님 가까이 앉을래요." },
    ],
  },
  {
    key: "activity",
    title: "활동",
    text: "하고 싶은 활동을 골라요",
    note: "공동 시간과 개인 선택 시간을 구분해요. 수업 시간에는 함께 정한 활동을 하고, 선택 시간에는 내가 고를 수 있어요.",
    options: [
      { key: "drawing", title: "그림을 그릴래요", phrase: "그림 그리기", topic: "그림 그리기는", speak: "그림을 그릴래요." },
      { key: "music", title: "음악을 들을래요", phrase: "음악 듣기", topic: "음악 듣기는", speak: "음악을 들을래요." },
      { key: "walk", title: "산책을 할래요", phrase: "산책", topic: "산책은", speak: "산책을 할래요." },
      { key: "game", title: "놀고 싶어요", phrase: "놀이", topic: "놀이는", speak: "놀고 싶어요." },
      { key: "computer", title: "컴퓨터 할래요", phrase: "컴퓨터", topic: "컴퓨터는", speak: "컴퓨터 할래요." },
      { key: "badminton", title: "배드민턴 할래요", phrase: "배드민턴", topic: "배드민턴은", speak: "배드민턴 할래요." },
      { key: "dance", title: "춤을 출래요", phrase: "춤추기", topic: "춤추기는", speak: "춤을 출래요." },
      { key: "puzzle", title: "퍼즐 맞출래요", phrase: "퍼즐 맞추기", topic: "퍼즐 맞추기는", speak: "퍼즐 맞출래요." },
    ],
  },
];

const mainMenus = [
  { key: "food", title: "음식 고르기", prompt: "먹고 마실 것을 골라요.", activity: "choice", choiceEntry: "food", focus: "선택" },
  { key: "clothes", title: "옷 고르기", prompt: "입을 옷을 골라요.", activity: "choice", choiceEntry: "clothes", focus: "선택" },
  { key: "seat", title: "자리 고르기", prompt: "앉을 자리를 골라요.", activity: "choice", choiceEntry: "seat", focus: "선택" },
  { key: "activity", title: "활동 고르기", prompt: "하고 싶은 활동을 골라요.", activity: "choice", choiceEntry: "activity", focus: "선택" },
  { key: "safety", title: "생활 안전", prompt: "안전한 행동을 골라요.", activity: "safety", focus: "안전" },
  { key: "shield", title: "소통 연습", prompt: "필요한 말과 함께하는 말을 골라요.", activity: "shield", focus: "소통" },
];

const foodFlowSteps = [
  {
    key: "meal",
    title: "음식 고르기",
    prompt: "먹고 싶은 음식을 골라요.",
    resultLabel: "음식",
    options: choiceCategories.find((category) => category.key === "food").options,
  },
  {
    key: "drink",
    title: "음료수 고르기",
    prompt: "마시고 싶은 것을 골라요.",
    resultLabel: "음료수",
    options: [
      { key: "water", title: "물", speak: "물을 골랐어요." },
      { key: "juice", title: "주스", speak: "주스를 골랐어요." },
      { key: "milk", title: "우유", speak: "우유를 골랐어요." },
      { key: "tea", title: "차", speak: "차를 골랐어요." },
      { key: "coffee", title: "커피", speak: "커피를 골랐어요." },
      { key: "cola", title: "콜라", speak: "콜라를 골랐어요." },
      { key: "sportsDrink", title: "이온음료", speak: "이온음료를 골랐어요." },
      { key: "soyMilk", title: "두유", speak: "두유를 골랐어요." },
    ],
  },
  {
    key: "snack",
    title: "간식 고르기",
    prompt: "먹고 싶은 간식을 골라요.",
    resultLabel: "간식",
    options: [
      { key: "fruit", title: "과일", speak: "과일을 골랐어요." },
      { key: "cookie", title: "과자", speak: "과자를 골랐어요." },
      { key: "bread", title: "빵", speak: "빵을 골랐어요." },
      { key: "yogurt", title: "요구르트", speak: "요구르트를 골랐어요." },
      { key: "cakeSnack", title: "케이크", speak: "케이크를 골랐어요." },
      { key: "iceCream", title: "아이스크림", speak: "아이스크림을 골랐어요." },
    ],
  },
];

const clothesFlowSteps = [
  {
    key: "pants",
    title: "바지 고르기",
    prompt: "입고 싶은 바지를 골라요.",
    resultLabel: "바지",
    options: choiceCategories.find((category) => category.key === "clothes").options.find((option) => option.key === "pants").options,
  },
  {
    key: "tshirt",
    title: "반팔티 고르기",
    prompt: "입고 싶은 반팔티를 골라요.",
    resultLabel: "반팔티",
    options: choiceCategories.find((category) => category.key === "clothes").options.find((option) => option.key === "tshirt").options,
  },
  {
    key: "jumper",
    title: "잠바 고르기",
    prompt: "잠바를 입을지 골라요.",
    resultLabel: "잠바",
    options: [
      ...choiceCategories.find((category) => category.key === "clothes").options.find((option) => option.key === "jumper").options,
      { key: "noWear", title: "안 입을래요", speak: "잠바는 안 입을래요.", skip: true },
    ],
  },
  {
    key: "tracksuit",
    title: "츄리닝 고르기",
    prompt: "츄리닝을 입을지 골라요.",
    resultLabel: "츄리닝",
    options: [
      ...choiceCategories.find((category) => category.key === "clothes").options.find((option) => option.key === "tracksuit").options,
      { key: "noWear", title: "안 입을래요", speak: "츄리닝은 안 입을래요.", skip: true },
    ],
  },
  {
    key: "vest",
    title: "조끼 고르기",
    prompt: "조끼를 입을지 골라요.",
    resultLabel: "조끼",
    options: [
      ...choiceCategories.find((category) => category.key === "clothes").options.find((option) => option.key === "vest").options,
      { key: "noWear", title: "안 입을래요", speak: "조끼는 안 입을래요.", skip: true },
    ],
  },
  {
    key: "hoodie",
    title: "후드티 고르기",
    prompt: "후드티를 입을지 골라요.",
    resultLabel: "후드티",
    options: [
      ...choiceCategories.find((category) => category.key === "clothes").options.find((option) => option.key === "hoodie").options,
      { key: "noWear", title: "안 입을래요", speak: "후드티는 안 입을래요.", skip: true },
    ],
  },
  {
    key: "shoes",
    title: "신발 고르기",
    prompt: "신고 싶은 신발을 골라요.",
    resultLabel: "신발",
    options: [
      { key: "slippers", title: "슬리퍼", speak: "슬리퍼를 골랐어요." },
      { key: "sneakers", title: "운동화", speak: "운동화를 골랐어요." },
      { key: "dressShoes", title: "구두", speak: "구두를 골랐어요." },
    ],
  },
];

const activityParticipationOptions = [
  {
    key: "activityAlone",
    imageKey: "successHappy",
    title: "혼자 해볼래요",
    speak: "혼자 해볼래요.",
    sentence: "혼자 해볼래요",
  },
  {
    key: "joinTogether",
    imageKey: "joinTogether",
    title: "같이 할래요",
    speak: "같이 할래요.",
    sentence: "같이 하고 싶어요",
  },
  {
    key: "helpedParticipation",
    imageKey: "helpedParticipation",
    title: "도움받아 할래요",
    speak: "도움받아 할래요.",
    sentence: "도움을 받으면 할 수 있어요",
  },
  {
    key: "restReturn",
    imageKey: "restReturn",
    title: "쉬었다가 할래요",
    speak: "쉬었다가 할래요.",
    sentence: "쉬었다가 다시 할래요",
  },
];

function getActivityFlowSteps() {
  const activity = state.choiceFlow?.picks?.[0];
  const activityTopic = activity?.topic || "이 활동은";
  return [
    {
      key: "activity",
      title: "활동 고르기",
      prompt: "하고 싶은 활동을 골라요.",
      resultLabel: "활동",
      note: choiceCategories.find((category) => category.key === "activity").note,
      options: choiceCategories.find((category) => category.key === "activity").options,
    },
    {
      key: "participation",
      title: "참여 방법 고르기",
      prompt: `${activityTopic} 어떻게 할까요?`,
      resultLabel: "참여 방법",
      options: activityParticipationOptions.map((option) => ({
        ...option,
        speak: activity ? `${activity.topic || activity.title} ${option.sentence}.` : option.speak,
      })),
    },
  ];
}

const safetyScenes = [
  {
    key: "permission",
    imageKey: "safe",
    title: "친구 물건",
    visual: "친구의 물건을 쓰고 싶어요.",
    story: "친구의 물건이 좋아 보여요. 쓰고 싶을 때 어떻게 하면 좋을까요?",
    question: "친구 물건을 쓰고 싶을 때 어떻게 말할까요?",
    answerText: "좋은 방법: 친구 물건은 먼저 물어봐요.",
    answers: [
      { text: "제가 이거 써 봐도 될까요?", kind: "respect", correct: true },
      { text: "묻지 않고 쓴다", kind: "danger", correct: false },
      { text: "몰래 가져간다", kind: "danger", correct: false },
    ],
  },
  {
    key: "friendTeasing",
    imageKey: "friendTeasing",
    title: "불편한 장난",
    visual: "친구의 장난이나 말 때문에 마음이 불편해요.",
    story: "친구의 장난이나 말 때문에 마음이 불편해요. 이럴 때 어떻게 하면 좋을까요?",
    question: "싫은 장난이나 불편한 말이 있으면 어떻게 할까요?",
    answerText: "좋은 방법: 불편하면 말하거나 도움을 요청해요.",
    answers: [
      { text: "상대에게 하지 말라고 말해요", kind: "help", correct: true },
      { text: "선생님에게 말해요", kind: "help", correct: true },
      { text: "가족에게 말해요", kind: "help", correct: true },
      { text: "혼자 참아요", kind: "danger", correct: false },
    ],
  },
  {
    key: "lostStreet",
    imageKey: "lostStreet",
    title: "길을 잃었어요",
    visual: "길을 잃어서 어디로 가야 할지 모르겠어요.",
    story: "길을 잃거나 무서운 일이 생겼어요. 이럴 때 어떻게 하면 좋을까요?",
    question: "도움이 필요할 때 어떤 말을 할까요?",
    answerText: "좋은 방법: 안전한 곳에서 도와주세요라고 말하거나 경찰관, 경찰서에 물어봐요.",
    answers: [
      { text: "도와주세요", kind: "help", correct: true },
      { text: "경찰관이나 경찰서에 물어봐요", kind: "help", correct: true },
      { text: "그냥 뛰어가요", kind: "danger", correct: false },
      { text: "아무에게나 따라가요", kind: "danger", correct: false },
    ],
  },
  {
    key: "strangerCaution",
    title: "모르는 사람",
    imageKey: "strangerCaution",
    visual: "모르는 사람이 밖으로 같이 가자고 해요.",
    story: "모르는 사람이 밖으로 같이 가자고 해요. 이럴 때 어떻게 하면 좋을까요?",
    question: "모르는 사람이 같이 가자고 하면 어떻게 할까요?",
    answerText: "좋은 방법: 따라가지 않고 선생님이나 가족에게 말해요.",
    answers: [
      { text: "선생님에게 말해요", kind: "help", correct: true },
      { text: "따라가지 않아요", kind: "safe", correct: true },
      { text: "그냥 따라가요", kind: "danger", correct: false },
    ],
  },
  {
    key: "photoTaking",
    title: "사진 찍기",
    visual: "누군가 내 사진을 찍으려고 해요.",
    story: "누군가 내 사진을 찍으려고 해요. 싫을 때 어떻게 하면 좋을까요?",
    question: "사진을 찍기 싫으면 어떻게 말할까요?",
    answerText: "좋은 방법: 싫으면 찍지 말라고 말하고 선생님에게 알려요.",
    answers: [
      { text: "찍지 마세요", kind: "help", correct: true },
      { text: "선생님에게 말해요", kind: "help", correct: true },
      { text: "싫어도 참아요", kind: "danger", correct: false },
    ],
  },
  {
    key: "trafficSafety",
    imageKey: "trafficSafety",
    title: "횡단보도",
    visual: "길을 건너야 해요. 차가 다니는 길이에요.",
    story: "길을 건너야 해요. 차가 다니는 길에서는 신호와 차를 잘 봐야 해요.",
    question: "길을 건널 때 어떻게 할까요?",
    answerText: "좋은 방법: 횡단보도에서 멈추고 신호와 차를 보고 건너요.",
    answers: [
      { text: "초록불에 건너요", kind: "safe", correct: true },
      { text: "차가 오는지 보고 건너요", kind: "safe", correct: true },
      { text: "빨간불에 건너요", kind: "danger", correct: false },
    ],
  },
  {
    key: "evacuation",
    imageKey: "evacuation",
    title: "긴급 대피",
    visual: "불이 나거나 비상벨이 울릴 수 있어요.",
    story: "불이 나거나 비상벨이 울리면 안전한 곳으로 나가야 해요.",
    question: "비상 상황에는 어떻게 할까요?",
    answerText: "좋은 방법: 선생님 안내를 듣고 비상구로 천천히 나가요.",
    answers: [
      { text: "선생님 안내를 따라가요", kind: "safe", correct: true },
      { text: "비상구로 나가요", kind: "safe", correct: true },
      { text: "혼자 숨어요", kind: "danger", correct: false },
      { text: "물건을 찾으러 돌아가요", kind: "danger", correct: false },
    ],
  },
  {
    key: "medicineSafety",
    imageKey: "medicineSafety",
    title: "약 확인",
    visual: "약을 먹어야 할 때가 있어요.",
    story: "약을 먹어야 할 때는 내 약이 맞는지 먼저 확인해야 해요.",
    question: "약을 먹기 전 어떻게 할까요?",
    answerText: "좋은 방법: 선생님이나 보호자에게 내 약인지 확인하고 먹어요.",
    answers: [
      { text: "내 약인지 확인해요", kind: "safe", correct: true },
      { text: "선생님에게 물어봐요", kind: "help", correct: true },
      { text: "친구 약을 먹어요", kind: "danger", correct: false },
    ],
  },
  {
    key: "moneySafety",
    imageKey: "moneySafety",
    title: "돈을 달라고 해요",
    visual: "누군가 돈을 달라고 하거나 빌려 달라고 해요.",
    story: "누군가 돈을 달라고 하거나 빌려 달라고 해요. 바로 주면 곤란할 수 있어요.",
    question: "돈을 달라고 하면 어떻게 할까요?",
    answerText: "좋은 방법: 바로 주지 않고 선생님이나 가족에게 말해요.",
    answers: [
      { text: "선생님에게 말해요", kind: "help", correct: true },
      { text: "가족에게 말해요", kind: "help", correct: true },
      { text: "바로 돈을 줘요", kind: "danger", correct: false },
    ],
  },
  {
    key: "phonePrivacy",
    imageKey: "privacyInfo",
    title: "휴대폰 메시지",
    visual: "휴대폰으로 이름, 사진, 전화번호, 복지카드 사진, 주민등록번호를 보내 달라는 메시지가 왔어요.",
    story: "휴대폰으로 이름, 사진, 전화번호, 복지카드 사진, 주민등록번호를 보내 달라는 메시지가 왔어요. 개인정보는 조심해야 해요.",
    question: "개인정보를 보내 달라고 하면 어떻게 할까요?",
    answerText: "좋은 방법: 바로 보내지 않고 선생님이나 가족에게 물어보고, 모르는 메시지는 삭제해요.",
    answers: [
      { text: "선생님에게 보여줘요", kind: "help", correct: true },
      { text: "가족에게 물어봐요", kind: "help", correct: true },
      { text: "메시지를 삭제해요", kind: "safe", correct: true },
      { text: "바로 보내요", kind: "danger", correct: false },
    ],
  },
  {
    key: "helpFriendSafety",
    imageKey: "helpFriendSafety",
    title: "친구 도와주기",
    visual: "친구가 물건을 떨어뜨렸어요.",
    story: "친구가 무거운 물건을 들다가 떨어뜨렸어요. 나도 친구를 도울 수 있어요.",
    question: "친구를 도울 때 어떻게 할까요?",
    answerText: "좋은 방법: 먼저 도와줄까 물어보고, 친구가 괜찮다고 하면 같이 주워요.",
    answers: [
      { text: "도와줄까? 물어봐요", kind: "respect", correct: true },
      { text: "같이 주워요", kind: "help", correct: true },
      { text: "그냥 지나가요", kind: "danger", correct: false },
    ],
  },
  {
    key: "bathroomPrivacy",
    imageKey: "bathroomPrivacy",
    title: "화장실 문 닫기",
    visual: "화장실을 사용할 때는 내 몸을 지켜요.",
    story: "화장실을 사용할 때는 내 몸이 보이지 않도록 문을 닫아요. 내 몸은 소중해요.",
    question: "화장실을 사용할 때 어떻게 할까요?",
    answerText: "좋은 방법: 화장실 문을 닫고, 도움이 필요하면 선생님께 말해요.",
    answers: [
      { text: "문을 닫아요", kind: "safe", correct: true },
      { text: "필요하면 선생님께 말해요", kind: "help", correct: true },
      { text: "문을 열어 둬요", kind: "danger", correct: false },
    ],
  },
];

const shieldScenes = [
  {
    key: "personalItem",
    title: "내 물건",
    easy: "안 돼요.",
    text: "누군가 내 물건을 말없이 가져가려고 해요.",
    question: "내 물건을 쓰고 싶으면 어떻게 해야 할까요?",
    answerText: "좋은 방법: 내 물건은 안 된다고 말해요. 필요하면 선생님께 말해요.",
    answers: [
      { text: "안 돼요", correct: true },
      { text: "그냥 지켜봐요", correct: false },
    ],
  },
  {
    key: "bodyBoundary",
    imageKey: "bodyTouch",
    title: "내 몸",
    easy: "싫어요.",
    text: "누군가 가까이 와서 불편해요.",
    question: "불편할 때 어떤 말을 할 수 있을까요?",
    answerText: "좋은 방법: 싫어요, 하지 마세요, 도와주세요라고 말해요.",
    answers: [
      { text: "싫어요", correct: true },
      { text: "하지 마세요", correct: true },
      { text: "도와주세요", correct: true },
      { text: "그냥 참아요", correct: false },
    ],
  },
  {
    key: "photoTaking",
    title: "내 사진",
    easy: "찍지 마세요.",
    text: "누군가 내 사진을 찍으려고 해서 싫어요.",
    question: "사진을 찍기 싫을 때 어떤 말을 할까요?",
    answerText: "좋은 방법: 찍지 마세요라고 말하고 선생님께 말해요.",
    answers: [
      { text: "찍지 마세요", correct: true },
      { text: "싫어요", correct: true },
      { text: "선생님께 말할래요", correct: true },
      { text: "그냥 참아요", correct: false },
    ],
  },
  {
    key: "likeChoice",
    imageKey: "likeChoice",
    title: "좋은 마음",
    easy: "좋아요.",
    text: "마음에 드는 것이 있어요.",
    question: "좋을 때 어떻게 말할까요?",
    answerText: "좋은 방법: 저는 이게 좋아요라고 말해요.",
    answers: [
      { text: "저는 이게 좋아요", correct: true },
      { text: "아무 말 안 해요", correct: false },
    ],
  },
  {
    key: "dislikeChoice",
    imageKey: "dislikeChoice",
    title: "싫은 마음",
    easy: "싫어요.",
    text: "하기 싫거나 마음에 들지 않는 일이 있어요.",
    question: "싫을 때 어떻게 말할까요?",
    answerText: "좋은 방법: 저는 이건 싫어요라고 말해요.",
    answers: [
      { text: "저는 이건 싫어요", correct: true },
      { text: "억지로 참아요", correct: false },
    ],
  },
  {
    key: "repeatPlease",
    imageKey: "repeatPlease",
    title: "다시 듣기",
    easy: "다시 말해 주세요.",
    text: "설명을 잘 못 들었어요.",
    question: "다시 듣고 싶을 때 어떻게 말할까요?",
    answerText: "좋은 방법: 다시 말해 주세요라고 말해요.",
    answers: [
      { text: "다시 말해 주세요", correct: true },
      { text: "모르는 척해요", correct: false },
    ],
  },
  {
    key: "speakSlowly",
    imageKey: "speakSlowly",
    title: "천천히 듣기",
    easy: "천천히 말해 주세요.",
    text: "말이 너무 빨라서 이해하기 어려워요.",
    question: "천천히 듣고 싶을 때 어떻게 말할까요?",
    answerText: "좋은 방법: 천천히 말해 주세요라고 말해요.",
    answers: [
      { text: "천천히 말해 주세요", correct: true },
      { text: "그냥 고개만 끄덕여요", correct: false },
    ],
  },
  {
    key: "notUnderstand",
    imageKey: "notUnderstand",
    title: "모르겠어요",
    easy: "잘 모르겠어요.",
    text: "무엇을 해야 하는지 잘 모르겠어요.",
    question: "잘 모를 때 어떻게 말할까요?",
    answerText: "좋은 방법: 잘 모르겠어요라고 말하고 도움을 받아요.",
    answers: [
      { text: "잘 모르겠어요", correct: true },
      { text: "아는 척해요", correct: false },
    ],
  },
  {
    key: "respect",
    title: "친구의 말",
    easy: "멈출게요.",
    text: "친구가 싫다고 말했어요.",
    question: "친구가 싫다고 하면 어떻게 해야 할까요?",
    answerText: "좋은 방법: 친구가 싫다고 하면 멈추고 알겠다고 말해요.",
    answers: [
      { text: "알겠어", correct: true },
      { text: "멈출게요", correct: true },
      { text: "계속 말해요", correct: false },
    ],
  },
  {
    key: "turnTakingSpeech",
    group: "함께하는 말",
    title: "차례 지키기",
    easy: "기다릴게요.",
    text: "친구 차례예요. 나는 조금 기다려야 해요.",
    question: "친구 차례일 때 어떻게 말할까요?",
    answerText: "좋은 방법: 내 차례를 기다리거나 먼저 해도 되는지 물어봐요.",
    answers: [
      { text: "기다릴게요", correct: true },
      { text: "먼저 해도 될까요?", correct: true },
      { text: "세치기", correct: false },
    ],
  },
  {
    key: "waitTurnSpeech",
    group: "함께하는 말",
    title: "잠깐 기다리기",
    easy: "잠깐 기다릴게요.",
    text: "지금은 바로 할 수 없어요. 잠깐 기다려요.",
    question: "바로 할 수 없을 때 어떤 말을 할까요?",
    answerText: "좋은 방법: 잠깐 기다릴게요, 끝나면 할래요라고 말해요.",
    answers: [
      { text: "잠깐 기다릴게요", correct: true },
      { text: "끝나면 할래요", correct: true },
      { text: "밀고 들어가요", correct: false },
    ],
  },
  {
    key: "apologySpeech",
    group: "함께하는 말",
    title: "미안한 마음",
    easy: "미안해요.",
    text: "친구와 살짝 부딪혔어요.",
    question: "실수했을 때 어떤 말을 할까요?",
    answerText: "좋은 방법: 미안해요라고 말하고 친구가 괜찮은지 물어봐요.",
    answers: [
      { text: "미안해요", correct: true },
      { text: "괜찮아요?", correct: true },
      { text: "네가 잘못했어", correct: false },
    ],
  },
  {
    key: "praiseSpeech",
    group: "함께하는 말",
    title: "칭찬하기",
    easy: "잘했어요.",
    text: "친구가 활동을 열심히 했어요.",
    question: "친구에게 어떤 말을 해 줄까요?",
    answerText: "좋은 방법: 잘했어요, 멋져요라고 말하며 친구를 존중해요.",
    answers: [
      { text: "잘했어요", correct: true },
      { text: "멋져요", correct: true },
      { text: "못했어요", correct: false },
    ],
  },
];

function person(x, y, shirt = "shirt-a") {
  return `
    <circle class="skin" cx="${x}" cy="${y}" r="17"></circle>
    <path class="hair" d="M${x - 18} ${y - 2}c3-19 31-21 36 0-5-8-25-8-36 0z"></path>
    <path class="${shirt}" d="M${x - 30} ${y + 62}c3-28 15-42 30-42s27 14 30 42z"></path>
    <path class="line" d="M${x - 18} ${y + 30}l-22 18M${x + 18} ${y + 30}l22 18"></path>
    <path class="line" d="M${x - 7} ${y + 2}c5 5 10 5 15 0"></path>
  `;
}

function pictogram(type) {
  const base = (body, extraClass = "") => `
    <svg class="pictogram ${extraClass}" viewBox="0 0 260 190" aria-hidden="true">
      <rect class="pic-bg" x="10" y="10" width="240" height="170" rx="16"></rect>
      ${body}
    </svg>
  `;

  const bowl = (fill, contents, steam = "") =>
    base(`
      ${steam}
      <ellipse class="pic-white" cx="130" cy="105" rx="82" ry="34"></ellipse>
      <path class="${fill}" d="M50 105c8 58 152 58 160 0z"></path>
      <path class="pic-line" d="M48 105c0-22 164-22 164 0M50 105c8 58 152 58 160 0"></path>
      ${contents}
      <path class="pic-line" d="M66 152h128"></path>
    `);

  const shirt = (fill, detail = "") =>
    base(`
      <path class="${fill}" d="M72 52l34-24h48l34 24 34 40-38 21-14-24v68H90V89l-14 24-38-21z"></path>
      ${detail}
      <path class="pic-line" d="M72 52l34-24h48l34 24 34 40-38 21-14-24v68H90V89l-14 24-38-21zM106 28c10 20 38 20 48 0"></path>
    `);

  const jacket = (fill, detail = "") =>
    base(`
      <path class="${fill}" d="M70 50l40-22h40l40 22 24 110h-62l-22-82-22 82H46z"></path>
      ${detail}
      <path class="pic-line" d="M70 50l40-22h40l40 22 24 110h-62l-22-82-22 82H46zM130 52v106M108 28l22 24 22-24"></path>
    `);

  const hoodie = (fill, detail = "") =>
    base(`
      <path class="${fill}" d="M84 70c0-42 92-42 92 0l34 33-36 26v34H86v-34l-36-26z"></path>
      ${detail}
      <path class="pic-line" d="M84 70c0-42 92-42 92 0M86 70v93h88V70M86 129l-36-26 34-33M174 129l36-26-34-33"></path>
    `);

  const vest = (fill, detail = "") =>
    base(`
      <path class="${fill}" d="M86 42l34-16h20l34 16 20 116h-50l-14-78-14 78H66z"></path>
      <path class="pic-bg" d="M106 44c6 22 42 22 48 0l-24 38z"></path>
      ${detail}
      <path class="pic-line" d="M86 42l34-16h20l34 16 20 116h-50l-14-78-14 78H66zM130 82v76M106 44c6 22 42 22 48 0"></path>
    `);

  const pants = (fill, detail = "") =>
    base(`
      <path class="${fill}" d="M86 30h88l18 132h-50l-12-74-12 74H68z"></path>
      ${detail}
      <path class="pic-line" d="M86 30h88l18 132h-50l-12-74-12 74H68zM86 60h88M130 60v28"></path>
    `);

  const cards = {
    meal: base(`
      <circle class="pic-white" cx="105" cy="100" r="42"></circle>
      <path class="pic-line" d="M63 100c0-24 84-24 84 0s-84 24-84 0M58 144h144"></path>
      <path class="pic-warm" d="M166 68h48v68h-48z"></path>
      <path class="pic-line" d="M166 68h48v68h-48M178 82h24M178 100h24M178 118h24"></path>
    `),
    bibimbap: bowl(
      "pic-warm",
      `<path class="pic-green" d="M82 88h34v34H82z"></path>
       <path class="pic-blue" d="M118 78h26v48h-26z"></path>
       <path class="pic-danger" d="M150 86h34v36h-34z"></path>
       <circle class="pic-yellow" cx="130" cy="101" r="17"></circle>
       <path class="pic-line" d="M82 88h34M118 78v48M150 86h34"></path>`,
    ),
    ramen: bowl(
      "pic-danger",
      `<path class="pic-line" d="M82 92c14-16 26 14 40 0s26 14 40 0 26 14 40 0"></path>`,
      `<path class="pic-line" d="M92 44c-16 18 16 22 0 40M130 38c-16 18 16 22 0 40M168 44c-16 18 16 22 0 40"></path>`,
    ),
    udon: bowl(
      "pic-blue",
      `<path class="pic-line thick" d="M78 92c18-10 32 10 50 0s32 10 50 0M84 113h92"></path>
       <circle class="pic-white" cx="180" cy="86" r="12"></circle>`,
    ),
    kimbap: base(`
      <circle class="pic-white" cx="78" cy="102" r="34"></circle>
      <circle class="pic-white" cx="130" cy="102" r="34"></circle>
      <circle class="pic-white" cx="182" cy="102" r="34"></circle>
      <path class="pic-green" d="M60 102a18 18 0 1 0 36 0 18 18 0 0 0-36 0M112 102a18 18 0 1 0 36 0 18 18 0 0 0-36 0M164 102a18 18 0 1 0 36 0 18 18 0 0 0-36 0"></path>
      <path class="pic-yellow" d="M72 92h14v20H72zM124 92h14v20h-14zM176 92h14v20h-14z"></path>
      <path class="pic-line" d="M78 68a34 34 0 1 0 0 68 34 34 0 0 0 0-68M130 68a34 34 0 1 0 0 68 34 34 0 0 0 0-68M182 68a34 34 0 1 0 0 68 34 34 0 0 0 0-68"></path>
    `),
    friedRice: bowl(
      "pic-warm",
      `<circle class="pic-yellow" cx="100" cy="96" r="10"></circle>
       <circle class="pic-green" cx="132" cy="88" r="10"></circle>
       <circle class="pic-danger" cx="160" cy="104" r="9"></circle>
       <path class="pic-line" d="M88 116c18-10 62-10 84 0"></path>`,
    ),
    curryRice: bowl(
      "pic-yellow",
      `<path class="pic-white" d="M82 88c18-18 58-18 76 0v34H82z"></path>
       <circle class="pic-warm" cx="164" cy="96" r="13"></circle>
       <path class="pic-line" d="M82 88c18-18 58-18 76 0M98 108h46"></path>`,
    ),
    porkCutlet: base(`
      <ellipse class="pic-white" cx="130" cy="112" rx="78" ry="38"></ellipse>
      <path class="pic-warm" d="M72 98c20-30 92-34 116-2-8 34-96 40-116 2z"></path>
      <path class="pic-line" d="M52 142h156M72 98c20-30 92-34 116-2-8 34-96 40-116 2zM92 104h78M98 122h62"></path>
      <path class="pic-green" d="M178 92h24v24h-24z"></path>
    `),
    soupRice: bowl(
      "pic-blue",
      `<circle class="pic-white" cx="106" cy="98" r="16"></circle>
       <circle class="pic-white" cx="140" cy="104" r="12"></circle>
       <path class="pic-line" d="M82 86c14 10 76 10 96 0M96 124h70"></path>`,
      `<path class="pic-line" d="M96 48c-12 16 12 20 0 36M132 42c-12 16 12 20 0 36M168 48c-12 16 12 20 0 36"></path>`,
    ),
    clothes: base(`
      ${shirt("pic-green").match(/<rect[\s\S]*?<\/rect>([\s\S]*)<\/svg>/)?.[1] || ""}
    `),
    tshirtPlain: shirt("pic-green"),
    tshirtGreen: shirt("pic-green"),
    tshirtBlue: shirt("pic-blue"),
    tshirtStripe: shirt("pic-white", `<path class="pic-line" d="M92 92h76M92 116h76M92 140h76"></path>`),
    tshirtStar: shirt("pic-warm", `<path class="pic-line" d="M130 76l9 20 22 2-17 14 6 22-20-12-20 12 6-22-17-14 22-2z"></path>`),
    jumper: jacket("pic-blue"),
    jumperBlue: jacket("pic-blue"),
    jumperZip: jacket("pic-blue", `<path class="pic-line" d="M121 68h18M121 88h18M121 108h18M121 128h18"></path>`),
    jumperPocket: jacket("pic-blue", `<path class="pic-line" d="M88 112h30v30H88zM142 112h30v30h-30z"></path>`),
    jumperWarm: jacket("pic-warm", `<path class="pic-white" d="M102 30c12 26 44 26 56 0l18 28c-20 18-72 18-92 0z"></path>`),
    tracksuit: base(`
      <path class="pic-green" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14z"></path>
      <path class="pic-blue" d="M160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
      <path class="pic-line" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14zM160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
    `),
    tracksuitGreen: base(`
      <path class="pic-green" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14z"></path>
      <path class="pic-green" d="M160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
      <path class="pic-line" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14zM160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
    `),
    tracksuitBlue: base(`
      <path class="pic-blue" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14z"></path>
      <path class="pic-blue" d="M160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
      <path class="pic-line" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14zM160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
    `),
    tracksuitLine: base(`
      <path class="pic-blue" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14z"></path>
      <path class="pic-blue" d="M160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
      <path class="pic-line" d="M76 52v64M116 52v64M174 50l-4 96M204 50l4 96M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14zM160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
    `),
    tracksuitSet: base(`
      <path class="pic-green" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14z"></path>
      <path class="pic-green" d="M160 36h52l10 118h-32l-4-62-8 62h-32z"></path>
      <circle class="pic-yellow" cx="130" cy="40" r="18"></circle>
      <path class="pic-line" d="M54 50l26-18h34l26 18 20 30-30 14-8-16v42H72V78l-8 16-30-14zM160 36h52l10 118h-32l-4-62-8 62h-32zM122 40h16"></path>
    `),
    vest: vest("pic-warm"),
    vestBlue: vest("pic-blue"),
    vestPocket: vest("pic-blue", `<path class="pic-line" d="M90 112h28v28M142 112h28v28"></path>`),
    vestWarm: vest("pic-warm"),
    vestZip: vest("pic-blue", `<path class="pic-line" d="M122 68h16M122 88h16M122 108h16M122 128h16"></path>`),
    hoodie: hoodie("pic-blue"),
    hoodieGreen: hoodie("pic-green"),
    hoodieBlue: hoodie("pic-blue"),
    hoodiePocket: hoodie("pic-blue", `<path class="pic-line" d="M104 122h52v28h-52z"></path>`),
    hoodieLine: hoodie("pic-blue", `<path class="pic-line" d="M118 76v42M142 76v42M118 118l-10 16M142 118l10 16"></path>`),
    pants: pants("pic-blue"),
    jeans: pants("pic-blue", `<path class="pic-line" d="M94 74h28M138 74h28M98 44v18M162 44v18"></path>`),
    shorts: base(`
      <path class="pic-warm" d="M82 48h96l16 78h-54l-10-42-10 42H66z"></path>
      <path class="pic-line" d="M82 48h96l16 78h-54l-10-42-10 42H66zM82 72h96M130 72v18"></path>
    `),
    cargoPants: pants("pic-green", `<path class="pic-line" d="M78 96h36v34H78zM146 96h36v34h-36z"></path>`),
    slacks: pants("pic-dark", `<path class="pic-line" d="M100 62l-12 92M160 62l12 92"></path>`),
    seat: base(`
      <rect class="pic-blue" x="84" y="38" width="92" height="68" rx="10"></rect>
      <rect class="pic-warm" x="68" y="102" width="124" height="34" rx="10"></rect>
      <path class="pic-line" d="M84 38h92v68H84zM68 102h124v34H68zM88 136v34M172 136v34"></path>
    `),
    chair: base(`
      <rect class="pic-blue" x="84" y="38" width="92" height="68" rx="10"></rect>
      <rect class="pic-warm" x="68" y="102" width="124" height="34" rx="10"></rect>
      <path class="pic-line" d="M84 38h92v68H84zM68 102h124v34H68zM88 136v34M172 136v34"></path>
    `),
    sofa: base(`
      <rect class="pic-blue" x="54" y="56" width="152" height="62" rx="18"></rect>
      <rect class="pic-warm" x="40" y="104" width="180" height="42" rx="16"></rect>
      <path class="pic-line" d="M54 104V74c0-10 8-18 18-18h116c10 0 18 8 18 18v30M40 104h180v42H40zM66 146v24M194 146v24"></path>
    `),
    mat: base(`
      <path class="pic-warm" d="M48 74h156c20 0 34 14 34 34s-14 34-34 34H48z"></path>
      <path class="pic-line" d="M48 74h156c20 0 34 14 34 34s-14 34-34 34H48zM48 74c24 12 24 56 0 68M88 74v68M130 74v68M172 74v68"></path>
    `),
    desk: base(`
      <rect class="pic-warm" x="46" y="78" width="168" height="32" rx="6"></rect>
      <rect class="pic-blue" x="78" y="38" width="62" height="40" rx="6"></rect>
      <path class="pic-line" d="M46 78h168v32H46zM78 38h62v40H78zM70 110v58M190 110v58M94 58h28"></path>
    `),
    activity: base(`
      <rect class="pic-white" x="60" y="42" width="96" height="96" rx="8"></rect>
      <circle class="pic-yellow" cx="190" cy="70" r="20"></circle>
      <path class="pic-line" d="M60 42h96v96H60zM78 116l22-28 18 18 20-30M176 120h28M190 98v44"></path>
    `),
    drawing: base(`
      <rect class="pic-white" x="54" y="34" width="116" height="116" rx="8"></rect>
      <path class="pic-line" d="M54 34h116v116H54zM76 120l24-30 18 18 20-28"></path>
      <path class="pic-warm" d="M178 54l26 26-58 58-32 8 8-32z"></path>
      <path class="pic-line" d="M178 54l26 26-58 58-32 8 8-32z"></path>
    `),
    music: base(`
      <path class="pic-line" d="M86 108c0-26 18-48 44-48s44 22 44 48M78 106h26v42H78zM156 106h26v42h-26z"></path>
      <path class="pic-blue" d="M78 106h26v42H78zM156 106h26v42h-26z"></path>
    `),
    walk: base(`
      <circle class="skin" cx="116" cy="54" r="18"></circle>
      <path class="pic-green" d="M88 130c2-36 16-56 28-56s26 20 30 56z"></path>
      <path class="pic-line" d="M104 86l-28 28M132 86l32 28M104 128l-28 34M136 128l32 34M38 164h184M182 42h34M199 25v34"></path>
    `),
    game: base(`
      <rect class="pic-blue" x="52" y="64" width="156" height="74" rx="30"></rect>
      <path class="pic-line" d="M52 101c0-22 16-37 38-37h80c22 0 38 15 38 37s-16 37-38 37H90c-22 0-38-15-38-37zM82 101h36M100 83v36M158 94h1M184 108h1"></path>
    `),
    coffee: base(`
      <path class="pic-white" d="M76 82h94v58H76z"></path>
      <path class="pic-warm" d="M88 96h70v28H88z"></path>
      <path class="pic-line" d="M76 82h94v58H76zM170 94h22c18 0 18 34 0 34h-22M92 50c-12 14 12 18 0 32M124 44c-12 14 12 18 0 32M156 50c-12 14 12 18 0 32M64 148h138"></path>
    `),
    cola: base(`
      <path class="pic-danger" d="M102 44h56l10 116H92z"></path>
      <rect class="pic-white" x="98" y="90" width="64" height="30" rx="10"></rect>
      <path class="pic-line" d="M102 44h56l10 116H92zM110 28h40v16h-40zM112 106h36M86 160h88"></path>
    `),
    sportsDrink: base(`
      <path class="pic-blue" d="M100 48h60l14 108H86z"></path>
      <path class="pic-white" d="M98 86h64v34H98z"></path>
      <path class="pic-line" d="M100 48h60l14 108H86zM112 30h36v18h-36M118 104h24M130 92v24"></path>
    `),
    soyMilk: base(`
      <path class="pic-white" d="M84 44h92v110H84z"></path>
      <path class="pic-green" d="M98 76h64v44H98z"></path>
      <path class="pic-line" d="M84 44h92v110H84zM84 44l18-18h92l-18 18M98 76h64v44H98zM116 98h28"></path>
    `),
    computer: base(`
      <rect class="pic-blue" x="54" y="48" width="150" height="92" rx="8"></rect>
      <rect class="pic-white" x="70" y="62" width="118" height="62" rx="6"></rect>
      <path class="pic-line" d="M54 48h150v92H54zM92 156h76M130 140v16M88 92h84"></path>
    `),
    badminton: base(`
      <circle class="pic-white" cx="88" cy="74" r="38"></circle>
      <path class="pic-line" d="M62 48l52 52M114 48l-52 52M88 36v76M50 74h76M116 102l56 56"></path>
      <path class="pic-warm" d="M184 54l24 42-48 8z"></path>
      <path class="pic-line" d="M184 54l24 42-48 8zM172 76h28"></path>
    `),
    dance: base(`
      <circle class="skin" cx="130" cy="46" r="18"></circle>
      <path class="pic-green" d="M100 130c4-38 18-60 30-60s26 22 30 60z"></path>
      <path class="pic-line" d="M112 78L74 54M148 78l38-24M114 130l-24 36M146 130l28 36M68 36l10 10M188 36l-10 10M54 90h26M180 90h26"></path>
    `),
    puzzle: base(`
      <path class="pic-green" d="M58 54h64v42c14-12 34-2 34 16s-20 28-34 16v32H58z"></path>
      <path class="pic-blue" d="M122 54h70v106h-70v-32c14 12 34 2 34-16s-20-28-34-16z"></path>
      <path class="pic-line" d="M58 54h64v42c14-12 34-2 34 16s-20 28-34 16v32H58zM122 54h70v106h-70"></path>
    `),
    ask: base(`
      ${person(78, 58)}
      <rect class="pic-white" x="136" y="44" width="78" height="56" rx="14"></rect>
      <path class="pic-line" d="M136 44h78v56h-34l-18 18v-18h-26zM158 70h34"></path>
    `),
    warning: base(`
      ${person(80, 58)}
      <path class="pic-warm" d="M182 38l58 104H124z"></path>
      <path class="pic-line" d="M182 38l58 104H124zM182 72v34M182 128v1"></path>
    `),
    help: base(`
      ${person(78, 58)}
      <rect class="pic-blue" x="144" y="46" width="70" height="98" rx="16"></rect>
      <path class="pic-line" d="M162 92h34M179 75v34M154 122h50"></path>
    `),
    shield: base(`
      ${person(76, 58)}
      <path class="pic-blue" d="M170 34l48 18v34c0 32-19 58-48 72-29-14-48-40-48-72V52z"></path>
      <path class="pic-line" d="M170 34l48 18v34c0 32-19 58-48 72-29-14-48-40-48-72V52zM148 92l16 16 34-42"></path>
    `),
    respect: base(`
      ${person(74, 58)}
      ${person(184, 58, "shirt-b")}
      <path class="pic-line" d="M108 112c24 20 50 20 74 0M118 86h24"></path>
    `),
  };

  return cards[type] || cards.activity;
}

function illustration(name) {
  const imageAssetAliases = {
    pants: "jeans",
  };

  const imageAssets = new Set([
    "activity",
    "ansAskFirst",
    "ansAskHelp",
    "ansAskPermission",
    "ansAfterFinish",
    "ansAreYouOkay",
    "ansAskBathroomHelp",
    "ansAskHelpFriend",
    "ansBlameFriend",
    "ansCloseDoor",
    "ansCutLine",
    "ansDontFollow",
    "ansFollowStranger",
    "ansGoodJob",
    "ansGreatWork",
    "ansKeepTalking",
    "ansNoPhoto",
    "ansOpenDoor",
    "ansPickUpTogether",
    "ansPassBy",
    "ansPushIn",
    "ansPutDown",
    "ansRespectNo",
    "ansRunAway",
    "ansSecretTake",
    "ansSilentPhoto",
    "ansSorry",
    "ansStaySilent",
    "ansStop",
    "ansTellFamily",
    "ansTellTeacher",
    "ansTellTeacherTogether",
    "ansUseNoAsk",
    "ansWaitPatiently",
    "ansWaitTurn",
    "apologySpeech",
    "bathroomPrivacy",
    "bibimbap",
    "bread",
    "cargoPants",
    "chair",
    "choiceMeal",
    "clothes",
    "coffee",
    "cola",
    "computer",
    "cookie",
    "curryRice",
    "danger",
    "desk",
    "dance",
    "dislikeChoice",
    "dressShoes",
    "drink",
    "drawing",
    "food",
    "friedRice",
    "fruit",
    "game",
    "help",
    "helpedParticipation",
    "hoodie",
    "hoodieBlue",
    "hoodieGreen",
    "hoodieLine",
    "hoodiePocket",
    "jeans",
    "juice",
    "jumper",
    "jumperBlue",
    "jumperPocket",
    "jumperWarm",
    "jumperZip",
    "kimbap",
    "likeChoice",
    "mat",
    "milk",
    "music",
    "mainActivity",
    "mainClothes",
    "mainFood",
    "mainSafety",
    "mainSeat",
    "mainShield",
    "noWear",
    "notUnderstand",
    "personalItem",
    "photoTaking",
    "porkCutlet",
    "puzzle",
    "ramen",
    "repeatPlease",
    "respect",
    "restReturn",
    "safe",
    "seat",
    "shield",
    "shoes",
    "shorts",
    "slacks",
    "slippers",
    "snack",
    "sneakers",
    "soyMilk",
    "sofa",
    "soupRice",
    "speakSlowly",
    "sportsDrink",
    "strangerCaution",
    "tea",
    "tracksuit",
    "tracksuitBlue",
    "tracksuitGreen",
    "tracksuitLine",
    "tracksuitSet",
    "tshirt",
    "tshirtBlue",
    "tshirtGreen",
    "tshirtStar",
    "tshirtStripe",
    "udon",
    "vest",
    "vestBlue",
    "vestPocket",
    "vestWarm",
    "vestZip",
    "walk",
    "bodyBoundary",
    "bodyTouch",
    "friendTeasing",
    "lostStreet",
    "water",
    "yogurt",
    "badminton",
    "cakeSnack",
    "deleteMessage",
    "evacuation",
    "evacuationHide",
    "evacuationReturn",
    "friendMedicine",
    "helpFriendSafety",
    "iceCream",
    "joinActivity",
    "joinGroup",
    "joinTogether",
    "medicineSafety",
    "moneySafety",
    "phonePrivacy",
    "privacyInfo",
    "redLightCrossing",
    "seatAlone",
    "seatFriend",
    "seatHelper",
    "seatWindow",
    "successHappy",
    "trafficSafety",
    "turnTakingSpeech",
    "waitTurnSpeech",
    "praiseSpeech",
  ]);

  const imageAssetName = imageAssetAliases[name] || name;
  if (imageAssets.has(imageAssetName)) {
    return `<img class="card-image" src="./assets/cards/${imageAssetName}.jpg" alt="" aria-hidden="true" />`;
  }

  const clearPictograms = {
    food: "meal",
    bibimbap: "bibimbap",
    ramen: "ramen",
    udon: "udon",
    kimbap: "kimbap",
    friedRice: "friedRice",
    curryRice: "curryRice",
    porkCutlet: "porkCutlet",
    soupRice: "soupRice",
    clothes: "clothes",
    tshirt: "tshirtPlain",
    tshirtGreen: "tshirtGreen",
    tshirtBlue: "tshirtBlue",
    tshirtStripe: "tshirtStripe",
    tshirtStar: "tshirtStar",
    jumper: "jumper",
    jumperBlue: "jumperBlue",
    jumperZip: "jumperZip",
    jumperPocket: "jumperPocket",
    jumperWarm: "jumperWarm",
    tracksuit: "tracksuit",
    tracksuitGreen: "tracksuitGreen",
    tracksuitBlue: "tracksuitBlue",
    tracksuitLine: "tracksuitLine",
    tracksuitSet: "tracksuitSet",
    vest: "vest",
    vestBlue: "vestBlue",
    vestPocket: "vestPocket",
    vestWarm: "vestWarm",
    vestZip: "vestZip",
    hoodie: "hoodie",
    hoodieGreen: "hoodieGreen",
    hoodieBlue: "hoodieBlue",
    hoodiePocket: "hoodiePocket",
    hoodieLine: "hoodieLine",
    pants: "pants",
    jeans: "jeans",
    shorts: "shorts",
    cargoPants: "cargoPants",
    slacks: "slacks",
    seat: "seat",
    chair: "chair",
    sofa: "sofa",
    mat: "mat",
    desk: "desk",
    activity: "activity",
    drawing: "drawing",
    music: "music",
    walk: "walk",
    game: "game",
    computer: "computer",
    badminton: "badminton",
    dance: "dance",
    puzzle: "puzzle",
    coffee: "coffee",
    cola: "cola",
    sportsDrink: "sportsDrink",
    soyMilk: "soyMilk",
    safe: "ask",
    danger: "warning",
    help: "help",
    shield: "shield",
    respect: "respect",
  };

  if (clearPictograms[name]) {
    return pictogram(clearPictograms[name]);
  }

  const scenes = {
    food: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="soft" x="18" y="130" width="224" height="28" rx="10"></rect>
        <ellipse class="line-fill" cx="158" cy="96" rx="64" ry="32"></ellipse>
        <path class="warm" d="M106 92h104c-8 34-96 34-104 0z"></path>
        <path class="line" d="M92 64h120M102 74h120M126 88c13-15 27 13 40 0s27 13 40 0M96 126h128"></path>
        ${person(62, 58)}
      </svg>
    `,
    clothes: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-a" d="M38 50l26-18h34l26 18 24 34-30 15-9-17v62H53V82l-9 17-30-15z"></path>
        <path class="shirt-b" d="M152 44l28-15h32l28 15 16 96h-45l-15-58-15 58h-45z"></path>
        <path class="line" d="M38 50l26-18h34l26 18 24 34-30 15-9-17v62H53V82l-9 17-30-15zM64 32c7 13 27 13 34 0M152 44l28-15h32l28 15 16 96h-45l-15-58-15 58h-45zM196 48v88"></path>
      </svg>
    `,
    seat: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="cool" x="130" y="54" width="74" height="64" rx="8"></rect>
        <path class="line" d="M130 118h82M145 118v38M198 118v38"></path>
        ${person(72, 58)}
      </svg>
    `,
    activity: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        ${person(82, 56)}
        <rect class="soft" x="142" y="46" width="84" height="76" rx="8"></rect>
        <path class="line" d="M142 46h84v76h-84zM158 102l18-20 14 13 18-28M145 145h78"></path>
        <circle class="warm" cx="208" cy="66" r="9"></circle>
      </svg>
    `,
    safe: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        ${person(76, 56)}
        ${person(184, 56, "shirt-b")}
        <path class="line" d="M112 96h36M130 82v28"></path>
        <path class="line" d="M132 42c12 6 18 14 18 25"></path>
      </svg>
    `,
    danger: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        ${person(82, 58)}
        <path class="warm" d="M182 36l58 102H124z"></path>
        <path class="line" d="M182 66v34M182 124v1M182 36l58 102H124z"></path>
      </svg>
    `,
    help: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        ${person(78, 58)}
        <rect class="cool" x="142" y="42" width="72" height="96" rx="16"></rect>
        <path class="line" d="M161 82h34M178 65v34M154 120h48"></path>
      </svg>
    `,
    shield: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        ${person(76, 58)}
        <path class="cool" d="M168 30l50 20v34c0 32-20 56-50 70-30-14-50-38-50-70V50z"></path>
        <path class="line" d="M168 30l50 20v34c0 32-20 56-50 70-30-14-50-38-50-70V50zM145 86l15 15 32-38"></path>
      </svg>
    `,
    respect: `
      <svg class="illustration" viewBox="0 0 260 180" aria-hidden="true">
        ${person(78, 58)}
        ${person(180, 58, "shirt-b")}
        <path class="line" d="M112 108c22 18 48 18 70 0M130 76h30"></path>
      </svg>
    `,
    bibimbap: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <ellipse class="soft" cx="130" cy="112" rx="78" ry="38"></ellipse>
        <ellipse class="line-fill" cx="130" cy="102" rx="72" ry="34"></ellipse>
        <path class="warm" d="M94 92h72v20H94z"></path>
        <path class="cool" d="M110 76h20v42h-20z"></path>
        <path class="shirt-a" d="M142 76h20v42h-20z"></path>
        <circle class="warm" cx="130" cy="96" r="17"></circle>
        <path class="line" d="M58 132h144M94 92h72M110 76v42M142 76v42"></path>
      </svg>
    `,
    ramen: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <ellipse class="line-fill" cx="130" cy="112" rx="76" ry="34"></ellipse>
        <path class="warm" d="M72 106c10 44 106 44 116 0z"></path>
        <path class="line" d="M66 104c0 46 128 46 128 0M66 104c0-22 128-22 128 0M90 88c12-16 28 16 40 0s28 16 40 0"></path>
        <path class="line" d="M76 58h108M86 68h108"></path>
      </svg>
    `,
    oldNoodles: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <ellipse class="line-fill" cx="130" cy="112" rx="76" ry="34"></ellipse>
        <path class="soft" d="M70 106c10 44 110 44 120 0z"></path>
        <path class="hair" d="M88 92c28-26 80-26 104 4-22 18-82 20-104-4z"></path>
        <path class="line" d="M66 104c0 46 128 46 128 0M66 104c0-22 128-22 128 0M100 92c18 16 56 16 76 0"></path>
      </svg>
    `,
    kimbap: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="soft" x="46" y="82" width="168" height="52" rx="26"></rect>
        <circle class="line-fill" cx="80" cy="108" r="31"></circle>
        <circle class="line-fill" cx="130" cy="108" r="31"></circle>
        <circle class="line-fill" cx="180" cy="108" r="31"></circle>
        <path class="warm" d="M70 100h20v16H70zM120 100h20v16h-20zM170 100h20v16h-20z"></path>
        <path class="line" d="M46 108h168M80 77v62M130 77v62M180 77v62"></path>
      </svg>
    `,
    tshirt: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-a" d="M78 48l30-20h44l30 20 30 38-35 18-12-22v66H95V82l-12 22-35-18z"></path>
        <path class="line" d="M78 48l30-20h44l30 20 30 38-35 18-12-22v66H95V82l-12 22-35-18zM108 28c8 18 36 18 44 0"></path>
      </svg>
    `,
    tshirtGreen: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-a" d="M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20z"></path>
        <path class="line" d="M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20zM106 26c8 18 40 18 48 0"></path>
      </svg>
    `,
    tshirtBlue: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20z"></path>
        <path class="line" d="M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20zM106 26c8 18 40 18 48 0"></path>
      </svg>
    `,
    tshirtStripe: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="soft" d="M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20z"></path>
        <path class="line" d="M90 84h80M90 106h80M90 128h80M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20zM106 26c8 18 40 18 48 0"></path>
      </svg>
    `,
    tshirtStar: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="warm" d="M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20z"></path>
        <path class="line" d="M72 48l34-22h48l34 22 32 38-36 20-14-22v66H90V84l-14 22-36-20zM106 26c8 18 40 18 48 0M130 72l8 18 20 2-15 13 5 20-18-10-18 10 5-20-15-13 20-2z"></path>
      </svg>
    `,
    jacket: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M78 46l34-18h36l34 18 20 98h-55l-17-72-17 72H58z"></path>
        <path class="line" d="M78 46l34-18h36l34 18 20 98h-55l-17-72-17 72H58zM130 48v94M108 28l22 20 22-20"></path>
      </svg>
    `,
    jacketBlue: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M76 42l36-16h36l36 16 24 104h-58l-20-78-20 78H52z"></path>
        <path class="line" d="M76 42l36-16h36l36 16 24 104h-58l-20-78-20 78H52zM130 48v96M112 26l18 22 18-22"></path>
      </svg>
    `,
    jacketPocket: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M76 42l36-16h36l36 16 24 104h-58l-20-78-20 78H52z"></path>
        <path class="line" d="M76 42l36-16h36l36 16 24 104h-58l-20-78-20 78H52zM130 48v96M92 102h28v26H92zM140 102h28v26h-28z"></path>
      </svg>
    `,
    jacketZip: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="cool" d="M76 42l36-16h36l36 16 24 104h-58l-20-78-20 78H52z"></path>
        <path class="line" d="M76 42l36-16h36l36 16 24 104h-58l-20-78-20 78H52zM130 48v96M122 66h16M122 84h16M122 102h16M122 120h16"></path>
      </svg>
    `,
    jacketWarm: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="warm" d="M70 48l40-22h40l40 22 22 98h-164z"></path>
        <path class="soft" d="M104 28c10 24 42 24 52 0l14 24c-18 16-62 16-80 0z"></path>
        <path class="line" d="M70 48l40-22h40l40 22 22 98h-164zM104 28c10 24 42 24 52 0M130 62v82"></path>
      </svg>
    `,
    hoodie: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="cool" d="M92 62c0-28 76-28 76 0l28 28-28 24v36H92v-36L64 90z"></path>
        <path class="line" d="M92 62c0-28 76-28 76 0M92 62v88h76V62M92 114L64 90l28-28M168 114l28-24-28-28M112 118h36"></path>
      </svg>
    `,
    hoodieGreen: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-a" d="M88 62c0-34 84-34 84 0l30 30-32 24v36H90v-36L58 92z"></path>
        <path class="line" d="M88 62c0-34 84-34 84 0M90 116L58 92l30-30M170 116l32-24-30-30M90 62v90h80V62M112 124h36"></path>
      </svg>
    `,
    hoodieBlue: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M88 62c0-34 84-34 84 0l30 30-32 24v36H90v-36L58 92z"></path>
        <path class="line" d="M88 62c0-34 84-34 84 0M90 116L58 92l30-30M170 116l32-24-30-30M90 62v90h80V62M112 124h36"></path>
      </svg>
    `,
    hoodiePocket: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="cool" d="M88 62c0-34 84-34 84 0l30 30-32 24v36H90v-36L58 92z"></path>
        <path class="line" d="M88 62c0-34 84-34 84 0M90 62v90h80V62M104 112h52v28h-52zM112 124h36"></path>
      </svg>
    `,
    hoodieLine: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="cool" d="M88 62c0-34 84-34 84 0l30 30-32 24v36H90v-36L58 92z"></path>
        <path class="line" d="M88 62c0-34 84-34 84 0M90 62v90h80V62M118 72v42M142 72v42M118 114l-8 12M142 114l8 12"></path>
      </svg>
    `,
    pants: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M92 32h76l14 120h-42l-10-66-10 66H78z"></path>
        <path class="line" d="M92 32h76l14 120h-42l-10-66-10 66H78zM92 58h76M130 58v28"></path>
      </svg>
    `,
    pantsBlue: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M88 28h84l16 128h-48l-10-72-10 72H72z"></path>
        <path class="line" d="M88 28h84l16 128h-48l-10-72-10 72H72zM88 58h84M130 58v28"></path>
      </svg>
    `,
    pantsShort: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M84 40h92l12 76h-50l-8-38-8 38H72z"></path>
        <path class="line" d="M84 40h92l12 76h-50l-8-38-8 38H72zM84 64h92M130 64v18"></path>
      </svg>
    `,
    pantsPocket: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M88 28h84l16 128h-48l-10-72-10 72H72z"></path>
        <path class="line" d="M88 28h84l16 128h-48l-10-72-10 72H72zM94 70h24v24M142 70h24v24M130 58v28"></path>
      </svg>
    `,
    pantsLine: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="shirt-b" d="M88 28h84l16 128h-48l-10-72-10 72H72z"></path>
        <path class="line" d="M88 28h84l16 128h-48l-10-72-10 72H72zM108 62l-12 88M152 62l12 88M130 58v28"></path>
      </svg>
    `,
    chair: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="cool" x="84" y="38" width="92" height="70" rx="10"></rect>
        <rect class="soft" x="70" y="104" width="120" height="32" rx="10"></rect>
        <path class="line" d="M84 38h92v70H84zM70 104h120M86 136v28M174 136v28"></path>
      </svg>
    `,
    sofa: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="soft" x="44" y="72" width="172" height="58" rx="18"></rect>
        <rect class="cool" x="58" y="46" width="144" height="54" rx="18"></rect>
        <path class="line" d="M58 100V64c0-10 8-18 18-18h108c10 0 18 8 18 18v36M44 100h172v30H44zM70 130v24M190 130v24"></path>
      </svg>
    `,
    mat: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="soft" d="M54 62h152c18 0 30 12 30 30s-12 30-30 30H54z"></path>
        <path class="line" d="M54 62h152c18 0 30 12 30 30s-12 30-30 30H54zM54 62c20 10 20 50 0 60M92 62v60M130 62v60M168 62v60"></path>
      </svg>
    `,
    desk: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="warm" x="50" y="76" width="160" height="28" rx="6"></rect>
        <rect class="cool" x="72" y="40" width="62" height="36" rx="6"></rect>
        <path class="line" d="M50 76h160v28H50zM72 40h62v36H72zM70 104v52M190 104v52M92 58h22"></path>
      </svg>
    `,
    drawing: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="soft" x="60" y="36" width="112" height="112" rx="8"></rect>
        <path class="line" d="M60 36h112v112H60zM84 116l26-28 18 18 16-22 18 32"></path>
        <path class="warm" d="M178 54l22 22-54 54-28 8 8-28z"></path>
        <path class="line" d="M178 54l22 22-54 54-28 8 8-28z"></path>
      </svg>
    `,
    music: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <path class="line" d="M118 42v76M118 42l70-14v76M86 122c0-14 32-14 32 0s-32 14-32 0M156 108c0-14 32-14 32 0s-32 14-32 0"></path>
        <path class="cool" d="M118 42l70-14v26l-70 14z"></path>
      </svg>
    `,
    walk: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        ${person(118, 50)}
        <path class="line" d="M102 122l-26 32M134 122l34 30M36 154h188"></path>
        <circle class="warm" cx="190" cy="48" r="20"></circle>
      </svg>
    `,
    game: `
      <svg class="illustration item-art" viewBox="0 0 260 180" aria-hidden="true">
        <rect class="cool" x="50" y="66" width="160" height="70" rx="28"></rect>
        <path class="line" d="M50 100c0-20 16-34 36-34h88c20 0 36 14 36 34s-16 36-36 36H86c-20 0-36-16-36-36zM82 100h34M99 83v34M156 96h1M184 108h1"></path>
      </svg>
    `,
  };

  return scenes[name];
}

function answerVisual(text, kind = "") {
  const visualByText = {
    "제가 이거 써 봐도 될까요?": "ansAskPermission",
    "묻지 않고 쓴다": "ansUseNoAsk",
    "몰래 가져간다": "ansSecretTake",
    "선생님에게 말해요": "ansTellTeacher",
    "가족에게 말해요": "ansTellFamily",
    "상대에게 하지 말라고 말해요": "ansStop",
    "혼자 참아요": "ansStaySilent",
    "도와주세요": "ansAskHelp",
    "경찰관이나 경찰서에 물어봐요": "help",
    "그냥 뛰어가요": "ansRunAway",
    "아무에게나 따라가요": "ansFollowStranger",
    "따라가지 않아요": "ansDontFollow",
    "그냥 따라가요": "ansFollowStranger",
    "찍지 마세요": "ansNoPhoto",
    "싫어도 참아요": "ansSilentPhoto",
    "초록불에 건너요": "trafficSafety",
    "차가 오는지 보고 건너요": "trafficSafety",
    "빨간불에 건너요": "redLightCrossing",
    "빨간불에 뛰어가요": "redLightCrossing",
    "선생님 안내를 따라가요": "evacuation",
    "비상구로 나가요": "evacuation",
    "혼자 숨어요": "evacuationHide",
    "물건을 찾으러 돌아가요": "evacuationReturn",
    "내 약인지 확인해요": "medicineSafety",
    "선생님에게 물어봐요": "ansTellTeacher",
    "친구 약을 먹어요": "friendMedicine",
    "바로 돈을 줘요": "moneySafety",
    "선생님에게 보여줘요": "phonePrivacy",
    "가족에게 물어봐요": "ansTellFamily",
    "메시지를 삭제해요": "deleteMessage",
    "바로 보내요": "phonePrivacy",
    "도와줄까? 물어봐요": "ansAskHelpFriend",
    "같이 주워요": "ansPickUpTogether",
    "그냥 지나가요": "ansPassBy",
    "문을 닫아요": "ansCloseDoor",
    "필요하면 선생님께 말해요": "ansAskBathroomHelp",
    "문을 열어 둬요": "ansOpenDoor",
    "안 돼요": "ansStop",
    "먼저 물어봐요": "ansAskPermission",
    "싫어요": "ansStop",
    "하지 마세요": "ansStop",
    "선생님께 말할래요": "ansTellTeacher",
    "알겠어": "ansRespectNo",
    "멈출게요": "ansRespectNo",
    "계속 말해요": "ansKeepTalking",
    "기다릴게요": "ansWaitPatiently",
    "잠깐 기다릴게요": "ansWaitPatiently",
    "끝나면 할래요": "ansAfterFinish",
    "밀고 들어가요": "ansPushIn",
    "먼저 해도 될까요?": "ansAskFirst",
    "세치기": "ansCutLine",
    "미안해요": "ansSorry",
    "괜찮아요?": "ansAreYouOkay",
    "네가 잘못했어": "ansBlameFriend",
    "잘했어요": "ansGoodJob",
    "멋져요": "ansGreatWork",
    "못했어요": "ansPutDown",
    "그냥 지켜봐요": "ansStaySilent",
    "그냥 참아요": "ansStaySilent",
    "저는 이게 좋아요": "likeChoice",
    "저는 이건 싫어요": "dislikeChoice",
    "다시 말해 주세요": "repeatPlease",
    "천천히 말해 주세요": "speakSlowly",
    "잘 모르겠어요": "notUnderstand",
    "아무 말 안 해요": "ansStaySilent",
    "억지로 참아요": "ansStaySilent",
    "모르는 척해요": "ansStaySilent",
    "그냥 고개만 끄덕여요": "ansStaySilent",
    "아는 척해요": "ansStaySilent",
  };

  const visualKey = visualByText[text] || (kind === "danger" ? "danger" : kind === "help" ? "help" : "respect");
  return `<span class="answer-visual">${illustration(visualKey)}</span>`;
}

function speak(text) {
  if (!("speechSynthesis" in window)) {
    feedback.textContent = "읽어주기를 사용할 수 없어요.";
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.86;
    utterance.onerror = () => {
      feedback.textContent = "읽어주기에 실패했어요.";
    };
    window.speechSynthesis.speak(utterance);
  } catch {
    feedback.textContent = "읽어주기에 실패했어요.";
  }
}

function speakerIcon() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z"></path>
      <path d="M16 8c1.2 1.1 1.8 2.4 1.8 4s-.6 2.9-1.8 4"></path>
      <path d="M18.7 5.5A8.6 8.6 0 0 1 21 12a8.6 8.6 0 0 1-2.3 6.5"></path>
    </svg>
  `;
}

function bellIcon() {
  return `
    <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 10a6 6 0 0 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7z"></path>
      <path d="M9.5 20a3 3 0 0 0 5 0"></path>
      <path d="M12 3V2"></path>
    </svg>
  `;
}

function readButton(text) {
  return `<button class="listen" data-speak="${text}" type="button" aria-label="읽어주기">${speakerIcon()}<span>듣기</span></button>`;
}

function mainMenuIcon(type) {
  const imageByType = {
    food: "mainFood",
    clothes: "mainClothes",
    seat: "mainSeat",
    activity: "mainActivity",
    safety: "mainSafety",
    shield: "mainShield",
  };
  if (imageByType[type]) return illustration(imageByType[type]);

  const icons = {
    food: `
      <svg class="menu-icon food" viewBox="0 0 180 150" aria-hidden="true">
        <circle class="menu-sun" cx="138" cy="32" r="16"></circle>
        <ellipse class="menu-white" cx="88" cy="96" rx="58" ry="30"></ellipse>
        <path class="menu-warm" d="M44 92c8 40 80 42 90 0z"></path>
        <path class="menu-line" d="M34 90c0 42 108 42 108 0M34 90c0-18 108-18 108 0M58 76c10-12 22 12 32 0s22 12 32 0M136 64h24M148 52v48"></path>
      </svg>
    `,
    clothes: `
      <svg class="menu-icon clothes" viewBox="0 0 180 150" aria-hidden="true">
        <path class="menu-green" d="M42 42l28-18h40l28 18 26 32-30 18-10-18v54H56V74L46 92 16 74z"></path>
        <path class="menu-line" d="M42 42l28-18h40l28 18 26 32-30 18-10-18v54H56V74L46 92 16 74zM70 24c8 14 32 14 40 0"></path>
        <path class="menu-heart" d="M90 78c-14-14-34 4-15 20l15 13 15-13c19-16-1-34-15-20z"></path>
      </svg>
    `,
    seat: `
      <svg class="menu-icon seat" viewBox="0 0 180 150" aria-hidden="true">
        <rect class="menu-blue" x="54" y="28" width="72" height="58" rx="12"></rect>
        <rect class="menu-warm" x="42" y="82" width="96" height="30" rx="12"></rect>
        <path class="menu-line" d="M54 28h72v58H54zM42 82h96v30H42zM58 112v26M122 112v26M78 58h4M100 58h4M80 70c8 8 20 8 28 0"></path>
      </svg>
    `,
    activity: `
      <svg class="menu-icon activity" viewBox="0 0 180 150" aria-hidden="true">
        <circle class="menu-face" cx="58" cy="44" r="18"></circle>
        <path class="menu-green" d="M28 120c4-34 16-54 30-54s26 20 30 54z"></path>
        <path class="menu-blue" d="M110 34h48v48h-48z"></path>
        <path class="menu-line" d="M42 74L18 92M74 74l26 18M110 34h48v48h-48zM120 68l12-14 8 8 12-18M106 116h52"></path>
        <circle class="menu-sun" cx="148" cy="106" r="16"></circle>
      </svg>
    `,
    safety: `
      <svg class="menu-icon safety" viewBox="0 0 180 150" aria-hidden="true">
        <path class="menu-blue" d="M90 18l54 20v34c0 34-22 58-54 74-32-16-54-40-54-74V38z"></path>
        <path class="menu-line" d="M90 18l54 20v34c0 34-22 58-54 74-32-16-54-40-54-74V38zM64 76l18 18 38-44"></path>
        <circle class="menu-white" cx="132" cy="42" r="10"></circle>
      </svg>
    `,
    shield: `
      <svg class="menu-icon shield" viewBox="0 0 180 150" aria-hidden="true">
        <circle class="menu-face" cx="58" cy="52" r="18"></circle>
        <path class="menu-green" d="M30 124c4-34 16-54 28-54s24 20 28 54z"></path>
        <rect class="menu-white" x="92" y="32" width="60" height="44" rx="14"></rect>
        <path class="menu-line" d="M92 32h60v44h-22l-16 18V76H92zM106 54h32M70 82l22 18M46 82l-22 18"></path>
        <path class="menu-heart" d="M122 108c-10-10-24 2-11 14l11 10 11-10c13-12-1-24-11-14z"></path>
      </svg>
    `,
  };
  return icons[type] || icons.activity;
}

function addRecord(text) {
  const time = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  records.unshift(`${time} - ${text}`);
}

function showCelebration(label = "좋아요", tone = "positive") {
  celebration.querySelector(".celebration-mark").textContent = label;
  celebration.classList.remove("show", "warn");
  if (tone === "warning") celebration.classList.add("warn");
  window.requestAnimationFrame(() => celebration.classList.add("show"));
}

function playWarningTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(220, context.currentTime);
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.28);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);
  } catch {
    // Audio feedback is optional; visual feedback still works.
  }
}

function playPositiveTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.34);
    gain.connect(context.destination);

    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.08);
      oscillator.connect(gain);
      oscillator.start(context.currentTime + index * 0.08);
      oscillator.stop(context.currentTime + index * 0.08 + 0.16);
    });
  } catch {
    // Audio feedback is optional; visual feedback still works.
  }
}

function setFeedback(message, label = "좋아요", tone = "positive") {
  feedback.textContent = message;
  showCelebration(label, tone);
  if (tone === "warning") playWarningTone();
  if (tone === "positive") playPositiveTone();
  window.clearTimeout(setFeedback.timer);
  setFeedback.timer = window.setTimeout(() => {
    feedback.textContent = "";
  }, 2400);
}

function updateCounts() {
  document.querySelector("#choiceCount").textContent = counts.choice;
  document.querySelector("#expressionCount").textContent = counts.expression;
  document.querySelector("#helpCount").textContent = counts.help;
  document.querySelector("#respectCount").textContent = counts.respect;
  document.querySelector("#practiceCount").textContent = counts.practice;
}

function emptyScore() {
  return { expression: 0, help: 0, respect: 0, practice: 0 };
}

function questionScoreKey(activity, index = state.index) {
  return `${activity}-${index}`;
}

function getScoredAnswer(activity, index = state.index) {
  return state.scoredAnswers[activity][questionScoreKey(activity, index)];
}

function applyScoreDelta(previousScore, nextScore) {
  ["expression", "help", "respect", "practice"].forEach((field) => {
    counts[field] = Math.max(0, counts[field] + (nextScore[field] || 0) - (previousScore[field] || 0));
  });
}

function applyScoredAnswer(activity, index, entry) {
  const key = questionScoreKey(activity, index);
  const previous = state.scoredAnswers[activity][key];
  applyScoreDelta(previous?.score || emptyScore(), entry.score || emptyScore());
  state.scoredAnswers[activity][key] = { ...entry, key, index };
  return !previous || previous.text !== entry.text || previous.correct !== entry.correct;
}

function safetyScore(kind, isCorrect) {
  const score = { expression: 1, help: 0, respect: 0, practice: isCorrect ? 0 : 1 };
  if (isCorrect && kind === "help") score.help = 1;
  if (isCorrect && (kind === "respect" || kind === "safe")) score.respect = 1;
  return score;
}

function shieldScore(text, isCorrect) {
  const score = { expression: 1, help: 0, respect: 0, practice: isCorrect ? 0 : 1 };
  if (!isCorrect) return score;
  if (
    [
      "도와주세요",
      "싫어요",
      "안 돼요",
      "하지 마세요",
      "찍지 마세요",
      "선생님께 말할래요",
      "다시 말해 주세요",
      "천천히 말해 주세요",
      "잘 모르겠어요",
    ].includes(text)
  ) score.help = 1;
  if (
    [
      "먼저 물어봐요",
      "알겠어",
      "멈출게요",
      "기다릴게요",
      "잠깐 기다릴게요",
      "먼저 해도 될까요?",
      "끝나면 할래요",
      "미안해요",
      "괜찮아요?",
      "잘했어요",
      "멋져요",
    ].includes(text)
  ) score.respect = 1;
  return score;
}

function applyHelpPracticeScore(index = state.index) {
  const key = questionScoreKey("helpPractice", index);
  if (state.scoredAnswers.helpPractice[key]) return false;
  const score = { expression: 0, help: 1, respect: 0 };
  applyScoreDelta(emptyScore(), score);
  state.scoredAnswers.helpPractice[key] = { key, index, text: "도움 벨", correct: true, score };
  return true;
}

function activityScoreSummary(activity, scenes) {
  const entries = scenes.map((_, index) => getScoredAnswer(activity, index)).filter(Boolean);
  const helpPracticeEntries =
    activity === "shield"
      ? scenes.map((_, index) => state.scoredAnswers.helpPractice[questionScoreKey("helpPractice", index)]).filter(Boolean)
      : [];
  return {
    answered: entries.length,
    total: scenes.length,
    correct: entries.filter((entry) => entry.correct).length,
    help: entries.reduce((sum, entry) => sum + (entry.score.help || 0), 0) + helpPracticeEntries.length,
    respect: entries.reduce((sum, entry) => sum + (entry.score.respect || 0), 0),
    practice: entries.reduce((sum, entry) => sum + (entry.score.practice || 0), 0),
  };
}

function scoreSummaryMarkup(items) {
  return `
    <div class="score-summary" aria-label="오늘의 활동 기록">
      <strong>오늘의 기록</strong>
      <div class="score-items">
        ${items
          .map(
            (item) => `
              <article class="score-item ${item.kind || ""}">
                <span>${item.label}</span>
                <b>${item.value}</b>
              </article>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function progressMarkup(current, total, label = "진행") {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(0, current), safeTotal);
  const percent = Math.round((safeCurrent / safeTotal) * 100);
  return `
    <div class="progress-card" aria-label="${label} ${safeCurrent}/${safeTotal}">
      <div class="progress-main">
        <div class="progress-text">
          <span>${label}</span>
          <strong>${safeCurrent}/${safeTotal}</strong>
        </div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
      </div>
      <button class="exit-button" data-main-home type="button" aria-label="게임 나가기">
        <span class="exit-mark" aria-hidden="true">X</span>
        <span>게임 나가기</span>
      </button>
    </div>
  `;
}

function getActiveChoiceSteps() {
  if (!state.choiceFlow) return [];
  if (state.choiceFlow.type === "food") return foodFlowSteps;
  if (state.choiceFlow.type === "clothes") return clothesFlowSteps;
  if (state.choiceFlow.type === "activity") return getActivityFlowSteps();
  return [];
}

function renderHome() {
  focusWord.textContent = "시작";
  stage.innerHTML = `
    <div class="activity-title home-title">
      <h2>오늘 어떤 활동을 할까요?</h2>
      <p class="prompt">하고 싶은 학습을 하나 골라요.</p>
      ${readButton("오늘 어떤 활동을 할까요? 하고 싶은 학습을 하나 골라요.")}
    </div>
    <div class="menu-grid">
      ${mainMenus
        .map(
          (menu) => `
            <button class="home-card" data-main-menu="${menu.key}" type="button">
              ${mainMenuIcon(menu.key)}
              <strong>${menu.title}</strong>
              <span>${menu.prompt}</span>
            </button>
          `,
        )
        .join("")}
    </div>
    <p class="home-credit">기획·제작: 김종균</p>
  `;
  stage.appendChild(feedback);
}

function renderChoiceSummary() {
  const isFood = state.choiceFlow.type === "food";
  const isActivity = state.choiceFlow.type === "activity";
  const title = isFood ? "내가 고른 음식이에요" : isActivity ? "내가 고른 활동이에요" : "내가 고른 것이에요";
  const visiblePicks = state.choiceFlow.picks.filter((pick) => !pick.skip);
  const steps = getActiveChoiceSteps();
  focusWord.textContent = "선택";
  stage.innerHTML = `
    <div class="activity-title">
      <h2>${title}</h2>
      <p class="prompt">내가 스스로 골랐어요.</p>
      ${readButton(`${title}. 내가 스스로 골랐어요.`)}
    </div>
    ${progressMarkup(steps.length, steps.length, "진행")}
    ${scoreSummaryMarkup([
      { label: "스스로 결정", value: `${state.choiceFlow.picks.length}번`, kind: "choice" },
      { label: "고른 카드", value: `${visiblePicks.length}개`, kind: "safe" },
    ])}
    ${state.choiceFlow.summary ? `<div class="choice-result-sentence">${state.choiceFlow.summary}</div>` : ""}
    <div class="card-grid summary-grid">
      ${visiblePicks
        .map(
          (pick) => `
            <article class="big-card summary-card">
              ${illustration(pick.key)}
              <strong>${pick.title}</strong>
              <span>${pick.label}</span>
            </article>
          `,
        )
        .join("")}
    </div>
    <button class="back-button complete-button" data-main-home type="button">완료</button>
  `;
  stage.appendChild(feedback);
}

function renderDirectChoiceSummary(category, picked) {
  const title = category.key === "seat" ? "내가 고른 자리예요" : "내가 고른 활동이에요";
  focusWord.textContent = "선택";
  stage.innerHTML = `
    <div class="activity-title">
      <h2>${title}</h2>
      <p class="prompt">내가 스스로 골랐어요.</p>
      ${readButton(`${title}. 내가 스스로 골랐어요.`)}
    </div>
    ${progressMarkup(1, 1, "진행")}
    ${scoreSummaryMarkup([
      { label: "스스로 결정", value: "1번", kind: "choice" },
      { label: "고른 카드", value: "1개", kind: "safe" },
    ])}
    <div class="card-grid summary-grid">
      <article class="big-card summary-card">
        ${illustration(picked.key)}
        <strong>${picked.title}</strong>
        <span>${category.title}</span>
      </article>
    </div>
    <button class="back-button complete-button" data-main-home type="button">완료</button>
  `;
  stage.appendChild(feedback);
}

function renderChoiceFlow() {
  const steps = getActiveChoiceSteps();
  if (state.choiceFlow.step >= steps.length) {
    renderChoiceSummary();
    return;
  }

  const step = steps[state.choiceFlow.step];
  focusWord.textContent = "선택";
  stage.innerHTML = `
    <div class="activity-title">
      <h2>${step.title}</h2>
      <p class="prompt">${step.prompt}</p>
      ${readButton(`${step.title}. ${step.prompt}`)}
    </div>
    ${progressMarkup(state.choiceFlow.step + 1, steps.length, "진행")}
    <div class="card-grid ${state.mode === "easy" ? "two" : ""}">
      ${step.options
        .map(
          (card) => `
            <button class="big-card" data-flow-option="${card.key}" data-speak="${card.speak}" type="button">
              ${illustration(card.imageKey || card.key)}
              <strong>${card.title}</strong>
            </button>
          `,
        )
        .join("")}
    </div>
    ${step.note ? `<p class="choice-note">${step.note}</p>` : ""}
  `;
  stage.appendChild(feedback);
}

function renderChoice() {
  if (state.choiceFlow) {
    renderChoiceFlow();
    return;
  }

  const selectedCategory = choiceCategories.find((category) => category.key === state.choiceCategory);
  if (selectedCategory) {
    const picked = state.choiceSelections[selectedCategory.key];
    if (picked) {
      renderDirectChoiceSummary(selectedCategory, picked);
      return;
    }
    focusWord.textContent = "선택";
    stage.innerHTML = `
      <div class="activity-title">
        <h2>${selectedCategory.title} 고르기</h2>
        <p class="prompt">${selectedCategory.key === "activity" ? "하고 싶은 활동이나 말을 골라요." : "하나를 골라요."}</p>
        ${readButton(`${selectedCategory.title} 고르기. ${selectedCategory.key === "activity" ? "하고 싶은 활동이나 말을 골라요." : "하나를 골라요."}`)}
      </div>
      ${progressMarkup(picked ? 1 : 0, 1, "진행")}
      <div class="card-grid ${state.mode === "easy" ? "two" : ""}">
        ${selectedCategory.options
          .map(
            (card) => `
              <button class="big-card ${picked?.key === card.key ? "selected" : ""}" data-choice-option="${card.key}" data-speak="${card.speak}" type="button">
                ${illustration(card.key)}
                <strong>${card.title}</strong>
              </button>
            `,
          )
          .join("")}
      </div>
      ${selectedCategory.note ? `<p class="choice-note">${selectedCategory.note}</p>` : ""}
      <button class="back-button" data-main-home type="button">처음으로 가기</button>
    `;
    stage.appendChild(feedback);
    return;
  }

  state.choiceFlow = { type: "food", step: 0, picks: [] };
  renderChoiceFlow();
  return;
}

function renderCompletion(title, message) {
  focusWord.textContent = "완료";
  stage.innerHTML = `
    <div class="activity-title">
      <h2>${title}</h2>
      <p class="prompt">학습을 완료하였습니다.</p>
      ${readButton(`${title}. 학습을 완료하였습니다.`)}
    </div>
    <div class="scene completion">
      <div class="scene-art">${illustration("respect")}</div>
      <div class="scene-copy">
        <strong>참 잘했어요</strong>
        <p>${message}</p>
      </div>
    </div>
  `;
  stage.appendChild(feedback);
}

function normalizedAnswers(scene) {
  return scene.answers.map((answer) => (typeof answer === "string" ? { text: answer, correct: true } : answer));
}

function cleanGuidance(text) {
  return (text || "").replace(/^좋은 방법:\s*/, "");
}

function reviewCard(scene) {
  const answers = normalizedAnswers(scene);
  const correctAnswers = answers.filter((answer) => answer.correct);
  const wrongAnswers = answers.filter((answer) => !answer.correct);
  const guidance = cleanGuidance(scene.answerText);

  return `
    <article class="review-card">
      <div class="review-scene">
        <div class="review-art">${illustration(scene.imageKey || scene.key)}</div>
        <div>
          <strong>${scene.title}</strong>
          <p>${scene.question}</p>
        </div>
      </div>
      <div class="review-columns">
        <section class="review-section">
          <h3>정답</h3>
          <ul class="review-answers">
            ${correctAnswers
              .map(
                (answer) => `
                  <li class="review-answer ok">
                    <span>좋은 선택</span>
                    <strong>${answer.text}</strong>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </section>
        <section class="review-section">
          <h3>오답</h3>
          <ul class="review-answers">
            ${wrongAnswers
              .map(
                (answer) => `
                  <li class="review-answer retry">
                    <span>조심할 선택</span>
                    <strong>${answer.text}</strong>
                    <small>바른 행동: ${guidance}</small>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </section>
      </div>
    </article>
  `;
}

function renderReviewSummary(title, message, scenes) {
  const activity = title.includes("생활 안전") ? "safety" : "shield";
  const summary = activityScoreSummary(activity, scenes);
  focusWord.textContent = "복습";
  stage.innerHTML = `
    <div class="activity-title">
      <h2>${title}</h2>
      <p class="prompt">정답과 오답을 다시 봐요.</p>
      ${readButton(`${title}. 정답과 오답을 다시 봐요.`)}
    </div>
    ${progressMarkup(scenes.length, scenes.length, "진행")}
    ${scoreSummaryMarkup([
      { label: "답한 질문", value: `${summary.answered}/${summary.total}`, kind: "choice" },
      { label: "좋은 선택", value: `${summary.correct}개`, kind: "safe" },
      { label: "다시 연습", value: `${summary.practice}개`, kind: "practice" },
      { label: "도움 연습", value: `${summary.help}번`, kind: "help" },
      { label: "존중 연습", value: `${summary.respect}번`, kind: "respect" },
    ])}
    <div class="scene completion review-finish">
      <div class="scene-art">${illustration("respect")}</div>
      <div class="scene-copy">
        <strong>참 잘했어요</strong>
        <p>${message}</p>
      </div>
    </div>
    <div class="review-list">
      ${scenes.map((scene) => reviewCard(scene)).join("")}
    </div>
    <button class="back-button complete-button" data-main-home type="button">완료</button>
  `;
  stage.appendChild(feedback);
}

function renderSafety() {
  if (state.index >= safetyScenes.length) {
    renderReviewSummary("생활 안전 복습", "괜찮은 상황, 불편한 상황, 도움이 필요한 상황을 골라 보았어요.", safetyScenes);
    return;
  }

  const scene = safetyScenes[state.index];
  const sceneText = scene[state.mode] || scene.story || scene.visual || "";
  const isLastScene = state.index === safetyScenes.length - 1;
  const selectedAnswer = getScoredAnswer("safety");
  focusWord.textContent = scene.key === "permission" || scene.key === "photoTaking" ? "존중" : "안전";
  stage.innerHTML = `
    <div class="activity-title">
      <h2>생활 안전 고르기</h2>
      <p class="prompt">${isLastScene ? "다음 카드를 누르면 학습을 완료합니다." : state.mode === "easy" ? "골라요." : "어떻게 하면 좋을까요?"}</p>
      ${readButton(`${scene.title}. ${sceneText}`)}
    </div>
    ${progressMarkup(state.index + 1, safetyScenes.length, "카드")}
    <div class="scene">
      <div class="scene-art">${illustration(scene.imageKey || scene.key)}</div>
      <div class="scene-copy">
        <strong>${scene.title}</strong>
        <p>${sceneText}</p>
        ${state.mode === "story" ? `<div class="story-question">${scene.question}</div>` : ""}
      </div>
    </div>
    <div class="answers">
      ${scene.answers
        .map(
          (answer) =>
            `<button class="pill answer-card ${answer.kind} ${selectedAnswer?.text === answer.text ? "selected" : ""}" data-safety="${answer.kind}" data-correct="${answer.correct}" data-answer="${answer.text}" type="button">
              <span class="answer-text">${answer.text}</span>
              ${answerVisual(answer.text, answer.kind)}
            </button>`,
        )
        .join("")}
    </div>
    ${selectedAnswer ? `<div class="correct-answer ${selectedAnswer.correct ? "ok" : "retry"}">${scene.answerText}</div>` : ""}
  `;
  stage.appendChild(feedback);
}

function communicationGroup(scene) {
  if (scene.group) return scene.group;
  return scene.key === "respect" ? "함께하는 말" : "나를 지키는 말";
}

function renderShield() {
  if (state.index >= shieldScenes.length) {
    renderReviewSummary("소통 연습 복습", "나를 지키는 말과 함께하는 말을 연습했어요.", shieldScenes);
    return;
  }

  const scene = shieldScenes[state.index];
  const sceneText = state.mode === "easy" ? scene.easy || scene.text : scene.text || scene.easy || "";
  const isLastScene = state.index === shieldScenes.length - 1;
  const selectedAnswer = getScoredAnswer("shield");
  const helpPracticeDone = Boolean(state.scoredAnswers.helpPractice[questionScoreKey("helpPractice")]);
  const sceneGroup = communicationGroup(scene);
  const isTogetherScene = sceneGroup === "함께하는 말";
  focusWord.textContent = isTogetherScene ? "존중" : "도움";
  state.bellTaps = helpPracticeDone ? 3 : 0;
  stage.innerHTML = `
    <div class="activity-title">
      <h2>소통 연습</h2>
      <p class="prompt">${isLastScene ? "다음 카드를 누르면 학습을 완료합니다." : state.mode === "easy" ? "말해요." : "필요한 말을 골라요."}</p>
      ${readButton(`${scene.title}. ${sceneText}`)}
    </div>
    ${progressMarkup(state.index + 1, shieldScenes.length, "카드")}
    <div class="scene">
      <div class="scene-art">${illustration(scene.key)}</div>
      <div class="scene-copy">
        <span class="scene-group">${sceneGroup}</span>
        ${state.mode === "easy" ? "" : `<strong>${scene.title}</strong>`}
        <p>${sceneText}</p>
        ${state.mode === "story" ? `<div class="story-question">${scene.question}</div>` : ""}
      </div>
    </div>
    <div class="answers four">
      ${scene.answers
        .map((answer) => (typeof answer === "string" ? { text: answer, correct: true } : answer))
        .map(
          (answer) =>
            `<button class="pill answer-card ${answer.correct ? (isTogetherScene ? "respect" : "help") : "danger"} ${selectedAnswer?.text === answer.text ? "selected" : ""}" data-shield="${answer.text}" data-correct="${answer.correct}" type="button">
              <span class="answer-text">${answer.text}</span>
              ${answerVisual(answer.text, answer.correct ? (isTogetherScene ? "respect" : "help") : "danger")}
            </button>`,
        )
        .join("")}
    </div>
    ${
      isTogetherScene
        ? ""
        : `<div class="help-practice" data-help-practice data-complete="${helpPracticeDone ? "true" : "false"}">
            <button class="bell" data-help-bell type="button">${bellIcon()}<span>도움 벨</span></button>
            <div class="gauge" aria-label="도움 요청 연습 게이지">
              <div class="gauge-fill" data-gauge-fill style="width: ${helpPracticeDone ? "100%" : "0%"}"></div>
            </div>
          </div>`
    }
  `;
  stage.appendChild(feedback);
}

function render() {
  if (state.activity === "home") renderHome();
  if (state.activity === "choice") renderChoice();
  if (state.activity === "safety") renderSafety();
  if (state.activity === "shield") renderShield();
  updateFacilitator();
}

function updatePressedState(selector, activeElement) {
  document.querySelectorAll(selector).forEach((item) => {
    item.setAttribute("aria-pressed", item === activeElement ? "true" : "false");
  });
}

function setActiveActivityButton(activity, choiceEntry = "") {
  document.querySelectorAll("[data-activity]").forEach((item) => {
    const isActive = item.dataset.activity === activity && (activity !== "choice" || item.dataset.choiceEntry === choiceEntry);
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function openChoiceEntry(choiceEntry) {
  state.activity = "choice";
  state.index = 0;
  state.safetyAnswer = null;
  state.choiceSubcategory = null;
  if (choiceEntry === "food" || choiceEntry === "clothes" || choiceEntry === "activity") {
    state.choiceFlow = { type: choiceEntry, step: 0, picks: [] };
    state.choiceCategory = null;
  } else {
    state.choiceFlow = null;
    state.choiceCategory = choiceEntry;
    delete state.choiceSelections[choiceEntry];
  }
  setActiveActivityButton("choice", choiceEntry);
}

function goHome() {
  state.activity = "home";
  state.index = 0;
  state.bellTaps = 0;
  state.safetyAnswer = null;
  state.choiceCategory = null;
  state.choiceSubcategory = null;
  state.choiceFlow = null;
  render();
  moveToQuestionStart();
}

function startMainMenu(menuKey) {
  const menu = mainMenus.find((item) => item.key === menuKey);
  if (!menu) return;
  if (menu.activity === "choice") {
    openChoiceEntry(menu.choiceEntry);
  } else {
    state.activity = menu.activity;
    state.index = 0;
    state.bellTaps = 0;
    state.safetyAnswer = null;
    state.choiceCategory = null;
    state.choiceSubcategory = null;
    state.choiceFlow = null;
    setActiveActivityButton(menu.activity);
  }
  speak(`${menu.title}. ${menu.prompt}`);
  addRecord(`활동 시작: ${menu.title}`);
  render();
  moveToQuestionStart();
}

function updateFacilitator() {
  const isHome = state.activity === "home";
  const isChoice = state.activity === "choice";
  const isSafetyComplete = state.activity === "safety" && state.index >= safetyScenes.length;
  const isShieldComplete = state.activity === "shield" && state.index >= shieldScenes.length;
  const isComplete = isSafetyComplete || isShieldComplete;

  facilitator.hidden = isHome || isChoice || isComplete;
  acceptExpressionButton.hidden = isHome || isChoice || isComplete;
  prevCardButton.hidden = isHome || isChoice || isComplete;
  nextCardButton.hidden = isHome || isChoice || isComplete;
  nextCardButton.textContent = "다음 카드";
}

function moveToQuestionStart() {
  window.requestAnimationFrame(() => {
    const questionStart = stage.querySelector(".activity-title");
    if (!questionStart) return;
    questionStart.scrollIntoView({ block: "start", inline: "nearest" });
  });
}

function moveToChoiceStart() {
  window.requestAnimationFrame(() => {
    const choiceStart = stage.querySelector(".activity-title");
    if (!choiceStart) return;
    choiceStart.scrollIntoView({ block: "start", inline: "nearest" });
  });
}

function clearAutoAdvance() {
  window.clearTimeout(autoAdvanceTimer);
  autoAdvanceTimer = null;
}

function advanceCard({ automatic = false } = {}) {
  if (state.activity !== "safety" && state.activity !== "shield") return;

  if (state.activity === "safety" && state.index >= safetyScenes.length) {
    goHome();
    return;
  }

  if (state.activity === "shield" && state.index >= shieldScenes.length) {
    goHome();
    return;
  }

  state.index += 1;
  state.safetyAnswer = null;
  render();
  moveToQuestionStart();
  if (state.activity === "safety" && state.index >= safetyScenes.length) {
    setFeedback("참 잘했어요.", "참 잘했어요");
  }
  if (state.activity === "shield" && state.index >= shieldScenes.length) {
    setFeedback("참 잘했어요.", "참 잘했어요");
  }
  if (!automatic) clearAutoAdvance();
}

function scheduleAutoAdvance(activity, index) {
  clearAutoAdvance();
  autoAdvanceTimer = window.setTimeout(() => {
    if (state.activity !== activity || state.index !== index) return;
    advanceCard({ automatic: true });
  }, 900);
}

const segmented = document.querySelector(".segmented");
if (segmented) {
  segmented.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-activity]");
    if (!button) return;
    clearAutoAdvance();
    if (button.dataset.activity === "choice") {
      openChoiceEntry(button.dataset.choiceEntry || "food");
    } else {
      state.activity = button.dataset.activity;
      state.index = 0;
      state.safetyAnswer = null;
      state.choiceCategory = null;
      state.choiceSubcategory = null;
      state.choiceFlow = null;
      setActiveActivityButton(button.dataset.activity);
    }
    render();
    moveToQuestionStart();
  });
}

const modeSwitch = document.querySelector(".mode-switch");
if (modeSwitch) {
  modeSwitch.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (!button) return;
    clearAutoAdvance();
    state.mode = button.dataset.mode;
    state.safetyAnswer = null;
    state.choiceCategory = null;
    state.choiceSubcategory = null;
    state.choiceFlow = null;
    document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item === button));
    updatePressedState("[data-mode]", button);
    render();
  });
}

stage.addEventListener("click", (event) => {
  if (interactionLocked) return;

  const speaker = event.target.closest("[data-speak]");
  const mainMenu = event.target.closest("[data-main-menu]");
  const mainHome = event.target.closest("[data-main-home]");
  const choiceCategory = event.target.closest("[data-choice-category]");
  const choiceSubcategory = event.target.closest("[data-choice-subcategory]");
  const choiceOption = event.target.closest("[data-choice-option]");
  const flowOption = event.target.closest("[data-flow-option]");
  const choiceBack = event.target.closest("[data-choice-back]");
  const choiceReset = event.target.closest("[data-choice-reset]");
  const safety = event.target.closest("[data-safety]");
  const shield = event.target.closest("[data-shield]");
  const helpBell = event.target.closest("[data-help-bell]");

  if (speaker && !mainMenu && !mainHome && !choiceCategory && !choiceSubcategory && !choiceOption && !flowOption) {
    speak(speaker.dataset.speak);
    return;
  }

  if (mainHome) {
    clearAutoAdvance();
    goHome();
    return;
  }

  if (mainMenu) {
    clearAutoAdvance();
    lockInteraction(300);
    startMainMenu(mainMenu.dataset.mainMenu);
    return;
  }

  if (helpBell) {
    lockInteraction(260);
    const practice = helpBell.closest("[data-help-practice]");
    if (practice.dataset.complete === "true") return;
    state.bellTaps += 1;
    const progress = Math.min(state.bellTaps, 3) * 33.34;
    practice.querySelector("[data-gauge-fill]").style.width = `${progress}%`;
    speak("선생님 도와주세요");
    if (state.bellTaps >= 3) {
      practice.dataset.complete = "true";
      const isNewPractice = applyHelpPracticeScore(state.index);
      if (isNewPractice) addRecord("도움 벨 3번 누르기");
      setFeedback("도움을 요청했어요.");
      updateCounts();
    }
    return;
  }

  if (choiceReset) {
    const entry = state.choiceFlow?.type || "food";
    openChoiceEntry(entry);
    renderChoice();
    moveToChoiceStart();
    return;
  }

  if (choiceCategory) {
    lockInteraction();
    const categoryKey = choiceCategory.dataset.choiceCategory;
    if (categoryKey === "food" || categoryKey === "clothes") {
      state.choiceFlow = { type: categoryKey, step: 0, picks: [] };
      state.choiceCategory = null;
      state.choiceSubcategory = null;
      speak(choiceCategory.dataset.speak);
      addRecord(`선택 종류: ${choiceCategory.dataset.choiceTitle}`);
      renderChoice();
      moveToChoiceStart();
      return;
    }

    state.choiceCategory = categoryKey;
    state.choiceSubcategory = null;
    speak(choiceCategory.dataset.speak);
    addRecord(`선택 종류: ${choiceCategory.dataset.choiceTitle}`);
    renderChoice();
    moveToChoiceStart();
    return;
  }

  if (choiceSubcategory) {
    lockInteraction();
    state.choiceSubcategory = choiceSubcategory.dataset.choiceSubcategory;
    speak(choiceSubcategory.dataset.speak);
    addRecord(`옷 종류: ${choiceSubcategory.dataset.choiceTitle}`);
    renderChoice();
    moveToChoiceStart();
    return;
  }

  if (choiceBack) {
    openChoiceEntry("food");
    renderChoice();
    moveToChoiceStart();
    return;
  }

  if (flowOption) {
    lockInteraction();
    const steps = getActiveChoiceSteps();
    const step = steps[state.choiceFlow.step];
    const option = step.options.find((item) => item.key === flowOption.dataset.flowOption);
    if (!option) return;

    const pick = {
      key: option.skip ? "noWear" : option.imageKey || option.key,
      title: option.title,
      label: step.resultLabel,
      phrase: option.phrase,
      topic: option.topic,
      skip: Boolean(option.skip),
    };
    state.choiceFlow.picks.push(pick);
    if (state.choiceFlow.type === "activity" && step.key === "participation") {
      const activityPick = state.choiceFlow.picks.find((item) => item.label === "활동");
      state.choiceFlow.summary = `${activityPick?.topic || "이 활동은"} ${option.sentence}.`;
    }
    counts.choice += 1;
    counts.expression += 1;
    speak(option.speak);
    addRecord(`${step.resultLabel}: ${option.title}`);
    state.choiceFlow.step += 1;
    const isFlowComplete = state.choiceFlow.step >= steps.length;
    updateCounts();
    renderChoice();
    moveToChoiceStart();
    setFeedback(isFlowComplete ? "참 잘했어요." : `${option.title} 선택`, isFlowComplete ? "참 잘했어요" : "좋아요");
    return;
  }

  if (choiceOption) {
    lockInteraction();
    document.querySelectorAll(".big-card").forEach((card) => card.classList.remove("selected"));
    choiceOption.classList.add("selected");
    speak(choiceOption.dataset.speak);
    const selectedCategory = choiceCategories.find((category) => category.key === state.choiceCategory);
    const selectedOption = selectedCategory?.options.find((option) => option.key === choiceOption.dataset.choiceOption);
    const selectedTitle = selectedOption?.title || "선택";
    const previousChoice = state.choiceSelections[state.choiceCategory];
    if (!previousChoice) {
      counts.choice += 1;
      counts.expression += 1;
    }
    if (previousChoice?.title !== selectedTitle) addRecord(`${selectedTitle} 선택`);
    state.choiceSelections[state.choiceCategory] = { key: choiceOption.dataset.choiceOption, title: selectedTitle };
    updateCounts();
    renderChoice();
    setFeedback(`${selectedTitle}을 골랐어요.`);
    moveToChoiceStart();
    return;
  }

  if (safety) {
    lockInteraction();
    const answerIndex = state.index;
    const answerText = safety.dataset.answer;
    const isCorrect = safety.dataset.correct === "true";
    speak(answerText);
    const changed = applyScoredAnswer("safety", state.index, {
      text: answerText,
      correct: isCorrect,
      score: safetyScore(safety.dataset.safety, isCorrect),
    });
    if (changed) addRecord(`생활 안전: ${answerText}`);
    state.safetyAnswer = getScoredAnswer("safety");
    setFeedback(isCorrect ? "좋은 방법이에요." : "안 돼요. 다시 골라봐요.", isCorrect ? "좋아요" : "안돼요", isCorrect ? "positive" : "warning");
    renderSafety();
    scheduleAutoAdvance("safety", answerIndex);
  }

  if (shield) {
    lockInteraction();
    const answerIndex = state.index;
    const isCorrect = shield.dataset.correct !== "false";
    speak(shield.dataset.shield);
    const changed = applyScoredAnswer("shield", state.index, {
      text: shield.dataset.shield,
      correct: isCorrect,
      score: shieldScore(shield.dataset.shield, isCorrect),
    });
    if (changed) addRecord(`소통 연습: ${shield.dataset.shield}`);
    setFeedback(isCorrect ? `${shield.dataset.shield}.` : "안 돼요. 다시 골라봐요.", isCorrect ? "좋아요" : "안돼요", isCorrect ? "positive" : "warning");
    renderShield();
    scheduleAutoAdvance("shield", answerIndex);
  }

  updateCounts();
});

acceptExpressionButton.addEventListener("click", () => {
  expressionModal.hidden = false;
});

document.querySelector("#closeExpressionModal").addEventListener("click", () => {
  expressionModal.hidden = true;
  acceptExpressionButton.focus();
});

expressionModal.addEventListener("click", (event) => {
  const method = event.target.closest("[data-expression-method]");
  if (!method) return;
  counts.expression += 1;
  addRecord(`표현 방식: ${method.dataset.expressionMethod}`);
  expressionModal.hidden = true;
  acceptExpressionButton.focus();
  setFeedback(`${method.dataset.expressionMethod}으로 표현했어요.`);
  updateCounts();
});

prevCardButton.addEventListener("click", () => {
  if (state.activity !== "safety" && state.activity !== "shield") return;
  clearAutoAdvance();
  state.index = Math.max(0, state.index - 1);
  state.safetyAnswer = null;
  render();
  moveToQuestionStart();
});

nextCardButton.addEventListener("click", () => {
  clearAutoAdvance();
  advanceCard();
});

document.querySelector("#resetRecord").addEventListener("click", () => {
  Object.keys(counts).forEach((key) => {
    counts[key] = 0;
  });
  records.length = 0;
  state.index = 0;
  state.safetyAnswer = null;
  state.choiceSelections = {};
  state.scoredAnswers = {
    safety: {},
    shield: {},
    helpPractice: {},
  };
  updateCounts();
  goHome();
});

document.querySelector("#showLog").addEventListener("click", () => {
  logList.innerHTML = records.length
    ? records.map((record) => `<li>${record}</li>`).join("")
    : "<li>아직 기록이 없어요.</li>";
  logModal.hidden = false;
});

document.querySelector("#closeLogModal").addEventListener("click", () => {
  logModal.hidden = true;
});

document.querySelector("#printLog").addEventListener("click", () => {
  window.print();
});

render();
updateCounts();
