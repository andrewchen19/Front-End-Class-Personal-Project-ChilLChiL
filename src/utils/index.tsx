import { ReactElement } from "react";

// day.js
import dayjs from "dayjs";

// react echart
import { ReactEChartsProps } from "../components/ReactEchart";

// image
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";

// react icon
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdSurfing } from "react-icons/md";
import { RiArticleLine } from "react-icons/ri";

// weather icons
import clearDay from "../assets/weather/clearDay.svg";
import clearNight from "../assets/weather/clearNight.svg";
import cloudy from "../assets/weather/cloudy.svg";
import drizzle from "../assets/weather/drizzle.svg";
import fogNight from "../assets/weather/fog-night.svg";
import fog from "../assets/weather/fog.svg";
import notAvailable from "../assets/weather/notAvailable.svg";
import overcastNight from "../assets/weather/overcast-night.svg";
import overcast from "../assets/weather/overcast.svg";
import mist from "../assets/weather/mist.svg";
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
    windName = "陸風";
  }
  if (name === "Onshore") {
    windName = "海風";
  }
  if (name === "Cross-shore") {
    windName = "平行風";
  }
  return windName;
};

export const changeDirection = (direction: number): string => {
  let newDirection;

  if (direction >= 0 && direction < 180) {
    newDirection = (direction + 180).toFixed(0);
    return newDirection;
  } else {
    newDirection = (direction + 180 - 360).toFixed(0);
    return newDirection;
  }
};

