export interface UserInfo {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
  theme?: string;
  articlesCollection?: string[] | [];
  localSpots?: string[] | [];
  foreignSpots?: string[] | [];
}

// foreign spot
export interface WhenToScore {
  title: string;
  season: string;
  bestFor: string;
  crowdFactor: string;
  desc: string;
}

// local spot
export interface WaveInfo {
  surf: {
    min: number;
    max: number;
  };
  swells: {
    direction: number;
    period: number;
  }[];
}
export interface tideInfo {
  height: number;
}
export interface WindInfo {
  direction: number;
  directionType: string;
  gust: number;
}
export interface WeatherInfo {
  condition: string;
  temperature: number;
}
export interface CommentInfo {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  comment: string;
  created_at: number;
}
