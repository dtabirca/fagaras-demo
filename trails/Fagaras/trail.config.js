var gpxFile = "./trails/Fagaras/Fagaras.gpx";
var speed = 100;
var showLity = true;
var remarks = 
"<ul>" +
"<li>Water(safe to drink) can be found at km: 2, 11, 23.1, 34.9, 36.9, 40.5, 51.6(50m descend on N), 62(300m descend on S), 64.2, 71.6, 80.8</li>"+
"<li>Passages secured with metal cables at km: 26.4, 28.2, 37.6</li>"+
"<li>Alpine shelters and places suitable to camp: 11, 19.8, 23.2, 29.2, 35, 37.3(descend 200m to S), 38.5, 40.5, 47.4, 51.6, 61.9, 67.5, 76.2</li>"+
"</ul>";
var stopFor = 1;//ms
var showFor = 3000;//ms
var elevAccuracy = 2;
var zoomMap1 = 10;
var zoomMap1Large = 14;
var zoomMap2 = 15;
var zoomMap3 = 14;
var showCheckpointLines = false;
var providerMap1 = 'Esri.WorldImagery';
var providerMap2 = 'HikeBike';
var providerMap3 = 'OpenTopoMap';//'OpenTopoMap';
var trackColor = '#f55442';
var showDiagram = true;
var whereToSpeedUp = 70;//km
var speedUpSpeed = 200;


