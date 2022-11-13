


/*
Latitude: 38.612404980652656
Longitude: -121.53433110876948
*/

//https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=37.42159&longitude=-122.0837&localityLanguage=en

//position.coords.longitude

var reverseGeocoder=new BDCReverseGeocode();
    
/* Get the administrative location information using a set of known coordinates */




function runApp() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeatherDataFromLandL /*To be called when done*/);
  } else { 
    const latitude = alert("Turn on your geolocation")
  }
}


const getWeatherDataFromLandL = (position) =>{   

    let URI = 'https://api.weather.gov/points/39.7456,-97.0892'
    let uri = `https://api.weather.gov/points/${position.coords.latitude},${position.coords.longitude}`

    const getWeatherInfo=(x,y, office)=>{
        axios.get(`https://api.weather.gov/gridpoints/${office}/${x},${y}/forecast`)
            .then((res)=>{
                
                const current = res.data.properties.periods[0]
                
                const periodsArray = res.data.properties.periods
                    .filter((item)=>item.isDaytime)
                    .map((i)=>{
                        return({
                            day: i.name,
                            icon: i.icon,
                            temperature: i.temperature,
                        })
                    })
                    

                const days = document.querySelectorAll(".days")
                const temps = document.querySelectorAll(".temps")
                document.querySelector('#current').innerHTML = current.temperature + "°"

                for(let i=0;  i<days.length; i++){
                    
                    days[i].innerText = periodsArray[i].day
                    temps[i].innerHTML = periodsArray[i].temperature + `° <img 
                    height="24px"
                    width="24px"
                    src=${periodsArray[i].icon} />`
                    
                }
            })
            .catch((err)=>{
                console.log("CANNOT GET WEATHER INFO:");
                console.log(err);
            })
    }

    axios.get(uri)
        .then((res)=>{
            
            let x = res.data.properties.gridX
            let y = res.data.properties.gridY
            let office = res.data.properties.forecastOffice

            for(let i=office.length; i>0; i--){
                if(office[i] != "/"){
                    continue
                }
                office = office.slice(i+1)
                break
            }

            getWeatherInfo(x, y, office)

            reverseGeocoder.getClientLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },function(result) {
                document.querySelector('#location').innerText = result.city
            });

        })
        .catch((err)=>{
            console.log("CANNOT GET X, Y and OFFICE data:");
            console.log(err);
        })
    
}



runApp()