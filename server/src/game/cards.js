// cards.js — Machi Koro 2 base game card definitions
// Each card definition is a template; actual instances are tracked in GameState

const CARD_COLOR = {
  BLUE: 'blue',     // activates on anyone's roll
  GREEN: 'green',   // activates only on your roll
  RED: 'red',       // activates on other players' rolls
  PURPLE: 'purple', // major establishment — activates on your roll only, once per turn
};

const CARD_TYPE = {
  WHEAT: 'wheat',
  COW: 'cow',
  GEAR: 'gear',
  BREAD: 'bread',
  FACTORY: 'factory',
  FRUIT: 'fruit',
  CUP: 'cup',
  MAJOR: 'major',
  BOAT: 'boat',
  SUITCASE: 'suitcase',
};

// -------------------------------------------------------------------
// ESTABLISHMENT CARDS
// cost      — coins to buy
// activation — dice values that trigger this card
// color     — determines when it activates
// type      — icon/category (used by some card effects)
// effect    — description used for UI tooltip
// income()  — function(owner, allPlayers, activePlayer) => coin delta
//             positive = gain coins, negative = lose coins (for red cards)
// -------------------------------------------------------------------

const ESTABLISHMENTS = [
  // ── BLUE — activate on anyone's roll ──────────────────────────────

  {
    id: 'wheat_field',
    name: 'Wheat Field',
    cost: 1,
    activation: [1],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.WHEAT,
    effect: 'Get 1 coin from the bank.',
    income: () => 1,
  },
  {
    id: 'livestock_farm',
    name: 'Livestock Farm',
    cost: 1,
    activation: [2],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.COW,
    effect: 'Get 1 coin from the bank.',
    income: () => 1,
  },
  {
    id: 'flower_garden',
    name: 'Flower Garden',
    cost: 1,
    activation: [4],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.WHEAT,
    effect: 'Get 1 coin from the bank.',
    income: () => 1,
  },
  {
    id: 'mackerel_boat',
    name: 'Mackerel Boat',
    cost: 2,
    activation: [8],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.BOAT,
    effect: 'Get 3 coins from the bank.',
    income: () => 3,
  },
  {
    id: 'tuna_boat',
    name: 'Tuna Boat',
    cost: 5,
    activation: [12, 13, 14],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.BOAT,
    effect: 'Get 3 coins from the bank.',
    income: () => 3,
  },
  {
    id: 'forest',
    name: 'Forest',
    cost: 3,
    activation: [5],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.GEAR,
    effect: 'Get 1 coin from the bank.',
    income: () => 1,
  },
  {
    id: 'mine',
    name: 'Mine',
    cost: 6,
    activation: [9],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.GEAR,
    effect: 'Get 5 coins from the bank.',
    income: () => 5,
  },
  {
    id: 'apple_orchard',
    name: 'Apple Orchard',
    cost: 3,
    activation: [10],
    color: CARD_COLOR.BLUE,
    type: CARD_TYPE.WHEAT,
    effect: 'Get 3 coins from the bank.',
    income: () => 3,
  },

  // ── GREEN — activate only on your roll ────────────────────────────

  {
    id: 'bakery',
    name: 'Bakery',
    cost: 1,
    activation: [2, 3],
    color: CARD_COLOR.GREEN,
    type: CARD_TYPE.BREAD,
    effect: 'Get 1 coin from the bank.',
    income: () => 1,
  },
  {
    id: 'convenience_store',
    name: 'Convenience Store',
    cost: 2,
    activation: [4],
    color: CARD_COLOR.GREEN,
    type: CARD_TYPE.BREAD,
    effect: 'Get 3 coins from the bank.',
    income: () => 3,
  },
  {
    id: 'cheese_factory',
    name: 'Cheese Factory',
    cost: 5,
    activation: [7],
    color: CARD_COLOR.GREEN,
    type: CARD_TYPE.FACTORY,
    effect: 'Get 3 coins per cow establishment you own.',
    income: (owner) => 3 * owner.establishments.filter(e => e.type === CARD_TYPE.COW).length,
  },
  {
    id: 'furniture_factory',
    name: 'Furniture Factory',
    cost: 3,
    activation: [8],
    color: CARD_COLOR.GREEN,
    type: CARD_TYPE.FACTORY,
    effect: 'Get 3 coins per gear establishment you own.',
    income: (owner) => 3 * owner.establishments.filter(e => e.type === CARD_TYPE.GEAR).length,
  },
  {
    id: 'fruit_and_vegetable_market',
    name: 'Fruit & Vegetable Market',
    cost: 2,
    activation: [11, 12],
    color: CARD_COLOR.GREEN,
    type: CARD_TYPE.FRUIT,
    effect: 'Get 2 coins per wheat establishment you own.',
    income: (owner) => 2 * owner.establishments.filter(e => e.type === CARD_TYPE.WHEAT).length,
  },
  {
    id: 'flower_shop',
    name: 'Flower Shop',
    cost: 1,
    activation: [6],
    color: CARD_COLOR.GREEN,
    type: CARD_TYPE.BREAD,
    effect: 'Get 1 coin per flower garden you own.',
    income: (owner) => owner.establishments.filter(e => e.id === 'flower_garden').length,
  },

  // ── RED — activate on OTHER players' rolls ────────────────────────

  {
    id: 'cafe',
    name: 'Café',
    cost: 2,
    activation: [3],
    color: CARD_COLOR.RED,
    type: CARD_TYPE.CUP,
    effect: 'Take 1 coin from the active player.',
    income: () => 1,
  },
  {
    id: 'family_restaurant',
    name: 'Family Restaurant',
    cost: 3,
    activation: [9, 10],
    color: CARD_COLOR.RED,
    type: CARD_TYPE.CUP,
    effect: 'Take 2 coins from the active player.',
    income: () => 2,
  },
  {
    id: 'sushi_bar',
    name: 'Sushi Bar',
    cost: 4,
    activation: [1],
    color: CARD_COLOR.RED,
    type: CARD_TYPE.CUP,
    effect: 'Take 3 coins from the active player.',
    income: () => 3,
  },
  {
    id: 'pizza_joint',
    name: 'Pizza Joint',
    cost: 1,
    activation: [7],
    color: CARD_COLOR.RED,
    type: CARD_TYPE.CUP,
    effect: 'Take 1 coin from the active player.',
    income: () => 1,
  },
  {
    id: 'hamburger_stand',
    name: 'Hamburger Stand',
    cost: 1,
    activation: [8],
    color: CARD_COLOR.RED,
    type: CARD_TYPE.CUP,
    effect: 'Take 1 coin from the active player.',
    income: () => 1,
  },

  // ── PURPLE — major establishments, once per turn on your roll ─────

  {
    id: 'stadium',
    name: 'Stadium',
    cost: 6,
    activation: [6],
    color: CARD_COLOR.PURPLE,
    type: CARD_TYPE.MAJOR,
    effect: 'Take 2 coins from each other player.',
    income: (owner, allPlayers, activePlayer) => {
      // Returns total coins to collect; RoomManager handles per-player deductions
      return 2 * (allPlayers.length - 1);
    },
  },
  {
    id: 'tv_station',
    name: 'TV Station',
    cost: 7,
    activation: [6],
    color: CARD_COLOR.PURPLE,
    type: CARD_TYPE.MAJOR,
    effect: 'Take 5 coins from one player of your choice.',
    income: () => 5, // target player chosen at runtime — handled separately
    requiresTarget: true,
  },
  {
    id: 'business_complex',
    name: 'Business Complex',
    cost: 8,
    activation: [6],
    color: CARD_COLOR.PURPLE,
    type: CARD_TYPE.MAJOR,
    effect: 'Swap one establishment with another player.',
    income: () => 0, // card swap — handled separately
    requiresTarget: true,
  },
  {
    id: 'publisher',
    name: 'Publisher',
    cost: 5,
    activation: [7],
    color: CARD_COLOR.PURPLE,
    type: CARD_TYPE.MAJOR,
    effect: 'Take 1 coin from each player per cup or bread establishment they own.',
    income: (owner, allPlayers) => {
      return allPlayers
        .filter(p => p.id !== owner.id)
        .reduce((total, p) => {
          const count = p.establishments.filter(
            e => e.type === CARD_TYPE.CUP || e.type === CARD_TYPE.BREAD
          ).length;
          return total + count;
        }, 0);
    },
  },
  {
    id: 'tax_office',
    name: 'Tax Office',
    cost: 4,
    activation: [8, 9],
    color: CARD_COLOR.PURPLE,
    type: CARD_TYPE.MAJOR,
    effect: 'Take half (rounded down) from any player with 10+ coins.',
    income: (owner, allPlayers) => {
      return allPlayers
        .filter(p => p.id !== owner.id && p.coins >= 10)
        .reduce((total, p) => total + Math.floor(p.coins / 2), 0);
    },
  },
];