export const changeToWeatherIcon = (name: string): ReactElement => {
  if (name === "CLEAR" || name === "MOSTLY_CLEAR") {
    return (
      <img src={clearDay} alt="weather-icon" title={name} className="h-6 w-6" />
    );
  }
  if (name === "MOSTLY_CLOUDY") {
    return (
      <img
        src={partlyCloudyDay}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "CLOUDY" || name === "NIGHT_CLOUDY") {
    return (
      <img src={cloudy} alt="weather-icon" title={name} className="h-6 w-6" />
    );
  }
  if (name === "OVERCAST") {
    return (
      <img src={overcast} alt="weather-icon" title={name} className="h-6 w-6" />
    );
  }
  if (name === "RAIN_AND_FOG") {
    return (
      <img src={fog} alt="weather-icon" title={name} className="h-6 w-6" />
    );
  }
  if (
    name === "LIGHT_RAIN" ||
    name === "LIGHT_SHOWERS" ||
    name === "LIGHT_SHOWERS_POSSIBLE" ||
    name === "DRIZZLE"
  ) {
    return (
      <img src={drizzle} alt="weather-icon" title={name} className="h-6 w-6" />
    );
  }
  if (name === "RAIN") {
    return (
      <img src={rain} alt="weather-icon" title={name} className="h-6 w-6" />
    );
  }
  if (name === "BRIEF_SHOWERS" || name === "BRIEF_SHOWERS_POSSIBLE") {
    return (
      <img
        src={partlyCloudyDayRain}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "THUNDER_STORMS") {
    return (
      <img
        src={thunderstorms}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "THUNDER_SHOWERS") {
    return (
      <img
        src={thunderstormsDayRain}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "HEAVY_THUNDER_STORMS") {
    return (
      <img
        src={thunderstormsExtreme}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_CLEAR" || name === "NIGHT_MOSTLY_CLEAR") {
    return (
      <img
        src={clearNight}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_MOSTLY_CLOUDY") {
    return (
      <img
        src={partlyCloudyNight}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
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
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (
    name === "NIGHT_BRIEF_SHOWERS_POSSIBLE" ||
    name === "NIGHT_BRIEF_SHOWERS"
  ) {
    return (
      <img
        src={partlyCloudyNightRain}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_OVERCAST") {
    return (
      <img
        src={overcastNight}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_THUNDER_STORMS") {
    return (
      <img
        src={thunderstormsNight}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_THUNDER_SHOWERS") {
    return (
      <img
        src={thunderstormsNightRain}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_HEAVY_THUNDER_STORMS") {
    return (
      <img
        src={thunderstormsNightExtreme}
        alt="weather-icon"
        title={name}
        className="h-6 w-6"
      />
    );
  }
  if (name === "NIGHT_MIST") {
    return (
      <img src={mist} alt="weather-icon" title={name} className="h-6 w-6" />
    );
  }
  if (name === "NIGHT_FOG") {
    return (
      <img src={fogNight} alt="weather-icon" title={name} className="h-6 w-6" />
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

interface WeatherProps {
  waveData: number[];
  gustData: number[];
  tempData: number[];
}

// desktop (bigger 1280px)
export const executeOption = ({
  waveData,
  gustData,
  tempData,
}: WeatherProps) => {
  const colors = ["#F48080", "#70ACC7", "#968095"];

  const option: ReactEChartsProps["option"] = {
    color: colors,

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      right: "20%",
    },
    toolbox: {
      feature: {
        restore: { show: true },
        magicType: { show: true, type: ["line", "bar"] },
      },
      left: "15%",
    },
    legend: {
      data: ["Temperature", "Wave Height", "Gust Speed"],
      left: "center",
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        data: ["00", "08", "16", "00", "08", "16", "00", "08", "16"],
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "最大浪高",
        position: "right",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1],
          },
        },
        min: 0,
        max: 2.4,
        interval: 0.4,
        axisLabel: {
          formatter: "{value} m",
        },
      },
      {
        type: "value",
        name: "陣風",
        position: "right",
        alignTicks: true,
        offset: 80,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[2],
          },
        },
        min: 0,
        max: 60,
        interval: 10,
        axisLabel: {
          formatter: "{value} km/h",
        },
      },
      {
        type: "value",
        name: "溫度",
        position: "left",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        min: 5,
        max: 35,
        interval: 5,
        axisLabel: {
          formatter: "{value} °C",
        },
      },
    ],
    series: [
      {
        name: "Temperature",
        type: "line",
        yAxisIndex: 2,
        data: tempData,
      },
      {
        name: "Wave Height",
        type: "bar",
        data: waveData,
      },
      {
        name: "Gust Speed",
        type: "bar",
        yAxisIndex: 1,
        data: gustData,
      },
    ],
  };

  return option;
};

// tablet (bigger 768px)
export const executeOption2 = ({
  waveData,
  gustData,
  tempData,
}: WeatherProps) => {
  const colors = ["#F48080", "#70ACC7", "#968095"];

  const option: ReactEChartsProps["option"] = {
    color: colors,

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      right: "23%",
    },
    toolbox: {
      feature: {
        restore: { show: true },
        magicType: { show: false, type: ["line", "bar"] },
      },
      left: "0%",
    },
    legend: {
      data: ["Temperature", "Wave Height", "Gust Speed"],
      left: "center",
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        data: ["00", "08", "16", "00", "08", "16", "00", "08", "16"],
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "最大浪高",
        position: "right",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1],
          },
        },
        min: 0,
        max: 2.4,
        interval: 0.4,
        axisLabel: {
          formatter: "{value} m",
        },
      },
      {
        type: "value",
        name: "陣風",
        position: "right",
        alignTicks: true,
        offset: 42,
        axisLine: {
          show: false,
          lineStyle: {
            color: colors[2],
          },
        },
        min: 0,
        max: 60,
        interval: 10,
        axisLabel: {
          formatter: "{value} km/h",
        },
      },
      {
        type: "value",
        name: "溫度",
        position: "left",
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0],
          },
        },
        min: 5,
        max: 35,
        interval: 5,
        axisLabel: {
          formatter: "{value} °C",
        },
      },
    ],
    series: [
      {
        name: "Temperature",
        type: "line",
        yAxisIndex: 2,
        data: tempData,
      },
      {
        name: "Wave Height",
        type: "bar",
        data: waveData,
      },
      {
        name: "Gust Speed",
        type: "bar",
        yAxisIndex: 1,
        data: gustData,
      },
    ],
  };

  return option;
};

