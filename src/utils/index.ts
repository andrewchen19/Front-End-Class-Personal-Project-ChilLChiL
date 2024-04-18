import dayjs from "dayjs";

export const splitText = (text: string): string[] => {
  const textArray = text.split("\r\n");

  return textArray;
};

interface LocalSpots {
  chin: string;
}
export const localSpotsList: LocalSpots[] = [
  { chin: "佳樂水" },
  { chin: "南灣" },
  { chin: "旗津" },
  { chin: "竹南" },
  { chin: "白沙灣" },
  { chin: "金山" },
  { chin: "翡翠灣" },
  { chin: "福隆" },
  { chin: "大溪" },
  { chin: "雙獅" },
  { chin: "烏石港" },
  { chin: "臭水" },
  { chin: "鹽寮漁港" },
  { chin: "磯崎" },
  { chin: "八仙洞" },
  { chin: "成功" },
  { chin: "東河" },
  { chin: "金樽" },
  { chin: "其他" },
];

export const formatCoverTime = (time: number): string => {
  return dayjs(time).format("YYYY-MM-DD");
};
