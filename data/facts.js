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
    { hook: 'Kabaddi, called Hadudu in Bangladesh, is the country\'s national game.', more: 'It needs no equipment. A raider crosses into the other half and must return holding one breath, chanting "kabaddi" without stopping.' },
    { hook: "The ancient Olympic Games ran for more than a thousand years before they were revived in 1896.", more: "They were held at Olympia in Greece from about 776 BC until the 4th century AD. The modern Games began in Athens." },
    { hook: "At Wimbledon, players must wear almost entirely white.", more: "The rule goes back to Victorian times, when white was thought to hide sweat stains better than colours." },
    { hook: "Bangladesh beat India at the 2007 Cricket World Cup in the West Indies.", more: "The win helped knock India out in the first round and showed that Bangladesh could beat the biggest teams." },
    { hook: "No women competed at the first modern Olympics in 1896.", more: "Women first took part in 1900, in sports like tennis and golf." }
  ],
  Tech: [
    { hook: 'The first website went online in 1991, and it was about the web itself.', more: 'Tim Berners-Lee built it at CERN, a physics lab in Switzerland, so scientists could share their papers.' },
    { hook: 'The first computer mouse was made of wood.', more: 'Douglas Engelbart and his team built it in 1964. It had one button and two wheels instead of a ball or a light.' },
    { hook: 'The word "bug" for a computer fault may come from a real moth.', more: 'In 1947, engineers found a moth stuck in a Harvard computer and taped it into their logbook. The word was in use before that, but the story stuck.' },
    { hook: 'Bangladesh launched its own satellite, Bangabandhu-1, in May 2018.', more: 'It was sent into orbit on a SpaceX rocket from Florida and carries signals for TV and communications.' },
    { hook: 'The first text message ever sent said "Merry Christmas".', more: 'Engineer Neil Papworth sent it in December 1992, to a phone that could receive but not yet reply.' },
    { hook: 'Your phone is far more powerful than the computer that guided Apollo 11 to the Moon.', more: 'The Apollo computer had about 4 kilobytes of working memory. A basic phone today has millions of times more.' },
    { hook: "The QWERTY keyboard was designed for typewriters in the 1870s.", more: "We still use the same layout on phones and laptops today, nearly 150 years later." },
    { hook: "Wi-Fi does not stand for anything.", more: "Many people think it means \"wireless fidelity\", but it was just a catchy brand name chosen for the technology." },
    { hook: "The first video ever posted on YouTube was less than 20 seconds long.", more: "Called \"Me at the zoo\", it was uploaded in April 2005 and shows a man standing in front of elephants." },
    { hook: "Email is older than the web.", more: "Ray Tomlinson sent the first email between two computers in 1971, and he chose the @ sign to separate the name from the computer." }
  ],
  Bangladesh: [
    { hook: 'The Sundarbans is the largest mangrove forest in the world.', more: 'It stretches across southern Bangladesh and into India, and it is home to the Bengal tiger, which swims between the islands.' },
    { hook: 'Cox\'s Bazar has one of the longest natural sea beaches on Earth.', more: 'It runs for roughly 120 kilometres, and in places you can walk for hours without leaving sand.' },
    { hook: '21 February is celebrated by the whole world as International Mother Language Day.', more: 'UNESCO chose the date in 1999 to honour the students who died in Dhaka in 1952 while defending Bangla.' },
    { hook: 'Bangladesh has the world\'s largest supply of hilsa, the national fish.', more: 'Most of the world\'s hilsa is caught in Bangladeshi waters. The national fruit is the jackfruit and the national flower is the shapla, a water lily.' },
    { hook: 'More than 170 million people live in a country about the size of Iowa.', more: 'That makes Bangladesh one of the most crowded large countries in the world.' },
    { hook: 'The Padma Bridge, opened in June 2022, is more than 6 kilometres long.', more: 'It joined the south-west of Bangladesh to Dhaka by road and rail across one of the country\'s widest rivers.' },
    { hook: "Bangladesh has three UNESCO World Heritage Sites.", more: "They are the Sundarbans, the mosque city of Bagerhat and the ruins of the Buddhist monastery at Paharpur." },
    { hook: "The Sixty Dome Mosque in Bagerhat really has 81 domes.", more: "It was built in the 15th century and is part of the UNESCO-listed mosque city of Bagerhat. Despite its name, it has 77 small domes on the roof plus four larger ones at the corners." },
    { hook: "Dhaka is often called the rickshaw capital of the world.", more: "Hundreds of thousands of rickshaws move people through the city every day, many of them painted with bright art." },
    { hook: "The national anthems of Bangladesh and India were both written by the same poet.", more: "Rabindranath Tagore wrote the words of \"Amar Shonar Bangla\" and also of India's \"Jana Gana Mana\"." }
  ],
  World: [
    { hook: 'The Pacific Ocean is larger than all the land on Earth put together.', more: 'It covers about a third of the planet\'s surface, more area than every continent and island combined.' },
    { hook: 'Russia has 11 time zones.', more: 'When it is breakfast in the far east of Russia, it is already the previous evening in the west.' },
    { hook: 'Africa has 54 countries, more than any other continent.', more: 'It is also home to more than a thousand languages.' },
    { hook: 'Antarctica is a desert.', more: 'It gets very little rain or snow each year, so it counts as the largest desert in the world, even though it is covered in ice.' },
    { hook: 'There are more than 7,000 languages in the world, and many may disappear.', more: 'Experts estimate that around 40 percent are endangered, with fewer than a thousand speakers each.' },
    { hook: 'Bhutan measures success with Gross National Happiness, not only money.', more: 'The country looks at health, education, culture and nature when it plans for the future.' },
    { hook: "The Dead Sea shore is the lowest dry land on Earth.", more: "It lies more than 400 metres below sea level, and its water is so salty that you float without trying." },
    { hook: "An octopus has three hearts and blue blood.", more: "Two hearts pump blood to the gills and one to the rest of the body. Its blood is blue because it carries oxygen with copper." },
    { hook: "A day on Venus is longer than its year.", more: "Venus spins so slowly that one turn takes about 243 Earth days, but it circles the Sun in about 225." },
    { hook: "A banana is a berry, but a strawberry is not.", more: "In botany, a berry grows from one flower with one ovary and has seeds inside. Bananas fit that, strawberries do not." }
  ]
};
export const FACT_SECTIONS = ['Sports', 'Tech', 'Bangladesh', 'World'];

// Facts per section for a given 6-hour slot, from the built-in list (a different group each time).
export function factsForSlot(slot, n = 4) {
  const out = {};
  for (const sec of FACT_SECTIONS) {
    const list = FACTS[sec];
    const start = ((slot || 0) * n) % list.length;
    out[sec] = Array.from({ length: n }, (x, k) => list[(start + k) % list.length]);
  }
  return out;
}
