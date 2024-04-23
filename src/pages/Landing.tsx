import React from "react";

// import React, { useEffect } from "react";
// import { db } from "../main";
// import { doc, setDoc } from "firebase/firestore";
// import { nanoid } from "nanoid";

const Landing: React.FC = () => {
  // async function writeData(): Promise<void> {
  //   const id = nanoid();
  //   await setDoc(doc(db, "foreign-spots", "fiji"), {
  //     id,
  //     country: { eng: "fiji", location: "fiji", chin: "斐濟" },
  //     coverImage:
  //       "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/foreign-spots%2Ffiji%2Fcover.jpg?alt=media&token=90953fe0-375b-4630-9ce2-7e994826b339",
  //     likes_amount: 0,
  //     category: ["may", "tube"],
  //     primaryColor: "#F48080",
  //     secondaryColor: "#3A4972",
  //     spotImage:
  //       "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/foreign-spots%2Ffiji%2Fspot.jpg?alt=media&token=707ea24e-3255-4b63-99c5-1f3910d4252d",
  //     spotDesc:
  //       "An idyllic vacation spot for anyone who values tropical beauty, the pristine barrier reefs of Fiji are primo surfing real estate. Sitting quite close to Fiji’s biggest island and hub for everything, Viti Levu, Cloudbreak and Restaurants are two of the best waves on the planet. These legendary lefts aren’t the only game in town, though -- there are breaks stretching along Viti Levu’s Coral Coast all the way to Suva, Fiji’s vibrant capital city. Bottom line: Fiji is paradise, and one of the most coveted surfing destinations in the South Pacific. You can’t lose.",
  //     whenToScore: [
  //       {
  //         title: "prime",
  //         season: "May - September",
  //         bestFor: "Intermediate - Advanced",
  //         crowdFactor: "Medium",
  //         desc: "If you’re a charger looking to score the largest waves Fiji has to offer, your best odds are from May through September. This is when the Southern Ocean – Fiji’s primary swell source – is in overdrive, and it’s rare to go more than a few days without at least one overhead or larger swell. Cloudbreak gets the majority of the hype in Fiji, and for good reason. It only sporadically drops below head-high during the peak south swell season and can hold as big as any surfer could ever want. It gets especially good on SW to SSW swells with long periods of 17 seconds or more. That’s when the lines seemingly stretch from the famous ‘ledge’ (the primary takeoff zone once the surf gets into the double-overhead range) all the way to Tavarua, about a mile and a half away.",
  //       },
  //       {
  //         title: "shoulder",
  //         season: "October - November & March - April",
  //         bestFor: "Intermediate - Advanced",
  //         crowdFactor: "Medium",
  //         desc: "While the average surf size dips marginally from the high season, it is still possible to get pumping, mid to long-period SW swells during the shoulder seasons in Fiji. Generally speaking, though, this is when the surf starts to slow down and the wind starts to shift around. Beyond slightly smaller and less-frequent swells, the wind tends to be lighter during these months. SE to ESE trades remain dominant but are often light with many days of light/variable wind and glassy conditions. The lighter winds mean all spots will have clean conditions, so as long as a mid to long-period, 3-4’ swell is running, the surfers are able to spread out.",
  //       },
  //       {
  //         title: "low",
  //         season: "December - February",
  //         bestFor: "Beginner - Advanced",
  //         crowdFactor: "Light",
  //         desc: "If you like hot, glassy and fun surf, then the low season in Fiji is your jam. It’s still very possible to get a decent-size swell during these months, as the Southern Ocean never completely stops. December tends to be an especially sneaky, good month with a handful of fun to medium-size swells on average and light wind. But your odds of getting something solid are reduced significantly and you may need to wait out multi-day flat spells to get rideable surf. The good news is you’ll be in paradise where there’s no shortage of fun things to do.",
  //       },
  //     ],
  //     quote: {
  //       image:
  //         "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/foreign-spots%2Ffiji%2Fquote.jpg?alt=media&token=2cce21ef-9dcc-41ed-98a0-573c9bf1d776",
  //       name: "Inia Nakalevu",
  //       desc: "We have such beautiful reefbreaks, and sharing waves with a smiling Fijian and feeling welcome, I think that’s something that makes Fiji unique. It’s a special place.",
  //     },
  //     travelEssentials: {
  //       image:
  //         "https://firebasestorage.googleapis.com/v0/b/chillchill-9a1e2.appspot.com/o/foreign-spots%2Ffiji%2Ftravel.jpg?alt=media&token=a7de0c51-3782-435e-8180-781bbbcded6a",
  //       culture:
  //         "The Fijian people are known worldwide for their warmth, openheartedness and cheerfulness. You’ll hear a lot of Bula!, which is like the Fijian version of Aloha and reflects the welcoming spirit of the people. (The longer version of the greeting — ni sa bula vinaka —translates to “wishing you happiness and good health.”)",
  //       getThere:
  //         "Once you arrive at Nadi International Airport on the main island of Fiji, you’ll need to drive or take a shuttle to your hotel, surf camp or resort. For those staying on Tavarua or Namotu, you’ll take a 45-minute shuttle to the boat launch. From there, it’s a 30-minute boat ride to either island.",
  //       bring:
  //         "There are waves for every type of surfer in Fiji, but the marquee spots -- Cloudbreak, Restaurants, The Right — cater to the high-performance shortboard crowd. So, if that’s your vibe and skill level, be sure to pack the fastest, most agile boards you’ve got, as well as a step-up for when it gets heavy. Bring all your tropical surf trip essentials, naturally, as well as t-shirts, hats and other swag to stoke out the locals and return their kindness and generosity.",
  //       downTime:
  //         "Fiji’s a tropical paradise. When you’re not surfing you can fish, dive, stroll along the beach, climb coconut trees, lounge by a pool with umbrella drink in hand or crack open a good book. Chances are, though, the world-class waves will be enough for you. If not, there's always the world-famous Cloud 9 floating bar & restaurant. It’s anchored in the ocean and serves perhaps the most Instagramable cocktails on Earth.",
  //       localScene:
  //         "Before the reefs at Cloudbreak, Restaurants and The Right were opened to the public, these legendary waves were some of the most exclusive in the world, reserved for paying guests of Tavarua. The Fijian government has since issued a decree to open them to all surfers, but there’s a catch: you still need to figure out the 30-minute boat ride from the main island. Most traveling surfers fly to Fiji during peak season (May-September). That’s when the main breaks will see an abundance of local and visiting surfers, but with the right wind conditions, other spots can be good and relatively uncrowded.",
  //     },
  //     quickTips: {
  //       traveTime: {
  //         TPE: "9.5",
  //         LAX: "11.5",
  //         Heathrow: "21",
  //       },
  //       connectivity:
  //         "Expect WiFi connection at your resort. Other than that, you’re on your own.",
  //       currency: "Fijian Dollar. At the time of writing, $1 USD = 2.16 FJD",
  //       avgCost: {
  //         lunch: "$10.00",
  //         beer: "$4.00",
  //         hotel: "$250.00",
  //       },
  //       visa: "No visa necessary for US visitors, unless you plan to stay longer than four months.",
  //       waterQuality:
  //         "Tap water is safe to drink where filtration is in place, like in cities and resorts. However, bottled water is never a bad call.",
  //       hazard:
  //         "Sunburns, surfing yourself into a coma or, conversely, having a few too many umbrella drinks and missing out on a session or two.",
  //       cashCard:
  //         "You probably won’t have much need for spending cash as you’ll likely be spending most of your time at a resort. But having some hard dollars on you for tipping is always recommended.",
  //     },
  //     otherZones: [
  //       "north-costa-rica",
  //       "sydney",
  //       "the-mentawais",
  //       "west-portugal",
  //     ],
  //   });
  // }

  // useEffect(() => {
  //   writeData();
  // }, []);

  return <div>Landing</div>;
};

export default Landing;
