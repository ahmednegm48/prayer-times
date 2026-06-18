let lon, lat;

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject("Geolocation is not supported by this browser.");
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
        resolve({ lon, lat });
      },
      () => reject("Sorry, no position available.")
    );
  });
}

(async () => {
  try {
    await getLocation();
  } catch (e) {
    console.log(e);
  }
  request.open("GET",` https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}`);
  request.send();
})();

let request = new XMLHttpRequest();

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
            document.getElementById(id).innerHTML = hours + ':' +mins
          };
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
        let arr = [timings.Fajr , timings.Sunrise , timings.Dhuhr , timings.Asr , timings.Maghrib , timings.Isha]
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
        let prayer,before,after,previous;
        const nextName = document.getElementById("next-name");
        const sunnah = document.querySelector(".sunnah");
        switch(arr.indexOf(next)){
          case 0 : 
          prayer = "الفجر";
          previous = "العشاء";
          before = "لا يوجد";
          after= "ركعتان";
          break;
          case 1 : 
          prayer = "الشروق";
          previous = "الفجر";
          before = "ركعتان";
          after= "لا يوجد";
          break;
          case 2 :
          prayer = "الظهر" ;
          previous = "الفجر";
          before = "ركعتان";
          after = "لا يوجد";
          break;
          case 3 : 
          prayer = "العصر";
          previous = "الظهر";
          before = "اربع ركعات";
          after = "ركعتان";
          break;
          case 4 : 
          prayer = "المغرب";
          previous = "العصر";
          before = "لا يوجد";
          after = "لا يوجد";
          break;
          case 5 :
          prayer = "العشاء" ;
          previous = "المغرب";
          before = "لا يوجد";
          after = "ركعتان";
          break;
        }
        
        nextName.innerHTML = "تبقى على " + prayer;
        if (before === after){
          sunnah.innerHTML = "لا توجد سنة مؤكدة لصلاة العصر"
        }else{
          sunnah.innerHTML = `سنن ${previous}<br>
          قبل الصلاة  :  ${before}  <br>
          بعد الصلاة  :  ${after} `
        }


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

