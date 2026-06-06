import type { Dish } from '../types'

/**
 * Sorts and prioritizes dishes based on selected group cravings.
 * Matches dish attributes (veg status, spice level, keywords in name/description)
 * and returns the prioritized list, with matching dishes sorted to the top.
 */
export const filterAndSortDishes = (dishes: Dish[], cravings: string[]): Dish[] => {
  if (!cravings || cravings.length === 0) return dishes

  const lowerCravings = cravings.map((c) => c.toLowerCase())

  const scoredDishes = dishes.map((dish) => {
    let score = 0

    // 1. Veg / Non Veg matching
    const hasVegCraving = lowerCravings.includes('veg')
    const hasNonVegCraving = lowerCravings.includes('non veg') || lowerCravings.includes('non-veg')

    if (hasVegCraving && dish.isVeg) {
      score += 15
    }
    if (hasNonVegCraving && !dish.isVeg) {
      score += 15
    }

    // 2. Spice Level matching
    const hasSpicyCraving = lowerCravings.includes('spicy')
    if (hasSpicyCraving && (dish.spiceLevel === 'Hot' || dish.spiceLevel === 'Insane')) {
      score += 10
    }

    // 3. Keyword matching (e.g., Pizza, Biryani, Burgers, Chinese, Desserts)
    const dishNameLower = dish.name.toLowerCase()
    
    lowerCravings.forEach((craving) => {
      // Avoid matching generic tags like 'veg' / 'spicy' as substring keywords
      if (craving === 'veg' || craving === 'non veg' || craving === 'non-veg' || craving === 'spicy') {
        return
      }

      // Check if keyword is in name or description
      if (dishNameLower.includes(craving)) {
        score += 20
      }
      
      // Map common synonyms or categories
      if (craving === 'cafes' && (dishNameLower.includes('coffee') || dishNameLower.includes('waffle') || dishNameLower.includes('muffin'))) {
        score += 15
      }
      if (craving === 'desserts' && (dishNameLower.includes('waffle') || dishNameLower.includes('brownie') || dishNameLower.includes('pastry') || dishNameLower.includes('sweet'))) {
        score += 15
      }
    })

    return { dish, score }
  })

  // Sort descending by score, maintaining relative order for equal scores
  return scoredDishes
    .sort((a, b) => b.score - a.score)
    .map((item) => item.dish)
}
