// Polish Biohacker Calculator — estimates, not medical advice.
(()=>{
"use strict";
const form=document.getElementById("calcForm"); if(!form) return;
const $=id=>document.getElementById(id), nf=new Intl.NumberFormat("pl-PL",{maximumFractionDigits:0}), n1=new Intl.NumberFormat("pl-PL",{maximumFractionDigits:1});
const foodDefaults={beefLean:{name:"Wołowina chuda (surowa)",p:20,kcal:165},beefFat:{name:"Wołowina tłustsza (surowa)",p:18,kcal:250},beefCooked:{name:"Wołowina po obróbce",p:26,kcal:250},chicken:{name:"Pierś kurczaka (surowa)",p:23,kcal:120},pork:{name:"Wieprzowina (orientacyjnie)",p:21,kcal:190}};
const KEY="polish-biohacker-calculator-history-v1";
function num(id){const v=$(id).value.trim();return v===""?NaN:Number(v)}
function validate(v,min,max){return Number.isFinite(v)&&v>=min&&v<=max}
function labelError(msg){$("calcError").textContent=msg;$("calcError").hidden=false;$("calcResults").hidden=true}
function renderHistory(){
 const holder=$("history"); let history=[];
 try{history=JSON.parse(localStorage.getItem(KEY)||"[]");if(!Array.isArray(history))history=[]}catch{}
 holder.replaceChildren();
 if(!history.length){holder.textContent="Brak zapisanych obliczeń na tym urządzeniu.";return}
 for(const record of history.slice(0,10)){
  const p=document.createElement("p");p.className="mini";
  p.textContent=record.date+" · "+record.weight+" kg · "+record.calories+" kcal · "+record.protein+" g białka · spożycie "+record.foodProtein+" g";
  holder.appendChild(p);
 }
}
let lastRecord=null;
form.addEventListener("submit",e=>{
 e.preventDefault();
 const weight=num("weight"),height=num("height"),age=num("age"),eggs=num("eggs"),meatGrams=num("meat"),dairyGrams=num("dairy"),wheyGrams=num("whey"),proteinPerKg=num("proteinFactor");
 if(!validate(weight,30,300)||!validate(height,120,230)||!validate(age,16,100))return labelError("Sprawdź masę ciała (30–300 kg), wzrost (120–230 cm) i wiek (16–100 lat).");
 if(![eggs,meatGrams,dairyGrams,wheyGrams].every((v,i)=>validate(v,0,[50,3000,3000,500][i])))return labelError("Wpisz nieujemne, realistyczne ilości jedzenia. Wszystkie pola dziennika są wymagane — wpisz 0, jeśli nie jesz danego produktu.");
 if(!Number.isInteger(eggs))return labelError("Liczba jajek musi być liczbą całkowitą.");
 if(!validate(proteinPerKg,1,3))return labelError("Cel białka musi mieścić się między 1 a 3 g/kg.");
 const sex=$("sex").value,activity=Number($("activity").value),goal=$("goal").value;
 const bmr=10*weight+6.25*height-5*age+(sex==="male"?5:-161);
 const tdee=bmr*activity;
 const factor=goal==="cut"?.85:goal==="bulk"?1.08:1;
 const energy=Math.round(tdee*factor),proteinTarget=Math.round(weight*proteinPerKg);
 const food=foodDefaults[$("meatType").value]||foodDefaults.beefLean;
 // approximate reference values per 100 g or per egg; user should adjust to packaging
 const foodProtein=eggs*6.3+(meatGrams/100)*food.p+(dairyGrams/100)*11+(wheyGrams/100)*80;
 const foodEnergy=eggs*72+(meatGrams/100)*food.kcal+(dairyGrams/100)*100+(wheyGrams/100)*400;
 const diff=proteinTarget-foodProtein,remain=energy-foodEnergy;
 $("calcError").hidden=true;$("calcResults").hidden=false;
 $("energyResult").textContent=nf.format(energy)+" kcal";
 $("proteinResult").textContent=nf.format(proteinTarget)+" g";
 $("foodProteinResult").textContent=n1.format(foodProtein)+" g";
 $("foodEnergyResult").textContent=nf.format(foodEnergy)+" kcal";
 $("energyLeftResult").textContent=nf.format(remain)+" kcal";
 $("proteinLeftResult").textContent=diff>0?"Brakuje ok. "+n1.format(diff)+" g do wybranego celu.":"Wybrany cel został osiągnięty lub przekroczony o "+n1.format(Math.abs(diff))+" g.";
 $("calorieInfo").textContent=remain<0?"Podane produkty przekraczają szacunkowy cel energetyczny. To nie oznacza automatycznie, że przekraczasz rzeczywiste zapotrzebowanie.":"Pozostałe kcal są różnicą między orientacyjnym celem a wpisanymi produktami (bez innych posiłków).";
 $("bmrResult").textContent=nf.format(bmr)+" kcal";
 $("tdeeResult").textContent=nf.format(tdee)+" kcal";
 lastRecord={date:new Date().toLocaleDateString("pl-PL"),weight:weight,calories:energy,protein:proteinTarget,foodProtein:Math.round(foodProtein),foodEnergy:Math.round(foodEnergy)};
 $("saveResult").disabled=false;
 $("calcResults").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"nearest"});
});
$("saveResult").addEventListener("click",()=>{
 if(!lastRecord)return;
 try{const history=JSON.parse(localStorage.getItem(KEY)||"[]");history.unshift(lastRecord);localStorage.setItem(KEY,JSON.stringify(history.slice(0,10)));renderHistory();$("saveInfo").textContent="Zapisano lokalnie w tej przeglądarce."}catch{$("saveInfo").textContent="Nie udało się zapisać lokalnie — sprawdź tryb prywatny lub ustawienia przeglądarki."}
});
$("clearHistory").addEventListener("click",()=>{try{localStorage.removeItem(KEY);lastRecord=null;$("saveInfo").textContent="Historia została wyczyszczona."}catch{$("saveInfo").textContent="Nie można wyczyścić danych w tej przeglądarce."}renderHistory()});
renderHistory();
})();