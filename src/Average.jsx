import axios from 'axios'
import React from 'react'

export const Average = () => {

  async function calculate(){
  const categories = await fetchCategories();
    for(let i = 0; i < categories.length; i++){
      const allTeachers = await fetchAllTeachersForCategory(categories[i].code)
      const averagePrice = getAveragePrice(allTeachers)
      console.log(allTeachers)
      await postAverageForCategory(categories[i].name, averagePrice)
    }
}

    async function fetchCategories() {
        const url = 'http://test.teaching-me.org/categories/v1/categories'
        const response = await axios.get(url, {
          headers: {
            'Accept-Language': 'en'
          }
        })
        return response.data 
    }

    async function fetchTeachersForCategory(category, page) {
      const url = 'http://test.teaching-me.org/categories/v1/search'
      const response = await axios.post(url, {
            'categories': [category],
            'page': page,
            'pageSize': 10,
        },
        {
        headers: {
          'Accept-Language': 'en',
          'Content-Type': 'application/json'
        }
       
      })
      return response.data
  }

  async function fetchAllTeachersForCategory(category) {
    const allTeachers = [];
    const {teachers, totalResults} = await fetchTeachersForCategory(category, 0);
    allTeachers.push(...teachers);

  for(let i = 1; i < totalResults / 10 + 1; i++){
    const {teachers} = await fetchTeachersForCategory(category, i);
    allTeachers.push(...teachers);
  } 
  return allTeachers
  }

  function getAveragePrice(allTeachers) {
    let sum = 0
    allTeachers.forEach((teacher) => {
      sum += teacher.pricePerHour
    })
    return sum/allTeachers.length
  }

  async function postAverageForCategory(category, averagePrice) {
    const url = 'http://test.teaching-me.org/categories/v1/average-price'
    const response = await axios.post(url, {
      'categoryName': category,
      'averagePrice': averagePrice,
  },
  {
  headers: {
    'Authorization': 'Bearer Bearer private-2irkm1qudpnqbpscxh9j9gyd',
    'Content-Type': 'application/json'
  }
  
})
console.log(response)
}

  return (
    <div>
        <button onClick={calculate}>Calculate average price</button>
    </div>
  )
}
