import { Component, Input } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent {
  @Input() recipe!: Recipe;
  @Input() index!: number;
  // we don't need the onSelected or the recipe service and remove from imports
  // constructor(private recipeService: RecipeService){}

  // onSelected() {
  //   this.recipeService.recipeSelected.emit(this.recipe);
  // }
}
