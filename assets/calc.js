// Polish Biohacker — energy + protein calculator with manual Huawei Watch data.
// Estimates only: wearables do not directly measure daily energy expenditure.
(()=>{
"use strict";
const form=document.getElementById("calcForm");if(!form)return;
const $=id=>document.getElementById(id);
const nf=new Intl.NumberFormat("pl-PL",{maximumFractionDigits:0});
const n1=new Intl.NumberFormat("pl-PL",{maximumFractionDigits:1});
const KEY="polish-biohacker-calculator-history-v1";
const foodDefaults={
 beefLean:{p:20,kcal:165},beefFat:{p:18,kcal:250},
 beefCooked:{p:26,kcal:250},chicken:{p:23,kcal:120},pork:{p:21,kcal:190}
};
const n=id=>{const raw=$(id).value.trim();return raw===""?NaN:Number(raw)};
const valid=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max;
const text=(id,value)=>{$(id).textContent=value};
function fail(message){
 text("calcError",message);
 $("calcError").hidden=false;
 $("calcResults").hidden=true;
 $("saveResult").disabled=true;
 lastRecord=null;
}
function updateWatchUI(){
 const watch=$("energyMode").value==="watch";
 const mode=$("watchInputMode").value;
 $("watchPanel").hidden=!watch;
 $("activityField").hidden=watch;
 $("watchTotalField").hidden=!watch||mode!=="total";
 $("watchRestField").hidden=!watch||mode!=="split";
 $("watchActiveField").hidden=!watch||mode==="total";
 $("calcResults").hidden=true;
 $("calcError").hidden=true;
 $("saveResult").disabled=true;
 lastRecord=null;
}
$("energyMode").addEventListener("change",updateWatchUI);
$("watchInputMode").addEventListener("change",updateWatchUI);
updateWatchUI();
let lastRecord=null;
function renderHistory(){
 const holder=$("history");
 let history=[];
 try{
  history=JSON.parse(localStorage.getItem(KEY)||"[]");
  if(!Array.isArray(history))history=[];
 }catch{}
 holder.replaceChildren();
 if(!history.length){holder.textContent="Brak zapisanych obliczeń na tym urządzeniu.";return;}
 for(const record of history.slice(0,10)){
  const p=document.createElement("p");
  p.className="mini";
  const basis=record.source==="watch"?"Huawei Watch":"Wzór";
  const steps=Number.isFinite(record.steps)?" · "+nf.format(record.steps)+" kroków":"";
  const balance=Number.isFinite(record.balance)?" · bilans "+(record.balance>0?"+":"")+nf.format(record.balance)+" kcal":"";
  p.textContent=record.date+" · "+basis+" · "+record.weight+" kg · cel "+nf.format(record.calories)+" kcal · "+record.protein+" g białka"+steps+balance;
  holder.appendChild(p);
 }
}
form.addEventListener("submit",event=>{
 event.preventDefault();
 const weight=n("weight"),height=n("height"),age=n("age"),proteinPerKg=n("proteinFactor");
 const eggs=n("eggs"),meat=n("meat"),dairy=n("dairy"),whey=n("whey");
 const otherKcal=n("otherKcal"),otherProtein=n("otherProtein");
 if(!valid(weight,30,300)||!valid(height,120,230)||!valid(age,16,100)){
  fail("Sprawdź masę ciała (30–300 kg), wzrost (120–230 cm) i wiek (16–100 lat).");return;
 }
 if(!valid(proteinPerKg,1,3)){fail("Wpisz cel białka od 1 do 3 g/kg.");return;}
 if(![eggs,meat,dairy,whey,otherKcal,otherProtein].every((x,i)=>valid(x,0,[50,3000,3000,500,15000,700][i]))||!Number.isInteger(eggs)){
  fail("Podaj nieujemne ilości jedzenia. Jeżeli czegoś nie jesz, wpisz 0. Jajka powinny być liczbą całkowitą.");return;
 }
 const sex=$("sex").value;
 const bmr=10*weight+6.25*height-5*age+(sex==="male"?5:-161);
 const activity=Number($("activity").value);
 const mode=$("energyMode").value, watch=mode==="watch";
 const goal=$("goal").value;
 const factor=goal==="cut"?0.85:goal==="bulk"?1.08:1;
 const period=watch?$("watchPeriod").value:"complete";
 let expenditure=NaN, basis="Model Mifflina–St Jeora × współczynnik aktywności",steps=null;
 if(!watch){
  expenditure=bmr*activity;
 }else{
  const inputMode=$("watchInputMode").value;
  const stepsRaw=$("watchSteps").value.trim();
  if(stepsRaw!==""){
   steps=n("watchSteps");
   if(!valid(steps,0,100000)||!Number.isInteger(steps)){fail("Liczba kroków musi być liczbą całkowitą od 0 do 100 000.");return;}
  }
  if(inputMode==="total"){
   const value=n("watchTotal");
   if(!valid(value,100,15000)){fail("Wpisz całkowite kalorie z pola Burned / Total (100–15 000 kcal).");return;}
   expenditure=value;
   basis="Huawei Stay Fit: całkowite spalone kalorie (Burned / Total)";
  }else if(inputMode==="split"){
   const rest=n("watchRest"),active=n("watchActive");
   if(!valid(rest,100,6000)||!valid(active,0,10000)||rest+active>15000){
    fail("Wpisz poprawne Resting (100–6000 kcal) i Active (0–10 000 kcal).");return;
   }
   expenditure=rest+active;
   basis="Huawei Stay Fit: Resting + Active";
  }else if(inputMode==="active"){
   if(period!=="complete"){
    fail("Dla trwającego dnia użyj wartości Burned / Total albo Resting + Active. Oszacowane pełnodobowe BMR nie pasuje do części dnia.");return;
   }
   const active=n("watchActive");
   if(!valid(active,0,10000)||active+bmr>15000){
    fail("Wpisz poprawne aktywne kalorie z Huawei (0–10 000 kcal).");return;
   }
   expenditure=active+bmr;
   basis="Huawei Active + oszacowane BMR (mniej dokładne, nie odczyt pełnego spalania)";
  }else{fail("Wybierz sposób wpisania danych Huawei.");return;}
 }
 const proteinTarget=Math.round(weight*proteinPerKg);
 const food=foodDefaults[$("meatType").value]||foodDefaults.beefLean;
 const foodProtein=eggs*6.3+(meat/100)*food.p+(dairy/100)*11+(whey/100)*80+otherProtein;
 const foodEnergy=eggs*72+(meat/100)*food.kcal+(dairy/100)*100+(whey/100)*400+otherKcal;
 const balance=foodEnergy-expenditure;
 const complete=period==="complete";
 const target=complete?Math.round(expenditure*factor):null;
 const remaining=target===null?null:target-foodEnergy;
 text("resultModeLabel",complete?"Orientacyjny cel spożycia na pełny dzień":"Dzień w trakcie — bilans do obecnej chwili");
 text("energyResult",target===null?"Nie wyznaczono celu dobowego":nf.format(target)+" kcal");
 text("burnBasis",basis+(watch?" · Dane wpisane ręcznie":""));
 text("burnResult",nf.format(expenditure)+" kcal");
 text("actualBalanceResult",(balance>0?"+":"")+nf.format(balance)+" kcal"+(balance<0?" (ujemny)":balance>0?" (dodatni)":" (zero)"));
 text("proteinResult",nf.format(proteinTarget)+" g");
 text("foodProteinResult",n1.format(foodProtein)+" g");
 text("foodEnergyResult",nf.format(foodEnergy)+" kcal");
 text("energyLeftResult",remaining===null?"— (dzień w trakcie)":(remaining>0?"+":"")+nf.format(remaining)+" kcal");
 const missing=proteinTarget-foodProtein;
 text("proteinLeftResult",missing>0?"Brakuje ok. "+n1.format(missing)+" g do zadanego celu białka.":"Cel białka osiągnięty lub przekroczony o "+n1.format(Math.abs(missing))+" g.");
 const caveat="To szacunek. Poprawna ocena deficytu/nadwyżki wymaga wpisania całego spożycia z tego samego okresu oraz uwzględnienia błędów zegarka i etykiet.";
 text("calorieInfo",!complete?"Dzień jeszcze trwa: "+nf.format(expenditure)+" kcal to odczyt do obecnej chwili, a nie pełny wydatek dobowy. Bilansu nie interpretuj jako końcowego deficytu ani nadwyżki. "+caveat:
 (balance<0?"Z wpisanych danych wynika ujemny bilans (orientacyjny deficyt). ":balance>0?"Z wpisanych danych wynika dodatni bilans (orientacyjna nadwyżka). ":"Wpisana energia i wydatek są zbliżone. ")+caveat);
 text("bmrResult",nf.format(bmr)+" kcal");
 text("tdeeResult",nf.format(expenditure)+" kcal");
 $("calcError").hidden=true;
 $("calcResults").hidden=false;
 lastRecord={date:new Date().toLocaleDateString("pl-PL"),source:watch?"watch":"formula",weight,calories:target===null?Math.round(expenditure):target,protein:proteinTarget,foodProtein:Math.round(foodProtein),foodEnergy:Math.round(foodEnergy),balance:Math.round(balance),steps};
 $("saveResult").disabled=false;
 $("saveInfo").textContent="";
 $("calcResults").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"nearest"});
});
$("saveResult").addEventListener("click",()=>{
 if(!lastRecord)return;
 try{
  let history=JSON.parse(localStorage.getItem(KEY)||"[]");
  if(!Array.isArray(history))history=[];
  history.unshift(lastRecord);
  localStorage.setItem(KEY,JSON.stringify(history.slice(0,10)));
  renderHistory();
  $("saveInfo").textContent="Zapisano wyłącznie na tym urządzeniu.";
 }catch{
  $("saveInfo").textContent="Zapis nie jest dostępny — sprawdź ustawienia prywatności przeglądarki.";
 }
});
$("clearHistory").addEventListener("click",()=>{
 try{localStorage.removeItem(KEY);$("saveInfo").textContent="Historia została wyczyszczona.";}
 catch{$("saveInfo").textContent="Nie udało się wyczyścić historii.";}
 lastRecord=null;
 renderHistory();
});
renderHistory();
})();