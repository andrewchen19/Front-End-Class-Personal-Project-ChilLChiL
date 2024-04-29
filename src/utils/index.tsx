import { ReactElement } from "react";
import dayjs from "dayjs";

import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";

// weather icons
import clearDay from "../assets/weather/clearDay.svg";
import clearNight from "../assets/weather/clearNight.svg";
import cloudy from "../assets/weather/cloudy.svg";
import drizzle from "../assets/weather/drizzle.svg";
import notAvailable from "../assets/weather/notAvailable.svg";
import overcastNight from "../assets/weather/overcast-night.svg";
import overcast from "../assets/weather/overcast.svg";
import fog from "../assets/weather/fog.svg";
import partlyCloudyDay from "../assets/weather/partlyCloudyDay.svg";
import partlyCloudyDayRain from "../assets/weather/partlyCloudyDayRain.svg";
import partlyCloudyNight from "../assets/weather/partlyCloudyNight.svg";
import partlyCloudyNightDrizzle from "../assets/weather/partlyCloudyNightDrizzle.svg";
import partlyCloudyNightRain from "../assets/weather/partlyCloudyNightRain.svg";
import rain from "../assets/weather/rain.svg";
import thunderstormsExtreme from "../assets/weather/thunderstorms-extreme.svg";
import thunderstormsNightExtreme from "../assets/weather/thunderstorms-night-extreme.svg";
import thunderstorms from "../assets/weather/thunderstorms.svg";
import thunderstormsDayRain from "../assets/weather/thunderstormsDayRain.svg";
import thunderstormsNight from "../assets/weather/thunderstormsNight.svg";
import thunderstormsNightRain from "../assets/weather/thunderstormsNightRain.svg";

export const splitText = (text: string): string[] => {
  const textArray = text.split("\r\n");

  return textArray;
};

// turn html content into plain text without html tags
export function htmlToPlainText(htmlContent: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const plainTextArray: string[] = [];

  function traverse(node: ChildNode) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      plainTextArray.push(node.textContent.trim());
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const childNode of node.childNodes) {
        traverse(childNode);
      }
    }
  }

  for (const node of doc.body.childNodes) {
    traverse(node);
  }

  // console.log(plainTextArray.filter(Boolean));

  const textArr = plainTextArray.filter(Boolean);
  const plainText = textArr.join(" ");

  return plainText;
}

interface LocalSpots {
  chin: string;
  eng: string;
}
export const localSpotsList: LocalSpots[] = [
  { chin: "佳樂水", eng: "jialeshuei" },
  { chin: "南灣", eng: "nanwan" },
  { chin: "旗津", eng: "qijin" },
  { chin: "竹南", eng: "chunan" },
  { chin: "白沙灣", eng: "baishawan" },
  { chin: "金山", eng: "jinshan" },
  { chin: "翡翠灣", eng: "green-bay" },
  { chin: "福隆", eng: "fulong" },
  { chin: "大溪", eng: "dashi" },
  { chin: "雙獅", eng: "double-lions" },
  { chin: "烏石港", eng: "wushi" },
  { chin: "臭水", eng: "choushui" },
  { chin: "鹽寮漁港", eng: "gongs" },
  { chin: "磯崎", eng: "jiqi" },
  { chin: "八仙洞", eng: "bashiendong" },
  { chin: "成功", eng: "chenggong" },
  { chin: "東河", eng: "donghe" },
  { chin: "金樽", eng: "jinzun" },
  { chin: "其他", eng: "others" },
];

export const changeSpotName = (name: string): string => {
  let newName = "";
  if (name === "jialeshuei") {
    newName = "佳樂水";
  }
  if (name === "nanwan") {
    newName = "南灣";
  }
  if (name === "qijin") {
    newName = "旗津";
  }
  if (name === "chunan") {
    newName = "竹南";
  }
  if (name === "baishawan") {
    newName = "白沙灣";
  }
  if (name === "jinshan") {
    newName = "金山";
  }
  if (name === "green-bay") {
    newName = "翡翠灣";
  }
  if (name === "fulong") {
    newName = "福隆";
  }
  if (name === "dashi") {
    newName = "大溪";
  }
  if (name === "double-lions") {
    newName = "雙獅";
  }
  if (name === "wushi") {
    newName = "烏石港";
  }
  if (name === "choushui") {
    newName = "臭水";
  }
  if (name === "gongs") {
    newName = "鹽寮漁港";
  }
  if (name === "jiqi") {
    newName = "磯崎";
  }
  if (name === "bashiendong") {
    newName = "八仙洞";
  }
  if (name === "chenggong") {
    newName = "成功";
  }
  if (name === "donghe") {
    newName = "東河";
  }
  if (name === "jinzun") {
    newName = "金樽";
  }
  if (name === "others") {
    newName = "其他";
  }

  return newName;
};

export const changeTagName = (name: string): string => {
  let newName = "";
  if (name === "travel") {
    newName = "旅遊雜記";
  }
  if (name === "knowledge") {
    newName = "知識技巧";
  }
  if (name === "life") {
    newName = "生活分享";
  }
  if (name === "gear") {
    newName = "裝備介紹";
  }
  if (name === "activity") {
    newName = "活動競賽";
  }
  if (name === "secondhand") {
    newName = "二手拍賣";
  }
  return newName;
};

