/* eslint-disable camelcase */
/*
 * The Pit
 */

const {
  getRatio,
  pickKeys,
} = require('../../util/utility');

// TODO - Decode the inventory data to more readable format
const inventoryToBase64 = (object) => object.data ? Buffer.from(object.data).toString('base64') : null;



function mergeStats({
  chat_messages = 0,
  playtime_minutes = 0,
  enderchest_opened = 0,
  cash = 0,
  cash_earned = 0,
  left_clicks = 0,
  kills = 0,
  deaths = 0,
  assists = 0,
  joins = 0,
  renown = 0,
  renown_unlocks = [],
  xp = 0,
  prestiges = [],
  diamond_items_purchased = 0,
  // Damage stats
  damage_dealt = 0,
  melee_damage_dealt = 0,
  bow_damage_dealt = 0,
  damage_received = 0,
  melee_damage_received = 0,
  bow_damage_received = 0,
  // Misc
  sword_hits = 0,
  arrows_fired = 0,
  arrow_hits = 0,
  jumped_into_pit = 0,
  launched_by_launchers = 0,
  max_streak = 0,
  blocks_placed = 0,
  block_broken = 0,
  gapple_eaten = 0,
  ghead_eaten = 0,
  lava_bucket_emptied = 0,
  fishing_rod_launched = 0,
  soups_drank = 0,
  last_save = null,
  king_quest = {},
  sewer_treasures_found = 0,
  wheat_farmed = 0,
  night_quests_completed = 0,
  dark_pants_crated = 0, // typo lol
  hotbar_favorites = {},
  // Contracts
  contracts_started = 0,
  contracts_completed = 0,
  // Inventories
  inv_contents = {},
  inv_armor = {},
  inv_enderchest = {},
  item_stash = {},
  mystic_well_item = {},
  mystic_well_pants = {},
  // Selected perks
  selected_perk_0 = null,
  selected_perk_1 = null,
  selected_perk_2 = null,
  selected_perk_3 = null,
  // Genesis Map
  allegiance = 'NONE',
  genesis_points = 0,
  // Rest
  ...rest
}) {
  const getCoinsDuringPrestige = (regexp) => pickKeys(rest, {
    regexp,
    keyMap: (key) => key.replace(regexp, ''),
    valueMap: (value) => Math.round(value),
  });

const levelXpRequirements = [15, 30, 50, 75, 125, 300, 600, 800, 900, 1000, 1200, 1500]; 
const prestigeXpMultipliers = [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 45, 50, 75, 100, 101, 101, 101, 101, 101];
const prestigeXpTotals = prestigeXpMultipliers.map(multi => levelXpRequirements.reduce((acc, cur) => acc + Math.ceil(cur*multi-0.01) * 10, 0));
const xpPriorToPrestige = prestigeXpTotals.map((_, index, arr) => arr.slice(0, index).reduce((acc, cur) => acc + cur, 0));

const prestige = prestiges.length;

let scaledXp = (xp - xpPriorToPrestige[prestige]) / prestigeXpMultipliers[prestige];

let level = 0;
for(const xpAmount of levelXpRequirements){
  const canAdd = Math.floor(Math.min(10, scaledXp / xpAmount));
  scaledXp -= canAdd * xpAmount;
  level += canAdd;
}

  return {
    level,
    kills,
    assists,
    deaths,
    kd_ratio: getRatio(kills, deaths),
    sword_hits,
    arrows_fired,
    arrow_hits,
    arrow_accuracy: getRatio(arrows_fired, arrow_hits),
    chat_messages,
    playtime_minutes,
    enderchest_opened,
    gold: Math.round(cash),
    gold_earned: Math.round(cash_earned),
    xp,
    prestige,
    renown,
    renown_unlocks,
    left_clicks,
    joins,
    last_save,
    contracts_started,
    contracts_completed,
    king_quest,
    diamond_items_purchased,
    jumped_into_pit,
    launched_by_launchers,
    max_streak,
    blocks_placed,
    block_broken,
    lava_bucket_emptied,
    gapple_eaten,
    ghead_eaten,
    fishing_rod_launched,
    soups_drank,
    sewer_treasures_found,
    night_quests_completed,
    wheat_farmed,
    hotbar_favorites,
    allegiance,
    genesis_points,
    dark_pants_created: dark_pants_crated,
    gold_during_prestige: getCoinsDuringPrestige(/^cash_during_prestige_/),
    selected_perks: {
      1: selected_perk_0,
      2: selected_perk_1,
      3: selected_perk_2,
      4: selected_perk_3,
    },
    items: {
      inventory: inventoryToBase64(inv_contents),
      armor: inventoryToBase64(inv_armor),
      enderchest: inventoryToBase64(inv_enderchest),
      stash: inventoryToBase64(item_stash),
      mystic_well_item: inventoryToBase64(mystic_well_item),
      mystic_well_pants: inventoryToBase64(mystic_well_pants),
    },
    damage_dealt: {
      total: damage_dealt,
      melee: melee_damage_dealt,
      bow: bow_damage_dealt,
    },
    damage_taken: {
      total: damage_received,
      melee: melee_damage_received,
      bow: bow_damage_received,
    },
  };
}

module.exports = ({
  profile = {},
  pit_stats_ptl = {},
}) => mergeStats({ ...profile, ...pit_stats_ptl });
