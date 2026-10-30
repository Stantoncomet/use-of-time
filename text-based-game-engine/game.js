// Should NOT be changed during runtime (hence the all caps)
const ITEMS = {
    s: {
        name: "s"
    },
    apple: {
        name: "Apple",
        type: 'consumable'
    },
    sword_ii: {
        name: "Sword II (+4)",
        type: 'weapon',
        stats: {
            attack: 4
        }
    }
}

// Player variables
const backpack = [

]

//Shop
const shop_items = [
    {
        item: ITEMS.s,
        cost: 1
    },
    { item: ITEMS.apple,
      cost: 1, 
      quant: 8 },
    { item: ITEMS.sword_ii, 
      cost: 16,
      quant: 1 },
    { item: ITEMS.sword_ii, 
      cost: 17,
      quant: 1 }
]

//Misc
const CURRENCY_PREFIX = "g";