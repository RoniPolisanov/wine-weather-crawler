import requests  # to process the request in a get method via the API
import json

with open('country-code.json', 'r', encoding="utf8") as f:  # open cityID json file and read it
    countryData = json.load(f)  # load its content to 'countryData'
f.close()

with open('../wine/data.json', 'r', encoding="utf8") as w:  # open wineData json file and read it
    wineData = json.load(w)  # load its content to 'wineData'

data2file = open("../data2.json", "w+")  # create a data2 file

obj_json = {
    'country': '',
    'temperature': '',
    'humidity': ''
}

total_units = []
total_c = 0.0
total_h = 0.0
countries = set([])

# get all countries from wineData
for wineCat in wineData:
    for wineBottle in wineData[wineCat]:
        temp = wineBottle['Made in:']
        if temp.find(',') != -1:
            temp = temp.split(", ")
            countries.add(temp[1])
            wineBottle['Made in:'] = temp[1]
        else:
            countries.add(temp)
            wineBottle['Made in:'] = temp

print(countries)
dates = {'January': '1546117955', 'April': '1523646589', 'June': '1528916989', 'October': '1542136189'}  # 4 seasons in UNIX time
for country in countries:  # for each country to search
    for dict in countryData:  # search in the json data for it
        if dict['name'] == country:
            countryID = str(dict['id'])  # get the country ID
            countryLat = str(dict['coord']['lat'])  # get the country Latitude
            countryLong = str(dict['coord']['lon'])  # get the country Longtitude
    
    # https://api.darksky.net/forecast/[key]/[latitude],[longitude],[time]
    for date in dates:  # for each of the 4 seasons, get the temperature and humidity
        r = requests.get('https://api.darksky.net/forecast/74d59df3c9b5855fa493fcf14107d178/'+countryLat+','+countryLong+','+dates[date])
        json_object = r.json()  # save it as a json object
        temp_c = ((json_object['currently']['temperature'] - 32) * (5 / 9))  # take the degress (supplied in fahrenheit) and convert them to celcious
        temp_h = json_object['daily']['data'][0]['humidity']  # take the humidity
        total_c += temp_c
        total_h += temp_h

    obj_json = {'country': country, 'temperature': (total_c / 4), 'humidity': (total_h / 4)}  # build the object
    total_c = 0.0
    total_h = 0.0
    total_units.append(obj_json)
    print('********************')
    print('inserted value for: ')
    print(obj_json)
    print('********************')

for wineCat in wineData:
    for wineBottle in wineData[wineCat]:
        for wine in list(wineBottle):
            if wine == 'Varietal:' or wine == 'Style:' or wine == 'Sweetness Descriptor:' or wine == 'By:' or wine == 'Description:'  or wine == 'Description' or wine == 'This is a VQA wine':
                del wineBottle[wine]
        for units in total_units:
            if units['country'] == wineBottle['Made in:']:
                wineBottle['AvgTemperature'] = units['temperature']
                wineBottle['AvgHumidity'] = units['humidity']

json.dump(wineData, data2file)  # write the data2 to the file
data2file.close()  # close the data2 file
print('Done')
