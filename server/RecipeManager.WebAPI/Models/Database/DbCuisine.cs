using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecipeManager.WebAPI.Models.Database;

public record DbCuisine(string Label)
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public string Label { get; set; } = Label;
    
    public virtual List<DbRecipe> Recipes { get; set; } = new();
}