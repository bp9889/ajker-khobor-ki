// Hand-written "Did you know?" facts. They are shown when the AI facts are not available,
// and every 6 hours a different group of three per section is picked, so the list is never stuck.
// Only well-documented facts that do not go out of date belong here.
export const FACTS = {
  Sports: [
    { hook: 'The very first Test cricket match was played in 1877, in Melbourne.', more: 'Australia played England, and Australia won by 45 runs. Test cricket has been going for almost 150 years.' },
    { hook: 'Bangladesh played its first Test match in November 2000, against India in Dhaka.', more: 'That made Bangladesh the 10th country allowed to play Test cricket.' },
    { hook: 'A marathon is 42.195 km long because of the 1908 London Olympics.', more: 'The race was set to start at Windsor Castle and finish in front of the royal box at the stadium, and that odd distance became the standard.' },
    { hook: 'Basketball started in 1891 with a football and two peach baskets.', more: 'Its inventor, James Naismith, was a teacher who needed an indoor game for winter. At first, someone had to climb up and fetch the ball after every score.' },
    { hook: 'Only 13 teams played in the first football World Cup in 1930.', more: 'Uruguay hosted and won it. Most teams had to travel for weeks by ship, so many top European countries did not come.' },
    { hook: 'Kabaddi, called Hadudu in Bangladesh, is the country\'s national game.', more: 'It needs no equipment. A raider crosses into the other half and must return holding one breath, chanting "kabaddi" without stopping.' }
  ],
  Tech: [
    { hook: 'The first website went online in 1991, and it was about the web itself.', more: 'Tim Berners-Lee built it at CERN, a physics lab in Switzerland, so scientists could share their papers.' },
    { hook: 'The first computer mouse was made of wood.', more: 'Douglas Engelbart and his team built it in 1964. It had one button and two wheels instead of a ball or a light.' },
    { hook: 'The word "bug" for a computer fault may come from a real moth.', more: 'In 1947, engineers found a moth stuck in a Harvard computer and taped it into their logbook. The word was in use before that, but the story stuck.' },
    { hook: 'Bangladesh launched its own satellite, Bangabandhu-1, in May 2018.', more: 'It was sent into orbit on a SpaceX rocket from Florida and carries signals for TV and communications.' },
    { hook: 'The first text message ever sent said "Merry Christmas".', more: 'Engineer Neil Papworth sent it in December 1992, to a phone that could receive but not yet reply.' },
    { hook: 'Your phone is far more powerful than the computer that guided Apollo 11 to the Moon.', more: 'The Apollo computer had about 4 kilobytes of working memory. A basic phone today has millions of times more.' }
  ],
  Bangladesh: [
    { hook: 'The Sundarbans is the largest mangrove forest in the world.', more: 'It stretches across southern Bangladesh and into India, and it is home to the Bengal tiger, which swims between the islands.' },
    { hook: 'Cox\'s Bazar has one of the longest natural sea beaches on Earth.', more: 'It runs for roughly 120 kilometres, and in places you can walk for hours without leaving sand.' },
    { hook: '21 February is celebrated by the whole world as International Mother Language Day.', more: 'UNESCO chose the date in 1999 to honour the students who died in Dhaka in 1952 while defending Bangla.' },
    { hook: 'Bangladesh has the world\'s largest supply of hilsa, the national fish.', more: 'Most of the world\'s hilsa is caught in Bangladeshi waters. The national fruit is the jackfruit and the national flower is the shapla, a water lily.' },
    { hook: 'More than 170 million people live in a country about the size of Iowa.', more: 'That makes Bangladesh one of the most crowded large countries in the world.' },
    { hook: 'The Padma Bridge, opened in June 2022, is more than 6 kilometres long.', more: 'It joined the south-west of Bangladesh to Dhaka by road and rail across one of the country\'s widest rivers.' }
  ],
  World: [
    { hook: 'The Pacific Ocean is larger than all the land on Earth put together.', more: 'It covers about a third of the planet\'s surface, more area than every continent and island combined.' },
    { hook: 'Russia has 11 time zones.', more: 'When it is breakfast in the far east of Russia, it is already the previous evening in the west.' },
    { hook: 'Africa has 54 countries, more than any other continent.', more: 'It is also home to more than a thousand languages.' },
    { hook: 'Antarctica is a desert.', more: 'It gets very little rain or snow each year, so it counts as the largest desert in the world, even though it is covered in ice.' },
    { hook: 'There are more than 7,000 languages in the world, and many may disappear.', more: 'Experts estimate that around 40 percent are endangered, with fewer than a thousand speakers each.' },
    { hook: 'Bhutan measures success with Gross National Happiness, not only money.', more: 'The country looks at health, education, culture and nature when it plans for the future.' }
  ]
};
export const FACT_SECTIONS = ['Sports', 'Tech', 'Bangladesh', 'World'];

// Three facts per section for a given 6-hour slot, from the built-in list.
export function factsForSlot(slot) {
  const out = {};
  for (const sec of FACT_SECTIONS) {
    const list = FACTS[sec];
    const start = ((slot || 0) * 3) % list.length;
    out[sec] = [0, 1, 2].map((k) => list[(start + k) % list.length]);
  }
  return out;
}
