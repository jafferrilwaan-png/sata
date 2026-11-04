/**
 * SATA Planetary Intelligence Engine — 30 Autonomous Planetary Deep Reasoning Simulations
 * High-fidelity geophysical scenarios with real-time 3D Earth shader reaction and
 * multi-agent Meta AI (Tri-Agent Swarm / Llama 4 / Muse Spark / Muse Wonder) physical reasoning.
 */

export interface PlanetarySimulationTarget {
  name: string;
  region: string;
  lat: number;
  lon: number;
  altitude: number;
}

export type SimulationCategory =
  | 'Cryosphere & Climate Shock'
  | 'Atmospheric & Extreme Weather'
  | 'Oceanic & Marine Collapse'
  | 'Geoengineering & Biosphere'
  | 'Tectonic & Volcanic'
  | 'Hydrological Crisis' | 'Biosphere & Tipping Point';

export interface PlanetarySimulationShaderParams {
  simulationType: number; // 1: Snow/Cryo, 2: Marine Heatwave, 3: Megadrought, 4: Volcanic Ash, 5: Regreening, 6: Deluge/Flood, 7: Toxic Dust
  center: [number, number]; // [lat, lon]
  radiusDeg: number;
  intensity: number;
  albedoDelta: string;
  surfaceTempDelta: string;
}

export interface PlanetarySimulationDeepReasoning {
  swarmConsensusSummary: string;
  museSpark13_Geospatial: string;
  museWonder10_Physics: string;
  museSpark12_ImpactCascades: string;
  strategicProtocols: {
    phase1_Immediate: string;
    phase2_Stabilization: string;
    phase3_Governance: string;
  };
  keyMetrics: Array<{
    label: string;
    value: string;
    delta: string;
    trend: 'critical-high' | 'critical-low' | 'neutral' | 'elevated';
  }>;
}

export interface PlanetarySimulationScenario {
  id: string;
  title: string;
  prompt: string;
  category: SimulationCategory;
  tags: string[];
  target: PlanetarySimulationTarget;
  shaderParams: PlanetarySimulationShaderParams;
  reasoning: PlanetarySimulationDeepReasoning;
}

