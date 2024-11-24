interface FeedbackResult {
  feedbackList: {
    start: number;
    end: number;
    feedType: string;
    time: string;
  }[];
  sleep_count: number;
  phone_count: number;
  posture_count: number;
  feedTime: number;
}

const getResultFeedBack = (
  feedbackList: any[],
  totalTime: number
): FeedbackResult => {
  const timeLineList: any[] = [];
  let sleep_count = 0;
  let phone_count = 0;
  let posture_count = 0;
  let feedTime = 0;

  // 피드백 개수 count, 피드백 timeLine 객체 생성
  for (let i = 0; i < feedbackList.length; i++) {
    const currentTime = Number(feedbackList[i].time);
    const currentFeedType = feedbackList[i].feedType; // 배열
    const startTime = Math.max(0, currentTime - 5);
    const endTime = Math.min(totalTime, currentTime + 5);

    if (currentFeedType) {
      currentFeedType.forEach((feed: string) => {
        if (feed === "bad_posture") posture_count++;
        else if (feed === "is_sleeping") sleep_count++;
        else if (feed === "is_holding_phone") phone_count++;

        timeLineList.push({
          start: startTime,
          end: endTime,
          feedType: feed,
          time: `${formatTime(startTime)}~${formatTime(endTime)}`,
        });
      });
    }
    feedTime += 10;
  }

  return {
    feedbackList: timeLineList,
    sleep_count: sleep_count,
    phone_count: phone_count,
    posture_count: posture_count,
    feedTime: feedTime,
  };
};

const getAdvice = (
  sleepCount: number,
  phoneCount: number,
  postureCount: number
) => {
  let advice = "";
  if (sleepCount > 0) {
    advice += "공부 도중에 잠을 자는 것에 주의 하세요.";
  }
  if (phoneCount > 0) {
    advice += "핸드폰을 저리 치우십시오.";
  }
  if (postureCount > 0) {
    advice += "바른 자세를 유지해야 집중이 더 잘 됩니다.";
  }
  return advice;
}; // chatGPT 연결

// 피드백 유형에 따라 댓글을 반환
const getComment = (feedType: string): string => {
  if (feedType === "bad_posture") {
    return "자세 경고";
  } else if (feedType === "is_sleeping") {
    return "졸음 경고";
  } else if (feedType === "is_holding_phone") {
    return "휴대폰 경고";
  } else {
    return "";
  }
};

// 시간을 "HH:MM:SS" 형식으로 변환
const formatTime = (time: number): string => {
  const getSeconds = `0${time % 60}`.slice(-2);
  const minutes = `${Math.floor(time / 60)}`;
  const getMinutes = `0${parseInt(minutes) % 60}`.slice(-2);
  const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
  return `${getHours}:${getMinutes}:${getSeconds}`;
};

export default {
  getResultFeedBack,
  getAdvice,
};
