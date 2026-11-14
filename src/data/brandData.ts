import { BRAND_ASSETS } from '../assets/media';

export type PageRoute = '/' | '/services' | '/about' | '/contact';

export interface PlumbingServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  scopePoints: string[];
  image: string;
  imageAlt: string;
  surfaceTheme: 'ivory' | 'sky' | 'blue' | 'mint';
}

export interface ShowcaseItem {
  id: string;
  index: string;
  title: string;
  category: string;
  caption: string;
  image: string;
  imageAlt: string;
  aspect: 'wide' | 'portrait' | 'landscape';
}

export const VERIFIED_BRAND = {
  name: 'THE AMERICAN PLUMBER',
  instagramHandle: '@the_american_plumber',
  instagramUrl: 'https://www.instagram.com/the_american_plumber/?hl=en',
  bioHighlights: [
    'Plumber by trade',
    'Father of 4',
    'Faith over fear',
  ],
  packQuote:
    'The strength of the pack is the wolf, and the strength of the wolf is the pack.',
  mediaNotice:
    'Instagram blocks unauthenticated image scraping behind a login gate. The brand emblem and trade photography shown across this site are bespoke editorial visuals depicting residential and commercial plumbing craftsmanship until direct social media exports are supplied.',
} as const;

export const PLUMBING_SERVICES: PlumbingServiceItem[] = [
  {
    id: 'copper-repiping',
    number: '01',
    title: 'Copper Piping & Manifold Systems',
    subtitle: 'Supply Distribution · Isolation Valves · Clean Soldering',
    description:
      'Precision-measured copper supply lines, clean brazed and soldered joints, and clearly arranged brass ball-valve manifolds built for steady flow, accessible maintenance, and long-term structural integrity.',
    scopePoints: [
      'Whole-home and commercial copper supply line runs and manifold headers',
      'Quarter-turn brass isolation valves, pressure gauges, and balanced zone distribution',
      'Pressure-tested assemblies and clean pipe hangers anchored neatly along framing',
    ],
    image: BRAND_ASSETS.heroCopperPlumbing,
    imageAlt:
      'Master plumber adjusting precision copper piping and brass manifold assembly with a pipe wrench in bright natural light',
    surfaceTheme: 'ivory',
  },
  {
    id: 'water-heating',
    number: '02',
    title: 'Water Heater Installation & Utility Upgrades',
    subtitle: 'Domestic Hot Water · Expansion Control · Code-Ready Venting',
    description:
      'Methodical water heater replacements and utility room upgrades engineered with proper thermal expansion tanks, shut-off valves, sediment traps, and crisp copper headers.',
    scopePoints: [
      'Residential tank and high-efficiency hot water system installations',
      'Thermal expansion tank integration, relief piping, and vacuum-breaker protection',
      'Clean gas and cold/hot supply shut-off routing for effortless future servicing',
    ],
    image: BRAND_ASSETS.serviceWaterHeaterSystem,
    imageAlt:
      'Cleanly installed residential water heater with blue expansion tank, copper supply header, and brass shut-off valves',
    surfaceTheme: 'sky',
  },
  {
    id: 'fixture-installations',
    number: '03',
    title: 'Kitchen & Bath Fixture Craftsmanship',
    subtitle: 'Finish Plumbing · Faucets & Sinks · Architectural Trim',
    description:
      'Careful finish-stage installation for kitchens, baths, and utility rooms—protecting natural stone, tile, and cabinetry while delivering leak-free seals and responsive water flow.',
    scopePoints: [
      'Architectural kitchen faucets, deep ceramic sinks, and under-counter supply stops',
      'Bathroom rough-in valves, shower trim sets, and precision-leveled toilet installations',
      'Clean silicone sealing, drain trap alignment, and full pressure leak inspections',
    ],
    image: BRAND_ASSETS.serviceFixtureInstallation,
    imageAlt:
      'Brushed brass kitchen faucet and deep ceramic apron sink installed against sunlit natural stone tilework',
    surfaceTheme: 'blue',
  },
  {
    id: 'diagnostics-repairs',
    number: '04',
    title: 'Diagnostics, Maintenance & Pipe Repairs',
    subtitle: 'Leak Troubleshooting · Valve Replacement · Practical Craft',
    description:
      'Honest, hands-on troubleshooting to locate worn valves, weeping joints, pressure drops, or fixture failures and repair them cleanly with durable brass and copper components.',
    scopePoints: [
      'Pinpoint leak isolation and replacement of worn compression or soldered fittings',
      'Main shut-off, pressure-reducing valve, and supply-stop upgrades',
      'Thorough clean-up and transparent walkthrough of completed work',
    ],
    image: BRAND_ASSETS.craftsmanshipToolsWorkbench,
    imageAlt:
      'Professional plumbing wrenches, copper tubing, and brass fittings organized on a natural oak workbench',
    surfaceTheme: 'mint',
  },
];

export const WORKMANSHIP_GALLERY: ShowcaseItem[] = [
  {
    id: 'manifold-assembly',
    index: '01',
    title: 'Multi-Zone Copper & Brass Manifold',
    category: 'Supply & Distribution',
    caption:
      'Clean vertical copper risers tied into individual brass shut-off ports and line pressure monitoring.',
    image: BRAND_ASSETS.heroCopperPlumbing,
    imageAlt:
      'Plumber tightening brass manifold fitting on a copper distribution wall',
    aspect: 'wide',
  },
  {
    id: 'utility-room-header',
    index: '02',
    title: 'Utility Room Water Heater Header',
    category: 'Thermal & Hot Water',
    caption:
      'Level copper piping, expansion tank support, and clearly accessible quarter-turn ball valves.',
    image: BRAND_ASSETS.serviceWaterHeaterSystem,
    imageAlt:
      'Water heater installation with neat copper piping and labeled isolation valves',
    aspect: 'landscape',
  },
  {
    id: 'finish-brass-kitchen',
    index: '03',
    title: 'Brushed Brass Kitchen Finish',
    category: 'Architectural Finish',
    caption:
      'Precision deck mounting, balanced hot/cold supply stops, and crisp seal around natural stone.',
    image: BRAND_ASSETS.serviceFixtureInstallation,
    imageAlt:
      'Brushed brass faucet and ceramic farmhouse sink in sunlit kitchen',
    aspect: 'landscape',
  },
  {
    id: 'framing-rough-in',
    index: '04',
    title: 'New-Build Copper Rough-In Inspection',
    category: 'Structural Rough-In',
    caption:
      'Measured 90-degree elbows and rigid framing alignment prior to wall closure.',
    image: BRAND_ASSETS.storyTradesmanPortrait,
    imageAlt:
      'Plumber inspecting soldered copper rough-in framing assembly in sunlit renovation',
    aspect: 'portrait',
  },
  {
    id: 'bench-tools-prep',
    index: '05',
    title: 'Workshop Preparation & Brass Fittings',
    category: 'Tools & Materials',
    caption:
      'Pipe cutters, heavy wrenches, copper tubing, and brass tees staged cleanly before job-site assembly.',
    image: BRAND_ASSETS.craftsmanshipToolsWorkbench,
    imageAlt:
      'Plumbing pipe wrenches, copper tubing, and brass tees on wooden workbench',
    aspect: 'wide',
  },
];