export const PLANETARY_SIMULATIONS_CATALOG: PlanetarySimulationScenario[] = [
  {
    id: 'thar-desert-snowfall',
    title: 'Snowfall & Cryo-freeze over Thar Desert',
    prompt: 'Simulate snowfall scenario on Thar Desert',
    category: 'Cryosphere & Climate Shock',
    tags: ['Thar Desert', 'Snowfall', 'Polar Vortex', 'Cryosphere', 'Rajasthan'],
    target: {
      name: 'Thar Desert, Rajasthan, India',
      region: 'CRYOSPHERE ANOMALY SECTOR',
      lat: 27.0238,
      lon: 71.7456,
      altitude: 2.1,
    },
    shaderParams: {
      simulationType: 1.0, // Snow cover
      center: [27.0238, 71.7456],
      radiusDeg: 6.8,
      intensity: 0.94,
      albedoDelta: '+0.56 (0.22 -> 0.78)',
      surfaceTempDelta: '-39.5°C (36°C -> -3.5°C)',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Extreme meridional jet-stream buckling displaces an intense Siberian Arctic polar vortex south into northwestern India, precipitating 28–38 cm of dense cryo-snowfall across 200,000 sq km of the hyper-arid Thar Desert. Surface albedo quadruples instantly, plunging diurnal temperatures by nearly 40°C and generating regional thermodynamic destabilization.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Primary accumulation swath encompasses Jaisalmer (26.91°N, 70.90°E), Bikaner (28.02°N, 73.31°E), and Barmer (25.75°N, 71.39°E), extending westward across the Indus basin frontier into Sindh. Thermal radiometry from INSAT-3D and NASA VIIRS confirms ground freeze line descending to 85 meters above mean sea level.',
      museWonder10_Physics:
        'THERMODYNAMIC & ALBEDO CASCADE: Thar sand albedo surges from 0.22 to 0.78, reflecting 480 W/m² of incoming solar shortwave irradiance back into space. The drastic surface sensible heat flux deficit locks a massive cold-core anticyclone at 1028 hPa over Rajasthan, displacing the subtropical westerly jet southward and disrupting the seasonal pre-monsoon thermal low across the northern Indian subcontinent.',
      museSpark12_ImpactCascades:
        'BIOSPHERE & AGRI CASCADE: Complete cold-shock necrosis across mustard, wheat, and pearl millet (bajra) winter cash crops. High mortality among indigenous camel and desert ungulate populations lacking sub-zero insulation. Flash ablation hazard: subsequent rapid thaw will trigger acute flash mud-slurries across non-porous gypsum caliche layers, overwhelming desert drainage wadis.',
      strategicProtocols: {
        phase1_Immediate:
          'Deploy orbital SAR and multispectral snow water equivalent (SWE) tracking via RISAT-1B and Sentinel-1. Issue sub-zero emergency livestock shelter and agricultural thermal blankets across 14 desert districts.',
        phase2_Stabilization:
          'Construct temporary earthen retention bunds along the Indira Gandhi Canal network to capture and store 4.2 billion cubic meters of impending snowmelt runoff, preventing catastrophic canal breach.',
        phase3_Governance:
          'Calibrate climate shock resilience thresholds into the National Action Plan on Climate Change (NAPCC) for non-analog cryospheric intrusions in arid zones.',
      },
      keyMetrics: [
        { label: 'Surface Albedo', value: '0.22 -> 0.78', delta: '+254%', trend: 'critical-high' },
        { label: 'Surface Temperature', value: '36.0°C -> -3.5°C', delta: '-39.5°C', trend: 'critical-low' },
        { label: 'Snowpack Depth', value: '34.2 cm', delta: '+34.2 cm', trend: 'critical-high' },
        { label: 'Shortwave Reflection', value: '540 W/m²', delta: '+380 W/m²', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'bay-of-bengal-marine-heatwave',
    title: 'Rapid 2.8°C Ocean Thermal Surge in Bay of Bengal',
    prompt: 'Simulate 2.8°C ocean warming in Bay of Bengal',
    category: 'Oceanic & Marine Collapse',
    tags: ['Bay of Bengal', 'Marine Heatwave', 'Thermal Anomaly', 'Cyclone Fuel'],
    target: {
      name: 'Central Bay of Bengal',
      region: 'THERMAL SURGE BASIN',
      lat: 14.2000,
      lon: 86.5000,
      altitude: 2.4,
    },
    shaderParams: {
      simulationType: 2.0, // Marine heatwave
      center: [14.2000, 86.5000],
      radiusDeg: 8.5,
      intensity: 0.90,
      albedoDelta: '-0.02 (Ocean absorption)',
      surfaceTempDelta: '+2.8°C (29.2°C -> 32.0°C)',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Persistent atmospheric blocking and suppressed monsoonal winds cause severe shoaling of the ocean mixed layer, driving sea surface temperatures (SST) past 32.0°C. Ocean Tropical Cyclone Heat Potential (TCHP) surpasses 140 kJ/cm², priming the basin for hyper-rapid explosive cyclogenesis.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Central and southern Bay of Bengal marine box (10°N–18°N, 82°E–92°E), threatening coastlines of Andhra Pradesh, Tamil Nadu, Odisha, and Bangladesh. Deep thermal signature detected down to 60 meters thermocline depth via Argo profiling floats.',
      museWonder10_Physics:
        'OCEAN-ATMOSPHERE COUPLING: Latent heat flux from the ocean to the lower troposphere escalates by 38%, creating deep convective instability. Atmospheric water vapor column reaches 68 kg/m², lowering barometric pressures and accelerating vorticity concentration by 2.4x.',
      museSpark12_ImpactCascades:
        'ECOLOGICAL COLLAPSE: Widespread mass coral bleaching across the Andaman and Nicobar archipelago (88% bleaching severity). Acute marine hypoxia dead zones in benthic shelf habitats, triggering mass pelagic fish migration and crashing coastal artisanal fishery yields by 64%.',
      strategicProtocols: {
        phase1_Immediate:
          'Activate automated real-time SST and TCHP monitoring alerts across INCOIS and Doppler radar networks; place coastal disaster management forces on high alert.',
        phase2_Stabilization:
          'Pre-position high-capacity storm shelter infrastructure and food reserves along vulnerable low-lying coastal districts from Visakhapatnam to Sagar Island.',
        phase3_Governance:
          'Incorporate marine heatwave predictive modeling into global coupled oceanic-atmospheric climate forecasting systems (MOM6 / CFSv2).',
      },
      keyMetrics: [
        { label: 'Sea Surface Temp', value: '29.2°C -> 32.0°C', delta: '+2.8°C', trend: 'critical-high' },
        { label: 'Tropical Cyclone Heat Potential', value: '142 kJ/cm²', delta: '+68%', trend: 'critical-high' },
        { label: 'Coral Bleaching Severity', value: '88% of reefs', delta: '+72%', trend: 'critical-high' },
        { label: 'Precipitable Water Column', value: '68.4 kg/m²', delta: '+34%', trend: 'elevated' },
      ],
    },
  },
  {
    id: 'greenland-jakobshavn-collapse',
    title: 'Catastrophic Jakobshavn Isbræ Shelf Collapse, Greenland',
    prompt: 'Simulate glacial collapse in Jakobshavn Isbræ Greenland',
    category: 'Cryosphere & Climate Shock',
    tags: ['Greenland', 'Glacier Collapse', 'Sea Level Rise', 'Cryosphere'],
    target: {
      name: 'Jakobshavn Isbræ (Sermeq Kujalleq), Greenland',
      region: 'GLACIAL DETACHMENT SECTOR',
      lat: 69.1700,
      lon: -49.8300,
      altitude: 1.8,
    },
    shaderParams: {
      simulationType: 1.0,
      center: [69.1700, -49.8300],
      radiusDeg: 4.5,
      intensity: 0.95,
      albedoDelta: '-0.24 (Exposed bedrock and sea)',
      surfaceTempDelta: '+4.5°C melt threshold',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Accelerated ungrounding of the Jakobshavn marine-terminating glacier triggers structural unzipping of the floating ice tongue, discharging 62 Gt of ice into Disko Bay within 72 hours and inducing a 0.17 mm instantaneous global sea level equivalent rise.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Sermeq Kujalleq fjord corridor (69.10°N–69.30°N, 49.5°W–51.2°W), releasing a 15-kilometer-long armada of megabergs into the Davis Strait and North Atlantic shipping routes.',
      museWonder10_Physics:
        'HYDRODYNAMIC SURGE & FRESHWATER FORCING: Low-density meltwater discharge forms a fresh surface cap, suppressing local deepwater convection in the Labrador Sea and slowing the subpolar gyre by 11%. Marine ice cliff instability (MICI) thresholds breached.',
      museSpark12_ImpactCascades:
        'COASTAL HAZARDS: Generation of 18-meter local tsunami waves crashing into Ilulissat harbor; displacement of native fishing infrastructure; North Atlantic maritime navigation lanes forced 300 nautical miles southward.',
      strategicProtocols: {
        phase1_Immediate:
          'Satellite SAR interferometry (Sentinel-1D / NISAR) 6-hour refresh on fjord terminus stability; immediate evacuation of Ilulissat coastal zone.',
        phase2_Stabilization:
          'International Ice Patrol deployment of high-frequency GPS beacon darts onto rogue megabergs drifting towards transatlantic transatlantic routes.',
        phase3_Governance:
          'Funding accelerated ice-sheet core thermal drilling to model basal lubricated bedrock slipperiness under IPCC tipping scenarios.',
      },
      keyMetrics: [
        { label: 'Discharge Volume', value: '62.4 Gt ice', delta: '+340%', trend: 'critical-high' },
        { label: 'Flow Velocity', value: '48 m/day', delta: '+120%', trend: 'critical-high' },
        { label: 'Freshwater Flux', value: '0.04 Sv', delta: '+280%', trend: 'critical-high' },
        { label: 'Local Tsunami Wave', value: '18.2 meters', delta: 'Acute Hazard', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'amazon-basin-megadrought',
    title: 'Amazon Basin Megadrought & Rainforest Dieback',
    prompt: 'Simulate Amazon Basin megadrought scenario',
    category: 'Hydrological Crisis',
    tags: ['Amazon', 'Megadrought', 'Rainforest Dieback', 'Carbon Tipping Point'],
    target: {
      name: 'Central Amazon Basin, Brazil',
      region: 'BIOSPHERE DESICCATION BASIN',
      lat: -3.4653,
      lon: -62.2159,
      altitude: 2.2,
    },
    shaderParams: {
      simulationType: 3.0, // Megadrought
      center: [-3.4653, -62.2159],
      radiusDeg: 12.0,
      intensity: 0.88,
      albedoDelta: '+0.08 (Canopy browning)',
      surfaceTempDelta: '+3.6°C canopy thermal stress',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Multi-year Pacific El Niño coupling with an ultra-warm tropical North Atlantic suppresses the Atlantic moisture conveyor (Flying Rivers). Evapotranspiration halts across 3.2 million sq km, triggering irreversible canopy desiccation and converting the carbon sink into an active 1.8 Gt/yr carbon source.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Rio Negro, Madeira, and Tapajós river watersheds. River water levels at Manaus drop to unprecedented historical minimums (-12.4m below normal datum).',
      museWonder10_Physics:
        'FLYING RIVER COLLAPSE: Trans-canopy water recycling collapses from 20 billion tons/day to 6.8 billion tons/day, shutting off downwind precipitation corridors to southeastern South America and northern Argentina.',
      museSpark12_ImpactCascades:
        'SAVANNIZATION & WILDFIRE VULNERABILITY: Understory humidity plummets below 40%, allowing runaway ground fires to breach primary rainforest boundaries. Massive die-off of freshwater cetaceans (boto dolphins) and complete isolation of riverside indigenous communities.',
      strategicProtocols: {
        phase1_Immediate:
          'Deploy orbital MODIS/VIIRS thermal active fire alarms and deliver emergency water filtration and medical airlift to isolated riverine municipalities.',
        phase2_Stabilization:
          'Establish strict satellite-enforced moratorium on agricultural slash-and-burn operations along the entire BR-163 and Trans-Amazonian Highway corridors.',
        phase3_Governance:
          'International Amazon Basin Hydrological Security Compact backed by green bond carbon preservation dividends.',
      },
      keyMetrics: [
        { label: 'River Stage (Manaus)', value: '11.8 m (All-Time Low)', delta: '-14.2 m', trend: 'critical-low' },
        { label: 'Canopy Evapotranspiration', value: '1.8 mm/day', delta: '-62%', trend: 'critical-low' },
        { label: 'Carbon Balance', value: '+1.8 Gt C/yr (Source)', delta: 'Tipping Point', trend: 'critical-high' },
        { label: 'Fire Susceptibility Index', value: '94 / 100', delta: '+85%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'yellowstone-supervolcano-eruption',
    title: 'Supervolcanic Stratospheric Ash Cloud at Yellowstone',
    prompt: 'Simulate Yellowstone supervolcanic eruption scenario',
    category: 'Tectonic & Volcanic',
    tags: ['Yellowstone', 'Supervolcano', 'Volcanic Winter', 'Ash Plume', 'Aerosol'],
    target: {
      name: 'Yellowstone Caldera, Wyoming, USA',
      region: 'SUPERVOLCANIC TEPHRA SECTOR',
      lat: 44.4280,
      lon: -110.5885,
      altitude: 2.2,
    },
    shaderParams: {
      simulationType: 4.0, // Volcanic ash
      center: [44.4280, -110.5885],
      radiusDeg: 14.5,
      intensity: 0.96,
      albedoDelta: '+0.38 (Stratospheric aerosol shield)',
      surfaceTempDelta: '-8.2°C continental cooling',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: VEI-8 super-eruption expels 1,200 cubic kilometers of pyroclastic tephra and 400 megatons of SO2 into the upper stratosphere (38 km altitude). Global solar irradiance is curtailed by 42%, precipitating an abrupt multi-year volcanic winter across the Northern Hemisphere.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Caldera ground zero with tephra blankets >1 meter across Wyoming, Montana, and Idaho. Heavy ash dispersion (>10 cm) blankets the North American corn and wheat belts within 96 hours.',
      museWonder10_Physics:
        'RADIATIVE FORCING & AEROSOL TRANSPORT: Sulfate aerosols rapidly encircle the mid-latitudes via the polar jet stream, creating negative radiative forcing of -18 W/m². Global hydrological cycle contracts by 26%; global monsoon regimes fail.',
      museSpark12_ImpactCascades:
        'GLOBAL FOOD SECURITY CRISIS: Total shutdown of continental aviation; electrical grid collapse from conductive ash deposition on substations; multi-year global grain reserve depletion within 60 days.',
      strategicProtocols: {
        phase1_Immediate:
          'Mandatory evacuation within 500 km radius; global grounding of commercial jet aircraft; emergency sealing of HVAC and water reservoirs against acidic fluoride-bearing tephra.',
        phase2_Stabilization:
          'Mobilize subterranean hydroponic agricultural centers and indoor micro-protein cultivation systems to sustain population baseline caloric requirements.',
        phase3_Governance:
          'Establish United Nations Planetary Emergency Ration and Solar Energy Distribution Network.',
      },
      keyMetrics: [
        { label: 'SO2 Injected', value: '410 Mt', delta: 'Catastrophic', trend: 'critical-high' },
        { label: 'Solar Dimming', value: '-42% Irradiance', delta: '-42%', trend: 'critical-low' },
        { label: 'Global Temp Anomaly', value: '-8.2°C Continental', delta: '-8.2°C', trend: 'critical-low' },
        { label: 'Crop Harvest Yield', value: '-85% (North America)', delta: '-85%', trend: 'critical-low' },
      ],
    },
  },
  {
    id: 'sahara-solar-regreening',
    title: 'Sahara Desert Solar Mega-Re-greening Geoengineering',
    prompt: 'Simulate Sahara Desert mega solar regreening scenario',
    category: 'Geoengineering & Biosphere',
    tags: ['Sahara', 'Solar Geoengineering', 'Regreening', 'Albedo Shift'],
    target: {
      name: 'Central Sahara Desert, Chad/Algeria',
      region: 'GEOENGINEERING TRANSFORMATION ZONE',
      lat: 23.4162,
      lon: 11.8904,
      altitude: 2.3,
    },
    shaderParams: {
      simulationType: 5.0, // Regreening
      center: [23.4162, 11.8904],
      radiusDeg: 13.0,
      intensity: 0.92,
      albedoDelta: '-0.28 (Sand 0.40 -> Solar/Canopy 0.12)',
      surfaceTempDelta: '+1.8°C ground / +450% rainfall',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Installation of a 4-million-sq-km photovoltaic and concentrated solar installation across the Sahara lowers continental surface albedo from 0.40 to 0.12. Dark solar panels absorb excess solar energy, generating an upward thermal plume that pulls the West African Monsoon 800 km northward, converting hyper-arid dunes into perennial grasslands.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Latitudes 16°N to 28°N, encompassing Mauritania, Mali, Niger, Chad, and southern Algeria. Precipitation expands from <15 mm/yr to 450 mm/yr.',
      museWonder10_Physics:
        'ALBEDO-PRECIPITATION VEGETATION FEEDBACK: Enhanced surface sensible heating drives deep moist convection. Inflow of humid Atlantic air triggers self-sustaining vegetation germination; transpirational cooling establishes a stable Green Sahara equilibrium.',
      museSpark12_ImpactCascades:
        'GLOBAL TELECONNECTIONS: While the Sahara blooms, reduced dust emissions curb mineral nutrient delivery (iron/phosphorus) to the Amazon Basin and Atlantic marine phytoplankton, suppressing pelagic marine productivity by 19%.',
      strategicProtocols: {
        phase1_Immediate:
          'Phased deployment of high-efficiency anti-dust photovoltaic panels coupled with seawater desalination aqueducts from the Mediterranean and Red Sea.',
        phase2_Stabilization:
          'Pioneer planting of deep-rooted native acacia and vetiver grass species to stabilize sand dunes and accelerate topsoil pedogenesis.',
        phase3_Governance:
          'Pan-African Trans-Sahara Energy & Ecological Consortium managing power export to Europe and Central Africa.',
      },
      keyMetrics: [
        { label: 'Surface Albedo', value: '0.40 -> 0.12', delta: '-70%', trend: 'critical-low' },
        { label: 'Annual Precipitation', value: '450 mm/yr', delta: '+2900%', trend: 'critical-high' },
        { label: 'Vegetation Fraction', value: '54% coverage', delta: '+51%', trend: 'critical-high' },
        { label: 'Clean Power Output', value: '28,000 TWh/yr', delta: 'Abundant', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'amoc-collapse-atlantic',
    title: 'Complete AMOC Shutdown & North Atlantic Deep Freeze',
    prompt: 'Simulate AMOC collapse and North Atlantic deep freeze',
    category: 'Oceanic & Marine Collapse',
    tags: ['AMOC', 'Ocean Circulation', 'Atlantic', 'Deep Freeze', 'Europe'],
    target: {
      name: 'North Atlantic Ocean Subpolar Gyre',
      region: 'CIRCULATION SHUTDOWN CORE',
      lat: 55.0000,
      lon: -30.0000,
      altitude: 2.2,
    },
    shaderParams: {
      simulationType: 1.0,
      center: [55.0000, -30.0000],
      radiusDeg: 15.0,
      intensity: 0.95,
      albedoDelta: '+0.42 (Sea ice expansion)',
      surfaceTempDelta: '-7.5°C over Western Europe',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Excessive Arctic and Greenland freshwater freshening reaches the critical 0.18 Sv tipping point, extinguishing the Atlantic Meridional Overturning Circulation (AMOC). Heat transport to the high latitudes drops by 1.2 Petawatts, triggering rapid southward expansion of winter sea ice to the 50th parallel.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: North Atlantic oceanic basin from 45°N to 70°N. Western and Northern Europe (UK, Scandinavia, France, Germany) plunge into an abrupt Little Ice Age climate regime.',
      museWonder10_Physics:
        'INTER-HEMISPHERIC THERMAL SEESAW: While the North Atlantic cools drastically (-6°C to -10°C), thermal accumulation in the Southern Hemisphere warms the South Atlantic and shifts the Intertropical Convergence Zone (ITCZ) southward, drying the Sahel and Indian summer monsoon.',
      museSpark12_ImpactCascades:
        'AGRICULTURAL & URBAN CRISIS: European growing seasons contract by 60–90 days, eliminating commercial wheat and barley production in Northern Europe. Extreme winter storm frequencies increase by 300% across the Atlantic seaboard.',
      strategicProtocols: {
        phase1_Immediate:
          'Continuous real-time RAPID array moored buoy telemetry analysis; implement winter civil protection protocols across European energy grids.',
        phase2_Stabilization:
          'Re-engineer agricultural seed genetics toward cold-hardy Siberian winter cultivars; upgrade port icebreaker fleets in the North Sea and Baltic.',
        phase3_Governance:
          'Establish transatlantic climate stabilization alliance to fund emergency geothermal district heating conversions.',
      },
      keyMetrics: [
        { label: 'AMOC Volume Transport', value: '0.8 Sv (Effectively Zero)', delta: '-95%', trend: 'critical-low' },
        { label: 'European Temp Anomaly', value: '-7.5°C Mean', delta: '-7.5°C', trend: 'critical-low' },
        { label: 'Sea Ice Edge', value: 'Down to 49°N Latitude', delta: '+1200 km South', trend: 'critical-high' },
        { label: 'Growing Season', value: '110 days', delta: '-45%', trend: 'critical-low' },
      ],
    },
  },
  {
    id: 'cyclone-murasu-landfall',
    title: 'Category 5 Cyclone Murasu Landfall on Coromandel Coast',
    prompt: 'Simulate Category 5 Cyclone Murasu landfall Coromandel Coast',
    category: 'Atmospheric & Extreme Weather',
    tags: ['Cyclone Murasu', 'Category 5', 'Coromandel Coast', 'Storm Surge', 'Chennai'],
    target: {
      name: 'Coromandel Coast, Tamil Nadu, India',
      region: 'CATACLYSMIC STORM SECTOR',
      lat: 13.0827,
      lon: 80.2707,
      altitude: 1.8,
    },
    shaderParams: {
      simulationType: 6.0, // Deluge/Flood
      center: [13.0827, 80.2707],
      radiusDeg: 5.5,
      intensity: 0.98,
      albedoDelta: '-0.10 (Extensive inundation)',
      surfaceTempDelta: '-4.2°C storm downdraft',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Super Cyclone Murasu reaches peak Category 5 intensity (908 hPa, sustained winds 275 km/h) making direct coastal landfall south of Chennai. A catastrophic 6.2-meter astronomical-coincident storm surge penetrates up to 14 km inland, inundating major industrial and urban zones.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Landfall corridor between Mahabalipuram (12.62°N) and Pulicat Lake (13.42°N), cutting across the Adyar, Cooum, and Palar river floodplains.',
      museWonder10_Physics:
        'MOMENTUM & KINETIC SURGE: Integrated Kinetic Energy (IKE) of 135 Terajoules drives massive seawater ingress. Extreme rainfall rates exceeding 85 mm/hour dump 680 mm within 24 hours, causing compound fluvial-coastal flooding.',
      museSpark12_ImpactCascades:
        'INFRASTRUCTURE COLLAPSE: Complete inundation of Chennai International Airport, Ennore and Kattupalli ports, and coastal sub-stations; severe salinization of 180,000 hectares of prime agricultural delta soil.',
      strategicProtocols: {
        phase1_Immediate:
          'Immediate mandatory evacuation of 2.4 million coastal residents to fortified multi-hazard shelters; automated shutdown of high-voltage transmission grids and nuclear facilities at Kalpakkam.',
        phase2_Stabilization:
          'Deploy Indian Navy amphibious landing craft and hovercraft for search and rescue; activate emergency RO desalination mobile units.',
        phase3_Governance:
          'Implement the Sendai Framework Coastal Defense Masterplan with living mangrove bioshields and automated surge barriers.',
      },
      keyMetrics: [
        { label: 'Sustained Winds', value: '275 km/h (Gusts 315 km/h)', delta: 'Cat 5 Extreme', trend: 'critical-high' },
        { label: 'Central Pressure', value: '908 hPa', delta: '-104 hPa', trend: 'critical-low' },
        { label: 'Peak Storm Surge', value: '6.2 meters', delta: '+6.2 m', trend: 'critical-high' },
        { label: '24h Precipitation', value: '684 mm', delta: '+850%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'arctic-aerosol-injection',
    title: 'Arctic Stratospheric Aerosol Injection (SAI) Geoengineering',
    prompt: 'Simulate Arctic stratospheric aerosol injection geoengineering',
    category: 'Geoengineering & Biosphere',
    tags: ['Arctic', 'Solar Radiation Management', 'Aerosol Injection', 'Geoengineering'],
    target: {
      name: 'Arctic Ocean Polar Cap, Svalbard',
      region: 'GEOENGINEERING TEST FIELD',
      lat: 78.2232,
      lon: 15.6469,
      altitude: 2.2,
    },
    shaderParams: {
      simulationType: 4.0, // Aerosol
      center: [78.2232, 15.6469],
      radiusDeg: 16.0,
      intensity: 0.92,
      albedoDelta: '+0.18 (Stratospheric haze)',
      surfaceTempDelta: '-2.4°C polar cooling',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: High-altitude aircraft release 5 megatons of aerosolized SO2 and calcium carbonate nanoparticles into the lower Arctic stratosphere (14 km). The synthetic reflective veil offsets +1.8°C of polar amplification warming, initiating sea ice freeze preservation.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Circumpolar domain north of 66.5°N. Haze dispersal monitored by SAGE III on ISS and CALIPSO lidar tracks across Greenland, Svalbard, and the Chukchi Sea.',
      museWonder10_Physics:
        'RADIATIVE FORCING DYNAMICS: Negative top-of-atmosphere radiative forcing of -3.6 W/m² curtails solar shortwave absorption during peak polar summer, stalling permafrost active-layer thawing.',
      museSpark12_ImpactCascades:
        'SIDE EFFECTS: Modest stratospheric ozone depletion (-4.8% over polar vortex in spring) due to heterogeneous halogen activation on aerosol surface boundaries; slight dimming of high-latitude boreal photosynthesis.',
      strategicProtocols: {
        phase1_Immediate:
          'Continuous monitoring of aerosol optical depth (AOD) and particle size distribution via high-altitude balloons and satellite limb sounders.',
        phase2_Stabilization:
          'Calibrate injection rates strictly to seasonal insolation curves to prevent over-cooling and disruption of mid-latitude jet stream waviness.',
        phase3_Governance:
          'Establish the Arctic Geoengineering Multilateral Oversight Board to prevent rogue termination shock.',
      },
      keyMetrics: [
        { label: 'Injected SO2 / CaCO3', value: '5.0 Mt/yr', delta: 'Controlled', trend: 'elevated' },
        { label: 'Surface Temp Delta', value: '-2.4°C Polar', delta: '-2.4°C', trend: 'critical-low' },
        { label: 'Sea Ice Area Saved', value: '1.2 million sq km', delta: '+22%', trend: 'critical-high' },
        { label: 'Ozone Column Anomaly', value: '-4.8%', delta: '-4.8%', trend: 'critical-low' },
      ],
    },
  },
  {
    id: 'thwaites-glacier-collapse',
    title: 'Thwaites "Doomsday Glacier" Shelf Detachment, Antarctica',
    prompt: 'Simulate Thwaites Doomsday Glacier shelf detachment Antarctica',
    category: 'Cryosphere & Climate Shock',
    tags: ['Antarctica', 'Thwaites Glacier', 'Ice Shelf Collapse', 'Sea Level Rise'],
    target: {
      name: 'Thwaites Glacier, Amundsen Sea, Antarctica',
      region: 'CRYOSPHERIC DESTABILIZATION CORE',
      lat: -75.3000,
      lon: -106.8000,
      altitude: 1.9,
    },
    shaderParams: {
      simulationType: 1.0,
      center: [-75.3000, -106.8000],
      radiusDeg: 6.0,
      intensity: 0.94,
      albedoDelta: '-0.20 (Melting shelf & open leads)',
      surfaceTempDelta: '+2.1°C basal warm water intrusion',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Circumpolar Deep Water (CDW) at +1.8°C carves sub-ice shelf cavities, dislodging the pinned eastern ice shelf of Thwaites Glacier. Unrestrained by structural backstress, ice flow velocity quadruples to 9 km/year, committing the global ocean to 65 cm of eventual eustatic sea level rise.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Pine Island Bay and Amundsen Sea Embayment (-74°S to -77°S, -100°W to -115°W). Grounding line retreat accelerates inland into the sub-sea-level Byrd Subglacial Basin.',
      museWonder10_Physics:
        'MARINE ICE SHEET INSTABILITY (MISI): Reverse-slope bedrock topography triggers runaway grounding-line retreat. Overburden ice weight increases hydrostatic driving stress, overwhelming basal resistance.',
      museSpark12_ImpactCascades:
        'GLOBAL COASTAL ATTRITION: Progressive unpinning of adjacent Kohler and Smith glaciers. Permanent nuisance flooding and salt water table intrusion across all world megadeltas (Mekong, Nile, Mississippi, Ganges).',
      strategicProtocols: {
        phase1_Immediate:
          'Continuous autonomous underwater vehicle (AUV Ran) acoustic profiling beneath floating ice tongues; international radar altimetry alert.',
        phase2_Stabilization:
          'Evaluate theoretical seabed berm anchoring geoengineering proposals to deflect warm CDW plumes away from grounding lines.',
        phase3_Governance:
          'Global Coastal Relocation and Adaptation Trust financing managed retreat of vulnerable island and delta nations.',
      },
      keyMetrics: [
        { label: 'Ice Flow Velocity', value: '9.2 km/yr', delta: '+320%', trend: 'critical-high' },
        { label: 'Annual Mass Loss', value: '185 Gt/yr', delta: '+160%', trend: 'critical-high' },
        { label: 'Eustatic SLR Commitment', value: '+65 cm', delta: 'Catastrophic', trend: 'critical-high' },
        { label: 'Grounding Line Retreat', value: '3.8 km/yr', delta: '+210%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'delhi-heat-island-wet-bulb',
    title: 'Extreme 52°C Urban Heat Island & Wet-Bulb Dome, New Delhi',
    prompt: 'Simulate 52°C heat island wet-bulb dome over New Delhi',
    category: 'Atmospheric & Extreme Weather',
    tags: ['New Delhi', 'Heat Island', 'Wet Bulb', 'Thermal Dome', 'Gangetic Plain'],
    target: {
      name: 'National Capital Region, New Delhi, India',
      region: 'HYPER-THERMAL CRISIS DOME',
      lat: 28.6139,
      lon: 77.2090,
      altitude: 1.8,
    },
    shaderParams: {
      simulationType: 2.0,
      center: [28.6139, 77.2090],
      radiusDeg: 4.8,
      intensity: 0.96,
      albedoDelta: '-0.04 (Asphalt heat trap)',
      surfaceTempDelta: '+14.5°C above seasonal mean (52.2°C)',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Stagnant upper-tropospheric omega heat dome traps scorching continental air from the Thar Desert over the dense asphalt matrix of NCR New Delhi. Combined with pre-monsoon Arabian Sea moisture advection, wet-bulb temperatures breach the fatal 35°C human physiological survivability threshold.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: NCR corridor spanning Gurgaon, Delhi, Noida, and Faridabad (28.2°N–28.9°N, 76.8°E–77.5°E), expanding along the western Uttar Pradesh agricultural plain.',
      museWonder10_Physics:
        'THERMAL INVERSION & ANTHROPOGENIC FEEDBACK: Massive air conditioning rejected sensible heat (+4.5°C microclimate penalty) couples with high nocturnal heat capacity of concrete buildings, preventing nighttime radiative cooling (minimum night temperature 38.5°C).',
      museSpark12_ImpactCascades:
        'PUBLIC HEALTH SHOCK: Massive surge in exertional heatstroke and multi-organ failure among informal outdoor labor forces; regional power grid overload trips major 400kV transformers, plunging 35 million people into blackout during peak heat.',
      strategicProtocols: {
        phase1_Immediate:
          'Mandatory curfew on outdoor work between 09:00 and 18:00; convert all public transport and metro stations into continuous 24/7 hydrated cooling refuges.',
        phase2_Stabilization:
          'Deploy emergency mobile grid-scale battery storage units and water misting towers across high-density resettlement colonies.',
        phase3_Governance:
          'Urban cool-roof mandate requiring high-albedo reflective coatings and 40% mandatory urban tree canopy cover by 2030.',
      },
      keyMetrics: [
        { label: 'Ambient Peak Temp', value: '52.4°C', delta: '+14.5°C', trend: 'critical-high' },
        { label: 'Wet-Bulb Temperature', value: '35.4°C (Lethal)', delta: 'Breached Threshold', trend: 'critical-high' },
        { label: 'Night Minimum Temp', value: '38.6°C', delta: '+10.2°C', trend: 'critical-high' },
        { label: 'Power Grid Load', value: '9,850 MW (Over Capacity)', delta: '+38%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'great-barrier-reef-bleaching',
    title: 'Great Barrier Reef Mass Bleaching & Acidification Surge',
    prompt: 'Simulate Great Barrier Reef mass bleaching event',
    category: 'Oceanic & Marine Collapse',
    tags: ['Great Barrier Reef', 'Coral Bleaching', 'Ocean Acidification', 'Australia'],
    target: {
      name: 'Great Barrier Reef Marine Park, Australia',
      region: 'MARINE EXTINCTION CORRIDOR',
      lat: -18.2871,
      lon: 147.6992,
      altitude: 2.1,
    },
    shaderParams: {
      simulationType: 2.0,
      center: [-18.2871, 147.6992],
      radiusDeg: 9.0,
      intensity: 0.92,
      albedoDelta: '+0.05 (Dead coral skeleton whitening)',
      surfaceTempDelta: '+3.1°C Degree Heating Weeks >18',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Degree Heating Weeks (DHW) accumulate past 18 °C-weeks across 2,300 km of the Coral Sea, causing severe, irreversible expulsion of zooxanthellae endosymbionts across 92% of surveyed reef systems from Cape York to Gladstone.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Northern, central, and southern sectors of the Great Barrier Reef (10°S to 24°S, 142°E to 152°E). Landsat-9 and Sentinel-2 aquatic remote sensing confirms catastrophic fluorescence followed by spectral mortality whitening.',
      museWonder10_Physics:
        'PHOTOCHEMICAL THERMAL BREAKDOWN: Coral host mitochondrial disruption generates reactive oxygen species (ROS), forcing cellular autophagy. Concurrently, ocean pH drops to 7.94, reducing aragonite saturation state below 2.8 and dissolving delicate branching Acropora skeletons.',
      museSpark12_ImpactCascades:
        'TROPHIC CRUMBLING: Loss of structural 3D reef architecture decimates habitat for 1,500 fish species, reducing regional marine biomass by 70% and removing coastal wave-attenuation barriers against tropical cyclones.',
      strategicProtocols: {
        phase1_Immediate:
          'Deploy solar-powered robotic surface micro-bubble generators and shade curtains over high-priority genetic coral nurseries.',
        phase2_Stabilization:
          'Large-scale outplanting of heat-tolerant CRISPR-assisted clade D Symbiodiniaceae micro-colonies across offshore outer reef crests.',
        phase3_Governance:
          'Strict moratorium on agricultural sediment and nutrient runoff from Queensland sugarcane catchments into the reef lagoon.',
      },
      keyMetrics: [
        { label: 'Degree Heating Weeks', value: '18.6 °C-weeks', delta: 'Catastrophic Level 2', trend: 'critical-high' },
        { label: 'Bleaching Severity', value: '92% of Reefs', delta: '+80%', trend: 'critical-high' },
        { label: 'Aragonite Saturation', value: '2.74 Ω', delta: '-28%', trend: 'critical-low' },
        { label: 'Structural Habitat Loss', value: '68% Collapse', delta: '-68%', trend: 'critical-low' },
      ],
    },
  },
  {
    id: 'lake-chad-megabasin-desiccation',
    title: 'Lake Chad Megabasin Complete Desiccation & Dust Surge',
    prompt: 'Simulate Lake Chad complete desiccation and dust storm surge',
    category: 'Hydrological Crisis',
    tags: ['Lake Chad', 'Desiccation', 'Dust Storm', 'Sahel', 'Water Crisis'],
    target: {
      name: 'Lake Chad Basin, Chad/Nigeria/Cameroon/Niger',
      region: 'DESICCATION CRISIS BASIN',
      lat: 13.0000,
      lon: 14.5000,
      altitude: 2.1,
    },
    shaderParams: {
      simulationType: 7.0, // Toxic dust
      center: [13.0000, 14.5000],
      radiusDeg: 7.0,
      intensity: 0.91,
      albedoDelta: '+0.22 (Exposed dry lakebed)',
      surfaceTempDelta: '+4.8°C ground heating',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Persistent rainfall failure coupled with upstream Chari-Logone river irrigation diversions causes total desiccation of Lake Chad’s northern and southern pools. The exposed diatomite lakebed transforms into the world’s most potent dust emission hotspot, lofting 120 million tons of mineral aerosols annually.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Quadrilateral convergence of Chad, Niger, Nigeria, and Cameroon (12.3°N–14.5°N, 13.0°E–15.5°E), directly connected to the Bodélé Depression dust corridor.',
      museWonder10_Physics:
        'AEROSOL OPTICAL DEPTH PEAK: Harmattan winds blast dry lakebed sediments, launching fine particulate matter (PM2.5 / PM10) up to 4 km into the atmosphere. Aerosol Optical Depth (AOD) at 550nm exceeds 2.8, suppressing regional solar radiation and extinguishing convective rainclouds.',
      museSpark12_ImpactCascades:
        'SOCIO-ECOLOGICAL DISPLACEMENT: Total collapse of local fisheries and recession agriculture; 30 million people face severe acute water insecurity, precipitating mass cross-border climate migration and resource conflict.',
      strategicProtocols: {
        phase1_Immediate:
          'UN World Food Programme emergency humanitarian water purification airlift and refugee buffer camp establishment.',
        phase2_Stabilization:
          'Engineering inter-basin water transfer feasibility study from the Congo River basin (Transaqua project) under strict ecological safeguards.',
        phase3_Governance:
          'Binding Lake Chad Basin Commission water quota enforcement supported by satellite remote sensing flow verification.',
      },
      keyMetrics: [
        { label: 'Lake Surface Area', value: '420 sq km (98% Loss)', delta: '-98%', trend: 'critical-low' },
        { label: 'Dust Emission Rate', value: '124 Mt/yr', delta: '+420%', trend: 'critical-high' },
        { label: 'Aerosol Optical Depth', value: '2.85 AOD', delta: '+210%', trend: 'critical-high' },
        { label: 'Displaced Population', value: '3.8 million', delta: 'Acute Crisis', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'sistan-basin-sandstorm-depletion',
    title: 'Sistan Basin Super-Dust Storm & Groundwater Depletion',
    prompt: 'Simulate Sistan Basin dust storm and groundwater collapse',
    category: 'Hydrological Crisis',
    tags: ['Sistan Basin', 'Hamoun Wetlands', 'Dust Storm', 'Iran', 'Afghanistan'],
    target: {
      name: 'Sistan Basin, Iran/Afghanistan Border',
      region: 'HYPER-ARID DUST EPICENTER',
      lat: 31.0000,
      lon: 61.5000,
      altitude: 2.0,
    },
    shaderParams: {
      simulationType: 7.0,
      center: [31.0000, 61.5000],
      radiusDeg: 5.2,
      intensity: 0.93,
      albedoDelta: '+0.16 (Dry salt encrustation)',
      surfaceTempDelta: '+5.2°C surface temperature',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Damming of the Helmand River combined with multi-year drought dries out the ancient Hamoun wetlands. The infamous "120-Day Wind" (Bad-e Sad-o-Bist Rooz) accelerates to 125 km/h, generating catastrophic salt-silt storms that bury towns in sand and drive PM2.5 concentrations above 2,200 µg/m³.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Zabol and Nimruz provinces (30.5°N–31.8°N, 61.0°E–62.5°E), extending eastward across the Dasht-e Margo and Registan deserts.',
      museWonder10_Physics:
        'MINERAL SUSPENSION & SALT ENTRAINMENT: High concentrations of halite, gypsum, and fine quartz particles undergo saltation, stripping agricultural topsoil and contaminating regional aquifers through hyper-saline dust fallout.',
      museSpark12_ImpactCascades:
        'HABITABILITY CRISIS: Severe pulmonary silicosis and respiratory collapse in 65% of the population; complete abandonment of rural agricultural villages and acute cross-border hydropolitical tensions between Tehran and Kabul.',
      strategicProtocols: {
        phase1_Immediate:
          'Distribute military-grade N95/P100 respirators and install sealed positive-pressure HEPA air filtration modules in schools and hospitals.',
        phase2_Stabilization:
          'Spray bio-degradable mulch and plant halophytic tamarisk windbreak forests across the dry lakebed to mechanically pin fugitive sand.',
        phase3_Governance:
          'Enforce the 1973 Helmand River Water Treaty with automated ultrasonic flow gauge stations linked to public satellite telemetry.',
      },
      keyMetrics: [
        { label: 'PM2.5 Peak Density', value: '2,240 µg/m³', delta: '+1400% Hazardous', trend: 'critical-high' },
        { label: 'Wind Velocity', value: '125 km/h', delta: '+65%', trend: 'critical-high' },
        { label: 'Wetland Desiccation', value: '99.4% Dry', delta: '-99.4%', trend: 'critical-low' },
        { label: 'Village Abandonment', value: '142 settlements', delta: 'Evacuated', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'congo-basin-peatland-fire',
    title: 'Congo Basin Cuvette Centrale Peatland Fire & Methane Pulse',
    prompt: 'Simulate Congo Basin peatland wildfire and methane release',
    category: 'Biosphere & Tipping Point',
    tags: ['Congo Basin', 'Peatland', 'Methane Outgassing', 'Wildfire', 'Carbon Bomb'],
    target: {
      name: 'Cuvette Centrale Peatlands, Republic of Congo / DRC',
      region: 'SUBTERRANEAN CARBON VAULT',
      lat: 0.0000,
      lon: 18.5000,
      altitude: 2.1,
    },
    shaderParams: {
      simulationType: 4.0,
      center: [0.0000, 18.5000],
      radiusDeg: 6.5,
      intensity: 0.89,
      albedoDelta: '-0.12 (Charred canopy and dense smoke)',
      surfaceTempDelta: '+6.8°C subterranean smolder',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Severe drying of the world’s largest tropical peatland complex (Cuvette Centrale) allows smoldering fires to breach the water table. The underground combustion of 10,000-year-old peat deposits triggers an unprecedented release of 4.2 gigatons of CO2 equivalent and intense methane (CH4) outgassing.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: 145,000 sq km swamp forest between the Congo and Ubangi rivers. Sentinel-5P TROPOMI instruments register severe methane plumes peaking over 2,400 ppb.',
      museWonder10_Physics:
        'SUBTERRANEAN SMOLDERING COMBUSTION: Smoldering propagates silently beneath root mats without open flame, consuming up to 2 meters of carbon-dense peat soil and rendering conventional airborne water drops ineffective.',
      museSpark12_ImpactCascades:
        'GLOBAL WARMING ACCELERATION: Release of locked carbon equivalent to 3 years of global fossil emissions; dense toxic haze blanket over Central Africa disrupting flight corridors from Kinshasa to Nairobi.',
      strategicProtocols: {
        phase1_Immediate:
          'Deploy thermal drone swarms with infrared sensors to map subsurface smolder fronts; deploy high-pressure trench-flooding water pumps.',
        phase2_Stabilization:
          'Construct peat re-wetting canals and clay bund barriers to artificially elevate water tables above smoldering coal seams.',
        phase3_Governance:
          'Incorporate the Cuvette Centrale into the Global Peatland Initiative with immediate international conservation endowment funding.',
      },
      keyMetrics: [
        { label: 'CO2e Released', value: '4.2 Gt CO2e', delta: 'Planetary Threat', trend: 'critical-high' },
        { label: 'CH4 Plume Peak', value: '2,420 ppb', delta: '+28%', trend: 'critical-high' },
        { label: 'Peat Burn Depth', value: '1.8 meters', delta: '-1.8 m soil', trend: 'critical-low' },
        { label: 'Air Quality Index', value: '640 AQI (Hazardous)', delta: '+520%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'siberian-permafrost-methane-crater',
    title: 'Siberian Permafrost Thaw & Thermokarst Methane Blowouts',
    prompt: 'Simulate Siberian permafrost thaw and explosive methane craters',
    category: 'Cryosphere & Climate Shock',
    tags: ['Siberia', 'Permafrost', 'Methane Crater', 'Yamal', 'Thermokarst'],
    target: {
      name: 'Yamal Peninsula, Siberia, Russia',
      region: 'THERMOKARST DETONATION TUNDRA',
      lat: 70.0000,
      lon: 70.0000,
      altitude: 2.0,
    },
    shaderParams: {
      simulationType: 1.0,
      center: [70.0000, 70.0000],
      radiusDeg: 8.0,
      intensity: 0.90,
      albedoDelta: '-0.14 (Slumped tundra & thermokarst lakes)',
      surfaceTempDelta: '+7.4°C Arctic amplification',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Extreme summer heatwave in the Arctic tundra elevates active-layer thaw to record depths. Subterranean gas-hydrate mounds (pingos) overpressurize with trapped biogenic methane, culminating in catastrophic explosive crater blowouts up to 50 meters wide.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Yamal and Gydan peninsulas along the Kara Sea coast (68°N–73°N, 66°E–80°E). Over 7,000 thermokarst subsidence features and unstable pingos mapped by satellite InSAR.',
      museWonder10_Physics:
        'EXPLOSIVE OVERPRESSURE DYNAMICS: Cryopeg ground ice melting allows gas pressure to reach 12 atmospheres under impermeable frozen caps, culminating in violent ejection of frozen earth blocks over 100 meters away.',
      museSpark12_ImpactCascades:
        'INFRASTRUCTURE COLLAPSE: Liquefaction of foundation soils causes rupture of Arctic natural gas pipelines, structural collapse of rail lines, and massive methane venting into the sensitive polar boundary layer.',
      strategicProtocols: {
        phase1_Immediate:
          'Utilize satellite InSAR surface displacement monitoring to detect expanding pingos prior to explosive failure; establish 2-km safety exclusion zones.',
        phase2_Stabilization:
          'Install controlled gas-relief drilling wells to safely bleed off pressurized methane pockets before explosive threshold is reached.',
        phase3_Governance:
          'Mandate thermosyphon ground-freezing loops around all major Arctic industrial and municipal foundation pillars.',
      },
      keyMetrics: [
        { label: 'Crater Explosions', value: '48 New Megacraters', delta: '+48', trend: 'critical-high' },
        { label: 'Methane Flux', value: '12.8 Mt CH4/yr', delta: '+240%', trend: 'critical-high' },
        { label: 'Ground Subsidence', value: '42 cm/yr', delta: '+350%', trend: 'critical-high' },
        { label: 'Pipeline Rupture Risk', value: '91% (Extreme)', delta: '+65%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'california-central-valley-megaflood',
    title: 'California Central Valley Megaflood Atmospheric River (ARkStorm)',
    prompt: 'Simulate California Central Valley ARkStorm megaflood scenario',
    category: 'Atmospheric & Extreme Weather',
    tags: ['California', 'Central Valley', 'Atmospheric River', 'Megaflood', 'ARkStorm'],
    target: {
      name: 'Central Valley, California, USA',
      region: 'ALLUVIAL INUNDATION CORRIDOR',
      lat: 37.5000,
      lon: -120.8000,
      altitude: 1.9,
    },
    shaderParams: {
      simulationType: 6.0,
      center: [37.5000, -120.8000],
      radiusDeg: 5.0,
      intensity: 0.95,
      albedoDelta: '-0.16 (Standing floodwaters)',
      surfaceTempDelta: '-2.8°C saturated troposphere',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: An extraordinary atmospheric river sequence (Category 5 Pineapple Express) taps deep tropical moisture, dumping up to 1,200 mm of precipitation over 25 days across the Sierra Nevada. Warm rain-on-snow events melt 70% of the alpine snowpack, producing runoff that completely overwhelms the Central Valley levee system.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Entire 700-km length of the Sacramento and San Joaquin Valleys (35°N to 40.5°N). Over 1.5 million acres of prime agricultural farmland inundated under 3–5 meters of standing water.',
      museWonder10_Physics:
        'INTEGRATED VAPOR TRANSPORT (IVT): IVT values exceed 1,800 kg/m/s for 72 consecutive hours. Orographic ascent against the Sierra crest creates extreme precipitation efficiency, discharging 180,000 m³/s into river channels designed for 40,000 m³/s.',
      museSpark12_ImpactCascades:
        'ECONOMIC & FOOD SECURITY CATASTROPHE: Submersion of Interstate 5 and Highway 99; total failure of drinking water treatment plants; loss of 25% of the United States’ fresh fruit and nut harvest; economic damage exceeding $1 trillion.',
      strategicProtocols: {
        phase1_Immediate:
          'Open all bypass weirs (Yolo Bypass, Sutter Bypass) to maximum capacity; mandatory evacuation of 1.2 million low-lying residents in Stockton, Sacramento, and Fresno.',
        phase2_Stabilization:
          'Deploy Army Corps of Engineers heavy amphibious sandbagging and portable hydraulic siphon pumps along compromised levees.',
        phase3_Governance:
          'Pass the California Multi-Basin Floodplain Reconnection Act to restore natural flood attenuation wetlands.',
      },
      keyMetrics: [
        { label: 'Precipitation Total', value: '1,240 mm in 25d', delta: '+450%', trend: 'critical-high' },
        { label: 'Inundated Farmland', value: '1.62 million acres', delta: '+1.62M', trend: 'critical-high' },
        { label: 'Levee Overtopping', value: '38 Major Breaches', delta: 'Catastrophic', trend: 'critical-high' },
        { label: 'Economic Exposure', value: '$1.15 Trillion', delta: 'Historic Record', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'mediterranean-marine-heatwave',
    title: 'Mediterranean Basin Marine Heatwave & Posidonia Meadow Die-off',
    prompt: 'Simulate Mediterranean marine heatwave and Posidonia die-off',
    category: 'Oceanic & Marine Collapse',
    tags: ['Mediterranean', 'Marine Heatwave', 'Posidonia Oceanica', 'Thermal Shock'],
    target: {
      name: 'Central Mediterranean Sea, Tyrrhenian Basin',
      region: 'HYPER-THERMAL BASIN',
      lat: 38.5000,
      lon: 15.0000,
      altitude: 2.0,
    },
    shaderParams: {
      simulationType: 2.0,
      center: [38.5000, 15.0000],
      radiusDeg: 6.8,
      intensity: 0.88,
      albedoDelta: '-0.03 (Thermal stratification)',
      surfaceTempDelta: '+4.2°C anomaly (30.8°C SST)',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Persistent Sahara heat dome over Southern Europe raises Mediterranean Sea surface temperatures to an astonishing 30.8°C (+4.2°C above 1982–2011 baseline). Intense water column stratification suffocates ancient Posidonia oceanica seagrass meadows, triggering mass die-off across 45,000 sq km of blue carbon habitat.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Western and Central Mediterranean (Balearic Sea, Ligurian Sea, Tyrrhenian Sea, Ionian Sea). Sentinel-3 SLSTR radiometers confirm thermal boundary layer descending past 40 meters depth.',
      museWonder10_Physics:
        'MASSIVE METABOLIC COLLAPSE: Prolonged thermal exposure beyond the 28°C physiological threshold induces shoot mortality in endemic seagrass. Dissolved oxygen levels plunge to anoxic levels (<2 mg/L) in shallow gulfs, precipitating widespread invertebrate mortality.',
      museSpark12_ImpactCascades:
        'COASTAL EROSION ACCELERATION: Loss of the seagrass root-mat destabilizes coastal sediment banks, amplifying winter storm wave impact on Mediterranean tourist beaches by 250%; tropical invasive species (lionfish, rabbitfish) displace native fauna.',
      strategicProtocols: {
        phase1_Immediate:
          'Institute emergency fishing moratoria in protected marine reserves to alleviate compounding anthropogenic stress.',
        phase2_Stabilization:
          'Implement artificial upwelling prototypes powered by offshore wave energy to circulate cooler deep waters onto shallow seagrass sanctuaries.',
        phase3_Governance:
          'Establish the Pan-Mediterranean Marine Climate Resilience Treaty for accelerated blue carbon restoration.',
      },
      keyMetrics: [
        { label: 'Peak SST Anomaly', value: '+4.2°C (30.8°C Max)', delta: '+4.2°C', trend: 'critical-high' },
        { label: 'Posidonia Mortality', value: '58% of Meadows', delta: '+58%', trend: 'critical-high' },
        { label: 'Dissolved Oxygen', value: '1.8 mg/L (Hypoxic)', delta: '-68%', trend: 'critical-low' },
        { label: 'Invasive Species Ratio', value: '44% of Biomass', delta: '+35%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'indus-river-glof-inundation',
    title: 'Indus River Glacial Lake Outburst Flood & Alluvial Inundation',
    prompt: 'Simulate Indus River glacial lake outburst flood inundation',
    category: 'Hydrological Crisis',
    tags: ['Indus River', 'GLOF', 'Karakoram', 'Monsoon Flood', 'Pakistan'],
    target: {
      name: 'Indus River Basin, Punjab / Sindh, Pakistan',
      region: 'GLOF INUNDATION BASIN',
      lat: 31.5000,
      lon: 70.5000,
      altitude: 2.1,
    },
    shaderParams: {
      simulationType: 6.0,
      center: [31.5000, 70.5000],
      radiusDeg: 6.2,
      intensity: 0.94,
      albedoDelta: '-0.15 (Alluvial silt floodwaters)',
      surfaceTempDelta: '-3.5°C inundation cooling',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Simultaneous moraine dam breaches across multiple glacial lakes in the Karakoram range coincide with an anomalous super-charged monsoon depression. A catastrophic flood wave surges through Tarbela Dam and inundates 35,000 sq km of the lower Indus agricultural corridor in Punjab and Sindh.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Indus river channel from Khyber Pakhtunkhwa through Sukkur Barrage down to the Arabian Sea delta (24°N–35°N, 67°E–73°E).',
      museWonder10_Physics:
        'DISCHARGE HYDRAULIC PEAK: Flood discharge at Sukkur Barrage reaches 1.4 million cusecs, exceeding design tolerances by 40%. Extreme sediment transport fills irrigation canals with millions of tons of boulder-silt slurry.',
      museSpark12_ImpactCascades:
        'HUMANITARIAN & CROPLAND LOSS: 22 million people affected, complete submersion of cotton, sugarcane, and rice crops; stagnation of contaminated floodwaters spawns severe waterborne disease outbreaks (cholera, malaria).',
      strategicProtocols: {
        phase1_Immediate:
          'Automated satellite InSAR trigger on glacial lake water levels; controlled pre-emptive release of Tarbela and Mangla reservoirs.',
        phase2_Stabilization:
          'Deployment of military engineering pontoons and mobile water desalination units across flooded districts in Dadu and Larkana.',
        phase3_Governance:
          'Long-term Indus Basin Living Rivers Initiative incorporating room-for-the-river wetland buffers.',
      },
      keyMetrics: [
        { label: 'Peak River Discharge', value: '1.42 million cusecs', delta: '+110%', trend: 'critical-high' },
        { label: 'Flooded Surface Area', value: '35,400 sq km', delta: '+35,400 km²', trend: 'critical-high' },
        { label: 'Crop Harvest Loss', value: '78% of Cotton/Rice', delta: '-78%', trend: 'critical-low' },
        { label: 'Displaced Population', value: '6.2 million', delta: 'Catastrophic', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'aral-sea-toxic-salt-dust',
    title: 'Aral Sea Aralkum Desert Toxic Organochlorine Dust Dispersion',
    prompt: 'Simulate Aral Sea Aralkum toxic salt dust dispersion',
    category: 'Hydrological Crisis',
    tags: ['Aral Sea', 'Aralkum', 'Toxic Dust', 'Organochlorine', 'Central Asia'],
    target: {
      name: 'Aralkum Desert (Former Aral Sea bed), Uzbekistan / Kazakhstan',
      region: 'TOXIC SALAR CORRIDOR',
      lat: 45.0000,
      lon: 59.5000,
      altitude: 2.1,
    },
    shaderParams: {
      simulationType: 7.0,
      center: [45.0000, 59.5000],
      radiusDeg: 6.0,
      intensity: 0.90,
      albedoDelta: '+0.25 (White toxic salt crust)',
      surfaceTempDelta: '+6.2°C arid continentality',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: High-velocity anticyclonic winds sweep across the 60,000 sq km exposed seabed of the Aral Sea (now the Aralkum Desert). Upwards of 75 million tons of fine toxic dust impregnated with agricultural pesticides (DDT, lindane) and heavy salts are lofted into the troposphere, depositing on glaciers in the Pamir and Tian Shan mountains.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Karakalpakstan (Uzbekistan) and Kyzylorda (Kazakhstan) (43°N–47°N, 58°E–62°E), dispersing across Turkmenistan and Iran.',
      museWonder10_Physics:
        'GLACIAL ALBEDO REDUCTION: Deposition of dark, saline dust particles on Tien Shan glaciers reduces ice albedo from 0.85 to 0.52, accelerating summer glacial melting rates by 34% and contaminating headwater drinking sources.',
      museSpark12_ImpactCascades:
        'CHRONIC EPIDEMIOLOGICAL TOLL: World-record rates of esophageal cancer, kidney failure, and infant mortality throughout the Aral disaster zone; total loss of regional microclimatic buffer, increasing summer temperatures by 3.5°C.',
      strategicProtocols: {
        phase1_Immediate:
          'Install automated laser aerosol sensors to trigger early dust warnings and shelter-in-place directives in Nukus and Muynak.',
        phase2_Stabilization:
          'Massive automated hydro-seeding of Haloxylon aphyllum (Black Saxaul) to biologically anchor shifting toxic salt sand.',
        phase3_Governance:
          'International Aral Sea Basin Fund re-capitalization focused on environmental flow guarantees for the Amu Darya delta.',
      },
      keyMetrics: [
        { label: 'Toxic Dust Lift', value: '75 Mt/yr', delta: '+340%', trend: 'critical-high' },
        { label: 'Atmospheric PM10', value: '1,680 µg/m³', delta: '+950%', trend: 'critical-high' },
        { label: 'Downwind Glacier Melt', value: '+34% Accelerated', delta: '+34%', trend: 'critical-high' },
        { label: 'Arable Soil Salinization', value: '4.2 million ha', delta: '+45%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'great-salt-lake-arsenic-dust',
    title: 'Great Salt Lake Desiccation & Arsenic Aerosolization, Utah',
    prompt: 'Simulate Great Salt Lake desiccation and arsenic dust storm',
    category: 'Hydrological Crisis',
    tags: ['Great Salt Lake', 'Arsenic Dust', 'Desiccation', 'Utah', 'Air Quality'],
    target: {
      name: 'Great Salt Lake, Utah, USA',
      region: 'TOXIC PLAYA THREAT ZONE',
      lat: 41.1500,
      lon: -112.5000,
      altitude: 1.8,
    },
    shaderParams: {
      simulationType: 7.0,
      center: [41.1500, -112.5000],
      radiusDeg: 3.8,
      intensity: 0.92,
      albedoDelta: '+0.20 (Bleached salt crust)',
      surfaceTempDelta: '+3.8°C lakebed thermal shift',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Diverting 70% of river inflows (Bear, Weber, Jordan) for municipal and agricultural alfalfa irrigation drops the Great Salt Lake below 4,188 feet elevation. Over 800 square miles of dry lakebed are exposed, releasing massive clouds of bioavailable arsenic, cadmium, and antimony directly into the Salt Lake City metropolitan basin.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Salt Lake, Davis, Weber, and Box Elder counties along the Wasatch Front (40.5°N–41.8°N, 111.8°W–112.8°W). Over 2.5 million residents in direct trajectory.',
      museWonder10_Physics:
        'HEAVY METAL AEROSOL DYNAMICS: Strong southwesterly pre-frontal winds pulverize the fragile mineral crust, elevating PM2.5 arsenic concentrations to 45 times the EPA long-term toxicity limit.',
      museSpark12_ImpactCascades:
        'HEALTH & ECONOMIC CRITICALITY: Skyrocketing incidence of pediatric asthma, cardiovascular damage, and cognitive decline; severe decline in the $1.5 billion ski industry due to premature dark dust-induced snowmelt.',
      strategicProtocols: {
        phase1_Immediate:
          'Issue automated air quality alerts triggering school closures and industrial emissions curtailment during high wind events.',
        phase2_Stabilization:
          'Emergency lease and purchase of water rights from agricultural irrigators to ensure 1.2 million acre-feet of permanent inflow.',
        phase3_Governance:
          'Pass the Great Salt Lake Recovery and Watershed Preservation Compact with mandatory conservation targets.',
      },
      keyMetrics: [
        { label: 'Exposed Lakebed', value: '820 sq miles', delta: '+120%', trend: 'critical-high' },
        { label: 'Arsenic Air Concentration', value: '45x EPA Limit', delta: '+4400%', trend: 'critical-high' },
        { label: 'Water Level Deficit', value: '-11.4 feet', delta: '-11.4 ft', trend: 'critical-low' },
        { label: 'Snowpack Dust Forcing', value: '-18 Days Season', delta: '-18 days', trend: 'critical-low' },
      ],
    },
  },
  {
    id: 'sahel-desertification-incursion',
    title: 'Sahel Desertification Frontier 25 km/Year Rapid Incursion',
    prompt: 'Simulate Sahel desertification frontier 25 km per year incursion',
    category: 'Biosphere & Tipping Point',
    tags: ['Sahel', 'Desertification', 'Sub-Sahara', 'Land Degradation', 'Ecological Collapse'],
    target: {
      name: 'Sahel Frontier, Mali / Burkina Faso / Niger',
      region: 'DESERT EXPANSION BOUNDARY',
      lat: 14.5000,
      lon: 1.0000,
      altitude: 2.2,
    },
    shaderParams: {
      simulationType: 3.0,
      center: [14.5000, 1.0000],
      radiusDeg: 9.0,
      intensity: 0.89,
      albedoDelta: '+0.15 (Grassland to sand)',
      surfaceTempDelta: '+3.2°C ground surface heating',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Decreased monsoonal reliability coupled with overgrazing causes the arid Saharan boundary to march southward at an alarming 25 km/year. Savanna biomes rapidly transition to sterile sand sheets across a 5,000-km-long belt from Senegal to Sudan.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Latitudes 12°N to 16°N across Mauritania, Senegal, Mali, Burkina Faso, Niger, Nigeria, Chad, and Sudan. MODIS NDVI satellite indices demonstrate 42% vegetation loss.',
      museWonder10_Physics:
        'CHARNEY DESERTIFICATION FEEDBACK: Stripping vegetation increases surface albedo, which promotes large-scale atmospheric subsidence and suppresses convective cloud formation, permanently locking in drought conditions.',
      museSpark12_ImpactCascades:
        'FOOD & REGIONAL SECURITY THREAT: Complete collapse of pastoralist transhumance corridors; violent farmer-herder conflicts over shrinking fertile land; displacement of 14 million people toward coastal West African cities.',
      strategicProtocols: {
        phase1_Immediate:
          'Accelerate construction of the African Union’s "Great Green Wall" shelterbelt using indigenous drought-resilient Acacia senegal.',
        phase2_Stabilization:
          'Widespread deployment of Farmer Managed Natural Regeneration (FMNR) and traditional water-harvesting "Zaï" pit techniques.',
        phase3_Governance:
          'Establish a Pan-Sahel Agro-Ecological Fund backed by international carbon and biodiversity credits.',
      },
      keyMetrics: [
        { label: 'Desert Advance Rate', value: '25.4 km/yr', delta: '+180%', trend: 'critical-high' },
        { label: 'NDVI Vegetation Drop', value: '-42% Density', delta: '-42%', trend: 'critical-low' },
        { label: 'Pasture Carrying Capacity', value: '-65% Livestock', delta: '-65%', trend: 'critical-low' },
        { label: 'Displaced Population', value: '14.2 million', delta: 'Severe', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'australian-pyrocb-smoke-injection',
    title: 'Australian Black Summer Pyro-cumulonimbus Stratospheric Smoke Column',
    prompt: 'Simulate Australian Black Summer pyrocumulonimbus smoke injection',
    category: 'Atmospheric & Extreme Weather',
    tags: ['Australia', 'Black Summer', 'PyroCb', 'Bushfire', 'Stratosphere'],
    target: {
      name: 'Southeastern Australia, New South Wales / Victoria',
      region: 'PYRO-CONVECTIVE CHIMNEY',
      lat: -35.5000,
      lon: 149.0000,
      altitude: 2.1,
    },
    shaderParams: {
      simulationType: 4.0,
      center: [-35.5000, 149.0000],
      radiusDeg: 7.5,
      intensity: 0.94,
      albedoDelta: '+0.12 (Aerosol backscatter)',
      surfaceTempDelta: '+8.5°C firestorm / -1.2°C surface dimming',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Extreme multi-state eucalyptus forest firestorms generate towering pyro-cumulonimbus (PyroCb) thunderstorm chimneys reaching 16 km into the lower stratosphere. Over 1 million metric tons of black carbon and organic aerosols are lofted into the stratosphere, circling the Southern Hemisphere for 18 months.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Megafire complexes across the Great Dividing Range (33°S to 38°S, 147°E to 151°E), with smoke plumes tracked by CALIPSO and Himawari-8 spanning the Pacific Ocean.',
      museWonder10_Physics:
        'SOLAR SELF-LOFTING EFFECT: Highly absorbing black carbon aerosols absorb incoming sunlight, heating the surrounding air and self-lofting deeper into the mid-stratosphere (up to 35 km altitude), where they deplete polar ozone and disrupt Antarctic vortex stability.',
      museSpark12_ImpactCascades:
        'BIOSPHERE CARNAGE: Death or displacement of an estimated 3 billion native vertebrates; smoke plume fallout across New Zealand turns alpine glaciers brown, increasing melt rates by 22%.',
      strategicProtocols: {
        phase1_Immediate:
          'Utilize geostationary lightning mappers (GLM/Himawari) to detect nascent PyroCb convective updrafts and warn firefighting ground crews of violent fire tornadoes.',
        phase2_Stabilization:
          'Deploy long-range high-capacity aerial retardant water bombers (DC-10 / 737) to contain catastrophic firefront flank mergers.',
        phase3_Governance:
          'Integrate Indigenous cultural cool-burning practices into state-wide bushfire hazard reduction programs.',
      },
      keyMetrics: [
        { label: 'Stratospheric Smoke', value: '1.15 Mt Aerosols', delta: 'Historic High', trend: 'critical-high' },
        { label: 'PyroCb Storm Cloud Tops', value: '16.4 km Altitude', delta: 'Stratospheric Breach', trend: 'critical-high' },
        { label: 'Burned Forest Area', value: '18.6 million ha', delta: '+320%', trend: 'critical-high' },
        { label: 'Wildlife Mortalities', value: '3.1 Billion Animals', delta: 'Catastrophic', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'dead-sea-sinkhole-hydro-subsidence',
    title: 'Dead Sea Accelerated Hydro-Subsidence & Megasinkhole Swarm',
    prompt: 'Simulate Dead Sea hydro-subsidence and sinkhole collapse',
    category: 'Hydrological Crisis',
    tags: ['Dead Sea', 'Sinkholes', 'Hydro-Subsidence', 'Jordan Valley', 'Israel', 'Jordan'],
    target: {
      name: 'Dead Sea Basin, Jordan Rift Valley',
      region: 'TECTONIC HYDRAULIC SINK',
      lat: 31.5000,
      lon: 35.5000,
      altitude: 1.7,
    },
    shaderParams: {
      simulationType: 6.0,
      center: [31.5000, 35.5000],
      radiusDeg: 2.5,
      intensity: 0.91,
      albedoDelta: '+0.10 (Exposed mineral mudflats)',
      surfaceTempDelta: '+2.8°C microclimate warming',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Diverting 95% of the Jordan River’s headwaters for agricultural irrigation accelerates the Dead Sea’s water level decline to an alarming 1.3 meters per year. The receding hyper-saline shoreline permits fresh groundwater to dissolve subterranean rock-salt strata, spawning over 7,500 active megasinkholes that destroy roads, hotels, and agricultural plantations.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Dead Sea coastal fringe between Ein Gedi and the Lisan Peninsula (31.2°N–31.7°N, 35.3°E–35.6°E). Surface elevation stands at -438 meters below mean sea level.',
      museWonder10_Physics:
        'SUBSURFACE HALITE DISSOLUTION: As the base level of erosion drops, the freshwater-saltwater underground interface migrates seaward. Rapid dissolution of 10,000-year-old subterranean halite beds creates massive voids that collapse without warning.',
      museSpark12_ImpactCascades:
        'CRITICAL INFRASTRUCTURE COLLAPSE: Complete closure of Highway 90; abandonment of mineral extraction facilities and multi-million-dollar eco-tourism resorts; severance of natural desert springs nurturing rare oasis wildlife.',
      strategicProtocols: {
        phase1_Immediate:
          'Deploy continuous millimeter-accuracy satellite InSAR radar interferometry and ground micro-gravity surveys to map cavernous subsurface voids.',
        phase2_Stabilization:
          'Construct controlled seawater bypass conduits and pilot Red Sea-Dead Sea desalinated brine conveyance tunnels.',
        phase3_Governance:
          'Establish a trilateral Jordan-Israel-Palestine water management authority to restore a minimum 400 million cubic meter annual environmental flow from the Jordan River.',
      },
      keyMetrics: [
        { label: 'Water Level Drop Rate', value: '1.32 m/year', delta: '+35%', trend: 'critical-high' },
        { label: 'Active Sinkholes', value: '7,650+', delta: '+450%', trend: 'critical-high' },
        { label: 'Current Elevation', value: '-438 m MSL (Record)', delta: '-438m', trend: 'critical-low' },
        { label: 'Highway 90 Deformations', value: '28 Critical Zones', delta: 'Dangerous', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'east-african-rift-magma-venting',
    title: 'East African Rift Geothermal Magma Plume Venting, Afar Depression',
    prompt: 'Simulate East African Rift magma venting Afar Depression',
    category: 'Tectonic & Volcanic',
    tags: ['Afar Depression', 'East African Rift', 'Magma Venting', 'Continental Rifting', 'Ethiopia'],
    target: {
      name: 'Afar Triple Junction, Ethiopia / Djibouti / Eritrea',
      region: 'CONTINENTAL TEARING CRUST',
      lat: 11.5000,
      lon: 41.5000,
      altitude: 1.9,
    },
    shaderParams: {
      simulationType: 4.0,
      center: [11.5000, 41.5000],
      radiusDeg: 4.5,
      intensity: 0.95,
      albedoDelta: '-0.18 (Basalt lava flows)',
      surfaceTempDelta: '+120°C localized fissure venting',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Accelerated mantle plume upwelling beneath the Afar Triple Junction drives acute continental rifting. A 60-km-long basaltic fissure eruption tears open the crust, discharging massive low-viscosity lava flows and emitting millions of tons of sulfur dioxide (SO2) and carbon dioxide into the Horn of Africa.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Afar Depression from Erta Ale to the Dabbahu volcano (11.0°N–13.5°N, 40.5°E–42.5°E). Ground deformation monitored by Sentinel-1 InSAR confirms crustal widening of 4.5 meters in 14 days.',
      museWonder10_Physics:
        'MAGMATIC DIKE INTRUSION: Injection of a 2.5-cubic-kilometer basaltic magma sheet into the upper crust creates intense extensional faulting and graben subsidence, signaling the incipient creation of a new oceanic basin.',
      museSpark12_ImpactCascades:
        'REGIONAL TOXIC HAZARDS: Heavy sulfurous volcanic smog (vog) blankets Djibouti and eastern Ethiopia; disruption of aviation across the Bab-el-Mandeb maritime shipping corridor; displacement of pastoralist Afar communities.',
      strategicProtocols: {
        phase1_Immediate:
          'Establish 50-km exclusion zones around active fissure swarms; distribute SO2 gas masks and acid-resistant shelter supplies.',
        phase2_Stabilization:
          'Deploy continuous seismic and GNSS monitoring arrays to track sub-surface magma migration toward the Red Sea shoreline to prevent steam-explosion hazards.',
        phase3_Governance:
          'Harness emerging shallow geothermal superheated brine reservoirs for regional green industrialization.',
      },
      keyMetrics: [
        { label: 'Crustal Tearing Width', value: '4.8 meters in 14d', delta: '+4.8m', trend: 'critical-high' },
        { label: 'Lava Discharge Rate', value: '480 m³/sec', delta: 'Cataclysmic', trend: 'critical-high' },
        { label: 'SO2 Gas Emissions', value: '45,000 tons/day', delta: '+850%', trend: 'critical-high' },
        { label: 'Seismic Swarm Activity', value: '2,800 Tremors/week', delta: '+1200%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'baltic-sea-eutrophication-dead-zone',
    title: 'Baltic Sea Hyper-Eutrophication & Anoxic Dead Zone Expansion',
    prompt: 'Simulate Baltic Sea hyper-eutrophication and anoxic dead zone',
    category: 'Oceanic & Marine Collapse',
    tags: ['Baltic Sea', 'Eutrophication', 'Anoxic Dead Zone', 'Cyanobacteria', 'Europe'],
    target: {
      name: 'Central Baltic Sea, Gotland Deep',
      region: 'ANOXIC MARINE BASIN',
      lat: 57.0000,
      lon: 20.0000,
      altitude: 2.0,
    },
    shaderParams: {
      simulationType: 5.0, // Emerald algal bloom
      center: [57.0000, 20.0000],
      radiusDeg: 5.5,
      intensity: 0.90,
      albedoDelta: '+0.06 (Dense cyanobacterial scum)',
      surfaceTempDelta: '+2.4°C bloom absorption',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Excessive agricultural nitrogen and phosphorus runoff combined with restricted North Sea water inflows (Major Baltic Inflows) causes explosive toxic cyanobacteria (Nodularia spumigena) blooms. The benthic anoxic dead zone expands to an unprecedented 75,000 sq km, extinguishing deep marine life across the Gotland Deep.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Central Baltic Proper, Bornholm Basin, and Gulf of Finland (55°N–60°N, 15°E–25°E). Benthic oxygen measurements confirm 0.0 mg/L below 70 meters depth.',
      museWonder10_Physics:
        'BENTHIC PHOSPHORUS INTERNAL LOADING: Under anoxic conditions, iron-bound phosphorus is liberated from bottom sediments back into the water column, creating a runaway self-fertilizing feedback loop that perpetuates blooms independent of external land runoff.',
      museSpark12_ImpactCascades:
        'FISHERIES EXTINCTION: Complete reproductive failure of Eastern Baltic cod due to hypoxia in spawning deeps; mass closure of coastal tourism beaches across Sweden, Poland, and Finland due to hepatotoxic microcystin accumulation.',
      strategicProtocols: {
        phase1_Immediate:
          'Satellite Sentinel-3 OLCI automated toxic cyanobacteria surface scum tracking; issue real-time beach health closures.',
        phase2_Stabilization:
          'Deploy pilot ship-based deepwater oxygenation injection systems directly into stagnant deep basins.',
        phase3_Governance:
          'Mandate strict 50% fertilizer application reduction quotas under the Helsinki Commission (HELCOM) Baltic Sea Action Plan.',
      },
      keyMetrics: [
        { label: 'Anoxic Dead Zone Area', value: '75,000 sq km (Record)', delta: '+45%', trend: 'critical-high' },
        { label: 'Cyanobacteria Coverage', value: '140,000 sq km', delta: '+80%', trend: 'critical-high' },
        { label: 'Bottom Water Oxygen', value: '0.0 mg/L (Anoxic)', delta: '-100%', trend: 'critical-low' },
        { label: 'Cod Spawning Success', value: 'Near Zero (3% normal)', delta: '-97%', trend: 'critical-low' },
      ],
    },
  },
  {
    id: 'atacama-desert-rare-deluge',
    title: 'Atacama Desert Rare Extreme Deluge & Lithium Salar Inundation',
    prompt: 'Simulate Atacama Desert extreme deluge and lithium salar inundation',
    category: 'Atmospheric & Extreme Weather',
    tags: ['Atacama Desert', 'Extreme Deluge', 'Lithium Salar', 'Chile', 'Flash Flood'],
    target: {
      name: 'Salar de Atacama, Antofagasta, Chile',
      region: 'HYPER-ARID INUNDATION FIELD',
      lat: -23.8634,
      lon: -69.1328,
      altitude: 2.0,
    },
    shaderParams: {
      simulationType: 6.0,
      center: [-23.8634, -69.1328],
      radiusDeg: 4.2,
      intensity: 0.94,
      albedoDelta: '-0.22 (Reflective salt pan submerged by muddy water)',
      surfaceTempDelta: '-5.8°C evaporative cooling',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: An unprecedented cut-off cold low-pressure system breaches the Andean barrier, dumping 85 mm of torrential rain in 48 hours over the hyper-arid Atacama Desert (where average rainfall is <2 mm/decade). Catastrophic mud-torrents submerge the world’s largest lithium brine evaporite ponds, triggering global battery supply-chain disruption.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Salar de Atacama and Antofagasta region (-22°S to -25°S, -68°W to -70.5°W). Dry ravines (quebradas) transform into raging flash rivers.',
      museWonder10_Physics:
        'MICROBIAL OSMOTIC SHOCK: Endemic hyper-xerophilic microorganisms adapted to millions of years of extreme desiccation suffer fatal osmotic shock; 85% of soil bacterial biodiversity is wiped out by sudden water saturation.',
      museSpark12_ImpactCascades:
        'GLOBAL CLEAN ENERGY SHOCK: Complete dilution and breach of chemical containment dikes at SQM and Albemarle lithium evaporation facilities; global battery-grade lithium carbonate spot prices spike 280% within 7 days.',
      strategicProtocols: {
        phase1_Immediate:
          'Deploy heavy earthmoving armor to fortify chemical containment dikes and prevent hyper-saline chemical spills into local indigenous oasis water supplies.',
        phase2_Stabilization:
          'Install high-volume mobile mechanical vapor recompression evaporators to rescue diluted lithium brine reservoirs.',
        phase3_Governance:
          'Mandate flood-hardened direct lithium extraction (DLE) infrastructure guidelines for Andean salt flats.',
      },
      keyMetrics: [
        { label: '48h Precipitation', value: '88.5 mm (40x Annual)', delta: '+4300%', trend: 'critical-high' },
        { label: 'Lithium Ponds Diluted', value: '78% of Evaporation Beds', delta: 'Catastrophic', trend: 'critical-high' },
        { label: 'Soil Microbe Mortality', value: '85% Extinction', delta: '+85%', trend: 'critical-high' },
        { label: 'Lithium Price Spike', value: '+280% Global Index', delta: '+280%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'arctic-blue-ocean-event',
    title: 'Arctic Ocean Blue Ocean Event (Zero Summer Sea Ice)',
    prompt: 'Simulate Arctic Blue Ocean Event zero summer sea ice',
    category: 'Cryosphere & Climate Shock',
    tags: ['Arctic Ocean', 'Blue Ocean Event', 'Albedo Tipping Point', 'Polar Ice', 'Cryosphere'],
    target: {
      name: 'North Pole, Arctic Ocean Basin',
      region: 'UNFROZEN POLAR CORE',
      lat: 85.0000,
      lon: 0.0000,
      altitude: 2.2,
    },
    shaderParams: {
      simulationType: 2.0,
      center: [85.0000, 0.0000],
      radiusDeg: 18.0,
      intensity: 0.96,
      albedoDelta: '-0.55 (White ice 0.65 -> Dark ocean 0.10)',
      surfaceTempDelta: '+5.5°C ocean heat absorption',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Summer sea ice extent across the Arctic Ocean falls below the critical 1.0 million sq km threshold, formally triggering the first "Blue Ocean Event" (BOE) in human history. The planetary albedo flips from a reflective mirror (0.65) to an abyssal heat absorber (0.08), absorbing an extra 2.4 million petajoules of solar radiation annually.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Entire Arctic Basin north of 75°N, including Beaufort, Chukchi, Laptev, and East Siberian Seas. Complete eradication of multi-year pack ice confirmed by CryoSat-2 and ICESat-2 altimetry.',
      museWonder10_Physics:
        'PLANETARY THERMODYNAMIC FEEDBACK: Heat absorption by open ocean waters prevents autumn freeze-up until December. The polar-equator thermal gradient weakens drastically, unlocking the circumpolar jet stream into catastrophic high-amplitude meandering (wobbly jet stream).',
      museSpark12_ImpactCascades:
        'GLOBAL CLIMATE VOLATILITY: Radical amplification of extreme weather across the Northern Hemisphere (intense winter cold snaps in Texas/Europe alternating with summer mega-droughts); critical endangerment of polar bears, seals, and walruses.',
      strategicProtocols: {
        phase1_Immediate:
          'Continuous real-time satellite microwave radiometry tracking of open-water thermal absorption rates; international maritime speed restrictions.',
        phase2_Stabilization:
          'Assess emergency Arctic ice-thickening pumping projects (wind-powered seawater spraying onto nascent winter ice).',
        phase3_Governance:
          'Enact the Universal Arctic Ecological Sanctuary Treaty banning industrial exploitation of newly ice-free polar waters.',
      },
      keyMetrics: [
        { label: 'Sea Ice Area', value: '0.78 million sq km', delta: '-82% (Record Low)', trend: 'critical-low' },
        { label: 'Albedo Transition', value: '0.65 -> 0.09', delta: '-86%', trend: 'critical-low' },
        { label: 'Excess Heat Absorbed', value: '+2.4 x 10^15 J/yr', delta: 'Planetary Surge', trend: 'critical-high' },
        { label: 'Jet Stream Waviness Index', value: '1.92 (Extreme Meander)', delta: '+75%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'pinatubo-scale-volcanic-cooling',
    title: 'Mount Pinatubo Scale Volcanic Sulfate Global Cooling',
    prompt: 'Simulate Mount Pinatubo scale volcanic sulfate global cooling',
    category: 'Tectonic & Volcanic',
    tags: ['Volcano', 'Pinatubo', 'Sulfate Aerosols', 'Global Cooling', 'Stratosphere'],
    target: {
      name: 'Mount Pinatubo, Luzon, Philippines',
      region: 'STRATOSPHERIC VOLCANIC INJECTION',
      lat: 15.1300,
      lon: 120.3500,
      altitude: 2.0,
    },
    shaderParams: {
      simulationType: 4.0,
      center: [15.1300, 120.3500],
      radiusDeg: 12.0,
      intensity: 0.93,
      albedoDelta: '+0.15 (Global stratospheric aerosol veil)',
      surfaceTempDelta: '-0.65°C global mean cooling for 24 months',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Plinian ultra-volcanic eruption injects 22 million tons of SO2 into the tropical stratosphere (25 km altitude). The gas rapidly converts to sub-micron sulfuric acid aerosols (H2SO4), forming a global reflective shroud that suppresses global average surface temperatures by 0.65°C for two consecutive years.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Ground zero Zambales Mountains, Luzon, Philippines (15.13°N, 120.35°E). Equatorial Brewer-Dobson stratospheric circulation distributes aerosols across both hemispheres within 21 days.',
      museWonder10_Physics:
        'RADIATIVE FORCING: Solar shortwave backscattering produces negative radiative forcing of -3.2 W/m². Concurrently, absorption of terrestrial infrared radiation heats the stratosphere by +3.5°C, altering tropical upper-tropospheric wind shears.',
      museSpark12_ImpactCascades:
        'HYDROLOGICAL ATTENUATION: Global precipitation declines by 3.8%; weakened Asian and African monsoon systems lead to widespread agricultural yield reductions in rainfed rice and sorghum regions.',
      strategicProtocols: {
        phase1_Immediate:
          'Utilize limb-scanning satellite sensors (OMPS / SAGE III) to track aerosol layer thickness and size distribution.',
        phase2_Stabilization:
          'Optimize global grain storage release schedules to buffer against localized monsoon failures.',
        phase3_Governance:
          'Utilize the empirical cooling dataset to rigorously constrain climate sensitivity parameters in Earth System Models.',
      },
      keyMetrics: [
        { label: 'Stratospheric SO2 Injected', value: '22.4 Mt', delta: 'Historic Event', trend: 'critical-high' },
        { label: 'Global Mean Cooling', value: '-0.65°C', delta: '-0.65°C', trend: 'critical-low' },
        { label: 'Global Rainfall Deficit', value: '-3.8%', delta: '-3.8%', trend: 'critical-low' },
        { label: 'Optical Depth Peak', value: '0.18 Global AOD', delta: '+1200%', trend: 'critical-high' },
      ],
    },
  },
  {
    id: 'sundarbans-sea-level-submersion',
    title: 'Sundarbans Mangrove Delta 1.2-Meter Sea Level Submersion',
    prompt: 'Simulate Sundarbans mangrove delta 1.2 meter sea level rise',
    category: 'Oceanic & Marine Collapse',
    tags: ['Sundarbans', 'Sea Level Rise', 'Mangrove Forest', 'Bengal Delta', 'India', 'Bangladesh'],
    target: {
      name: 'Sundarbans Mangrove Forest, India / Bangladesh',
      region: 'EUSTATIC INUNDATION DELTA',
      lat: 21.9497,
      lon: 89.1833,
      altitude: 1.8,
    },
    shaderParams: {
      simulationType: 6.0,
      center: [21.9497, 89.1833],
      radiusDeg: 4.8,
      intensity: 0.96,
      albedoDelta: '-0.14 (Permanent saline tidal drowning)',
      surfaceTempDelta: '+1.5°C saline marsh decay',
    },
    reasoning: {
      swarmConsensusSummary:
        'Meta AI Swarm Consensus: Accelerated polar ice discharge combined with regional deltaic sediment compaction produces a 1.2-meter relative sea-level rise across the Ganges-Brahmaputra-Meghna delta. Over 75% of the UNESCO World Heritage Sundarbans mangrove forest is permanently submerged, obliterating the primary natural cyclone barrier protecting Kolkata and Dhaka.',
      museSpark13_Geospatial:
        'SPATIAL VECTOR LOCK: Coastal mangrove fringe spanning West Bengal (India) and Khulna/Barisal (Bangladesh) (21.5°N–22.6°N, 88.0°E–90.5°E). Over 10,000 sq km of intertidal forest inundated.',
      museWonder10_Physics:
        'HYDRODYNAMIC ATTENUATION LOSS: Permanent drowning of pneumatophore root systems kills dominant Sundari (Heritiera fomes) trees. Storm wave dissipation drops by 85%, allowing high-energy ocean surges to penetrate unhindered into dense inland agricultural settlements.',
      museSpark12_ImpactCascades:
        'DISPLACEMENT & EXTINCTION CRISIS: Forced climate displacement of 4.5 million deltaic residents; total loss of the wild Bengal tiger’s primary mangrove sanctuary; massive hyper-salinization of regional freshwater aquifers.',
      strategicProtocols: {
        phase1_Immediate:
          'Execute organized phased retreat of low-lying island communities (Ghoramara, Sagar) to designated mainland resilience hubs.',
        phase2_Stabilization:
          'Construct elevated super-dykes with integrated saline-tolerant aquaculture and floating agricultural platforms.',
        phase3_Governance:
          'Establish a Joint India-Bangladesh Delta Climate Commission financed through international Loss and Damage mechanisms.',
      },
      keyMetrics: [
        { label: 'Relative Sea Level Rise', value: '+1.20 meters', delta: '+1.20 m', trend: 'critical-high' },
        { label: 'Mangrove Loss', value: '76% Submerged', delta: '-76%', trend: 'critical-low' },
        { label: 'Displaced Population', value: '4.5 million', delta: 'Severe Crisis', trend: 'critical-high' },
        { label: 'Storm Wave Energy at Coast', value: '+450% Penetration', delta: '+450%', trend: 'critical-high' },
      ],
    },
  },
];

/**
 * Searches the 30 planetary simulations catalog by query text or coordinates.
 */
export function isDayNightQuery(query: string): boolean {
  if (!query) return false;
  const q = query.trim().toLowerCase();
  return (
    (q.includes('day') && q.includes('night')) ||
    q.includes('terminator') ||
    q.includes('sun shadow') ||
    q.includes('solar shadow') ||
    q.includes('solar position') ||
    q.includes('night lights') ||
    q.includes('city lights') ||
    q.includes('diurnal') ||
    q.includes('subsolar') ||
    (q.includes('day') && q.includes('simulat')) ||
    (q.includes('night') && q.includes('simulat'))
  );
}

export function findPlanetarySimulation(query: string): PlanetarySimulationScenario | null {
  if (!query) return null;
  if (isDayNightQuery(query)) {
    return null;
  }
  const q = query.trim().toLowerCase();

  // 1. Direct prompt or title match
  for (const sim of PLANETARY_SIMULATIONS_CATALOG) {
    if (q.includes(sim.id)) return sim;
    const cleanTitle = sim.title.toLowerCase();
    const cleanPrompt = sim.prompt.toLowerCase();
    if (q.includes(cleanTitle) || cleanTitle.includes(q)) return sim;
    if (q.includes(cleanPrompt) || cleanPrompt.includes(q)) return sim;
    for (const tag of sim.tags) {
      if (q.includes(tag.toLowerCase())) {
        // If query mentions simulate or simulation and has tag
        if (q.includes('simulat') || q.includes('scenario') || q.includes('what happen') || q.includes('effect')) {
          return sim;
        }
      }
    }
  }

  // 2. Specific landmark keywords
  if (q.includes('thar') || q.includes('rajasthan snow')) {
    return PLANETARY_SIMULATIONS_CATALOG[0]; // Thar Desert Snowfall
  }
  if (q.includes('bay of bengal') && (q.includes('warm') || q.includes('heat') || q.includes('ocean'))) {
    return PLANETARY_SIMULATIONS_CATALOG[1]; // Bay of Bengal Marine Heatwave
  }
  if (q.includes('greenland') || q.includes('jakobshavn')) {
    return PLANETARY_SIMULATIONS_CATALOG[2]; // Greenland
  }
  if (q.includes('amazon') && (q.includes('drought') || q.includes('dieback') || q.includes('dry'))) {
    return PLANETARY_SIMULATIONS_CATALOG[3]; // Amazon
  }
  if (q.includes('yellowstone') || q.includes('supervolcano')) {
    return PLANETARY_SIMULATIONS_CATALOG[4]; // Yellowstone
  }
  if (q.includes('sahara') && (q.includes('green') || q.includes('solar'))) {
    return PLANETARY_SIMULATIONS_CATALOG[5]; // Sahara Regreening
  }
  if (q.includes('amoc') || q.includes('gulf stream') || q.includes('atlantic freeze')) {
    return PLANETARY_SIMULATIONS_CATALOG[6]; // AMOC Shutdown
  }
  if (q.includes('murasu') || (q.includes('cyclone') && (q.includes('chennai') || q.includes('coromandel')))) {
    return PLANETARY_SIMULATIONS_CATALOG[7]; // Cyclone Murasu
  }
  if (q.includes('delhi') && (q.includes('heat') || q.includes('wet bulb') || q.includes('50') || q.includes('52'))) {
    return PLANETARY_SIMULATIONS_CATALOG[10]; // Delhi Heat Dome
  }
  if (q.includes('barrier reef') || q.includes('coral')) {
    return PLANETARY_SIMULATIONS_CATALOG[11]; // Great Barrier Reef
  }

  // Generic fallback if user typed "simulate" or "simulation"
  if (q.includes('simulat') || q.includes('scenario')) {
    // Check if query contains any keywords from all 30
    for (const sim of PLANETARY_SIMULATIONS_CATALOG) {
      const words = sim.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      for (const w of words) {
        if (q.includes(w)) return sim;
      }
    }
    // Default to Thar Desert Snowfall as requested
    return PLANETARY_SIMULATIONS_CATALOG[0];
  }

  return null;
}
