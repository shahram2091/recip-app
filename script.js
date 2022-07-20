const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById("fav-meals");
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const popupCloseBtn = document.getElementById('close-popup');
const searchTerm = document.getElementById('search-Terem'); 
const searchBtn = document.getElementById('search');

getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();
    const randomMeal = respData.meals[0];


    addMeal(randomMeal,true);
   // loadRandomMeal();
}
async function getMealById(id){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?s="+id);
    const respData = await resp.json();

    const meal = respData.meals[0];
    return meal;
}
async function getMealBySearch(term){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s"+term);
    const respData = await resp.json();
    const meals =  respData.meals;

    return meals;
}
function addMeal(mealData, random = false){

    console.log(mealData);
    const meal = document.createElement("div")
    meal.classList.add("meal");

    meal.innerHtml = ` <div class="meal-header">
    ${random ?`
    
        <span class="random">Random Recipe</span>`:""}
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
    </div>
    <div class="meal-body">
        <h4>${mealData.strMeal}</h4>
        <button class="fav-btn ">
            <i class="fa fa-heart"></i>
        </button>
    </div>
    `;
    const btn = meal.querySelector(".meal-body .fav-btn");
    btn.addEventListener("click",() =>{
        if(btn.classList.contact("active")){
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        }else{
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }
      
        fetchFavMeals();
    });
    meal.addEventListener("click",() =>{
        showMealInfo(mealData);
    });
    mealsEl.appendChild(meal);
}
function addMealToLS(mealId){
    const mealIdS = getMealsLS();
    localStorage.setItem('mealIds',JSON.stringify([...mealIdS,mealId]));
}
function removeMealLS(mealId){
    const mealIdS = getMealsLS();

    localStorage.setItem('mealIds',JSON.stringify(mealIdS.filter((id) =>id !== mealId)));
}
function getMealsFromLS(){
    const mealIdS = JSON.parse(localStorage.getItem('mealIds'));

  
    return mealIdS === null ? []: mealIdS;
}
async function fetchFavMeals(){
     //clean the contianer
     favoriteContainer.innerHTML = "";

    const mealIds = getMealsLS();
    for(let i = 0; i < mealIds.length; i++){
        const mealId = mealIds[i];

        meal = await getMealsById(mealId);
        addMealFav(meal);
    }
    
}
function addMealFav(MealData){
    
    const favMeal = document.createElement("li");
  

    favMeal.innerHtml = `
    <img src="${meals.strMealThumb}" 
    alt="${MealData.strMeal}"/>
    <span>${MealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></></button>`;
   
    const btn = favMeal.querySelector('.clear');

    btn.addEventListener("click", () =>{
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });
    FavMeal.addEventListener("click",() =>{
        showMealInfo(mealData);
    });
    favoriteContainer.appendChild(favMeal);
}
function showMealInfo(mealData){
    //clean it up
    mealInfoEl.innerHTML = "";
    // update the Meal info
   const mealEl = document.createElement('div');
    //get ingredient and measurse
    for(let i=1;i<=20;i++){
    if(mealData['strIngredient'+i]){
        ingredients.push(`${mealData['strIngredient'+i]} /${mealData[`strMeasure`+i]}`)
    }
    else{
        break;
    }
    }

    mealEl.innerHTML = `<h1>${mealData.strMeal}</h1>
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
   
   <p>
   ${mealData.strMealThumb}
   </p>
   <h3>Ingredients:</h3>
   <ul>
   ${ingredients.map((ing)=>`<li>${ing}</li>`).join("")}
   /ul>
   `;
   mealInfoEl.appendChild(mealEl);

   mealPopup.classList.remove("hidden");
}
searchBtn.addEventListener("click", async () =>{
    //clean container
    mealsEl.innerHTML = "";
    const search = searchTerm.value;


    const meals = await getMealsBySearch(search);
    if(meals){
        meals.forEach((meal) =>{
            addMeal(meal);
        });
    }
    
});
popupCloseBtn.addEventListener.add("click",() =>{
    mealPopup.classList.add("hidden");
});