// -------------------------------------------------------------------
// LANDMARK CARDS
// All landmarks start unbuilt. Win condition = all landmarks built.
// -------------------------------------------------------------------

const LANDMARKS = [
  {
    id: 'city_hall',
    name: 'City Hall',
    cost: 0, // free, starts built in Machi Koro 2
    builtByDefault: true,
    effect: 'If you have 0 coins at the start of your turn, get 1 coin from the bank.',
  },
  {
    id: 'harbor',
    name: 'Harbor',
    cost: 2,
    builtByDefault: false,
    effect: 'When rolling 2 dice, you may add 2 to your roll result.',
  },
  {
    id: 'train_station',
    name: 'Train Station',
    cost: 4,
    builtByDefault: false,
    effect: 'You may roll 1 or 2 dice on your turn.',
  },
  {
    id: 'shopping_mall',
    name: 'Shopping Mall',
    cost: 10,
    builtByDefault: false,
    effect: 'Your cup and bread establishments earn +1 coin.',
  },
  {
    id: 'amusement_park',
    name: 'Amusement Park',
    cost: 16,
    builtByDefault: false,
    effect: 'If you roll doubles, take another turn after this one.',
  },
  {
    id: 'radio_tower',
    name: 'Radio Tower',
    cost: 22,
    builtByDefault: false,
    effect: 'Once per turn, you may reroll the dice.',
  },
  {
    id: 'airport',
    name: 'Airport',
    cost: 30,
    builtByDefault: false,
    effect: 'If you choose not to build on your turn, get 10 coins from the bank.',
  },
];

// How many copies of each establishment go into the deck (Machi Koro 2 uses 6 copies each)
const COPIES_PER_ESTABLISHMENT = 6;

module.exports = { ESTABLISHMENTS, LANDMARKS, CARD_COLOR, CARD_TYPE, COPIES_PER_ESTABLISHMENT };