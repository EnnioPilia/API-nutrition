const recipeSelect = document.getElementById("recipe");
const countrySelect = document.getElementById("country");
const inputIngredient = document.getElementById("ingredient")
const recipeDetails = document.getElementById("recipeDetails");
const recipeList = document.getElementById("recipe-list")


// fetch des options sélecteurs
recipeDetails.style.display= "none"
recipeList.style.display= "none"



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

//  fetch des recettes

function loadByCountry() {
  const countrySelect = document.getElementById("country");
  console.log(countrySelect);

  countrySelect.addEventListener("change", (e) => {
    e.preventDefault();
    recipeDetails.innerHTML = '';
    recipeList.style.display = "block";
    recipeDetails.style.display = "none";
    
    let area = countrySelect.value
    console.log(area);

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
      .then((response) => response.json())
      .then((data4) => {
        console.log(data4);

        recipeList.innerHTML = '';


        let recipes = data4.meals

        if (recipes.length === 0) {
          recipeList.innerHTML = 'Aucune recette trouvée pour ce pays.';
          return;
        }

        recipes.forEach((el) => {
          const divContry = document.createElement("div");
          divContry.innerHTML = `${el.strMeal}<br> <img src="${el.strMealThumb}" alt="${el.strMeal}" />`;
          divContry.style.cursor = "pointer"
          console.log(el.idMeal);
          recipeList.appendChild(divContry);
          divContry.addEventListener("click", () => {
            renderMealDetails(el.idMeal);
            document.getElementById("recipe-list").style.display = "none";
          });

        });

      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }
  )
}
loadByCountry()

function recipeByCategory() {
  const recipeSelect = document.getElementById("recipe");
  console.log(recipeSelect);

  recipeSelect.addEventListener("change", (e) => {
    e.preventDefault();
    recipeList.style.display = "block";
    recipeDetails.style.display = "none";


    recipeDetails.innerHTML = '';

    let recipe = recipeSelect.value
    console.log(recipe);

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${recipe}`)
      .then((response) => response.json())
      .then((data5) => {
        console.log(data5);

        if (!data5.meals || data5.meals.length === 0) {
          recipeList.innerHTML = 'Aucune recette trouvée .';
          return;
        }

        recipeList.innerHTML = '';

        let recipeIngredients = data5.meals

        recipeIngredients.forEach((el) => {
          const divRecipe = document.createElement("div");
          divRecipe.innerHTML = `${el.strMeal} <br> <img src="${el.strMealThumb}" alt="${el.strMeal}" />`;
          divRecipe.style.cursor = "pointer"
          recipeList.appendChild(divRecipe);
          divRecipe.addEventListener("click", () => {
            renderMealDetails(el.idMeal);
            recipeList.style.display = "none";
            recipeDetails.style.display = "block";

          });
        });

      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }
  )
}
recipeByCategory()

function renderMealDetails(id) {
  console.log("id du plat: ", id);

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((response) => response.json())
    .then((meal) => {
      const mealData = meal.meals[0]; // On récupère le plat
      console.log(mealData);

      // Nettoyage de l'affichage
      recipeDetails.innerHTML = '';

      // Récupère les ingrédients
      const ingredientsArray = arrayIngredient(mealData);

      // Création de l'élément d'affichage
      const recipeEl = document.createElement("div");

      // Création de la liste des ingrédients
      let ingredientsHTML = "<ul>";
      ingredientsArray.forEach(item => {
        ingredientsHTML += `<li>${item.quantity} ${item.ingredient}</li>`;
      });
      ingredientsHTML += "</ul>";

      // Remplissage du contenu HTML
      recipeEl.innerHTML = `
        <h2>${mealData.strMeal}</h2>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
        <p><strong>Catégorie:</strong> ${mealData.strCategory}</p>
        <p><strong>Origine:</strong> ${mealData.strArea}</p>
        <h3>Ingrédients :</h3>
        ${ingredientsHTML}
        <h3>Instructions :</h3>
        <p>${mealData.strInstructions}</p>
        <a href="${mealData.strYoutube}" target="_blank">Voir la vidéo</a>
      `;

      recipeDetails.appendChild(recipeEl);
      recipeDetails.style.display = "block";
    });
}


function arrayIngredient(mealData) {
  const ingredientsList = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = mealData[`strIngredient${i}`];
    const measure = mealData[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredientsList.push({
        ingredient: ingredient,
        quantity: measure ? measure.trim() : ""
      });
    }
  }

  return ingredientsList;
}




function ingredient() {
  const btn = document.getElementById('btn');
  const ingredientResults = document.getElementById('ingredientResults');

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    recipeList.style.display = "block";
    recipeDetails.style.display = "none";
    recipeList.innerHTML = '';

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
          recipeList.innerHTML = 'Aucune recette trouvée pour cet ingrédient.';
          return;
        }

        let filteredIngredients = data3.meals.filter(element => {
          return element.strMeal.toLowerCase().includes(ingredient.toLowerCase());
        });

        filteredIngredients.forEach((el) => {
          const divIng = document.createElement("div");
          divIng.innerHTML = `${el.strMeal}<br><img src="${el.strMealThumb}" alt="${el.strMeal}" />`;
          divIng.style.cursor = "pointer"
          recipeList.appendChild(divIng);
          divIng.addEventListener("click", () => {
            renderMealDetails(el.idMeal);
            recipeList.style.display = "none";
            recipeDetails.style.display = "block";

          });

        });

      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        recipeList.innerHTML = 'Erreur lors de la récupération des données.';
      });
  });
}


// document.getElementById("resetRecipe").addEventListener("click", (e) => {
//   e.preventDefault();
//   document.getElementById("recipe").selectedIndex = 0;
//   document.getElementById("recipeResults").innerHTML = "";
// });


// document.getElementById("resetIngredient").addEventListener("click", (e) => {
//   e.preventDefault();
//   document.getElementById("ingredient").value = "";
//   document.getElementById("ingredientResults").innerHTML = "";
//   btn.style.display = "block"
// });
