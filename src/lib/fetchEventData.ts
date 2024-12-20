import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://openapi.seoul.go.kr:8088";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "발급받은 API KEY를 입력하세요";
const SERVICE = "citydata";

// 요청 캐시
const requestCache = new Map();

export async function fetchEventData(location: string) {
  if (requestCache.has(location)) {
    return requestCache.get(location);
  }

  const url = `${BASE_URL}/${API_KEY}/xml/${SERVICE}/1/5/${encodeURIComponent(location)}`;
  console.log(`📊 이벤트 데이터 API 요청 URL: ${url}`);

  try {
    const response = await axios.get(url);
    const xmlData = response.data;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");
    const eventNodes = xmlDoc.querySelectorAll("EVENT_STTS");

    if (eventNodes.length === 0) {
      console.warn(`⚠️ ${location} 이벤트 데이터 없음`);
      return [];
    }

    const events = Array.from(eventNodes).map((node) => ({
      eventName: node.querySelector("EVENT_NM")?.textContent || "정보 없음",
      eventPlace: node.querySelector("EVENT_PLACE")?.textContent || "정보 없음",
      eventPeriod: node.querySelector("EVENT_PERIOD")?.textContent || "정보 없음",
      thumbnail: node.querySelector("THUMBNAIL")?.textContent || "",
      url: node.querySelector("URL")?.textContent || "#",
      coordinates: [
        parseFloat(node.querySelector("EVENT_X")?.textContent || "0"),
        parseFloat(node.querySelector("EVENT_Y")?.textContent || "0"),
      ],
    }));

    requestCache.set(location, events); // 요청 결과를 캐싱
    console.log(`✅ ${location} ${events.length}개의 이벤트 데이터 추가`);
    return events;
  } catch (error) {
    console.error(`❌ ${location} 이벤트 데이터 요청 실패:`, error);
    return [];
  }
}