// mobile
export const executeOption3 = ({
  waveData,
  gustData,
  tempData,
}: WeatherProps) => {
  const colors = ["#F48080", "#70ACC7", "#968095"];

  const option: ReactEChartsProps["option"] = {
    color: colors,

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    grid: {
      right: "30%",
    },
    toolbox: {
      feature: {
        restore: { show: false },
        magicType: { show: false, type: ["line", "bar"] },
      },
    },
    legend: {
      type: "scroll",
      data: ["Temperature", "Wave Height", "Gust Speed"],
      itemGap: 30,
      left: 20,
    },
    xAxis: [
      {
        type: "category",
        axisTick: {
          alignWithLabel: true,
        },
        data: ["00", "08", "16", "00", "08", "16", "00", "08", "16"],
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "最大浪高",
        position: "right",
        alignTicks: true,
        axisLine: {
          show: false,
          lineStyle: {
            color: colors[1],
          },
        },
        min: 0,
        max: 2.4,
        interval: 0.4,
        axisLabel: {
          formatter: "{value} m",
        },
      },
      {
        type: "value",
        name: "陣風",
        position: "right",
        alignTicks: false,
        offset: 38,
        axisLine: {
          show: false,
          lineStyle: {
            color: colors[2],
          },
        },
        min: 0,
        max: 60,
        interval: 10,
        axisLabel: {
          formatter: "{value} km/h",
        },
      },
      {
        type: "value",
        name: "溫度",
        position: "left",
        alignTicks: false,
        offset: -7,
        axisLine: {
          show: false,
          lineStyle: {
            color: colors[0],
          },
          onZeroAxisIndex: 50,
        },
        min: 5,
        max: 35,
        interval: 5,
        axisLabel: {
          formatter: "{value} °C",
        },
      },
    ],
    series: [
      {
        name: "Temperature",
        type: "line",
        yAxisIndex: 2,
        data: tempData,
      },
      {
        name: "Wave Height",
        type: "bar",
        data: waveData,
      },
      {
        name: "Gust Speed",
        type: "bar",
        yAxisIndex: 1,
        data: gustData,
      },
    ],
  };

  return option;
};

export const profileImageList: string[] = [
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen1.png?alt=media&token=a991ddf6-2639-4617-97c7-0b9d3a2b6cba",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen2.png?alt=media&token=e28f476a-6c8c-41f2-9107-3dbd8d5a82be",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen3.png?alt=media&token=b58da67c-7e32-431a-99a5-21fde685041c",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen4.png?alt=media&token=ae094e5c-1c01-440c-af3d-76c5ac81d606",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen5.png?alt=media&token=ee3fb869-d2fd-45f1-81a2-c9025175a5e0",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen6.png?alt=media&token=388069c0-2135-4985-863d-a1dfa7fee618",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen7.png?alt=media&token=dbd075d1-8d8d-43e1-888a-8ccf3418abf8",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen8.png?alt=media&token=7903b118-36b2-49c9-b00c-514086d981c6",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fmen9.png?alt=media&token=3054f59a-80c6-432e-be1a-a194e014ac34",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen1.png?alt=media&token=2f561d70-dadf-4701-90da-c95f8d9758b7",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen2.png?alt=media&token=fcb60c3e-dba0-4387-ac65-5c95393c92db",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen3.png?alt=media&token=7ce1d6dd-c63c-48a9-a13a-5b0ffb4a66ca",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen4.png?alt=media&token=c35325bf-86f6-40f6-b4df-9cae26aa895e",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen5.png?alt=media&token=cda2bb62-5ddd-4026-b944-c435df5d3991",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen6.png?alt=media&token=1f73568f-d7bf-4ae5-a745-2f748391213c",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen7.png?alt=media&token=880295c4-f27c-46e0-8661-42d4f43a425e",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen8.png?alt=media&token=98a3d09d-551a-49c7-bd45-4ab1cb321626",
  "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/default_avatar%2Fwomen9.png?alt=media&token=0b3963bf-434f-4d08-a15f-90b7281d1b20",
];