export const formatTime = (time: number): string => {
  return dayjs(time).format("YYYY-MM-DD");
};

export const formatMessageTime = (time: number): string => {
  return dayjs(time).format("MM/DD HH:mm");
};

export const hours: string[] = [
  "00",
  "08",
  "16",
  "00",
  "08",
  "16",
  "00",
  "08",
  "16",
];

export const changeWindName = (name: string): string => {
  let windName = "";
  if (name === "Offshore") {
    windName = "離岸風";
  }
  if (name === "Onshore") {
    windName = "岸風";
  }
  if (name === "Cross-shore") {
    windName = "平行風";
  }
  return windName;
};

export const changeToWeatherIcon = (name: string): ReactElement => {
  if (name === "CLEAR" || name === "MOSTLY_CLEAR") {
    return <img src={clearDay} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "MOSTLY_CLOUDY") {
    return <img src={partlyCloudyDay} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "CLOUDY" || name === "NIGHT_CLOUDY") {
    return <img src={cloudy} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "OVERCAST") {
    return <img src={overcast} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "RAIN_AND_FOG") {
    return <img src={fog} alt="weather-icon" className="h-6 w-6" />;
  }
  if (
    name === "LIGHT_RAIN" ||
    name === "LIGHT_SHOWERS" ||
    name === "LIGHT_SHOWERS_POSSIBLE" ||
    name === "DRIZZLE"
  ) {
    return <img src={drizzle} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "RAIN") {
    return <img src={rain} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "BRIEF_SHOWERS" || name === "BRIEF_SHOWERS_POSSIBLE") {
    return (
      <img src={partlyCloudyDayRain} alt="weather-icon" className="h-6 w-6" />
    );
  }
  if (name === "THUNDER_STORMS") {
    return <img src={thunderstorms} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "THUNDER_SHOWERS") {
    return (
      <img src={thunderstormsDayRain} alt="weather-icon" className="h-6 w-6" />
    );
  }
  if (name === "HEAVY_THUNDER_STORMS") {
    return (
      <img src={thunderstormsExtreme} alt="weather-icon" className="h-6 w-6" />
    );
  }
  if (name === "NIGHT_CLEAR") {
    return <img src={clearNight} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "NIGHT_MOSTLY_CLOUDY") {
    return (
      <img src={partlyCloudyNight} alt="weather-icon" className="h-6 w-6" />
    );
  }
  if (
    name === "NIGHT_LIGHT_SHOWERS_POSSIBLE" ||
    name === "NIGHT_LIGHT_RAIN" ||
    name === "NIGHT_LIGHT_SHOWERS" ||
    name === "NIGHT_DRIZZLE"
  ) {
    return (
      <img
        src={partlyCloudyNightDrizzle}
        alt="weather-icon"
        className="h-6 w-6"
      />
    );
  }
  if (
    name === "NIGHT_BRIEF_SHOWERS_POSSIBLE" ||
    name === "NIGHT_BRIEF_SHOWERS"
  ) {
    return (
      <img src={partlyCloudyNightRain} alt="weather-icon" className="h-6 w-6" />
    );
  }
  if (name === "NIGHT_OVERCAST") {
    return <img src={overcastNight} alt="weather-icon" className="h-6 w-6" />;
  }
  if (name === "NIGHT_THUNDER_STORMS") {
    return (
      <img src={thunderstormsNight} alt="weather-icon" className="h-6 w-6" />
    );
  }
  if (name === "NIGHT_THUNDER_SHOWERS") {
    return (
      <img
        src={thunderstormsNightRain}
        alt="weather-icon"
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_HEAVY_THUNDER_STORMS") {
    return (
      <img
        src={thunderstormsNightExtreme}
        alt="weather-icon"
        className="h-6 w-6"
      />
    );
  }

  return <img src={notAvailable} alt="weather-icon" className="h-6 w-6" />;
};

export const calculateTimeAgo = (commentTime: number): string => {
  const currentTime = new Date();
  const commentDate = new Date(commentTime);

  // Calculate the difference in milliseconds
  const timeDifference = currentTime.getTime() - commentDate.getTime();

  // Convert milliseconds to appropriate time units
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  // Return the appropriate time ago string based on the time difference
  if (years > 0) {
    return `about ${years} ${years === 1 ? "year" : "years"} ago`;
  } else if (months > 0) {
    return `about ${months} ${months === 1 ? "month" : "months"} ago`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (hours > 0) {
    return `about ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (minutes > 0) {
    return `about ${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return "less than a minute ago";
  }
};

export const splitStringUsingRegex = (inputString: string): string[] => {
  const characters: string[] = [];
  const regex = /[\s\S]/gu;

  let match;

  while ((match = regex.exec(inputString)) !== null) {
    characters.push(match[0]);
  }

  return characters;
};

interface Review {
  imgURL: string;
  userName: string;
  rating: number;
  feedback: string;
}
export const reviews: Review[] = [
  {
    imgURL: user1,
    userName: "Anderson Brown",
    rating: 4.7,
    feedback:
      "As a surfing enthusiast, having a website that provides real-time updates on local surf spots is fantastic. Highly recommended!",
  },
  {
    imgURL: user2,
    userName: "Lota Monica",
    rating: 4.5,
    feedback:
      "As a beginner surfer, this website offers a wealth of useful information, benefiting from here greatly!",
  },
];