var media = [
//{'dist': 2.0,'file': 'Fagaras/Crai/1.jpg','time':showFor,'text':''},//Poiana Zănoaga
{'dist': 0.00, 'style':'start', 'time':1000, 'text':'start'},
//{'dist': 2.0, 'style':'spring', 'time':stopFor, 'text':'Izvor'},
{'dist': 3.20,'file': 'Fagaras/1.jpg','time':showFor,'text':'Mănăstirea Turnu Roșu', 'compass':'e'},
{'dist': 10.5,'file': 'Fagaras/2.jpg','time':showFor,'text':'Din Șaua Apa Cumpănită spre Suru', 'compass':'e'},
//{'dist': 11.0, 'style':'spring', 'time':stopFor, 'text':'Izvor'},
{'dist': 18.5,'file': 'Fagaras/3.jpg','time':showFor,'text':'Spre Portița Avrigului, în față Ciortea', 'compass':'se'},
{'dist': 19.2,'file': 'Fagaras/4.jpg','time':showFor,'text':'Șaua Avrig', 'compass':'ne'},
{'dist': 19.9,'file': 'Fagaras/5.jpg','time':showFor,'text':'Lacul Avrig, ieșire spre Bărcaciu', 'compass':'ne'},
{'dist': 19.9, 'style':'spring', 'time':stopFor, 'text':'L.Avrig'},
{'dist': 21.9,'file': 'Fagaras/6.jpg','time':showFor,'text':'Vf.Scara'},
{'dist': 21.9, 'style':'peak', 'time':stopFor, 'text':'Scara'},
{'dist': 23.1, 'style':'shelter', 'time':5000, 'text':'zzz!'},
{'dist': 23.3,'file': 'Fagaras/7.jpg','time':showFor,'text':'Refugiul Șaua Scara', 'compass':'sw'},
{'dist': 25.75,'file': 'Fagaras/9.jpg','time':showFor,'text':'Șerbota'},
//{'dist': 25.75, 'style':'peak', 'time':stopFor, 'text':'Șerbota'},
{'dist': 26.2,'file': 'Fagaras/8.jpg','time':showFor,'text':'Custura Sărății', 'compass':'e'},
{'dist': 26.5,'file': 'Fagaras/54.jpg','time':showFor,'text':'Custura Sărății', 'compass':'w'},
{'dist': 27.65,'file': 'Fagaras/10.jpg','time':showFor,'text':'Negoiu'},
{'dist': 27.65, 'style':'peak', 'time':stopFor, 'text':'Negoiu'},
{'dist': 28.3,'file': 'Fagaras/11.jpg','time':showFor,'text':'Strunga Doamnei', 'compass':'e'},
{'dist': 29.1,'file': 'Fagaras/12.jpg','time':showFor,'text':'L.Calțun', 'compass':'e'},
{'dist': 29.1, 'style':'spring', 'time':stopFor, 'text':'L.Calțun'},
{'dist': 33.9,'file': 'Fagaras/13.jpg','time':showFor,'text':'L.Bâlea', 'compass':'n'},
{'dist': 34.3,'file': 'Fagaras/14.jpg','time':showFor,'text':'L.Capra', 'compass':'e'},
{'dist': 35.0, 'style':'spring', 'time':stopFor, 'text':'L.Capra'},
{'dist': 37.35,'file': 'Fagaras/15.jpg','time':showFor,'text':'Fereastra Zmeilor', 'compass':'e'},

{'dist': 38.1,'file': 'Fagaras/16.jpg','time':showFor,'text':'Arpașul Mic', 'compass':'e'},
{'dist': 38.4, 'style':'shelter', 'time':5000, 'text':'zzz!'},

{'dist': 39.8,'file': 'Fagaras/17.jpg','time':showFor,'text':'Arpașul Mare'},
{'dist': 39.9,'file': 'Fagaras/18.jpg','time':showFor,'text':'Spre Est', 'compass':'e'},
{'dist': 40.5,'file': 'Fagaras/19.jpg','time':showFor,'text':'L.Podul Giurgiului', 'compass':'n'},
{'dist': 40.5, 'style':'spring', 'time':stopFor, 'text':'L.Podul Giurgiului'},
{'dist': 44.3,'file': 'Fagaras/20.jpg','time':showFor,'text':'Spre Viștea-Moldoveanu, în drept cu Ucea', 'compass':'e'},
{'dist': 46.3,'file': 'Fagaras/22.jpeg','time':showFor,'text':'Moldoveanu'},
{'dist': 46.3, 'style':'peak', 'time':stopFor, 'text':'Moldoveanu'},
{'dist': 46.4,'file': 'Fagaras/21.jpg','time':showFor,'text':'Vedere spre Vest', 'compass': 'w'},

{'dist': 46.9,'file': 'Fagaras/46.jpg','time':showFor,'text':'Portița Viștei, Hârtopul Ursului', 'compass':'e'},
{'dist': 47.0,'file': 'Fagaras/47.jpg','time':showFor, 'text':'','compass':'n'},
{'dist': 47.5,'file': 'Fagaras/50.jpg','time':showFor, 'text': 'Victoria','compass':'n'},
{'dist': 48.0,'file': 'Fagaras/44.jpg','time':showFor,'text':'Moldoveanu, Tăul Triunghiular', 'compass':'w'},
{'dist': 48.0,'file': 'Fagaras/45.jpg','time':showFor,'text':'Moldoveanu', 'compass':'w'},

{'dist': 49.0,'file': 'Fagaras/43.jpg','time':showFor,'text':'Gălășescu Mare', 'compass':'e'},
{'dist': 49.3,'file': 'Fagaras/42.jpg','time':showFor,'text':'L.Viștișoara', 'compass':'n'},
{'dist': 49.5,'file': 'Fagaras/24.jpeg','time':showFor,'text':'L.Gălășescu, Galbenele', 'compass':'w'},

{'dist': 51.2,'file': 'Fagaras/23.jpg','time':showFor,'text':'Fereastra Mică a Sâmbetei, Colțul Bălăceni', 'compass':'sw'},

{'dist': 55.6, 'style':'peak', 'time':stopFor, 'text':'Urlea'},

{'dist': 57.3,'file': 'Fagaras/99.jpg','time':showFor,'text':'L.Urlea', 'compass':'se'},
{'dist': 57.4,'file': 'Fagaras/28.jpg','time':showFor,'text':'Vf.Iezer', 'compass':'nw'},
{'dist': 59.5,'file': 'Fagaras/29.jpg','time':showFor,'text':'L.Zârna', 'compass':'e'},
{'dist': 61.8, 'style':'shelter', 'time':5000, 'text':'zzz!'},

{'dist': 61.9,'file': 'Fagaras/31.jpg','time':showFor,'text':'Ref.Zârna', 'compass':'w'},
{'dist': 67.3,'file': 'Fagaras/33.jpg','time':showFor,'text':'Curmătura Bratilei', 'compass':'e'},
{'dist': 67.5,'file': 'Fagaras/35.jpeg','time':showFor,'text':'Curmătura Bratilei'},
{'dist': 61.8, 'style':'shelter', 'time':5000, 'text':'zzz!'},
{'dist': 75.3,'file': 'Fagaras/34.jpg','time':showFor,'text':'Barajul Pecineagu, Piatra Craiului', 'compass':'se'},
{'dist': 77.1,'file': 'Fagaras/36.jpeg','time':showFor,'text':''},
{'dist': 78.0,'file': 'Fagaras/37.jpg','time':showFor,'text':'','compass':'e'},
{'dist': 80.5,'file': 'Fagaras/38.jpg','time':showFor,'text':'','compass':'n'},
{'dist': 91.0,'file': 'Fagaras/39.jpg','time':showFor,'text':'','compass':'e'},
{'dist': 92.2, 'style':'end', 'time':stopFor, 'text':'end'},
];