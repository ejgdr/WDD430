import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSelected = new Subject<Recipe>();
  recipeChanged = new Subject<Recipe[]>();

  constructor(private slService: ShoppingListService) { }

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Pork Ribs',
  //     'This is an awesome recipe',
  //     'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
  //     [
  //       new Ingredient('Pork Ribs', 2),
  //       new Ingredient('BBQ Sauce', 1)
  //     ]),
  //   new Recipe(
  //     'Gluten Free Bread',
  //     'This is simply the best bread ever',
  //     'https://cdn.pixabay.com/photo/2016/06/16/01/41/bread-1460403_640.jpg',
  //     [
  //       new Ingredient('Whole grain flower', 1),
  //       new Ingredient('Gluten free yeast', 1)
  //     ])
  // ];

  private recipes: Recipe[] = [];

  // made to override the list we have here and work from the database
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
