import React, { useState } from 'react';

const API_KEY = "cfec3c0543c6978fdcce3f4bcf351a7f";
const APP_ID = "29a45d4d";

function App() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState(null);

  const fetchNutrition = async () => {
    setQuery('');
    try {
      const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
        method: "POST",
        headers: {
          "x-app-id": APP_ID,
          "x-app-key": API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setFoods(data.foods);
      console.log(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch nutrition data.");
      setFoods([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      fetchNutrition();
    }
  };

  return (
    <div className='container' style={{ padding: '20px' }}>
     
      <h1>Nutrition Value</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g 2 eggs 1 apple"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        />
        <button type="submit" className='ctabutton'>Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {foods.length > 0 && (() => {
        // Helper to hide 0 or 0g values
        const show = (val) => val !== 0 && val !== "0" && val !== "0g" && val !== 0.0 && val !== null && val !== undefined;

        // Sum nutrients across all foods
        const sum = (key) => foods.reduce((acc, food) => acc + (Number(food[key]) || 0), 0);

        // Prepare summed values
        const total = {
          calories: sum('nf_calories'),
          protein: sum('nf_protein'),
          fat: sum('nf_total_fat'),
          carbs: sum('nf_total_carbohydrate'),
          fiber: sum('nf_dietary_fiber'),
          sodium: sum('nf_sodium'),
          potassium: sum('nf_potassium'),
          cholesterol: sum('nf_cholesterol'),
        };

        // Grouped nutrients for total
        const macros = [
          show(total.calories) && <li key="calories"><strong style={{fontSize: '1.25rem'}}>Calories: {total.calories.toFixed(2)}</strong></li>,
          show(total.protein) && <li key="protein">Protein: {total.protein.toFixed(2)}g</li>,
          show(total.fat) && <li key="fat">Fat: {total.fat.toFixed(2)}g</li>,
          show(total.carbs) && <li key="carbs">Carbs: {total.carbs.toFixed(2)}g</li>,
          show(total.fiber) && <li key="fiber">Fiber: {total.fiber.toFixed(2)}g</li>,
        ].filter(Boolean);

        const minerals = [
          show(total.sodium) && <li key="sodium">Sodium: {total.sodium.toFixed(2)}mg</li>,
          show(total.potassium) && <li key="potassium">Potassium: {total.potassium.toFixed(2)}mg</li>,
        ].filter(Boolean);

        const cholesterol = show(total.cholesterol) && <li key="cholesterol">Cholesterol: {total.cholesterol.toFixed(2)}mg</li>;

        // Render total nutrition
        const totalNutrition = (
          <div className='nutrition'>
            {/* Show all food images if more than one food, else just one */}
            <div>
              {foods.length === 1 ? (
                <img
                  src={foods[0].photo?.thumb}
                  alt={foods[0].food_name}
                  style={{ width: 80, height: 80, borderRadius: 8, border: '1px solid #ccc', marginBottom: 8 }}
                />
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  {foods.map((f, i) => (
                    <img
                      key={i}
                      src={f.photo?.thumb}
                      alt={f.food_name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #ccc' }}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <p>
                <strong>Total Nutrition</strong>
              </p>
              <ul>
                {macros.length > 0 && <li style={{ fontWeight: 'bold', borderBottom: '1px solid #222' }}>Macronutrients</li>}
                {macros}
                {minerals.length > 0 && <li style={{ fontWeight: 'bold', borderBottom: '1px solid #222', marginTop: '8px' }}>Minerals</li>}
                {minerals}
                {cholesterol && (
                  <>
                    <li style={{ fontWeight: 'bold', borderBottom: '1px solid #222', marginTop: '8px' }}>Cholesterol</li>
                    {cholesterol}
                  </>
                )}
              </ul>
            </div>
          </div>
        );

        // Render each food's nutrition if 2 or more foods
        const perFoodNutrition = foods.length > 1 && foods.map((food, idx) => {
          const macros = [
            show(food.nf_calories) && <li key="calories"><strong style={{fontSize: '1.25rem'}}>Calories: {Number(food.nf_calories).toFixed(2)}</strong></li>,
            show(food.nf_protein) && <li key="protein">Protein: {Number(food.nf_protein).toFixed(2)}g</li>,
            show(food.nf_total_fat) && <li key="fat">Fat: {Number(food.nf_total_fat).toFixed(2)}g</li>,
            show(food.nf_total_carbohydrate) && <li key="carbs">Carbs: {Number(food.nf_total_carbohydrate).toFixed(2)}g</li>,
            show(food.nf_dietary_fiber) && <li key="fiber">Fiber: {Number(food.nf_dietary_fiber).toFixed(2)}g</li>,
          ].filter(Boolean);

          const minerals = [
            show(food.nf_sodium) && <li key="sodium">Sodium: {Number(food.nf_sodium).toFixed(2)}mg</li>,
            show(food.nf_potassium) && <li key="potassium">Potassium: {Number(food.nf_potassium).toFixed(2)}mg</li>,
          ].filter(Boolean);

          const cholesterol = show(food.nf_cholesterol) && <li key="cholesterol">Cholesterol: {Number(food.nf_cholesterol).toFixed(2)}mg</li>;

          return (
            <div className='nutrition' key={idx} style={{ display: 'flex', gap: '18px' }}>
              <img
                src={food.photo?.thumb}
                alt={food.food_name}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc', marginBottom: 8 }}
              />
              <div style={{ flex: 1 }}>
                <p>
                  <strong>{food.food_name}</strong>

                </p>
                <ul>
                  {macros.length > 0 && <li style={{ fontWeight: 'bold', borderBottom: '1px solid #222' }}>Macronutrients</li>}
                  {macros}
                  {minerals.length > 0 && <li style={{ fontWeight: 'bold', borderBottom: '1px solid #222', marginTop: '8px' }}>Minerals</li>}
                  {minerals}
                  {cholesterol && (
                    <>
                      <li style={{ fontWeight: 'bold', borderBottom: '1px solid #222', marginTop: '8px' }}>Cholesterol</li>
                      {cholesterol}
                    </>
                  )}
                </ul>
              </div>
            </div>
          );
        });

        return (
          <>
            {foods.length > 1 ? (
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
                {totalNutrition}
                {perFoodNutrition}
              </div>
            ) : (
              totalNutrition
            )}
          </>
        );
      })()}
    </div>
  )
}

export default App
