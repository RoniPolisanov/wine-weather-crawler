import requests  # to process the request in a get method via the API
import json
from pprint import pprint

with open('city.list.json', 'r') as f:  # open cityID json file and read it
    cityData = json.load(f)  # load its content to 'cityData'
f.close()

with open('data.json', 'r') as w:  # open wineData json file and read it
    wineData = json.load(w)  # load its content to 'wineData'

data2file = open("data2.json", "w+")  # create a data2 file

obj_json = {
    'city': '',
    'Temperature': '',
    'Humidity': ''
}

total_units = []
total_c = 0.0
total_h = 0.0
cities = set([])

# get all cities from wineData
for wineCat in wineData:
    for wineBottle in wineData[wineCat]:
        temp = wineBottle['Made in:']
        if temp.find(',') != -1:
            temp = temp.split(", ")
            cities.add(temp[1])
            wineBottle['Made in:'] = temp[1]
        else:
            cities.add(temp)
            wineBottle['Made in:'] = temp


dates = {'January': '1515870589', 'April': '1523646589', 'June': '1528916989',
         'October': '1542136189'}  # 4 seasons in UNIX time
for city in cities:  # for each city to search
    for dict in cityData:  # search in the json data for it
        if dict['name'] == city:
            cityID = str(dict['id'])  # get the city ID
            cityLat = str(dict['coord']['lat'])  # get the city Latitude
            cityLong = str(dict['coord']['lon'])  # get the city Longtitude

    # https://api.darksky.net/forecast/[key]/[latitude],[longitude],[time]
    for date in dates:  # for each of the 4 seasons, get the temperature and humidity
        r = requests.get(
            'https://api.darksky.net/forecast/74d59df3c9b5855fa493fcf14107d178/' + cityLat + ',' + cityLong + ',' +
            dates[date])
        json_object = r.json()  # save it as a json object
        # print(json_object)
        temp_c = ((json_object['currently']['temperature'] - 32) * (
                    5 / 9))  # take the degress (supplied in fahrenheit) and convert them to celcious
        temp_h = json_object['daily']['data'][0]['humidity']  # take the humidity
        total_c += temp_c
        total_h += temp_h

    obj_json = {'city': city, 'Temperature': (total_c / 4), 'Humidity': (total_h / 4)}  # build the object
    total_c = 0.0
    total_h = 0.0
    total_units.append(obj_json)
    print('inserted value for: ')
    print(obj_json)

for wineCat in wineData:
    for wineBottle in wineData[wineCat]:
        for wine in list(wineBottle):
            if wine == 'Varietal:' or wine == 'Style:' or wine == 'Sweetness Descriptor:' or wine == 'By:' or wine == 'Description:':
                del wineBottle[wine]
        for units in total_units:
            if units['city'] == wineBottle['Made in:']:
                wineBottle['AvgTemperature'] = units['Temperature']
                wineBottle['AvgHumidity'] = units['Humidity']

json.dump(wineData, data2file)  # write the data2 to the file
data2file.close()  # close the data2 file
print('Done')
