
const dropDown = document.querySelector("#countries"); 
let covidObject ;


// Dom strings
const domStr = {
    confirm_count_heading:'#confirmed-count',
    death_count_heading:"#deaths-count",
    recovered_count_heading:"#recovered-count",
    country_flag_img:"#country-flag",
    country_name_display:"#country-name-display",
    new_confirmed_cases:"#new-confirmed-count",
    new_death:"#new-deaths-count",
    new_recovered:"#new-recovered-count",
    error_heading:"#error-heading",
    loader:"#loader",
    outer_section:"#outer-section",
}

const init = ()=>{
    let count =0;
    fetch('https://api.covid19api.com/summary')
    .then(jsonData=>{
        return jsonData.json(); // Convert JSON data to an Object
    })
    .then(data=>{ 

        // Add countries in the dropdown 'Select' Options
        data.Countries.forEach(curr => {
            const htmlStr = `<option>${curr.Country}</option>`;
            dropDown.insertAdjacentHTML("beforeend",htmlStr);
            covidObject = data;
        });

        // Set timeout for loader 
        setTimeout(()=>{
            document.querySelector(domStr.loader).classList.add("d-none");
            document.querySelector(domStr.outer_section).classList.remove("d-none");
            displayData(retriveData("GLB"));
        },2000);   
    })
    .catch(err=>{
        // If there is an error the website does not load, error will be showing on loader window.
        document.querySelector(domStr.error_heading).textContent = "Sorry, data failed to fetch. Please comeback later! ";

    });


    
};


init();


document.addEventListener("input", function(event){
    let totalStats;
    if(event.target.value!=="Global")
    {
     totalStats = retriveData(true,event.target.value);
    }
    else
    {
        totalStats = retriveData(event.target.value);
    }
    console.log(totalStats);
    displayData(totalStats);
    console.log(event.target.value);

})


const retriveData = (searchData = false, val) => { // SearchData variable is use for if there is country to search it is true else false and global array return.

    if (searchData === true) {
        for (let i = 0; i < covidObject.Countries.length; i++) {
            if (val === covidObject.Countries[i].Country) {
                return [covidObject.Countries[i].Country, covidObject.Countries[i].CountryCode, covidObject.Countries[i].TotalConfirmed, covidObject.Countries[i].TotalDeaths, covidObject.Countries[i].TotalRecovered, covidObject.Countries[i].NewConfirmed, covidObject.Countries[i].NewDeaths, covidObject.Countries[i].NewRecovered];
            }
        }
    }
    else {
        // Return Global stats
        return ['Global', 'GLB',covidObject.Global.TotalConfirmed, covidObject.Global.TotalDeaths, covidObject.Global.TotalRecovered,covidObject.Global.NewConfirmed, covidObject.Global.NewDeaths, covidObject.Global.NewRecovered];
    }
}

const displayData = (arr)=>
{

   const [country, countryCode, totalConfirm, totalDeaths, totalRecovered, newConfirm, newDeaths, newRecovered] = arr;
   document.querySelector(domStr.country_name_display).textContent=country; 
   document.querySelector(domStr.new_confirmed_cases).textContent = newConfirm.toLocaleString();
   document.querySelector(domStr.new_death).textContent = newDeaths.toLocaleString();
   document.querySelector(domStr.new_recovered).textContent =newRecovered.toLocaleString();  
   document.querySelector(domStr.confirm_count_heading).textContent=totalConfirm.toLocaleString();
   document.querySelector(domStr.death_count_heading).textContent=totalDeaths.toLocaleString();
   document.querySelector(domStr.recovered_count_heading).textContent=totalRecovered.toLocaleString();
   if(countryCode==='GLB')
   {
    document.querySelector(domStr.country_flag_img).src="images/world.png";
   }
   else {
    document.querySelector(domStr.country_flag_img).src = `https://www.countryflags.io/${countryCode}/flat/64.png`
   }

}