export const checkSpotsLng = (name: string): number => {
  switch (name) {
    case "jialeshuei":
      return 120.847076;
    case "nanwan":
      return 120.761719;
    case "qijin":
      return 120.266905;
    case "chunan":
      return 120.855728;
    case "baishawan":
      return 121.5118743;
    case "jinshan":
      return 121.644379;
    case "green-bay":
      return 121.687927;
    case "fulong":
      return 121.949249;
    case "dashi":
      return 121.886818;
    case "double-lions":
      return 121.851952;
    case "wushi":
      return 121.842392;
    case "choushui":
      return 121.832253;
    case "gongs":
      return 121.5856075;
    case "jiqi":
      return 121.5482475;
    case "bashiendong":
      return 121.48123;
    case "chenggong":
      return 121.397479;
    case "donghe":
      return 121.312485;
    case "jinzun":
      return 121.295114;
    default:
      return 120.9;
  }
};

export const checkSpotsLat = (name: string): number => {
  switch (name) {
    case "jialeshuei":
      return 21.987741;
    case "nanwan":
      return 21.958252;
    case "qijin":
      return 22.610208;
    case "chunan":
      return 24.698902;
    case "baishawan":
      return 25.2848855;
    case "jinshan":
      return 25.231594;
    case "green-bay":
      return 25.188107;
    case "fulong":
      return 25.021452;
    case "dashi":
      return 24.932688;
    case "double-lions":
      return 24.890467;
    case "wushi":
      return 24.873783;
    case "choushui":
      return 24.856077;
    case "gongs":
      return 23.829665;
    case "jiqi":
      return 23.707683;
    case "bashiendong":
      return 23.398333;
    case "chenggong":
      return 23.115682;
    case "donghe":
      return 22.975674;
    case "jinzun":
      return 22.955943;
    default:
      return 23.659;
  }
};

export const directionAbbreviation = (degree: number): string => {
  if (degree >= 11.25 && degree < 33.75) {
    return "北北東";
  } else if (degree >= 33.75 && degree < 56.25) {
    return "東北";
  } else if (degree >= 56.25 && degree < 78.75) {
    return "東北東";
  } else if (degree >= 78.75 && degree < 101.25) {
    return "東";
  } else if (degree >= 101.25 && degree < 123.75) {
    return "東南東";
  } else if (degree >= 123.75 && degree < 146.25) {
    return "東南";
  } else if (degree >= 146.25 && degree < 168.75) {
    return "南南東";
  } else if (degree >= 168.75 && degree < 191.25) {
    return "南";
  } else if (degree >= 191.25 && degree < 213.75) {
    return "南南西";
  } else if (degree >= 213.75 && degree < 236.25) {
    return "西南";
  } else if (degree >= 236.25 && degree < 258.75) {
    return "西南西";
  } else if (degree >= 258.75 && degree < 281.25) {
    return "西";
  } else if (degree >= 281.25 && degree < 303.75) {
    return "西北西";
  } else if (degree >= 303.75 && degree < 326.25) {
    return "西北";
  } else if (degree >= 326.25 && degree < 348.75) {
    return "北北西";
  } else {
    return "北";
  }
};

export interface ProfileNavbarProps {
  title: string;
  href: string;
  icon: ReactElement;
}
export const profileNavbarList: ProfileNavbarProps[] = [
  {
    title: "個人訊息",
    href: "/profile/my-info",
    icon: <IoPersonCircleOutline className="h-5 w-5" />,
  },
  {
    title: "收藏浪點",
    href: "/profile/my-collections",
    icon: <MdSurfing className="h-5 w-5" />,
  },
  {
    title: "文章列表",
    href: "/profile/my-articles",
    icon: <RiArticleLine className="h-5 w-5" />,
  },
];

export const isOnlyEmptyParagraphs = (htmlString: string) => {
  // Remove HTML tags
  const text = htmlString.replace(/<[^>]*>/g, "");

  // Check if the remaining string contains only whitespace characters
  return /^\s*$/.test(text);
};
