const recipeSelect = document.getElementById("recipe");
const countrySelect = document.getElementById("country");
const inputIngredient = document.getElementById("ingredient")
const ingredientResults = document.getElementById("ingredientResults");
const countryResults = document.getElementById("countryResults");
const recipeDetails = document.getElementById("recipeDetails");

function countrySelector() {
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      for (const el of data.meals) {
        const inputContry = document.createElement("option");
        inputContry.value = el.strArea;
        inputContry.innerText = el.strArea;
        countrySelect.appendChild(inputContry);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données :", error);
    });
}
countrySelector()

function recipeSelector() {
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
    .then((response) => response.json())
    .then((data2) => {
      console.log(data2);

      for (const el of data2.meals) {
        const inputRecip = document.createElement("option");
        inputRecip.value = el.strCategory;
        inputRecip.innerText = el.strCategory;
        recipeSelect.appendChild(inputRecip);
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données :", error);
    });
}
recipeSelector()
ingredient();

function countryChoise() {
  const countryResults = document.getElementById("countryResults");
  const countrySelect = document.getElementById("country");
  console.log(countrySelect);

  countrySelect.addEventListener("change", (e) => {
    e.preventDefault();
    countryResults.style.display="block"
    recipeDetails.style.display="none"

    let area = countrySelect.value
    console.log(area);

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
      .then((response) => response.json())
      .then((data4) => {
        console.log(data4);

        countryResults.innerHTML = '';

        let recipes = data4.meals

        if (recipes.length === 0) {
          countryResults.innerHTML = 'Aucune recette trouvée pour ce pays.';
          return;
        }

        recipes.forEach((el) => {
          const divContry = document.createElement("div");
          divContry.innerHTML = `${el.strMeal}<br> <img src="${el.strMealThumb}" alt="${el.strMeal}" />`;
          divContry.className = "recipe-card"
          divContry.style.cursor = "pointer"
          console.log(el.idMeal);
          countryResults.appendChild(divContry);
          divContry.addEventListener("click", () => renderMealDetails(el.idMeal))

        });

      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }
  )
}
countryChoise()

function renderMealDetails(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((response) => response.json())
    .then((meal) => {
      console.log(meal);
      recipeDetails.innerHTML = '';

      meal.meals.forEach((meal) => {
        const recipeEl = document.createElement("div");
        recipeEl.innerHTML = `${meal.strMeal} <br>`;
        recipeDetails.appendChild(recipeEl);
      });
      recipeDetails.style.display="block"
      countryResults.style.display="none"

    })

}
function recipeByCategory() {
  const recipeResults = document.getElementById("recipeResults");
  const recipeSelect = document.getElementById("recipe");
  console.log(recipeSelect);

  recipeSelect.addEventListener("change", (e) => {
    e.preventDefault();
    let recipe = recipeSelect.value
    console.log(recipe);

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${recipe}`)
      .then((response) => response.json())
      .then((data5) => {
        console.log(data5);

        if (!data5.meals || data5.meals.length === 0) {
          recipeResults.innerHTML = 'Aucune recette trouvée .';
          return;
        }

        recipeResults.innerHTML = '';

        let recipeIngredients = data5.meals.filter(element => {
          return element.strMeal.toLowerCase().includes(recipe.toLowerCase());
        });

        recipeIngredients.forEach((el) => {
          const divRecipe = document.createElement("div");
          divRecipe.innerHTML = `${el.strMeal} <br> <img src="${el.strMealThumb}" alt="${el.strMeal}" />`;
          recipeResults.appendChild(divRecipe);
        });

      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }
  )
}
recipeByCategory()

function ingredient() {
  const btn = document.getElementById('btn');
  const ingredientResults = document.getElementById('ingredientResults');

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    ingredientResults.innerHTML = '';

    const inputIng = document.getElementById('ingredient');
    let ingredient = inputIng.value.trim();


    if (ingredient === '') {
      ingredientResults.innerHTML = 'Veuillez entrer un ingrédient.';
      return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then((response) => response.json())
      .then((data3) => {
        console.log(data3);

        if (!data3.meals) {
          ingredientResults.innerHTML = 'Aucune recette trouvée pour cet ingrédient.';
          return;
        }

        let filteredIngredients = data3.meals.filter(element => {
          return element.strMeal.toLowerCase().includes(ingredient.toLowerCase());
        });

        filteredIngredients.forEach((el) => {
          const divIng = document.createElement("div");
          divIng.innerHTML = `${el.strMeal}<br><img src="${el.strMealThumb}" alt="${el.strMeal}" />`;
          ingredientResults.appendChild(divIng);
        });
        btn.style.display = "none"
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        ingredientResults.innerHTML = 'Erreur lors de la récupération des données.';
      });
  });
}

document.getElementById("resetCountry").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("country").selectedIndex = 0;
  document.getElementById("countryResults").innerHTML = "";
});

document.getElementById("resetRecipe").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("recipe").selectedIndex = 0;
  document.getElementById("recipeResults").innerHTML = "";
});


document.getElementById("resetIngredient").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("ingredient").value = "";
  document.getElementById("ingredientResults").innerHTML = "";
  btn.style.display = "block"
});
