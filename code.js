let request = new XMLHttpRequest();
request.open("GET",` http://api.aladhan.com/v1/timingsByCity?city=Alexandria&country=EG`);
request.send();

request.onreadystatechange = function(){
    if(this.readyState === 4 && this.status === 200){
        let jsdata = JSON.parse(this.responseText);
        function filler(id,time){
            let hours = parseInt(time);
            //12H formatter
            if (hours>12){
              hours-=12
            }
            mins = time[3] + time[4]
            document.getElementById(id).innerHTML = hours + ':' +mins};
        let timings = jsdata.data.timings;
        filler("fagr",timings.Fajr);
        filler("duhr",timings.Dhuhr);
        filler("asr",timings.Asr);
        filler("maghrib",timings.Maghrib);
        filler("isha",timings.Isha);
        document.getElementById("day").innerHTML = jsdata.data.date.hijri.weekday.ar;
        document.getElementById("today-date").innerHTML = jsdata.data.date.gregorian.date;

        //date and time
      function startTime() {
          const today = new Date();
          let h = today.getHours();
          let m = today.getMinutes();
          let s = today.getSeconds();
          //12H formatter
          if (h>12){
            h-=12
          }
          m = checkTime(m);
          s = checkTime(s);
          document.getElementById("date").innerHTML =  h + ":" + m + ":" + s;
          timeUntil()
          timeout =setTimeout(startTime, 1000);
        }
        startTime()

      function timeUntil(){
        let arr = [timings.Fajr , timings.Dhuhr , timings.Asr , timings.Maghrib , timings.Isha]
        for(let ar in arr){
        let hours = parseInt(arr[ar]);
        let mins = arr[ar][3] + arr[ar][4];
        const now = new Date();
        let then = new Date();
        then.setHours(hours,mins,0);
        let left = then - now;
        if (left < 0 ){
          arr[ar] = left + 24 * 3600 * 1000
        }
        else{arr[ar] = left}
        }  

        let next = Math.min(...arr);
        let hleft = Math.floor(next / 3600000);
        let mleft = Math.floor((next % (1000*3600)) / (1000*60))+1;
        if (mleft < 10){mleft = "0"+mleft}
      
        document.getElementById("next").innerHTML = hleft +':'+mleft
      }

          
      //add zero before mins and secs if smaller than 10 [just for the design]
      function checkTime(i) {
        if (i < 10) {i = "0" + i};
        return i;
      }
  }
};

let cities = ["الاسكندرية","القاهرة","دمنهور"];
for(let city of cities){
      let content = `<option>${city}</option>`
      document.getElementById("city-select").innerHTML += content
}

document.querySelector(".city-choose select").addEventListener("change",function(){
  switch(this.value){
    case "الاسكندرية" : 
      clearInterval(timeout);
      request.open("GET"," http://api.aladhan.com/v1/timingsByCity?city=Alexandria&country=EG");
      document.getElementById("city-title").innerHTML = "الاسكندرية";
      break;
    case "القاهرة" :
      clearInterval(timeout);
      request.open("GET"," http://api.aladhan.com/v1/timingsByCity?city=Cairo&country=EG");
      document.getElementById("city-title").innerHTML = "القاهرة";
      break;
    case "دمنهور" :
      clearInterval(timeout);
      request.open("GET"," http://api.aladhan.com/v1/timingsByCity?city=Damanhour&country=EG");
      document.getElementById("city-title").innerHTML = "دمنهور";
      break;
  }
  request.send();
}); 